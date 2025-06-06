"use client"

import { useState } from "react"

export default function TaxClientsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const sampleClients = [
    {
      id: "1250001",
      clientNumber: "1250001",
      companyName: "株式会社A",
      representativeName: "田中太郎",
      phone: "03-1234-5678",
      email: "tanaka@company-a.co.jp",
      fiscalMonth: 3,
      salesPerson: "太田事務",
      lastMeetingDate: "2025/03/15",
      lastEmailDate: "2025/01/20",
      lastCallDate: "2025/02/10",
      nextDeadline: "2025/03/31",
      status: "契約済み",
      updatedAt: "2025/01/15"
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">顧客一覧 (4件)</h2>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            + 新規顧客登録
          </button>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="顧客名・代表者名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">全てのステータス</option>
            <option value="active">稼働中</option>
            <option value="pending">検討中</option>
            <option value="inactive">停止中</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">代表者</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">連絡先</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">決算月</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">担当者</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">最終面談</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">次回期限</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">更新日</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sampleClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{client.clientNumber}</td>
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{client.companyName}</div>
                    <div className="text-sm text-gray-500">{client.representativeName}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm text-gray-900">{client.phone}</div>
                    <a href={`mailto:${client.email}`} className="text-sm text-blue-600 hover:underline">
                      {client.email}
                    </a>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">{client.fiscalMonth}月</td>
                <td className="px-4 py-4 text-sm text-gray-900">{client.salesPerson}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{client.lastMeetingDate}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{client.nextDeadline}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {client.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">{client.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
