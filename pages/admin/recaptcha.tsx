import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { useState } from 'react'

const RecaptchaAdmin = ({ enabled }) => {
  const [status, setStatus] = useState(enabled)

  const toggle = async () => {
    const res = await fetch('/api/admin/toggle-recaptcha', { method: 'POST' })
    const data = await res.json()
    setStatus(data.recaptchaEnabled)
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">reCAPTCHA Setting</h1>
      <p>reCAPTCHA is {status ? 'enabled' : 'disabled'}</p>
      <button
        onClick={toggle}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Toggle
      </button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = getUserFromRequest(req)
  if (!user || user.email !== 'youremail@admin.com') {
    return { redirect: { destination: '/', permanent: false } }
  }

  const setting = await prisma.setting.findFirst()
  return { props: { enabled: setting?.recaptcha_enabled ?? false } }
}

export default RecaptchaAdmin
