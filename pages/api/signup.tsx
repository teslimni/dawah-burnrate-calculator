import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { name, email, password, gdprConsented, referralCode } = req.body;


  if (!name || !email || !password || gdprConsented !== true) {
    return res.status(400).json({ message: 'Missing required fields or GDPR consent not given.' });
  }

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    let referredById: string | null = null;
    if (referralCode) {
      const ref = await prisma.referral.findUnique({ where: { referralCode } });
      if (ref) {
        referredById = ref.userId;
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        gdprConsented,
        emailConfirmed: false,
      },
    });

    const newReferralCode = randomBytes(4).toString('hex');
    await prisma.referral.create({
      data: {
        userId: newUser.id,
        referralCode: newReferralCode,
        referredUserId: referredById,
      },
    });

    // 🔗 Send data to SendFox API
    const sendToSendFox = async () => {
      try {
        const res = await fetch('https://api.sendfox.com/your-endpoint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SENDFOX_API_TOKEN}`,
          },
          body: JSON.stringify({ email, first_name: name }),
        });
    
        if (!res.ok) {
          const errorData = await res.json();
          console.warn('⚠️ First SendFox attempt failed:', errorData);
    
          await prisma.user.update({
            where: { email },
            data: {
              sendfoxStatus: 'failed',
              sendfoxError: JSON.stringify(errorData),
            },
          });
    
          return;
        }
    
        await prisma.user.update({
          where: { email },
          data: { sendfoxStatus: 'success', sendfoxError: null },
        });
      } catch (err) {
        console.error('🚨 SendFox network error:', err);
    
        await prisma.user.update({
          where: { email },
          data: {
            sendfoxStatus: 'failed',
            sendfoxError: JSON.stringify(err),
          },
        });
      }
    };
    await sendToSendFox();

    return res.status(201).json({ message: 'User created successfully', userId: newUser.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error. Could not create account.' });
  }
}
