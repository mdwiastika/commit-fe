"use client"

import { useRouter } from "next/navigation"

interface Material {
  id: number
  title: string
  description: string
}

export default function RoadmapDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { id } = params

  const materials: Material[] = [
    {
      id: 1,
      title: "Design Principles",
      description: "Description of Design principles",
    },
    {
      id: 2,
      title: "Wireframing",
      description: "Description of wireframing",
    },
    {
      id: 3,
      title: "Typography",
      description: "Description of typography",
    },
    {
      id: 4,
      title: "Color Theory",
      description: "Description of Color Theory",
    },
    {
      id: 5,
      title: "Prototyping",
      description: "Description of Prototyping",
    },
  ]

  const roadmapTitles: Record<string, string> = {
    "ui-ux-1": "UI/UX Design",
    "frontend-1": "Frontend Developer",
    "backend-1": "Backend Developer",
    "mobile-1": "Mobile Developer",
  }

  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{roadmapTitles[id] || "Roadmap"}</h1>
          <button
            onClick={() => router.push("/komitmen")}
            className="bg-[#6582e6] text-white px-6 py-3 rounded-lg hover:bg-[#5571d5] transition-colors font-medium"
          >
            Pelajari sekarang
          </button>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-6">Semua Materi</h2>

          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-1">
                  {material.id}. {material.title}
                </h3>
                <p className="text-[#5f6265]">{material.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
