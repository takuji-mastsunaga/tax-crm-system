'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import EmployeeDashboard from '@/components/EmployeeDashboard'

export default function EmployeeDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // まだロード中

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // 許可されたアドレスまたはドメインかチェック
    const userEmail = session.user?.email
    const allowedEmails = [
      'tackjioffice@gmail.com',
      't7810164825837@gmail.com'
    ]
    const allowedDomains = ['solvis-group.com']

    const isAllowedEmail = allowedEmails.includes(userEmail || '')
    const isAllowedDomain = allowedDomains.some(domain => 
      userEmail?.endsWith(`@${domain}`)
    )

    if (!isAllowedEmail && !isAllowedDomain) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return <EmployeeDashboard />
}