'use client'

import { useState, useEffect, useRef } from 'react'
import { User, LogOut, Home, TrendingUp, Clock, Map, Heart } from 'lucide-react'
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
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Progress', href: '/progress', icon: TrendingUp },
    { name: 'Riwayat', href: '/riwayat', icon: Clock },
    { name: 'Roadmap', href: '/roadmap', icon: Map },
    { name: 'Donasi', href: '/donasi', icon: Heart },
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
    <>
      {/* Desktop Navigation - Top */}
      <motion.nav
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden md:flex fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                   backdrop-blur-lg bg-white/70 border border-[#d7dffc]/60
                   shadow-lg shadow-[#4b63d0]/10 rounded-full
                   px-8 py-3 items-center justify-between"
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
            <div className="flex items-center space-x-12">
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
          <Link
          href="/profil"
          className="flex items-center gap-2 text-[#4b63d0] hover:bg-[#e3e9ff]/50 transition-all px-4 py-2 rounded-xl"
        >
          <User className="w-5 h-5" />
          <span>Akun</span>
        </Link>
        </div>
      </motion.nav>

      {/* Mobile Navigation - Bottom */}
      <motion.nav
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50
                   backdrop-blur-lg bg-white/90 border-t border-[#d7dffc]/60
                   shadow-lg shadow-[#4b63d0]/10 px-4 py-3"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-1 min-w-[60px]"
              >
                <div
                  className={`relative p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-[#4b63d0] text-white'
                      : 'text-gray-500 hover:text-[#4b63d0] hover:bg-[#e3e9ff]/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? 'text-[#4b63d0]' : 'text-gray-500'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            )
          })}
          
          {/* User Menu Button */}
          <Link
            href="/profil"
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <div className="relative p-2 rounded-xl text-gray-500 hover:text-[#4b63d0] hover:bg-[#e3e9ff]/30 transition-all">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-gray-500">Akun</span>
          </Link>
        </div>
      </motion.nav>
    </>
  )
}