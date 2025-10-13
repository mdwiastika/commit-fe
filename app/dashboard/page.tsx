'use client'
import { Navigation } from '@/components/navigation'
import { ProgressSection } from '@/components/progress-section'
import { StatsCards } from '@/components/stats-cards'
import { LearningHistory } from '@/components/learning-history'
import { ProtectedRoute } from '@/components/protected-route'
import { Footer } from '@/components/footer'
import { useCheckTransactionStatus } from '@/hooks/checkTransactionStatus'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useEffect, useState } from 'react'

interface DashboardInfo {
  active_transaction?: {
    roadmap?: {
      name?: string
    }
    total_days?: number
    created_at?: string
  }
  user?: {
    name?: string
    email?: string
    balance?: number
  }
  progress: number
  complete_roadmap_details: number
  total_roadmap_details: number
  remaining_days: string
  donation: number
  streak?: number
  history_details: any[]
}

interface WeatherInfo {
  temperature?: number
  windspeed?: number
  weathercode?: number
}

function DashboardContent() {
  const { transactionCheckLoading } = useCheckTransactionStatus()
  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfo>({
    progress: 0,
    complete_roadmap_details: 0,
    total_roadmap_details: 0,
    remaining_days: '',
    user: {
      name: '',
      email: '',
      balance: 0,
    },
    donation: 0,
    streak: 0,
    history_details: [],
  })
  const [weather, setWeather] = useState<WeatherInfo | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationName, setLocationName] = useState<string>('')

  const fetchDashboardInfo = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.error('Token tidak ditemukan')
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

      const response = await fetch(`${API_URL}/dashboard`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil informasi dashboard')
      }

      const result = await response.json()
      console.log(result)
      setDashboardInfo(result.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      )
      const data = await res.json()
      setWeather(data.current_weather)
    } catch (error) {
      console.error('Gagal mengambil data cuaca:', error)
    }
  }

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          fetchWeather(latitude, longitude)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          )
          const data = await res.json()
          const readableLocation = [
            data.address.village,
            data.address.city,
            data.address.state,
            data.address.country,
          ]
            .filter(Boolean) // hanya ambil yang ada nilainya
            .join(', ')

          setLocationName(readableLocation || 'Lokasi tidak diketahui')
        },
        (err) => {
          console.error('Gagal mendapatkan lokasi:', err.message)
          setLocationError(
            'Tidak bisa mendapatkan lokasi. Aktifkan izin lokasi browser.',
          )
        },
      )
    } else {
      setLocationError('Geolocation tidak didukung oleh browser ini.')
    }
  }, [])

  const getWeatherDescription = (code: number) => {
    if (code === 0) return '☀️ Cerah'
    if ([1, 2, 3].includes(code)) return '🌤️ Cerah berawan'
    if ([45, 48].includes(code)) return '🌫️ Berkabut'
    if ([51, 53, 55, 56, 57].includes(code)) return '🌦️ Gerimis'
    if ([61, 63, 65, 66, 67].includes(code)) return '🌧️ Hujan'
    if ([80, 81, 82].includes(code)) return '⛈️ Hujan deras'
    if ([95, 96, 99].includes(code)) return '⚡ Badai petir'
    return '🌈 Cuaca tidak diketahui'
  }

  useEffect(() => {
    fetchDashboardInfo()
  }, [])

  if (transactionCheckLoading) {
    return <LoadingSpinner />
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f6ff] via-[#fafafa] to-white px-6 pt-6 md:pt-34 pb-24 md:pb-4">
      <Navigation currentPage="dashboard" />

      <div className="max-w-5xl mx-auto space-y-10 min-h-[calc(100vh-300px)]">
        {weather ? (
          <div className="p-4 bg-white shadow-md rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">
              📍 Lokasi Anda: {locationName || 'Memuat lokasi...'}
            </p>
            <p className="text-xl font-medium text-gray-800">
              {getWeatherDescription(weather.weathercode || 0)}
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {weather.temperature}°C
            </p>
            <p className="text-sm text-gray-500">
              Kecepatan angin: {weather.windspeed} km/jam
            </p>
          </div>
        ) : locationError ? (
          <p className="text-red-500">{locationError}</p>
        ) : (
          <p className="text-gray-400">Memuat data cuaca...</p>
        )}
        <h1 className="text-[#4b63d0] text-4xl font-extrabold tracking-tight">
          {dashboardInfo.active_transaction?.roadmap?.name}
        </h1>

        <ProgressSection
          completedMaterials={dashboardInfo.complete_roadmap_details}
          totalMaterials={dashboardInfo.total_roadmap_details}
          deadline={dashboardInfo.remaining_days?.toString()}
          percentage={dashboardInfo.progress || 0}
        />
        <StatsCards
          streak={dashboardInfo.streak}
          balance={dashboardInfo.user?.balance?.toString()}
          donation={dashboardInfo.donation?.toString()}
          remainingDays={
            dashboardInfo.remaining_days
              ? parseInt(dashboardInfo.remaining_days.split(' ')[0])
              : 0
          }
        />
        <LearningHistory history={dashboardInfo.history_details} />
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
