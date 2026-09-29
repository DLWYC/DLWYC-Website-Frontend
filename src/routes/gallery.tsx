import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const TOTAL_IMAGES = 96

type GalleryImage = {
  src: string
  alt: stringa
}

type BentoPattern = 'large' | 'medium' | 'tall' | 'wide'

const images: GalleryImage[] = Array.from({ length: TOTAL_IMAGES }, (_, index) => ({
  src: `/gallery/pix${index + 1}.jpg`,
  alt: `Gallery image ${index + 1}`,
}))

const bentoPatterns: BentoPattern[] = [
  'large',
  'medium',
  'tall',
  'medium',
  'wide',
  'medium',
  'medium',
  'tall',
  'medium',
]

function getTileClass(pattern: BentoPattern): string {
  switch (pattern) {
    case 'large':
      return 'col-span-2 row-span-2'
    case 'wide':
      return 'col-span-2 row-span-1'
    case 'tall':
      return 'col-span-1 row-span-2'
    default:
      return 'col-span-1 row-span-1'
  }
}

export const Route = createFileRoute('/gallery')({
  component: GalleryPage,
})

function GalleryPage() {
  const [selected, setSelected] = useState<GalleryImage | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openImage = (img: GalleryImage, index: number) => {
    setSelected(img)
    setSelectedIndex(index)
  }

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex === null) return

    const next = (selectedIndex + 1) % images.length
    setSelected(images[next])
    setSelectedIndex(next)
  }

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex === null) return

    const prev = (selectedIndex - 1 + images.length) % images.length
    setSelected(images[prev])
    setSelectedIndex(prev)
  }

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-10 font-grotesk"
          >
            <FaArrowLeft size={12} /> Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-3xl mx-auto mb-4"
        >
          <span className="inline-block text-blue-600 text-sm font-semibold tracking-widest uppercase mb-4 font-grotesk">
            Gallery
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 font-geom">
            Moments We Cherish
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-grotesk">
            A glimpse into worship, fellowship, and the everyday joy of life together as a chaplaincy family.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[200px] lg:auto-rows-[220px] gap-3 sm:gap-4">
          {images.map((img, i) => {
            const pattern = bentoPatterns[i % bentoPatterns.length]
            const tileClass = getTileClass(pattern)

            return (
              <motion.button
                key={i}
                layout
                style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.45,
                  delay: (i % 9) * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openImage(img, i)}
                className={`
                  ${tileClass}
                  relative overflow-hidden rounded-xl
                  shadow-sm hover:shadow-xl
                  transition-shadow duration-300 cursor-pointer group
                `}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 text-white text-xs font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-grotesk">
                  View
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: 0.1 }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-blue-600 transition-all z-10"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <FaTimes size={20} />
            </motion.button>

            {/* Prev button */}
            <button
              onClick={showPrev}
              className="absolute left-4 sm:left-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-blue-600 transition-all z-10"
              aria-label="Previous image"
            >
              <FaChevronLeft size={18} />
            </button>

            {/* Next button */}
            <button
              onClick={showNext}
              className="absolute right-4 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-blue-600 transition-all z-10"
              aria-label="Next image"
            >
              <FaChevronRight size={18} />
            </button>

            {/* Image */}
            <motion.img
              key={selected.src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              src={selected.src}
              alt={selected.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-grotesk">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}