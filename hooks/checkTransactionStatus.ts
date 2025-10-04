import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export function useCheckTransactionStatus() {
  const { isAuthenticated, token } = useAuth()
  const router = useRouter()
  const [transactionCheckLoading, setTransactionCheckLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setTransactionCheckLoading(false)
      return
    }

    const fetchTransactions = async (token: string) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      return response.json()
    }

    const run = async () => {
      try {
        const response = await fetchTransactions(token as string)
        if (response.data) {
          if (response.data.status !== 'paid') {
            router.push('/pemilihan')
          } else {
            router.push('/dashboard')
          }
        } else {
          router.push('/pemilihan')
        }
      } catch (err) {
        console.error(err)
      } finally {
        setTransactionCheckLoading(false)
      }
    }

    run()
  }, [isAuthenticated, token, router])

  return { transactionCheckLoading }
}
