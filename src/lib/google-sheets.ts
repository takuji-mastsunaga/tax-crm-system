import { google } from 'googleapis'

// Google Sheets設定
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms' // デモ用ID
const SHEET_NAME = '顧客情報'

// Service Account認証
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

const sheets = google.sheets({ version: 'v4', auth })

// ヘッダー行の定義（49項目）
const HEADERS = [
  // システム項目
  '顧客番号', '作成日時', '更新日時',
  
  // 基本情報（15項目）
  '会社名・氏名', '代表者名', '代表者生年月日', '電話番号1', '電話番号2', 'FAX', 
  'メールアドレス', '郵便番号', '住所', '業種', '決算月', '設立年月日', 
  '資本金', '事業内容', '役員名',
  
  // 経理・会計関連（8項目）
  '会計処理方法', '課税方式', '減価償却方法', '棚卸資産評価方法', 
  '消費税処理', '適格請求書登録番号', '帳簿作成システム', '月次報告書形式',
  
  // 銀行・金融機関（6項目）
  'メインバンク1', 'メインバンク2', 'メインバンク3', '借入金残高', '与信枠', '金融機関関連備考',
  
  // 担当者・スタッフ（6項目）
  'クライアント側担当者', '担当者役職', '営業担当', '会計担当', '実務担当', 'スタッフ配置',
  
  // 料金・契約（8項目）
  '月額顧問料', '仕訳代', '給与計算料', '申告書作成料', 
  '契約開始日', '契約期間', '支払条件', '請求関連備考',
  
  // その他・メモ（6項目）
  '顧客特性', '事業沿革', '特記事項', 'リスクレベル', '次回アクションプラン', '内部メモ'
]

export interface ClientDataForSheets {
  // システム項目
  clientNumber: string
  createdAt: string
  updatedAt: string
  
  // 基本情報（15項目）
  companyName: string
  representativeName: string
  representativeBirthday: string
  phone1: string
  phone2: string
  fax: string
  email: string
  postalCode: string
  address: string
  industry: string
  fiscalMonth: string
  establishedDate: string
  capitalAmount: string
  businessContent: string
  executiveNames: string
  
  // 経理・会計関連（8項目）
  accountingMethod: string
  taxationMethod: string
  depreciation: string
  inventoryMethod: string
  consumptionTaxTreatment: string
  invoiceRegistrationNumber: string
  bookkeepingSystem: string
  monthlyReportFormat: string
  
  // 銀行・金融機関（6項目）
  mainBank1: string
  mainBank2: string
  mainBank3: string
  loanAmount: string
  creditLine: string
  financialInstitutionRemarks: string
  
  // 担当者・スタッフ（6項目）
  clientContactPerson: string
  clientContactRole: string
  salesPersonInCharge: string
  accountingPersonInCharge: string
  operationPersonInCharge: string
  staffAssignment: string
  
  // 料金・契約（8項目）
  monthlyFee: string
  journalEntryFee: string
  payrollFee: string
  declarationFee: string
  contractStartDate: string
  contractPeriod: string
  paymentTerms: string
  billingRemarks: string
  
  // その他・メモ（6項目）
  clientCharacteristics: string
  businessHistory: string
  specialNotes: string
  riskLevel: string
  nextActionPlan: string
  internalRemarks: string
}

// スプレッドシートの初期化（ヘッダー行作成）
export async function initializeSpreadsheet(): Promise<boolean> {
  try {
    console.log('=== Google Sheets初期化開始 ===')
    
    // シートの存在確認
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    })
    
    const sheetExists = spreadsheet.data.sheets?.some(
      sheet => sheet.properties?.title === SHEET_NAME
    )
    
    if (!sheetExists) {
      // シートが存在しない場合は作成
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: SHEET_NAME
              }
            }
          }]
        }
      })
      console.log(`シート「${SHEET_NAME}」を作成しました`)
    }
    
    // ヘッダー行の設定
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:AZ1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [HEADERS]
      }
    })
    
    console.log('=== Google Sheets初期化完了 ===')
    return true
    
  } catch (error) {
    console.error('Google Sheets初期化エラー:', error)
    return false
  }
}

