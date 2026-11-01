export const CUSTOMER_TYPES = [
  { value: 'Tax', label: 'ลูกค้าภาษี (มีภาษี)' },
  { value: 'Non-Tax', label: 'ลูกค้าบุคคลธรรมดา (ไม่มีภาษี)' },
] as const

export const SERVICES = [{ value: 'POOL_CARE', label: 'ดูแลสระว่ายน้ำ' }] as const

export const SERVICE_MAP: Record<string, string> = {
  POOL_CARE: 'ดูแลสระว่ายน้ำ',
}

export const CUSTOMER_TYPE_MAP: Record<string, string> = {
  Tax: 'มีภาษี',
  'Non-Tax': 'ไม่มีภาษี',
}

export const DAYS_OF_WEEK = [
  { value: 'SUN', label: 'อาทิตย์' },
  { value: 'MON', label: 'จันทร์' },
  { value: 'TUE', label: 'อังคาร' },
  { value: 'WED', label: 'พุธ' },
  { value: 'THU', label: 'พฤหัสบดี' },
  { value: 'FRI', label: 'ศุกร์' },
  { value: 'SAT', label: 'เสาร์' },
] as const

export const DAY_MAP: Record<string, string> = {
  SUN: 'อาทิตย์',
  MON: 'จันทร์',
  TUE: 'อังคาร',
  WED: 'พุธ',
  THU: 'พฤหัสบดี',
  FRI: 'ศุกร์',
  SAT: 'เสาร์',
}

export const DAY_SHORT_MAP: Record<string, string> = {
  SUN: 'อา.',
  MON: 'จ.',
  TUE: 'อ.',
  WED: 'พ.',
  THU: 'พฤ.',
  FRI: 'ศ.',
  SAT: 'ส.',
}

export const POOL_SYSTEMS = [
  { value: 'CHLORINE', label: 'คลอรีน' },
  { value: 'SALT', label: 'เกลือ' },
] as const

export const POOL_SYSTEM_MAP: Record<string, string> = {
  CHLORINE: 'คลอรีน',
  SALT: 'เกลือ',
}

// Thai traditional day colors
export const DAY_COLOR_MAP: Record<string, string> = {
  SUN: 'border-red-600 bg-red-600 text-white',
  MON: 'border-yellow-400 bg-yellow-400 text-yellow-950',
  TUE: 'border-pink-500 bg-pink-500 text-white',
  WED: 'border-green-600 bg-green-600 text-white',
  THU: 'border-orange-500 bg-orange-500 text-white',
  FRI: 'border-sky-400 bg-sky-400 text-sky-950',
  SAT: 'border-purple-600 bg-purple-600 text-white',
}

export const THAI_MONTHS = [
  { value: 1, label: 'มกราคม', short: 'ม.ค.' },
  { value: 2, label: 'กุมภาพันธ์', short: 'ก.พ.' },
  { value: 3, label: 'มีนาคม', short: 'มี.ค.' },
  { value: 4, label: 'เมษายน', short: 'เม.ย.' },
  { value: 5, label: 'พฤษภาคม', short: 'พ.ค.' },
  { value: 6, label: 'มิถุนายน', short: 'มิ.ย.' },
  { value: 7, label: 'กรกฎาคม', short: 'ก.ค.' },
  { value: 8, label: 'สิงหาคม', short: 'ส.ค.' },
  { value: 9, label: 'กันยายน', short: 'ก.ย.' },
  { value: 10, label: 'ตุลาคม', short: 'ต.ค.' },
  { value: 11, label: 'พฤศจิกายน', short: 'พ.ย.' },
  { value: 12, label: 'ธันวาคม', short: 'ธ.ค.' },
] as const
