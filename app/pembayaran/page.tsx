"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PembayaranPage() {
  const router = useRouter()
  const [amount, setAmount] = useState(50000)
  const days = 32 // This would come from the previous page

  const quickAmounts = [10000, 30000, 50000, 75000, 100000, 150000, 225000, 300000]

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number.parseInt(e.target.value))
  }

  const handleQuickSelect = (value: number) => {
    setAmount(value)
  }

  const handleContinue = () => {
    router.push("/sukses")
  }

  const dailyAmount = (amount / days).toFixed(2)

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Isi uang komitmen untuk menjaga konsistensi belajarmu</h1>
        <p className="text-center text-gray-600 mb-12">
          *Uang komitmen ini akan dikembalikan 100% jika kamu konsisten menyelesaikan roadmap belajar. Jika gagal, uang
          komitmen akan didonasikan ke Dompet Dhuafa & Rumah Yatim.
        </p>

        <div className="mb-8">
          <div className="relative mb-4">
            <input
              type="range"
              min="10000"
              max="300000"
              step="1000"
              value={amount}
              onChange={handleSliderChange}
              className="w-full h-2 bg-[#6582e6] rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#6582e6] text-white px-4 py-1 rounded-lg font-semibold">
              {amount.toLocaleString("id-ID")}
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>10.000</span>
            <span>300.000</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {quickAmounts.map((value) => (
            <button
              key={value}
              onClick={() => handleQuickSelect(value)}
              className={`py-3 rounded-lg border-2 font-medium transition-colors ${
                amount === value
                  ? "bg-[#6582e6] text-white border-[#6582e6]"
                  : "bg-white border-gray-300 hover:border-[#6582e6]"
              }`}
            >
              {value.toLocaleString("id-ID")}
            </button>
          ))}
        </div>

        <p className="text-center mb-8">
          Uang Komitmen yang didapatkan setiap progres: Rp {amount.toLocaleString("id-ID")} / {days} Hari = Rp{" "}
          {dailyAmount}~
        </p>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold mb-4">Cara kerja uang komitmen:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span>•</span>
              <span>Minimal topup uang komitmen Rp10.000</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                Untuk mendapatkan progres, kamu harus upload rangkuman belajar dan menyelesaikan soal berdasarkan
                rangkuman minimal benar {">"}=60%.
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Progres harus diselesaikan sebelum jam 11:59 PM</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Uang komitmen dikembalikan ketika selesai masa challenge belajar.</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Jika berhenti di tengah jalan, uang komitmen tetap akan disalurkan ke donasi.</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            className="bg-[#6582e6] text-white px-8 py-3 rounded-lg hover:bg-[#5571d5] transition-colors font-medium"
          >
            Lanjut
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #6582e6;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #6582e6;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}
