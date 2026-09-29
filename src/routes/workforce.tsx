import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { FaArrowLeft, FaUsers, FaPaperPlane } from 'react-icons/fa'

const workforceOptions = [
  'Prayer & Worship',
  'Media & Communication',
  'Outreach & Service',
  'Hospitality & Logistics',
  'Creative Arts',
  'Leadership Support',
] as const

type WorkforceOption = (typeof workforceOptions)[number]

export const Route = createFileRoute('/workforce')({
  component: WorkforcePage,
})

function WorkforcePage() {
  const [selected, setSelected] = useState<WorkforceOption>(workforceOptions[0])

  const inputClass =
    'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all'
  const labelClass = 'text-sm font-semibold text-slate-700'

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const subject = encodeURIComponent('Workforce / Summit Inquiry')
    const body = encodeURIComponent(
      `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\nWhatsApp: ${formData.get('whatsapp')}\nInterest: ${formData.get('option')}`
    )
    window.location.href = `mailto:dlwyouth@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm mb-6 font-grotesk"
        >
          <FaArrowLeft size={12} /> Back to Home
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
          Join Our Workforce
        </h1>
        <p className="text-lg text-slate-600 mb-10">
          Find your place, serve with passion, and grow in your walk with God. Fill the form
          below and we will connect you with the right team.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 md:grid-cols-2">
          <div>
            <label className={labelClass}>Name</label>
            <input
              name="name"
              required
              className={inputClass}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              name="email"
              type="email"
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className={labelClass}>WhatsApp</label>
            <input
              name="whatsapp"
              required
              className={inputClass}
              placeholder="+234..."
            />
          </div>

          <div>
            <label className={labelClass}>Select Workforce or Summit</label>
            <select
              name="option"
              value={selected}
              onChange={(e) => setSelected(e.target.value as WorkforceOption)}
              className={inputClass}
            >
              {workforceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <FaUsers className="text-blue-600" size={18} />
              </div>
              <p className="font-semibold text-slate-800">6 teams to choose from</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {workforceOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => setSelected(option)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selected === option
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-6 md:col-span-2">
            <p className="text-sm text-slate-600">Ready to serve?</p>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <FaPaperPlane size={14} />
              Submit Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}