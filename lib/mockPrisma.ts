import fs from 'fs'
import path from 'path'

type User = {
  id: string
  name: string
  email: string
  passwordHash: string
  emailConfirmed: boolean
  gdprConsented: boolean
  sendfoxStatus: string
  sendfoxError: string | null
  createdAt: string
}

const DB_FILE = path.join(process.cwd(), 'mock-db.json')

function load(): User[] {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) as User[]
  } catch {
    return []
  }
}

function save(data: User[]) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

export class MockPrisma {
  private users: User[] = load()

  user = {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      return (
        this.users.find((u) =>
          where.email ? u.email === where.email : u.id === where.id
        ) || null
      )
    },
    create: async ({ data }: { data: Omit<User, 'id' | 'createdAt'> }) => {
      const user: User = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      this.users.push(user)
      save(this.users)
      return user
    },
    update: async ({ where, data }: { where: { email?: string; id?: string }; data: Partial<User> }) => {
      const user = this.users.find((u) =>
        where.email ? u.email === where.email : u.id === where.id
      )
      if (!user) throw new Error('User not found')
      Object.assign(user, data)
      save(this.users)
      return user
    },
  }
}
