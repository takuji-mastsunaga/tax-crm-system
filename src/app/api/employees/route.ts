import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth';
import { Employee } from '@/types/employee';

// 従業員番号生成関数
function generateEmployeeNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const timestamp = now.getTime().toString().slice(-6);
  
  return `EMP${year}${month}${day}-${timestamp}`;
}

// GET: 従業員一覧取得または特定従業員取得
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const employeeId = url.searchParams.get('employeeId');

    const employeesRef = collection(db, 'employees');
    let q;

    if (email) {
      // メールアドレスで特定従業員を検索
      q = query(employeesRef, where('email', '==', email));
    } else if (employeeId) {
      // 従業員IDで特定従業員を検索
      q = query(employeesRef, where('__name__', '==', employeeId));
    } else {
      // 全従業員一覧取得
      q = query(employeesRef, orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    
    const employees: Employee[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      employees.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        startDate: data.startDate?.toDate(),
      } as Employee);
    });

    return NextResponse.json({ employees }, { status: 200 });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST: 新規従業員登録
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      email,
      workType,
      dailyWorkingHours,
      monthlyWorkingDays,
      hourlyRate,
      department,
      position,
      startDate
    } = body;

    // バリデーション
    if (!name || !email || !workType || !dailyWorkingHours || !monthlyWorkingDays || !hourlyRate) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // メールアドレスの重複チェック
    const emailQuery = query(
      collection(db, 'employees'),
      where('email', '==', email)
    );
    const emailSnapshot = await getDocs(emailQuery);
    if (!emailSnapshot.empty) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const now = new Date();
    const employeeData: Omit<Employee, 'id'> = {
      employeeNumber: generateEmployeeNumber(),
      name,
      email,
      workType,
      dailyWorkingHours: Number(dailyWorkingHours),
      monthlyWorkingDays: Number(monthlyWorkingDays),
      hourlyRate: Number(hourlyRate),
      department: department || '',
      position: position || '',
      startDate: startDate ? new Date(startDate) : now,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'employees'), employeeData);
    
    return NextResponse.json(
      {
        message: 'Employee created successfully',
        employeeId: docRef.id,
        employeeNumber: employeeData.employeeNumber
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}