'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { ChevronDown, Send, Upload, X } from 'lucide-react'
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
  const router = useRouter()

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return console.error('Token tidak ditemukan')

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
      setShowSnackbar(true)
      setTimeout(() => setShowSnackbar(false), 0)
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return console.error('Token tidak ditemukan')

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const materialIds = studiedMaterials.map((m) => m.id)

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

      if (!response.ok) {
        const responseData = await response.json()
        setError(responseData.message || 'Gagal mengirim progres belajar')
        setShowSnackbar(true)
        setTimeout(() => setShowSnackbar(false), 3000)
        throw new Error('Gagal mengirim progres belajar')
      }

      if (response.ok) {
        const responseData = await response.json()
        console.log('Response Data:', responseData)
        if (responseData.status === true) {
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
        } else if (responseData.status === false) {
          setError(responseData.message || 'Gagal mengirim progres belajar')
          setShowSnackbar(true)
          setTimeout(() => setShowSnackbar(false), 3000)
          if (
            responseData.message ===
            'You have already submitted a summary today.'
          ) {
            router.push('/quiz')
          }
        }
      } else {
        setError('Gagal mengirim progres belajar')
        setShowSnackbar(true)
        setTimeout(() => setShowSnackbar(false), 3000)
      }
    } catch {
      // router.push('/quiz')
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
              className="fixed top-6 right-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-lg z-50"
            >
              <p className="font-semibold">⚠️ Peringatan</p>
              <p className="text-sm mt-1">{error}</p>
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

          {/* --- Card Wrapper --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-8 bg-white/70 backdrop-blur-xl border border-[#dce3ff] rounded-3xl shadow-lg space-y-8"
          >
            {/* --- Dropdown Materi --- */}
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
                      className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-md border border-[#d9defa] rounded-xl shadow-lg overflow-hidden z-10"
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

            {/* --- Section Materi yang Dipilih --- */}
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
                      <span className="text-xs text-gray-400 mt-2">
                        ID: {material.id}
                      </span>

                      {/* Tombol Hapus */}
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

            {/* --- Textarea & Upload --- */}
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
                />
                <Send className="absolute bottom-4 right-4 w-5 h-5 text-[#5c74e6] cursor-pointer" />
              </div>

              {/* <label className="flex items-center gap-2 text-[#4b63d0] font-medium cursor-pointer hover:opacity-80">
                <Upload className="w-4 h-4" />
                <span>Upload PDF (opsional)</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label> */}

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

            {/* --- Submit --- */}
            <div className="flex justify-center pt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-[#5c74e6] to-[#7f97ff] hover:opacity-90 text-white px-10 py-3 rounded-full font-semibold shadow-md transition-all"
                >
                  Kumpulkan & Kerjakan Quiz
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
