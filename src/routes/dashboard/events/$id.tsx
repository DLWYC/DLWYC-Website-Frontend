import { createFileRoute } from '@tanstack/react-router'
import {z} from 'zod'

const eventSchema = z.object({
  trxref: z.string().optional(),
})

export const Route = createFileRoute('/dashboard/events/$id')({
  component: RouteComponent,
  validateSearch: (search) => eventSchema.parse(search),
})

function RouteComponent() {
  return <div>Hello "/dashboard/events/"!</div>
}
