import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const images = [
  '/gallery/pix28.jpg',
  '/gallery/pix29.jpg',
  '/gallery/pix30.jpg',
  '/gallery/pix31.jpg',
  '/gallery/pix32.jpg',
  '/gallery/pix33.jpg',
]

function Legacy() {
  return (
    <section id="legacy" className="py-24 lg:py-32 bg-section-c relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}}>
          <Swiper modules={[Pagination,Autoplay]} pagination={{clickable:true}} autoplay={{delay:3000,disableOnInteraction:false}} loop
            slidesPerView={1} spaceBetween={20} breakpoints={{640:{slidesPerView:2},1024:{slidesPerView:3}}} className="pb-12">
            {images.map((img,i) => (
              <SwiperSlide key={i}>
                <div className="relative rounded-2xl overflow-hidden group aspect-[4/5]">
                  <img src={img} alt={`Legacy ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  )
}
export default Legacy
