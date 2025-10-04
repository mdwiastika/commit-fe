'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
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

export interface Roadmap {
  id: string
  name: string
  description: string
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

export interface TransactionResponse {
  status: boolean
  message: string
  data: RiwayatInformation
}

export default function RiwayatPage() {
  const [
    selectedHistory,
    setSelectedHistory,
  ] = useState<TransactionDetail | null>(null)
  const [history, setHistory] = useState<RiwayatInformation | null>(null)

  useEffect(() => {
    fetchRiwayatData()
  }, [])

  const fetchRiwayatData = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.error('Token tidak ditemukan')
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

      const response = await fetch(`${API_URL}/riwayats`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil informasi riwayat')
      }

      const result = await response.json()
      console.log(result)
      setHistory(result.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const openModal = (item: TransactionDetail, day: number) => {
    setSelectedHistory({ ...item, day })
  }
  const closeModal = () => setSelectedHistory(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6">
      <Navigation currentPage="riwayat" />

      <main className="max-w-6xl mx-auto px-6 py-12 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 pt-22">
          <h1 className="text-4xl font-bold text-[#4b63d0] tracking-tight">
            Riwayat Belajar
          </h1>
          <Trophy className="w-10 h-10 text-[#4b63d0]" />
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {history &&
            [
              {
                label: 'Total Hari Challenge',
                value: history.transaction.total_days,
              },
              { label: 'Hari Berjalan', value: history.running_days },
              {
                label: 'Materi Dipelajari',
                value: history.complete_roadmap_details,
              },
              { label: 'Hari Gagal', value: history.running_days },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all border border-gray-100 rounded-2xl p-6 flex flex-col justify-center items-center"
              >
                <span className="text-gray-500 text-sm">{stat.label}</span>
                <span className="text-3xl font-bold text-[#4b63d0]">
                  {stat.value}
                </span>
              </div>
            ))}
        </div>

        {/* History List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> Daftar Riwayat
          </h2>

          <div className="space-y-4">
            {history?.transaction.details.map((item, i) => (
              <div
                key={item.id}
                onClick={() => openModal(item, i + 1)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:translate-y-[-2px] hover:shadow-lg ${
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
                      {Math.abs(item.amount).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 max-w-lg w-full relative animate-fadeIn">
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

              {selectedHistory.quiz.score >= 60 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    Skor Kuis: {selectedHistory.quiz.score}%
                  </span>
                  {selectedHistory.quiz.score >= 60 ? (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      Lulus
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                      Gagal
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