// 顧客データをスプレッドシートに追加
export async function addClientToSheets(clientData: ClientDataForSheets): Promise<boolean> {
  try {
    console.log('=== Google Sheets追加開始 ===')
    console.log('追加データ:', clientData)
    
    // データを配列形式に変換
    const values = [
      // システム項目
      clientData.clientNumber,
      clientData.createdAt,
      clientData.updatedAt,
      
      // 基本情報（15項目）
      clientData.companyName,
      clientData.representativeName,
      clientData.representativeBirthday,
      clientData.phone1,
      clientData.phone2,
      clientData.fax,
      clientData.email,
      clientData.postalCode,
      clientData.address,
      clientData.industry,
      clientData.fiscalMonth,
      clientData.establishedDate,
      clientData.capitalAmount,
      clientData.businessContent,
      clientData.executiveNames,
      
      // 経理・会計関連（8項目）
      clientData.accountingMethod,
      clientData.taxationMethod,
      clientData.depreciation,
      clientData.inventoryMethod,
      clientData.consumptionTaxTreatment,
      clientData.invoiceRegistrationNumber,
      clientData.bookkeepingSystem,
      clientData.monthlyReportFormat,
      
      // 銀行・金融機関（6項目）
      clientData.mainBank1,
      clientData.mainBank2,
      clientData.mainBank3,
      clientData.loanAmount,
      clientData.creditLine,
      clientData.financialInstitutionRemarks,
      
      // 担当者・スタッフ（6項目）
      clientData.clientContactPerson,
      clientData.clientContactRole,
      clientData.salesPersonInCharge,
      clientData.accountingPersonInCharge,
      clientData.operationPersonInCharge,
      clientData.staffAssignment,
      
      // 料金・契約（8項目）
      clientData.monthlyFee,
      clientData.journalEntryFee,
      clientData.payrollFee,
      clientData.declarationFee,
      clientData.contractStartDate,
      clientData.contractPeriod,
      clientData.paymentTerms,
      clientData.billingRemarks,
      
      // その他・メモ（6項目）
      clientData.clientCharacteristics,
      clientData.businessHistory,
      clientData.specialNotes,
      clientData.riskLevel,
      clientData.nextActionPlan,
      clientData.internalRemarks
    ]
    
    // スプレッドシートに行を追加
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:AZ`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [values]
      }
    })
    
    console.log('Google Sheets追加完了:', result.data)
    console.log('=== Google Sheets追加終了 ===')
    return true
    
  } catch (error) {
    console.error('Google Sheets追加エラー:', error)
    return false
  }
}

// スプレッドシートから全顧客データを取得
export async function getAllClientsFromSheets(): Promise<ClientDataForSheets[]> {
  try {
    console.log('=== Google Sheetsデータ取得開始 ===')
    
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:AZ` // ヘッダー行を除く
    })
    
    const rows = result.data.values || []
    const clients: ClientDataForSheets[] = []
    
    for (const row of rows) {
      if (row.length > 0) {
        const client: ClientDataForSheets = {
          // システム項目
          clientNumber: row[0] || '',
          createdAt: row[1] || '',
          updatedAt: row[2] || '',
          
          // 基本情報（15項目）
          companyName: row[3] || '',
          representativeName: row[4] || '',
          representativeBirthday: row[5] || '',
          phone1: row[6] || '',
          phone2: row[7] || '',
          fax: row[8] || '',
          email: row[9] || '',
          postalCode: row[10] || '',
          address: row[11] || '',
          industry: row[12] || '',
          fiscalMonth: row[13] || '',
          establishedDate: row[14] || '',
          capitalAmount: row[15] || '',
          businessContent: row[16] || '',
          executiveNames: row[17] || '',
          
          // 経理・会計関連（8項目）
          accountingMethod: row[18] || '',
          taxationMethod: row[19] || '',
          depreciation: row[20] || '',
          inventoryMethod: row[21] || '',
          consumptionTaxTreatment: row[22] || '',
          invoiceRegistrationNumber: row[23] || '',
          bookkeepingSystem: row[24] || '',
          monthlyReportFormat: row[25] || '',
          
          // 銀行・金融機関（6項目）
          mainBank1: row[26] || '',
          mainBank2: row[27] || '',
          mainBank3: row[28] || '',
          loanAmount: row[29] || '',
          creditLine: row[30] || '',
          financialInstitutionRemarks: row[31] || '',
          
          // 担当者・スタッフ（6項目）
          clientContactPerson: row[32] || '',
          clientContactRole: row[33] || '',
          salesPersonInCharge: row[34] || '',
          accountingPersonInCharge: row[35] || '',
          operationPersonInCharge: row[36] || '',
          staffAssignment: row[37] || '',
          
          // 料金・契約（8項目）
          monthlyFee: row[38] || '',
          journalEntryFee: row[39] || '',
          payrollFee: row[40] || '',
          declarationFee: row[41] || '',
          contractStartDate: row[42] || '',
          contractPeriod: row[43] || '',
          paymentTerms: row[44] || '',
          billingRemarks: row[45] || '',
          
          // その他・メモ（6項目）
          clientCharacteristics: row[46] || '',
          businessHistory: row[47] || '',
          specialNotes: row[48] || '',
          riskLevel: row[49] || '',
          nextActionPlan: row[50] || '',
          internalRemarks: row[51] || ''
        }
        clients.push(client)
      }
    }
    
    console.log(`Google Sheetsから${clients.length}件のデータを取得`)
    console.log('=== Google Sheetsデータ取得完了 ===')
    return clients
    
  } catch (error) {
    console.error('Google Sheetsデータ取得エラー:', error)
    return []
  }
} 