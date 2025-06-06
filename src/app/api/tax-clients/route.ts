import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/auth"
import { collection, addDoc, getDocs, query, orderBy, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

const ALLOWED_EMAILS = [
  "tackjioffice@gmail.com",
  "t7810164825837@gmail.com"
]

// 顧客番号生成関数
function generateClientNumber(companyName: string, year: number = new Date().getFullYear()): string {
  const corporateKeywords = ["株", "有限", "合同", "会社", "法人", "団体"]
  const isCorporate = corporateKeywords.some(keyword => companyName.includes(keyword))
  const companyType = isCorporate ? "1" : "2"
  const yearSuffix = year.toString().slice(-2)
  const sequentialNumber = Math.floor(Math.random() * 9999).toString().padStart(4, "0")
  return companyType + yearSuffix + sequentialNumber
}

// GET: 顧客一覧取得
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"

    const clientsRef = collection(db, "tax-clients")
    let clientsQuery = query(clientsRef, orderBy("updatedAt", "desc"))

    if (status !== "all") {
      clientsQuery = query(clientsRef, where("status", "==", status), orderBy("updatedAt", "desc"))
    }

    const snapshot = await getDocs(clientsQuery)
    let clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Record<string, unknown> }))

    // 検索フィルタ
    if (search) {
      clients = clients.filter((client: Record<string, unknown>) => 
        (typeof client.companyName === "string" && client.companyName.toLowerCase().includes(search.toLowerCase())) ||
        (typeof client.representativeName === "string" && client.representativeName.toLowerCase().includes(search.toLowerCase())) ||
        (typeof client.email === "string" && client.email.toLowerCase().includes(search.toLowerCase()))
      )
    }

    return NextResponse.json({ clients, count: clients.length })
  } catch (error) {
    console.error("Tax Clients API GET error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST: 新規顧客登録
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const clientNumber = generateClientNumber(body.companyName)

    const clientData = {
      ...body,
      clientNumber,
      isBillable: body.isBillable || false,
      revenue: body.revenue || 0,
      profitRate: body.profitRate || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.email
    }

    const clientsRef = collection(db, "tax-clients")
    const docRef = await addDoc(clientsRef, clientData)

    return NextResponse.json({ 
      id: docRef.id, 
      clientNumber,
      message: "顧客が正常に登録されました" 
    }, { status: 201 })
  } catch (error) {
    console.error("Tax Clients API POST error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
