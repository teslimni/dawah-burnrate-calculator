import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { isRecaptchaEnabled } from '@/lib/settings';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { name, email, password, gdprConsented, recaptchaToken } = req.body;


  if (!name || !email || !password || gdprConsented !== true) {
    return res.status(400).json({ message: 'Missing required fields or GDPR consent not given.' });
  }

  try {
    if (await isRecaptchaEnabled()) {
      if (!recaptchaToken) {
        return res.status(400).json({ message: 'Missing captcha token' })
      }
      const verify = await fetch(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        }
      )
      const data = await verify.json()
      if (!data.success) {
        return res.status(400).json({ message: 'Invalid captcha' })
      }
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
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
