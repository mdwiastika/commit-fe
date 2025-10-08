"use client";
import { Flame, Wallet, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function StatsCards({
  streak,
  balance,
  donation,
}: {
  streak?: number;
  balance?: string;
  donation?: string;
}) {
  const cards = [
    {
      title: "Streak belajar",
      value: streak?.toString() || "0",
      icon: <Flame className="w-5 h-5 text-[#ea3829]" />,
      color: "bg-white/70",
      type: "streak",
    },
    {
      title: "Dompet Komitmen",
      value: balance || "0",
      icon: <Wallet className="w-5 h-5 text-[#4b63d0]" />,
      color: "bg-white/70",
      type: "wallet",
    },
    {
      title: "Donasi",
      value: donation || "0",
      icon: <Heart className="w-5 h-5 text-[#ea3829]" />,
      color: "bg-white/70",
      type: "donation",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className={`${card.color} rounded-2xl p-5 border border-[#e0e6ff]/60 backdrop-blur-md shadow-sm`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#5f6265] text-sm">{card.title}</span>
            <div className="flex items-center gap-2">
              {card.icon}
              <span className="text-[#121212] font-semibold">{card.value}</span>
            </div>
          </div>

          {/* Button Tarik Uang hanya untuk card Dompet Komitmen */}
          {card.type === "wallet" && (
            <Link href="/payout">
              <button className="w-full bg-gradient-to-r from-[#6582e6] to-[#5571d5] text-white py-2 px-4 rounded-lg font-medium hover:shadow-md transition-all text-sm">
                Tarik Uang
              </button>
            </Link>
          )}
        </motion.div>
      ))}
    </div>
  );
}
