'use client'

import { useState, useEffect } from 'react'
import { MessageMemo } from '@/types/employee'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface MessageMemoCarouselProps {
  employeeId: string
}

interface MemoWithSender extends MessageMemo {
  senderName?: string
}

export default function MessageMemoCarousel({ employeeId }: MessageMemoCarouselProps) {
  const [memos, setMemos] = useState<MemoWithSender[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [employees, setEmployees] = useState<Record<string, string>>({})

  // 従業員名の取得
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees')
        if (response.ok) {
          const data = await response.json()
          const employeesMap: Record<string, string> = {}
          data.employees.forEach((emp: { id: string; name: string }) => {
            employeesMap[emp.id] = emp.name
          })
          setEmployees(employeesMap)
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    fetchEmployees()
  }, [])

  // 伝言メモの取得
  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const response = await fetch(`/api/message-memos?toEmployeeId=${employeeId}&onlyUnread=true`)
        if (response.ok) {
          const data = await response.json()
          const memosWithSender = data.memos.map((memo: MessageMemo) => ({
            ...memo,
            senderName: employees[memo.fromEmployeeId] || '不明'
          }))
          setMemos(memosWithSender)
        }
      } catch (error) {
        console.error('Error fetching memos:', error)
      }
    }

    if (Object.keys(employees).length > 0) {
      fetchMemos()
    }
  }, [employeeId, employees])

  // 自動再生（3秒ごと）
  useEffect(() => {
    if (!isAutoPlaying || memos.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % memos.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, memos.length])

  // メモを既読にする
  const markAsRead = async (memoId: string) => {
    try {
      const response = await fetch('/api/message-memos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memoId,
          isRead: true
        }),
      })

      if (response.ok) {
        // メモを一覧から削除
        setMemos(prev => prev.filter(memo => memo.id !== memoId))
        // インデックスを調整
        if (currentIndex >= memos.length - 1) {
          setCurrentIndex(0)
        }
      }
    } catch (error) {
      console.error('Error marking memo as read:', error)
    }
  }

  // 手動ナビゲーション
  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? memos.length - 1 : prevIndex - 1
    )
    setTimeout(() => setIsAutoPlaying(true), 5000) // 5秒後に自動再生再開
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % memos.length)
    setTimeout(() => setIsAutoPlaying(true), 5000) // 5秒後に自動再生再開
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50'
      case 'medium': return 'border-yellow-400 bg-yellow-50'
      case 'low': return 'border-blue-400 bg-blue-50'
      default: return 'border-gray-400 bg-gray-50'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '緊急'
      case 'medium': return '通常'
      case 'low': return '低'
      default: return '通常'
    }
  }

  if (memos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">伝言メモ</h3>
        <p className="text-gray-500 text-sm">新しいメモはありません</p>
      </div>
    )
  }

  const currentMemo = memos[currentIndex]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">伝言メモ</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {currentIndex + 1} / {memos.length}
          </span>
          {memos.length > 1 && (
            <div className="flex items-center space-x-1">
              <button
                onClick={goToPrevious}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                onClick={goToNext}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`p-3 border-l-4 rounded ${getPriorityColor(currentMemo.priority)}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-900">
                {currentMemo.senderName}さんから
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                currentMemo.priority === 'high' 
                  ? 'bg-red-100 text-red-800' 
                  : currentMemo.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
              }`}>
                {getPriorityText(currentMemo.priority)}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{currentMemo.content}</p>
            <p className="text-xs text-gray-500">
              {new Date(currentMemo.createdAt).toLocaleString('ja-JP')}
            </p>
          </div>
          <button
            onClick={() => markAsRead(currentMemo.id)}
            className="ml-2 p-1 text-gray-400 hover:text-gray-600"
            title="既読にする"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {memos.length > 1 && (
        <div className="flex justify-center mt-3 space-x-1">
          {memos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setIsAutoPlaying(false)
                setTimeout(() => setIsAutoPlaying(true), 5000)
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {isAutoPlaying && memos.length > 1 && (
        <div className="mt-2 text-center">
          <button
            onClick={() => setIsAutoPlaying(false)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            自動再生を停止
          </button>
        </div>
      )}

      {!isAutoPlaying && memos.length > 1 && (
        <div className="mt-2 text-center">
          <button
            onClick={() => setIsAutoPlaying(true)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            自動再生を開始
          </button>
        </div>
      )}
    </div>
  )
}