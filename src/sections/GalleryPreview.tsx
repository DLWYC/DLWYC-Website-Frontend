import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import SectionTitle from "@/components/SectionTitle";

const images = [
  "/gallery/pix24.jpg",
  "/gallery/pix25.jpg",
  "/gallery/pix27.jpg",
  "/gallery/pix28.jpg",
];

const middleImages = [
  "/gallery/pix26.jpg",
  "/gallery/pix29.jpg",
  "/gallery/pix30.jpg",
  "/gallery/pix31.jpg",
];

function GalleryPreview() {
  return (
    <section id="gallery-preview" className="py-24 lg:py-[50px] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Gallery"
          title="Moments We Cherish"
          description="A glimpse into worship, fellowship, and the everyday joy of life together as a chaplaincy family."
        />

        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="h-40 sm:h-56 overflow-hidden rounded-2xl"
            >
              <img
                src={images[0]}
                alt="Gallery photo 1"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-56 sm:h-72 overflow-hidden rounded-2xl"
            >
              <img
                src={images[1]}
                alt="Gallery photo 2"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="h-full min-h-[20rem] sm:min-h-[29rem] overflow-hidden rounded-2xl"
          >
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              autoplay={{ delay: 2800, disableOnInteraction: false }}
              loop
              className="h-full w-full"
            >
              {middleImages.map((src, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={src}
                    alt={`Gallery highlight ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          <div className="flex flex-col gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-40 sm:h-56 overflow-hidden rounded-2xl"
            >
              <img
                src={images[2]}
                alt="Gallery photo 3"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="h-56 sm:h-72 overflow-hidden rounded-2xl"
            >
              <img
                src={images[3]}
                alt="Gallery photo 4"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to={"/"}
            className="inline-flex rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GalleryPreview;
