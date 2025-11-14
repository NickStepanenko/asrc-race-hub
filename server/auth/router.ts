import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import type { RequestHandler } from 'express';

const router = Router();
const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

const sign = (payload: any, ttl: any, secret: any) =>
  jwt.sign(payload, secret, { expiresIn: ttl });

const setAuthCookies = (res: any, refreshToken: any) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email taken' });

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, password: hashed, name } });

  const access = sign({ sub: user.id }, ACCESS_TTL, process.env.JWT_SECRET!);
  const refresh = sign({ sub: user.id }, REFRESH_TTL, process.env.JWT_REFRESH_SECRET!);
  setAuthCookies(res, refresh);
  return res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken: access });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const access = sign({ sub: user.id }, ACCESS_TTL, process.env.JWT_SECRET!);
  const refresh = sign({ sub: user.id }, REFRESH_TTL, process.env.JWT_REFRESH_SECRET!);
  setAuthCookies(res, refresh);
  return res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken: access });
});

const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.sendStatus(401);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as unknown as Express.AuthPayload;
    next();
  } catch {
    res.sendStatus(401);
  }
};

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req?.user?.sub) } });
  res.json({ user: { id: user?.id, email: user?.email, name: user?.name } });
});

router.post('/logout', (_req, res) => {
  res.clearCookie('refreshToken');
  res.sendStatus(204);
});

export default router;
