import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth';
import { AttendanceRecord } from '@/types/employee';

// GET: 勤怠記録取得
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const employeeId = url.searchParams.get('employeeId');
    const email = url.searchParams.get('email');
    const date = url.searchParams.get('date'); // YYYY-MM-DD形式

    // emailが提供された場合、まず従業員IDを取得
    let actualEmployeeId = employeeId;
    if (email && !employeeId) {
      const employeesRef = collection(db, 'employees');
      const employeeQuery = query(employeesRef, where('email', '==', email));
      const employeeSnapshot = await getDocs(employeeQuery);
      
      if (!employeeSnapshot.empty) {
        actualEmployeeId = employeeSnapshot.docs[0].id;
      } else {
        return NextResponse.json({ records: [] }, { status: 200 });
      }
    }

    let q;
    if (actualEmployeeId && date) {
      q = query(
        collection(db, 'attendance'),
        where('employeeId', '==', actualEmployeeId),
        where('date', '==', date)
      );
    } else if (actualEmployeeId) {
      q = query(
        collection(db, 'attendance'),
        where('employeeId', '==', actualEmployeeId),
        orderBy('date', 'desc')
      );
    } else if (date) {
      q = query(
        collection(db, 'attendance'),
        where('date', '==', date),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'attendance'),
        orderBy('date', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
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
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // 今日の勤怠記録を確認
    const todayQuery = query(
      collection(db, 'attendance'),
      where('employeeId', '==', employeeId),
      where('date', '==', today)
    );
    const todaySnapshot = await getDocs(todayQuery);

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
        const docRef = await addDoc(collection(db, 'attendance'), attendanceData);
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
        await updateDoc(doc(db, 'attendance', existingDoc.id), {
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

      await updateDoc(doc(db, 'attendance', existingDoc.id), {
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