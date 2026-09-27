"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { loginUser as apiLogin, registerUser as apiRegister, getCurrentUser, removeAuthToken, getAuthToken } from "./api"

interface User {
  id: number
  email: string
  name: string
  role: "passenger" | "admin" | "driver"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  register: (email: string, password: string, name: string, phone: string, role?: string) => Promise<{ success: boolean; error?: string }>
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = getAuthToken()
      if (token) {
        try {
          const userData = await getCurrentUser()
          setUser(userData)
        } catch (err) {
          // Token is invalid, clear it
          removeAuthToken()
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiLogin(email, password)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    removeAuthToken()
    setError(null)
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: string = "passenger"
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiRegister(email, password, name, phone, role as "passenger" | "driver" | "admin")
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
