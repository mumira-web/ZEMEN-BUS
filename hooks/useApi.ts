import { useState, useCallback } from 'react'
import { authenticatedFetch } from '@/lib/api'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(
  initialData: T | null = null
): UseApiState<T> & {
  fetchData: (endpoint: string) => Promise<void>
  refetch: () => Promise<void>
  setData: (data: T) => void
} {
  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastEndpoint, setLastEndpoint] = useState<string>('')

  const fetchData = useCallback(async (endpoint: string) => {
    setLoading(true)
    setError(null)
    setLastEndpoint(endpoint)
    
    try {
      const result = await authenticatedFetch(endpoint)
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    if (lastEndpoint) {
      await fetchData(lastEndpoint)
    }
  }, [lastEndpoint, fetchData])

  return {
    data,
    loading,
    error,
    fetchData,
    refetch,
    setData,
  }
}

export function useApiMutation<TData, TResponse>(
  apiFunction: (data: TData) => Promise<TResponse>
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TResponse | null>(null)

  const mutate = useCallback(
    async (payload: TData): Promise<TResponse | null> => {
      setLoading(true)
      setError(null)

      try {
        const result = await apiFunction(payload)
        setData(result)
        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Operation failed'
        setError(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [apiFunction]
  )

  return {
    mutate,
    loading,
    error,
    data,
  }
}
