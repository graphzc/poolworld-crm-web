import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { authService } from '@/services/authService'
import { AppLayout } from '@/components/layouts/AppLayout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    if (!authService.isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
