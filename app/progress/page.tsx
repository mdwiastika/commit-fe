'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { ChevronDown, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/protected-route'
import { motion, AnimatePresence } from 'framer-motion'
import { Footer } from '@/components/footer'

function ProgressPageContent() {
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [progressText, setProgressText] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [studiedMaterials, setStudiedMaterials] = useState<any[]>([])
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [materials, setMaterials] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkExistingQuiz()
    fetchMaterials()
  }, [])

  // PENTING: Check apakah quiz sudah ada dan valid
  const checkExistingQuiz = () => {
    const storedQuizData = sessionStorage.getItem('quizData')
    const storedQuizResults = sessionStorage.getItem('quizResults')

    // Jika ada hasil quiz hari ini
    if (storedQuizResults) {
      try {
        const results = JSON.parse(storedQuizResults)
        const today = new Date()
        const resultDate = new Date(results.date)

        if (
          resultDate.getDate() === today.getDate() &&
          resultDate.getMonth() === today.getMonth() &&
          resultDate.getFullYear() === today.getFullYear()
        ) {
          console.log('Quiz results found for today, redirecting to results')
          router.push('/quiz/results')
          return
        }
      } catch (e) {
        console.error('Error parsing quiz results:', e)
        sessionStorage.removeItem('quizResults')
      }
    }

    // Jika ada quiz data yang valid
    if (storedQuizData) {
      try {
        const quizData = JSON.parse(storedQuizData)
        if (
          quizData &&
          quizData.quiz_details &&
          Array.isArray(quizData.quiz_details) &&
          quizData.quiz_details.length > 0
        ) {
          console.log('Valid quiz data found, redirecting to quiz')
          router.push('/quiz')
          return
        } else {
          console.log('Invalid quiz data, removing...')
          sessionStorage.removeItem('quizData')
        }
      } catch (e) {
        console.error('Error parsing quiz data:', e)
        sessionStorage.removeItem('quizData')
      }
    }
  }

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.error('Token tidak ditemukan')
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/roadmap-details`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil data materi')
      }
      const result = await response.json()
      setMaterials(result.data)
    } catch (error) {
      console.error('Error:', error)
      setError('Gagal mengambil data materi')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') setUploadedFile(file)
  }

  const removeFile = () => setUploadedFile(null)

  const handleMaterialSelect = (material: any) => {
    setSelectedMaterial(material.name)
    setIsDropdownOpen(false)
    if (!studiedMaterials.find((m) => m.id === material.id))
      setStudiedMaterials([...studiedMaterials, material])
  }

  const handleRemoveMaterial = (id: string) => {
    setStudiedMaterials(studiedMaterials.filter((m) => m.id !== id))
  }

  const handleSubmit = async () => {
    if (!selectedMaterial || (!progressText && !uploadedFile)) {
      setError('Silakan pilih materi dan isi progres belajar')
      setShowSnackbar(true)
      setTimeout(() => setShowSnackbar(false), 3000)
      return
    }

    if (isSubmitting) return // Prevent double submission
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setError('Token tidak ditemukan, silakan login ulang')
        setShowSnackbar(true)
        setIsSubmitting(false)
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const materialIds = studiedMaterials.map((m) => m.id)

      console.log('Submitting summary with materials:', materialIds)

      // Submit summary
      const response = await fetch(`${API_URL}/transactions/submit-summary`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roadmap_detail_ids: materialIds,
          body: progressText,
        }),
      })

      const responseData = await response.json()
      console.log('Submit summary response:', responseData)

      if (!response.ok) {
        setError(responseData.message || 'Gagal mengirim progres belajar')
        setShowSnackbar(true)
        setTimeout(() => setShowSnackbar(false), 3000)
        setIsSubmitting(false)
        return
      }

      // Handle successful submission
      if (responseData.status === true) {
        console.log('Summary submitted successfully, generating quiz...')

        // Generate quiz
        const responseQuiz = await fetch(
          `${API_URL}/transactions/generate-quiz`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        const quizData = await responseQuiz.json()
        console.log('Generate quiz response:', quizData)

        if (!responseQuiz.ok) {
          setError('Gagal mengambil data quiz')
          setShowSnackbar(true)
          setTimeout(() => setShowSnackbar(false), 3000)
          setIsSubmitting(false)
          return
        }

        if (quizData.status === true && quizData.data) {
          // Validasi struktur data sebelum simpan
          if (
            quizData.data.quiz_details &&
            Array.isArray(quizData.data.quiz_details) &&
            quizData.data.quiz_details.length > 0
          ) {
            console.log('Valid quiz data, storing and redirecting...')
            sessionStorage.setItem('quizData', JSON.stringify(quizData.data))

            // Verifikasi tersimpan
            const stored = sessionStorage.getItem('quizData')
            if (stored) {
              router.push('/quiz')
            } else {
              setError('Gagal menyimpan data quiz')
              setShowSnackbar(true)
              setIsSubmitting(false)
            }
          } else {
            console.error('Invalid quiz data structure:', quizData.data)
            setError('Data quiz tidak valid')
            setShowSnackbar(true)
            setIsSubmitting(false)
          }
        } else {
          setError('Gagal membuat quiz')
          setShowSnackbar(true)
          setIsSubmitting(false)
        }
      } else {
        // Handle status false
        const errorMsg =
          responseData.message +
          (responseData.data?.summary ? '\n' + responseData.data.summary : '')
        setError(errorMsg)
        setShowSnackbar(true)
        setTimeout(() => setShowSnackbar(false), 3000)

        // PENTING: Jika sudah submit hari ini, generate quiz baru dulu
        if (
          responseData.message === 'You have already submitted a summary today.'
        ) {
          console.log('Already submitted today, trying to generate quiz...')

          try {
            const responseQuiz = await fetch(
              `${API_URL}/transactions/generate-quiz`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              },
            )

            const quizData = await responseQuiz.json()
            console.log('Generate quiz after duplicate:', quizData)

            if (responseQuiz.ok && quizData.status === true && quizData.data) {
              if (
                quizData.data.quiz_details &&
                Array.isArray(quizData.data.quiz_details) &&
                quizData.data.quiz_details.length > 0
              ) {
                sessionStorage.setItem(
                  'quizData',
                  JSON.stringify(quizData.data),
                )
                router.push('/quiz')
                return
              }
            }

            // Jika generate quiz gagal, redirect ke dashboard
            console.log('Failed to generate quiz, redirecting to dashboard')
            setTimeout(() => router.push('/dashboard'), 2000)
          } catch (e) {
            console.error('Error generating quiz:', e)
            setTimeout(() => router.push('/dashboard'), 2000)
          }
        }

        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error submitting progress:', error)
      setError('Terjadi kesalahan saat mengirim data')
      setShowSnackbar(true)
      setTimeout(() => setShowSnackbar(false), 3000)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef3ff] via-[#fafafa] to-white pt-36 px-6">
      <Navigation currentPage="progress" />

      <div className="min-h-[calc(100vh-315px)]">
        <AnimatePresence>
          {showSnackbar && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-6 right-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-lg z-50 max-w-md"
            >
              <p className="font-semibold">⚠️ Peringatan</p>
              <p className="text-sm mt-1 whitespace-pre-line">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto space-y-10"
        >
          <h1 className="text-4xl font-bold text-[#4b63d0] tracking-tight text-center">
            Update Progres Belajarmu Hari Ini
          </h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-8 bg-white/70 backdrop-blur-xl border border-[#dce3ff] rounded-3xl shadow-lg space-y-8"
          >
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[#4b63d0]">
                Pilih Materi Hari Ini
              </h2>

              <div className="relative">
                <div
                  className="w-full p-4 border border-[#d9defa] bg-white/80 backdrop-blur-sm rounded-xl cursor-pointer flex items-center justify-between hover:shadow-sm transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="text-gray-700 font-medium">
                    {selectedMaterial || 'Pilih Materi'}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-md border border-[#d9defa] rounded-xl shadow-lg overflow-hidden z-10 max-h-96 overflow-y-auto"
                    >
                      {materials.map((material, i) => (
                        <div
                          key={material.id}
                          onClick={() => handleMaterialSelect(material)}
                          className="p-4 cursor-pointer transition-all hover:bg-[#f3f3f3]"
                        >
                          <h3 className="font-semibold text-gray-800">
                            {i + 1}. {material.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {material.description}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {studiedMaterials.length > 0 && (
              <div className="space-y-4 mt-8">
                <h2 className="text-lg font-semibold text-[#4b63d0]">
                  Materi yang Dipilih
                </h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {studiedMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="p-4 bg-white/80 backdrop-blur-sm border border-[#dce3ff] rounded-xl shadow-sm flex flex-col justify-between relative"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {material.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {material.description}
                      </p>

                      <button
                        onClick={() => handleRemoveMaterial(material.id)}
                        className="absolute top-2 right-2 p-1 rounded-full text-white bg-red-500 hover:bg-red-700 cursor-pointer transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[#4b63d0]">
                Tulis Progres Belajar
              </h2>
              <div className="relative">
                <textarea
                  value={progressText}
                  onChange={(e) => setProgressText(e.target.value)}
                  className="w-full h-32 p-4 bg-white/80 border border-[#d9defa] rounded-xl resize-none focus:ring-2 focus:ring-[#5c74e6] outline-none transition-all"
                  placeholder="Tulis progres belajarmu hari ini..."
                  disabled={isSubmitting}
                />
                <Send className="absolute bottom-4 right-4 w-5 h-5 text-[#5c74e6] cursor-pointer" />
              </div>

              {uploadedFile && (
                <div className="flex items-center justify-between p-3 bg-[#f2f4ff] rounded-lg text-sm text-gray-700">
                  <span>{uploadedFile.name}</span>
                  <button
                    onClick={removeFile}
                    className="text-white bg-red-500 p-4 rounded-full hover:text-red-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-center pt-6">
              <motion.div
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#5c74e6] to-[#7f97ff] hover:opacity-90 text-white px-10 py-3 rounded-full font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Memproses...' : 'Kumpulkan & Kerjakan Quiz'}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

export default function ProgressPage() {
  return (
    <ProtectedRoute>
      <ProgressPageContent />
    </ProtectedRoute>
  )
}
