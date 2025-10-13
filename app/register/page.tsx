"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { register as registerApi } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setGeneralError("")

    if (formData.password !== formData.password_confirmation) {
      setFieldErrors({
        password_confirmation: "Password dan konfirmasi password tidak cocok",
      })
      return
    }

    setLoading(true)

    try {
      const response = await registerApi(formData)
      login(response.data.token)
      router.push("/pemilihan")
    } catch (err: any) {
      const responseData = err.response?.data || {}
      console.error("Registration error:", responseData)

      const { message, errors } = responseData

      if (errors && typeof errors === "object") {
        const newErrors: Record<string, string> = {}
        for (const key in errors) {
          newErrors[key] = errors[key][0]
        }
        setFieldErrors(newErrors)
      } else if (message) {
        setGeneralError(message)
      } else {
        setGeneralError("Terjadi kesalahan, silakan coba lagi.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Buat Akun Baru</h1>
          <p className="text-[#5f6265]">Daftar untuk memulai perjalanan belajar Anda</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {generalError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {generalError}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 border ${
                  fieldErrors.name ? "border-red-400" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6582e6] focus:border-transparent`}
                placeholder="John Doe"
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 border ${
                  fieldErrors.email ? "border-red-400" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6582e6] focus:border-transparent`}
                placeholder="admin@example.com"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.password ? "border-red-400" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6582e6] focus:border-transparent`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6265] hover:text-[#121212]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.password_confirmation}
                  onChange={(e) =>
                    setFormData({ ...formData, password_confirmation: e.target.value })
                  }
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.password_confirmation ? "border-red-400" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6582e6] focus:border-transparent`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6265] hover:text-[#121212]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password_confirmation}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6582e6] text-white py-3 rounded-lg font-medium hover:bg-[#5571d5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#5f6265]">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-[#6582e6] font-medium hover:underline">
                Masuk sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
