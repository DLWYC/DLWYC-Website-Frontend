import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-yellow-500 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src="/gallery/Logo1.svg" alt="DLWYC Logo" className="h-14 w-auto shrink-0 object-contain" />
            </div>
            <p className="text-white/90 text-sm leading-relaxed font-grotesk">
              Diocese of Lagos West Youth Chaplaincy — raising a generation of young believers committed to spiritual growth, fellowship, and making a positive impact.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-geom font-bold text-white mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Events', href: '/events' },
                { name: 'Gallery', href: '/gallery' },
                { name: 'Contact Us', href: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-white/90 hover:text-white transition-colors text-sm font-grotesk">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Join Workforce */}
          <div>
            <h4 className="font-geom font-bold text-white mb-5">Stay Updated</h4>
            <p className="text-white/90 text-sm leading-relaxed font-grotesk mb-4">
              Receive updates about fellowship, events, and opportunities to serve.
            </p>
            <a href="/join" className="inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">
              Join the Workforce
            </a>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-geom font-bold text-white mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-white shrink-0" size={14} />
                <span className="text-white/90 text-sm font-grotesk">dlwyouth@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-white mt-1 shrink-0" size={14} />
                <span className="text-white/90 text-sm font-grotesk">103 Oduduwa Crescent, GRA, Ikeja, Lagos State, Nigeria</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              {[FaFacebook, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-all">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/80 text-sm font-grotesk">
            © 2026 Diocese of Lagos West Youth Chaplaincy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer