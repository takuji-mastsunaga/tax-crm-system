import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
// import { addClientToSheets, ClientDataForSheets } from '../../../lib/google-sheets'

// GET: 顧客一覧取得
export async function GET() {
  try {
    console.log('=== 顧客一覧取得API開始 ===')
    
    const q = query(collection(db, 'tax-clients'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    const clients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log(`取得した顧客数: ${clients.length}`)
    console.log('=== 顧客一覧取得API完了 ===')

    return NextResponse.json({ clients })

  } catch (error) {
    console.error('=== 顧客一覧取得API エラー ===')
    console.error('エラー詳細:', error)
    
    return NextResponse.json(
      { 
        error: 'データ取得エラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    )
  }
}

// POST: 新規顧客登録
export async function POST(request: NextRequest) {
  try {
    console.log('=== 顧客登録API開始 ===')
    
    const data = await request.json()
    console.log('受信データ:', data)

    // 必須項目のバリデーション
    if (!data.companyName?.trim()) {
      console.error('バリデーションエラー: 会社名が未入力')
      return NextResponse.json(
        { error: '会社名・氏名は必須項目です' },
        { status: 400 }
      )
    }

    if (!data.representativeName?.trim()) {
      console.error('バリデーションエラー: 代表者名が未入力')
      return NextResponse.json(
        { error: '代表者名は必須項目です' },
        { status: 400 }
      )
    }

    if (!data.phone1?.trim()) {
      console.error('バリデーションエラー: 電話番号1が未入力')
      return NextResponse.json(
        { error: '電話番号1は必須項目です' },
        { status: 400 }
      )
    }

    if (!data.email?.trim()) {
      console.error('バリデーションエラー: メールアドレスが未入力')
      return NextResponse.json(
        { error: 'メールアドレスは必須項目です' },
        { status: 400 }
      )
    }

    // 顧客番号の生成（現在の日時ベース）
    const now = new Date()
    const clientNumber = `CL${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

    // 49項目すべてを含むFirestore用データ構造
    const clientData = {
      // システム項目
      clientNumber,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),

      // 基本情報（15項目）
      companyName: data.companyName?.trim() || '',
      representativeName: data.representativeName?.trim() || '',
      representativeBirthday: data.representativeBirthday || '',
      phone1: data.phone1?.trim() || '',
      phone2: data.phone2?.trim() || '',
      fax: data.fax?.trim() || '',
      email: data.email?.trim() || '',
      postalCode: data.postalCode?.trim() || '',
      address: data.address?.trim() || '',
      industry: data.industry || '',
      fiscalMonth: data.fiscalMonth || '3',
      establishedDate: data.establishedDate || '',
      capitalAmount: data.capitalAmount?.trim() || '',
      businessContent: data.businessContent?.trim() || '',
      executiveNames: data.executiveNames?.trim() || '',

      // 経理・会計関連（8項目）
      accountingMethod: data.accountingMethod || '',
      taxationMethod: data.taxationMethod || '',
      depreciation: data.depreciation || '',
      inventoryMethod: data.inventoryMethod || '',
      consumptionTaxTreatment: data.consumptionTaxTreatment || '',
      invoiceRegistrationNumber: data.invoiceRegistrationNumber?.trim() || '',
      bookkeepingSystem: data.bookkeepingSystem || '',
      monthlyReportFormat: data.monthlyReportFormat || '',

      // 銀行・金融機関（6項目）
      mainBank1: data.mainBank1?.trim() || '',
      mainBank2: data.mainBank2?.trim() || '',
      mainBank3: data.mainBank3?.trim() || '',
      loanAmount: data.loanAmount?.trim() || '',
      creditLine: data.creditLine?.trim() || '',
      financialInstitutionRemarks: data.financialInstitutionRemarks?.trim() || '',

      // 担当者・スタッフ（6項目）
      clientContactPerson: data.clientContactPerson?.trim() || '',
      clientContactRole: data.clientContactRole?.trim() || '',
      salesPersonInCharge: data.salesPersonInCharge || '',
      accountingPersonInCharge: data.accountingPersonInCharge || '',
      operationPersonInCharge: data.operationPersonInCharge || '',
      staffAssignment: data.staffAssignment?.trim() || '',

      // 料金・契約（8項目）
      monthlyFee: data.monthlyFee?.trim() || '',
      journalEntryFee: data.journalEntryFee?.trim() || '',
      payrollFee: data.payrollFee?.trim() || '',
      declarationFee: data.declarationFee?.trim() || '',
      contractStartDate: data.contractStartDate || '',
      contractPeriod: data.contractPeriod || '',
      paymentTerms: data.paymentTerms || '',
      billingRemarks: data.billingRemarks?.trim() || '',

      // その他・メモ（6項目）
      clientCharacteristics: data.clientCharacteristics?.trim() || '',
      businessHistory: data.businessHistory?.trim() || '',
      specialNotes: data.specialNotes?.trim() || '',
      riskLevel: data.riskLevel || '',
      nextActionPlan: data.nextActionPlan?.trim() || '',
      internalRemarks: data.internalRemarks?.trim() || ''
    }

    console.log('Firestore保存データ:', clientData)

    // Firestoreに保存
    const docRef = await addDoc(collection(db, 'tax-clients'), clientData)
    console.log('Firestore保存完了. ドキュメントID:', docRef.id)

    // 🔄 Google Sheetsにも同時保存（一時的に無効化）
    console.log('=== Google Sheets同期開始（スキップ） ===')
    try {
      // 環境変数チェック
      const hasGoogleSheetsConfig = !!(
        process.env.GOOGLE_SHEETS_ID && 
        process.env.GOOGLE_PROJECT_ID && 
        process.env.GOOGLE_PRIVATE_KEY &&
        process.env.GOOGLE_CLIENT_EMAIL
      )
      
      if (hasGoogleSheetsConfig) {
        console.log('⚠️ Google Sheets設定検出済みですが、一時的にスキップします')
        // const { addClientToSheets } = await import('../../../lib/google-sheets')
        // const sheetsData: ClientDataForSheets = clientData as ClientDataForSheets
        // const sheetsSuccess = await addClientToSheets(sheetsData)
        // 
        // if (sheetsSuccess) {
        //   console.log('✅ Google Sheets同期成功')
        // } else {
        //   console.warn('⚠️ Google Sheets同期失敗（Firestoreは正常保存）')
        // }
      } else {
        console.log('ℹ️ Google Sheets環境変数未設定 - Firebase保存のみ実行')
      }
    } catch (sheetsError) {
      console.error('🚨 Google Sheets同期エラー:', sheetsError)
      // Google SheetsエラーでもFirestore保存は成功なので処理続行
    }

    // 成功レスポンス
    const response = {
      success: true,
      clientNumber,
      documentId: docRef.id,
      message: '顧客情報が正常に登録されました（Firebase保存完了）'
    }

    console.log('=== 顧客登録API完了 ===')
    console.log('レスポンス:', response)

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('=== 顧客登録API エラー ===')
    console.error('エラー詳細:', error)
    
    return NextResponse.json(
      { 
        error: 'サーバーエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    )
  }
}
