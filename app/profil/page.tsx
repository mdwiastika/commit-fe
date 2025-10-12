'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Crown, User, Medal, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export default function ProfilPage() {
  const [leaderboards, setLeaderboards] = useState<any[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [userScore, setUserScore] = useState<string>('0')
  const [isLoaded, setIsLoaded] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchUserProfile()
    fetchLeaderboard()
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.error('Token tidak ditemukan')
        return
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Gagal mengambil profil user')

      const result = await res.json()
      if (result?.status && result?.data) {
        setUser(result.data)
      } else {
        console.warn('Format response tidak sesuai')
      }
    } catch (error) {
      console.error('Gagal memuat profil:', error)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.error('Token tidak ditemukan')
        return
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
      const res = await fetch(`${API_URL}/leaderboard`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
      const result = await res.json()
      if (result?.status && result?.data) {
        setLeaderboards(result.data.leaderboards || [])
        setUserRank(result.data.user_rank || null)
        setUserScore(result.data.user_score || '0')
      } else {
        console.warn('Response tidak sesuai format yang diharapkan')
      }
    } catch (error) {
      console.error('Gagal memuat leaderboard:', error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white md:mx-6">
      <Navigation currentPage="profil" />

      <main
        className={`flex-grow transition-all duration-700 ease-out transform ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        } max-w-4xl mx-auto w-full px-6 pt-6 md:pt-36 pb-24 md:pb-12`}
      >
        {/* User Info */}
        <section className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-3xl p-6 md:p-8 mb-10 text-center">
          {user ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-[#e3e9ff] flex items-center justify-center">
                <User className="w-10 h-10 text-[#4b63d0]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.name || 'Saif'}
              </h1>
              <p className="text-gray-500">{user.email || 'saif@gmail.com'}</p>
              <p className="text-gray-600 font-medium">
                Saldo: Rp{' '}
                {Math.floor(parseFloat(user.balance || 0)).toLocaleString(
                  'id-ID',
                )}
              </p>
              <p className="text-gray-400 text-sm">
                Bergabung sejak {formatJoinDate(user.created_at)}
              </p>
              <button
                onClick={handleLogout}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 text-white font-medium shadow-md hover:bg-red-700 active:scale-95 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          ) : (
            <p className="text-gray-500 italic">Memuat data profil...</p>
          )}
        </section>

        {/* Leaderboard */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" /> Leaderboard
          </h2>

          {/* Jika belum ada data */}
          {leaderboards.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              Memuat leaderboard...
            </p>
          ) : (
            <>
              {/* Top 3 Podium - Luxury Version */}
              <div className="relative mb-12 px-4">
                {/* Sparkle decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-4xl animate-pulse">
                  ✨
                </div>

                <div className="flex justify-center items-end gap-3 md:gap-6 relative">
                  {/* 2nd Place - Silver */}
                  {leaderboards[1] && (
                    <div className="flex flex-col items-center animate-[slideUp_0.8s_ease-out_0.2s_both]">
                      <div className="relative mb-3">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full blur-lg opacity-60 animate-pulse"></div>
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex items-center justify-center border-4 border-white shadow-2xl">
                          <Medal className="w-8 h-8 md:w-10 md:h-10 text-gray-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-gray-300 to-gray-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                          2
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-100 via-white to-gray-200 shadow-xl rounded-t-3xl p-4 md:p-5 w-28 md:w-36 border-t-4 border-gray-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                        <p className="font-bold text-gray-900 text-xs md:text-sm text-center truncate mb-2">
                          {leaderboards[1].name}
                        </p>
                        <div className="bg-white/60 rounded-lg p-2 backdrop-blur-sm">
                          <p className="text-xs md:text-sm text-gray-700 font-semibold text-center">
                            Rp{' '}
                            {Math.floor(
                              parseFloat(
                                leaderboards[1].transaction_details_sum_amount,
                              ),
                            ).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <div className="w-28 md:w-36 h-20 md:h-24 bg-gradient-to-b from-gray-200 to-gray-300 border-x-2 border-gray-400"></div>
                    </div>
                  )}

                  {/* 1st Place - Gold */}
                  {leaderboards[0] && (
                    <div className="flex flex-col items-center animate-[slideUp_0.8s_ease-out] relative z-10">
                      {/* Crown decoration */}
                      <Crown className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mb-1 animate-bounce" />

                      <div className="relative mb-3">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full blur-xl opacity-70 animate-pulse"></div>
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 flex items-center justify-center border-4 border-white shadow-2xl transform hover:scale-110 transition-transform">
                          <Medal className="w-10 h-10 md:w-12 md:h-12 text-yellow-700" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-amber-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-pulse">
                          1
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 shadow-2xl rounded-t-3xl p-5 md:p-6 w-32 md:w-40 border-t-4 border-yellow-400 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
                        <div className="absolute top-2 right-2 text-xl animate-spin-slow">
                          ⭐
                        </div>
                        <p className="font-bold text-gray-900 text-sm md:text-base text-center truncate mb-2">
                          {leaderboards[0].name}
                        </p>
                        <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-lg p-2 backdrop-blur-sm border border-yellow-300 shadow-inner">
                          <p className="text-sm md:text-base text-amber-800 font-bold text-center">
                            Rp{' '}
                            {Math.floor(
                              parseFloat(
                                leaderboards[0].transaction_details_sum_amount,
                              ),
                            ).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <div className="w-32 md:w-40 h-28 md:h-32 bg-gradient-to-b from-yellow-200 via-yellow-300 to-amber-400 border-x-2 border-yellow-500 shadow-lg"></div>
                    </div>
                  )}

                  {/* 3rd Place - Bronze */}
                  {leaderboards[2] && (
                    <div className="flex flex-col items-center animate-[slideUp_0.8s_ease-out_0.4s_both]">
                      <div className="relative mb-3">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full blur-lg opacity-60 animate-pulse"></div>
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 flex items-center justify-center border-4 border-white shadow-2xl">
                          <Medal className="w-8 h-8 md:w-10 md:h-10 text-amber-900" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-600 to-orange-700 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                          3
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 via-white to-orange-100 shadow-xl rounded-t-3xl p-4 md:p-5 w-28 md:w-36 border-t-4 border-amber-500 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                        <p className="font-bold text-gray-900 text-xs md:text-sm text-center truncate mb-2">
                          {leaderboards[2].name}
                        </p>
                        <div className="bg-white/60 rounded-lg p-2 backdrop-blur-sm">
                          <p className="text-xs md:text-sm text-amber-800 font-semibold text-center">
                            Rp{' '}
                            {Math.floor(
                              parseFloat(
                                leaderboards[2].transaction_details_sum_amount,
                              ),
                            ).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <div className="w-28 md:w-36 h-16 md:h-20 bg-gradient-to-b from-amber-200 to-orange-300 border-x-2 border-amber-500"></div>
                    </div>
                  )}
                </div>

                {/* Confetti decorations */}
                <div className="absolute bottom-0 left-0 text-2xl animate-bounce">
                  🎊
                </div>
                <div
                  className="absolute bottom-0 right-0 text-2xl animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                >
                  🎉
                </div>
              </div>

              {/* Rank 4–10 */}
              <div className="space-y-3">
                {leaderboards.slice(3, 10).map((item, index) => {
                  const rank = index + 4
                  const isCurrentUser = user?.name && item.id === user.id
                  return (
                    <div
                      key={item.id}
                      className={`flex justify-between items-center p-4 rounded-2xl border transition ${
                        isCurrentUser
                          ? 'bg-[#e3e9ff]/50 border-[#4b63d0]'
                          : 'bg-white border-gray-100 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-700 font-bold w-6">
                          #{rank}
                        </span>
                        <p className="text-gray-800 font-medium">{item.name}</p>
                      </div>
                      <span className="text-gray-600 text-sm">
                        Rp{' '}
                        {Math.floor(
                          parseFloat(item.transaction_details_sum_amount),
                        ).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* User Rank Summary */}
              {userRank && (
                <div className="mt-10 text-center">
                  <p className="text-gray-600">
                    Kamu berada di peringkat{' '}
                    <span className="text-[#4b63d0] font-semibold">
                      #{userRank}
                    </span>{' '}
                    dengan skor{' '}
                    <span className="text-[#4b63d0] font-semibold">
                      {parseFloat(userScore || '0').toFixed(2)}
                    </span>
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Footer hanya muncul di desktop */}
      <div className="hidden md:block mt-auto">
        <Footer />
      </div>
    </div>
  )
}
