import React from 'react'
import { motion } from 'framer-motion'

function SectionTitle({ subtitle, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-3xl mx-auto mb-14 font-rubik"
    >
      {subtitle && (
        <span className="inline-block text-blue-600 text-sm font-semibold tracking-widest uppercase mb-4 font-grotesk">
          {subtitle}
        </span>
      )}
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 font-geom">
        {title}
      </h2>
      {description && (
        <p className="text-slate-600 text-base sm:text-[16px] leading-relaxed font-grotesk">
          {description}
        </p>
      )}
    </motion.div>
  )
}

export default SectionTitle
