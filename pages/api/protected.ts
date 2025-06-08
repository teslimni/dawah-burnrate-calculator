import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  return res.status(200).json({ message: `Welcome ${user.email}, this is a protected route.` });
}
