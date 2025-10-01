import { Button } from "@/components/ui/button"
import Link from "next/link"

const progressData = {
  percentage: 78,
  completedMaterials: 14,
  totalMaterials: 18,
  deadline: "1 Bulan 3 Minggu 20 Hari - 20 Oktober 2025",
}

export function ProgressSection() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#5f6265] text-lg font-medium">Progress</h2>
        <span className="text-[#6582e6] text-2xl font-bold">{progressData.percentage}%</span>
      </div>

      <div className="bg-white rounded-lg p-1 mb-4">
        <div className="bg-[#6582e6] h-4 rounded-md" style={{ width: `${progressData.percentage}%` }}></div>
      </div>

      <div className="flex justify-between text-sm text-[#5f6265] mb-6">
        <span>Deadline belajar: {progressData.deadline}</span>
        <span>
          {progressData.completedMaterials} dari {progressData.totalMaterials} Materi telah diselesaikan
        </span>
      </div>

      <Link href="/progress">
        <Button className="bg-[#6582e6] hover:bg-[#5a73d9] text-white px-6 py-2 rounded-lg">
          Lanjutkan belajar hari ini
        </Button>
      </Link>
    </div>
  )
}
