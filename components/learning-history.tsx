'use client'
import {
  ArrowRight,
  BookOpen,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudOff,
  CloudRain,
  CloudSun,
  Sun,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function LearningHistory({ history }: { history: any[] }) {
  const getWeatherDescription = (code: number) => {
    if (code === 0)
      return {
        icon: <Sun className="w-4 h-4 text-yellow-500" />,
        description: 'Cerah',
      }
    if ([1, 2, 3].includes(code))
      return {
        icon: <CloudSun className="w-4 h-4 text-yellow-500" />,
        description: 'Cerah berawan',
      }
    if ([45, 48].includes(code))
      return {
        icon: <CloudFog className="w-4 h-4 text-gray-500" />,
        description: 'Berkabut',
      }
    if ([51, 53, 55, 56, 57].includes(code))
      return {
        icon: <CloudDrizzle className="w-4 h-4 text-blue-500" />,
        description: 'Gerimis',
      }
    if ([61, 63, 65, 66, 67].includes(code))
      return {
        icon: <CloudRain className="w-4 h-4 text-blue-500" />,
        description: 'Hujan',
      }
    if ([80, 81, 82].includes(code))
      return {
        icon: <CloudRain className="w-4 h-4 text-blue-500" />,
        description: 'Hujan deras',
      }
    if ([95, 96, 99].includes(code))
      return {
        icon: <CloudLightning className="w-4 h-4 text-gray-700" />,
        description: 'Badai petir',
      }
    return {
      icon: <CloudOff className="w-4 h-4 text-gray-400" />,
      description: 'Cuaca tidak diketahui',
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#4b63d0] text-lg font-semibold">
          Riwayat Belajar
        </h3>
        <Link
          href="/riwayat"
          className="flex items-center text-[#4b63d0] text-sm hover:underline"
        >
          Lihat selengkapnya
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-3">
        {history.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            className={`rounded-xl p-4 flex items-center justify-between border border-[#e0e6ff]/60 ${
              item.amount > 0
                ? 'bg-gradient-to-r from-[#e7fff5] to-[#f4fff9]'
                : 'bg-gradient-to-r from-[#fff0ef] to-[#ffe8e7]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#121212] font-medium">
                  Day {history.length - i}:
                </span>
                <span className="text-[#5f6265]">
                  {item.roadmap_details.map((rd: any) => rd.name).join(', ')}
                </span>
              </div>
              <div className="text-[#7a7d81] text-sm mt-1">
                {new Date(item.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              {item.weather && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  {getWeatherDescription(item.weather.weathercode || 0).icon}
                  <span className="text-gray-600">
                    {
                      getWeatherDescription(item.weather.weathercode || 0)
                        .description
                    }
                  </span>
                  <span className="text-blue-600 font-medium">
                    {item.weather.temperature}°C
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`font-semibold ${
                  item.amount > 0 ? 'text-[#0bac74]' : 'text-[#ea3829]'
                }`}
              >
                Rp {Math.floor(item.amount)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-[#5f6265] text-sm italic">
          “Kebiasaan kecil setiap hari akan jadi hasil besar nanti 💪”
        </p>
      </div>
    </motion.div>
  )
}
