import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";

const chaplains = [
  {
    name: "Ven. Ariire Ayo Kolawole",
    role: "Diocesan Chaplain",
    image: "/chaplain-01.jpg",
  },
  {
    name: "Rev. Dickson Orhewere",
    role: "Asst. Diocesan Chaplain",
    image: "/chaplain-02.jpg",
  },
  {
    name: "Olowofela Akinfolarin",
    role: "Opebi Archdeaconry",
    image: "/chaplain-03.jpg",
  },
  {
    name: "Rev. Asaolu Johnson",
    role: "Ojo Archdeaconry",
    image: "/chaplain-04.jpg",
  },
  {
    name: "Rev. Oniosun John",
    role: "Ipaja Archdeaconry",
    image: "/chaplain-05.jpg",
  },
  {
    name: "Rev. Odu",
    role: "Somolu Archdeaconry",
    image: "/chaplain-06.jpg",
  },
  {
    name: "Rev. Marcus Bamigbola",
    role: "Ojodu Archdeaconry",
    image: "/chaplain-07.jpg",
  },
  {
    name: "Rev. Adeyinka Faloyin",
    role: "Amuwo-Odofin Archdeaconry",
    image: "/chaplain-08.jpg",
  },
  {
    name: "Rev. Ogunleye Titilola",
    role: "Oto-Awori Archdeaconry",
    image: "/chaplain-09.jpg",
  },
  {
    name: "Rev. Oluwaseun Omojuyigbe",
    role: "Iju-Ishaga Archdeaconry",
    image: "/chaplain-10.jpg",
  },
  {
    name: "Rev. Samuel Asaolu",
    role: "Festac Archdeaconry",
    image: "/chaplain-11.jpg",
  },
  {
    name: "Rev. Peter Adegbite",
    role: "Ikotun Archdeaconry",
    image: "/chaplain-12.jpg",
  },
  {
    name: "Rev. Daramola Ebenezer",
    role: "Agege Archdeaconry",
    image: "/chaplain-13.jpg",
  },
  {
    name: "Rev. Samuel Adetona",
    role: "Ikeja Archdeaconry",
    image: "/chaplain-14.jpg",
  },
  {
    name: "Rev. David Ogunfowoke",
    role: "Idimu Archdeaconry",
    image: "/chaplain-15.jpg",
  },
  {
    name: "Rev. Oluseye Olagoke",
    role: "Ogudu Archdeaconry",
    image: "/chaplain-16.jpg",
  },
  {
    name: "Rev. Faleye Samuel",
    role: "Bariga Archdeaconry",
    image: "/chaplain-17.jpg",
  },
  {
    name: "Rev. Adedji Adegbokun",
    role: "Iba Archdeaconry",
    image: "/chaplain-18.jpg",
  },
];

function Leadership() {
  return (
    <section id="leadership" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Our Clergy"
          title="Meet Our Chaplains"
          description="Meet the diocesan chaplains serving the Diocese of Lagos West Youth Chaplaincy."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chaplains.map((chaplain, index) => (
            <motion.div
              key={chaplain.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={chaplain.image}
                  alt={chaplain.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-geom text-lg font-bold text-slate-900 mb-1">
                  {chaplain.name}
                </h3>
                <p className="text-primary text-sm font-semibold mb-3 font-grotesk">
                  {chaplain.role}
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
