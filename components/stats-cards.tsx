import { Flame } from "lucide-react"

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[#5f6265] text-sm">Streak belajar</span>
          <div className="flex items-center">
            <Flame className="w-5 h-5 text-[#ea3829] mr-1" />
            <span className="text-[#ea3829] font-bold text-lg">16</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[#5f6265] text-sm">Dompet Komitmen</span>
          <span className="text-[#121212] font-semibold">Rp 345.000,00-</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[#5f6265] text-sm">Donasi</span>
          <span className="text-[#121212] font-semibold">Rp345.000,00-</span>
        </div>
      </div>
    </div>
  )
}
