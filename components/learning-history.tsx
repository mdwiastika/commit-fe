import { Eye, ArrowRight } from "lucide-react"
import Link from "next/link"

interface HistoryItem {
  day: string
  title: string
  date: string
  amount: string
  isPositive: boolean
  bgColor: string
}

const historyData: HistoryItem[] = [
  {
    day: "Day 14:",
    title: "Wireframing, Typography",
    date: "4 September 2025",
    amount: "+Rp 2.560",
    isPositive: true,
    bgColor: "#ceeee3",
  },
  {
    day: "Day 13:",
    title: "",
    date: "3 September 2025",
    amount: "-Rp 2.560",
    isPositive: false,
    bgColor: "#fbd7d4",
  },
  {
    day: "Day 12:",
    title: "Wireframing",
    date: "2 September 2025",
    amount: "+Rp 2.560",
    isPositive: true,
    bgColor: "#ceeee3",
  },
  {
    day: "Day 11:",
    title: "Design Principles, Prototypes",
    date: "1 September 2025",
    amount: "+Rp 2.560",
    isPositive: true,
    bgColor: "#ceeee3",
  },
  {
    day: "Day 10:",
    title: "",
    date: "30 Agustus 2025",
    amount: "-Rp 2.560",
    isPositive: false,
    bgColor: "#fbd7d4",
  },
]

export function LearningHistory() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#6582e6] text-lg font-medium">Riwayat Belajar</h3>
        <Link href="/riwayat" className="flex items-center text-[#6582e6] text-sm hover:underline">
          Lihat selengkapnya
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-3">
        {historyData.map((item, index) => (
          <div
            key={index}
            className="rounded-lg p-4 flex items-center justify-between"
            style={{ backgroundColor: item.bgColor }}
          >
            <div className="flex-1">
              <div className="flex items-center">
                <span className="text-[#121212] font-medium mr-2">{item.day}</span>
                <span className="text-[#5f6265]">{item.title}</span>
              </div>
              <div className="text-[#5f6265] text-sm mt-1">{item.date}</div>
            </div>

            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-[#5f6265]" />
              <span className={`font-semibold ${item.isPositive ? "text-[#0bac74]" : "text-[#ea3829]"}`}>
                {item.amount}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-[#5f6265] text-sm">
          <span className="font-medium">"Kebiasaan kecil setiap hari akan jadi hasil besar nanti! 💪"</span>
        </p>
      </div>
    </div>
  )
}
