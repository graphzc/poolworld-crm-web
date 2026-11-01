import { z } from 'zod'

// Login validation schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'กรุณากรอกชื่อผู้ใช้')
    .min(3, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร')
    .max(50, 'ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร')
    .refine((val) => val.trim().length >= 3, {
      message: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร',
    }),
  password: z
    .string()
    .min(1, 'กรุณากรอกรหัสผ่าน')
    .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
    .max(100, 'รหัสผ่านต้องไม่เกิน 100 ตัวอักษร'),
})

// Customer validation schema
export const customerSchema = z.object({
  name: z
    .string()
    .min(1, 'กรุณากรอกชื่อลูกค้า')
    .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(200, 'ชื่อต้องไม่เกิน 200 ตัวอักษร')
    .refine((val) => val.trim().length > 0, {
      message: 'กรุณากรอกชื่อลูกค้า',
    }),
  address: z.string().max(500, 'ที่อยู่ต้องไม่เกิน 500 ตัวอักษร').optional().or(z.literal('')),
  customer_type: z.enum(['Tax', 'Non-Tax'], {
    error: 'กรุณาเลือกประเภทลูกค้า',
  }),
  tax_id: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true
        const cleaned = val.replace(/[-\s]/g, '')
        return cleaned.length === 13 && /^\d+$/.test(cleaned)
      },
      {
        message: 'เลขประจำตัวผู้เสียภาษีต้องมี 13 หลักและเป็นตัวเลขเท่านั้น',
      }
    ),
  services: z
    .array(z.string())
    .min(1, 'กรุณาเลือกบริการอย่างน้อย 1 รายการ')
    .refine((val) => val.length > 0, {
      message: 'กรุณาเลือกบริการอย่างน้อย 1 รายการ',
    }),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type CustomerFormData = z.infer<typeof customerSchema>
