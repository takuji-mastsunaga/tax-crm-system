'use client'

import { useState, useEffect } from 'react'

interface MessageMemoFormProps {
  fromEmployeeId: string
  onClose: () => void
  onSuccess: () => void
}

interface Employee {
  id: string
  name: string
  email: string
  department?: string
}

export default function MessageMemoForm({ fromEmployeeId, onClose, onSuccess }: MessageMemoFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [formData, setFormData] = useState({
    toEmployeeId: '',
    content: '',
    priority: 'medium' as const
  })

  // 従業員一覧を取得
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees')
        if (response.ok) {
          const data = await response.json()
          // 自分以外の従業員のみ表示
          const otherEmployees = data.employees.filter((emp: Employee) => emp.id !== fromEmployeeId)
          setEmployees(otherEmployees)
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    fetchEmployees()
  }, [fromEmployeeId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/message-memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromEmployeeId,
          ...formData
        }),
      })

      if (response.ok) {
        alert('伝言メモを送信しました。')
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        alert(error.error || '伝言メモの送信に失敗しました。')
      }
    } catch (error) {
      console.error('Error creating message memo:', error)
      alert('システムエラーが発生しました。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">伝言メモ作成</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* 宛先 */}
          <div>
            <label htmlFor="toEmployeeId" className="block text-sm font-medium text-gray-700 mb-1">
              宛先 <span className="text-red-500">*</span>
            </label>
            <select
              id="toEmployeeId"
              name="toEmployeeId"
              required
              value={formData.toEmployeeId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">従業員を選択してください</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.department || '部署未設定'})
                </option>
              ))}
            </select>
          </div>

          {/* 優先度 */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              優先度 <span className="text-red-500">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              required
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">低</option>
              <option value="medium">通常</option>
              <option value="high">緊急</option>
            </select>
          </div>

          {/* メモ内容 */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              メモ内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={4}
              value={formData.content}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="伝言内容を詳しく記載してください"
            />
          </div>

          {/* 文字数カウンター */}
          <div className="text-right text-sm text-gray-500">
            {formData.content.length} / 500文字
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
              disabled={isLoading || formData.content.length > 500}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '送信中...' : '伝言メモ送信'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}