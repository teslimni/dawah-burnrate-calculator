import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const user = getUserFromRequest(req)
  if (!user || user.email !== 'youremail@admin.com') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const current = await prisma.setting.findFirst()
  let updated
  if (!current) {
    updated = await prisma.setting.create({ data: { recaptcha_enabled: true } })
  } else {
    updated = await prisma.setting.update({
      where: { id: current.id },
      data: { recaptcha_enabled: !current.recaptcha_enabled },
    })
  }

  res.status(200).json({ recaptchaEnabled: updated.recaptcha_enabled })
}
