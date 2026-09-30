import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { FaArrowLeft } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const images = [
  "./gallery/pix1.jpg",
  "./gallery/pix2.jpg",
  "./gallery/pix3.jpg",
  "./gallery/pix4.jpg",
];

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-10 font-grotesk"
          >
            <FaArrowLeft size={12} /> Back to Home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-4 block font-grotesk">
                Who We Are
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-8 font-geom">
                A Family United by
                <span className="text-blue-600"> Faith & Purpose.</span>
              </h1>
              <div className="space-y-5 text-slate-600 leading-relaxed text-base font-grotesk">
                <p>
                  The Diocese of Lagos West Youth Chaplaincy (DLWYC) is a body
                  of young Anglicans between the ages of 16 to 35 years. Birthed
                  from a burden in the heart of the Diocesan Bishop, the
                  chaplaincy addresses the unique challenges faced by youth in
                  the church today.
                </p>
                <p>
                  In the beginning, a small group of dedicated young people were
                  entrusted with the vision. They resolved to make it work no
                  matter the circumstance. What started with just a handful of
                  believers has grown into a vibrant movement across parishes.
                </p>
                <p>
                  As young people traveled for school and work, the chaplaincy
                  spread to different regions. Today, we have a presence in
                  almost all parishes of the Diocese of Lagos West, creating a
                  united family in Christ.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10">
                <Swiper
                  modules={[Pagination, Autoplay, EffectFade]}
                  effect="fade"
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  loop
                  className="aspect-[4/5]"
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={img}
                        alt={`Youth ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-blue-200 rounded-2xl pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-l-2 border-b-2 border-blue-300 rounded-bl-2xl pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-4">
              Our Impact
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Building a Generation of Faithful Leaders
            </h2>
            <p className="max-w-2xl mx-auto text-slate-600">
              Since our establishment, the Diocese of Lagos West Youth
              Chaplaincy has been at the forefront of youth spiritual
              development within the Anglican Communion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-xl shadow-black/30">
                    <img
                      src="./gallery/pix5.jpg"
                      alt="Youth fellowship"
                      className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl shadow-black/30">
                    <img
                      src="./gallery/pix6.jpg"
                      alt="Youth gathering"
                      className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-xl shadow-black/30">
                    <img
                      src="./gallery/pix7.jpg"
                      alt="Youth worship"
                      className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-4 sm:right-8 bg-blue-500 text-white rounded-2xl p-5 shadow-xl">
                <p className="font-geom text-3xl font-bold">15+</p>
                <p className="text-sm text-white/80 font-grotesk">
                  Years of Service
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="font-geom text-2xl sm:text-3xl font-bold text-slate-900 mb-5">
                What We're Building Together
              </h3>
              <p className="text-slate-600 leading-relaxed mb-5 font-grotesk">
                Our chaplaincy serves as a bridge between the traditional values
                of the Anglican faith and the dynamic energy of young people.
                Through worship, discipleship, fellowship, and service, we are
                raising a generation that will impact the world for Christ.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8 font-grotesk">
                We provide a nurturing environment where young people can grow
                in their relationship with God, develop their gifts and talents,
                and become effective leaders in the church and society.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Weekly Fellowship Meetings",
                  "Bible Study & Discipleship",
                  "Community Outreach Programs",
                  "Leadership Development",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    </div>
                    <span className="text-slate-700 font-medium text-sm font-grotesk">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
