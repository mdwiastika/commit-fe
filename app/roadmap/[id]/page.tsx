'use client'

import { Navigation } from '@/components/navigation'
import { useEffect, useState } from 'react'
import { BookOpen, Loader2, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Material {
  id: string
  name: string
  description: string
  roadmap: {
    name: string
    description?: string
  }
}

export default function RoadmapDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchRoadmapDetails = async (roadmapId: string) => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          setError('Token tidak ditemukan. Silakan login kembali.')
          setLoading(false)
          return
        }

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

        if (!response.ok)
          throw new Error('Gagal mengambil data detail roadmap')

        const result = await response.json()
        setMaterials(result.data)
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Terjadi kesalahan',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRoadmapDetails(id)
  }, [id])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e9edff] to-white px-6 py-10 relative">
      <Navigation currentPage="roadmap" />

      <button
        onClick={() => router.back()}
        className="md:hidden absolute top-6 left-6 bg-white border border-gray-200 p-2 rounded-full shadow-sm hover:shadow-md transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-[#4b63d0]" />
      </button>

      <main className="max-w-5xl mx-auto mt-12 md:mt-20">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-[#e0e7ff] to-[#fafafa] p-8 rounded-2xl border border-[#e0e0e0] shadow-sm mb-10 overflow-hidden animate-fadeSlideIn">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
            <div>
              <h1 className="text-3xl font-bold text-[#2c2e31] mb-2 flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-[#6582e6]" />
                {materials[0]?.roadmap?.name || 'Detail Roadmap'}
              </h1>
              <p className="text-[#5f6265] max-w-lg leading-relaxed">
                {materials[0]?.roadmap?.description ||
                  'Pelajari materi yang sudah dirancang untuk membimbing kamu menguasai topik ini langkah demi langkah.'}
              </p>
              <div className="mt-3 text-sm text-gray-600">
                <p>
                  Daftar dan urutan materi yang disediakan sudah direkomendasikan mengikuti{' '}
                  <a 
                    href="https://roadmap.sh" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    roadmap.sh
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        </div>

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
            {materials.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-[#5f6265]">
                Belum ada materi pada roadmap ini.
              </div>
            ) : (
              <div className="space-y-6">
                {materials.map((m, i) => (
                  <div
                    key={m.id}
                    className="bg-white border-l-4 border-[#6582e6] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-[#2c2e31]">
                        {i + 1}. {m.name}
                      </h3>
                    </div>
                    <p className="text-[#5f6265] mt-2 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

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
