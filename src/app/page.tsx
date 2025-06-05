export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            税務CRMシステム
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            顧客管理システムが正常に起動しました
          </p>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">システム情報</h2>
            <ul className="text-left space-y-2">
              <li>✅ Next.js 15 フロントエンド</li>
              <li>✅ Tailwind CSS スタイリング</li>
              <li>✅ Firebase Firestore データベース</li>
              <li>✅ BigQuery 分析システム</li>
              <li>⏳ Google OAuth認証 (実装予定)</li>
              <li>⏳ Chrome拡張機能 (実装予定)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
