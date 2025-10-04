'use client'

import { useState } from 'react'
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

interface HistoryItem {
  id: number
  day: number
  title: string
  date: string
  materials: string
  earnings: number
  type: 'success' | 'failed'
  summary: string
  file: string
  quizScore: number
  passed: boolean
}

const historyData: HistoryItem[] = [
  {
    id: 1,
    day: 14,
    title: 'Design Principles, Prototypes',
    date: '4 September 2025',
    materials: 'Design Principle, Prototyping',
    earnings: 2560,
    type: 'success',
    summary:
      'Hari ini saya mempelajari prinsip-prinsip desain yang fundamental dan membuat beberapa prototype untuk memahami konsep lebih dalam.',
    file: 'DesignPrinciple.pdf',
    quizScore: 61,
    passed: true,
  },
  {
    id: 2,
    day: 13,
    title: '',
    date: '3 September 2025',
    materials: '',
    earnings: -2560,
    type: 'failed',
    summary: 'Tidak ada aktivitas pembelajaran hari ini.',
    file: '',
    quizScore: 0,
    passed: false,
  },
]

export default function RiwayatPage() {
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(
    null,
  )

  const openModal = (item: HistoryItem) => setSelectedHistory(item)
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
          {[
            { label: 'Total Hari Challenge', value: 16 },
            { label: 'Hari Berjalan', value: 16 },
            { label: 'Materi Dipelajari', value: 12 },
            { label: 'Hari Gagal', value: 4 },
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
            {historyData.map((item) => (
              <div
                key={item.id}
                onClick={() => openModal(item)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:translate-y-[-2px] hover:shadow-lg ${
                  item.type === 'success'
                    ? 'border-green-200 bg-green-50 hover:bg-green-100'
                    : 'border-red-200 bg-red-50 hover:bg-red-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Day {item.day}{' '}
                      {item.title && (
                        <span className="text-gray-700">– {item.title}</span>
                      )}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" /> {item.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <span
                      className={`font-semibold ${
                        item.earnings > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.earnings > 0 ? '+' : '-'}Rp{' '}
                      {Math.abs(item.earnings).toLocaleString('id-ID')}
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
                Hari {selectedHistory.day}
              </h3>
              <div className="text-gray-600">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  {selectedHistory.date}
                </p>
                <p className="mt-2">
                  <strong>Materi:</strong>{' '}
                  {selectedHistory.materials || 'Tidak ada'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Rangkuman</h4>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {selectedHistory.summary}
                </p>
              </div>

              {selectedHistory.file && (
                <button className="w-full bg-blue-100 text-[#4b63d0] hover:bg-blue-200 py-2 rounded-lg flex items-center justify-center gap-2 transition">
                  <Download className="w-4 h-4" /> {selectedHistory.file}
                </button>
              )}

              {selectedHistory.type === 'success' && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    Skor Kuis: {selectedHistory.quizScore}%
                  </span>
                  {selectedHistory.passed ? (
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
