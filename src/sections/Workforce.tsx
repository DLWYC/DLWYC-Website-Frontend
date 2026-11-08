import { Link } from "@tanstack/react-router";
import { FaUsers, FaArrowRight } from "react-icons/fa";
import SectionTitle from "@/components/SectionTitle";
import workforceOptions from "../data/workforce"

function WorkforceSection() {
  // const workforceOptions = [
  //   "Program",
  //   "Security",
  //   "Medical",
  //   "Media & Publicity",
  //   "Accomodation",
  //   "Protocol & Ushering",
  //   "Music",
  //   "Technical",
  //   "Logistic",
  // ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionTitle
          subtitle="Join The Team"
          title="Workforce"
          description="Find your place, serve with passion, and grow in your walk with God."
        />

        <div className="flex flex-wrap justify-center gap-2 mt-8 mb-10">
          {workforceOptions.map((option: any) => (
            <span
              key={option}
              className="px-4 py-2 rounded-full text-xs font-medium border border-slate-200 bg-slate-50 text-slate-600 font-grotesk"
            >
              {option}
            </span>
          ))}
        </div>

        <Link
          to={"/"}
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all duration-300 font-geom"
        >
          <FaUsers size={16} />
          Apply Now
          <FaArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

export default WorkforceSection;
