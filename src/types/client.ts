export interface Client {
  id: string
  clientNumber: string
  companyName: string
  representativeName: string
  representativeBirthday?: Date
  phone: string
  email: string
  postalCode: string
  address: string
  industry: string
  businessContent: string
  fiscalMonth: number
  monthlyFee: number
  journalEntryFee: number
  clientContact: string
  salesPerson: string
  accountingPerson: string
  operationPerson: string
  staff: string
  location: string
  capitalAmount?: number
  establishedDate?: Date
  history?: string
  executives?: string[]
  banks?: string[]
  invoiceNumber?: string
  invoiceAcquisitionDate?: Date
  lastMeetingDate?: Date
  lastEmailDate?: Date
  lastCallDate?: Date
  nextDeadline?: Date
  status: "active" | "pending" | "inactive" | "billable" | "non-billable"
  isBillable: boolean
  profitRate: number
  revenue: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface MonthlyRevenue {
  month: string
  revenue: number
  previousYearRevenue: number
  growth: number
}

export interface ClientStats {
  totalClients: number
  billableClients: number
  nonBillableClients: number
  billableRate: number
}

export interface RevenueRanking {
  clientId: string
  companyName: string
  revenue: number
  profitRate: number
  rank: number
}