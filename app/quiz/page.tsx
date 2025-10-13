'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Check, WifiOff, Wifi } from 'lucide-react'
import { LoadingSpinner } from '@/components/loading-spinner'

interface QuizOption {
  id: string
  quiz_detail_id: string
  answer: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by: string
  updated_by: string | null
  deleted_by: string | null
}

interface QuizDetail {
  id: string
  quiz_id: string
  question: string
  user_answer_quiz_detail_option_id: string | null
  correct_answer_quiz_detail_option_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by: string
  updated_by: string | null
  deleted_by: string | null
  options: QuizOption[]
}

interface QuizData {
  transaction_detail_id: string
  score: number
  validation_type_id: string
  id: string
  created_by: string
  updated_by: string
  updated_at: string
  created_at: string
  quiz_details: QuizDetail[]
}

interface PendingSubmission {
  quiz_detail_id: string
  answer: string
  timestamp: number
}

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null)
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([])
  const hasFetchedRef = useRef(false)
  const router = useRouter()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      showSnackbar('Koneksi kembali! Menyinkronkan jawaban...', 'success')
    }

    const handleOffline = () => {
      setIsOnline(false)
      showSnackbar('Anda sedang offline. Progres akan disimpan secara lokal.', 'error')
    }

    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (isOnline && pendingSubmissions.length > 0) {
      submitPendingAnswers()
    }
  }, [isOnline])

  const showSnackbar = (message: string, type: 'error' | 'success' | 'info') => {
    setSnackbar({ message, type })
    setTimeout(() => setSnackbar(null), 4000)
  }

  useEffect(() => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true

    const savedQuiz = localStorage.getItem('quiz_draft')
    const savedAnswers = localStorage.getItem('quiz_answers')
    const savedQuestionIndex = localStorage.getItem('quiz_current_question')
    const savedTime = localStorage.getItem('quiz_time_left')
    const savedPending = localStorage.getItem('quiz_pending_submissions')

    if (savedQuiz) {
      try {
        const parsedQuiz = JSON.parse(savedQuiz)
        setQuizData(parsedQuiz)
        setAnswers(savedAnswers ? JSON.parse(savedAnswers) : [])
        setCurrentQuestion(savedQuestionIndex ? Number(savedQuestionIndex) : 0)
        setTimeLeft(savedTime ? Number(savedTime) : parsedQuiz.quiz_details.length * 150)
        setPendingSubmissions(savedPending ? JSON.parse(savedPending) : [])
        setIsLoading(false)
        console.log('✅ Quiz dipulihkan dari localStorage')
        return
      } catch (error) {
        console.error('Gagal memulihkan quiz:', error)
        localStorage.removeItem('quiz_draft')
      }
    }

    initializeQuiz()
  }, [])

  const initializeQuiz = async () => {
    try {
      await fetchQuizData()
    } catch (error) {
      console.error('Error initializing quiz:', error)
      router.push('/dashboard')
    }
  }

  const fetchQuizData = async () => {
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

    if (!responseQuiz.ok) throw new Error('Gagal mengambil data quiz')

    const quizData = await responseQuiz.json()
    if (!quizData.data || !quizData.data.quiz_details)
      throw new Error('Data quiz tidak valid')

    if (quizData.data.quiz_details.length === 0)
      throw new Error('Tidak ada pertanyaan dalam quiz')

    if (quizData.data.quiz_status === 'success') {
      router.push('/quiz/results')
      return
    }

    setQuizData(quizData.data)
    setAnswers(new Array(quizData.data.quiz_details.length).fill(''))
    setTimeLeft(quizData.data.quiz_details.length * 150)
    setIsLoading(false)
  }

  useEffect(() => {
    localStorage.removeItem('quiz_draft')
    localStorage.removeItem('quiz_answers')
    localStorage.removeItem('quiz_current_question')
    localStorage.removeItem('quiz_time_left')
    localStorage.removeItem('quiz_pending_submissions')
    console.log('🧹 Quiz data dari localStorage telah dihapus.')
  }, [])

  useEffect(() => {
    if (quizData) {
      localStorage.setItem('quiz_draft', JSON.stringify(quizData))
      localStorage.setItem('quiz_answers', JSON.stringify(answers))
      localStorage.setItem('quiz_current_question', currentQuestion.toString())
      localStorage.setItem('quiz_time_left', timeLeft.toString())
      localStorage.setItem('quiz_pending_submissions', JSON.stringify(pendingSubmissions))
    }
  }, [quizData, answers, currentQuestion, timeLeft, pendingSubmissions])

  useEffect(() => {
    if (!quizData || isLoading) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleSubmitQuiz()
    }
  }, [timeLeft, quizData, isLoading])

  useEffect(() => {
    if (quizData && (quizData as any).quiz_status === 'success') {
      localStorage.removeItem('quiz_draft')
      localStorage.removeItem('quiz_answers')
      localStorage.removeItem('quiz_current_question')
      localStorage.removeItem('quiz_time_left')
      localStorage.removeItem('quiz_pending_submissions')
    }
  }, [quizData])


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionId
    setAnswers(newAnswers)
  }

  const submitPendingAnswers = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token || pendingSubmissions.length === 0) return

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const failedSubmissions: PendingSubmission[] = []

    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch(`${API_URL}/transactions/question-quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quiz_detail_id: submission.quiz_detail_id,
            answer: submission.answer,
          }),
        })

        if (!response.ok) {
          failedSubmissions.push(submission)
        }
      } catch (error) {
        failedSubmissions.push(submission)
      }
    }

    if (failedSubmissions.length === 0) {
      setPendingSubmissions([])
      showSnackbar('Semua jawaban berhasil disinkronkan!', 'success')
    } else {
      setPendingSubmissions(failedSubmissions)
      showSnackbar('Beberapa jawaban gagal disinkronkan', 'error')
    }
  }

  const handleNext = async () => {
    if (!quizData || !quizData.quiz_details || selectedAnswer === null) return

    const currentQ = quizData.quiz_details[currentQuestion]
    if (!currentQ) {
      console.error('Current question not found')
      return
    }

    if (!isOnline) {
      const newPending: PendingSubmission = {
        quiz_detail_id: currentQ.id,
        answer: selectedAnswer,
        timestamp: Date.now(),
      }
      setPendingSubmissions([...pendingSubmissions, newPending])
      showSnackbar('Jawaban disimpan secara lokal (offline)', 'info')

      if (currentQuestion < quizData.quiz_details.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(
          answers[currentQuestion + 1] !== '' ? answers[currentQuestion + 1] : null,
        )
      } else {
        showSnackbar('Quiz selesai. Akan dikirim saat online kembali.', 'info')
      }
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.error('Token tidak ditemukan')
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/transactions/question-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quiz_detail_id: currentQ.id,
          answer: selectedAnswer,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit answer')

      if (currentQuestion < quizData.quiz_details.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(
          answers[currentQuestion + 1] !== '' ? answers[currentQuestion + 1] : null,
        )
      } else {
        handleSubmitQuiz()
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      showSnackbar('Gagal mengirim jawaban, disimpan secara lokal', 'error')
      
      const newPending: PendingSubmission = {
        quiz_detail_id: currentQ.id,
        answer: selectedAnswer,
        timestamp: Date.now(),
      }
      setPendingSubmissions([...pendingSubmissions, newPending])

      if (currentQuestion < quizData.quiz_details.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(
          answers[currentQuestion + 1] !== '' ? answers[currentQuestion + 1] : null,
        )
      }
    }
  }

  const handleSubmitQuiz = async () => {
    if (!quizData) return

    if (!isOnline && pendingSubmissions.length > 0) {
      showSnackbar('Masih offline. Quiz akan otomatis terkirim saat online.', 'info')
      return
    }

    if (isOnline && pendingSubmissions.length > 0) {
      await submitPendingAnswers()
    }

    localStorage.removeItem('quiz_draft')
    localStorage.removeItem('quiz_answers')
    localStorage.removeItem('quiz_current_question')
    localStorage.removeItem('quiz_time_left')
    localStorage.removeItem('quiz_pending_submissions')

    router.push('/quiz/results')
  }

  if (isLoading || !quizData || !quizData.quiz_details) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef3ff] to-white">
        <LoadingSpinner />
        <p className="absolute text-gray-700 text-lg font-medium z-[60] mt-28">
          Loading Quiz...
        </p>
      </div>
    )
  }

  const currentQ = quizData.quiz_details[currentQuestion]
  if (!currentQ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef3ff] to-white">
        <p className="text-gray-600 text-lg">Error loading question...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#eef3ff] to-white">
      {snackbar && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              snackbar.type === 'error'
                ? 'bg-red-500 text-white'
                : snackbar.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {snackbar.type === 'error' && <WifiOff className="w-5 h-5" />}
            {snackbar.type === 'success' && <Wifi className="w-5 h-5" />}
            <span className="font-medium">{snackbar.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#4b63d0] mb-4">Kuis Materi</h1>
          <p className="text-gray-700">
            Jawab pertanyaan berikut untuk memastikan kamu memahami materi.
          </p>

          <div className="mt-6 flex justify-between items-center text-white font-semibold text-lg">
            <div className="px-4 py-2 bg-gradient-to-r from-[#5c74e6] to-[#7f97ff] rounded-full shadow-md">
              ⏱ {formatTime(timeLeft)}
            </div>
            <div className="flex items-center gap-3">
              {!isOnline && (
                <div className="px-4 py-2 bg-red-500 rounded-full shadow-md flex items-center gap-2">
                  <WifiOff className="w-4 h-4" />
                  <span>Offline</span>
                </div>
              )}
              {pendingSubmissions.length > 0 && (
                <div className="px-4 py-2 bg-orange-500 rounded-full shadow-md">
                  {pendingSubmissions.length} pending
                </div>
              )}
              <div className="px-4 py-2 bg-gradient-to-r from-[#0bac74] to-[#29c97c] rounded-full shadow-md">
                {currentQuestion + 1}/{quizData.quiz_details.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transition-all hover:shadow-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option) => {
              const isSelected = selectedAnswer === option.id
              return (
                <div
                  key={option.id}
                  className={`p-4 rounded-xl cursor-pointer border transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'bg-blue-100 border-blue-400'
                      : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                  }`}
                  onClick={() => handleAnswerSelect(option.id)}
                >
                  {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                  <span className="text-gray-800">{option.answer}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-gradient-to-r from-[#5c74e6] to-[#7f97ff] text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-md"
          >
            {currentQuestion === quizData.quiz_details.length - 1 ? 'Selesai' : 'Berikutnya'}
          </Button>
        </div>
      </div>
    </div>
  )
}