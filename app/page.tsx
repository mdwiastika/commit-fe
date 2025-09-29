import { Navigation } from "@/components/navigation"
import { ProgressSection } from "@/components/progress-section"
import { StatsCards } from "@/components/stats-cards"
import { LearningHistory } from "@/components/learning-history"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <Navigation />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-[#6582e6] text-3xl font-bold mb-8">Commit</h1>

        <ProgressSection />
        <StatsCards />
        <LearningHistory />
      </div>
    </div>
  )
}
