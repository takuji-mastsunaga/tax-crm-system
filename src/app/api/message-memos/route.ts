import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth';
import { MessageMemo } from '@/types/employee';

// GET: 伝言メモ取得
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const toEmployeeId = url.searchParams.get('toEmployeeId');
    const fromEmployeeId = url.searchParams.get('fromEmployeeId');
    const email = url.searchParams.get('email');
    const onlyUnread = url.searchParams.get('onlyUnread') === 'true';

    // emailが提供された場合、まず従業員IDを取得
    let actualToEmployeeId = toEmployeeId;
    if (email && !toEmployeeId) {
      const employeesRef = collection(db, 'employees');
      const employeeQuery = query(employeesRef, where('email', '==', email));
      const employeeSnapshot = await getDocs(employeeQuery);
      
      if (!employeeSnapshot.empty) {
        actualToEmployeeId = employeeSnapshot.docs[0].id;
      } else {
        return NextResponse.json({ memos: [] }, { status: 200 });
      }
    }

    const memosRef = collection(db, 'message-memos');
    let q;

    if (actualToEmployeeId && fromEmployeeId) {
      q = query(
        memosRef,
        where('toEmployeeId', '==', actualToEmployeeId),
        where('fromEmployeeId', '==', fromEmployeeId),
        orderBy('createdAt', 'desc')
      );
    } else if (actualToEmployeeId) {
      const conditions = [
        where('toEmployeeId', '==', actualToEmployeeId),
        orderBy('createdAt', 'desc')
      ];
      
      if (onlyUnread) {
        conditions.splice(1, 0, where('isRead', '==', false));
      }
      
      q = query(memosRef, ...conditions);
    } else if (fromEmployeeId) {
      q = query(
        memosRef,
        where('fromEmployeeId', '==', fromEmployeeId),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(memosRef, orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    const memos: MessageMemo[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      memos.push({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        readAt: data.readAt?.toDate(),
      } as MessageMemo);
    });

    return NextResponse.json({ memos }, { status: 200 });
  } catch (error) {
    console.error('Error fetching message memos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message memos' },
      { status: 500 }
    );
  }
}

// POST: 伝言メモ作成
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      fromEmployeeId,
      toEmployeeId,
      content,
      priority = 'medium'
    } = body;

    // バリデーション
    if (!fromEmployeeId || !toEmployeeId || !content) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const now = new Date();
    const memoData: Omit<MessageMemo, 'id'> = {
      fromEmployeeId,
      toEmployeeId,
      content,
      priority,
      isRead: false,
      createdAt: now,
    };

    const docRef = await addDoc(collection(db, 'message-memos'), memoData);
    
    return NextResponse.json(
      {
        message: 'Message memo created successfully',
        memoId: docRef.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating message memo:', error);
    return NextResponse.json(
      { error: 'Failed to create message memo' },
      { status: 500 }
    );
  }
}

// PUT: 伝言メモ更新（既読にする）
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { memoId, isRead } = body;

    if (!memoId || isRead === undefined) {
      return NextResponse.json(
        { error: 'Memo ID and read status are required' },
        { status: 400 }
      );
    }

    const updateData: { isRead: boolean; readAt?: Date } = {
      isRead: Boolean(isRead)
    };

    if (isRead) {
      updateData.readAt = new Date();
    }

    await updateDoc(doc(db, 'message-memos', memoId), updateData);
    
    return NextResponse.json(
      { message: 'Message memo updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating message memo:', error);
    return NextResponse.json(
      { error: 'Failed to update message memo' },
      { status: 500 }
    );
  }
}

// DELETE: 伝言メモ削除
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const memoId = url.searchParams.get('memoId');

    if (!memoId) {
      return NextResponse.json(
        { error: 'Memo ID is required' },
        { status: 400 }
      );
    }

    await deleteDoc(doc(db, 'message-memos', memoId));
    
    return NextResponse.json(
      { message: 'Message memo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message memo:', error);
    return NextResponse.json(
      { error: 'Failed to delete message memo' },
      { status: 500 }
    );
  }
}