"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

export default function SuksesPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  const handleClick = () => {
    router.push("/dashboard")
  }

  return (
    <div
      onClick={handleClick}
      className="min-h-screen bg-gradient-to-br from-[#6582e6] to-[#8b9ff5] flex items-center justify-center p-6 cursor-pointer"
    >
      <div className="w-[500px] h-[500px] bg-[#5a6b8f] rounded-full flex flex-col items-center justify-center text-white">
        <div className="w-20 h-20 bg-[#4ade80] rounded-full flex items-center justify-center mb-6">
          <Check className="w-12 h-12 text-white stroke-[3]" />
        </div>

        <p className="text-lg mb-2">Berhasil membuat rencana belajar.</p>
        <h1 className="text-4xl font-bold mb-12">Selamat Belajar!</h1>

        <p className="text-sm text-white/80">Tekan di mana saja untuk lanjut</p>
      </div>
    </div>
  )
}
