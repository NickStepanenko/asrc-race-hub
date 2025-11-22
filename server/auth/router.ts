import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import type { RequestHandler, Response } from 'express';
import { User } from '@/types';
import rateLimit from 'express-rate-limit';
import { mailer } from './mailer';

const requestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, error: 'Too many reset requests. Try again later.' },
});

const router = Router();
const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

type UserPayload = {
  sub: number,
  role?: string,
  email?: string,
  name?: string,
}

const sign = (payload: UserPayload, ttl: jwt.SignOptions['expiresIn'], secret: string) =>
  jwt.sign(payload, secret, { expiresIn: ttl });

const setAuthCookies = (res: Response, token: string, key: string) => {
  res.cookie(key, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

router.post('/register', requestLimiter, async (req, res) => {
  const { email, password, name } = req.body;
  if (!email) return res.status(400).json({ status: 400, error: 'Email is required' });
  if (!name) return res.status(400).json({ status: 400, error: 'Name is required' });

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { name }] },
  });
  if (existing?.email === email) return res.status(409).json({ status: 409, error: 'Email taken' });
  if (existing?.name === name) return res.status(409).json({ status: 409, error: 'Name taken' });

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, password: hashed, name, role: "NOT_CONFIRMED" } });

  const access = sign({ sub: user.id, role: user.role, email: user.email, name: user.name }, ACCESS_TTL, process.env.JWT_SECRET!);
  const refresh = sign({ sub: user.id }, REFRESH_TTL, process.env.JWT_REFRESH_SECRET!);
  setAuthCookies(res, access, "accessToken");
  setAuthCookies(res, refresh, "refreshToken");
  return res.json({ status: 200, user: { id: user.id, email: user.email, name: user.name }, accessToken: access });
});

router.post('/login', requestLimiter, async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findFirst({
    where: { name: username },
  });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ status: 401, error: 'Invalid credentials' });

  const access = sign({ sub: user.id, role: user.role, email: user.email, name: user.name }, ACCESS_TTL, process.env.JWT_SECRET!);
  const refresh = sign({ sub: user.id }, REFRESH_TTL, process.env.JWT_REFRESH_SECRET!);
  setAuthCookies(res, access, "accessToken");
  setAuthCookies(res, refresh, "refreshToken");
  return res.json({ status: 200, user: { id: user.id, email: user.email, name: user.name }, accessToken: access });
});

const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.sendStatus(200);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as unknown as Express.AuthPayload;
    next();
  }
  catch {
    res.sendStatus(401);
  }
};

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req?.user?.sub } });
  res.json({ user: { id: user?.id, email: user?.email, name: user?.name, role: user?.role } });
});

router.post('/logout', (_req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.sendStatus(204);
});

const sendPasswordReset = async (user: User) => {
  const tokenHash = require('crypto').randomBytes(48).toString('hex');
  const curTime = new Date();
  curTime.setTime(curTime.getTime() + 1800000);

  await prisma.$transaction(async (tx) => {
    return await tx.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: curTime,
      },
    });
  });

  const resetUrl = `${process.env.PASSWORD_RESET_URL}?token=${encodeURIComponent(tokenHash)}`;
  const emailSent = await mailer.sendMail({
    from: process.env.MAIL_FROM,
    to: user.email,
    subject: 'Link to reset your password - Advanced Simulation Modding Team',
    text: `Hi ${user.name},\n\nClick this link to reset your password: ${resetUrl}\nIt expires in 30 minutes.`,
    html: `<p>Hi ${user.name},</p><p><a href="${resetUrl}">Reset your password</a> (expires in 30 minutes).</p>`,
  });
  console.log(emailSent);
}

router.post('/password/request', requestLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = await prisma.user.findUnique({ where: { email } }) as User;
  if (user) await sendPasswordReset(user);
  else return res.status(401).json({ error: 'Email have not found' });

  return res.sendStatus(204);
});

router.post('/password/reset', async (req, res) => {
  const { token, password, email } = req.body;
  if (!token || !password || !email) return res.status(400).json({ error: 'Invalid data' });

  const user = await prisma.user.findUnique({ where: { email } }) as User;
  if (user) {
    const record = await prisma.passwordResetToken.findFirst({ where: { AND: [{ usedAt: null }, { userId: user.id }] } });

    if (!record || !(await bcrypt.compare(token, record.tokenHash)) || record.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(password, 12) } }),
      prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ]);
  }

  res.sendStatus(204);
});

export default router;
