import React from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";

function About() {
  return (
    <section id="our-impact" className="py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Our Impact"
          title="Building a Generation of Faithful Leaders"
          description="Since our establishment, the Diocese of Lagos West Youth Chaplaincy has been at the forefront of youth spiritual development within the Anglican Communion."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                  <img
                    src="/gallery/pix8.jpg"
                    alt="Youth fellowship"
                    className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                  <img
                    src="/gallery/pix9.jpg"
                    alt="Youth gathering"
                    className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="pt-8">
                <div className="rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                  <img
                    src="/gallery/pix10.jpg"
                    alt="Youth worship"
                    className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-4 sm:right-8 bg-yellow-600 text-black rounded-2xl p-5 shadow-xl">
              <p className="font-geom text-3xl font-bold">15+</p>
              <p className="text-sm text-black/80 font-grotesk">
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
            <h3 className="font-geom text-2xl sm:text-3xl font-bold text-white mb-5">
              What We're Building Together
            </h3>
            <p className="text-gray-400 leading-relaxed mb-5 font-grotesk">
              Our chaplaincy serves as a bridge between the traditional values
              of the Anglican faith and the dynamic energy of young people.
              Through worship, discipleship, fellowship, and service, we are
              raising a generation that will impact the world for Christ.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8 font-grotesk">
              We provide a nurturing environment where young people can grow in
              their relationship with God, develop their gifts and talents, and
              become effective leaders in the church and society.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Weekly Fellowship Meetings",
                "Bible Study & Discipleship",
                "Community Outreach Programs",
                "Leadership Development",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-600/20 flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  </div>
                  <span className="text-gray-300 font-medium text-sm font-grotesk">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
