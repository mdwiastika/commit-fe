'use client'

import { useState, useEffect, useRef } from 'react'
import { User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import Image from 'next/image'

export function Navigation({ currentPage }: { currentPage?: string }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Progress', href: '/progress' },
    { name: 'Riwayat', href: '/riwayat' },
    { name: 'Roadmap', href: '/roadmap' },
    { name: 'Donasi', href: '/donasi' },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
          <div className="text-[#4b63d0] font-extrabold text-xl tracking-tight flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Commit Logo"
              width={30}
              height={30}
              className="inline-block"
            />
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

        {/* User Dropdown Manual */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-[#4b63d0] hover:bg-[#e3e9ff]/50 transition-all"
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Akun</span>
          </Button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-[999]"
              >
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-all rounded-t-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  )
}
