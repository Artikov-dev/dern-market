"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Eye, EyeOff, Sparkles } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register } = useAuth()
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", parol: "" })
  const [registerData, setRegisterData] = useState({
    ism: "",
    email: "",
    telefon: "",
    parol: "",
    parolTasdiqi: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  if (!isOpen) return null

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (login(loginData.email, loginData.parol)) {
      onClose()
      setLoginData({ email: "", parol: "" })
      setSuccess("")
    } else {
      setError("Email yoki parol noto'g'ri")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (registerData.parol !== registerData.parolTasdiqi) {
      setError("Parollar mos kelmaydi")
      return
    }

    if (registerData.parol.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
      return
    }

    const { parolTasdiqi, ...userData } = registerData
    if (register(userData)) {
      setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi kirishingiz mumkin.")
      setRegisterData({ ism: "", email: "", telefon: "", parol: "", parolTasdiqi: "" })
      // Register qilgandan keyin login tabga o'tkazish
      setTimeout(() => {
        setActiveTab("login")
        setSuccess("")
      }, 2000)
    } else {
      setError("Bu email allaqachon ro'yxatdan o'tgan")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b border-border/50">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              TechShop
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-110"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                Kirish
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                Ro'yxatdan o'tish
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="animate-slide-up">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">Xush kelibsiz!</CardTitle>
                  <CardDescription>Hisobingizga kiring va chegirmalardan foydalaning</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="h-11 bg-background/50 border-border/50 focus:border-primary transition-all duration-200"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-medium">
                        Parol
                      </Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.parol}
                          onChange={(e) => setLoginData({ ...loginData, parol: e.target.value })}
                          className="h-11 bg-background/50 border-border/50 focus:border-primary transition-all duration-200 pr-10"
                          placeholder="••••••••"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-bounce-in">
                        <p className="text-destructive text-sm">{error}</p>
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-200 hover:scale-[1.02]"
                    >
                      Kirish
                    </Button>
                  </form>
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/30">
                    <p className="text-sm text-muted-foreground mb-2">Demo uchun:</p>
                    <div className="space-y-1 text-xs">
                      <p>
                        <span className="font-medium">Admin:</span> admin@techshop.uz / admin123
                      </p>
                      <p>
                        <span className="font-medium">User:</span> user@test.com / user123
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register" className="animate-slide-up">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">Ro'yxatdan o'ting</CardTitle>
                  <CardDescription>
                    Yangi hisob yarating va <span className="text-primary font-semibold">maxsus chegirmalar</span>dan
                    foydalaning!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-sm font-medium">
                        To'liq ism
                      </Label>
                      <Input
                        id="register-name"
                        value={registerData.ism}
                        onChange={(e) => setRegisterData({ ...registerData, ism: e.target.value })}
                        className="h-11 bg-background/50 border-border/50 focus:border-primary transition-all duration-200"
                        placeholder="Ismingizni kiriting"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="h-11 bg-background/50 border-border/50 focus:border-primary transition-all duration-200"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-phone" className="text-sm font-medium">
                        Telefon raqam
                      </Label>
                      <Input
                        id="register-phone"
                        value={registerData.telefon}
                        onChange={(e) => setRegisterData({ ...registerData, telefon: e.target.value })}
                        className="h-11 bg-background/50 border-border/50 focus:border-primary transition-all duration-200"
                        placeholder="+998 90 123 45 67"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-sm font-medium">
                        Parol
                      </Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          value={registerData.parol}
                          onChange={(e) => setRegisterData({ ...registerData, parol: e.target.value })}
                          className="h-11 bg-background/50 border-border/50 focus:border-primary transition-all duration-200 pr-10"
                          placeholder="••••••••"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm" className="text-sm font-medium">
                        Parolni tasdiqlang
                      </Label>
                      <div className="relative">
                        <Input
                          id="register-confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          value={registerData.parolTasdiqi}
                          onChange={(e) => setRegisterData({ ...registerData, parolTasdiqi: e.target.value })}
                          className="h-11 bg-background/50 border-border/50 focus:border-primary transition-all duration-200 pr-10"
                          placeholder="••••••••"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-bounce-in">
                        <p className="text-destructive text-sm">{error}</p>
                      </div>
                    )}
                    {success && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg animate-bounce-in">
                        <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500/90 hover:to-emerald-600/90 transition-all duration-200 hover:scale-[1.02]"
                    >
                      Ro'yxatdan o'tish
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
