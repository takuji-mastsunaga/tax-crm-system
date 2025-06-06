import { NextResponse } from "next/server"
import { auth } from "@/app/auth"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

const ALLOWED_EMAILS = [
  "tackjioffice@gmail.com",
  "t7810164825837@gmail.com"
]

export async function GET() {
  try {
    const session = await auth()
    if (!session || !session.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 顧客データを取得
    const clientsRef = collection(db, "tax-clients")
    const clientsQuery = query(clientsRef, orderBy("updatedAt", "desc"))
    const snapshot = await getDocs(clientsQuery)
    const clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // ビラブル・ノンビラブル統計
    const totalClients = clients.length
    const billableClients = clients.filter(client => client.isBillable).length
    const nonBillableClients = totalClients - billableClients
    const billableRate = totalClients > 0 ? (billableClients / totalClients) * 100 : 0

    const clientStats = {
      totalClients,
      billableClients,
      nonBillableClients,
      billableRate
    }

    // 月次売上データ（サンプル）
    const monthlyRevenue = [
      { month: "4月", revenue: 1800000, previousYearRevenue: 1650000, growth: 9.1 },
      { month: "5月", revenue: 1950000, previousYearRevenue: 1800000, growth: 8.3 },
      { month: "6月", revenue: 2100000, previousYearRevenue: 1900000, growth: 10.5 },
      { month: "7月", revenue: 1850000, previousYearRevenue: 1750000, growth: 5.7 },
      { month: "8月", revenue: 2200000, previousYearRevenue: 1950000, growth: 12.8 },
      { month: "9月", revenue: 2050000, previousYearRevenue: 1900000, growth: 7.9 }
    ]

    // 収益ランキング
    const revenueRanking = clients
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 10)
      .map((client, index) => ({
        clientId: client.id,
        companyName: client.companyName || "未設定",
        revenue: client.revenue || 0,
        profitRate: client.profitRate || 0,
        rank: index + 1
      }))

    return NextResponse.json({
      clientStats,
      monthlyRevenue,
      revenueRanking,
      totalClients: clients.length
    })
  } catch (error) {
    console.error("Tax Dashboard API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
