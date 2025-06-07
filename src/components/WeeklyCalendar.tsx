'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  employeeName?: string
  type: 'meeting' | 'deadline' | 'task' | 'personal'
  color: string
}

interface WeeklyCalendarProps {
  employeeId: string
  showAllEmployees?: boolean
}

export default function WeeklyCalendar({ showAllEmployees = true }: WeeklyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])

  // 週の開始日（月曜日）を取得
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 月曜日を週の始まりに
    return new Date(d.setDate(diff))
  }

  // 現在の週の日付配列を取得
  const getWeekDays = () => {
    const weekStart = getWeekStart(currentDate)
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      days.push(day)
    }
    return days
  }

  // TODO: 将来的に従業員名の取得が必要な場合はここに実装

  // サンプルイベントデータ（実際にはAPIから取得）
  useEffect(() => {
    // TODO: 実際のGoogleカレンダーAPIまたは独自のAPIからイベントを取得
    const sampleEvents: CalendarEvent[] = [
      {
        id: '1',
        title: '株式会社ABC 決算会議',
        start: new Date(2025, 5, 9, 10, 0), // 月曜日 10:00
        end: new Date(2025, 5, 9, 11, 30),
        employeeName: '田中太郎',
        type: 'meeting',
        color: 'bg-blue-500'
      },
      {
        id: '2',
        title: '月次報告書作成',
        start: new Date(2025, 5, 10, 14, 0), // 火曜日 14:00
        end: new Date(2025, 5, 10, 16, 0),
        employeeName: '佐藤花子',
        type: 'task',
        color: 'bg-green-500'
      },
      {
        id: '3',
        title: '税務申告期限',
        start: new Date(2025, 5, 12, 17, 0), // 木曜日 17:00
        end: new Date(2025, 5, 12, 17, 0),
        employeeName: '全社',
        type: 'deadline',
        color: 'bg-red-500'
      },
      {
        id: '4',
        title: '顧客訪問',
        start: new Date(2025, 5, 13, 9, 0), // 金曜日 9:00
        end: new Date(2025, 5, 13, 12, 0),
        employeeName: '山田次郎',
        type: 'meeting',
        color: 'bg-purple-500'
      }
    ]
    setEvents(sampleEvents)
  }, [])

  // 指定した日のイベントを取得
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  // 時間をフォーマット
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // 前の週へ
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  // 次の週へ
  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  // 今週へ
  const goToCurrentWeek = () => {
    setCurrentDate(new Date())
  }

  const weekDays = getWeekDays()
  const weekStart = getWeekStart(currentDate)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const dayNames = ['月', '火', '水', '木', '金', '土', '日']

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* ヘッダー */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            週間スケジュール
            {showAllEmployees && <span className="text-sm font-normal text-gray-500 ml-2">（全従業員）</span>}
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousWeek}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-gray-900">
                {weekStart.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })} - 
                {weekEnd.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
              </span>
              <button
                onClick={goToNextWeek}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={goToCurrentWeek}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              今週
            </button>
          </div>
        </div>
      </div>

      {/* カレンダーグリッド */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {/* 曜日ヘッダー */}
          {dayNames.map((dayName, dayIndex) => (
            <div key={dayName} className="p-2 text-center text-sm font-medium text-gray-700 border-b">
              <div>{dayName}</div>
              <div className="text-lg font-semibold">
                {weekDays[dayIndex].getDate()}
              </div>
            </div>
          ))}

          {/* カレンダー本体 */}
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day)
            const isToday = day.toDateString() === new Date().toDateString()
            
            return (
              <div 
                key={day.toISOString()} 
                className={`p-2 min-h-[120px] border-r border-b ${
                  isToday ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`${event.color} text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                      title={`${event.title}\n${formatTime(event.start)} - ${formatTime(event.end)}\n担当: ${event.employeeName}`}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-white/80">
                        {formatTime(event.start)}
                      </div>
                      {showAllEmployees && event.employeeName && (
                        <div className="text-white/80 truncate">
                          {event.employeeName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 凡例 */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>会議</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>作業</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>期限</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>外出</span>
          </div>
        </div>
      </div>
    </div>
  )
}