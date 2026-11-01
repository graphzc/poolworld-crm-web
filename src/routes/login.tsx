import { createFileRoute, Navigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '@/hooks/useAuth'
import { authService } from '@/services/authService'
import { User, Lock, LogIn, Loader2 } from 'lucide-react'
import { loginSchema, type LoginFormData } from '@/lib/validations'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  if (authService.isAuthenticated()) {
    return <Navigate to="/" />
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data)
      globalThis.location.assign('/')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-3 text-center pt-8 pb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-2">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Poolworld Pattaya
          </CardTitle>
          <CardDescription className="text-base font-medium">
            ระบบจัดการข้อมูลลูกค้า
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8 px-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2 relative">
              <Input
                label="ชื่อผู้ใช้"
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                {...register('username')}
                error={errors.username?.message}
                className="h-11 pl-10"
              />
              <User className="absolute left-3 top-[38px] h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-2 relative">
              <Input
                label="รหัสผ่าน"
                type="password"
                placeholder="กรอกรหัสผ่านของคุณ"
                {...register('password')}
                error={errors.password?.message}
                className="h-11 pl-10"
              />
              <Lock className="absolute left-3 top-[38px] h-5 w-5 text-muted-foreground" />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  เข้าสู่ระบบ
                </>
              )}
            </Button>

            {login.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 text-center font-medium">
                  ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
                </p>
              </div>
            )}
          </form>

          <div className="border-t pt-4">
            <p className="text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} Poolworld Pattaya. All rights reserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
