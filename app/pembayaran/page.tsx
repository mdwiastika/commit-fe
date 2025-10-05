'use client'

import type React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Info, Wallet, ChevronRight, ArrowLeft } from 'lucide-react'
import { useTransactionStore } from '@/stores/transaction-store'

export default function PembayaranPage() {
  const router = useRouter()
  const [amount, setAmount] = useState(50000)
  const { setAmountTransaction, data } = useTransactionStore()
  const quickAmounts = [
    10000,
    30000,
    50000,
    75000,
    100000,
    150000,
    225000,
    300000,
  ]

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number.parseInt(e.target.value))
  }

  const handleQuickSelect = (value: number) => {
    setAmount(value)
  }

  const handleContinue = () => {
    setAmountTransaction(amount)
    fetchTransaction().then((snapToken) => {
      if (snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: function (result: any) {
            console.log('success', result)
            router.push('/sukses')
          },
          onPending: function (result: any) {
            console.log('pending', result)
            alert('Pembayaran sedang diproses. Silakan tunggu.')
          },
          onError: function (result: any) {
            console.log('error', result)
            alert('Terjadi kesalahan pada pembayaran. Silakan coba lagi.')
          },
          onClose: function () {
            alert('Anda menutup popup pembayaran tanpa menyelesaikan pembayaran')
          },
        })
      } else {
        alert('Gagal mendapatkan snap token. Silakan coba lagi.')
      }
    })
  }

  const fetchTransaction = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        alert('Token tidak ditemukan. Silakan login kembali.')
        router.push('/login')
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/transactions/deposit-roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount,
          roadmap_id: data.roadmap_id,
          total_days: data.total_days,
        }),
      })

      if (!response.ok) throw new Error('Gagal membuat transaksi Midtrans')

      const result = await response.json()
      return result.data.snap_token
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan saat memproses pembayaran.')
    }
  }

  const dailyAmount = (amount / data.total_days).toFixed(2)
  const percentage = ((amount - 10000) / (300000 - 10000)) * 100

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 relative">
      {/* Tombol Back untuk Mobile */}
      <button
        onClick={() => router.back()}
        className="md:hidden absolute top-6 left-6 bg-white border border-gray-200 p-2 rounded-full shadow-sm hover:shadow-md transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-[#4b63d0]" />
      </button>

      <div className="max-w-3xl w-full bg-white rounded-2xl mt-12 md:mt-0 shadow-lg p-8 border border-gray-100 animate-fadeSlideIn">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Wallet className="w-12 h-12 text-[#6582e6]" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Isi Uang Komitmen Belajarmu
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Uang ini akan dikembalikan 100% jika kamu konsisten belajar. Jika
            gagal, dana akan disalurkan ke Dompet Dhuafa & Rumah Yatim ❤️
          </p>
        </div>

        {/* Slider Section */}
        <div className="relative mb-12">
          <input
            type="range"
            min="10000"
            max="300000"
            step="1000"
            value={amount}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
          />
          <div
            className="absolute top-2 h-2 rounded-lg bg-[#6582e6]"
            style={{ width: `${percentage}%` }}
          ></div>

          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#6582e6] text-white px-4 py-1 rounded-lg font-semibold text-lg shadow-md">
            Rp {amount.toLocaleString('id-ID')}
          </div>

          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Rp 10.000</span>
            <span>Rp 300.000</span>
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {quickAmounts.map((value) => (
            <button
              key={value}
              onClick={() => handleQuickSelect(value)}
              className={`py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
                amount === value
                  ? 'bg-[#6582e6] text-white border-[#6582e6] shadow-sm scale-[1.02]'
                  : 'bg-white border-gray-300 hover:border-[#6582e6] hover:bg-indigo-50'
              }`}
            >
              Rp {value.toLocaleString('id-ID')}
            </button>
          ))}
        </div>

        {/* Daily Breakdown */}
        <div className="text-center mb-10">
          <p className="text-gray-700 text-lg">
            Rp{' '}
            <span className="font-bold text-[#6582e6]">
              {amount.toLocaleString('id-ID')}
            </span>{' '}
            untuk {data.total_days} hari →{' '}
            <span className="font-semibold">Rp {dailyAmount}/hari</span>
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Info className="text-[#6582e6] w-5 h-5" />
            <h3 className="font-semibold text-[#3c3c3c]">
              Cara kerja uang komitmen
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Minimal top-up uang komitmen Rp 10.000</li>
            <li>
              • Untuk mendapatkan progres, kamu harus upload rangkuman belajar
              dan menyelesaikan soal dengan skor ≥ 60%.
            </li>
            <li>
              • Progres harus diselesaikan sebelum jam 11:59 PM setiap hari.
            </li>
            <li>
              • Uang dikembalikan 100% jika menyelesaikan semua challenge.
            </li>
            <li>
              • Jika berhenti di tengah jalan, uang akan disalurkan ke donasi.
            </li>
          </ul>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 bg-[#6582e6] text-white px-8 py-3 rounded-xl hover:bg-[#5571d5] transition-all font-medium shadow-md hover:shadow-lg"
          >
            Lanjut
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.4s ease-out;
        }

        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #6582e6;
          border: 4px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #6582e6;
          border: 4px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
