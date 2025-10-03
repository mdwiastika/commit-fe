"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { ChevronDown, Send, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"

const materials = [
  {
    id: 1,
    title: "Design Principles",
    description: "Description of Design principles",
    completed: true,
  },
  {
    id: 2,
    title: "Wireframing",
    description: "Description of Wireframing",
    completed: false,
  },
  {
    id: 3,
    title: "Typography",
    description: "Description of Typography",
    completed: false,
  },
]

function ProgressPageContent() {
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [progressText, setProgressText] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [studiedMaterials, setStudiedMaterials] = useState<typeof materials>([])
  const [showSnackbar, setShowSnackbar] = useState(false)
  const router = useRouter()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setUploadedFile(file)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const handleMaterialSelect = (material: (typeof materials)[0]) => {
    setSelectedMaterial(material.title)
    setIsDropdownOpen(false)
    if (!studiedMaterials.find((m) => m.id === material.id)) {
      setStudiedMaterials([...studiedMaterials, material])
    }
  }

  const handleSubmit = async () => {
    if (!selectedMaterial) {
      setShowSnackbar(true)
      setTimeout(() => setShowSnackbar(false), 3000)
      return
    }

    if (!progressText && !uploadedFile) {
      setShowSnackbar(true)
      setTimeout(() => setShowSnackbar(false), 3000)
      return
    }

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          material: selectedMaterial,
          progress: progressText,
          file: uploadedFile?.name,
        }),
      })

      if (response.ok) {
        const quizData = await response.json()
        sessionStorage.setItem("quizData", JSON.stringify(quizData))
        router.push("/quiz")
      } else {
        alert("Failed to generate quiz. Please try again.")
      }
    } catch (error) {
      const mockQuizData = {
        questions: [
          {
            id: 1,
            question: "Apa fungsi utama dari prinsip kontras dalam desain?",
            options: [
              "Menekankan perbedaan elemen agar mudah dibedakan",
              "Memberikan keseimbangan warna agar terlihat seragam",
              "Mengurangi jumlah warna yang digunakan dalam desain",
              "Membuat desain terlihat sederhana",
            ],
            correctAnswer: 0,
            explanation:
              "Kontras dalam desain berfungsi untuk menekankan perbedaan antara elemen-elemen visual sehingga mudah dibedakan dan menciptakan hierarki visual yang jelas.",
          },
          {
            id: 2,
            question: "Manakah yang merupakan prinsip dasar dalam wireframing?",
            options: [
              "Menggunakan warna yang menarik",
              "Fokus pada struktur dan layout",
              "Menambahkan animasi yang kompleks",
              "Menggunakan font yang beragam",
            ],
            correctAnswer: 1,
            explanation:
              "Wireframing berfokus pada struktur dan layout halaman, bukan pada detail visual seperti warna atau animasi. Tujuannya adalah untuk merencanakan tata letak konten dan fungsionalitas.",
          },
        ],
        timeLimit: 900,
      }

      sessionStorage.setItem("quizData", JSON.stringify(mockQuizData))
      router.push("/quiz")
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <Navigation />

      {showSnackbar && (
        <div className="fixed top-6 right-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg z-50 animate-in slide-in-from-top">
          <p className="font-medium">Peringatan!</p>
          <p className="text-sm">
            Silakan pilih materi dan isi progres belajar (tulis atau upload PDF) sebelum melanjutkan.
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-semibold text-[#6582e6] mb-8">Update Progres Belajarmu Hari ini</h1>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#6582e6]">Pilih Materi yang Kamu Pelajari Hari ini</h2>

          <div className="relative">
            <div
              className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-700 cursor-pointer flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedMaterial || "Pilih Materi"}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className={`p-4 cursor-pointer hover:opacity-90 ${
                      material.completed ? "bg-[#ceeee3]" : "bg-gray-200"
                    } ${material.id !== materials.length ? "border-b border-gray-300" : ""}`}
                    onClick={() => handleMaterialSelect(material)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {material.id}: {material.title}
                        </h3>
                        <p className="text-sm text-gray-600">{material.description}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {material.completed ? "Sudah dipelajari" : "Belum dipelajari"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {studiedMaterials.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[#6582e6]">Materi yang dipelajari</h2>

            <div className="space-y-3">
              {studiedMaterials.map((material) => (
                <div key={material.id} className="p-4 border border-gray-300 rounded-lg bg-white">
                  <h3 className="font-medium text-gray-800 mb-1">
                    {material.id}. {material.title}
                  </h3>
                  <p className="text-sm text-gray-600">{material.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#6582e6]">Tuliskan progres belajar</h2>

          <div className="relative">
            <textarea
              className="w-full h-32 p-4 border border-gray-300 rounded-lg bg-white resize-none"
              placeholder="Tulis progres belajar anda..."
              value={progressText}
              onChange={(e) => setProgressText(e.target.value)}
            />
            <Send className="absolute bottom-4 right-4 w-5 h-5 text-[#6582e6] cursor-pointer" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-[#6582e6] hover:text-[#5a73d9]">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload PDF</span>
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {uploadedFile && (
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                <button onClick={removeFile} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <Button
            onClick={handleSubmit}
            className="bg-[#6582e6] hover:bg-[#5a73d9] text-white px-8 py-3 rounded-lg font-medium"
          >
            Kumpulkan dan Kerjakan Quiz
          </Button>
        </div>
      </div>
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
