"use client"

import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"

export default function PemilihanPembelajaran() {
  const router = useRouter()

  const roadmaps = [
    { id: "ui-ux-1", title: "UI/UX Design", materials: 40 },
    { id: "frontend-1", title: "Frontend Developer", materials: 40 },
    { id: "backend-1", title: "Backend Developer", materials: 40 },
    { id: "mobile-1", title: "Mobile Developer", materials: 40 },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-12">Pilih Roadmap Belajar</h1>

        {/* Custom Roadmap Card */}
        <button
          onClick={() => router.push("/custom-roadmap")}
          className="w-full bg-[#6582e6] text-white rounded-2xl p-6 mb-8 flex items-center justify-between hover:bg-[#5571d5] transition-colors"
        >
          <div className="text-left">
            <h2 className="text-2xl font-bold mb-1">Buat Roadmap Sendiri</h2>
            <p className="text-white/90">Pelajari materi sesuai keinginan kamu</p>
          </div>
          <ChevronRight className="w-8 h-8 flex-shrink-0" />
        </button>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmaps.map((roadmap) => (
            <button
              key={roadmap.id}
              onClick={() => router.push(`/roadmap-detail/${roadmap.id}`)}
              className="bg-white border-2 border-[#6582e6] rounded-2xl p-6 flex items-center justify-between hover:bg-[#f0f3ff] transition-colors"
            >
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">{roadmap.title}</h3>
                <p className="text-[#5f6265]">{roadmap.materials} Materi</p>
              </div>
              <ChevronRight className="w-6 h-6 text-[#5f6265] flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
