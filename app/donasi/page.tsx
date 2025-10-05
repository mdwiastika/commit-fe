'use client'

import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { formatRupiah } from '@/helper/formatRupiah'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DonasiPage() {
  const [donations, setDonations] = useState<any[]>([])
  const [donationHistories, setDonationHistories] = useState<any[]>([])
  const [donationInfo, setDonationInfo] = useState({
    total_donors: 0,
    total_distributed: 0,
    total_recipients: 0,
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay kecil agar animasi muncul halus
    const timer = setTimeout(() => setIsVisible(true), 100)
    fetchDonationData()
    return () => clearTimeout(timer)
  }, [])

  const fetchDonationData = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.error('Token tidak ditemukan')
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/donations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Gagal mengambil data donasi')

      const data = await response.json()
      setDonations(data.data.donations)
      setDonationHistories(data.data.donation_histories)
      setDonationInfo({
        total_donors: data.data.user_count,
        total_distributed: data.data.total_donated,
        total_recipients: data.data.sum_donating_company,
      })
    } catch (error) {
      console.error('Error fetching donation data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4b63d0]/10 via-white to-gray-50 flex flex-col pb-24 md:pb-4">
      <Navigation currentPage="donasi" />

      <main
        className={`flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 md:pt-32 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-14">
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
            {
              title: 'Total Donatur',
              value: donationInfo.total_donors,
              icon: '🤝',
            },
            {
              title: 'Donasi Terdistribusi',
              value: formatRupiah(donationInfo.total_distributed),
              icon: '💸',
            },
            {
              title: 'Lembaga Penerima',
              value: donationInfo.total_recipients,
              icon: '🏢',
            },
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

          <div
            className="
              flex gap-5 overflow-x-auto pb-4
              snap-x snap-mandatory scrollbar-hide scroll-smooth
              -mx-4 px-4
            "
          >
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="
                  flex-shrink-0 w-[250px] sm:w-[260px] md:w-[280px]
                  bg-white rounded-2xl shadow-md hover:shadow-lg
                  border border-gray-100 overflow-hidden transition-all
                  duration-300 hover:-translate-y-1 snap-start
                "
              >
                <div className="relative w-full aspect-[4/3]">
                  <img
                    src={donation.image || '/placeholder.svg'}
                    alt={donation.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#4b63d0]/10 opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
                    {donation.name}
                  </h3>
                  <p className="text-[#4b63d0] font-semibold text-lg mt-2">
                    {formatRupiah(donation.total)}
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
            {donationHistories.map((item) => (
              <div
                key={item.id}
                className="bg-white/90 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {item.donation.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-[#4b63d0]">
                    {formatRupiah(item.amount)}
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

      {/* Footer hanya di desktop */}
      <div className="hidden md:block mt-auto">
        <Footer />
      </div>
    </div>
  )
}
