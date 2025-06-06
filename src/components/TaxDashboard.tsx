"use client"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
export default function TaxDashboard() {
  const data = [{name:"ビラブル",value:35,color:"#10B981"},{name:"ノンビラブル",value:12,color:"#EF4444"}]
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
    </div>
  )
}