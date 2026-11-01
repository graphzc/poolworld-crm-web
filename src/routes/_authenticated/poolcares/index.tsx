import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SimpleSelect } from '@/components/ui/simple-select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2, Waves, Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePoolCares, useDeletePoolCare } from '@/hooks/usePoolCares'
import type { PoolCare, PoolCareQueryParams } from '@/types'
import { POOL_SYSTEMS, POOL_SYSTEM_MAP } from '@/lib/constants'
import { BulkCreateReportsButton } from '@/components/poolcare/BulkCreateReportsButton'
import { DayBadgeList } from '@/components/poolcare/DayBadge'
import { DayFilter } from '@/components/poolcare/DayFilter'

export const Route = createFileRoute('/_authenticated/poolcares/')({
  staticData: { breadcrumb: 'การดูแลสระว่ายน้ำ' },
  component: PoolCaresPage,
})

function PoolCaresPage() {
  const navigate = useNavigate()
  const [params, setParams] = useState<PoolCareQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    poolSystem: '',
    days: '',
  })
  const [poolCareToDelete, setPoolCareToDelete] = useState<PoolCare | null>(null)

  const { data, isLoading } = usePoolCares(params)
  const deletePoolCare = useDeletePoolCare()

  const poolCares = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / params.limit!)

  const handleSearch = (value: string) => {
    setParams({ ...params, search: value, page: 1 })
  }

  const handleFilterChange = (poolSystem: string) => {
    setParams({
      ...params,
      poolSystem: poolSystem as PoolCareQueryParams['poolSystem'],
      page: 1,
    })
  }

  const handleDaysChange = (days: string[]) => {
    setParams({ ...params, days: days.join(','), page: 1 })
  }

  const handleSortChange = (sortBy: string) => {
    const newSortOrder = params.sortBy === sortBy && params.sortOrder === 'asc' ? 'desc' : 'asc'
    setParams({ ...params, sortBy, sortOrder: newSortOrder })
  }

  const handlePageChange = (newPage: number) => {
    setParams({ ...params, page: newPage })
  }

  const handleDelete = async () => {
    if (poolCareToDelete) {
      await deletePoolCare.mutateAsync(poolCareToDelete.id)
      setPoolCareToDelete(null)
    }
  }

  const sortIndicator = (field: string) =>
    params.sortBy === field && (params.sortOrder === 'asc' ? '↑' : '↓')

  if (isLoading && params.page === 1) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">กำลังโหลดข้อมูล...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">การดูแลสระว่ายน้ำ</h1>
          <p className="text-muted-foreground mt-1">
            รายการการดูแลสระว่ายน้ำทั้งหมด {total} รายการ
          </p>
        </div>
        <div className="flex gap-2">
          <BulkCreateReportsButton />
          <Button
            onClick={() => navigate({ to: '/poolcares/new' })}
            size="default"
            className="font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มการดูแลสระว่ายน้ำ
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาชื่อหรือที่อยู่..."
                  value={params.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <SimpleSelect
              value={params.poolSystem}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="">ระบบสระทั้งหมด</option>
              {POOL_SYSTEMS.map((system) => (
                <option
                  key={system.value}
                  value={system.value}
                >
                  {system.label}
                </option>
              ))}
            </SimpleSelect>
          </div>
          <DayFilter
            className="mt-4"
            value={params.days ? params.days.split(',') : []}
            onChange={handleDaysChange}
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="font-semibold cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSortChange('name')}
                >
                  ชื่อ {sortIndicator('name')}
                </TableHead>
                <TableHead className="font-semibold">ที่อยู่</TableHead>
                <TableHead className="font-semibold">วันให้บริการ</TableHead>
                <TableHead className="font-semibold">ระบบสระ</TableHead>
                <TableHead className="font-semibold">รวมค่าเคมี</TableHead>
                <TableHead
                  className="font-semibold text-right cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSortChange('price')}
                >
                  ราคา {sortIndicator('price')}
                </TableHead>
                <TableHead className="font-semibold w-[180px]">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poolCares.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-16"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Waves className="h-12 w-12 text-muted-foreground" />
                      <p className="text-lg font-semibold">ไม่พบข้อมูลการดูแลสระว่ายน้ำ</p>
                      <p className="text-sm text-muted-foreground">
                        {params.search || params.poolSystem
                          ? 'ลองเปลี่ยนตัวกรองหรือคำค้นหา'
                          : 'เริ่มต้นโดยการเพิ่มการดูแลสระว่ายน้ำใหม่'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                poolCares.map((poolCare) => (
                  <TableRow key={poolCare.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <Link
                          to="/poolcares/$poolCareId"
                          params={{ poolCareId: poolCare.id }}
                          className="font-semibold text-base hover:text-primary hover:underline"
                        >
                          {poolCare.name}
                        </Link>
                        {poolCare.customer_name && (
                          <span className="text-xs text-muted-foreground">
                            ลูกค้า: {poolCare.customer_name}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm line-clamp-2 max-w-xs">
                        {poolCare.address || (
                          <span className="text-muted-foreground italic">ไม่ระบุ</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DayBadgeList days={poolCare.days_of_service} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={poolCare.pool_system === 'SALT' ? 'secondary' : 'outline'}
                        className="font-medium"
                      >
                        {POOL_SYSTEM_MAP[poolCare.pool_system]}
                      </Badge>
                    </TableCell>
                    <TableCell>{poolCare.chemical_included ? 'ใช่' : 'ไม่'}</TableCell>
                    <TableCell className="text-right">
                      {poolCare.price.toLocaleString('th-TH')} ฿
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                        >
                          <Link
                            to="/poolcares/$poolCareId/edit"
                            params={{ poolCareId: poolCare.id }}
                          >
                            <Edit className="mr-1 h-3.5 w-3.5" />
                            แก้ไข
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setPoolCareToDelete(poolCare)}
                          disabled={deletePoolCare.isPending}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          ลบ
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            หน้า {params.page} จาก {totalPages} (รวม {total} รายการ)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(params.page! - 1)}
              disabled={params.page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              ก่อนหน้า
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(params.page! + 1)}
              disabled={params.page === totalPages || isLoading}
            >
              ถัดไป
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog
        open={!!poolCareToDelete}
        onOpenChange={(open) => !open && setPoolCareToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการลบการดูแลสระว่ายน้ำ "{poolCareToDelete?.name}"
              รายงานทั้งหมดของการดูแลสระนี้จะถูกลบด้วย การกระทำนี้ไม่สามารถยกเลิกได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>ลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
