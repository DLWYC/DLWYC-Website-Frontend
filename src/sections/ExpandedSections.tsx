import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { FaCalendarAlt, FaQuoteLeft } from "react-icons/fa";

export function BuiltForImpact() {

  const legacyImages = [
    "/gallery/pix11.jpg",
    "/gallery/pix12.jpg",
    "/gallery/pix13.jpg",
    "/gallery/pix14.jpg",
    "/gallery/pix15.jpg",
    "/gallery/pix16.jpg",
  ];

  // Duplicate images so Swiper loop + autoplay works reliably
  const swiperImages = [...legacyImages, ...legacyImages];

  return (
    <section id="impact" className="py-24 lg:py-[30px] bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid gap-17 lg:grid-cols-[1fr] items-center">

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[1rem] border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-10 lg:p-12 mb-10"
          >
            <div className="flex items-center gap-4 mb-8 font-rubik ">
              <div className=" w-full">
                <p className="text-sm uppercase tracking-[0.3em] text-blue-600">
                  2026 Diocesan Theme
                </p>
                <p className="text-4xl font-bold text-slate-900 leading-tight">
                  Who Is On The Lord Side
                </p>
                <p className="text-base text-blue-600 mt-1">Exodus 32:26</p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { value: "30", label: "Archdeaconries" },
                { value: "300+", label: "Parishes" },
                { value: "50k+", label: "Youths" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white p-6 border border-slate-200 text-center font-rubik"
                >
                  <p className="text-5xl font-black text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 block text-sm font-semibold uppercase tracking-[0.35em] text-blue-600 font-grotesk">
              Built for Impact
            </p>
            <h2 className="text-4xl sm:text-[50px] font-bold text-slate-900 mb-6 leading-tight font-rubik">
              A ministry shaped by faith, service, and purpose.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 font-grotesk text-[16px]">
              The Diocese of Lagos West Youth Chaplaincy exists to raise young
              people who are spiritually rooted, socially responsive, and ready
              to lead with integrity in the church and the world.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2200, disableOnInteraction: false }}
            loop
            slidesPerView={2}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 6 },
            }}
          >
            {swiperImages.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] group">
                  <img
                    src={img}
                    alt={`Legacy ${(i % legacyImages.length) + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}

export function PastorQuote() {
  return (
    <section id="quote" className="py-20 lg:py-15 bg-[#f5f5f0]">
      <div className="max-w-8xl mx-auto px-4 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] items-center lg:text-left rounded-[2rem] border border-slate-200 bg-white p-8 lg:p-10 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[1.2rem] h-full"
          >
            <img
              src="/gallery/bishop.jpg"
              alt="The Diocesan Bishop"
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <FaQuoteLeft className="text-blue-600 text-xl" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-slate-900 mb-6">
              From The Diocesan
            </h2>
            <p className="sm:text-[14px] leading-[30px] text-slate-600 font-grotesk">
              It is with great joy and anticipation that I welcome you to this
              special space created just for you. As the next generation of
              leaders, dreamers, and changemakers, you are a vital part of our
              community, and your presence here is deeply valued. In a world
              filled with both challenges and opportunities, I want you to know
              that your journey—both spiritual and personal—is important. You
              are not walking this path alone. This platform has been created to
              support you, inspire you, and give you a sense of belonging as you
              navigate life's many stages. This is Your Space for Growth and
              Connection. As young people, you face unique pressures and
              expectations, but within these challenges lies incredible
              potential. My prayer for each of you is that you will find
              strength, direction, and purpose in your walk with God, and that
              this space will be a source of encouragement as you grow in faith.
              Use this platform to connect with one another, share your
              thoughts, and find resources that help guide you on your journey.
            </p>
            <p className="mt-8 text-lg font-black uppercase text-slate-900 font-rubik">
              The Diocesan:
            </p>
            <p className="text-lg text-slate-600 font-grotesk">
              Rt Revd Dr. James Olusola Odedeji
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function FutureSection() {
  return (
    <section id="future" className="py-24 lg:py-[30px] bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="rounded-[2rem] border font-rubik border-slate-200 bg-gradient-to-r from-blue-50 via-white to-slate-50 p-8 lg:p-12 shadow-sm">
          <div className="">
            <p className="text-sm uppercase tracking-[0.3em] font-grotesk font-[500] text-blue-600 mb-4">
              We are the future
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[60px]">
              There is a place for every young person who wants to grow in faith
              and serve with purpose.
            </h2>
            <p className="mt-6 text-[18px] font-grotesk font-[400] text-slate-600 leading-relaxed">
              Whether you are newly discovering your calling or already serving
              in the Church, the Diocese of Lagos West Youth Chaplaincy is a
              place to belong, be strengthened, and make a lasting impact.
            </p>
            <div className="my-8 flex items-center place-content-center gap-4">
              <Link
                to={"/"}
                className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Join the Chaplaincy
              </Link>
              <Link
                to={"/"}
                className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CalendarEvents() {
  const placeholderEvents = [
    {
      id: 1,
      title: "Youth Prayer Summit",
      date: "18 August 2026",
      time: "",
      location: "Cathedral Hall, Ikeja",
      description: "",
    },
    {
      id: 2,
      title: "Leadership Bootcamp",
      date: "10 September 2026",
      time: "",
      location: "Diocesan Secretariat",
      description: "",
    },
    {
      id: 3,
      title: "Community Outreach Day",
      date: "22 October 2026",
      time: "",
      location: "Lagos West communities",
      description: "",
    },
  ];

  const [events] = useState(placeholderEvents);

  return (
    <section id="events" className="py-24 lg:py-32 bg-[#f5f5f0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 mb-4">
            Calendar & Events
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">
            Upcoming moments of fellowship and service.
          </h2>
        </div>

        {events.length === 0 ? (
          <p className="text-center text-slate-500">
            No upcoming events at this time. Check back soon.
          </p>
        ) : (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id ?? event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">
                  <FaCalendarAlt className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {event.title}
                </h3>
                <p className="text-slate-500 mb-2">{event.date}</p>
                {event.time && (
                  <p className="text-sm text-slate-400 mb-2">{event.time}</p>
                )}
                <p className="text-sm text-blue-600">{event.location}</p>
                {event.description && (
                  <p className="text-sm text-slate-500 mt-3">
                    {event.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
