"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Eye, ChevronLeft, ChevronRight, X, Download } from "lucide-react"

interface HistoryItem {
  id: number
  day: number
  title: string
  date: string
  materials: string
  earnings: number
  type: "success" | "failed"
  summary: string
  file: string
  quizScore: number
  passed: boolean
}

const historyData: HistoryItem[] = [
  {
    id: 1,
    day: 14,
    title: "Design Principles, Prototypes",
    date: "4 September 2025",
    materials: "Design Principle, Prototyping",
    earnings: 2560,
    type: "success",
    summary:
      "Hari ini saya mempelajari prinsip-prinsip desain yang fundamental dan membuat beberapa prototype untuk memahami konsep lebih dalam.",
    file: "DesignPrinciple.pdf",
    quizScore: 61,
    passed: true,
  },
  {
    id: 2,
    day: 13,
    title: "",
    date: "3 September 2025",
    materials: "",
    earnings: -2560,
    type: "failed",
    summary: "Tidak ada aktivitas pembelajaran hari ini.",
    file: "",
    quizScore: 0,
    passed: false,
  },
  {
    id: 3,
    day: 12,
    title: "Design Principles, Prototypes",
    date: "2 September 2025",
    materials: "Design Principle, Prototyping",
    earnings: 2560,
    type: "success",
    summary: "Melanjutkan pembelajaran tentang design principles dan praktik prototyping.",
    file: "DesignPrinciple.pdf",
    quizScore: 75,
    passed: true,
  },
  {
    id: 4,
    day: 11,
    title: "Design Principles, Prototypes",
    date: "1 September 2025",
    materials: "Design Principle, Prototyping",
    earnings: 2560,
    type: "success",
    summary: "Fokus pada implementasi design principles dalam prototype yang dibuat.",
    file: "DesignPrinciple.pdf",
    quizScore: 82,
    passed: true,
  },
  {
    id: 5,
    day: 10,
    title: "Design Principles, Prototypes",
    date: "31 Agustus 2025",
    materials: "Design Principle, Prototyping",
    earnings: 2560,
    type: "success",
    summary: "Menyelesaikan modul design principles dan membuat prototype final.",
    file: "DesignPrinciple.pdf",
    quizScore: 88,
    passed: true,
  },
  {
    id: 6,
    day: 9,
    title: "",
    date: "30 September 2025",
    materials: "",
    earnings: -2560,
    type: "failed",
    summary: "Tidak ada aktivitas pembelajaran hari ini.",
    file: "",
    quizScore: 0,
    passed: false,
  },
]

export default function RiwayatPage() {
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null)

  const openModal = (item: HistoryItem) => {
    setSelectedHistory(item)
  }

  const closeModal = () => {
    setSelectedHistory(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="riwayat" />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-primary mb-8">Riwayat Belajar</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total Hari Challenge</span>
            <span className="text-2xl font-bold text-gray-900">16</span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex justify-between items-center">
            <span className="text-gray-700 font-medium">Hari Berjalan</span>
            <span className="text-2xl font-bold text-gray-900">16</span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex justify-between items-center">
            <span className="text-gray-700 font-medium">Materi Dipelajari</span>
            <span className="text-2xl font-bold text-gray-900">16</span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex justify-between items-center">
            <span className="text-gray-700 font-medium">Hari Gagal</span>
            <span className="text-2xl font-bold text-gray-900">6</span>
          </div>
        </div>

        {/* History List */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-6">Daftar Riwayat</h2>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-gray-700 font-medium">Page 1</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* History Items */}
          <div className="space-y-3">
            {historyData.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl p-6 flex justify-between items-center cursor-pointer hover:opacity-90 transition-opacity ${
                  item.type === "success" ? "bg-success" : "bg-failed"
                }`}
                onClick={() => openModal(item)}
              >
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    Day {item.day}: {item.title}
                  </div>
                  <div className="text-gray-600 text-sm">{item.date}</div>
                </div>
                <div className="flex items-center gap-4">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <span className={`font-semibold ${item.earnings > 0 ? "text-green-600" : "text-red-600"}`}>
                    {item.earnings > 0 ? "+" : ""}Rp {Math.abs(item.earnings).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Modal Content */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Hari {selectedHistory.day}</h3>

              <div className="text-gray-600">
                <div className="mb-2">{selectedHistory.date}</div>
                <div className="mb-4">
                  <strong>Materi:</strong> {selectedHistory.materials || "Tidak ada"}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Rangkuman</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{selectedHistory.summary}</p>
              </div>

              {selectedHistory.file && (
                <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-gray-700 text-sm">{selectedHistory.file}</span>
                  <Download className="w-4 h-4 text-gray-600" />
                </div>
              )}

              {selectedHistory.type === "success" && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Skor Kuis: {selectedHistory.quizScore}%</span>
                  {selectedHistory.passed && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Lulus</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
