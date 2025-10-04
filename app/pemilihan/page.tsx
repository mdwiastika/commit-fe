"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

type Roadmap = {
  id: string
  name: string
  description: string
}

function PemilihanPembelajaran() {
  const router = useRouter()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const token = localStorage.getItem("auth_token") // token dari login
        if (!token) {
          console.error("Token tidak ditemukan")
          return
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
        const res = await fetch(`${API_URL}/roadmaps`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        if (!res.ok) {
          throw new Error("Gagal mengambil data roadmap")
        }

        const json = await res.json()
        setRoadmaps(json.data) // ambil field "data" dari response
      } catch (err) {
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoadmaps()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-12">Pilih Roadmap Belajar</h1>

        {/* Custom Roadmap Card */}
        <button
          onClick={() => router.push("/custom-roadmap")}
          className="w-full bg-[#6582e6] text-white rounded-2xl p-6 mb-8 flex items-center justify-between hover:bg-[#5571d5] transition-colors"
        >
          <div className="text-left">
            <h2 className="text-2xl font-bold mb-1">Buat Roadmap Sendiri</h2>
            <p className="text-white/90">Pelajari materi sesuai keinginan kamu</p>
          </div>
          <ChevronRight className="w-8 h-8 flex-shrink-0" />
        </button>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmaps.map((roadmap) => (
            <button
              key={roadmap.id}
              onClick={() => router.push(`/roadmap-detail/${roadmap.id}`)}
              className="bg-white border-2 border-[#6582e6] rounded-2xl p-6 flex items-center justify-between hover:bg-[#f0f3ff] transition-colors"
            >
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">{roadmap.name}</h3>
                <p className="text-[#5f6265]">{roadmap.description}</p>
              </div>
              <ChevronRight className="w-6 h-6 text-[#5f6265] flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <PemilihanPembelajaran />
    </ProtectedRoute>
  )
}
