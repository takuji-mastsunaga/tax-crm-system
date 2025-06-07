// 従業員管理システムの型定義

export interface Employee {
  // システム項目
  id: string;                    // Firestore自動生成ID
  employeeNumber: string;        // 従業員番号（自動生成: EMP20250608-001）
  createdAt: Date;              // 作成日時
  updatedAt: Date;              // 更新日時

  // 基本情報
  name: string;                 // 名前
  email: string;                // メールアドレス（認証用）
  
  // 勤務情報
  workType: 'full-time' | 'part-time' | 'contract' | 'temporary'; // 勤務形態
  dailyWorkingHours: number;    // 所定労働時間（h/日）
  monthlyWorkingDays: number;   // 月間所定日数
  hourlyRate: number;           // 時間給

  // 追加情報
  department?: string;          // 所属部署
  position?: string;            // 職位
  startDate?: Date;             // 入社日
  profilePhoto?: string;        // プロフィール写真URL
  status: 'active' | 'inactive' | 'on-leave'; // ステータス
}

// 勤怠記録
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;                 // YYYY-MM-DD形式
  clockInTime?: Date;           // 出勤時刻
  clockOutTime?: Date;          // 退勤時刻
  totalWorkingHours?: number;   // 実働時間
  status: 'present' | 'absent' | 'late' | 'early-leave'; // 出勤状況
  createdAt: Date;
  updatedAt: Date;
}

// 工数記録
export interface WorkLog {
  id: string;
  employeeId: string;
  clientId?: string;            // 顧客ID（既存のClientとリンク）
  date: string;                 // YYYY-MM-DD形式
  workDescription: string;      // 作業内容
  hours: number;                // 工数（0.25h単位）
  billable: boolean;            // ビラブル/ノンビラブル
  category: 'client-work' | 'internal' | 'training' | 'meeting' | 'other'; // 作業カテゴリ
  createdAt: Date;
  updatedAt: Date;
}

// 伝言メモ
export interface MessageMemo {
  id: string;
  fromEmployeeId: string;       // 送信者従業員ID
  toEmployeeId: string;         // 受信者従業員ID
  content: string;              // メモ内容
  isRead: boolean;              // 既読フラグ
  priority: 'low' | 'medium' | 'high'; // 優先度
  createdAt: Date;
  readAt?: Date;                // 既読日時
}

// 従業員KPI
export interface EmployeeKPI {
  employeeId: string;
  month: string;                // YYYY-MM形式
  totalHours: number;           // 総労働時間
  billableHours: number;        // ビラブル時間
  nonBillableHours: number;     // ノンビラブル時間
  billableRate: number;         // ビラブル率（%）
  revenue: number;              // 売上貢献額
  efficiency: number;           // 効率性指標
}

// 通知
export interface Notification {
  id: string;
  employeeId: string;
  type: 'memo' | 'deadline' | 'announcement' | 'system'; // 通知タイプ
  title: string;                // 通知タイトル
  content: string;              // 通知内容
  isRead: boolean;              // 既読フラグ
  priority: 'low' | 'medium' | 'high'; // 優先度
  createdAt: Date;
  readAt?: Date;
}

// ダッシュボード統計
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  todayAttendance: number;
  pendingTasks: number;
  unreadMessages: number;
  nextDeadlines: Array<{
    clientName: string;
    deadline: Date;
    daysRemaining: number;
  }>;
}