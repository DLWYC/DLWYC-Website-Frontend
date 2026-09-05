import React from "react";
import { motion } from "framer-motion";
import { FaBullseye, FaEye } from "react-icons/fa";
import SectionTitle from "@/components/SectionTitle";

const cards = [
  {
    icon: FaBullseye,
    title: "Our Mission",
    description:
      "To evangelize, disciple, and empower young people within the Diocese of Lagos West, equipping them with biblical knowledge, spiritual disciplines, and leadership skills to serve God effectively in their generation.",
    points: [
      "Spiritual Formation",
      "Discipleship Training",
      "Youth Evangelism",
      "Character Development",
    ],
  },
  {
    icon: FaEye,
    title: "Our Vision",
    description:
      "To see a generation of spiritually vibrant, morally upright, and socially responsible young Anglicans who are transforming their communities and nation through the power of the Gospel.",
    points: [
      "Transformed Lives",
      "Godly Leadership",
      "Community Impact",
      "Global Relevance",
    ],
  },
];

function MissionVision() {
  return (
    <section id="mission" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          subtitle="Our Purpose"
          title="Mission & Vision"
          description="Driven by a clear sense of purpose, we are committed to raising a generation that will advance God's kingdom on earth."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-neutral-900 border border-yellow-600/10 rounded-3xl p-8 sm:p-10 hover:border-yellow-600/30 transition-colors duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-yellow-600/15 flex items-center justify-center mb-6">
                <card.icon className="text-yellow-500" size={32} />
              </div>
              <h3 className="font-geom text-2xl sm:text-3xl font-bold text-white mb-4">
                {card.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6 font-grotesk">
                {card.description}
              </p>
              <ul className="space-y-3">
                {card.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                    <span className="text-gray-300 text-sm font-medium font-grotesk">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MissionVision;
