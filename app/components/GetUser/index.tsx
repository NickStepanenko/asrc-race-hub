import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { User } from '@/types';

export default async function GetUserRole(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  let user = null;

  try {
    user = jwt.verify(token || "", process.env.JWT_SECRET!) as JwtPayload & User;
  }
  catch (err) {
  }

  return user
}
