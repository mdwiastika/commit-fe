"use client"

import Navigation from "@/components/navigation"

interface Material {
  id: number
  title: string
  description: string
  completed: boolean
}

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const materials: Material[] = [
    {
      id: 1,
      title: "Design Principles",
      description: "Description of Design principles",
      completed: true,
    },
    {
      id: 2,
      title: "Wireframing",
      description: "Description of wireframing",
      completed: true,
    },
    {
      id: 3,
      title: "Typography",
      description: "Description of typography",
      completed: true,
    },
    {
      id: 4,
      title: "Color Theory",
      description: "Description of Color Theory",
      completed: false,
    },
    {
      id: 5,
      title: "Prototyping",
      description: "Description of Prototyping",
      completed: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="roadmap" />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-primary mb-8">UI/UX Design</h1>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Semua Materi</h2>

          <div className="space-y-4">
            {materials.map((material) => (
              <div
                key={material.id}
                className={`rounded-2xl border-2 p-6 ${
                  material.completed ? "border-success bg-success/5" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {material.id}. {material.title}
                    </h3>
                    <p className="text-gray-600">{material.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${material.completed ? "text-gray-700" : "text-gray-500"}`}>
                      {material.completed ? "Sudah dipelajari" : "Belum dipelajari"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
