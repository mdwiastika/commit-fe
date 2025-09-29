import { Navigation } from "@/components/navigation"
import { ChevronDown, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <Navigation />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main heading */}
        <h1 className="text-3xl font-semibold text-[#6582e6] mb-8">Update Progres Belajarmu Hari ini</h1>

        {/* Material selection section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#6582e6]">Pilih Materi yang Kamu Pelajari Hari ini</h2>

          {/* Dropdown */}
          <div className="relative">
            <select className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-700 appearance-none cursor-pointer">
              <option>Pilih Materi</option>
              <option>Design Principles</option>
              <option>Wireframing</option>
              <option>Typography</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>

          {/* Material items */}
          <div className="space-y-3">
            {/* Design Principles - Completed */}
            <div className="flex items-center justify-between p-4 bg-[#ceeee3] rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">1: Design Principles</h3>
                <p className="text-sm text-gray-600">Description of Design principles</p>
              </div>
              <span className="text-sm font-medium text-gray-700">Sudah dipelajari</span>
            </div>

            {/* Wireframing - Not completed */}
            <div className="flex items-center justify-between p-4 bg-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">2: Wireframing</h3>
                <p className="text-sm text-gray-600">Description of Wireframing</p>
              </div>
              <span className="text-sm font-medium text-gray-700">Belum dipelajari</span>
            </div>

            {/* Typography - Not completed */}
            <div className="flex items-center justify-between p-4 bg-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">3: Typography</h3>
                <p className="text-sm text-gray-600">Description of Typography</p>
              </div>
              <span className="text-sm font-medium text-gray-700">Belum dipelajari</span>
            </div>
          </div>
        </div>

        {/* Materials studied section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#6582e6]">Materi yang dipelajari</h2>

          <div className="space-y-3">
            {/* Wireframing */}
            <div className="p-4 border border-gray-300 rounded-lg bg-white">
              <h3 className="font-medium text-gray-800 mb-1">2. Wireframing</h3>
              <p className="text-sm text-gray-600">Description of wireframing</p>
            </div>

            {/* Prototyping */}
            <div className="p-4 border border-gray-300 rounded-lg bg-white">
              <h3 className="font-medium text-gray-800 mb-1">3. Prototyping</h3>
              <p className="text-sm text-gray-600">Description of prototyping</p>
            </div>
          </div>
        </div>

        {/* Progress writing section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#6582e6]">Tuliskan progres belajar</h2>

          <div className="relative">
            <textarea
              className="w-full h-32 p-4 border border-gray-300 rounded-lg bg-white resize-none"
              placeholder="Tulis progres belajar anda..."
            />
            <Send className="absolute bottom-4 right-4 w-5 h-5 text-[#6582e6] cursor-pointer" />
          </div>

          <p className="text-sm text-gray-600">Summary Prototyping.pdf</p>
        </div>

        {/* Submit button */}
        <div className="flex justify-center pt-6">
          <Button className="bg-[#6582e6] hover:bg-[#5a73d9] text-white px-8 py-3 rounded-lg font-medium">
            Kumpulkan dan Kerjakan Quiz
          </Button>
        </div>
      </div>
    </div>
  )
}
