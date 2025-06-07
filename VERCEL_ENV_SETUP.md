# 🌐 Vercel環境変数設定ガイド

## 🎯 Google Sheets連携のためのVercel設定

### **Step 1: Google Cloud Console設定**

1. **[Google Cloud Console](https://console.cloud.google.com/)**にアクセス
2. **新しいプロジェクト作成**または既存選択
3. **Google Sheets API有効化**:
   ```
   ナビゲーション → APIとサービス → ライブラリ
   → "Google Sheets API" 検索 → 有効化
   ```

### **Step 2: Service Account作成**

1. **IAMと管理 → サービスアカウント**
2. **「サービスアカウントを作成」**
3. **設定**:
   - 名前: `tax-crm-sheets-service`
   - 説明: `Tax CRM Google Sheets連携用`
4. **「作成して続行」**

### **Step 3: 認証キー生成**

1. **作成したサービスアカウントをクリック**
2. **「キー」タブ → 「キーを追加」 → 「新しいキーを作成」**
3. **JSON形式**を選択してダウンロード

### **Step 4: Google Sheetsスプレッドシート作成**

1. **[Google Sheets](https://sheets.google.com/)**で新しいスプレッドシート作成
2. **スプレッドシート名**: `税務CRM顧客データベース`
3. **URLからSPREADSHEET_ID取得**:
   ```
   https://docs.google.com/spreadsheets/d/[この部分がSPREADSHEET_ID]/edit
   ```
4. **共有設定**:
   - 「共有」ボタンクリック
   - Service Accountのメールアドレス（`xxx@xxx.iam.gserviceaccount.com`）を追加
   - **権限: 「編集者」**

### **Step 5: Vercel環境変数設定**

1. **[Vercel Dashboard](https://vercel.com/dashboard)**にアクセス
2. **プロジェクト選択**: `tax-crm-system-v3`
3. **Settings → Environment Variables**
4. **以下の環境変数を追加**:

#### 🔑 **必須環境変数**

| 変数名 | 値 | 説明 |
|--------|-----|-----|
| `GOOGLE_SHEETS_ID` | `1BxiMVs0XRA5nFMdKv...` | スプレッドシートID |
| `GOOGLE_PROJECT_ID` | `tax-crm-project-12345` | Google CloudプロジェクトID |
| `GOOGLE_PRIVATE_KEY_ID` | `abcd1234efgh5678...` | サービスアカウントキーID |
| `GOOGLE_PRIVATE_KEY` | `"-----BEGIN PRIVATE KEY-----\nMII..."` | サービスアカウント秘密鍵 |
| `GOOGLE_CLIENT_EMAIL` | `tax-crm@xxx.iam.gserviceaccount.com` | サービスアカウントメール |
| `GOOGLE_CLIENT_ID` | `123456789012345678901` | サービスアカウントクライアントID |

#### 🚨 **重要な注意点**

**GOOGLE_PRIVATE_KEY設定時**:
```bash
# ✅ 正しい形式（改行文字を\nとして設定）
"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w...\n-----END PRIVATE KEY-----"

# ❌ 間違った形式
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w...
-----END PRIVATE KEY-----
```

### **Step 6: デプロイ確認**

1. **Vercel → Deployments**
2. **最新デプロイのステータス確認**
3. **Functions → Edge Functions**でGoogle Sheets API動作確認

### **Step 7: 機能テスト**

#### **初期化テスト**
```bash
curl -X PUT https://tax-crm-system-v3.vercel.app/api/google-sheets
```

#### **データ追加テスト**
```bash
curl -X POST https://tax-crm-system-v3.vercel.app/api/google-sheets \
  -H "Content-Type: application/json" \
  -d '{
    "clientNumber": "TEST001",
    "companyName": "テスト会社",
    "representativeName": "テスト代表者",
    "phone1": "03-1234-5678",
    "email": "test@example.com",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }'
```

#### **データ取得テスト**
```bash
curl https://tax-crm-system-v3.vercel.app/api/google-sheets
```

### **Step 8: ダッシュボード確認**

1. **https://tax-crm-system-v3.vercel.app/tax-dashboard**
2. **Google Sheetsカード確認**
3. **「初期化」ボタンクリック**
4. **「全同期」ボタンテスト**

## 🎯 **環境変数設定例**

### **例: JSON認証ファイルの内容**
```json
{
  "type": "service_account",
  "project_id": "tax-crm-project-12345",
  "private_key_id": "abcd1234efgh5678...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----",
  "client_email": "tax-crm-sheets-service@tax-crm-project-12345.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

### **Vercel環境変数対応表**
```bash
GOOGLE_PROJECT_ID=tax-crm-project-12345
GOOGLE_PRIVATE_KEY_ID=abcd1234efgh5678...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADA..."
GOOGLE_CLIENT_EMAIL=tax-crm-sheets-service@tax-crm-project-12345.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=123456789012345678901
GOOGLE_SHEETS_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
```

## 🚨 **トラブルシューティング**

### **よくあるエラー**

1. **認証エラー**:
   - Service Accountメールがスプレッドシートに共有されているか確認
   - `GOOGLE_PRIVATE_KEY`の改行文字設定確認

2. **権限エラー**:
   - Google Sheets APIが有効か確認
   - Service Account権限確認

3. **スプレッドシート見つからない**:
   - `GOOGLE_SHEETS_ID`確認
   - スプレッドシートアクセス権限確認

### **デバッグ方法**

**Vercel Function Logs確認**:
```bash
vercel logs https://tax-crm-system-v3.vercel.app
```

**ローカルテスト**:
```bash
npm run dev
# http://localhost:3000/api/google-sheets
```

## ✅ **設定完了チェックリスト**

- [ ] Google Cloud Projectサービスアカウント作成
- [ ] Google Sheets API有効化
- [ ] 認証JSONキー取得
- [ ] Google Sheetsスプレッドシート作成・共有
- [ ] Vercel環境変数6項目設定
- [ ] デプロイ成功確認
- [ ] API動作テスト完了
- [ ] ダッシュボード機能確認

## 🎉 **完成後の機能**

✅ **自動同期**: 顧客登録時にFirebase + Google Sheets同時保存
✅ **リアルタイム**: ダッシュボードでの同期ステータス表示
✅ **手動同期**: 一括同期・初期化機能
✅ **49項目対応**: 全顧客データ完全対応
✅ **エラーハンドリング**: 詳細ログとエラー表示 