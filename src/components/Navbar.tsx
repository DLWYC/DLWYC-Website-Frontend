import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa'

const links = [
  { name: 'Home', to: '/' },
  {
    name: 'About Us',
    to: '/about',
    children: [
      { name: 'Chaplaincy', to: '/about' },
      { name: 'Our Chaplain', to: '/leadership' },
      { name: 'Our Archdeacon Leader', to: '/leadership' },
    ],
  },
  { name: 'Event', to: '/events' },
  { name: 'Gallery', to: '/gallery' },
  { name: 'Contact Us', to: '/contact' },
]

const loginLink = { name: 'Login', href: 'https://dlwyouth.org/userlogin' }

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = location.pathname === '/'
  // Transparent + white text only at the very top of the home page (over the
  // hero image). Everywhere else (scrolled, or any other page) it's a solid
  // white bar with dark text — this also keeps the dropdown menu readable,
  // since that panel is always a solid white background.
  const isTransparent = isHome && !scrolled

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-white/10 backdrop-blur-xl border-b border-white/20'
          : 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img src="/gallery/Logo1.svg" alt="DLWYC Logo" className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 object-contain" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              link.children ? (
                <div key={link.name} className="relative group">
                  <Link
                    to={link.to}
                    className={`flex items-center gap-1 px-3 xl:px-4 py-2 text-sm transition-colors font-grotesk font-medium ${
                      isTransparent ? 'text-black/90 hover:text-black' : 'text-black hover:text-blue-600'
                    }`}
                  >
                    {link.name}
                    <FaChevronDown size={9} />
                  </Link>
                  <div className="pointer-events-none absolute left-0 top-full z-20 hidden min-w-[220px] rounded-3xl border border-slate-200 bg-white p-3 shadow-xl transition duration-200 group-hover:block group-hover:pointer-events-auto">
                    {link.children.map((child) => (
                      <Link key={child.name} to={child.to} className="block rounded-2xl px-4 py-2 text-sm text-black hover:bg-slate-100 hover:text-blue-600 transition-colors font-grotesk">
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`px-3 xl:px-4 py-2 text-sm transition-colors font-grotesk font-medium ${
                    isTransparent ? 'text-black/90 hover:text-black' : 'text-black hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
            <a href={loginLink.href} target="_blank" rel="noopener noreferrer"
              className="ml-2 xl:ml-4 px-5 xl:px-6 py-2 xl:py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-500 transition-colors font-geom shrink-0">{loginLink.name}</a>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 ${isTransparent ? 'text-black' : 'text-black'}`}
          >
            {open ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 max-h-[80vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-1">
              {links.map((link, i) => (
                <div key={link.name}>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={link.to} onClick={() => setOpen(false)}
                      className="block px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-black hover:text-blue-600 transition-colors font-grotesk font-medium">{link.name}</Link>
                  </motion.div>
                  {link.children && link.children.map((child, j) => (
                    <motion.div key={child.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 + (j + 1) * 0.03 }}>
                      <Link to={child.to} onClick={() => setOpen(false)}
                        className="block rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 pl-6 sm:pl-8 text-xs sm:text-sm text-black hover:bg-slate-100 hover:text-blue-600 transition-colors font-grotesk">{child.name}</Link>
                    </motion.div>
                  ))}
                </div>
              ))}
              <a href={loginLink.href} target="_blank" rel="noopener noreferrer"
                className="block rounded-full bg-blue-600 px-4 py-2.5 sm:py-3 text-center text-sm font-bold text-black hover:bg-blue-500 transition-colors font-geom mt-2">{loginLink.name}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
export default Navbar
