'use client'
import { Navigation } from '@/components/navigation'
import { ProgressSection } from '@/components/progress-section'
import { StatsCards } from '@/components/stats-cards'
import { LearningHistory } from '@/components/learning-history'
import { ProtectedRoute } from '@/components/protected-route'
import { Footer } from '@/components/footer'
import { useCheckTransactionStatus } from '@/hooks/checkTransactionStatus'
import { LoadingSpinner } from '@/components/loading-spinner'

function DashboardContent() {
  const { transactionCheckLoading } = useCheckTransactionStatus()

  if (transactionCheckLoading) {
    return <LoadingSpinner />
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f6ff] via-[#fafafa] to-white pt-34 px-6">
      <Navigation currentPage="dashboard" />

      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-[#4b63d0] text-4xl font-extrabold tracking-tight">
          UI/UX Design
        </h1>

        <ProgressSection />
        <StatsCards />
        <LearningHistory />
      </div>
      <Footer />
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
