'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Map, Sparkles } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { useCheckTransactionStatus } from '@/hooks/checkTransactionStatus'
import { LoadingSpinner } from '@/components/loading-spinner'

type Roadmap = {
  id: string
  name: string
  description: string
}

function PemilihanPembelajaran() {
  const router = useRouter()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)

  const { transactionCheckLoading } = useCheckTransactionStatus()

  if (transactionCheckLoading || loading) {
    return <LoadingSpinner />
  }

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          console.error('Token tidak ditemukan')
          return
        }

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        const res = await fetch(`${API_URL}/roadmaps`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })

        if (!res.ok) {
          throw new Error('Gagal mengambil data roadmap')
        }

        const json = await res.json()
        setRoadmaps(json.data)
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoadmaps()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#6582e6] text-xl font-medium animate-pulse">
        Loading roadmap...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-12 flex justify-center items-start">
      <div className="max-w-5xl w-full animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-[#2c2e31] mb-2">
            Pilih Roadmap Belajarmu
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Mulailah perjalanan belajarmu dengan roadmap yang sesuai minat dan
            tujuanmu
          </p>
        </div>

        {/* Tombol Custom Roadmap */}
        <button
          onClick={() => router.push('/custom-roadmap')}
          className="w-full bg-gradient-to-r from-[#6582e6] to-[#7b94f1] text-white rounded-2xl p-8 mb-10 flex items-center justify-between
                     hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 ease-out cursor-pointer"
        >
          <div className="text-left">
            <h2 className="text-2xl font-semibold mb-1 flex items-center gap-2">
              <Map className="w-6 h-6" /> Buat Roadmap Sendiri
            </h2>
            <p className="text-white/90 text-sm md:text-base">
              Rancang materi sesuai target dan kecepatanmu sendiri
            </p>
          </div>
          <div className="bg-white/25 rounded-full p-2">
            <ChevronRight className="w-8 h-8 flex-shrink-0" />
          </div>
        </button>

        {/* Daftar Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roadmaps.length > 0 ? (
            roadmaps.map((roadmap, i) => (
              <button
                key={roadmap.id}
                onClick={() => router.push(`/roadmap-detail/${roadmap.id}`)}
                style={{ animationDelay: `${i * 100}ms` }}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-left flex items-start justify-between gap-4
                           hover:border-[#6582e6] hover:bg-[#f5f7ff] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-out
                           animate-fadeSlide cursor-pointer"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-[#2c2e31]">
                    {roadmap.name}
                  </h3>
                  <p className="text-[#5f6265] text-sm md:text-base leading-relaxed">
                    {roadmap.description}
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-[#6582e6] flex-shrink-0 mt-1" />
              </button>
            ))
          ) : (
            <p className="text-center col-span-2 text-gray-500">
              Belum ada roadmap tersedia.
            </p>
          )}
        </div>
      </div>

      {/* Animasi sederhana */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }

        .animate-fadeSlide {
          animation: fadeSlide 0.5s ease forwards;
        }
      `}</style>
    </div>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <PemilihanPembelajaran />
    </ProtectedRoute>
  )
}
