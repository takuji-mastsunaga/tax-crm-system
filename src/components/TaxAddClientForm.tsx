"use client"

import { useState } from "react"

interface FormData {
  // 基本情報（15項目）
  companyName: string;
  representativeName: string;
  representativeBirthday: string;
  phone1: string;
  phone2: string;
  fax: string;
  email: string;
  postalCode: string;
  address: string;
  industry: string;
  fiscalMonth: string;
  establishedDate: string;
  capitalAmount: string;
  businessContent: string;
  executiveNames: string;

  // 経理・会計関連（8項目）
  accountingMethod: string;
  taxationMethod: string;
  depreciation: string;
  inventoryMethod: string;
  consumptionTaxTreatment: string;
  invoiceRegistrationNumber: string;
  bookkeepingSystem: string;
  monthlyReportFormat: string;

  // 銀行・金融機関（6項目）
  mainBank1: string;
  mainBank2: string;
  mainBank3: string;
  loanAmount: string;
  creditLine: string;
  financialInstitutionRemarks: string;

  // 担当者・スタッフ（6項目）
  clientContactPerson: string;
  clientContactRole: string;
  salesPersonInCharge: string;
  accountingPersonInCharge: string;
  operationPersonInCharge: string;
  staffAssignment: string;

  // 料金・契約（8項目）
  monthlyFee: string;
  journalEntryFee: string;
  payrollFee: string;
  declarationFee: string;
  contractStartDate: string;
  contractPeriod: string;
  paymentTerms: string;
  billingRemarks: string;

  // その他・メモ（6項目）
  clientCharacteristics: string;
  businessHistory: string;
  specialNotes: string;
  riskLevel: string;
  nextActionPlan: string;
  internalRemarks: string;
}

