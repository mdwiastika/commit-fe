'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-20 mb-6 text-center"
    >
      <div className="backdrop-blur-md bg-white/70 border border-[#d7dffc]/60 rounded-2xl shadow-sm py-6 px-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4">
          <p className="text-gray-700 font-medium">
            © {new Date().getFullYear()}{' '}
            <span className="text-[#4b63d0] font-semibold">Commit</span>. All
            rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/about"
              className="hover:text-[#4b63d0] transition-colors"
            >
              Tentang
            </Link>
            <Link
              href="/privacy"
              className="hover:text-[#4b63d0] transition-colors"
            >
              Privasi
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#4b63d0] transition-colors"
            >
              Kontak
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
