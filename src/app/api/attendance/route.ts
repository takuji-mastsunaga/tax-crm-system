import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { AttendanceRecord } from '@/types/employee';

// GET: 勤怠記録取得
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching attendance records with Admin SDK...');

    const url = new URL(request.url);
    const employeeId = url.searchParams.get('employeeId');
    const email = url.searchParams.get('email');
    const date = url.searchParams.get('date'); // YYYY-MM-DD形式

    // emailが提供された場合、まず従業員IDを取得
    let actualEmployeeId = employeeId;
    if (email && !employeeId) {
      const employeesRef = adminDb.collection('employees');
      const employeeSnapshot = await employeesRef.where('email', '==', email).get();
      
      if (!employeeSnapshot.empty) {
        actualEmployeeId = employeeSnapshot.docs[0].id;
      } else {
        return NextResponse.json({ records: [] }, { status: 200 });
      }
    }

    const attendanceRef = adminDb.collection('attendance');
    let querySnapshot;

    if (actualEmployeeId && date) {
      querySnapshot = await attendanceRef
        .where('employeeId', '==', actualEmployeeId)
        .where('date', '==', date)
        .get();
    } else if (actualEmployeeId) {
      querySnapshot = await attendanceRef
        .where('employeeId', '==', actualEmployeeId)
        .orderBy('date', 'desc')
        .get();
    } else if (date) {
      querySnapshot = await attendanceRef
        .where('date', '==', date)
        .orderBy('createdAt', 'desc')
        .get();
    } else {
      querySnapshot = await attendanceRef.orderBy('date', 'desc').get();
    }
    const records: AttendanceRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        clockInTime: data.clockInTime?.toDate(),
        clockOutTime: data.clockOutTime?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as AttendanceRecord);
    });

    return NextResponse.json({ records }, { status: 200 });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}

// POST: 出退勤記録
export async function POST(request: NextRequest) {
  try {
    console.log('Processing attendance with Admin SDK...');

    const body = await request.json();
    const { employeeId, action } = body; // action: 'clock-in' | 'clock-out'

    if (!employeeId || !action) {
      return NextResponse.json(
        { error: 'Employee ID and action are required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD形式

    const attendanceRef = adminDb.collection('attendance');

    // 今日の勤怠記録を確認
    const todaySnapshot = await attendanceRef
      .where('employeeId', '==', employeeId)
      .where('date', '==', today)
      .get();

    if (action === 'clock-in') {
      // 出勤処理
      if (!todaySnapshot.empty) {
        const existingRecord = todaySnapshot.docs[0];
        const data = existingRecord.data();
        if (data.clockInTime) {
          return NextResponse.json(
            { error: 'Already clocked in today' },
            { status: 400 }
          );
        }
      }

      const attendanceData: Omit<AttendanceRecord, 'id'> = {
        employeeId,
        date: today,
        clockInTime: now,
        status: 'present',
        createdAt: now,
        updatedAt: now,
      };

      if (todaySnapshot.empty) {
        // 新規レコード作成
        const docRef = await attendanceRef.add(attendanceData);
        return NextResponse.json(
          {
            message: 'Clock in successful',
            recordId: docRef.id,
            clockInTime: now
          },
          { status: 201 }
        );
      } else {
        // 既存レコード更新
        const existingDoc = todaySnapshot.docs[0];
        await existingDoc.ref.update({
          clockInTime: now,
          status: 'present',
          updatedAt: now
        });
        return NextResponse.json(
          {
            message: 'Clock in successful',
            recordId: existingDoc.id,
            clockInTime: now
          },
          { status: 200 }
        );
      }
    } else if (action === 'clock-out') {
      // 退勤処理
      if (todaySnapshot.empty) {
        return NextResponse.json(
          { error: 'No clock-in record found for today' },
          { status: 400 }
        );
      }

      const existingDoc = todaySnapshot.docs[0];
      const existingData = existingDoc.data();
      
      if (!existingData.clockInTime) {
        return NextResponse.json(
          { error: 'Must clock in first' },
          { status: 400 }
        );
      }

      if (existingData.clockOutTime) {
        return NextResponse.json(
          { error: 'Already clocked out today' },
          { status: 400 }
        );
      }

      const clockInTime = existingData.clockInTime.toDate();
      const totalWorkingHours = (now.getTime() - clockInTime.getTime()) / (1000 * 60 * 60); // 時間単位

      await existingDoc.ref.update({
        clockOutTime: now,
        totalWorkingHours: Math.round(totalWorkingHours * 100) / 100, // 小数点2桁
        updatedAt: now
      });

      return NextResponse.json(
        {
          message: 'Clock out successful',
          recordId: existingDoc.id,
          clockOutTime: now,
          totalWorkingHours: Math.round(totalWorkingHours * 100) / 100
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing attendance:', error);
    return NextResponse.json(
      { error: 'Failed to process attendance' },
      { status: 500 }
    );
  }
}