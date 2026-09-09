import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const images = [
  '/gallery/pix34.jpg',
  '/gallery/pix35.jpg',
  '/gallery/pix36.jpg',
  '/gallery/pix37.jpg',
]

function WhoWeAre() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-section-c relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-yellow-600/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{opacity:0,x:-60}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:'-100px'}} transition={{duration:0.8}}>
            <span className="text-yellow-500 text-sm font-semibold uppercase tracking-widest mb-4 block font-grotesk">Who We Are</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 font-geom">
              A Family United by<span className="text-yellow-500"> Faith & Purpose.</span>
            </h2>
            <div className="space-y-5 text-gray-400 leading-relaxed text-base font-grotesk">
              <p>The Diocese of Lagos West Youth Chaplaincy (DLWYC) is a body of young Anglicans between the ages of 13 to 35 years. Birthed from a burden in the heart of the Diocesan Bishop, the chaplaincy addresses the unique challenges faced by youth in the church today.</p>
              <p>In the beginning, a small group of dedicated young people were entrusted with the vision. They resolved to make it work no matter the circumstance. What started with just a handful of believers has grown into a vibrant movement across parishes.</p>
              <p>As young people traveled for school and work, the chaplaincy spread to different regions. Today, we have a presence in almost all parishes of the Diocese of Lagos West, creating a united family in Christ.</p>
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,x:60}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:'-100px'}} transition={{duration:0.8,delay:0.2}} className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-yellow-600/10">
              <Swiper modules={[Pagination,Autoplay,EffectFade]} effect="fade" pagination={{clickable:true}} autoplay={{delay:4000,disableOnInteraction:false}} loop className="aspect-[4/5]">
                {images.map((img,i) => (
                  <SwiperSlide key={i}><img src={img} alt={`Youth ${i+1}`} className="w-full h-full object-cover" /></SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-yellow-600/20 rounded-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-l-2 border-b-2 border-yellow-600/30 rounded-bl-2xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
export default WhoWeAre
