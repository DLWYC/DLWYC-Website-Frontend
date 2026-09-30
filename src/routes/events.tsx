import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";

type Event = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  featured: boolean;
  image: string;
  fullDetails: string;
};

const events: Event[] = [
  {
    title: "Diocesan Youth Harvest 2026",
    date: "August 15-17, 2026",
    time: "9:00 AM Daily",
    location: "Cathedral Church Grounds",
    description:
      "Our annual gathering featuring powerful worship, impactful teachings, and networking opportunities for youths across all parishes.",
    featured: false,
    image: "/gallery/pix13.jpg",
    fullDetails:
      "The Diocesan Youth Convention is our flagship annual event. Expect three days of powerful worship sessions, anointed guest speakers, breakout workshops on career and ministry, evening concerts, and a grand awards night. All parishes are expected to register their delegates by July 30th. Accommodation and feeding will be provided for out-of-town delegates.",
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
    fullDetails:
      "Join us for seven evenings of corporate prayer, fasting, and prophetic declarations. Each night carries a specific theme: Monday — Consecration, Tuesday — Breakthrough, Wednesday — Healing, Thursday — Family & Relationships, Friday — Career & Purpose, Saturday — Deliverance, Sunday — Thanksgiving & Celebration. Come expectant.",
  },
  {
    title: "Diocesan Youth Camp 2026",
    date: "December 5-7, 2026",
    time: "All Day",
    location: "Diocesan Camp Ground",
    description:
      "A weekend retreat for all youth, youth executives and leaders focusing on spiritual renewal and strategic planning.",
    featured: true,
    image: "/gallery/pix15.jpg",
    fullDetails:
      "An exclusive retreat for all Youth,  parish Presidents, Secretaries, Prayer Coordinators, and Choir Leaders etc. across the 300+ parishes. Sessions include strategic planning for the chaplaincy year, conflict resolution training, financial stewardship for youth groups, and a night of spiritual impartation. Transport leaves Secretariat at 7:00 AM on Friday.",
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
    fullDetails:
      "End the year in grand style! The Christmas Carol features drama, dance, spoken word, and special renditions from our diocesan youth choir. The Awards Night recognizes outstanding youths in categories like Evangelism, Creative Arts, Academic Excellence, and Community Service. Red-carpet arrivals begin at 3:00 PM. Dress Code: White & Gold.",
  },
];

export const Route = createFileRoute("/events")({
  component: EventsPage,
});

function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <section className="min-h-screen py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-10 font-grotesk"
        >
          <FaArrowLeft size={12} /> Back to Home
        </Link>

        {/* Custom Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-blue-600 text-sm font-semibold tracking-widest uppercase mb-4 font-grotesk">
            Coming Up
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 font-geom">
            Upcoming Events
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-grotesk">
            Join us at our upcoming events designed to inspire, equip, and bring
            our youth community together.
          </p>
        </div>

        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
          {events.map((event, index) => {
            const dayMatch = event.date.match(/\d+/);
            const dayNumber = dayMatch ? dayMatch[0] : "";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={
                  "group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 " +
                  (event.featured
                    ? "border-blue-500 shadow-md"
                    : "border-slate-200 hover:border-blue-300 hover:shadow-md")
                }
              >
                {event.featured && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-grotesk z-10">
                    Featured
                  </div>
                )}

                <div className="w-full h-48 sm:h-56 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 sm:p-8 flex flex-col gap-4 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex flex-col items-center justify-center text-blue-700">
                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-80 font-grotesk">
                          {event.date.split(" ")[0]}
                        </span>
                        <span className="font-geom text-xl font-bold">
                          {dayNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 bg-white">
                      <h3 className="font-geom text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-grotesk">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <span className="inline-flex items-center gap-2 text-xs text-slate-500 font-grotesk">
                      <FaClock size={12} className="text-blue-500" />
                      {event.time}
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs text-slate-500 font-grotesk">
                      <FaMapMarkerAlt size={12} className="text-blue-500" />
                      {event.location}
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all duration-300 text-sm group/btn font-grotesk w-full sm:w-auto justify-center"
                    >
                      Learn More
                      <FaArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 sm:h-64">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-blue-600 transition-all"
                >
                  <FaTimes size={16} />
                </button>
                <div className="absolute bottom-4 left-6">
                  <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-grotesk mb-2">
                    {selectedEvent.date}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-geom">
                    {selectedEvent.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 bg-white">
                <div className="flex flex-wrap gap-4">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-500 font-grotesk">
                    <FaClock size={14} className="text-blue-500" />
                    {selectedEvent.time}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-slate-500 font-grotesk">
                    <FaMapMarkerAlt size={14} className="text-blue-500" />
                    {selectedEvent.location}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-wider text-blue-600 font-semibold mb-2 font-grotesk">
                    About This Event
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-grotesk">
                    {selectedEvent.fullDetails}
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://dlwyouth.org/userlogin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors font-grotesk text-center"
                  >
                    Register Now
                  </a>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors font-grotesk"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
