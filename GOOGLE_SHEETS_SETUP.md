# 🔗 Google Sheets連携セットアップガイド

## 📋 必要な環境変数

以下の環境変数を`.env.local`に追加してください：

```bash
# Google Sheets API設定
GOOGLE_SHEETS_ID=your_spreadsheet_id_here
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your_client_id
```

## 🚀 セットアップ手順

### Step 1: Google Cloud Projectの設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成または既存プロジェクトを選択
3. Google Sheets API を有効化:
   - APIライブラリ → "Google Sheets API" を検索 → 有効化

### Step 2: Service Accountの作成

1. IAMと管理 → サービスアカウント
2. 「サービスアカウントを作成」をクリック
3. 名前: `tax-crm-sheets-service`
4. 説明: `Tax CRM Google Sheets連携用`
5. 「作成して続行」

### Step 3: 認証キーの生成

1. 作成したサービスアカウントをクリック
2. 「キー」タブ → 「キーを追加」 → 「新しいキーを作成」
3. **JSON形式**を選択してダウンロード
4. ダウンロードしたJSONファイルから以下の値を取得:

```json
{
  "type": "service_account",
  "project_id": "← GOOGLE_PROJECT_ID",
  "private_key_id": "← GOOGLE_PRIVATE_KEY_ID", 
  "private_key": "← GOOGLE_PRIVATE_KEY",
  "client_email": "← GOOGLE_CLIENT_EMAIL",
  "client_id": "← GOOGLE_CLIENT_ID"
}
```

### Step 4: Google Sheetsの設定

1. [Google Sheets](https://sheets.google.com/)で新しいスプレッドシートを作成
2. スプレッドシートのURLから**SPREADSHEET_ID**を取得:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```
3. スプレッドシートを**Service Accountと共有**:
   - 「共有」ボタンをクリック
   - Service Accountのメールアドレスを追加
   - 権限: 「編集者」

### Step 5: 環境変数の設定

`.env.local`ファイルに値を設定:

```bash
GOOGLE_SHEETS_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
GOOGLE_PROJECT_ID=tax-crm-project-12345
GOOGLE_PRIVATE_KEY_ID=abcd1234...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL=tax-crm-sheets-service@tax-crm-project-12345.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=123456789012345678901
```

## 🔄 API使用方法

### 初期化
```bash
curl -X PUT http://localhost:3000/api/google-sheets
```

### データ追加
```bash
curl -X POST http://localhost:3000/api/google-sheets \
  -H "Content-Type: application/json" \
  -d '{"clientNumber":"CL001","companyName":"テスト会社",...}'
```

### データ取得
```bash
curl http://localhost:3000/api/google-sheets
```

## 📊 自動同期機能

顧客登録時に以下が自動実行されます：
1. ✅ Firebase Firestore保存
2. ✅ Google Sheets同期
3. ✅ BigQuery自動連携

## 🚨 トラブルシューティング

### よくあるエラー

**認証エラー**: 
- Service Accountのメールアドレスがスプレッドシートに共有されているか確認
- `GOOGLE_PRIVATE_KEY`の改行文字（\n）が正しく設定されているか確認

**権限エラー**:
- Google Sheets APIが有効になっているか確認
- Service Accountに適切な権限があるか確認

**スプレッドシートが見つからない**:
- `GOOGLE_SHEETS_ID`が正しいか確認
- スプレッドシートのアクセス権限を確認

## 🎯 機能一覧

- ✅ 49項目完全対応
- ✅ リアルタイム同期
- ✅ 自動ヘッダー設定
- ✅ エラーハンドリング
- ✅ ログ記録
- ✅ 日本語対応 