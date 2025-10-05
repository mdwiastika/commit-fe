'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'

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

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Effect untuk load data dari sessionStorage
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const storedQuizResults = sessionStorage.getItem('quizResults')
        if (storedQuizResults) {
          const dataQuizResults = JSON.parse(storedQuizResults)
          const today = new Date()
          const quizDate = new Date(dataQuizResults.date)
          if (
            dataQuizResults.date &&
            quizDate.getDate() === today.getDate() &&
            quizDate.getMonth() === today.getMonth() &&
            quizDate.getFullYear() === today.getFullYear()
          ) {
            if (dataQuizResults.passed) {
              router.push('/quiz/results')
              return
            } else {
              sessionStorage.removeItem('quizData')
              sessionStorage.removeItem('quizResults')
              await fetchQuizData()
              return
            }
          }
        }

        const storedQuizData = sessionStorage.getItem('quizData')
        if (storedQuizData) {
          const data: QuizData = JSON.parse(storedQuizData)

          // VALIDASI: Pastikan data memiliki struktur yang benar
          if (data && data.quiz_details && Array.isArray(data.quiz_details)) {
            setQuizData(data)
            setTimeLeft(1800) // 30 menit
            setAnswers(new Array(data.quiz_details.length).fill(''))
            setIsLoading(false)
          } else {
            console.error('Invalid quiz data structure')
            router.push('/dashboard')
          }
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error initializing quiz:', error)
        router.push('/dashboard')
      }
    }

    initializeQuiz()
  }, [router])

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

    if (!responseQuiz.ok) {
      throw new Error('Gagal mengambil data quiz')
    }

    const quizData = await responseQuiz.json()
    console.log('Quiz Data:', quizData.data)
    if (quizData.status === true) {
      sessionStorage.setItem('quizData', JSON.stringify(quizData.data))
      router.push('/quiz')
    } else {
      router.push('/progress')
    }
  }

  // Effect untuk timer - HANYA berjalan jika quizData sudah ada
  useEffect(() => {
    if (!quizData || isLoading) return // GUARD CLAUSE

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleSubmitQuiz()
    }
  }, [timeLeft, quizData, isLoading])

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

  const handleNext = async () => {
    // GUARD CLAUSE: Pastikan semua data tersedia
    if (!quizData || !quizData.quiz_details || selectedAnswer === null) return

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.error('Token tidak ditemukan')
        return
      }

      const currentQ = quizData.quiz_details[currentQuestion]
      if (!currentQ) {
        console.error('Current question not found')
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

      if (!response.ok) {
        throw new Error('Failed to submit answer')
      }

      // Lanjut ke pertanyaan berikutnya atau submit quiz
      if (currentQuestion < quizData.quiz_details.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(
          answers[currentQuestion + 1] !== ''
            ? answers[currentQuestion + 1]
            : null,
        )
      } else {
        handleSubmitQuiz()
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      // Tetap lanjut meskipun ada error
      if (quizData && currentQuestion < quizData.quiz_details.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(
          answers[currentQuestion + 1] !== ''
            ? answers[currentQuestion + 1]
            : null,
        )
      } else {
        handleSubmitQuiz()
      }
    }
  }

  const handleSubmitQuiz = async () => {
    if (!quizData) return

    const token = localStorage.getItem('auth_token')
    if (!token) {
      console.error('Token tidak ditemukan')
      return
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

    const response = await fetch(`${API_URL}/transactions/submit-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error('Failed to submit quiz')
      return
    }

    const result = await response.json()
    const resultData = result.data
    const score = resultData.score
    const correctAnswers = resultData.correct_answers
    const totalQuestions = resultData.total_questions
    const explanations = resultData.explanations
    const date = new Date()

    sessionStorage.setItem(
      'quizResults',
      JSON.stringify({
        score,
        correctAnswers,
        totalQuestions,
        passed: score >= 60,
        explanations,
        date: date.toISOString(),
      }),
    )

    router.push('/quiz/results')
  }

  // Loading state
  if (isLoading || !quizData || !quizData.quiz_details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef3ff] to-white">
        <p className="text-gray-600 text-lg">Loading quiz...</p>
      </div>
    )
  }

  const currentQ = quizData.quiz_details[currentQuestion]

  // Guard untuk currentQ
  if (!currentQ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef3ff] to-white">
        <p className="text-gray-600 text-lg">Error loading question...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#eef3ff] to-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#4b63d0] mb-4">
            Kuis Materi
          </h1>
          <p className="text-gray-700">
            Jawab pertanyaan berikut untuk memastikan kamu memahami materi.
          </p>

          <div className="mt-6 flex justify-between items-center text-white font-semibold text-lg">
            <div className="px-4 py-2 bg-gradient-to-r from-[#5c74e6] to-[#7f97ff] rounded-full shadow-md">
              ⏱ {formatTime(timeLeft)}
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-[#0bac74] to-[#29c97c] rounded-full shadow-md">
              {currentQuestion + 1}/{quizData.quiz_details.length}
            </div>
          </div>
        </div>

        {/* Question Card */}
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
                  className={`p-4 rounded-xl cursor-pointer border transition-all flex items-center gap-4
                    ${
                      isSelected
                        ? 'bg-blue-100 border-blue-400'
                        : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                    }
                  `}
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
            {currentQuestion === quizData.quiz_details.length - 1
              ? 'Selesai'
              : 'Berikutnya'}
          </Button>
        </div>
      </div>
    </div>
  )
}
