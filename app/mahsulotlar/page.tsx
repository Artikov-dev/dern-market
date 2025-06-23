"use client"

import { useState, useEffect } from "react"
import { MahsulotKartasi } from "@/components/mahsulot-kartasi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, Sparkles } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { LoginModal } from "@/components/login-modal"

interface Mahsulot {
  id: number
  nomi: string
  tavsif: string
  narx: number
  rasm: string
  kategoriya: string
  zaxira: number
  yangi: boolean
}

export default function MahsulotlarPage() {
  const { user } = useAuth()
  const [mahsulotlar, setMahsulotlar] = useState<Mahsulot[]>([])
  const [filteredMahsulotlar, setFilteredMahsulotlar] = useState<Mahsulot[]>([])
  const [qidiruv, setQidiruv] = useState("")
  const [kategoriya, setKategoriya] = useState("all")
  const [saralash, setSaralash] = useState("default")
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    // Mahsulotlarni yuklash
    fetch("/api/products")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setMahsulotlar(data)
        setFilteredMahsulotlar(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Mahsulotlarni yuklashda xatolik:", err)
        setLoading(false)
        setMahsulotlar([])
        setFilteredMahsulotlar([])
      })
  }, [])

  useEffect(() => {
    let filtered = mahsulotlar

    // Qidiruv bo'yicha filterlash
    if (qidiruv) {
      filtered = filtered.filter(
        (mahsulot) =>
          mahsulot.nomi.toLowerCase().includes(qidiruv.toLowerCase()) ||
          mahsulot.tavsif.toLowerCase().includes(qidiruv.toLowerCase()),
      )
    }

    // Kategoriya bo'yicha filterlash
    if (kategoriya !== "all") {
      filtered = filtered.filter((mahsulot) => mahsulot.kategoriya === kategoriya)
    }

    // Saralash
    switch (saralash) {
      case "price-low":
        filtered.sort((a, b) => a.narx - b.narx)
        break
      case "price-high":
        filtered.sort((a, b) => b.narx - a.narx)
        break
      case "name":
        filtered.sort((a, b) => a.nomi.localeCompare(b.nomi))
        break
      case "new":
        filtered.sort((a, b) => (b.yangi ? 1 : 0) - (a.yangi ? 1 : 0))
        break
    }

    setFilteredMahsulotlar(filtered)
  }, [mahsulotlar, qidiruv, kategoriya, saralash])

  const kategoriyalar = [...new Set(mahsulotlar.map((m) => m.kategoriya))]

  const clearFilters = () => {
    setQidiruv("")
    setKategoriya("all")
    setSaralash("default")
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Mahsulotlar yuklanmoqda...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!loading && mahsulotlar.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-6xl">🚫</div>
        <h2 className="text-2xl font-semibold">Mahsulotlarni yuklab boʻlmadi</h2>
        <p className="text-muted-foreground">Iltimos keyinroq qayta urining yoki administrator bilan bogʻlaning.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Mahsulotlar
        </h1>
        <p className="text-muted-foreground">
          {user
            ? "Maxsus chegirmalar bilan eng yaxshi mahsulotlar"
            : "Barcha mahsulotlarni ko'ring. Ro'yxatdan o'ting va chegirmalardan foydalaning!"}
        </p>
      </div>

      {/* Register qilmagan userlar uchun chegirma taklifi */}
      {!user && (
        <Card className="mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/20 animate-bounce-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                <div>
                  <h3 className="font-semibold text-lg">Maxsus chegirmalar!</h3>
                  <p className="text-muted-foreground">
                    Ro'yxatdan o'ting va barcha mahsulotlarga 5-20% gacha chegirma oling
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500/90 hover:to-emerald-600/90 hover:scale-105 transition-all duration-200"
              >
                Ro'yxatdan o'tish
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filterlash va qidiruv */}
      <Card className="mb-8 glass-effect animate-slide-up">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Mahsulot qidirish..."
                value={qidiruv}
                onChange={(e) => setQidiruv(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary transition-all duration-200"
              />
            </div>

            <Select value={kategoriya} onValueChange={setKategoriya}>
              <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:border-primary transition-all duration-200">
                <SelectValue placeholder="Kategoriya" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                <SelectItem value="all">Barcha kategoriyalar</SelectItem>
                {kategoriyalar.map((kat) => (
                  <SelectItem key={kat} value={kat}>
                    {kat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={saralash} onValueChange={setSaralash}>
              <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:border-primary transition-all duration-200">
                <SelectValue placeholder="Saralash" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
                <SelectItem value="default">Standart</SelectItem>
                <SelectItem value="price-low">Narx: Arzondan qimmatga</SelectItem>
                <SelectItem value="price-high">Narx: Qimmatdan arzonga</SelectItem>
                <SelectItem value="name">Nomi bo'yicha</SelectItem>
                <SelectItem value="new">Yangi mahsulotlar</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-11 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200 hover:scale-105"
            >
              <X className="h-4 w-4 mr-2" />
              Tozalash
            </Button>
          </div>

          {/* Active filters */}
          {(qidiruv || kategoriya !== "all" || saralash !== "default") && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30">
              {qidiruv && (
                <Badge variant="secondary" className="animate-fade-in">
                  Qidiruv: {qidiruv}
                </Badge>
              )}
              {kategoriya !== "all" && (
                <Badge variant="secondary" className="animate-fade-in">
                  Kategoriya: {kategoriya}
                </Badge>
              )}
              {saralash !== "default" && (
                <Badge variant="secondary" className="animate-fade-in">
                  Saralash: {saralash === "price-low" ? "Arzon" : saralash === "price-high" ? "Qimmat" : saralash}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mahsulotlar ro'yxati */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMahsulotlar.map((mahsulot, index) => (
          <div
            key={mahsulot.id}
            className="animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
          >
            <MahsulotKartasi mahsulot={mahsulot} onLoginRequired={() => setShowLoginModal(true)} />
          </div>
        ))}
      </div>

      {filteredMahsulotlar.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold mb-2">Hech qanday mahsulot topilmadi</h3>
          <p className="text-muted-foreground mb-4">Qidiruv shartlarini o'zgartirib ko'ring</p>
          <Button onClick={clearFilters} variant="outline">
            Barcha mahsulotlarni ko'rish
          </Button>
        </div>
      )}

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  )
}
