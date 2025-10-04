'use client'

import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { ChevronRight, Star, Target } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
    <div className="min-h-screen bg-gradient-to-b from-[#e9edff] to-white px-6">
      <Navigation currentPage="roadmap" />

      <main className="max-w-6xl mx-auto px-6 py-12 min-h-[calc(100vh-170px)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 pt-22">
          <h1 className="text-4xl font-bold text-[#4b63d0] tracking-tight">
            Roadmap Belajar
          </h1>
          <Target className="w-10 h-10 text-[#4b63d0]" />
        </div>

        {/* Current Roadmap */}
        <section className="mb-14">
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
        </section>

        {/* Completed Roadmaps */}
        {/* <section className="mb-14">
          <h2 className="text-2xl font-semibold text-[#4b63d0] mb-6 flex items-center gap-2">
            Roadmap Diselesaikan
          </h2>

          <div className="space-y-5">
            {completedRoadmaps.map((roadmap) => (
              <Link key={roadmap.id} href={`/roadmap/${roadmap.id}`}>
                <div className="bg-gradient-to-r from-[#4b63d0]/10 to-[#4b63d0]/5 border border-[#4b63d0]/20 rounded-2xl p-6 hover:shadow-[0_8px_20px_rgba(75,99,208,0.15)] transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {roadmap.title}
                      </h3>
                      <p className="text-gray-600">
                        {roadmap.materials} Materi
                      </p>
                      <p className="text-sm text-gray-700 mt-2 italic">
                        {roadmap.completionText}
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-[#4b63d0]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section> */}

        {/* Other Roadmaps */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#4b63d0]">
              Roadmap Lainnya
            </h2>
            <ChevronRight className="w-6 h-6 text-[#4b63d0]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherRoadmaps.map((roadmap) => (
              <Link key={roadmap.id} href={`/roadmap/${roadmap.id}`}>
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
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
