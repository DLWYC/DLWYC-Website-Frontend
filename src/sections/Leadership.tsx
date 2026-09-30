import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import SectionTitle from "@/components/SectionTitle";

const leaders = [
  {
    name: "Rev. Canon [Chaplain Name]",
    role: "Chaplain / Youth Coordinator",
    image: "/gallery/pix24.jpg",
    bio: "Overseeing the spiritual direction and administrative leadership of the chaplaincy.",
  },
  {
    name: "[Assistant Chaplain Name]",
    role: "Assistant Chaplain",
    image: "/gallery/pix25.jpg",
    bio: "Coordinating Bible study programs and discipleship initiatives across all parish youth groups.",
  },
  {
    name: "[Youth President Name]",
    role: "Youth President",
    image: "/gallery/pix26.jpg",
    bio: "Leading the youth executive council and driving engagement in all chaplaincy activities.",
  },
  {
    name: "[Secretary Name]",
    role: "Secretary / Admin Head",
    image: "/gallery/pix27.jpg",
    bio: "Managing chaplaincy communications, records, and administrative operations.",
  },
];

function Leadership() {
  return (
    <section id="leadership" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Our Team"
          title="Leadership"
          description="Meet the dedicated team of clergy and youth leaders guiding the Diocese of Lagos West Youth Chaplaincy with wisdom, passion, and commitment."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((leader, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-geom text-lg font-bold text-slate-900 mb-1">
                  {leader.name}
                </h3>
                <p className="text-blue-600 text-sm font-semibold mb-3 font-grotesk">
                  {leader.role}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed font-grotesk">
                  {leader.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Leadership;
