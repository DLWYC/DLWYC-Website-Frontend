import React from "react";
import { motion } from "framer-motion";
import {
  FaPrayingHands,
  FaBookOpen,
  FaUsers,
  FaHandHoldingHeart,
  FaMusic,
  FaGraduationCap,
} from "react-icons/fa";
import SectionTitle from "@/components/SectionTitle";

const programs = [
  {
    icon: FaPrayingHands,
    title: "Youth Fellowship",
    description:
      "Weekly gatherings for worship, prayer, and fellowship every Sunday evening. A time to connect with God and fellow young believers.",
    schedule: "Sundays, 4:00 PM",
  },
  {
    icon: FaBookOpen,
    title: "Bible Study",
    description:
      "In-depth study of Scripture in small groups, exploring biblical truths and their application to daily life and challenges.",
    schedule: "Wednesdays, 5:30 PM",
  },
  {
    icon: FaUsers,
    title: "Prayer Meetings",
    description:
      "Dedicated times of intercession, personal prayer, and seeking God's face together as a youth community.",
    schedule: "Fridays, 6:00 PM",
  },
  {
    icon: FaHandHoldingHeart,
    title: "Community Outreach",
    description:
      "Regular visits to orphanages, hospitals, and community service projects to demonstrate Christ's love in action.",
    schedule: "Last Saturday Monthly",
  },
  {
    icon: FaMusic,
    title: "Choir & Creative Arts",
    description:
      "Training and development in music, drama, dance, and other creative expressions for worship and evangelism.",
    schedule: "Saturdays, 3:00 PM",
  },
  {
    icon: FaGraduationCap,
    title: "Leadership Academy",
    description:
      "Structured training for emerging youth leaders covering biblical leadership, administration, and ministry skills.",
    schedule: "Quarterly Intensives",
  },
];

function Programs() {
  return (
    <section id="programs" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="What We Do"
          title="Our Programs"
          description="We offer diverse programs designed to meet the spiritual, social, and developmental needs of young people across the Diocese."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-3xl p-7 border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-600/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <program.icon className="text-blue-600" size={26} />
              </div>
              <h3 className="font-geom text-xl font-bold text-slate-900 mb-3">
                {program.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 font-grotesk">
                {program.description}
              </p>
              <div className="pt-4 border-t border-blue-100">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider font-grotesk">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  {program.schedule}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Programs;
