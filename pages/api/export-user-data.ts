import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req)
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser) return res.status(404).json({ message: 'User not found' })

    const { passwordHash, ...exportData } = dbUser as any

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', 'attachment; filename="user-data.json"')
    return res.status(200).send(JSON.stringify(exportData, null, 2))
  } catch (err) {
    console.error('Error exporting user data:', err)
    return res.status(500).json({ message: 'Failed to export data' })
  }
}
