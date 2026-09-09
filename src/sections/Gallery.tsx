import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const images = Array.from({ length: 35 }, (_, index) => ({
  src: `/gallery/pix${index + 1}.jpg`,
  alt: `Gallery image ${index + 1}`,
}))

function Gallery({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          <button
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-yellow-600 hover:text-black transition-all"
            onClick={onClose}
            aria-label="Close gallery"
          >
            <FaTimes size={20} />
          </button>

          <div className="w-full max-w-6xl mx-auto px-4">
            <Swiper
              modules={[Pagination, Autoplay, EffectFade]}
              effect="fade"
              pagination={{ clickable: true }}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              loop
              className="w-full h-[80vh] rounded-2xl overflow-hidden"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i} className="flex items-center justify-center bg-black">
                  <img src={img.src} alt={img.alt} className="max-w-full max-h-full object-contain" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Gallery
