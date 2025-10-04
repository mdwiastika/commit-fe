"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface RoadmapDetail {
  id: string
  name: string
  description: string
  roadmap: {
    id: string
    name: string
    description: string
  }
}

export default function RoadmapDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { id } = params
  const [roadmapDetails, setRoadmapDetails] = useState<RoadmapDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRoadmapDetails = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.")
          setLoading(false)
          return
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

        const res = await fetch(`${API_URL}/roadmap-details?roadmap_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) throw new Error("Gagal mengambil data roadmap detail")

        const data = await res.json()
        setRoadmapDetails(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      } finally {
        setLoading(false)
      }
    }

    fetchRoadmapDetails()
  }, [id])

  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {roadmapDetails[0]?.roadmap?.name || "Roadmap"}
          </h1>
          <button
            onClick={() => router.push("/komitmen")}
            className="bg-[#6582e6] text-white px-6 py-3 rounded-lg hover:bg-[#5571d5] transition-colors font-medium"
          >
            Pelajari sekarang
          </button>
        </div>

        {loading && <p>Loading roadmap details...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <section>
            <h2 className="text-xl font-semibold mb-6">Semua Materi</h2>
            <div className="space-y-4">
              {roadmapDetails.map((material, index) => (
                <div
                  key={material.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-1">
                    {index + 1}. {material.name}
                  </h3>
                  <p className="text-[#5f6265]">{material.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
