'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, ArrowLeft } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { useTransactionStore } from '@/stores/transaction-store'

interface Material {
  id: string
  title: string
  description: string
}

function CustomRoadmapContent() {
  const router = useRouter()
  const [roadmapTitle, setRoadmapTitle] = useState('')
  const [roadmapDescription, setRoadmapDescription] = useState('')
  const [materials, setMaterials] = useState<Material[]>([])
  const [currentMaterial, setCurrentMaterial] = useState({
    title: '',
    description: '',
  })
  const [isAddingMaterial, setIsAddingMaterial] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setRoadmapId } = useTransactionStore()

  const handleSaveMaterial = () => {
    if (currentMaterial.title.trim()) {
      const newMaterial: Material = {
        id: Date.now().toString(),
        title: currentMaterial.title,
        description: currentMaterial.description,
      }
      setMaterials([...materials, newMaterial])
      setCurrentMaterial({ title: '', description: '' })
      setIsAddingMaterial(false)
    }
  }

  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id))
  }

  const handleSaveRoadmap = async () => {
    if (
      !roadmapTitle.trim() ||
      !roadmapDescription.trim() ||
      materials.length === 0
    ) {
      setShowSnackbar(true)
      setTimeout(() => setShowSnackbar(false), 3000)
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      if (!token)
        throw new Error('Token tidak ditemukan. Silakan login kembali.')

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

      // 1. Create Roadmap
      const res = await fetch(`${API_URL}/roadmaps`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roadmapTitle,
          description: roadmapDescription,
        }),
      })

      if (!res.ok) throw new Error('Gagal membuat roadmap')
      const roadmapData = await res.json()
      const roadmapId = roadmapData.data.id
      setRoadmapId(roadmapId)

      // 2. Create Roadmap Details
      for (const material of materials) {
        await fetch(`${API_URL}/roadmap-details`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: material.title,
            description: material.description,
            roadmap_id: roadmapId,
          }),
        })
      }

      router.push('/komitmen')
    } catch (error) {
      console.error(error)
      alert('Terjadi kesalahan saat menyimpan roadmap')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 relative">
      {showSnackbar && (
        <div className="fixed top-4 right-4 bg-[#fbbf24] text-gray-900 px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top">
          Harap masukkan judul, deskripsi roadmap, dan minimal satu materi
        </div>
      )}

      {/* Tombol Back */}
      <button
        onClick={() => router.back()}
        className="absolute top-5 left-5 text-[#6582e6] hover:text-[#5571d5] p-2 rounded-full bg-white shadow-sm border border-gray-200 active:scale-95 transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="max-w-4xl mx-auto ">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 mt-16">
          <h1 className="text-[#6582e6] text-3xl font-bold">Buat Roadmap</h1>
          <button
            onClick={handleSaveRoadmap}
            disabled={loading}
            className="bg-[#6582e6] text-white px-4 py-2 rounded-lg hover:bg-[#5571d5] transition-colors font-medium text-sm md:text-base disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan & Mulai Belajar'}
          </button>
        </div>

        {/* Roadmap Title Input */}
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-3">
            Judul Roadmap
          </label>
          <input
            type="text"
            value={roadmapTitle}
            onChange={(e) => setRoadmapTitle(e.target.value)}
            className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:outline-none focus:border-[#6582e6] transition-colors"
            placeholder="Contoh: UI/UX Design untuk Pemula"
          />
        </div>

        {/* Roadmap Description Input */}
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-3">
            Deskripsi Roadmap
          </label>
          <textarea
            value={roadmapDescription}
            onChange={(e) => setRoadmapDescription(e.target.value)}
            className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:outline-none focus:border-[#6582e6] transition-colors resize-none"
            rows={3}
            placeholder="Deskripsi singkat roadmap ini"
          />
        </div>

        {/* Materials Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Tambahkan Materi</h2>

          {/* Existing Materials */}
          {materials.map((material, index) => (
            <div
              key={material.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-4 relative"
            >
              <button
                onClick={() => handleRemoveMaterial(material.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-semibold mb-1">
                {index + 1}. {material.title}
              </h3>
              <p className="text-[#5f6265] text-sm">{material.description}</p>
            </div>
          ))}

          {/* Add Material Form */}
          {isAddingMaterial ? (
            <div className="bg-white border-2 border-[#6582e6] rounded-xl p-6 mb-4">
              <h3 className="font-semibold mb-4">Judul Materi</h3>
              <input
                type="text"
                value={currentMaterial.title}
                onChange={(e) =>
                  setCurrentMaterial({
                    ...currentMaterial,
                    title: e.target.value,
                  })
                }
                className="w-full border-b-2 border-gray-300 bg-transparent py-2 mb-6 focus:outline-none focus:border-[#6582e6] transition-colors"
                placeholder="Contoh: Design Principles"
              />
              <h3 className="font-semibold mb-4">Deskripsi</h3>
              <textarea
                value={currentMaterial.description}
                onChange={(e) =>
                  setCurrentMaterial({
                    ...currentMaterial,
                    description: e.target.value,
                  })
                }
                className="w-full border-b-2 border-gray-300 bg-transparent py-2 mb-6 focus:outline-none focus:border-[#6582e6] transition-colors resize-none"
                rows={3}
                placeholder="Deskripsi singkat tentang materi ini"
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setIsAddingMaterial(false)
                    setCurrentMaterial({ title: '', description: '' })
                  }}
                  className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveMaterial}
                  className="bg-[#6582e6] text-white px-6 py-2 rounded-lg hover:bg-[#5571d5] transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingMaterial(true)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl p-6 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-[#6582e6] rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CustomRoadmap() {
  return (
    <ProtectedRoute>
      <CustomRoadmapContent />
    </ProtectedRoute>
  )
}
