'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts'

interface KPIData {
  employeeId: string
  period: string
  totalHours: number
  billableHours: number
  nonBillableHours: number
  billableRate: number
  totalWorkingHours: number
  workingDays: number
  averageWorkingHours: number
  efficiency: number
  revenue: number
  dailyStats: Record<string, { billable: number; nonBillable: number }>
  categoryStats: Record<string, number>
}

interface KPIDashboardProps {
  employeeId: string
  employeeName?: string
}

export default function KPIDashboard({ employeeId, employeeName }: KPIDashboardProps) {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  // KPIデータの取得
  useEffect(() => {
    const fetchKPIData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/kpi?employeeId=${employeeId}&month=${selectedMonth}`)
        if (response.ok) {
          const data = await response.json()
          setKpiData(data.kpi)
        } else {
          console.error('Failed to fetch KPI data')
        }
      } catch (error) {
        console.error('Error fetching KPI data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchKPIData()
  }, [employeeId, selectedMonth])

  // 月選択オプション
  const getMonthOptions = () => {
    const options = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const displayName = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
      options.push({ value: monthStr, label: displayName })
    }
    return options
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!kpiData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">KPIダッシュボード</h3>
        <p className="text-gray-500">データが見つかりませんでした。</p>
      </div>
    )
  }

  // チャート用データの準備
  const billableData = [
    { name: 'ビラブル', value: kpiData.billableHours, color: '#3B82F6' },
    { name: 'ノンビラブル', value: kpiData.nonBillableHours, color: '#EF4444' }
  ]

  const categoryData = Object.entries(kpiData.categoryStats).map(([category, hours]) => ({
    category: getCategoryName(category),
    hours
  }))

  const dailyData = Object.entries(kpiData.dailyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, stats]) => ({
      date: new Date(date).getDate(),
      billable: stats.billable,
      nonBillable: stats.nonBillable,
      total: stats.billable + stats.nonBillable
    }))

  function getCategoryName(category: string) {
    const categoryNames: Record<string, string> = {
      'client-work': '顧客業務',
      'internal': '社内業務',
      'training': '研修・勉強',
      'meeting': '会議',
      'other': 'その他'
    }
    return categoryNames[category] || category
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            KPIダッシュボード
            {employeeName && <span className="text-base font-normal text-gray-500 ml-2">- {employeeName}</span>}
          </h3>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {getMonthOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* KPI概要 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">総労働時間</div>
            <div className="text-2xl font-bold text-blue-900">{kpiData.totalHours.toFixed(1)}h</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">ビラブル率</div>
            <div className="text-2xl font-bold text-green-900">{kpiData.billableRate.toFixed(1)}%</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">効率性</div>
            <div className="text-2xl font-bold text-purple-900">{kpiData.efficiency.toFixed(1)}%</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-600 font-medium">売上貢献</div>
            <div className="text-2xl font-bold text-yellow-900">¥{kpiData.revenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* チャートエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ビラブル・ノンビラブル比率 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">ビラブル・ノンビラブル比率</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={billableData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value.toFixed(1)}h (${(percent * 100).toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {billableData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* カテゴリ別作業時間 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ別作業時間</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 日別推移 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">日別作業時間推移</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="billable" stroke="#3B82F6" name="ビラブル" strokeWidth={2} />
            <Line type="monotone" dataKey="nonBillable" stroke="#EF4444" name="ノンビラブル" strokeWidth={2} />
            <Line type="monotone" dataKey="total" stroke="#10B981" name="合計" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 詳細統計 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">詳細統計</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">勤怠情報</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">出勤日数:</span>
                <span>{kpiData.workingDays}日</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">実労働時間:</span>
                <span>{kpiData.totalWorkingHours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">平均労働時間:</span>
                <span>{kpiData.averageWorkingHours.toFixed(1)}h/日</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-2">作業時間</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ビラブル:</span>
                <span className="text-blue-600 font-medium">{kpiData.billableHours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ノンビラブル:</span>
                <span className="text-red-600 font-medium">{kpiData.nonBillableHours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">総作業時間:</span>
                <span className="font-medium">{kpiData.totalHours.toFixed(1)}h</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-2">パフォーマンス</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">効率性:</span>
                <span className={`font-medium ${kpiData.efficiency >= 80 ? 'text-green-600' : kpiData.efficiency >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {kpiData.efficiency.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">売上貢献:</span>
                <span className="text-green-600 font-medium">¥{kpiData.revenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}