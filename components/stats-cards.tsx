"use client";
import { Flame, Wallet, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function StatsCards({
  streak,
  balance,
  donation,
  remainingDays,
}: {
  streak?: number;
  balance?: string;
  donation?: string;
  remainingDays?: number;
}) {
  const canWithdraw = remainingDays !== undefined && remainingDays <= 0;

  const cards = [
    {
      title: "Streak belajar",
      value: streak?.toString() || "0",
      icon: <Flame className="w-5 h-5 text-[#ea3829]" />,
      color: "bg-white/80",
      type: "streak",
    },
    {
      title: "Dompet Komitmen",
      value: balance ? `${balance}` : "0",
      icon: <Wallet className="w-5 h-5 text-[#4b63d0]" />,
      color: "bg-white/80",
      type: "wallet",
    },
    {
      title: "Donasi",
      value: donation ? `${donation}` : "0",
      icon: <Heart className="w-5 h-5 text-[#ea3829]" />,
      color: "bg-white/80",
      type: "donation",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -3, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className={`${card.color} rounded-2xl p-6 border border-[#e0e6ff]/70 shadow-sm backdrop-blur-md flex flex-col justify-between`}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <span className="text-gray-600 text-sm font-medium tracking-tight">
              {card.title}
            </span>
            <div className="flex items-center gap-2">
              {card.icon}
              <span className="text-gray-900 font-semibold text-base">
                {card.value}
              </span>
            </div>
          </div>

          {/* Button hanya muncul jika sudah bisa tarik */}
          {/* {card.type === "wallet" && canWithdraw && ( */}
          {card.type === "wallet" && (
            <Link href="/payout" className="mt-5">
              <button className="w-full bg-gradient-to-r from-[#6582e6] to-[#5571d5] text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:shadow-md transition-all duration-200">
                Tarik Uang
              </button>
            </Link>
          )}
        </motion.div>
      ))}
    </div>
  );
}
