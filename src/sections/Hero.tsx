import React, { useCallback } from 'react'
import { motion } from 'framer-motion'

function Hero() {
  const scrollTo = useCallback((e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/gallery/pix23.jpg')" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/gallery/video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-slate-900/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-900/90" />

      {/* Content — pushed down from navbar, centered vertically */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center flex-1 pt-32 pb-20">

        {/* Badge — spaced well from navbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 rounded-full px-5 py-2.5 text-blue-200 text-xs font-semibold uppercase tracking-widest font-grotesk">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Diocese of Lagos West Youth Chaplaincy
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mb-8 font-geom"
        >
          Living for Christ
          <span className="block text-blue-400 mt-3">Leading with Purpose</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-base text-[15px] text-gray-200 max-w-2xl mx-auto lg:text-[15px] mb-12 leading-[32px] font-grotesk"
        >
          We are a vibrant community of young Anglicans committed to growing in Christ, serving our communities, discovering purpose, and transforming lives through worship, discipleship, leadership, missions, and meaningful fellowship.
        </motion.p>

        {/* Buttons — centered with gap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex w-full items-center justify-center gap-4 mb-16"
        >
          <a
            href="#about"
            onClick={(e) => scrollTo(e, '#about')}
            className="px-8 py-3.5 bg-blue-600 text-white font-[14px] font-bold rounded-full hover:bg-blue-500 transition-all duration-300 font-geom shadow-lg shadow-blue-600/25"
          >
            Discover More
          </a>
          <a
            href="#events"
            onClick={(e) => scrollTo(e, '#events')}
            className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 font-grotesk"
          >
            Upcoming Events
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator — at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="relative z-10 pb-8"
      >
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-[10px] uppercase tracking-widest font-grotesk">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}

export default React.memo(Hero)