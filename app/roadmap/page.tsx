'use client'

import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { ChevronRight, Star, Target } from 'lucide-react'
import Link from 'next/link'

export default function RoadmapPage() {
  const currentRoadmap = {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    materials: 40,
  }

  const completedRoadmaps = [
    {
      id: 'python-programming',
      title: 'Python Programming',
      materials: 40,
      completionText: 'Lulus dengan menyelesaikan 60% materi',
    },
  ]

  const otherRoadmaps = [
    { id: 'ui-ux-1', title: 'UI/UX Design', materials: 40 },
    { id: 'ui-ux-2', title: 'UI/UX Design', materials: 40 },
    { id: 'ui-ux-3', title: 'UI/UX Design', materials: 40 },
    { id: 'ui-ux-4', title: 'UI/UX Design', materials: 40 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e9edff] to-white px-6">
      <Navigation currentPage="roadmap" />

      <main className="max-w-6xl mx-auto px-6 py-12">
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
                    {currentRoadmap.title}
                  </h3>
                  <p className="text-gray-600">
                    {currentRoadmap.materials} Materi
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-[#4b63d0]" />
              </div>
            </div>
          </Link>
        </section>

        {/* Completed Roadmaps */}
        <section className="mb-14">
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
        </section>

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
                        {roadmap.title}
                      </h3>
                      <p className="text-gray-600">
                        {roadmap.materials} Materi
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
