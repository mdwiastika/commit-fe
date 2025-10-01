"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface QuizData {
  questions: Question[]
  timeLimit: number
}

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedQuizData = sessionStorage.getItem("quizData")
    if (storedQuizData) {
      const data = JSON.parse(storedQuizData)
      setQuizData(data)
      setTimeLeft(data.timeLimit)
      setAnswers(new Array(data.questions.length).fill(-1))
    } else {
      router.push("/progress")
    }
  }, [router])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quizData) {
      handleSubmitQuiz()
    }
  }, [timeLeft, quizData])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)

    if (quizData && answerIndex !== quizData.questions[currentQuestion].correctAnswer) {
      setShowExplanation(true)
      console.log("[v0] Wrong answer selected, showing explanation")
    } else {
      setShowExplanation(false)
      console.log("[v0] Correct answer selected, hiding explanation")
    }
  }

  const handleNext = () => {
    if (!quizData || selectedAnswer === null) return

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(answers[currentQuestion + 1] !== -1 ? answers[currentQuestion + 1] : null)
      setShowExplanation(false)
    } else {
      handleSubmitQuiz()
    }
  }

  const handleSubmitQuiz = () => {
    if (!quizData) return

    let correctAnswers = 0
    answers.forEach((answer, index) => {
      if (answer === quizData.questions[index].correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / quizData.questions.length) * 100)

    sessionStorage.setItem(
      "quizResults",
      JSON.stringify({
        score,
        correctAnswers,
        totalQuestions: quizData.questions.length,
        passed: score >= 60,
      }),
    )

    router.push("/quiz/results")
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  const currentQ = quizData.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-medium text-[#6582e6] mb-8 leading-relaxed">
            Jawab pertanyaan berikut untuk memastikan kamu memahami materi yang dipelajari
          </h1>

          <div className="flex justify-between items-center mb-8">
            <span className="text-[#6582e6] text-lg font-medium">{formatTime(timeLeft)}</span>
            <span className="text-[#6582e6] text-lg font-medium">
              {currentQuestion + 1}/{quizData.questions.length}
            </span>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-xl font-medium text-[#6582e6] mb-8">{currentQ.question}</h2>
        </div>

        <div className="space-y-4 mb-8">
          {currentQ.options.map((option, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedAnswer === index ? "bg-[#ceeee3] border-2 border-[#0bac74]" : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => handleAnswerSelect(index)}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    selectedAnswer === index ? "border-[#0bac74] bg-[#0bac74]" : "border-gray-400"
                  }`}
                >
                  {selectedAnswer === index && <div className="w-3 h-3 rounded-full bg-white"></div>}
                </div>
                <span className="text-gray-800">{option}</span>
              </div>
            </div>
          ))}
        </div>

        {showExplanation && currentQ.explanation && (
          <div className="mb-8 p-6 bg-yellow-100 border-2 border-yellow-500 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Penjelasan:</h3>
            <p className="text-yellow-900 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-[#6582e6] hover:bg-[#5a73d9] text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === quizData.questions.length - 1 ? "Selesai" : "Berikutnya"}
          </Button>
        </div>
      </div>
    </div>
  )
}
