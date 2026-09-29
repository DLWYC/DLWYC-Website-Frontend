import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import SectionTitle from "@/components/SectionTitle";

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/dlwyouthchaplaincy/", icon: FaFacebook },
  { name: "Instagram", href: "https://www.instagram.com/dlwyouth/", icon: FaInstagram },
  { name: "YouTube", href: "https://www.youtube.com/@dlwyouth9725", icon: FaYoutube },
];

const leaders = [
  { name: "Chairman Name", role: "Bariga Archdeaconry", image: "/gallery/arch-1.jpg" },
  { name: "Onyenze O. Mark", role: "Festac Archdeaconry", image: "/gallery/arch-2.jpg" },
  { name: "Ndupuechi William Michael", role: "Ikeja Archdeaconry", image: "/gallery/arch-3.jpg" },
  { name: "Chairman Name", role: "Ikorodu-North Archdeaconry", image: "/gallery/arch-4.jpg" },
  { name: "Okoye Wisdom", role: "Ikotun Archdeaconry", image: "/gallery/arch-5.jpg" },
  { name: "Chairman Name", role: "Imota Archdeaconry", image: "/gallery/arch-6.jpg" },
  { name: "Uzochukwu Akunne", role: "Isolo Archdeaconry", image: "/gallery/arch-7.jpg" },
  { name: "Okpalefe Dominic", role: "Ojo Archdeaconry", image: "/gallery/arch-8.jpg" },
  { name: "Chairman Name", role: "Ojodu Archdeaconry", image: "/gallery/arch-9.jpg" },
  { name: "ADETAYO BABATUNDE DANIEL", role: "Opebi Archdeaconry", image: "/gallery/arch-10.jpg" },
  { name: "CHRISTIAN ORAKA", role: "Oto-Awori Archdeaconry", image: "/gallery/arch-11.jpg" },
  { name: "Damilola Ogunojuwo", role: "Owutu Archdeaconry", image: "/gallery/arch-12.jpg" },
  { name: "Chairman Name", role: "Satellite Archdeaconry", image: "/gallery/arch-13.jpg" },
]

function ArchdeaconLeaders() {
  return (
    <section id="archdeacon-leaders" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Our Team" title="Our Archdeaconry Leaders" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((leader, index) => (
            <motion.div
              key={`${leader.role}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md"
            >
              <div className="relative overflow-hidden">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-4 left-4 right-4 flex translate-y-4 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {socialLinks.map(({ name, href, icon: Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-blue-600"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-1 font-geom text-lg font-bold text-slate-900">{leader.name}</h3>
                <p className="font-grotesk text-sm font-semibold text-blue-600">{leader.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ArchdeaconLeaders
