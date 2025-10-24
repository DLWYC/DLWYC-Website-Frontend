import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/userdashboard/eventhistory')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/userdashboard/eventhistory"!</div>
}
