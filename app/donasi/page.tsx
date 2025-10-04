import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'

export default function DonasiPage() {
  const distributedDonations = [
    {
      id: 1,
      name: 'Dompet Dhuafa',
      amount: 'Rp 32.450.213',
      image: '/people-helping-community-donation.jpg',
    },
    {
      id: 2,
      name: 'Rumah Yatim',
      amount: 'Rp 12.380.293',
      image: '/children-orphanage-care.jpg',
    },
    {
      id: 3,
      name: 'Beasiswa Pendidikan',
      amount: 'Rp 17.839.247',
      image: '/graduation-ceremony-students.jpg',
    },
    {
      id: 4,
      name: 'Sumbangan Palestina',
      amount: 'Rp 24.489.223',
      image: '/humanitarian-aid-palestine.jpg',
    },
  ]

  const donationHistory = [
    {
      id: 1,
      name: 'Dompet Dhuafa',
      date: '4 September 2025',
      amount: 'Rp 3.750.000',
    },
    {
      id: 2,
      name: 'Beasiswa Pendidikan',
      date: '18 Agustus 2025',
      amount: 'Rp 3.750.000',
    },
    {
      id: 3,
      name: 'Rumah Yatim',
      date: '11 Agustus 2025',
      amount: 'Rp 3.750.000',
    },
    {
      id: 4,
      name: 'Sumbangan Palestina',
      date: '29 Juni 2025',
      amount: 'Rp 3.750.000',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4b63d0]/10 via-white to-gray-50 px-6">
      <Navigation currentPage="donasi" />

      <main className="max-w-6xl mx-auto px-6 pt-14">
        {/* Header */}
        <div className="text-center mb-14 mt-22">
          <h1 className="text-4xl font-bold text-[#4b63d0] mb-2">
            Ringkasan Donasi
          </h1>
          <p className="text-gray-600 text-sm">
            Lihat bagaimana kontribusi Anda membantu sesama
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { title: 'Total Donatur', value: '1.342', icon: '🤝' },
            {
              title: 'Donasi Terdistribusi',
              value: 'Rp 6.345.000,00-',
              icon: '💸',
            },
            { title: 'Lembaga Penerima', value: '11', icon: '🏢' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center hover:-translate-y-1"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {item.title}
              </h3>
              <p className="text-2xl font-bold text-[#4b63d0]">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Distributed Donations */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#4b63d0] mb-8 border-l-4 border-[#4b63d0] pl-3">
            Donasi Terdistribusi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {distributedDonations.map((donation) => (
              <div
                key={donation.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={donation.image || '/placeholder.svg'}
                    alt={donation.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#4b63d0]/10 opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {donation.name}
                  </h3>
                  <p className="text-lg font-semibold text-[#4b63d0]">
                    {donation.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Donation History */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#4b63d0]">
              Riwayat Donasi
            </h2>
            <ChevronRight className="w-6 h-6 text-[#4b63d0]" />
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button className="p-2 hover:bg-[#4b63d0]/10 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-[#4b63d0]" />
            </button>
            <span className="text-sm text-gray-600">Halaman 1</span>
            <button className="p-2 hover:bg-[#4b63d0]/10 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-[#4b63d0]" />
            </button>
          </div>

          {/* History List */}
          <div className="space-y-3">
            {donationHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white/90 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-[#4b63d0]">
                    {item.amount}
                  </span>
                  <button className="p-2 hover:bg-[#4b63d0]/10 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-[#4b63d0]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
