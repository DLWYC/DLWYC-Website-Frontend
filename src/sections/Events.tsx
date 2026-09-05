import React from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaMapMarkerAlt, FaClock, FaArrowRight } from "react-icons/fa";
import SectionTitle from "@/components/SectionTitle";

const events = [
  {
    title: "Diocesan Youth Convention 2026",
    date: "August 15-17, 2026",
    time: "9:00 AM Daily",
    location: "Cathedral Church Grounds",
    description:
      "Our annual gathering featuring powerful worship, impactful teachings, and networking opportunities for youths across all parishes.",
    featured: true,
    image: "/gallery/pix13.jpg",
  },
  {
    title: "Youth Week of Prayer",
    date: "July 20-26, 2026",
    time: "6:00 PM Daily",
    location: "St. Paul Anglican Church Hall",
    description:
      "Seven days of intensive prayer and fasting, seeking God's direction for the new chaplaincy year.",
    featured: false,
    image: "/gallery/pix14.jpg",
  },
  {
    title: "Leadership Retreat",
    date: "September 5-7, 2026",
    time: "All Day",
    location: "Diocesan Camp Ground",
    description:
      "A weekend retreat for youth executives and leaders focusing on spiritual renewal and strategic planning.",
    featured: false,
    image: "/gallery/pix15.jpg",
  },
  {
    title: "Christmas Carol & Awards Night",
    date: "December 20, 2026",
    time: "4:00 PM",
    location: "Cathedral Church",
    description:
      "Celebrating the birth of Christ with carols, drama presentations, and recognition of outstanding youth members.",
    featured: false,
    image: "/gallery/pix16.jpg",
  },
];

function Events() {
  const homepageEvents = events.slice(0, 3);

  return (
    <section id="events" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Coming Up"
          title="Upcoming Events"
          description="Join us at our upcoming events designed to inspire, equip, and bring our youth community together."
        />

        <div className="space-y-6">
          {homepageEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative bg-white font-rubik rounded-2xl overflow-hidden border transition-all duration-300 ${event.featured ? "border-blue-500/30 shadow-lg shadow-blue-500/5" : "border-blue-100 hover:border-blue-200"}`}
            >
              {event.featured && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-grotesk z-10">
                  Featured
                </div>
              )}
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-56 h-48 lg:h-auto shrink-0 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-6 flex-1">
                  <div className="shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-blue-600 flex flex-col items-center justify-center text-white">
                      <span className="text-xs font-medium uppercase tracking-wider opacity-80 font-grotesk">
                        {event.date.split(" ")[0]}
                      </span>
                      <span className="font-geom text-2xl font-bold">
                        {event.date.match(/\d+/)[0]}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-geom text-xl sm:text-2xl text-left font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 text-sm text-left leading-relaxed mb-4 font-grotesk">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <span className="inline-flex items-center gap-2 text-xs text-slate-500 font-grotesk">
                        <FaClock size={12} className="text-blue-600" />
                        {event.time}
                      </span>
                      <span className="inline-flex items-center gap-2 text-xs text-slate-500 font-grotesk">
                        <FaMapMarkerAlt size={12} className="text-blue-600" />
                        {event.location}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 text-sm group/btn border border-blue-600/20 font-grotesk"
                    >
                      Learn More
                      <FaArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-50 text-blue-700 font-semibold rounded-full hover:bg-blue-100 transition-colors font-grotesk"
          >
            View All Events
            <FaArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Events;
