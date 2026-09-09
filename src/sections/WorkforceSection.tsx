import { Link } from '@tanstack/react-router'


function WorkforceSection() {
  const columnA = ['/gallery/pix3.jpg', '/gallery/pix4.jpg', '/gallery/pix5.jpg']
  const columnB = ['/gallery/pix6.jpg', '/gallery/pix7.jpg', '/gallery/pix8.jpg']

  return (
    <section id="join" className="bg-white py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold">Workforce</p>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.95]">
              Join The <span className="font-serif italic font-normal text-blue-600">Team</span>
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
              Find your place, serve with passion, and grow in your walk with God. Join one of our dynamic workforce units today.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 max-w-xl">
              {['Prayer & Worship', 'Media & Communication', 'Outreach & Service', 'Hospitality & Logistics', 'Creative Arts', 'Leadership Support'].map((label) => (
                <div key={label} className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-800 shadow-sm">
                  {label}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={"/"}
                className="inline-flex items-center gap-3 rounded-full bg-blue-600 pl-7 pr-2 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Join a Workforce
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </Link>
              <a
                href="https://dlwyouth.org/userlogin"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-300 px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 h-[420px] sm:h-[480px]">
            <div className="overflow-hidden rounded-[1.5rem]">
              <div className="flex flex-col gap-4 animate-marquee-vertical-up">
                {[...columnA, ...columnA].map((src, index) => (
                  <img key={index} src={src} alt={`Workforce ${index + 1}`} className="h-56 w-full rounded-[1.5rem] object-cover" />
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-[1.5rem]">
              <div className="flex flex-col gap-4 animate-marquee-vertical-down">
                {[...columnB, ...columnB].map((src, index) => (
                  <img key={index} src={src} alt={`Workforce ${index + 4}`} className="h-56 w-full rounded-[1.5rem] object-cover" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkforceSection
