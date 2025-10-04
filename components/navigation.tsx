'use client'

import { User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { motion } from 'framer-motion'

export function Navigation({ currentPage }: { currentPage: string }) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Progress', href: '/progress' },
    { name: 'Riwayat', href: '/riwayat' },
    { name: 'Roadmap', href: '/roadmap' },
    { name: 'Donasi', href: '/donasi' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                 backdrop-blur-lg bg-white/70 border border-[#d7dffc]/60
                 shadow-lg shadow-[#4b63d0]/10 rounded-full
                 px-8 py-3 w-[90%] md:w-auto flex items-center justify-between"
    >
      <div className="flex items-center justify-between w-full space-x-32">
        {/* Logo + Links */}
        <div className="flex items-center space-x-32">
          <div className="text-[#4b63d0] font-extrabold text-xl tracking-tight">
            Commit<span className="text-[#8ca4ff]">.</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "text-[#4b63d0] after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#4b63d0] after:rounded-full"
                    : 'text-gray-600 hover:text-[#4b63d0]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-[#4b63d0] hover:bg-[#e3e9ff]/50 transition-all"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Akun</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl shadow-lg border border-gray-100"
          >
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.nav>
  )
}
