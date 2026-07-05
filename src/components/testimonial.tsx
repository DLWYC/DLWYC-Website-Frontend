import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: "Search and find your dream job is now easier than ever. Just browse a job and apply if you need to.",
    name: "Mas Parjono",
    role: "UI Designer at Google",
  },
  {
    quote: "I landed my first developer role within two weeks of signing up. The process was incredibly smooth.",
    name: "Amara Nwosu",
    role: "Frontend Engineer at Stripe",
  },
  {
    quote: "The best job platform I've used. Clean, fast, and the recommendations are actually relevant.",
    name: "Tolu Adeyemi",
    role: "Product Manager at Notion",
  },
]

const DURATION   = 250   // slide transition duration (ms)
const AUTO_DELAY = 4000  // ms between auto-advances

/**
 * Three-phase slide:
 *   1. "out"      — current content slides out in direction of travel + fades
 *   2. "entering" — new content repositions instantly on the opposite side (no transition)
 *   3. "in"       — transition fires, content slides to x:0 + fades in
 *
 * Auto-advances every AUTO_DELAY ms.
 * Manual navigation resets the timer so it never fights the user.
 */
export function Testimonial() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('in')  // 'out' | 'entering' | 'in'
  const [dir, setDir]     = useState(1)     // 1 = forward →, -1 = backward ←
  const [next, setNext]   = useState(0)     // index staged to show next
  const [tick, setTick]   = useState(0)     // bumped on manual nav to reset timer

  const go = (nextIndex: number, direction: number) => {
    if (phase !== 'in') return  // block rapid clicks mid-transition
    setDir(direction)
    setNext(nextIndex)
    setPhase('out')
  }

  const prev = () => { go((index - 1 + TESTIMONIALS.length) % TESTIMONIALS.length, -1); setTick(t => t + 1) }
  const fwd  = () => { go((index + 1) % TESTIMONIALS.length,  1);                        setTick(t => t + 1) }

  // Auto-advance — restarts whenever index changes or user manually navigates (tick bump)
  useEffect(() => {
    const id = setInterval(() => go((index + 1) % TESTIMONIALS.length, 1), AUTO_DELAY)
    return () => clearInterval(id)
  }, [index, tick]) // eslint-disable-line react-hooks/exhaustive-deps

  // Three-phase slide sequencer
  useEffect(() => {
    if (phase === 'out') {
      const t = setTimeout(() => {
        setIndex(next)
        setPhase('entering')
      }, DURATION)
      return () => clearTimeout(t)
    }
    if (phase === 'entering') {
      const id = requestAnimationFrame(() => setPhase('in'))
      return () => cancelAnimationFrame(id)
    }
  }, [phase, next])

  const { quote, name, role } = TESTIMONIALS[index]

  const tx = {
    out:      dir === 1 ? '-translate-x-8' : 'translate-x-8',
    entering: dir === 1 ? 'translate-x-8'  : '-translate-x-8',
    in:       'translate-x-0',
  }[phase]

  const opacity    = phase === 'in' ? 'opacity-100' : 'opacity-0'
  const transition = phase !== 'entering' ? 'transition-all ease-in-out' : ''

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[30vh] flex flex-col justify-end p-8 bg-black/40 backdrop-blur-sm overflow-hidden">
      <div
        style={{ transitionDuration: phase !== 'entering' ? `${DURATION}ms` : '0ms' }}
        className={`${tx} ${opacity} ${transition}`}
      >
        <p className="text-white text-[20px] font-semibold leading-[35px] mb-5 font-rubik">
          &ldquo;{quote}&rdquo;
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold text-md">{name}</p>
            <p className="text-white/60 text-xs mt-0.5">{role}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={fwd}
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="ml-3 text-white/60 text-xs cursor-default">Learn more →</span>
          </div>
        </div>
      </div>
    </div>
  )
}