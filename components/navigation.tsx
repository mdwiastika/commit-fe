"use client"

import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Progress", href: "/progress" },
    { name: "Riwayat", href: "/riwayat" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "Donasi", href: "/donasi" },
  ]

  return (
    <nav className="bg-[#e0e6fa] border border-[#6582e6] rounded-full px-6 py-3 mx-auto max-w-6xl mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-[#6582e6] font-semibold text-lg">Commit</div>
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-[#6582e6] hover:text-[#5a73d9] transition-colors ${
                  pathname === item.href ? "border-b-2 border-[#6582e6] pb-1" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <Button variant="ghost" className="text-[#6582e6] hover:bg-[#6582e6]/10">
          <User className="w-4 h-4 mr-2" />
          User
        </Button>
      </div>
    </nav>
  )
}

export default Navigation
