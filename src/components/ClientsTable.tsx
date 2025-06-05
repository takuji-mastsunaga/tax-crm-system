'use client'

import { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { auth } from '@/app/auth'
import { useSession } from 'next-auth/react'

interface Client {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  taxId: string
  contractDate: Date
  status: 'active' | 'pending' | 'inactive'
  notes: string
}

export default function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'clients'),
      orderBy('contractDate', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const clientsData: Client[] = []
        querySnapshot.forEach((doc) => {
          clientsData.push({
            id: doc.id,
            ...doc.data(),
            contractDate: doc.data().contractDate?.toDate() || new Date()
          } as Client)
        })
        setClients(clientsData)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error('Firestore error:', error)
        setError('データの取得に失敗しました。')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [session])

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">データを読み込み中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">データが見つかりません。</p>
        <p className="text-sm text-gray-500 mt-2">
          セキュリティルールにより、@your-company.com ドメインのメールアドレスでログインした場合のみデータが表示されます。
        </p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800'
    }
    const statusText = {
      active: '稼働中',
      pending: '検討中',
      inactive: '停止中'
    }
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusMap[status as keyof typeof statusMap]}`}>
        {statusText[status as keyof typeof statusText]}
      </span>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              会社名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              担当者
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              連絡先
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ステータス
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              契約日
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              備考
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{client.companyName}</div>
                <div className="text-sm text-gray-500">{client.taxId}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{client.contactPerson}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{client.email}</div>
                <div className="text-sm text-gray-500">{client.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(client.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {client.contractDate.toLocaleDateString('ja-JP')}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">{client.notes}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 