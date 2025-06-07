'use client'

import { useState, useEffect } from 'react'

interface WorkLogFormProps {
  employeeId: string
  onClose: () => void
  onSuccess: () => void
  initialDate?: string
}

interface Client {
  id: string
  clientNumber: string
  companyName: string
}

export default function WorkLogForm({ employeeId, onClose, onSuccess, initialDate }: WorkLogFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [formData, setFormData] = useState({
    clientId: '',
    date: initialDate || new Date().toISOString().split('T')[0],
    workDescription: '',
    hours: 0.25,
    billable: true,
    category: 'client-work' as const
  })

  // 顧客一覧を取得
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/tax-clients')
        if (response.ok) {
          const data = await response.json()
          if (data.clients) {
            setClients(data.clients)
          }
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
      }
    }

    fetchClients()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : name === 'hours' 
          ? Number(value) 
          : name === 'billable'
            ? value === 'true'
            : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/work-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          ...formData
        }),
      })

      if (response.ok) {
        alert('工数記録が保存されました。')
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        alert(error.error || '工数記録の保存に失敗しました。')
      }
    } catch (error) {
      console.error('Error creating work log:', error)
      alert('システムエラーが発生しました。')
    } finally {
      setIsLoading(false)
    }
  }

  const hourOptions = []
  for (let i = 0.25; i <= 12; i += 0.25) {
    hourOptions.push(i)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">工数記録</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* 日付 */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              作業日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* カテゴリ */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              作業カテゴリ <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="client-work">顧客業務</option>
              <option value="internal">社内業務</option>
              <option value="training">研修・勉強</option>
              <option value="meeting">会議</option>
              <option value="other">その他</option>
            </select>
          </div>

          {/* 顧客選択（顧客業務の場合のみ） */}
          {formData.category === 'client-work' && (
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
                顧客
              </label>
              <select
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">顧客を選択してください</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientNumber} - {client.companyName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 作業内容 */}
          <div>
            <label htmlFor="workDescription" className="block text-sm font-medium text-gray-700 mb-1">
              作業内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="workDescription"
              name="workDescription"
              required
              rows={3}
              value={formData.workDescription}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="実施した作業内容を詳しく記載してください"
            />
          </div>

          {/* 作業時間 */}
          <div>
            <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
              作業時間 <span className="text-red-500">*</span>
              <span className="text-sm text-gray-500 ml-2">（0.25時間単位）</span>
            </label>
            <select
              id="hours"
              name="hours"
              required
              value={formData.hours}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {hourOptions.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}時間
                </option>
              ))}
            </select>
          </div>

          {/* ビラブル・ノンビラブル */}
          <div>
            <label htmlFor="billable" className="block text-sm font-medium text-gray-700 mb-1">
              請求可否 <span className="text-red-500">*</span>
            </label>
            <select
              id="billable"
              name="billable"
              required
              value={formData.billable.toString()}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">ビラブル（請求可能）</option>
              <option value="false">ノンビラブル（請求不可）</option>
            </select>
          </div>

          {/* ボタン */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '保存中...' : '工数記録'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}