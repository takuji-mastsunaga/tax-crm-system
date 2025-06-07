import { NextRequest, NextResponse } from 'next/server'
import { initializeSpreadsheet, addClientToSheets, getAllClientsFromSheets, ClientDataForSheets } from '../../../lib/google-sheets'

// POST: Google Sheetsにデータ追加
export async function POST(request: NextRequest) {
  try {
    console.log('=== Google Sheets API POST開始 ===')
    
    const data: ClientDataForSheets = await request.json()
    console.log('受信データ:', data)

    // スプレッドシートの初期化
    await initializeSpreadsheet()

    // データを追加
    const success = await addClientToSheets(data)

    if (success) {
      console.log('=== Google Sheets API POST成功 ===')
      return NextResponse.json({ 
        success: true, 
        message: 'Google Sheetsに正常に追加されました' 
      })
    } else {
      console.error('=== Google Sheets API POST失敗 ===')
      return NextResponse.json(
        { error: 'Google Sheetsへの追加に失敗しました' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('=== Google Sheets API POST エラー ===')
    console.error('エラー詳細:', error)
    
    return NextResponse.json(
      { 
        error: 'Google Sheets API エラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    )
  }
}

// GET: Google Sheetsからデータ取得
export async function GET() {
  try {
    console.log('=== Google Sheets API GET開始 ===')
    
    const clients = await getAllClientsFromSheets()
    
    console.log(`=== Google Sheets API GET成功: ${clients.length}件 ===`)
    return NextResponse.json({ 
      success: true,
      clients,
      count: clients.length
    })

  } catch (error) {
    console.error('=== Google Sheets API GET エラー ===')
    console.error('エラー詳細:', error)
    
    return NextResponse.json(
      { 
        error: 'Google Sheetsからのデータ取得に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    )
  }
}

// PUT: Google Sheetsスプレッドシート初期化
export async function PUT() {
  try {
    console.log('=== Google Sheets初期化 API開始 ===')
    
    const success = await initializeSpreadsheet()
    
    if (success) {
      console.log('=== Google Sheets初期化 API成功 ===')
      return NextResponse.json({ 
        success: true, 
        message: 'Google Sheetsの初期化が完了しました' 
      })
    } else {
      console.error('=== Google Sheets初期化 API失敗 ===')
      return NextResponse.json(
        { error: 'Google Sheetsの初期化に失敗しました' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('=== Google Sheets初期化 API エラー ===')
    console.error('エラー詳細:', error)
    
    return NextResponse.json(
      { 
        error: 'Google Sheets初期化でエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    )
  }
} 