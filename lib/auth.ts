import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';

export type DecodedUser = {
  id: string;
  email: string;
};

export function getUserFromRequest(req: IncomingMessage): DecodedUser | null {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token || null;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    return decoded;
  } catch (err) {
    console.error('Invalid or expired JWT:', err);
    return null;
  }
}