export default function TaxAddClientForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    // 基本情報（15項目）
    companyName: "",
    representativeName: "",
    representativeBirthday: "",
    phone1: "",
    phone2: "",
    fax: "",
    email: "",
    postalCode: "",
    address: "",
    industry: "",
    fiscalMonth: "3",
    establishedDate: "",
    capitalAmount: "",
    businessContent: "",
    executiveNames: "",

    // 経理・会計関連（8項目）
    accountingMethod: "",
    taxationMethod: "",
    depreciation: "",
    inventoryMethod: "",
    consumptionTaxTreatment: "",
    invoiceRegistrationNumber: "",
    bookkeepingSystem: "",
    monthlyReportFormat: "",

    // 銀行・金融機関（6項目）
    mainBank1: "",
    mainBank2: "",
    mainBank3: "",
    loanAmount: "",
    creditLine: "",
    financialInstitutionRemarks: "",

    // 担当者・スタッフ（6項目）
    clientContactPerson: "",
    clientContactRole: "",
    salesPersonInCharge: "",
    accountingPersonInCharge: "",
    operationPersonInCharge: "",
    staffAssignment: "",

    // 料金・契約（8項目）
    monthlyFee: "",
    journalEntryFee: "",
    payrollFee: "",
    declarationFee: "",
    contractStartDate: "",
    contractPeriod: "",
    paymentTerms: "",
    billingRemarks: "",

    // その他・メモ（6項目）
    clientCharacteristics: "",
    businessHistory: "",
    specialNotes: "",
    riskLevel: "",
    nextActionPlan: "",
    internalRemarks: ""
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('=== フォーム送信開始 ===')
    console.log('フォームデータ:', formData)
    
    // 必須項目のバリデーション
    if (!formData.companyName.trim()) {
      console.error('バリデーションエラー: 会社名が未入力')
      alert('会社名・氏名は必須項目です')
      return
    }
    if (!formData.representativeName.trim()) {
      console.error('バリデーションエラー: 代表者名が未入力')
      alert('代表者名は必須項目です')
      return
    }
    if (!formData.phone1.trim()) {
      console.error('バリデーションエラー: 電話番号1が未入力')
      alert('電話番号1は必須項目です')
      return
    }
    if (!formData.email.trim()) {
      console.error('バリデーションエラー: メールアドレスが未入力')
      alert('メールアドレスは必須項目です')
      return
    }
    
    console.log('✅ フロントエンドバリデーション通過')
    
    try {
      console.log('送信データ:', JSON.stringify(formData, null, 2))
      console.log('送信先:', '/api/tax-clients')
      
      const response = await fetch('/api/tax-clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      console.log('HTTPレスポンス:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      const responseData = await response.json()
      console.log('API応答データ:', JSON.stringify(responseData, null, 2))

      if (response.ok) {
        console.log('✅ 登録成功')
        alert(`顧客情報が正常に登録されました\n顧客番号: ${responseData.clientNumber}`)
        // フォームをリセット
        setFormData({
          // 基本情報（15項目）
          companyName: "",
          representativeName: "",
          representativeBirthday: "",
          phone1: "",
          phone2: "",
          fax: "",
          email: "",
          postalCode: "",
          address: "",
          industry: "",
          fiscalMonth: "3",
          establishedDate: "",
          capitalAmount: "",
          businessContent: "",
          executiveNames: "",

          // 経理・会計関連（8項目）
          accountingMethod: "",
          taxationMethod: "",
          depreciation: "",
          inventoryMethod: "",
          consumptionTaxTreatment: "",
          invoiceRegistrationNumber: "",
          bookkeepingSystem: "",
          monthlyReportFormat: "",

          // 銀行・金融機関（6項目）
          mainBank1: "",
          mainBank2: "",
          mainBank3: "",
          loanAmount: "",
          creditLine: "",
          financialInstitutionRemarks: "",

          // 担当者・スタッフ（6項目）
          clientContactPerson: "",
          clientContactRole: "",
          salesPersonInCharge: "",
          accountingPersonInCharge: "",
          operationPersonInCharge: "",
          staffAssignment: "",

          // 料金・契約（8項目）
          monthlyFee: "",
          journalEntryFee: "",
          payrollFee: "",
          declarationFee: "",
          contractStartDate: "",
          contractPeriod: "",
          paymentTerms: "",
          billingRemarks: "",

          // その他・メモ（6項目）
          clientCharacteristics: "",
          businessHistory: "",
          specialNotes: "",
          riskLevel: "",
          nextActionPlan: "",
          internalRemarks: ""
        })
        setCurrentStep(1) // 最初のステップに戻る
        onClose()
        // ページをリロードして最新データを表示
        window.location.reload()
      } else {
        console.error('🚨 API エラー:', {
          status: response.status,
          statusText: response.statusText,
          responseData
        })
        const errorMessage = responseData.error || responseData.details || `HTTP ${response.status}: ${response.statusText}`
        alert(`登録に失敗しました: ${errorMessage}`)
        
        // 詳細エラー情報をコンソールに出力
        if (responseData.details) {
          console.error('詳細エラー:', responseData.details)
        }
        if (responseData.errorMessage) {
          console.error('エラーメッセージ:', responseData.errorMessage)
        }
      }
    } catch (error) {
      console.error('🚨 送信エラー:', error)
      console.error('エラータイプ:', typeof error)
      console.error('エラーメッセージ:', error instanceof Error ? error.message : '不明なエラー')
      console.error('エラースタック:', error instanceof Error ? error.stack : 'スタック情報なし')
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('ネットワークエラー: サーバーに接続できません。インターネット接続を確認してください。')
      } else {
        alert(`登録中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
      }
    }
    
    console.log('=== フォーム送信終了 ===')
  }

  if (!isOpen) return null

  const totalSteps = 5

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">基本情報（1/5）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">会社名・氏名 *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="株式会社○○"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">代表者名 *</label>
                <input
                  type="text"
                  value={formData.representativeName}
                  onChange={(e) => handleInputChange('representativeName', e.target.value)}
                  placeholder="田中太郎"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">代表者生年月日</label>
                <input
                  type="date"
                  value={formData.representativeBirthday}
                  onChange={(e) => handleInputChange('representativeBirthday', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">業種</label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">業種を選択</option>
                  <option value="製造業">製造業</option>
                  <option value="建設業">建設業</option>
                  <option value="不動産業">不動産業</option>
                  <option value="小売業">小売業</option>
                  <option value="卸売業">卸売業</option>
                  <option value="サービス業">サービス業</option>
                  <option value="IT業">IT業</option>
                  <option value="飲食業">飲食業</option>
                  <option value="運輸業">運輸業</option>
                  <option value="その他">その他</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">電話番号1 *</label>
                <input
                  type="tel"
                  value={formData.phone1}
                  onChange={(e) => handleInputChange('phone1', e.target.value)}
                  placeholder="03-1234-5678"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">電話番号2</label>
                <input
                  type="tel"
                  value={formData.phone2}
                  onChange={(e) => handleInputChange('phone2', e.target.value)}
                  placeholder="090-1234-5678"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">FAX</label>
                <input
                  type="tel"
                  value={formData.fax}
                  onChange={(e) => handleInputChange('fax', e.target.value)}
                  placeholder="03-1234-5679"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="example@company.co.jp"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">住所</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="123-4567"
                  className="border rounded-lg px-3 py-2"
                />
                <div className="col-span-3"></div>
              </div>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="東京都渋谷区○○1-1-1"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">決算月 *</label>
                <select
                  value={formData.fiscalMonth}
                  onChange={(e) => handleInputChange('fiscalMonth', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  {Array.from({length: 12}, (_, i) => (
                    <option key={i+1} value={i+1}>{i+1}月</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">設立年月日</label>
                <input
                  type="date"
                  value={formData.establishedDate}
                  onChange={(e) => handleInputChange('establishedDate', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">資本金</label>
                <input
                  type="text"
                  value={formData.capitalAmount}
                  onChange={(e) => handleInputChange('capitalAmount', e.target.value)}
                  placeholder="1,000,000"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">役員名</label>
                <input
                  type="text"
                  value={formData.executiveNames}
                  onChange={(e) => handleInputChange('executiveNames', e.target.value)}
                  placeholder="代表取締役: 田中太郎"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">事業内容</label>
              <textarea
                value={formData.businessContent}
                onChange={(e) => handleInputChange('businessContent', e.target.value)}
                placeholder="主な事業内容をご記入ください"
                className="w-full border rounded-lg px-3 py-2 h-20"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">経理・会計関連（2/5）</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">会計処理方法</label>
                <select
                  value={formData.accountingMethod}
                  onChange={(e) => handleInputChange('accountingMethod', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">選択してください</option>
                  <option value="発生主義">発生主義</option>
                  <option value="現金主義">現金主義</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">課税方式</label>
                <select
                  value={formData.taxationMethod}
                  onChange={(e) => handleInputChange('taxationMethod', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">選択してください</option>
                  <option value="本則課税">本則課税</option>
                  <option value="簡易課税">簡易課税</option>
                  <option value="免税事業者">免税事業者</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">減価償却方法</label>
                <select
                  value={formData.depreciation}
                  onChange={(e) => handleInputChange('depreciation', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">選択してください</option>
                  <option value="定額法">定額法</option>
                  <option value="定率法">定率法</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">棚卸資産評価方法</label>
                <select
                  value={formData.inventoryMethod}
                  onChange={(e) => handleInputChange('inventoryMethod', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">選択してください</option>
                  <option value="先入先出法">先入先出法</option>
                  <option value="総平均法">総平均法</option>
                  <option value="移動平均法">移動平均法</option>
                  <option value="最終仕入原価法">最終仕入原価法</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">消費税処理</label>
                <select
                  value={formData.consumptionTaxTreatment}
                  onChange={(e) => handleInputChange('consumptionTaxTreatment', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">選択してください</option>
                  <option value="税込処理">税込処理</option>
                  <option value="税抜処理">税抜処理</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">帳簿作成システム</label>
                <select
                  value={formData.bookkeepingSystem}
                  onChange={(e) => handleInputChange('bookkeepingSystem', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">選択してください</option>
                  <option value="弥生会計">弥生会計</option>
                  <option value="freee">freee</option>
                  <option value="MFクラウド">MFクラウド</option>
                  <option value="勘定奉行">勘定奉行</option>
                  <option value="その他">その他</option>
                  <option value="手書き">手書き</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">適格請求書登録番号</label>
                <input
                  type="text"
                  value={formData.invoiceRegistrationNumber}
                  onChange={(e) => handleInputChange('invoiceRegistrationNumber', e.target.value)}
                  placeholder="T1234567890123"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">月次報告書形式</label>
                <select
                  value={formData.monthlyReportFormat}
                  onChange={(e) => handleInputChange('monthlyReportFormat', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">選択してください</option>
                  <option value="簡易版">簡易版</option>
                  <option value="詳細版">詳細版</option>
                  <option value="グラフ付き">グラフ付き</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">銀行・金融機関（3/5）</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">メインバンク1</label>
                <input
                  type="text"
                  value={formData.mainBank1}
                  onChange={(e) => handleInputChange('mainBank1', e.target.value)}
                  placeholder="○○銀行 △△支店 普通 1234567"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">メインバンク2</label>
                <input
                  type="text"
                  value={formData.mainBank2}
                  onChange={(e) => handleInputChange('mainBank2', e.target.value)}
                  placeholder="○○銀行 △△支店 普通 1234567"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">メインバンク3</label>
                <input
                  type="text"
                  value={formData.mainBank3}
                  onChange={(e) => handleInputChange('mainBank3', e.target.value)}
                  placeholder="○○銀行 △△支店 普通 1234567"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">借入金残高</label>
                <input
                  type="text"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  placeholder="10,000,000"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">与信枠</label>
                <input
                  type="text"
                  value={formData.creditLine}
                  onChange={(e) => handleInputChange('creditLine', e.target.value)}
                  placeholder="50,000,000"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">金融機関関連備考</label>
              <textarea
                value={formData.financialInstitutionRemarks}
                onChange={(e) => handleInputChange('financialInstitutionRemarks', e.target.value)}
                placeholder="融資条件、担保、保証人等の特記事項"
                className="w-full border rounded-lg px-3 py-2 h-20"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">担当者・料金情報（4/5）</h3>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">担当者情報</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">クライアント側担当者</label>
                  <input
                    type="text"
                    value={formData.clientContactPerson}
                    onChange={(e) => handleInputChange('clientContactPerson', e.target.value)}
                    placeholder="田中経理部長"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">担当者役職</label>
                  <input
                    type="text"
                    value={formData.clientContactRole}
                    onChange={(e) => handleInputChange('clientContactRole', e.target.value)}
                    placeholder="経理部長"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">営業担当</label>
                  <select
                    value={formData.salesPersonInCharge}
                    onChange={(e) => handleInputChange('salesPersonInCharge', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">選択してください</option>
                    <option value="太田事務">太田事務</option>
                    <option value="山田会計士">山田会計士</option>
                    <option value="佐藤税理士">佐藤税理士</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">会計担当</label>
                  <select
                    value={formData.accountingPersonInCharge}
                    onChange={(e) => handleInputChange('accountingPersonInCharge', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">選択してください</option>
                    <option value="太田事務">太田事務</option>
                    <option value="山田会計士">山田会計士</option>
                    <option value="佐藤税理士">佐藤税理士</option>
                    <option value="田中スタッフ">田中スタッフ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">実務担当</label>
                  <select
                    value={formData.operationPersonInCharge}
                    onChange={(e) => handleInputChange('operationPersonInCharge', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">選択してください</option>
                    <option value="太田事務">太田事務</option>
                    <option value="田中スタッフ">田中スタッフ</option>
                    <option value="鈴木補助者">鈴木補助者</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">料金・契約情報</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">月額顧問料</label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => handleInputChange('monthlyFee', e.target.value)}
                    placeholder="50000"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">仕訳代（1件あたり）</label>
                  <input
                    type="number"
                    value={formData.journalEntryFee}
                    onChange={(e) => handleInputChange('journalEntryFee', e.target.value)}
                    placeholder="500"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">給与計算料</label>
                  <input
                    type="number"
                    value={formData.payrollFee}
                    onChange={(e) => handleInputChange('payrollFee', e.target.value)}
                    placeholder="20000"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">申告書作成料</label>
                  <input
                    type="number"
                    value={formData.declarationFee}
                    onChange={(e) => handleInputChange('declarationFee', e.target.value)}
                    placeholder="100000"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">契約開始日</label>
                  <input
                    type="date"
                    value={formData.contractStartDate}
                    onChange={(e) => handleInputChange('contractStartDate', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">契約期間</label>
                  <select
                    value={formData.contractPeriod}
                    onChange={(e) => handleInputChange('contractPeriod', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">選択してください</option>
                    <option value="1年">1年</option>
                    <option value="2年">2年</option>
                    <option value="3年">3年</option>
                    <option value="自動更新">自動更新</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">支払条件</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">選択してください</option>
                    <option value="月末締翌月末払い">月末締翌月末払い</option>
                    <option value="月末締翌々月末払い">月末締翌々月末払い</option>
                    <option value="20日締翌月20日払い">20日締翌月20日払い</option>
                    <option value="その他">その他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">スタッフ配置</label>
                  <input
                    type="text"
                    value={formData.staffAssignment}
                    onChange={(e) => handleInputChange('staffAssignment', e.target.value)}
                    placeholder="メインスタッフ、サブスタッフ"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">請求関連備考</label>
                <textarea
                  value={formData.billingRemarks}
                  onChange={(e) => handleInputChange('billingRemarks', e.target.value)}
                  placeholder="請求書の送付方法、支払方法等の特記事項"
                  className="w-full border rounded-lg px-3 py-2 h-16"
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">その他・メモ（5/5）</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">顧客特性</label>
                <textarea
                  value={formData.clientCharacteristics}
                  onChange={(e) => handleInputChange('clientCharacteristics', e.target.value)}
                  placeholder="業界の特徴、取引の傾向、コミュニケーションスタイル等"
                  className="w-full border rounded-lg px-3 py-2 h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">事業沿革</label>
                <textarea
                  value={formData.businessHistory}
                  onChange={(e) => handleInputChange('businessHistory', e.target.value)}
                  placeholder="会社の設立経緯、主要な事業変遷等"
                  className="w-full border rounded-lg px-3 py-2 h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">特記事項</label>
                <textarea
                  value={formData.specialNotes}
                  onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                  placeholder="契約上の注意点、特別な要求事項等"
                  className="w-full border rounded-lg px-3 py-2 h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">リスクレベル</label>
                  <select
                    value={formData.riskLevel}
                    onChange={(e) => handleInputChange('riskLevel', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">選択してください</option>
                    <option value="低">低</option>
                    <option value="中">中</option>
                    <option value="高">高</option>
                  </select>
                </div>
                <div></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">次回アクションプラン</label>
                <textarea
                  value={formData.nextActionPlan}
                  onChange={(e) => handleInputChange('nextActionPlan', e.target.value)}
                  placeholder="次回面談予定、必要な資料、確認事項等"
                  className="w-full border rounded-lg px-3 py-2 h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">内部メモ</label>
                <textarea
                  value={formData.internalRemarks}
                  onChange={(e) => handleInputChange('internalRemarks', e.target.value)}
                  placeholder="スタッフ間の申し送り事項、注意点等"
                  className="w-full border rounded-lg px-3 py-2 h-20"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="p-6 border-b bg-purple-50 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">新規顧客登録（49項目）</h2>
              <p className="text-gray-600 mt-1">ステップ {currentStep} / {totalSteps}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              ×
            </button>
          </div>
          
          {/* プログレスバー */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* コンテンツ */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
          <div className="flex-1 overflow-y-auto p-6">
            {renderStep()}
          </div>

          {/* フッター */}
          <div className="flex justify-between items-center p-6 border-t bg-gray-50 flex-shrink-0">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ← 前へ
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  次へ →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  💾 登録完了
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
