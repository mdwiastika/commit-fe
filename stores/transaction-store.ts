import { create } from 'zustand'

interface TransactionData {
  roadmap_id: string
  total_days: number
  amount_transaction: number
}

interface TransactionStore {
  data: TransactionData
  setRoadmapId: (id: string) => void
  setTotalDays: (days: number) => void
  setAmountTransaction: (amount: number) => void
  reset: () => void
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  data: {
    roadmap_id: '',
    total_days: 0,
    amount_transaction: 0,
  },
  setRoadmapId: (id) =>
    set((state) => ({ data: { ...state.data, roadmap_id: id } })),
  setTotalDays: (days) =>
    set((state) => ({ data: { ...state.data, total_days: days } })),
  setAmountTransaction: (amount) =>
    set((state) => ({ data: { ...state.data, amount_transaction: amount } })),
  reset: () =>
    set({
      data: {
        roadmap_id: '',
        total_days: 0,
        amount_transaction: 0,
      },
    }),
}))
