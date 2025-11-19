import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

export default async function GetUserRole(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  let userRole = "";

  try {
    const decoded = jwt.verify(token || "", process.env.JWT_SECRET!) as JwtPayload & { role?: string };
    userRole = decoded?.role || "";
  }
  catch {}

  return userRole
}
