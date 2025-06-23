"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye, Heart, Sparkles, UserPlus } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "./auth-provider"

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

interface MahsulotKartasiProps {
  mahsulot: Mahsulot
  onLoginRequired?: () => void
}

export function MahsulotKartasi({ mahsulot, onLoginRequired }: MahsulotKartasiProps) {
  const { user } = useAuth()
  const [qoshilmoqda, setQoshilmoqda] = useState(false)
  const [kategoriyaChegirma, setKategoriyaChegirma] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    // Faqat login qilgan userlar uchun chegirma
    if (user) {
      fetch("/categories.json")
        .then((res) => res.json())
        .then((data) => {
          const kategoriya = data.find((k: any) => k.nomi === mahsulot.kategoriya)
          if (kategoriya) {
            setKategoriyaChegirma(kategoriya.chegirma)
          }
        })
        .catch(() => setKategoriyaChegirma(0))
    } else {
      setKategoriyaChegirma(0)
    }
  }, [user, mahsulot.kategoriya])

  const savatchagaQoshish = () => {
    // Agar user login qilmagan bo'lsa, login modal ochish
    if (!user) {
      onLoginRequired?.()
      return
    }

    setQoshilmoqda(true)

    const savatcha = JSON.parse(localStorage.getItem("cart") || "[]")
    const mavjudIndex = savatcha.findIndex((item: any) => item.id === mahsulot.id)

    const chegirmalanganNarx =
      user && kategoriyaChegirma > 0 ? mahsulot.narx * (1 - kategoriyaChegirma / 100) : mahsulot.narx

    if (mavjudIndex !== -1) {
      savatcha[mavjudIndex].miqdor += 1
    } else {
      savatcha.push({
        id: mahsulot.id,
        nomi: mahsulot.nomi,
        narx: chegirmalanganNarx,
        aslNarx: mahsulot.narx,
        rasm: mahsulot.rasm,
        miqdor: 1,
        chegirma: user ? kategoriyaChegirma : 0,
      })
    }

    localStorage.setItem("cart", JSON.stringify(savatcha))
    window.dispatchEvent(new Event("cartUpdated"))

    setTimeout(() => setQoshilmoqda(false), 1000)
  }

  const formatNarx = (narx: number) => {
    return new Intl.NumberFormat("uz-UZ").format(narx) + " so'm"
  }

  const chegirmalanganNarx =
    user && kategoriyaChegirma > 0 ? mahsulot.narx * (1 - kategoriyaChegirma / 100) : mahsulot.narx

  const tejashSummasi = user && kategoriyaChegirma > 0 ? mahsulot.narx - chegirmalanganNarx : 0

  return (
    <Card className="h-full flex flex-col hover-lift glass-effect group overflow-hidden">
      <CardHeader className="p-0 relative overflow-hidden">
        <div className="relative">
          <Image
            src={mahsulot.rasm || "/placeholder.svg"}
            alt={mahsulot.nomi}
            width={300}
            height={300}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2">
            {mahsulot.yangi && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                Yangi
              </Badge>
            )}
            {user && kategoriyaChegirma > 0 && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-bounce">
                -{kategoriyaChegirma}% OFF
              </Badge>
            )}
            {!user && (
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                <UserPlus className="h-3 w-3 mr-1" />
                Chegirma uchun kiring
              </Badge>
            )}
          </div>

          {mahsulot.zaxira < 5 && (
            <Badge variant="destructive" className="absolute top-3 right-3 animate-pulse shadow-lg">
              Kam qoldi
            </Badge>
          )}

          {/* Hover Actions */}
          <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <Button
              size="sm"
              variant="secondary"
              className="h-9 w-9 p-0 bg-white/90 hover:bg-white shadow-lg hover:scale-110 transition-all duration-200"
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-9 w-9 p-0 bg-white/90 hover:bg-white shadow-lg hover:scale-110 transition-all duration-200"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs bg-background/50">
            {mahsulot.kategoriya}
          </Badge>
          {mahsulot.zaxira > 0 && <span className="text-xs text-muted-foreground">{mahsulot.zaxira} dona</span>}
        </div>

        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {mahsulot.nomi}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{mahsulot.tavsif}</p>

        <div className="space-y-2">
          {user && kategoriyaChegirma > 0 ? (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">{formatNarx(chegirmalanganNarx)}</span>
                <span className="text-sm text-muted-foreground line-through">{formatNarx(mahsulot.narx)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {formatNarx(tejashSummasi)} tejaysiz!
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{formatNarx(mahsulot.narx)}</div>
              {!user && (
                <div className="flex items-center space-x-1">
                  <UserPlus className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Kiring va chegirma oling!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={savatchagaQoshish}
          disabled={qoshilmoqda || mahsulot.zaxira === 0}
          className="w-full hover:scale-105 transition-all duration-200 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
        >
          {!user ? (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Kiring va xarid qiling
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {qoshilmoqda ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Qo'shilmoqda...
                </span>
              ) : mahsulot.zaxira === 0 ? (
                "Tugagan"
              ) : (
                "Savatchaga"
              )}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
