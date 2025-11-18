import { createFileRoute } from '@tanstack/react-router'
import HostelAllocationDashboard from '../../components/MultiStep/HostelAllocation'

export const Route = createFileRoute('/userdashboard/hostelallocation')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
      <div>
     <HostelAllocationDashboard />
  </div>
  )
}
