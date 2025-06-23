"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface SavatchaItem {
  id: number
  nomi: string
  narx: number
  rasm: string
  miqdor: number
}

export default function SavatchaPage() {
  const [savatcha, setSavatcha] = useState<SavatchaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Savatcha ma'lumotlarini yuklash
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setSavatcha(savedCart)
    setLoading(false)
  }, [])

  const savatchaniYangilash = (yangiSavatcha: SavatchaItem[]) => {
    setSavatcha(yangiSavatcha)
    localStorage.setItem("cart", JSON.stringify(yangiSavatcha))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const miqdorOzgartirish = (id: number, yangiMiqdor: number) => {
    if (yangiMiqdor <= 0) {
      mahsulotOchirish(id)
      return
    }

    const yangiSavatcha = savatcha.map((item) => (item.id === id ? { ...item, miqdor: yangiMiqdor } : item))
    savatchaniYangilash(yangiSavatcha)
  }

  const mahsulotOchirish = (id: number) => {
    const yangiSavatcha = savatcha.filter((item) => item.id !== id)
    savatchaniYangilash(yangiSavatcha)
  }

  const savatchaniTozalash = () => {
    savatchaniYangilash([])
  }

  const umumiyNarx = savatcha.reduce((total, item) => total + item.narx * item.miqdor, 0)
  const umumiyMiqdor = savatcha.reduce((total, item) => total + item.miqdor, 0)

  const formatNarx = (narx: number) => {
    return new Intl.NumberFormat("uz-UZ").format(narx) + " so'm"
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Savatcha yuklanmoqda...</div>
      </div>
    )
  }

  if (savatcha.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Savatchangiz bo'sh</h2>
          <p className="text-gray-500 mb-6">Mahsulotlarni ko'rish va xarid qilish uchun katalogga o'ting</p>
          <Link href="/mahsulotlar">
            <Button size="lg">Mahsulotlarni ko'rish</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Savatcha</h1>
        <Button variant="outline" onClick={savatchaniTozalash}>
          <Trash2 className="h-4 w-4 mr-2" />
          Hammasini o'chirish
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Savatcha elementlari */}
        <div className="lg:col-span-2 space-y-4">
          {savatcha.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.rasm || "/placeholder.svg"}
                    alt={item.nomi}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.nomi}</h3>
                    <p className="text-blue-600 font-semibold">{formatNarx(item.narx)}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => miqdorOzgartirish(item.id, item.miqdor - 1)}>
                      <Minus className="h-4 w-4" />
                    </Button>

                    <Input
                      type="number"
                      value={item.miqdor}
                      onChange={(e) => miqdorOzgartirish(item.id, Number.parseInt(e.target.value) || 0)}
                      className="w-16 text-center"
                      min="1"
                    />

                    <Button variant="outline" size="icon" onClick={() => miqdorOzgartirish(item.id, item.miqdor + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-lg">{formatNarx(item.narx * item.miqdor)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => mahsulotOchirish(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Buyurtma xulosasi */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Buyurtma xulosasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Mahsulotlar soni:</span>
                <span className="font-semibold">{umumiyMiqdor} dona</span>
              </div>

              <div className="flex justify-between">
                <span>Mahsulotlar narxi:</span>
                <span className="font-semibold">{formatNarx(umumiyNarx)}</span>
              </div>

              <div className="flex justify-between">
                <span>Yetkazib berish:</span>
                <span className="font-semibold text-green-600">Bepul</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold">
                <span>Jami:</span>
                <span className="text-blue-600">{formatNarx(umumiyNarx)}</span>
              </div>

              <Link href="/buyurtma" className="block">
                <Button className="w-full" size="lg">
                  Buyurtma berish
                </Button>
              </Link>

              <Link href="/mahsulotlar" className="block">
                <Button variant="outline" className="w-full">
                  Xaridni davom ettirish
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
