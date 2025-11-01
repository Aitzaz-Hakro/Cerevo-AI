"use client"

import { useState, useCallback } from "react"
import apiClient from "@/lib/apiClient"

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export function useApi(options?: UseApiOptions) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = useCallback(
    async (method: "get" | "post" | "put" | "delete", url: string, payload?: any) => {
      setLoading(true)
      setError(null)
      try {
        const response = await apiClient[method](url, payload)
        setData(response.data)
        options?.onSuccess?.(response.data)
        return response.data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "An error occurred"
        setError(errorMessage)
        options?.onError?.(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [options],
  )

  //return { data, loading, error, request }
  return { data, loading, error, request, setData }

}
