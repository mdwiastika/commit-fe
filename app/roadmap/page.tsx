"use client"

import Navigation from "@/components/navigation"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function RoadmapPage() {
  const currentRoadmap = {
    id: "ui-ux-design",
    title: "UI/UX Design",
    materials: 40,
  }

  const completedRoadmaps = [
    {
      id: "python-programming",
      title: "Phyton Programming",
      materials: 40,
      completionText: "Lulus dengan menyelesaikan 60% materi",
    },
  ]

  const otherRoadmaps = [
    { id: "ui-ux-1", title: "UI/UX Design", materials: 40 },
    { id: "ui-ux-2", title: "UI/UX Design", materials: 40 },
    { id: "ui-ux-3", title: "UI/UX Design", materials: 40 },
    { id: "ui-ux-4", title: "UI/UX Design", materials: 40 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="roadmap" />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Current Roadmap */}
        <section className="mb-12">
          <h1 className="text-2xl font-semibold text-primary mb-6">Roadmap Saat ini</h1>

          <Link href={`/roadmap/${currentRoadmap.id}`}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{currentRoadmap.title}</h3>
                  <p className="text-gray-500">{currentRoadmap.materials} Materi</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </Link>
        </section>

        {/* Completed Roadmaps */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Roadmap Diselesaikan</h2>

          <div className="space-y-4">
            {completedRoadmaps.map((roadmap) => (
              <Link key={roadmap.id} href={`/roadmap/${roadmap.id}`}>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{roadmap.title}</h3>
                      <p className="text-gray-500 mb-2">{roadmap.materials} Materi</p>
                      <p className="text-sm text-gray-600">{roadmap.completionText}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Other Roadmaps */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-primary">Roadmap Lainnya</h2>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherRoadmaps.map((roadmap) => (
              <Link key={roadmap.id} href={`/roadmap/${roadmap.id}`}>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{roadmap.title}</h3>
                      <p className="text-gray-500">{roadmap.materials} Materi</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
