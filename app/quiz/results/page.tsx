'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Flame, Wallet, TrendingUp, Target, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface QuizResults {
  score: number
  correctAnswers: number
  totalQuestions: number
  passed: boolean
  explanations: string[]
}

interface DashboardInfo {
  active_transaction?: {
    roadmap?: {
      name?: string
    }
    total_days?: number
    created_at?: string
  }
  user?: {
    name?: string
    email?: string
    balance?: number
  }
  progress: number
  complete_roadmap_details: number
  total_roadmap_details: number
  remaining_days: string
  donation: number
  streak?: number
  history_details: any[]
}

export default function QuizResultsPage() {
  const [results, setResults] = useState<QuizResults | null>(null)
  const [countdown, setCountdown] = useState(120)
  const router = useRouter()
  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfo>({
    progress: 0,
    complete_roadmap_details: 0,
    total_roadmap_details: 0,
    remaining_days: '',
    user: {
      name: '',
      email: '',
      balance: 0,
    },
    donation: 0,
    streak: 0,
    history_details: [],
  })

  useEffect(() => {
    const storedResults = sessionStorage.getItem('quizResults')
    sessionStorage.removeItem('quizData')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
      fetchDashboardInfo()
    } else {
      router.push('/dashboard')
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
    sessionStorage.removeItem('quizResults')
    router.push('/dashboard')
  }

  const fetchDashboardInfo = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.error('Token tidak ditemukan')
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

      const response = await fetch(`${API_URL}/dashboard`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil informasi dashboard')
      }

      const result = await response.json()
      console.log(result)
      setDashboardInfo(result.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleRetryQuiz = async () => {
    sessionStorage.removeItem('quizResults')
    const token = localStorage.getItem('auth_token')
    if (!token) return console.error('Token tidak ditemukan')

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const responseQuiz = await fetch(`${API_URL}/transactions/generate-quiz`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!responseQuiz.ok) {
      throw new Error('Gagal mengambil data quiz')
    }

    const quizData = await responseQuiz.json()
    sessionStorage.removeItem('quizResults')
    sessionStorage.removeItem('quizData')
    console.log('Quiz Data:', quizData.data)
    if (quizData.status === true) {
      sessionStorage.setItem('quizData', JSON.stringify(quizData.data))
      router.push('/quiz')
    } else {
      router.push('/progress')
    }
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#e8eeff] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4b63d0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat hasil...</p>
        </div>
      </div>
    )
  }

  if (!results.passed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] to-[#ffe5e5] p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl w-full"
        >
          {/* Failed Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-red-500/10 overflow-hidden">
            {/* Header with Score */}
            <div className="bg-gradient-to-br from-[#ff6b6b] to-[#ee5a6f] p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <X className="w-14 h-14 text-white" strokeWidth={3} />
                </div>
                <h1 className="text-5xl font-bold text-white mb-2">{results.score}%</h1>
                <p className="text-xl text-white/90 font-medium">Belum Berhasil</p>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-8">
              <p className="text-center text-gray-600 text-lg mb-8">
                Kamu perlu mendapatkan minimal <span className="font-bold text-[#ff6b6b]">60%</span> untuk melanjutkan. Jangan menyerah, coba lagi!
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-gray-800">{results.totalQuestions}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Soal</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-700">{results.correctAnswers}</div>
                  <div className="text-sm text-green-600 mt-1">Benar</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-red-700">{results.totalQuestions - results.correctAnswers}</div>
                  <div className="text-sm text-red-600 mt-1">Salah</div>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleRetryQuiz}
                className="w-full bg-gradient-to-r from-[#ff6b6b] to-[#ee5a6f] hover:from-[#ff5252] hover:to-[#e04e5f] text-white py-6 text-lg font-semibold rounded-2xl shadow-lg shadow-red-500/30 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                Coba Lagi
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#e8eeff] p-4 md:p-8 flex items-center justify-center cursor-pointer"
      onClick={handleBackToDashboard}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-[#4b63d0]/10 overflow-hidden mb-6">
          {/* Header with Score */}
          <div className="bg-gradient-to-br from-[#4b63d0] to-[#6582e6] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Check className="w-14 h-14 text-white" strokeWidth={3} />
              </div>
              <h1 className="text-5xl font-bold text-white mb-2">{results.score}%</h1>
              <p className="text-xl text-white/90 font-medium">Mantap! Progress harianmu tercatat</p>
            </motion.div>
          </div>

          {/* Stats and Badges */}
          <div className="p-8">
            {/* Quiz Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 text-center"
              >
                <div className="text-3xl font-bold text-gray-800">{results.totalQuestions}</div>
                <div className="text-sm text-gray-600 mt-1">Total Soal</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center"
              >
                <div className="text-3xl font-bold text-green-700">{results.correctAnswers}</div>
                <div className="text-sm text-green-600 mt-1">Benar</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 text-center"
              >
                <div className="text-3xl font-bold text-red-700">{results.totalQuestions - results.correctAnswers}</div>
                <div className="text-sm text-red-600 mt-1">Salah</div>
              </motion.div>
            </div>

            {/* Badges Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-orange-500/30"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <div className="text-white">
                  <div className="text-sm opacity-90">Streak</div>
                  <div className="text-2xl font-bold">{dashboardInfo.streak} Hari</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-[#4b63d0] to-[#6582e6] rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-[#4b63d0]/30"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div className="text-white">
                  <div className="text-sm opacity-90">Dompet Komitmen</div>
                  <div className="text-2xl font-bold">Rp 345.000</div>
                </div>
              </motion.div>
            </div>

            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#4b63d0]" />
                  <span className="font-semibold text-gray-800">Progress Roadmap</span>
                </div>
                <span className="text-2xl font-bold text-[#4b63d0]">{dashboardInfo.progress}%</span>
              </div>
              
              <div className="w-full h-3 bg-white rounded-full overflow-hidden mb-4 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dashboardInfo.progress}%` }}
                  transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#4b63d0] to-[#6582e6] rounded-full"
                />
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: <span className="font-semibold text-gray-800">{dashboardInfo.remaining_days}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span><span className="font-semibold text-gray-800">{dashboardInfo.complete_roadmap_details}</span> dari <span className="font-semibold text-gray-800">{dashboardInfo.total_roadmap_details}</span> Materi</span>
                </div>
              </div>
            </motion.div>

            {/* Tips Section */}
            {results.explanations && results.explanations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200/50"
              >
                <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                  <span>💡</span> Tips untuk Kamu
                </h3>
                <ul className="space-y-3">
                  {results.explanations.map((tip, index) => (
                    <li key={index} className="flex gap-3 text-gray-700">
                      <span className="text-amber-600 font-bold flex-shrink-0">•</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* Auto-redirect Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <p className="text-gray-600 mb-2">
            Kembali ke dashboard dalam{' '}
            <span className="inline-flex items-center justify-center min-w-[3rem] h-12 bg-gradient-to-br from-[#4b63d0] to-[#6582e6] text-white rounded-xl font-bold text-xl px-3 mx-1 shadow-lg">
              {countdown}
            </span>{' '}
            detik
          </p>
          <p className="text-sm text-gray-500">Atau klik di mana saja untuk melanjutkan</p>
        </motion.div>
      </motion.div>
    </div>
  )
}