"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"

export default function KomitmenPage() {
  const router = useRouter()
  const [selectedDuration, setSelectedDuration] = useState(21)
  const [customDuration, setCustomDuration] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [estimatedDate, setEstimatedDate] = useState("")

  useEffect(() => {
    const duration = showCustomInput ? Number.parseInt(customDuration) || 0 : selectedDuration
    if (duration > 0) {
      const today = new Date()
      const completionDate = new Date(today.setDate(today.getDate() + duration))
      setEstimatedDate(
        completionDate.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      )
    }
  }, [selectedDuration, customDuration, showCustomInput])

  const handleContinue = () => {
    router.push("/pembayaran")
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-center mb-12">Durasi belajar yang ingin kamu jalani:</h1>

        <div className="space-y-4 mb-6">
          <button
            onClick={() => {
              setSelectedDuration(21)
              setShowCustomInput(false)
            }}
            className={`w-full p-4 rounded-xl border-2 text-left font-semibold transition-colors ${
              selectedDuration === 21 && !showCustomInput
                ? "bg-[#a5b4fc] border-[#6582e6]"
                : "bg-white border-gray-300 hover:border-[#6582e6]"
            }`}
          >
            21 Hari
          </button>

          <button
            onClick={() => {
              setSelectedDuration(30)
              setShowCustomInput(false)
            }}
            className={`w-full p-4 rounded-xl border-2 text-left font-semibold transition-colors ${
              selectedDuration === 30 && !showCustomInput
                ? "bg-[#a5b4fc] border-[#6582e6]"
                : "bg-white border-gray-300 hover:border-[#6582e6]"
            }`}
          >
            30 Hari
          </button>

          <button
            onClick={() => {
              setSelectedDuration(120)
              setShowCustomInput(false)
            }}
            className={`w-full p-4 rounded-xl border-2 text-left font-semibold transition-colors ${
              selectedDuration === 120 && !showCustomInput
                ? "bg-[#a5b4fc] border-[#6582e6]"
                : "bg-white border-gray-300 hover:border-[#6582e6]"
            }`}
          >
            120 Hari
          </button>

          <div className="relative">
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-colors ${
                showCustomInput ? "bg-[#a5b4fc] border-[#6582e6]" : "bg-white border-gray-300 hover:border-[#6582e6]"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#6582e6]" />
                <span className="font-semibold">isi sendiri</span>
              </div>
              <ChevronDown className="w-5 h-5" />
            </button>

            {showCustomInput && (
              <input
                type="number"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                placeholder="Masukkan jumlah hari"
                className="w-full mt-2 p-4 rounded-xl border-2 border-[#6582e6] focus:outline-none"
                min="1"
              />
            )}
          </div>
        </div>

        <div className="bg-[#fed7aa] border-2 border-[#fb923c] rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#fb923c] flex-shrink-0" />
          <p className="text-sm">Waktu minimal untuk membangun kebiasaan baru adalah 21 hari</p>
        </div>

        {estimatedDate && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Estimasi selesai: <span className="font-semibold">{estimatedDate}</span>
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            className="bg-[#6582e6] text-white px-8 py-3 rounded-lg hover:bg-[#5571d5] transition-colors font-medium"
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  )
}
