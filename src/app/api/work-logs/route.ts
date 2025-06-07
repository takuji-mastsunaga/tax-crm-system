import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth';
import { WorkLog } from '@/types/employee';

// GET: 工数記録取得
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
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // emailが提供された場合、まず従業員IDを取得
    let actualEmployeeId = employeeId;
    if (email && !employeeId) {
      const employeesRef = collection(db, 'employees');
      const employeeQuery = query(employeesRef, where('email', '==', email));
      const employeeSnapshot = await getDocs(employeeQuery);
      
      if (!employeeSnapshot.empty) {
        actualEmployeeId = employeeSnapshot.docs[0].id;
      } else {
        return NextResponse.json({ workLogs: [] }, { status: 200 });
      }
    }

    const workLogsRef = collection(db, 'work-logs');
    let q;

    if (actualEmployeeId && date) {
      q = query(
        workLogsRef,
        where('employeeId', '==', actualEmployeeId),
        where('date', '==', date),
        orderBy('createdAt', 'desc')
      );
    } else if (actualEmployeeId && startDate && endDate) {
      q = query(
        workLogsRef,
        where('employeeId', '==', actualEmployeeId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );
    } else if (actualEmployeeId) {
      q = query(
        workLogsRef,
        where('employeeId', '==', actualEmployeeId),
        orderBy('date', 'desc')
      );
    } else {
      q = query(workLogsRef, orderBy('date', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    const workLogs: WorkLog[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      workLogs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as WorkLog);
    });

    return NextResponse.json({ workLogs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching work logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work logs' },
      { status: 500 }
    );
  }
}

// POST: 工数記録追加
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      employeeId,
      clientId,
      date,
      workDescription,
      hours,
      billable,
      category
    } = body;

    // バリデーション
    if (!employeeId || !date || !workDescription || !hours || billable === undefined || !category) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // 時間が0.25の倍数かチェック
    if (hours % 0.25 !== 0 || hours <= 0) {
      return NextResponse.json(
        { error: 'Hours must be in 0.25 hour increments and greater than 0' },
        { status: 400 }
      );
    }

    const now = new Date();
    const workLogData: Omit<WorkLog, 'id'> = {
      employeeId,
      clientId: clientId || undefined,
      date,
      workDescription,
      hours: Number(hours),
      billable: Boolean(billable),
      category,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'work-logs'), workLogData);
    
    return NextResponse.json(
      {
        message: 'Work log created successfully',
        workLogId: docRef.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating work log:', error);
    return NextResponse.json(
      { error: 'Failed to create work log' },
      { status: 500 }
    );
  }
}

// PUT: 工数記録更新
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      workLogId,
      clientId,
      workDescription,
      hours,
      billable,
      category
    } = body;

    if (!workLogId) {
      return NextResponse.json(
        { error: 'Work log ID is required' },
        { status: 400 }
      );
    }

    const updateData: { 
      updatedAt: Date; 
      clientId?: string; 
      workDescription?: string; 
      hours?: number; 
      billable?: boolean; 
      category?: string; 
    } = {
      updatedAt: new Date()
    };

    if (clientId !== undefined) updateData.clientId = clientId;
    if (workDescription) updateData.workDescription = workDescription;
    if (hours !== undefined) {
      if (hours % 0.25 !== 0 || hours <= 0) {
        return NextResponse.json(
          { error: 'Hours must be in 0.25 hour increments and greater than 0' },
          { status: 400 }
        );
      }
      updateData.hours = Number(hours);
    }
    if (billable !== undefined) updateData.billable = Boolean(billable);
    if (category) updateData.category = category;

    await updateDoc(doc(db, 'work-logs', workLogId), updateData);
    
    return NextResponse.json(
      { message: 'Work log updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating work log:', error);
    return NextResponse.json(
      { error: 'Failed to update work log' },
      { status: 500 }
    );
  }
}