'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { 
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import WorkLogForm from './WorkLogForm'
import MessageMemoCarousel from './MessageMemoCarousel'
import MessageMemoForm from './MessageMemoForm'
import WeeklyCalendar from './WeeklyCalendar'
import KPIDashboard from './KPIDashboard'

interface Employee {
  id: string
  name: string
  email: string
  department?: string
  position?: string
}

interface AttendanceStatus {
  isCheckedIn: boolean
  clockInTime?: Date
  clockOutTime?: Date
  totalWorkingHours?: number
}

export default function EmployeeDashboard() {
  const { data: session } = useSession()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({ isCheckedIn: false })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showWorkLogForm, setShowWorkLogForm] = useState(false)
  const [showMemoForm, setShowMemoForm] = useState(false)

  // 現在時刻の更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 従業員情報の取得
  const fetchEmployeeData = useCallback(async (email: string) => {
    try {
      const response = await fetch(`/api/employees?email=${email}`)
      if (response.ok) {
        const data = await response.json()
        if (data.employees && data.employees.length > 0) {
          setEmployee(data.employees[0])
        } else {
          // 従業員情報がない場合はダミーデータを設定
          setEmployee({
            id: 'demo-user',
            name: session?.user?.name || 'デモユーザー',
            email: email,
            department: 'デモ部署',
            position: 'デモ職位'
          })
        }
      }
    } catch (error) {
      console.error('Error fetching employee data:', error)
      // エラーの場合もダミーデータを設定
      setEmployee({
        id: 'demo-user',
        name: session?.user?.name || 'デモユーザー',
        email: email,
        department: 'デモ部署',
        position: 'デモ職位'
      })
    }
  }, [session?.user?.name])

  // 従業員情報の取得
  useEffect(() => {
    if (session?.user?.email) {
      fetchEmployeeData(session.user.email)
      fetchAttendanceStatus(session.user.email)
    }
  }, [session, fetchEmployeeData])

  const fetchAttendanceStatus = async (email: string) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/attendance?email=${email}&date=${today}`)
      if (response.ok) {
        const data = await response.json()
        if (data.records && data.records.length > 0) {
          const record = data.records[0]
          setAttendanceStatus({
            isCheckedIn: !!record.clockInTime && !record.clockOutTime,
            clockInTime: record.clockInTime ? new Date(record.clockInTime) : undefined,
            clockOutTime: record.clockOutTime ? new Date(record.clockOutTime) : undefined,
            totalWorkingHours: record.totalWorkingHours
          })
        }
      }
    } catch (error) {
      console.error('Error fetching attendance status:', error)
    }
  }

  const handleAttendance = async (action: 'clock-in' | 'clock-out') => {
    if (!employee) return

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employee.id,
          action
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (action === 'clock-in') {
          setAttendanceStatus({
            isCheckedIn: true,
            clockInTime: new Date(result.clockInTime)
          })
          alert('出勤しました。本日もよろしくお願いします。')
        } else {
          setAttendanceStatus({
            isCheckedIn: false,
            clockInTime: attendanceStatus.clockInTime,
            clockOutTime: new Date(result.clockOutTime),
            totalWorkingHours: result.totalWorkingHours
          })
          alert('本日もお疲れ様でした。')
        }
      } else {
        const error = await response.json()
        alert(error.error || '操作に失敗しました。')
      }
    } catch (error) {
      console.error('Error processing attendance:', error)
      alert('システムエラーが発生しました。')
    }
  }


  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const sidebarItems = [
    { id: 'calendar', label: 'カレンダー', icon: CalendarIcon },
    { id: 'todo', label: 'ToDo', icon: ClipboardDocumentListIcon },
    { id: 'memo', label: '伝言メモ', icon: ChatBubbleLeftRightIcon },
    { id: 'clients', label: '顧客情報', icon: UserGroupIcon },
    { id: 'employees', label: '従業員情報', icon: UserGroupIcon },
    { id: 'progress', label: '進捗管理表', icon: ChartBarIcon },
    { id: 'billing', label: '請求関連', icon: ClipboardDocumentListIcon },
    { id: 'kpi', label: 'KPIダッシュボード', icon: ChartBarIcon },
    { id: 'settings', label: '設定', icon: Cog6ToothIcon },
    { id: 'help', label: 'ヘルプ', icon: QuestionMarkCircleIcon },
  ]

  if (!session) {
    return <div>Loading...</div>
  }


  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1A237E] text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-indigo-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-lg font-bold">ソルビス税理士法人</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:text-gray-300"
            >
              {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg hover:bg-indigo-700 transition-colors ${
                    activeSection === item.id ? 'bg-indigo-700' : ''
                  }`}
                >
                  <item.icon className="h-6 w-6 mr-3" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {employee?.name}さんのホーム
            </h2>
          </div>

          <div className="flex items-center space-x-6">
            {/* 通知エリア */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BellIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  未処理: <span className="font-semibold text-red-600">3</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  未読: <span className="font-semibold text-blue-600">5</span>
                </span>
              </div>
            </div>

            {/* ユーザー情報 */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{employee?.name}</p>
                <p className="text-xs text-gray-500">{employee?.department || '未設定'}</p>
              </div>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {employee?.name?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 勤怠エリア */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-lg font-semibold text-gray-900">
                {formatDate(currentTime)}
              </div>
              <div className="text-2xl font-mono text-blue-600">
                {formatTime(currentTime)}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {attendanceStatus.clockInTime && (
                <div className="text-sm text-gray-600">
                  出勤時刻: {formatTime(attendanceStatus.clockInTime)}
                </div>
              )}
              
              <button
                onClick={() => handleAttendance(attendanceStatus.isCheckedIn ? 'clock-out' : 'clock-in')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  attendanceStatus.isCheckedIn
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {attendanceStatus.isCheckedIn ? '退勤' : '出勤'}
              </button>
            </div>
          </div>
        </div>

        {/* メインダッシュボード */}
        <main className="flex-1 p-6 overflow-auto">
          {activeSection === 'kpi' ? (
            employee && <KPIDashboard employeeId={employee.id} employeeName={employee.name} />
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* お知らせ・進捗管理カード */}
            <div className="lg:col-span-2 space-y-6">
              {/* 伝言メモエリア */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  {employee && <MessageMemoCarousel employeeId={employee.id} />}
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">伝言メモ</h3>
                    <button
                      onClick={() => setShowMemoForm(true)}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      メモ作成
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    同僚に伝言やメッセージを送信できます。
                  </p>
                </div>
              </div>

              {/* お知らせエリア */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">お知らせ・進捗管理</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm font-medium text-yellow-800">株式会社ABC - 決算報告書提出期限</p>
                    <p className="text-xs text-yellow-600">期限まで: 3日</p>
                  </div>
                  <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                    <p className="text-sm font-medium text-green-800">社内会議のお知らせ</p>
                    <p className="text-xs text-green-600">明日 14:00</p>
                  </div>
                </div>
              </div>

              {/* Googleカレンダーエリア */}
              {employee && <WeeklyCalendar employeeId={employee.id} showAllEmployees={true} />}
            </div>

            {/* サイドパネル */}
            <div className="space-y-6">
              {/* 勤怠サマリー */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">勤怠サマリー</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">今月の労働時間</span>
                    <span className="text-sm font-medium">160.5h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">今日の労働時間</span>
                    <span className="text-sm font-medium">
                      {attendanceStatus.totalWorkingHours 
                        ? `${attendanceStatus.totalWorkingHours}h` 
                        : '未記録'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">残業時間</span>
                    <span className="text-sm font-medium">8.5h</span>
                  </div>
                </div>
              </div>

              {/* KPIチャート */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">個人KPI</h3>
                  <button
                    onClick={() => setActiveSection('kpi')}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    詳細表示
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">ビラブル率</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">目標達成率</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 工数入力 */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">工数入力</h3>
                <button 
                  onClick={() => setShowWorkLogForm(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  作業内容を記録
                </button>
              </div>
            </div>
          </div>
          )}
        </main>
      </div>

      {/* 工数入力フォーム */}
      {showWorkLogForm && employee && (
        <WorkLogForm
          employeeId={employee.id}
          onClose={() => setShowWorkLogForm(false)}
          onSuccess={() => {
            // 成功時の処理（必要に応じてダッシュボードデータの再取得など）
            console.log('Work log added successfully')
          }}
        />
      )}

      {/* 伝言メモフォーム */}
      {showMemoForm && employee && (
        <MessageMemoForm
          fromEmployeeId={employee.id}
          onClose={() => setShowMemoForm(false)}
          onSuccess={() => {
            console.log('Message memo sent successfully')
          }}
        />
      )}

    </div>
  )
}