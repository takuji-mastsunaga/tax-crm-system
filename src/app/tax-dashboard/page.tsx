"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import TaxDashboard from "@/components/TaxDashboard"
import TaxClientsTable from "@/components/TaxClientsTable"
import TaxAddClientForm from "@/components/TaxAddClientForm"

export default function TaxDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showAddForm, setShowAddForm] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/tax-dashboard")
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error("ダッシュボードデータ取得エラー:", error)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">顧客管理</h1>
              <span className="text-sm text-gray-500">顧客先の一覧と詳細情報を管理します</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                + 新規顧客登録
              </button>
              <div className="text-sm text-gray-600">
                {session.user?.name}さん
              </div>
              <button 
                onClick={() => router.push("/")}
                className="text-blue-600 hover:text-blue-800"
              >
                ← メインに戻る
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          {/* ダッシュボード */}
          <TaxDashboard 
            clientStats={dashboardData?.clientStats}
            monthlyRevenue={dashboardData?.monthlyRevenue}
            revenueRanking={dashboardData?.revenueRanking}
          />
          
          {/* 顧客テーブル */}
          <TaxClientsTable />
        </div>
      </main>

      {/* 新規顧客追加フォーム */}
      <TaxAddClientForm 
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
      />
    </div>
  )
}
