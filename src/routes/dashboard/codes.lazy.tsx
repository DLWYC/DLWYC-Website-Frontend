import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/codes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/codes"!</div>
}
