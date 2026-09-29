import { createFileRoute, Link } from '@tanstack/react-router'
import { FaArrowLeft } from 'react-icons/fa'
import ArchdeaconLeaders from '../sections/ArchdeaconLeaders'

export const Route = createFileRoute('/archdeacon-leaders')({
  component: ArchdeaconLeadersPage,
})

function ArchdeaconLeadersPage() {
  return (
    <div className="min-h-screen bg-white pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-grotesk text-sm text-slate-500 transition-colors hover:text-blue-600"
        >
          <FaArrowLeft size={12} /> Back to Home
        </Link>
      </div>
      <ArchdeaconLeaders />
    </div>
  )
}
