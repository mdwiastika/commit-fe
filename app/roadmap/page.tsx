'use client'

import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { ChevronRight, Target } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion' // ✅ Tambahkan ini

export default function RoadmapPage() {
  const [currentRoadmap, setCurrentRoadmap] = useState(
    {} as {
      id: string
      name: string
      roadmap_details_count: number
    },
  )
  const [otherRoadmaps, setOtherRoadmaps] = useState(
    [] as {
      id: string
      name: string
      roadmap_details_count: number
    }[],
  )

  useEffect(() => {
    fetchRoadmaps()
  }, [])

  const fetchRoadmaps = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.error('Token tidak ditemukan')
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

      const response = await fetch(`${API_URL}/roadmaps-dashboard`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil data roadmap')
      }

      const result = await response.json()
      console.log(result)
      setCurrentRoadmap(result.data.current_roadmap)
      setOtherRoadmaps(result.data.roadmaps)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#e9edff] to-white px-6 pb-24 md:pb-4">
      <Navigation currentPage="roadmap" />

      {/* Tambahkan motion di sini */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="
          flex-grow 
          max-w-6xl mx-auto w-full 
          px-2 sm:px-6 
          pt-6 md:pt-32 
        "
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-between mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#4b63d0] tracking-tight">
            Roadmap Belajar
          </h1>
          <Target className="w-8 h-8 md:w-10 md:h-10 text-[#4b63d0]" />
        </motion.div>

        {/* Current Roadmap */}
        {currentRoadmap?.id && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-[#4b63d0] mb-6">
              Roadmap Saat Ini
            </h2>

            <Link href={`/roadmap/${currentRoadmap.id}`}>
              <div className="bg-white/90 backdrop-blur-sm border border-[#4b63d0]/20 rounded-2xl p-6 hover:shadow-[0_8px_20px_rgba(75,99,208,0.2)] transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {currentRoadmap.name}
                    </h3>
                    <p className="text-gray-600">
                      {currentRoadmap.roadmap_details_count} Materi
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-[#4b63d0]" />
                </div>
              </div>
            </Link>
          </motion.section>
        )}

        {/* Other Roadmaps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="pb-4 md:pb-0"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#4b63d0]">
              Roadmap Lainnya
            </h2>
            <ChevronRight className="w-6 h-6 text-[#4b63d0]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherRoadmaps.map((roadmap, i) => (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              >
                <Link href={`/roadmap/${roadmap.id}`}>
                  <div className="bg-white/90 border border-[#4b63d0]/20 rounded-2xl p-6 hover:shadow-[0_6px_16px_rgba(75,99,208,0.15)] hover:-translate-y-1 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {roadmap.name}
                        </h3>
                        <p className="text-gray-600">
                          {roadmap.roadmap_details_count} Materi
                        </p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-[#4b63d0]" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.main>

      {/* Footer hanya di desktop/tablet */}
      <div className="hidden md:block mt-auto">
        <Footer />
      </div>
    </div>
  )
}
