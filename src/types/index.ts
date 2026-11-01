export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface Customer {
  id: string
  name: string
  address?: string
  tax_id?: string
  customer_type: 'Tax' | 'Non-Tax'
  services: string[]
  created_at: string
  updated_at: string
}

export interface CreateCustomerRequest {
  name: string
  address?: string
  tax_id?: string
  customer_type: 'Tax' | 'Non-Tax'
  services: string[]
}

export interface UpdateCustomerRequest {
  name: string
  address?: string
  tax_id?: string
  customer_type: 'Tax' | 'Non-Tax'
  services: string[]
}

export interface CustomerQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  customerType?: 'Tax' | 'Non-Tax' | ''
}

export interface PaginatedCustomersResponse {
  data: Customer[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PoolCare {
  id: string
  customer_id: string
  customer_name?: string
  name: string
  address: string
  days_of_service: string[]
  pool_system: 'CHLORINE' | 'SALT'
  chemical_included: boolean
  price: number
  created_at: string
  updated_at: string
}

export interface CreatePoolCareRequest {
  customer_id: string
  name: string
  address: string
  days_of_service: string[]
  pool_system: 'CHLORINE' | 'SALT'
  chemical_included: boolean
  price: number
}

export interface UpdatePoolCareRequest {
  name: string
  address: string
  days_of_service: string[]
  pool_system: 'CHLORINE' | 'SALT'
  chemical_included: boolean
  price: number
}

export interface PoolCareQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  customerId?: string
  poolSystem?: 'CHLORINE' | 'SALT' | ''
  days?: string // comma-separated day codes, e.g. 'MON,WED'
}

export interface PaginatedPoolCaresResponse {
  data: PoolCare[]
  total: number
  page: number
  limit: number
}

export interface PoolCareReport {
  id: string
  poolcare_id: string
  year: number
  month: number
  name: string
  address: string
  days_of_service: string[]
  pool_system: 'CHLORINE' | 'SALT'
  chemical_included: boolean
  service_dates: number[]
  created_at: string
  updated_at: string
}

export interface CreatePoolCareReportRequest {
  poolcare_id: string
  year: number
  month: number
}

export interface BulkCreatePoolCareReportRequest {
  year: number
  month: number
}

export interface BulkCreatePoolCareReportResponse {
  created: number
  failed: number
  errors?: string[]
}

export interface PoolCareReportQueryParams {
  page?: number
  limit?: number
  poolcare_id?: string
  year?: number
  month?: number
  days?: string // comma-separated day codes, e.g. 'MON,WED'
}

export interface PaginatedPoolCareReportsResponse {
  data: PoolCareReport[]
  total: number
  page: number
  limit: number
}
