import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaArrowLeft,
  FaBolt,
} from "react-icons/fa";
import SectionTitle from "@/components/SectionTitle";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const subject = encodeURIComponent(formData.subject || "General Inquiry");
    const body = encodeURIComponent(
      "Name: " +
        formData.name +
        "\nEmail: " +
        formData.email +
        "\n\nMessage:\n" +
        formData.message,
    );
    window.location.href =
      "mailto:dlwyouth@gmail.com?subject=" + subject + "&body=" + body;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-grotesk";
  const labelClass =
    "block text-sm font-medium text-slate-700 mb-2 font-grotesk";

  return (
    <section className="min-h-screen py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-10 font-grotesk"
        >
          <FaArrowLeft size={12} /> Back to Home
        </Link>

        <SectionTitle
          subtitle="Get In Touch"
          title="Contact Us"
          description="Have questions or want to get involved? We would love to hear from you. Reach out to us through any of the channels below."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <FaMapMarkerAlt className="text-blue-600" size={18} />
            </div>
            <h4 className="font-geom font-bold text-slate-900 mb-1">
              Visit Us
            </h4>
            <p className="text-slate-500 text-sm font-grotesk">
              103 Oduduwa Crescent, GRA
            </p>
            <p className="text-slate-500 text-sm font-grotesk">
              Ikeja, Lagos State, Nigeria
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <FaEnvelope className="text-blue-600" size={18} />
            </div>
            <h4 className="font-geom font-bold text-slate-900 mb-1">
              Email Us
            </h4>
            <p className="text-slate-500 text-sm font-grotesk">
              dlwyouth@gmail.com
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <FaClock className="text-blue-600" size={18} />
            </div>
            <h4 className="font-geom font-bold text-slate-900 mb-1">
              Office Hours
            </h4>
            <p className="text-slate-500 text-sm font-grotesk">
              Monday - Friday
            </p>
            <p className="text-slate-500 text-sm font-grotesk">
              9:00 AM - 4:00 PM
            </p>
          </div>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-blue-200 bg-blue-50 p-12 text-center max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <FaPaperPlane className="text-blue-600" size={28} />
            </div>
            <h4 className="font-geom text-xl font-bold text-slate-900 mb-2">
              Message Ready to Send
            </h4>
            <p className="text-slate-500 font-grotesk">
              Your request will open in your email app so you can complete
              sending.
            </p>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto space-y-5 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className={labelClass}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className={inputClass + " resize-none"}
                placeholder="Write your message here..."
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <FaBolt className="text-blue-500" size={16} />
              <p className="text-slate-500 text-sm font-grotesk">
                We usually reply within 24 hours
              </p>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all duration-300 font-geom"
            >
              <FaPaperPlane size={16} />
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default ContactPage;
