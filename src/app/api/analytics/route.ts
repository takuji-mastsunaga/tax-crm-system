/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ALLOWED_EMAILS = [
  "tackjioffice@gmail.com",
  "t7810164825837@gmail.com"
];

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientsRef = collection(db, "clients");
    const snapshot = await getDocs(clientsRef);
    const clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const statusStats = clients.reduce((acc: any, client: any) => {
      const status = client.status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(statusStats).map(([status, count]) => ({
      status: status === "active" ? "稼働中" : 
              status === "pending" ? "検討中" : 
              status === "inactive" ? "停止中" : "不明",
      count,
      originalStatus: status
    }));

    return NextResponse.json({
      statusData,
      totalClients: clients.length,
      summary: {
        activeClients: statusStats.active || 0,
        pendingClients: statusStats.pending || 0,
        inactiveClients: statusStats.inactive || 0
      }
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}