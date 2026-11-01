import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { User, FileText, Building2, Users as UsersIcon, Save, X, Loader2 } from 'lucide-react'
import { customerSchema, type CustomerFormData } from '@/lib/validations'
import type { CreateCustomerRequest } from '@/types'
import { CUSTOMER_TYPES, SERVICES } from '@/lib/constants'

interface CustomerFormProps {
  readonly defaultValues?: Readonly<Partial<CreateCustomerRequest>>
  readonly onSubmit: (data: CreateCustomerRequest) => void | Promise<void>
  readonly isLoading?: boolean
}

export function CustomerForm({ defaultValues, onSubmit, isLoading }: Readonly<CustomerFormProps>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { customer_type: 'Non-Tax', services: ['POOL_CARE'], ...defaultValues },
    mode: 'onChange',
  })

  const customerType = useWatch({ control, name: 'customer_type' })
  const selectedServices = useWatch({ control, name: 'services' }) || []

  const handleServiceChange = (serviceValue: string) => {
    const currentServices = selectedServices || []
    const newServices = currentServices.includes(serviceValue)
      ? currentServices.filter((s) => s !== serviceValue)
      : [...currentServices, serviceValue]
    setValue('services', newServices, { shouldValidate: true })
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-sm border">
      <CardHeader className="space-y-2 pb-6">
        <div className="flex items-center gap-3">
          {defaultValues ? (
            <FileText className="h-8 w-8 text-primary" />
          ) : (
            <User className="h-8 w-8 text-primary" />
          )}
          <div>
            <CardTitle className="text-2xl font-bold">
              {defaultValues ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}
            </CardTitle>
            <CardDescription className="text-sm">
              กรอกข้อมูลลูกค้าให้ครบถ้วนเพื่อใช้ในการบริการและออกเอกสาร
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* ข้อมูลพื้นฐาน */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">ข้อมูลพื้นฐาน</h3>
            </div>

            <label
              htmlFor="name"
              className="text-sm font-medium"
            >
              ชื่อ-นามสกุล / ชื่อบริษัท <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              placeholder="เช่น บริษัท พูลเวิลด์ จำกัด หรือ คุณสมชาย ใจดี"
              {...register('name')}
              error={errors.name?.message}
              className="h-12"
            />

            <Input
              label="ที่อยู่"
              placeholder="เลขที่ หมู่ ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
              {...register('address')}
              error={errors.address?.message}
              className="h-12"
            />
          </div>

          <Separator />

          {/* ข้อมูลภาษีและประเภท */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">ข้อมูลภาษีและประเภท</h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                ประเภทลูกค้า <span className="text-red-500">*</span>
              </label>
              <Select
                value={customerType}
                onValueChange={(value) =>
                  setValue('customer_type', value as 'Tax' | 'Non-Tax', {
                    shouldValidate: true,
                  })
                }
              >
                <input
                  type="hidden"
                  {...register('customer_type')}
                />
                <SelectTrigger
                  className="h-12"
                  error={errors.customer_type?.message}
                >
                  <SelectValue placeholder="เลือกประเภทลูกค้า" />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMER_TYPES.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customer_type && (
                <p className="text-sm text-red-500">{errors.customer_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                label="เลขประจำตัวผู้เสียภาษี"
                placeholder="เช่น 0123456789012 (ไม่บังคับ)"
                {...register('tax_id')}
                error={errors.tax_id?.message}
                className="h-12"
                maxLength={13}
              />
            </div>
          </div>

          <Separator />

          {/* บริการ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <UsersIcon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">บริการที่ใช้</h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                บริการ <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {SERVICES.map((service) => (
                  <label
                    key={service.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={service.value}
                      checked={selectedServices.includes(service.value)}
                      onChange={() => handleServiceChange(service.value)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm">{service.label}</span>
                  </label>
                ))}
              </div>
              {errors.services && <p className="text-sm text-red-500">{errors.services.message}</p>}
              <p className="text-sm text-muted-foreground">สามารถเลือกได้มากกว่า 1 รายการ</p>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => globalThis.history.back()}
              className="flex-1 h-11 font-semibold"
            >
              <X className="mr-2 h-4 w-4" />
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-11 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  บันทึกข้อมูล
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
