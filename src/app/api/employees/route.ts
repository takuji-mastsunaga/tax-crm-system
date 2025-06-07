import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
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
    console.log('Fetching employees with Admin SDK...');

    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const employeeId = url.searchParams.get('employeeId');

    const employeesRef = adminDb.collection('employees');

    if (email) {
      // メールアドレスで特定従業員を検索
      const snapshot = await employeesRef.where('email', '==', email).get();
      const employees: Employee[] = [];
      
      snapshot.forEach((doc) => {
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
    } else if (employeeId) {
      // 従業員IDで特定従業員を検索
      const doc = await employeesRef.doc(employeeId).get();
      const employees: Employee[] = [];
      
      if (doc.exists) {
        const data = doc.data()!;
        employees.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          startDate: data.startDate?.toDate(),
        } as Employee);
      }
      
      return NextResponse.json({ employees }, { status: 200 });
    } else {
      // 全従業員一覧取得
      const snapshot = await employeesRef.orderBy('createdAt', 'desc').get();
      const employees: Employee[] = [];
      
      snapshot.forEach((doc) => {
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
    }
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
    console.log('Creating employee with Admin SDK...');

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

    const employeesRef = adminDb.collection('employees');

    // メールアドレスの重複チェック
    const emailSnapshot = await employeesRef.where('email', '==', email).get();
    if (!emailSnapshot.empty) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const now = new Date();
    const employeeData = {
      employeeNumber: body.employeeNumber || generateEmployeeNumber(),
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
      createdAt: body.createdAt ? new Date(body.createdAt) : now,
      updatedAt: body.updatedAt ? new Date(body.updatedAt) : now,
    };

    const docRef = await employeesRef.add(employeeData);
    
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