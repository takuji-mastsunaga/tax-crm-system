'use client'

import { useState } from 'react'
import { Employee } from '@/types/employee'

interface EmployeeAddFormProps {
  onClose: () => void
  onSuccess: (employee: Partial<Employee>) => void
}

export default function EmployeeAddForm({ onClose, onSuccess }: EmployeeAddFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    workType: 'full-time' as const,
    dailyWorkingHours: 8,
    monthlyWorkingDays: 20,
    hourlyRate: 1000,
    department: '',
    position: '',
    startDate: new Date().toISOString().split('T')[0]
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dailyWorkingHours' || name === 'monthlyWorkingDays' || name === 'hourlyRate' 
        ? Number(value) 
        : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // クライアントサイドで直接Firebaseに保存
      const { collection, addDoc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      
      // 従業員番号生成
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const timestamp = now.getTime().toString().slice(-6)
      const employeeNumber = `EMP${year}${month}${day}-${timestamp}`

      const employeeData = {
        employeeNumber,
        name: formData.name,
        email: formData.email,
        workType: formData.workType,
        dailyWorkingHours: formData.dailyWorkingHours,
        monthlyWorkingDays: formData.monthlyWorkingDays,
        hourlyRate: formData.hourlyRate,
        department: formData.department || '',
        position: formData.position || '',
        startDate: new Date(formData.startDate),
        status: 'active' as const,
        createdAt: now,
        updatedAt: now,
      }

      const docRef = await addDoc(collection(db, 'employees'), employeeData)
      
      console.log('Employee created with ID: ', docRef.id)
      onSuccess({ ...formData, startDate: new Date(formData.startDate) })
      alert('従業員の追加が完了しました。')
      onClose()
    } catch (error) {
      console.error('Error creating employee:', error)
      alert('従業員の追加に失敗しました: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">従業員追加</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* 名前 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="山田 太郎"
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="yamada@solvis-group.com"
            />
          </div>

          {/* 勤務形態 */}
          <div>
            <label htmlFor="workType" className="block text-sm font-medium text-gray-700 mb-1">
              勤務形態 <span className="text-red-500">*</span>
            </label>
            <select
              id="workType"
              name="workType"
              required
              value={formData.workType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full-time">正社員</option>
              <option value="part-time">パートタイム</option>
              <option value="contract">契約社員</option>
              <option value="temporary">臨時</option>
            </select>
          </div>

          {/* 労働時間情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="dailyWorkingHours" className="block text-sm font-medium text-gray-700 mb-1">
                所定労働時間（h/日） <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="dailyWorkingHours"
                name="dailyWorkingHours"
                required
                min="1"
                max="24"
                step="0.5"
                value={formData.dailyWorkingHours}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="monthlyWorkingDays" className="block text-sm font-medium text-gray-700 mb-1">
                月間所定日数 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="monthlyWorkingDays"
                name="monthlyWorkingDays"
                required
                min="1"
                max="31"
                value={formData.monthlyWorkingDays}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                時間給（円） <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                required
                min="0"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 追加情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                所属部署
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="税務部"
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                職位
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="主任"
              />
            </div>
          </div>

          {/* 入社日 */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              入社日
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {isLoading ? '追加中...' : '従業員追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}