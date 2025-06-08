import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req)
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'GET') {
    const items = await prisma.burnItem.findMany({ where: { userId: user.id } })
    return res.status(200).json(items)
  }

  if (req.method === 'POST') {
    const { label, category, value } = req.body
    if (!label || !category || typeof value !== 'number') {
      return res.status(400).json({ message: 'Missing fields' })
    }
    const item = await prisma.burnItem.create({
      data: { label, category, value, userId: user.id },
    })
    return res.status(201).json(item)
  }

  if (req.method === 'PUT') {
    const { id, label, category, value } = req.body
    const item = await prisma.burnItem.update({
      where: { id },
      data: { label, category, value },
    })
    return res.status(200).json(item)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    await prisma.burnItem.delete({ where: { id } })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  res.status(405).end('Method Not Allowed')
}
