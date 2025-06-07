import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/app/auth';

// GET: KPIデータ取得
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const employeeId = url.searchParams.get('employeeId');
    const email = url.searchParams.get('email');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const month = url.searchParams.get('month'); // YYYY-MM形式

    // emailが提供された場合、まず従業員IDを取得
    let actualEmployeeId = employeeId;
    if (email && !employeeId) {
      const employeesRef = collection(db, 'employees');
      const employeeQuery = query(employeesRef, where('email', '==', email));
      const employeeSnapshot = await getDocs(employeeQuery);
      
      if (!employeeSnapshot.empty) {
        actualEmployeeId = employeeSnapshot.docs[0].id;
      } else {
        return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
      }
    }

    if (!actualEmployeeId) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    // 工数記録からKPIを計算
    const workLogsRef = collection(db, 'work-logs');
    let workLogsQuery;

    if (month) {
      // 特定の月のデータ
      const yearMonth = month;
      const startOfMonth = `${yearMonth}-01`;
      const endOfMonth = `${yearMonth}-31`;
      
      workLogsQuery = query(
        workLogsRef,
        where('employeeId', '==', actualEmployeeId),
        where('date', '>=', startOfMonth),
        where('date', '<=', endOfMonth),
        orderBy('date', 'desc')
      );
    } else if (startDate && endDate) {
      // 期間指定
      workLogsQuery = query(
        workLogsRef,
        where('employeeId', '==', actualEmployeeId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );
    } else {
      // 現在月のデータ
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const startOfMonth = `${currentMonth}-01`;
      const endOfMonth = `${currentMonth}-31`;
      
      workLogsQuery = query(
        workLogsRef,
        where('employeeId', '==', actualEmployeeId),
        where('date', '>=', startOfMonth),
        where('date', '<=', endOfMonth),
        orderBy('date', 'desc')
      );
    }

    const workLogsSnapshot = await getDocs(workLogsQuery);
    
    // KPI計算
    let totalHours = 0;
    let billableHours = 0;
    let nonBillableHours = 0;
    const dailyStats: Record<string, { billable: number; nonBillable: number }> = {};
    const categoryStats: Record<string, number> = {};

    workLogsSnapshot.forEach((doc) => {
      const workLog = doc.data();
      const hours = workLog.hours || 0;
      
      totalHours += hours;
      
      if (workLog.billable) {
        billableHours += hours;
      } else {
        nonBillableHours += hours;
      }

      // 日別統計
      const date = workLog.date;
      if (!dailyStats[date]) {
        dailyStats[date] = { billable: 0, nonBillable: 0 };
      }
      if (workLog.billable) {
        dailyStats[date].billable += hours;
      } else {
        dailyStats[date].nonBillable += hours;
      }

      // カテゴリ別統計
      const category = workLog.category || 'other';
      categoryStats[category] = (categoryStats[category] || 0) + hours;
    });

    // 勤怠記録から実労働時間を取得
    const attendanceRef = collection(db, 'attendance');
    let attendanceQuery;
    
    if (month) {
      const yearMonth = month;
      const startOfMonth = `${yearMonth}-01`;
      const endOfMonth = `${yearMonth}-31`;
      
      attendanceQuery = query(
        attendanceRef,
        where('employeeId', '==', actualEmployeeId),
        where('date', '>=', startOfMonth),
        where('date', '<=', endOfMonth)
      );
    } else if (startDate && endDate) {
      attendanceQuery = query(
        attendanceRef,
        where('employeeId', '==', actualEmployeeId),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );
    } else {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const startOfMonth = `${currentMonth}-01`;
      const endOfMonth = `${currentMonth}-31`;
      
      attendanceQuery = query(
        attendanceRef,
        where('employeeId', '==', actualEmployeeId),
        where('date', '>=', startOfMonth),
        where('date', '<=', endOfMonth)
      );
    }

    const attendanceSnapshot = await getDocs(attendanceQuery);
    let totalWorkingHours = 0;
    let workingDays = 0;

    attendanceSnapshot.forEach((doc) => {
      const attendance = doc.data();
      if (attendance.totalWorkingHours) {
        totalWorkingHours += attendance.totalWorkingHours;
        workingDays++;
      }
    });

    // KPI計算
    const billableRate = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;
    const efficiency = totalWorkingHours > 0 ? (totalHours / totalWorkingHours) * 100 : 0;
    const averageWorkingHours = workingDays > 0 ? totalWorkingHours / workingDays : 0;

    // 収益計算（仮の計算）
    const revenue = billableHours * 3000; // 仮：時給3000円として計算

    const kpiData = {
      employeeId: actualEmployeeId,
      period: month || `${startDate} - ${endDate}`,
      totalHours,
      billableHours,
      nonBillableHours,
      billableRate: Math.round(billableRate * 100) / 100,
      totalWorkingHours,
      workingDays,
      averageWorkingHours: Math.round(averageWorkingHours * 100) / 100,
      efficiency: Math.round(efficiency * 100) / 100,
      revenue,
      dailyStats,
      categoryStats
    };

    return NextResponse.json({ kpi: kpiData }, { status: 200 });
  } catch (error) {
    console.error('Error calculating KPI:', error);
    return NextResponse.json(
      { error: 'Failed to calculate KPI' },
      { status: 500 }
    );
  }
}