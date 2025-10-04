'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Loader2 } from 'lucide-react'
import { useTransactionStore } from '@/stores/transaction-store'

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
  const [error, setError] = useState('')
  const { setRoadmapId, data } = useTransactionStore()

  useEffect(() => {
    const fetchRoadmapDetails = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          setError('Token tidak ditemukan. Silakan login kembali.')
          setLoading(false)
          return
        }

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        const res = await fetch(`${API_URL}/roadmap-details?roadmap_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) throw new Error('Gagal mengambil data roadmap detail')

        const data = await res.json()
        setRoadmapDetails(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setLoading(false)
      }
    }

    fetchRoadmapDetails()
  }, [id])

  const handleRoadmapSelect = (roadmapId: string) => {
    setRoadmapId(roadmapId)
    router.push('/komitmen')
  }

  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-[#e0e7ff] to-[#fafafa] p-8 rounded-2xl border border-[#e0e0e0] shadow-sm mb-10 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
            <div>
              <h1 className="text-3xl font-bold text-[#2c2e31] mb-2 flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-[#6582e6]" />
                {roadmapDetails[0]?.roadmap?.name || 'Roadmap'}
              </h1>
              <p className="text-[#5f6265] max-w-lg leading-relaxed">
                {roadmapDetails[0]?.roadmap?.description ||
                  'Pelajari materi yang sudah dirancang untuk membimbing kamu menguasai topik ini langkah demi langkah.'}
              </p>
            </div>

            <button
              onClick={() => handleRoadmapSelect(id)}
              className="mt-6 md:mt-0 bg-[#6582e6] text-white px-7 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-[2px] hover:bg-[#5571d5] transition-all duration-200 font-medium"
            >
              Pelajari sekarang
            </button>
          </div>

          {/* subtle gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-white border border-gray-200 rounded-2xl shadow-sm animate-pulse"
              />
            ))}
            <div className="flex justify-center mt-6 text-[#5f6265]">
              <Loader2 className="animate-spin mr-2" /> Mengambil data...
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-200 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* List Materi */}
        {!loading && !error && (
          <section className="animate-fadeSlideIn">
            <h2 className="text-xl font-semibold mb-6 text-[#2c2e31]">
              📚 Semua Materi
            </h2>
            {roadmapDetails.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-[#5f6265]">
                Belum ada materi pada roadmap ini.
              </div>
            ) : (
              <div className="space-y-6">
                {roadmapDetails.map((material, index) => (
                  <div
                    key={material.id}
                    className="bg-white border-l-4 border-[#6582e6] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-[#2c2e31]">
                        {index + 1}. {material.name}
                      </h3>
                    </div>
                    <p className="text-[#5f6265] mt-2 leading-relaxed">
                      {material.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Tailwind animation */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
