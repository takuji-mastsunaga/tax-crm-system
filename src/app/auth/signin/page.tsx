'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import EmployeeAddForm from "@/components/EmployeeAddForm"
import Logo from "@/components/Logo"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { 
        callbackUrl: '/',
        redirect: true
      })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-4 -right-4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {/* ロゴとヘッダー */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="xl" variant="light" showText={false} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              ソルビス税理士法人
            </h1>
            <p className="text-gray-400 text-sm">
              SOLVIS TAX ACCOUNTING
            </p>
            <p className="text-gray-500 text-xs mt-3">
              従業員管理・業務支援システムへようこそ
            </p>
          </div>

          {/* Googleサインインボタン */}
          <div className="space-y-6">
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  <span>サインイン中...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Googleでサインイン</span>
                </>
              )}
            </button>

            {/* セキュリティメッセージ */}
            <div className="text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                このシステムは認証されたGoogleアカウントのみ<br />
                アクセス可能です。安全で信頼性の高い環境を提供します。
              </p>
            </div>

            {/* 従業員追加リンク */}
            <div className="text-center border-t border-gray-700 pt-6">
              <button
                onClick={() => setShowEmployeeForm(true)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors underline decoration-dotted underline-offset-4"
              >
                新規従業員の追加
              </button>
            </div>
          </div>

          {/* 利用規約とプライバシーポリシー */}
          <div className="mt-8 text-center border-t border-gray-700 pt-6">
            <p className="text-xs text-gray-500">
              ログインすることで、
              <span className="hover:text-gray-400 cursor-pointer transition-colors mx-1">利用規約</span>
              および
              <span className="hover:text-gray-400 cursor-pointer transition-colors mx-1">プライバシーポリシー</span>
              に同意したものとみなされます。
            </p>
          </div>
        </div>

        {/* ブランディング表示 */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-600">
            Powered by <span className="font-semibold text-gray-400">SOLVIS TAX ACCOUNTING</span>
          </p>
        </div>
      </div>

      {/* 従業員追加フォーム */}
      {showEmployeeForm && (
        <EmployeeAddForm
          onClose={() => setShowEmployeeForm(false)}
          onSuccess={() => {
            console.log('Employee added successfully')
            setShowEmployeeForm(false)
          }}
        />
      )}
    </div>
  )
} 