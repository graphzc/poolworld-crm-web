import type { ComponentType } from 'react'
import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import { ArrowLeft, ChevronRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Breadcrumb = string | ComponentType<{ params: Record<string, string> }>

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    breadcrumb?: Breadcrumb
  }
}

type Crumb = { path: string; label: Breadcrumb; params: Record<string, string> }

// Builds crumbs from each prefix of the URL ("/customers", "/customers/:id", ...),
// so the hierarchy follows the URL even without nested layout routes.
function useCrumbs(): Crumb[] {
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const segments = pathname.split('/').filter(Boolean)
  const paths = ['/', ...segments.map((_, i) => '/' + segments.slice(0, i + 1).join('/'))]

  return paths.flatMap((path) => {
    const [, params, route] = router.getMatchedRoutes(path)
    const label = route?.options.staticData?.breadcrumb
    return label ? [{ path, label, params }] : []
  })
}

function CrumbLabel({ crumb }: { crumb: Crumb }) {
  const Label = crumb.label
  return typeof Label === 'string' ? Label : <Label params={crumb.params} />
}

export function PageNav() {
  const crumbs = useCrumbs()
  if (crumbs.length < 2) return null

  const parent = crumbs[crumbs.length - 2]

  return (
    <div className="mb-4 flex items-center gap-3 print:hidden">
      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
        <Link to={parent.path} aria-label="ย้อนกลับ">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <nav aria-label="breadcrumb" className="min-w-0">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1
            return (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                {isLast ? (
                  <span aria-current="page" className="truncate font-medium text-gray-900">
                    <CrumbLabel crumb={crumb} />
                  </span>
                ) : (
                  <Link to={crumb.path} className="flex items-center gap-1 truncate hover:text-gray-900">
                    {i === 0 && <Home className="h-3.5 w-3.5" />}
                    <CrumbLabel crumb={crumb} />
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
