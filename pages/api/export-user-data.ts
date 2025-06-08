import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const decodedUser = getUserFromRequest(req);

  if (!decodedUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: decodedUser.id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { passwordHash, ...data } = user as any;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="user-data.json"'
    );
    res.status(200).send(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error exporting user data:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
