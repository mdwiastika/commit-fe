import Navigation from "@/components/navigation"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"

export default function DonasiPage() {
  const distributedDonations = [
    {
      id: 1,
      name: "Dompet Dhuafa",
      amount: "Rp 32.450.213",
      image: "/people-helping-community-donation.jpg",
    },
    {
      id: 2,
      name: "Rumah Yatim",
      amount: "Rp 12.380.293",
      image: "/children-orphanage-care.jpg",
    },
    {
      id: 3,
      name: "Beasiswa Pendidikan",
      amount: "Rp 17.839.247",
      image: "/graduation-ceremony-students.jpg",
    },
    {
      id: 4,
      name: "Sumbangan Palestina",
      amount: "Rp 24.489.223",
      image: "/humanitarian-aid-palestine.jpg",
    },
  ]

  const donationHistory = [
    {
      id: 1,
      name: "Dompet Dhuafa",
      date: "4 September 2025",
      amount: "Rp 3.750.000",
    },
    {
      id: 2,
      name: "Beasiswa Pendidikan",
      date: "18 Agustus 2025",
      amount: "Rp 3.750.000",
    },
    {
      id: 3,
      name: "Rumah Yatim",
      date: "11 Agustus 2025",
      amount: "Rp 3.750.000",
    },
    {
      id: 4,
      name: "Sumbangan Palestina",
      date: "29 Juni 2025",
      amount: "Rp 3.750.000",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage="donasi" />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-primary mb-8">Ringkasan Donasi</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Total</div>
            <div className="text-sm text-gray-600 mb-3">Donatur</div>
            <div className="text-2xl font-semibold text-gray-900">1.342</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Total Donasi</div>
            <div className="text-sm text-gray-600 mb-3">Terdistribusi</div>
            <div className="text-2xl font-semibold text-gray-900">Rp 6.345.000,00-</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Lembaga</div>
            <div className="text-sm text-gray-600 mb-3">Penerima</div>
            <div className="text-2xl font-semibold text-gray-900">11</div>
          </div>
        </div>

        {/* Distributed Donations */}
        <div className="mb-12">
          <h2 className="text-2xl font-medium text-primary mb-6">Donasi Terdistribusi</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {distributedDonations.map((donation) => (
              <div key={donation.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <img
                    src={donation.image || "/placeholder.svg"}
                    alt={donation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{donation.name}</h3>
                  <p className="text-lg font-semibold text-gray-900">{donation.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donation History */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium text-primary">Riwayat Donasi</h2>
            <ChevronRight className="w-6 h-6 text-primary" />
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">Halaman 1</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* History List */}
          <div className="space-y-3">
            {donationHistory.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900">{item.amount}</span>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
