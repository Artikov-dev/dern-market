"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, LogOut, Settings, Sun, Moon, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { LoginModal } from "./login-modal"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [cartCount, setCartCount] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Savatcha elementlari sonini hisoblash
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const count = cart.reduce((total: number, item: any) => total + item.miqdor, 0)
      setCartCount(count)
    }

    updateCartCount()

    // localStorage o'zgarishlarini kuzatish
    window.addEventListener("storage", updateCartCount)
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <nav className="sticky top-0 z-50 glass-effect border-b backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in"
              >
                TechShop
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/mahsulotlar"
                  className="text-foreground/80 hover:text-primary transition-colors duration-200 hover:scale-105 transform"
                >
                  Mahsulotlar
                </Link>
                <Link
                  href="/kategoriyalar"
                  className="text-foreground/80 hover:text-primary transition-colors duration-200 hover:scale-105 transform"
                >
                  Kategoriyalar
                </Link>
                {user && (
                  <Link
                    href="/chegirmalar"
                    className="text-foreground/80 hover:text-primary transition-colors duration-200 hover:scale-105 transform"
                  >
                    Chegirmalar
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:scale-110 transition-transform duration-200"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Cart */}
              <Link href="/savatcha">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:scale-110 transition-transform duration-200"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 animate-bounce-in">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 animate-fade-in">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{user.ism}</span>
                    {user.admin && (
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <Link href="/profil">
                    <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform duration-200">
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                  {user.admin && (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform duration-200">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="hover:scale-110 transition-transform duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="hidden md:flex hover:scale-105 transition-transform duration-200"
                >
                  Kirish
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 animate-slide-up">
              <Link
                href="/mahsulotlar"
                className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors"
              >
                Mahsulotlar
              </Link>
              <Link
                href="/kategoriyalar"
                className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors"
              >
                Kategoriyalar
              </Link>
              {user ? (
                <>
                  <Link
                    href="/chegirmalar"
                    className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors"
                  >
                    Chegirmalar
                  </Link>
                  <Link
                    href="/profil"
                    className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors"
                  >
                    Profil
                  </Link>
                  {user.admin && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-foreground/80 hover:text-primary transition-colors"
                  >
                    Chiqish
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="block w-full text-left px-3 py-2 text-primary font-medium"
                >
                  Kirish
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
