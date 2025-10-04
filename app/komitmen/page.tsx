'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, CalendarDays } from 'lucide-react'

export default function KomitmenPage() {
  const router = useRouter()
  const [selectedDuration, setSelectedDuration] = useState(21)
  const [customDuration, setCustomDuration] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [estimatedDate, setEstimatedDate] = useState('')

  useEffect(() => {
    const duration = showCustomInput
      ? Number.parseInt(customDuration) || 0
      : selectedDuration
    if (duration > 0) {
      const today = new Date()
      const completionDate = new Date(today.setDate(today.getDate() + duration))
      setEstimatedDate(
        completionDate.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      )
    } else {
      setEstimatedDate('')
    }
  }, [selectedDuration, customDuration, showCustomInput])

  const handleContinue = () => {
    if (showCustomInput && Number(customDuration) < 21) return
    router.push('/pembayaran')
  }

  const isInvalidCustom = showCustomInput && Number(customDuration) < 21

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-6 animate-fadeIn">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-200 relative overflow-hidden">
        {/* Decorative background accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50 rounded-full opacity-30 blur-2xl" />

        <div className="text-center mb-10 relative z-10">
          {/* <div className="text-5xl mb-4">📘</div> */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tentukan Durasi Belajarmu
          </h1>
          <p className="text-gray-500">
            Pilih berapa lama kamu ingin berkomitmen membangun kebiasaan baru
          </p>
        </div>

        <div className="space-y-4 mb-8 relative z-10">
          {[21, 30, 120].map((d) => (
            <button
              key={d}
              onClick={() => {
                setSelectedDuration(d)
                setShowCustomInput(false)
              }}
              className={`w-full p-4 rounded-xl border-2 text-left font-semibold transition-all duration-200 ${
                selectedDuration === d && !showCustomInput
                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700 shadow-sm'
                  : 'bg-white border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
            >
              {d} Hari
            </button>
          ))}

          <div className="relative">
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-200 ${
                showCustomInput
                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700 shadow-sm'
                  : 'bg-white border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-indigo-500" />
                <span className="font-semibold">Isi sendiri</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  showCustomInput ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showCustomInput && (
              <input
                type="number"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                placeholder="Masukkan jumlah hari (min. 21)"
                className={`w-full mt-3 p-4 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                  isInvalidCustom
                    ? 'border-red-500 focus:ring-2 focus:ring-red-300'
                    : 'border-indigo-500 focus:ring-2 focus:ring-indigo-300'
                }`}
                min="21"
                max="365"
              />
            )}
          </div>
        </div>

        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-sm">
          <div className="w-6 h-6 rounded-full bg-orange-400 flex-shrink-0" />
          <p className="text-sm text-orange-800 font-medium">
            Waktu minimal untuk membangun kebiasaan baru adalah 21 hari 💪
          </p>
        </div>

        {estimatedDate && (
          <div className="text-center mb-6 flex items-center justify-center gap-2 text-gray-600">
            <CalendarDays className="w-5 h-5 text-indigo-600" />
            <p>
              Estimasi selesai:{' '}
              <span className="font-semibold text-indigo-700">
                {estimatedDate}
              </span>
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={isInvalidCustom}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-md ${
              isInvalidCustom
                ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:-translate-y-[2px]'
            }`}
          >
            Lanjut
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
