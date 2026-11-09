import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaPaperPlane } from 'react-icons/fa'

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    const subject = encodeURIComponent(formData.subject || 'General Inquiry')
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
    )
    window.location.href = `mailto:dlwyouth@gmail.com?subject=${subject}&body=${body}`
  }

  const inputClass = 'mt-2 w-full rounded-xl border border-slate-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all'
  const labelClass = 'text-sm text-gray-300 font-medium'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6'
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className='w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-neutral-950 p-8 shadow-2xl'
          >
            <div className='flex items-start justify-between gap-4 mb-6'>
              <div>
                <p className='text-sm uppercase tracking-widest text-blue-400 font-grotesk'>Contact Us</p>
                <h2 className='mt-2 text-2xl font-bold text-white font-geom'>Send a message to DLWYC</h2>
              </div>
              <button onClick={onClose} className='rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 shrink-0'>
                <FaTimes />
              </button>
            </div>

            {submitted ? (
              <div className='rounded-2xl border border-blue-500/20 bg-blue-500/10 p-8 text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 text-blue-400'>
                  <FaPaperPlane size={24} />
                </div>
                <h3 className='text-xl font-semibold text-white mb-2'>Message ready to send</h3>
                <p className='text-sm text-gray-400'>Your request will open in your email app so you can complete sending.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className={labelClass}>Name</label>
                  <input type='text' name='name' value={formData.name} onChange={handleChange} required className={inputClass} placeholder='Your full name' />
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input type='email' name='email' value={formData.email} onChange={handleChange} required className={inputClass} placeholder='your@email.com' />
                </div>

                <div>
                  <label className={labelClass}>Subject</label>
                  <input type='text' name='subject' value={formData.subject} onChange={handleChange} required className={inputClass} placeholder='How can we help?' />
                </div>

                <div>
                  <label className={labelClass}>Message</label>
                  <textarea name='message' rows={4} value={formData.message} onChange={handleChange} required className={`${inputClass} resize-none`} placeholder='Write your message here...' />
                </div>

                <div className='flex gap-3 pt-2'>
                  <button type='submit' className='flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500'>
                    <FaPaperPlane size={14} />
                    Send message
                  </button>
                  <button type='button' onClick={onClose} className='inline-flex items-center justify-center rounded-xl border border-slate-600 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10'>
                    Close
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ContactModal