"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  ism: string
  email: string
  telefon?: string
  manzil?: string
  admin: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, parol: string) => boolean
  register: (userData: Omit<User, "id" | "admin"> & { parol: string }) => boolean
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // localStorage dan foydalanuvchini yuklash
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Default admin foydalanuvchini yaratish
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    if (users.length === 0) {
      const defaultAdmin = {
        id: "admin-1",
        ism: "Admin",
        email: "admin@techshop.uz",
        parol: "admin123",
        admin: true,
      }
      localStorage.setItem("users", JSON.stringify([defaultAdmin]))
    }
  }, [])

  const login = (email: string, parol: string): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.parol === parol)

    if (foundUser) {
      const { parol: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const register = (userData: Omit<User, "id" | "admin"> & { parol: string }): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Email mavjudligini tekshirish
    if (users.some((u: any) => u.email === userData.email)) {
      return false
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      admin: false,
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    const { parol: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    // Admin logout qilgandan keyin landing page ga yo'naltirish
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Users ro'yxatini ham yangilash
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData }
      localStorage.setItem("users", JSON.stringify(users))
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
