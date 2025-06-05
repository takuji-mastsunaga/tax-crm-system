import { auth } from "./auth"
import { redirect } from "next/navigation"
import ClientsTable from "@/components/ClientsTable"
import { Suspense } from "react"

export default async function Home() {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Tax CRM システム</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                こんにちは、{session.user?.name}さん
              </div>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ログアウト
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">顧客管理</h2>
            <p className="text-gray-600">税務サポート顧客の情報を管理します</p>
          </div>

          {/* 顧客テーブル */}
          <div className="bg-white shadow-sm rounded-lg border">
            <Suspense fallback={
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">データを読み込み中...</p>
              </div>
            }>
              <ClientsTable />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
