'use client'
import { Navigation } from '@/components/navigation'
import { ProgressSection } from '@/components/progress-section'
import { StatsCards } from '@/components/stats-cards'
import { ProtectedRoute } from '@/components/protected-route'
import { Footer } from '@/components/footer'
import { useCheckTransactionStatus } from '@/hooks/checkTransactionStatus'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useEffect, useState } from 'react'
import { LearningHistory } from '@/components/learning-history'
import {
  BookOpen,
  Flame,
  Lightbulb,
  MapPin,
  Sparkles,
  Sun,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  CloudOff,
} from 'lucide-react'

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

interface LearningRecommendation {
  tips: string
  motivation: string
  activity: string
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
  const [historyWithWeather, setHistoryWithWeather] = useState<any[]>([])
  const [
    recommendation,
    setRecommendation,
  ] = useState<LearningRecommendation | null>(null)
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false)

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

      if (
        result.data.history_details &&
        result.data.history_details.length > 0
      ) {
        fetchHistoricalWeather(result.data.history_details)
      }
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

  const fetchHistoricalWeather = async (history: any[]) => {
    try {
      const userLat = parseFloat(localStorage.getItem('user_latitude') || '0')
      const userLon = parseFloat(localStorage.getItem('user_longitude') || '0')

      if (!userLat || !userLon) {
        console.warn('Koordinat tidak tersedia, skip fetch cuaca historis')
        setHistoryWithWeather(history)
        return
      }

      const historyPromises = history.map(async (item) => {
        try {
          const historyDate = new Date(item.created_at)
          const today = new Date()

          const daysDiff = Math.floor(
            (today.getTime() - historyDate.getTime()) / (1000 * 60 * 60 * 24),
          )

          if (daysDiff <= 7 && daysDiff >= 0) {
            const dateStr = historyDate.toISOString().split('T')[0]

            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${userLat}&longitude=${userLon}&start_date=${dateStr}&end_date=${dateStr}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`,
            )
            const data = await res.json()

            if (data.daily) {
              return {
                ...item,
                weather: {
                  temperature: Math.round(
                    (data.daily.temperature_2m_max[0] +
                      data.daily.temperature_2m_min[0]) /
                      2,
                  ),
                  weathercode: data.daily.weathercode[0],
                },
              }
            }
          }

          return item
        } catch (err) {
          console.error('Error fetching weather for history item:', err)
          return item
        }
      })

      const updatedHistory = await Promise.all(historyPromises)
      setHistoryWithWeather(updatedHistory)
    } catch (error) {
      console.error('Error fetching historical weather:', error)
      setHistoryWithWeather(history)
    }
  }

  const getWeatherDescription = (code: number) => {
    if (code === 0)
      return {
        icon: <Sun className="w-6 h-6 text-yellow-500" />,
        description: 'Cerah',
      }
    if ([1, 2, 3].includes(code))
      return {
        icon: <CloudSun className="w-6 h-6 text-yellow-500" />,
        description: 'Cerah Berawan',
      }
    if ([45, 48].includes(code))
      return {
        icon: <CloudFog className="w-6 h-6 text-gray-500" />,
        description: 'Berkabut',
      }
    if ([51, 53, 55, 56, 57].includes(code))
      return {
        icon: <CloudDrizzle className="w-6 h-6 text-blue-500" />,
        description: 'Gerimis',
      }
    if ([61, 63, 65, 66, 67].includes(code))
      return {
        icon: <CloudRain className="w-6 h-6 text-blue-500" />,
        description: 'Hujan',
      }
    if ([80, 81, 82].includes(code))
      return {
        icon: <CloudRain className="w-6 h-6 text-blue-500" />,
        description: 'Hujan Deras',
      }
    if ([95, 96, 99].includes(code))
      return {
        icon: <CloudLightning className="w-6 h-6 text-gray-700" />,
        description: 'Badai Petir',
      }
    return {
      icon: <CloudOff className="w-6 h-6 text-gray-400" />,
      description: 'Cuaca Tidak Diketahui',
    }
  }

  const fetchLearningRecommendation = async (weatherInfo: WeatherInfo) => {
    setIsLoadingRecommendation(true)
    try {
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

      if (!GEMINI_API_KEY) {
        console.error('Gemini API key tidak ditemukan')
        return
      }

      const weatherDesc = getWeatherDescription(weatherInfo.weathercode || 0)
        .description
      const roadmapName =
        dashboardInfo.active_transaction?.roadmap?.name || 'pembelajaran'

      const prompt = `Berdasarkan cuaca saat ini yaitu ${weatherDesc} dengan suhu ${weatherInfo.temperature}°C dan topik belajar "${roadmapName}", berikan rekomendasi belajar yang:
1.  **Tips:** Hubungkan tips dengan kondisi cuaca. Contoh: "Karena cuaca cerah, belajar di luar ruangan bisa meningkatkan konsentrasi."
2.  **Motivasi:** Kalimat motivasi yang relevan dengan cuaca dan topik. Contoh: "Hujan deras bukan halangan, jadikan suara rintikan air sebagai semangat!"
3.  **Aktivitas:** Saran aktivitas yang bisa dilakukan sesuai cuaca. Contoh: "Jika hujan, manfaatkan waktu untuk menonton video tutorial yang panjang."
Berikan dalam format JSON berikut:
{
  "tips": "...",
  "motivation": "...",
  "activity": "..."
}`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300,
              topP: 0.8,
              topK: 40,
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'object',
                properties: {
                  tips: { type: 'string' },
                  motivation: { type: 'string' },
                  activity: { type: 'string' },
                },
                required: ['tips', 'motivation', 'activity'],
              },
            },
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Gagal mendapatkan rekomendasi dari Gemini')
      }

      const data = await response.json()
      const textResponse = data.candidates[0].content.parts[0].text

      try {
        const parsedRecommendation = JSON.parse(textResponse)
        setRecommendation(parsedRecommendation)
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError)
        // Fallback recommendation
        setRecommendation({
          tips: 'Manfaatkan suasana hari ini untuk fokus belajar',
          motivation: 'Cuaca apapun, semangat belajar tetap harus menyala!',
          activity:
            'Coba buat catatan singkat tentang materi yang sudah dipelajari',
        })
      }
    } catch (error) {
      console.error('Error fetching learning recommendation:', error)
      // Fallback recommendation
      setRecommendation({
        tips: 'Buat jadwal belajar yang konsisten setiap hari',
        motivation: 'Setiap langkah kecil membawa kemajuan besar!',
        activity: 'Review materi kemarin sebelum lanjut ke materi baru',
      })
    } finally {
      setIsLoadingRecommendation(false)
    }
  }

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          localStorage.setItem('user_latitude', latitude.toString())
          localStorage.setItem('user_longitude', longitude.toString())

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
            .filter(Boolean)
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

  useEffect(() => {
    fetchDashboardInfo()
  }, [])

  useEffect(() => {
    if (weather && dashboardInfo.active_transaction?.roadmap?.name) {
      fetchLearningRecommendation(weather)
    }
  }, [weather, dashboardInfo.active_transaction?.roadmap?.name])

  if (transactionCheckLoading) {
    return <LoadingSpinner />
  }

  const currentWeather = weather
    ? getWeatherDescription(weather.weathercode || 0)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f6ff] via-[#fafafa] to-white px-6 pt-6 md:pt-34 pb-24 md:pb-4">
      <Navigation currentPage="dashboard" />

      <div className="max-w-5xl mx-auto space-y-10 min-h-[calc(100vh-300px)]">
        {weather ? (
          <div className="p-4 bg-white shadow-md rounded-2xl">
            <p className="text-sm text-gray-500 mb-1 flex justify-start items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>Lokasi Anda: {locationName || 'Memuat lokasi...'}</span>
            </p>
            {currentWeather && (
              <p className="text-xl font-medium text-gray-800 mt-4 flex items-center gap-2">
                {currentWeather.icon}
                <span>{currentWeather.description}</span>
              </p>
            )}
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {weather.temperature}°C
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Kecepatan angin: {weather.windspeed} km/jam
            </p>
          </div>
        ) : locationError ? (
          <p className="text-red-500">{locationError}</p>
        ) : (
          <p className="text-gray-400">Memuat data cuaca...</p>
        )}

        {isLoadingRecommendation ? (
          <div className="p-6 bg-gradient-to-r rounded-2xl border  shadow-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
              <p className="text-gray-600">
                Menganalisis kondisi cuaca untuk rekomendasi...
              </p>
            </div>
          </div>
        ) : recommendation ? (
          <div className="p-6 bg-gradient-to-r rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#4b63d0]" />
              <h3 className="text-lg font-semibold text-[#4b63d0]">
                Rekomendasi Belajar Hari Ini
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Tips</p>
                  <p className="text-gray-600">{recommendation.tips}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Flame className="w-6 h-6 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Motivasi</p>
                  <p className="text-gray-600">{recommendation.motivation}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Aktivitas</p>
                  <p className="text-gray-600">{recommendation.activity}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-right">
              Powered by Gemini AI ✨
            </p>
          </div>
        ) : null}

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

        <LearningHistory
          history={
            historyWithWeather.length > 0
              ? historyWithWeather
              : dashboardInfo.history_details
          }
        />
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
