"use client"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { useState } from "react"
import { CheckCircle, ArrowPathIcon, XCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline"

export default function TaxDashboard() {
  const [clients, setClients] = useState<any[]>([])
  const [totalClients, setTotalClients] = useState(0)
  const [monthlyClients, setMonthlyClients] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [sheetsSyncStatus, setSheetsSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')

  const data = [{name:"ビラブル",value:35,color:"#10B981"},{name:"ノンビラブル",value:12,color:"#EF4444"}]

  // Google Sheets同期機能
  const initializeGoogleSheets = async () => {
    try {
      setSheetsSyncStatus('syncing')
      const response = await fetch('/api/google-sheets', {
        method: 'PUT'
      })
      
      if (response.ok) {
        setSheetsSyncStatus('success')
        console.log('Google Sheetsの初期化が完了しました')
      } else {
        setSheetsSyncStatus('error')
        console.error('Google Sheets初期化に失敗しました')
      }
    } catch (error) {
      setSheetsSyncStatus('error')
      console.error('Google Sheets初期化エラー:', error)
    }
  }

  const syncToGoogleSheets = async () => {
    try {
      setSheetsSyncStatus('syncing')
      
      // 既存の全顧客をGoogle Sheetsに同期
      for (const client of clients) {
        const response = await fetch('/api/google-sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(client)
        })
        
        if (!response.ok) {
          throw new Error(`同期失敗: ${client.companyName}`)
        }
      }
      
      setSheetsSyncStatus('success')
      console.log('全顧客のGoogle Sheets同期が完了しました')
    } catch (error) {
      setSheetsSyncStatus('error')
      console.error('Google Sheets一括同期エラー:', error)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">ビラブル率</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">{data.map((entry,index)=><Cell key={index} fill={entry.color}/>)}</Pie></PieChart>
        </ResponsiveContainer>
        <p className="text-center mt-4">全47社 (74.5%)</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6"><h3 className="text-lg font-semibold mb-4">月次売上推移</h3><p className="text-gray-600">売上データ表示エリア</p></div>
      <div className="bg-white rounded-lg shadow p-6"><h3 className="text-lg font-semibold mb-4">顧客別収益ランキング</h3><p className="text-gray-600">ランキング表示エリア</p></div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 既存のカード... */}
        
        {/* Google Sheets同期カード */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Google Sheets</p>
              <p className="text-2xl font-bold text-gray-900">
                {sheetsSyncStatus === 'success' ? '同期済み' : 
                 sheetsSyncStatus === 'syncing' ? '同期中' :
                 sheetsSyncStatus === 'error' ? 'エラー' : '未同期'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              sheetsSyncStatus === 'success' ? 'bg-green-100' :
              sheetsSyncStatus === 'syncing' ? 'bg-blue-100' :
              sheetsSyncStatus === 'error' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              {sheetsSyncStatus === 'success' ? (
                <CheckCircle className={`w-6 h-6 text-green-600`} />
              ) : sheetsSyncStatus === 'syncing' ? (
                <ArrowPathIcon className={`w-6 h-6 text-blue-600 animate-spin`} />
              ) : sheetsSyncStatus === 'error' ? (
                <XCircleIcon className={`w-6 h-6 text-red-600`} />
              ) : (
                <DocumentTextIcon className={`w-6 h-6 text-gray-600`} />
              )}
            </div>
          </div>
          
          {/* 同期ボタン */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={initializeGoogleSheets}
              disabled={sheetsSyncStatus === 'syncing'}
              className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              初期化
            </button>
            <button
              onClick={syncToGoogleSheets}
              disabled={sheetsSyncStatus === 'syncing' || clients.length === 0}
              className="flex-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              全同期
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}