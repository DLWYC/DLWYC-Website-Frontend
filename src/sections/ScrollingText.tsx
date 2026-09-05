import React from 'react'

function ScrollingText() {
  const items = [
    'TOO LOADED TO BE STRANDED',
    'RAISING KINGDOM LEADERS',
    'DIOCESE OF LAGOS WEST YOUTH CHAPLAINCY',
    'FAITH & PURPOSE',
    'GLOBAL IMPACT',
  ]

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      {/* Thin gold accent ribbon, offset behind the main ribbon */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 -rotate-2 h-2 bg-gradient-to-r from-yellow-600/0 via-yellow-500/70 to-yellow-600/0" />

      <div
        className="relative -mx-6 sm:-mx-12 -rotate-2 bg-gradient-to-r from-blue-800 via-sky-500 to-blue-900 shadow-[0_25px_90px_rgba(59,130,246,0.35)] border-y-2 border-yellow-400/40"
      >
        {/* Subtle inner glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-black/20" />

        <div className="overflow-hidden py-5 sm:py-6">
          <div className="flex w-max animate-marquee-slant items-center whitespace-nowrap gap-12 lg:gap-16">
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex shrink-0 items-center gap-12 lg:gap-16">
                {items.map((item, index) => (
                  <span
                    key={`${groupIndex}-${index}`}
                    className="inline-flex items-center gap-4 text-[0.9rem] font-black uppercase tracking-[0.4em] text-white sm:text-[1rem] md:text-[1.05rem] lg:text-[1.2rem] font-geom"
                  >
                    <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_2px_rgba(250,204,21,0.7)]" />
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScrollingText
