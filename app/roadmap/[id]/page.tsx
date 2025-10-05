'use client'

import { Navigation } from '@/components/navigation'
import { useEffect, useState } from 'react'

interface Material {
  id: number
  name: string
  description: string
  roadmap: {
    name: string
  }
}

export default function RoadmapDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const [materials, setMaterials] = useState<Material[]>([])

  useEffect(() => {
    const fetchRoadmapDetails = async (roadmapId: string) => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          console.error('Token tidak ditemukan')
          return
        }
        console.log(roadmapId)

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        const response = await fetch(
          `${API_URL}/roadmap-details?roadmap_id=${roadmapId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            method: 'GET',
          },
        )

        if (!response.ok) throw new Error('Gagal mengambil data detail roadmap')

        const result = await response.json()
        setMaterials(result.data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchRoadmapDetails(id)
  }, [id])

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="roadmap" />

      <main className="max-w-4xl mx-auto px-6 py-8 pt-28">
        <h1 className="text-2xl font-semibold text-primary mb-8">
          {materials.length > 0 ? materials[0].roadmap.name : 'Detail Roadmap'}
        </h1>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Semua Materi
          </h2>
          <div className="space-y-4">
            {materials.map((m, i) => (
              <div
                key={m.id}
                className={`rounded-2xl border-2 p-6 border-gray-200 bg-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {i + 1}. {m.name}
                    </h3>
                    <p className="text-gray-600">{m.description}</p>
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
