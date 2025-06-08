import { prisma } from './prisma'

export async function isRecaptchaEnabled(): Promise<boolean> {
  const setting = await prisma.setting.findFirst()
  return setting?.recaptcha_enabled ?? false
}
