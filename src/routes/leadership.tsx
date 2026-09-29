import { createFileRoute, Link } from '@tanstack/react-router'
import { FaArrowLeft } from 'react-icons/fa'
import Leadership from '@/sections/Leadership'

export const Route = createFileRoute('/leadership')({
  component: LeadershipPage,
})

function LeadershipPage() {
  return (
    <div className="min-h-screen bg-white pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors font-grotesk"
        >
          <FaArrowLeft size={12} /> Back to Home
        </Link>
      </div>
      <Leadership />
    </div>
  )
}