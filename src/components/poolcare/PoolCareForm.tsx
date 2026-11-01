import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Waves, FileText, User, CalendarDays, Banknote, Save, X, Loader2, Check } from 'lucide-react'
import { DAYS_OF_WEEK, DAY_COLOR_MAP, POOL_SYSTEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { PoolCare, Customer } from '@/types'
import { useEffect } from 'react'

const poolCareFormSchema = z.object({
  customer_id: z.string().min(1, 'กรุณาเลือกลูกค้า'),
  name: z.string().min(1, 'กรุณากรอกชื่อ'),
  address: z.string().min(1, 'กรุณากรอกที่อยู่'),
  days_of_service: z.array(z.string()).min(1, 'กรุณาเลือกวันให้บริการอย่างน้อย 1 วัน'),
  pool_system: z.enum(['CHLORINE', 'SALT'], {
    error: 'กรุณาเลือกระบบสระว่ายน้ำ',
  }),
  chemical_included: z.boolean(),
  price: z.number().min(0, 'ราคาต้องไม่ติดลบ'),
})

type PoolCareFormValues = z.infer<typeof poolCareFormSchema>

interface PoolCareFormProps {
  poolCare?: PoolCare
  customers: Customer[]
  defaultCustomerId?: string
  onSubmit: (data: PoolCareFormValues) => void
  isPending?: boolean
}

function RequiredMark() {
  return <span className="text-red-500">*</span>
}

export function PoolCareForm({
  poolCare,
  customers,
  defaultCustomerId,
  onSubmit,
  isPending,
}: PoolCareFormProps) {
  const form = useForm<PoolCareFormValues>({
    resolver: zodResolver(poolCareFormSchema),
    defaultValues: {
      customer_id: poolCare?.customer_id || defaultCustomerId || '',
      name: poolCare?.name || '',
      address: poolCare?.address || '',
      days_of_service: poolCare?.days_of_service || [],
      pool_system: poolCare?.pool_system || undefined,
      chemical_included: poolCare?.chemical_included || false,
      price: poolCare?.price || 0,
    },
  })

  const selectedCustomerId = useWatch({ control: form.control, name: 'customer_id' })

  // Auto-fill name and address when customer is selected
  useEffect(() => {
    if (selectedCustomerId && !poolCare) {
      const customer = customers.find((c) => c.id === selectedCustomerId)
      if (customer) {
        form.setValue('name', customer.name)
        if (customer.address) {
          form.setValue('address', customer.address)
        }
      }
    }
  }, [selectedCustomerId, customers, form, poolCare])

  return (
    <Card className="max-w-4xl mx-auto shadow-sm border">
      <CardHeader className="space-y-2 pb-6">
        <div className="flex items-center gap-3">
          {poolCare ? (
            <FileText className="h-8 w-8 text-primary" />
          ) : (
            <Waves className="h-8 w-8 text-primary" />
          )}
          <div>
            <CardTitle className="text-2xl font-bold">
              {poolCare ? 'แก้ไขการดูแลสระว่ายน้ำ' : 'เพิ่มการดูแลสระว่ายน้ำ'}
            </CardTitle>
            <CardDescription className="text-sm">
              กรอกข้อมูลการดูแลสระว่ายน้ำให้ครบถ้วนเพื่อใช้ในการบริการและออกรายงาน
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* ข้อมูลลูกค้า */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">ข้อมูลลูกค้า</h3>
              </div>

              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ลูกค้า <RequiredMark />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!poolCare}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="เลือกลูกค้า" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id}
                          >
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ชื่อสถานที่ / ชื่อสระ <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="เช่น วิลล่า A หรือ คอนโด B"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ที่อยู่ <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="เลขที่ หมู่ ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* รายละเอียดบริการ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">รายละเอียดบริการ</h3>
              </div>

              <FormField
                control={form.control}
                name="days_of_service"
                render={({ field }) => {
                  const selected = field.value ?? []
                  const allSelected = selected.length === DAYS_OF_WEEK.length

                  // Keep selected days in week order (อาทิตย์ → เสาร์)
                  const toggleDay = (value: string) => {
                    const next = selected.includes(value)
                      ? selected.filter((v) => v !== value)
                      : [...selected, value]
                    field.onChange(
                      DAYS_OF_WEEK.map((d) => d.value).filter((v) => next.includes(v))
                    )
                  }

                  return (
                    <FormItem>
                      <div className="flex items-center justify-between gap-2">
                        <FormLabel>
                          วันให้บริการ <RequiredMark />
                        </FormLabel>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground mr-1">
                            เลือกแล้ว {selected.length} วัน
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-primary"
                            onClick={() =>
                              field.onChange(allSelected ? [] : DAYS_OF_WEEK.map((d) => d.value))
                            }
                          >
                            {allSelected ? 'ล้างทั้งหมด' : 'เลือกทุกวัน'}
                          </Button>
                        </div>
                      </div>
                      <FormControl>
                        <div
                          role="group"
                          aria-label="วันให้บริการ"
                          className="grid grid-cols-4 sm:grid-cols-7 gap-2"
                        >
                          {DAYS_OF_WEEK.map((day) => {
                            const isSelected = selected.includes(day.value)
                            return (
                              <button
                                key={day.value}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => toggleDay(day.value)}
                                className={cn(
                                  'relative flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-lg border-2 px-1 py-2 text-sm font-medium transition-all',
                                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                  isSelected
                                    ? cn(DAY_COLOR_MAP[day.value], 'shadow-sm')
                                    : 'border-border bg-background text-foreground hover:bg-muted'
                                )}
                              >
                                {isSelected ? (
                                  <Check className="h-4 w-4" strokeWidth={3} />
                                ) : (
                                  <span
                                    className={cn('h-3 w-3 rounded-full border', DAY_COLOR_MAP[day.value])}
                                  />
                                )}
                                <span className="leading-none">{day.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        แตะที่วันเพื่อเลือกหรือยกเลิก สามารถเลือกได้มากกว่า 1 วัน
                      </p>
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="pool_system"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ระบบสระว่ายน้ำ <RequiredMark />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="เลือกระบบสระว่ายน้ำ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {POOL_SYSTEMS.map((system) => (
                          <SelectItem
                            key={system.value}
                            value={system.value}
                          >
                            {system.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* ราคา */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Banknote className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">ราคา</h3>
              </div>

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ราคา (บาท) <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="เช่น 3000"
                        className="h-12"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value === '' ? 0 : Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chemical_included"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      ราคานี้รวมค่าเคมีแล้ว
                    </FormLabel>
                  </FormItem>
                )}
              />
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
                disabled={isPending}
                className="flex-1 h-11 font-semibold"
              >
                {isPending ? (
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
        </Form>
      </CardContent>
    </Card>
  )
}
