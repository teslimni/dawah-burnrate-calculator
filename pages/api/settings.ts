import type { NextApiRequest, NextApiResponse } from 'next'
import { isRecaptchaEnabled } from '@/lib/settings'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).end()

  const recaptchaEnabled = await isRecaptchaEnabled()
  res.status(200).json({ recaptchaEnabled })
}
