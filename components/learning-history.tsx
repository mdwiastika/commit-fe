'use client'
import { Eye, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const historyData = [
  {
    day: 'Day 14:',
    title: 'Wireframing, Typography',
    date: '4 Sept 2025',
    amount: '+Rp 2.560',
    isPositive: true,
  },
  {
    day: 'Day 13:',
    title: '',
    date: '3 Sept 2025',
    amount: '-Rp 2.560',
    isPositive: false,
  },
  {
    day: 'Day 12:',
    title: 'Wireframing',
    date: '2 Sept 2025',
    amount: '+Rp 2.560',
    isPositive: true,
  },
  {
    day: 'Day 11:',
    title: 'Design Principles, Prototypes',
    date: '1 Sept 2025',
    amount: '+Rp 2.560',
    isPositive: true,
  },
]

export function LearningHistory({ history }: { history?: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#4b63d0] text-lg font-semibold">
          Riwayat Belajar
        </h3>
        <Link
          href="/riwayat"
          className="flex items-center text-[#4b63d0] text-sm hover:underline"
        >
          Lihat selengkapnya
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-3">
        {historyData.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            className={`rounded-xl p-4 flex items-center justify-between border border-[#e0e6ff]/60 ${
              item.isPositive
                ? 'bg-gradient-to-r from-[#e7fff5] to-[#f4fff9]'
                : 'bg-gradient-to-r from-[#fff0ef] to-[#ffe8e7]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#121212] font-medium">{item.day}</span>
                <span className="text-[#5f6265]">{item.title}</span>
              </div>
              <div className="text-[#7a7d81] text-sm mt-1">{item.date}</div>
            </div>

            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-[#5f6265]" />
              <span
                className={`font-semibold ${
                  item.isPositive ? 'text-[#0bac74]' : 'text-[#ea3829]'
                }`}
              >
                {item.amount}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-[#5f6265] text-sm italic">
          “Kebiasaan kecil setiap hari akan jadi hasil besar nanti 💪”
        </p>
      </div>
    </motion.div>
  )
}
