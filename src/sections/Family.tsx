import { useState } from 'react'
import { motion } from 'framer-motion'

const familyValues = [
  {
    letter: 'F',
    title: 'Faith',
    desc: 'Trusting God and stepping forward together in our calling.',
    image: '/gallery/pix17.jpg',
  },
  {
    letter: 'A',
    title: 'Acceptance',
    desc: 'Welcoming every member of our community with grace and care.',
    image: '/gallery/pix18.jpg',
  },
  {
    letter: 'M',
    title: 'Mission',
    desc: 'Serving others with purpose and advancing the Kingdom together.',
    image: '/gallery/pix19.jpg',
  },
  {
    letter: 'I',
    title: 'Integrity',
    desc: 'Walking in honesty, humility, and authentic relationship.',
    image: '/gallery/pix20.jpg',
  },
  {
    letter: 'L',
    title: 'Love',
    desc: 'Extending genuine care and compassion to one another.',
    image: '/gallery/pix21.jpg',
  },
  {
    letter: 'Y',
    title: 'Youth',
    desc: 'Empowering young people to grow, lead, and shine in faith.',
    image: '/gallery/pix22.jpg',
  },
]

function Family() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="values" className="relative overflow-hidden bg-white py-24 lg:py-26">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.35em] text-blue-600 font-grotesk">
            Our Core Values
          </span>
          <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl lg:text-[50px] font-rubik">
            The FAMILY of <span className="text-blue-600">DLWYC</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] text-slate-600 font-grotesk">
            These values guide our relationships, our ministry, and our service to the Church and society.
          </p>
          {/* <p className="mt-6 text-sm uppercase tracking-[0.45em] text-slate-400">Hover to explore</p> */}
        </motion.div>

        <div className="flex flex-col lg:flex-row h-[720px] lg:h-[540px] gap-2 sm:gap-3 overflow-hidden rounded-[1.5rem]">
          {familyValues.map((item, index) => {
            const isActive = hoveredIndex === index

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(isActive ? null : index)}
                style={{ flexGrow: isActive ? 4 : 1, flexBasis: 0 }}
                className="group relative h-full min-w-[60px] cursor-pointer overflow-hidden rounded-[1.5rem] transition-all duration-500 ease-in-out"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                {/* Collapsed state: big letter with the word stacked right underneath, both upright */}
                <div className={`absolute inset-0 flex flex-col items-center justify-end gap-2 pb-6 sm:pb-8 transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">
                    {item.letter}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-white/90 whitespace-nowrap">
                    {item.title}
                  </span>
                </div>

                {/* Expanded state: letter top, title + description card bottom-left */}
                <div className={`absolute inset-0 flex flex-col justify-between  p-5 sm:p-7 transition-opacity duration-500 delay-100 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <span className="text-5xl sm:text-6xl font-black text-white drop-shadow-lg">
                    {item.letter}
                  </span>
                  <div className="rounded-2xl bg-black/60 backdrop-blur-sm p-4 sm:p-5 max-w-md">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-[15px]  text-gray-200 leading-relaxed font-grotesk">{item.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Family
