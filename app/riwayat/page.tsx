'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import {
  Eye,
  X,
  Trophy,
  BookOpen,
  Calendar,
  Clock,
} from 'lucide-react'
import { Footer } from '@/components/footer'

export interface ValidationType {
  id: string
  name: string
}

export interface TransactionDetail {
  id: string
  day: number
  transaction_id: string
  amount: number
  validation_type_id: string | null
  validationType: ValidationType | null
  quiz: any[any]
  roadmap_details: any[any] | null
  summary: any[any]
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  total_days: number
  created_at: string
  updated_at: string
  details: any[]
}

export interface RiwayatInformation {
  transaction: Transaction
  complete_roadmap_details: number
  count_failed_transaction: number
  running_days: number
}

export default function RiwayatPage() {
  const [selectedHistory, setSelectedHistory] = useState<TransactionDetail | null>(null)
  const [history, setHistory] = useState<RiwayatInformation | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetchRiwayatData()
    setTimeout(() => setIsLoaded(true), 100) // delay sedikit biar animasi halus
  }, [])

  const fetchRiwayatData = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return console.error('Token tidak ditemukan')

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/riwayats`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Gagal mengambil informasi riwayat')
      const result = await response.json()
      setHistory(result.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const openModal = (item: TransactionDetail, day: number) =>
    setSelectedHistory({ ...item, day })
  const closeModal = () => setSelectedHistory(null)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white md:mx-6">
      <Navigation currentPage="riwayat" />

      {/* Konten utama */}
      <main
        className={`flex-grow transition-all duration-700 ease-out transform ${
          isLoaded
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-5'
        } max-w-6xl mx-auto w-full px-5 sm:px-8 pt-6 md:pt-36 pb-24 md:pb-12`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#4b63d0] tracking-tight">
            Riwayat Belajar
          </h1>
          <Trophy className="w-9 h-9 sm:w-10 sm:h-10 text-[#4b63d0]" />
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 sm:mb-12">
          {history &&
            [
              { label: 'Total Hari Challenge', value: history.transaction.total_days },
              { label: 'Hari Berjalan', value: history.running_days },
              { label: 'Materi Dipelajari', value: history.complete_roadmap_details },
              { label: 'Hari Gagal', value: history.count_failed_transaction },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all border border-gray-100 rounded-2xl p-5 sm:p-6 flex flex-col justify-center items-center"
              >
                <span className="text-gray-500 text-sm">{stat.label}</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#4b63d0]">
                  {stat.value}
                </span>
              </div>
            ))}
        </div>

        {/* History List */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> Daftar Riwayat
          </h2>

          <div className="space-y-4 pb-4">
            {history?.transaction.details.map((item, i) => (
              <div
                key={item.id}
                onClick={() => openModal(item, i + 1)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:-translate-y-[2px] hover:shadow-md ${
                  item.amount > 0
                    ? 'border-green-200 bg-green-50 hover:bg-green-100'
                    : 'border-red-200 bg-red-50 hover:bg-red-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Day {i + 1}{' '}
                      {item.roadmap_details && (
                        <span className="text-gray-700">
                          :{' '}
                          {item.roadmap_details
                            .map((rd: any) => rd.name)
                            .join(', ')}
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" />{' '}
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <span
                      className={`font-semibold ${
                        item.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.amount > 0 ? '+' : '-'}Rp{' '}
                      {Math.floor(item.amount).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-red-500 hover:text-white rounded-full p-2 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-5">
              <h3 className="text-2xl font-bold text-gray-900">
                Day {selectedHistory.day}
              </h3>
              <div className="text-gray-600">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  {new Date(selectedHistory.created_at).toLocaleDateString(
                    'id-ID',
                    {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    },
                  )}
                </p>
                <p className="mt-2">
                  <strong>Materi:</strong>{' '}
                  {(selectedHistory &&
                    selectedHistory.roadmap_details
                      .map((rd: any) => rd.name)
                      .join(', ')) ||
                    'Tidak ada'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Rangkuman</h4>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {selectedHistory.summary.body || 'Tidak ada rangkuman'}
                </p>
              </div>

              {selectedHistory.quiz?.score && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    Skor Kuis: {selectedHistory.quiz.score}%
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm text-white ${
                      selectedHistory.quiz.score >= 60
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {selectedHistory.quiz.score >= 60 ? 'Lulus' : 'Gagal'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block mt-auto">
        <Footer />
      </div>
    </div>
  )
}
