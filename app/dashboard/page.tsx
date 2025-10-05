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

  useEffect(() => {
    fetchDashboardInfo()
  }, [])

  if (transactionCheckLoading) {
    return <LoadingSpinner />
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f6ff] via-[#fafafa] to-white px-6 pt-6 md:pt-34 pb-24">
      <Navigation currentPage="dashboard" />

      <div className="max-w-5xl mx-auto space-y-10 min-h-[calc(100vh-300px)]">
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
