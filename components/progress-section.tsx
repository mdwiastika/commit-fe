'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function ProgressSection({
  completedMaterials,
  totalMaterials,
  percentage,
  deadline,
}: {
  completedMaterials: number
  totalMaterials: number
  percentage: number
  deadline: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl bg-white/70 backdrop-blur-lg shadow-sm border border-[#e0e6ff]/60"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#5f6265] text-lg font-semibold">Progress</h2>
        <span className="text-[#4b63d0] text-2xl font-bold">{percentage}%</span>
      </div>

      <div className="h-3 bg-[#e8edff] rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-[#5c74e6] to-[#7f97ff]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <div className="flex justify-between text-sm text-[#5f6265] mb-6">
        <span>Deadline belajar: {deadline}</span>
        <span>
          {completedMaterials}/{totalMaterials} materi selesai
        </span>
      </div>

      <Link href="/progress">
        <Button className="bg-[#5c74e6] hover:bg-[#4b63d0] text-white rounded-full px-6 py-2 transition-all shadow-sm hover:shadow-md">
          Lanjutkan belajar hari ini
        </Button>
      </Link>
    </motion.div>
  )
}
