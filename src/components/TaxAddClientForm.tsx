"use client"

import { useState } from "react"

export default function TaxAddClientForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    companyName: "",
    representativeName: "",
    representativeBirthday: "",
    phone: "",
    email: "",
    postalCode: "",
    address: "",
    industry: "",
    fiscalMonth: 3,
    monthlyFee: 50000,
    journalEntryFee: 500,
    clientContact: "",
    salesPerson: "",
    accountingPerson: "",
    operationPerson: "",
    staff: "",
    location: "",
    capitalAmount: "",
    establishedDate: "",
    businessContent: "",
    history: "",
    executives: "",
    banks: [""],
    invoiceNumber: "",
    invoiceAcquisitionDate: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // API呼び出し処理をここに追加
    console.log("フォームデータ:", formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">新規顧客登録</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">新しい顧客先の基本情報を入力してください</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">会社名・氏名 *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                placeholder="株式会社○○"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">代表者名 *</label>
              <input
                type="text"
                value={formData.representativeName}
                onChange={(e) => setFormData({...formData, representativeName: e.target.value})}
                placeholder="田中太郎"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          {/* 連絡先情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">電話番号 *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="03-1234-5678"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="example@company.co.jp"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          {/* 業務情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">業種</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">業種を選択</option>
                <option value="製造業">製造業</option>
                <option value="建設業">建設業</option>
                <option value="小売業">小売業</option>
                <option value="サービス業">サービス業</option>
                <option value="IT業">IT業</option>
                <option value="その他">その他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">決算月 *</label>
              <select
                value={formData.fiscalMonth}
                onChange={(e) => setFormData({...formData, fiscalMonth: parseInt(e.target.value)})}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1}月</option>
                ))}
              </select>
            </div>
          </div>

          {/* 住所情報 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">住所</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                placeholder="123-4567"
                className="border rounded-lg px-3 py-2"
              />
            </div>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="東京都渋谷区○○1-1-1"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* 料金情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">月額顧問料</label>
              <input
                type="number"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({...formData, monthlyFee: parseInt(e.target.value)})}
                placeholder="50000"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">仕訳代（1件あたり）</label>
              <input
                type="number"
                value={formData.journalEntryFee}
                onChange={(e) => setFormData({...formData, journalEntryFee: parseInt(e.target.value)})}
                placeholder="500"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* 担当者情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">担当者（クライアント先）</label>
              <input
                type="text"
                value={formData.clientContact}
                onChange={(e) => setFormData({...formData, clientContact: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">営業担当（当法人）</label>
              <select
                value={formData.salesPerson}
                onChange={(e) => setFormData({...formData, salesPerson: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">担当者を選択</option>
                <option value="太田事務">太田事務</option>
                <option value="山田会計士">山田会計士</option>
                <option value="佐藤税理士">佐藤税理士</option>
              </select>
            </div>
          </div>

          {/* フォームボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              登録
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
