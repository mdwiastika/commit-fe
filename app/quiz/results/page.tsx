"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuizResults {
  score: number
  correctAnswers: number
  totalQuestions: number
  passed: boolean
}

export default function QuizResultsPage() {
  const [results, setResults] = useState<QuizResults | null>(null)
  const [countdown, setCountdown] = useState(15)
  const router = useRouter()

  useEffect(() => {
    const storedResults = sessionStorage.getItem("quizResults")
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    } else {
      router.push("/progress")
    }
  }, [router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleBackToDashboard()
    }
  }, [countdown])

  const handleBackToDashboard = () => {
    sessionStorage.removeItem("quizData")
    sessionStorage.removeItem("quizResults")
    router.push("/dashboard")
  }

  const handleRetryQuiz = () => {
    sessionStorage.removeItem("quizResults")
    router.push("/quiz")
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!results.passed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e65858] to-[#f08b8b] p-6 flex items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          {/* Failed Score */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-7xl font-bold text-white">{results.score}%</span>
            <div className="w-16 h-16 rounded-full bg-[#c92a2a] flex items-center justify-center">
              <X className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
          </div>

          <h1 className="text-3xl font-medium text-white mb-4">Belum Berhasil</h1>
          <p className="text-xl text-white mb-8">
            Kamu perlu mendapatkan minimal 60% untuk melanjutkan. Jangan menyerah, coba lagi!
          </p>

          {/* Quiz Stats */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border-2 border-white/30 mb-8">
            <div className="space-y-3 text-white text-lg">
              <div className="flex justify-between">
                <span className="font-medium">Jumlah Soal:</span>
                <span>{results.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Jumlah Benar:</span>
                <span>{results.correctAnswers}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Jumlah Salah:</span>
                <span>{results.totalQuestions - results.correctAnswers}</span>
              </div>
            </div>
          </div>

          {/* Retry Button */}
          <Button
            onClick={handleRetryQuiz}
            className="bg-white text-[#e65858] hover:bg-gray-100 px-8 py-6 text-lg font-medium rounded-lg"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#6582e6] to-[#8ba3f0] p-6 flex items-center justify-center cursor-pointer"
      onClick={handleBackToDashboard}
    >
      <div className="max-w-3xl w-full">
        {/* Score and Checkmark */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-7xl font-bold text-white">{results.score}%</span>
            <div className="w-16 h-16 rounded-full bg-[#0bac74] flex items-center justify-center">
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-2xl font-medium text-white">Mantap! Progress harianmu tercatat.</h1>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium">Progress</span>
            <span className="text-white font-medium">78%</span>
          </div>
          <div className="w-full h-8 bg-white rounded-lg overflow-hidden mb-3">
            <div className="h-full bg-[#6582e6]" style={{ width: "78%" }}></div>
          </div>
          <div className="flex justify-between items-center text-sm text-white">
            <span>Deadline belajar: 1 Bulan 3 Minggu 20 Hari</span>
            <span>14 dari 18 Materi telah diselesaikan</span>
          </div>
        </div>

        {/* Quiz Stats and Tips Box */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border-2 border-white/30">
          <div className="flex justify-between items-start mb-6">
            {/* Left: Quiz Stats */}
            <div className="space-y-2 text-white">
              <div className="flex gap-8">
                <span className="font-medium">Jumlah Soal:</span>
                <span>{results.totalQuestions}</span>
              </div>
              <div className="flex gap-8">
                <span className="font-medium">Jumlah Benar:</span>
                <span>{results.correctAnswers}</span>
              </div>
              <div className="flex gap-8">
                <span className="font-medium">Jumlah Salah:</span>
                <span>{results.totalQuestions - results.correctAnswers}</span>
              </div>
            </div>

            {/* Right: Badges */}
            <div className="space-y-2">
              <div className="bg-[#ea3829] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <span>Konsisten 7 Hari</span>
              </div>
              <div className="bg-[#6582e6] text-white px-4 py-2 rounded-lg text-sm font-medium">
                Dompet Komitmen: Rp 345.000
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="text-white">
            <h3 className="font-semibold mb-3">Tips</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>
                Kekuatanmu hari ini: "Kamu sudah cukup memahami prinsip dasar desain, terutama soal kontras &
                keseimbangan warna."
              </li>
              <li>
                Yang perlu ditingkatkan: "Masih ada kebingungan di konsep penggunaan warna minimalis. Coba pelajari
                ulang modul X."
              </li>
              <li>Tips singkat: "Besok, coba buat rangkuman visual agar konsep lebih mudah diingat."</li>
            </ul>
          </div>
        </div>

        {/* Auto-redirect message */}
        <div className="text-center mt-8 text-white">
          <p className="text-lg font-medium">
            Setelah <span className="text-2xl font-bold">{countdown}</span> detik akan otomatis diarahkan ke halaman
            dashboard
          </p>
          <p className="text-sm mt-2 opacity-80">Atau klik di mana saja untuk melanjutkan</p>
        </div>
      </div>
    </div>
  )
}
