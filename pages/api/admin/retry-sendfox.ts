import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Missing email' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  try {
    const response = await fetch('https://api.sendfox.com/your-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SENDFOX_API_TOKEN}`,
      },
      body: JSON.stringify({ email: user.email, first_name: user.name }),
    });

    if (!response.ok) {
      const error = await response.json();
      await prisma.user.update({
        where: { email },
        data: {
          sendfoxStatus: 'failed',
          sendfoxError: JSON.stringify(error),
        },
      });
      return res.status(500).json({ message: 'Retry failed', error });
    }

    await prisma.user.update({
      where: { email },
      data: {
        sendfoxStatus: 'success',
        sendfoxError: null,
      },
    });

    res.redirect('/admin/sendfox');
  } catch (err) {
    await prisma.user.update({
      where: { email },
      data: {
        sendfoxStatus: 'failed',
        sendfoxError: JSON.stringify(err),
      },
    });
    res.status(500).json({ message: 'Network error', error: err });
  }
}
