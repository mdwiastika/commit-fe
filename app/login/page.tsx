'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { getToken, login as loginApi } from '@/lib/auth'
import { useAuth } from '@/contexts/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, token } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTransactions = async (token: string) => {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${API_URL}/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        })
        if (!response.ok) {
          throw new Error('Failed to fetch transactions')
        }
        return response.json()
      }

      const run = async () => {
        try {
          const response = await fetchTransactions(token as string)
          if (response.data) {
            if (response.data.status !== 'paid') {
              router.push('/pemilihan')
            } else {
              router.push('/dashboard')
            }
          } else {
            router.push('/pemilihan')
          }
        } catch (err) {
          console.error(err)
        }
      }

      run()
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await loginApi(formData)
      login(response.data.token)
      router.push('/pemilihan')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Selamat Datang</h1>
          <p className="text-[#5f6265]">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6582e6] focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6582e6] focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6265] hover:text-[#121212]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6582e6] text-white py-3 rounded-lg font-medium hover:bg-[#5571d5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#5f6265]">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="text-[#6582e6] font-medium hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
