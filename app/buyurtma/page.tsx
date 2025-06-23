"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SavatchaItem {
  id: number
  nomi: string
  narx: number
  rasm: string
  miqdor: number
}

export default function BuyurtmaPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [savatcha, setSavatcha] = useState<SavatchaItem[]>([])
  const [buyurtmaBerish, setBuyurtmaBerish] = useState(false)
  const [buyurtmaBerild, setBuyurtmaBerild] = useState(false)
  const [formData, setFormData] = useState({
    ism: user?.ism || "",
    telefon: user?.telefon || "",
    email: user?.email || "",
    manzil: user?.manzil || "",
    shahar: "",
    pochta_kodi: "",
    izoh: "",
    tolov_turi: "naqd",
  })

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setSavatcha(savedCart)

    if (savedCart.length === 0) {
      router.push("/savatcha")
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBuyurtmaBerish(true)

    // Buyurtma ma'lumotlarini tayyorlash
    const buyurtma = {
      id: Date.now().toString(),
      foydalanuvchi_id: user?.id || "guest",
      mahsulotlar: savatcha,
      umumiy_narx: savatcha.reduce((total, item) => total + item.narx * item.miqdor, 0),
      mijoz_malumotlari: formData,
      holat: "Ko'rib chiqilmoqda",
      sana: new Date().toISOString(),
      buyurtma_raqami: "ORD-" + Date.now(),
    }

    // Buyurtmalarni localStorage ga saqlash
    const buyurtmalar = JSON.parse(localStorage.getItem("orders") || "[]")
    buyurtmalar.push(buyurtma)
    localStorage.setItem("orders", JSON.stringify(buyurtmalar))

    // Savatchani tozalash
    localStorage.removeItem("cart")
    window.dispatchEvent(new Event("cartUpdated"))

    // Simulyatsiya uchun kutish
    setTimeout(() => {
      setBuyurtmaBerish(false)
      setBuyurtmaBerild(true)
    }, 2000)
  }

  const umumiyNarx = savatcha.reduce((total, item) => total + item.narx * item.miqdor, 0)

  const formatNarx = (narx: number) => {
    return new Intl.NumberFormat("uz-UZ").format(narx) + " so'm"
  }

  if (savatcha.length === 0 && !buyurtmaBerild) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Savatchangiz bo'sh</h2>
          <Link href="/mahsulotlar">
            <Button size="lg">Mahsulotlarni ko'rish</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (buyurtmaBerild) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-4">Buyurtma muvaffaqiyatli berildi!</h2>
            <p className="text-gray-600 mb-6">
              Sizning buyurtmangiz qabul qilindi va tez orada ko'rib chiqiladi. Buyurtma holati haqida telefon orqali
              xabar beramiz.
            </p>
            <div className="space-y-3">
              <Link href="/profil">
                <Button className="w-full">Buyurtmalarimni ko'rish</Button>
              </Link>
              <Link href="/mahsulotlar">
                <Button variant="outline" className="w-full">
                  Xaridni davom ettirish
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Buyurtma berish</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Buyurtma formasi */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Yetkazib berish ma'lumotlari</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ism">To'liq ism *</Label>
                    <Input
                      id="ism"
                      value={formData.ism}
                      onChange={(e) => handleInputChange("ism", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefon">Telefon raqam *</Label>
                    <Input
                      id="telefon"
                      value={formData.telefon}
                      onChange={(e) => handleInputChange("telefon", e.target.value)}
                      placeholder="+998 90 123 45 67"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="manzil">To'liq manzil *</Label>
                  <Textarea
                    id="manzil"
                    value={formData.manzil}
                    onChange={(e) => handleInputChange("manzil", e.target.value)}
                    placeholder="Ko'cha, uy raqami, kvartira..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shahar">Shahar *</Label>
                    <Select value={formData.shahar} onValueChange={(value) => handleInputChange("shahar", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Shaharni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="toshkent">Toshkent</SelectItem>
                        <SelectItem value="samarqand">Samarqand</SelectItem>
                        <SelectItem value="buxoro">Buxoro</SelectItem>
                        <SelectItem value="andijon">Andijon</SelectItem>
                        <SelectItem value="namangan">Namangan</SelectItem>
                        <SelectItem value="fargona">Farg'ona</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pochta_kodi">Pochta kodi</Label>
                    <Input
                      id="pochta_kodi"
                      value={formData.pochta_kodi}
                      onChange={(e) => handleInputChange("pochta_kodi", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tolov_turi">To'lov turi *</Label>
                  <Select value={formData.tolov_turi} onValueChange={(value) => handleInputChange("tolov_turi", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="naqd">Naqd pul (yetkazib berganda)</SelectItem>
                      <SelectItem value="karta">Bank kartasi</SelectItem>
                      <SelectItem value="click">Click</SelectItem>
                      <SelectItem value="payme">Payme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="izoh">Qo'shimcha izoh</Label>
                  <Textarea
                    id="izoh"
                    value={formData.izoh}
                    onChange={(e) => handleInputChange("izoh", e.target.value)}
                    placeholder="Buyurtma haqida qo'shimcha ma'lumot..."
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={buyurtmaBerish}>
                  {buyurtmaBerish ? "Buyurtma berilmoqda..." : "Buyurtma berish"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Buyurtma xulosasi */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Buyurtma xulosasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {savatcha.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.nomi}</p>
                      <p className="text-xs text-gray-500">
                        {item.miqdor} x {formatNarx(item.narx)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatNarx(item.narx * item.miqdor)}</p>
                  </div>
                ))}
              </div>

              <hr />

              <div className="flex justify-between">
                <span>Mahsulotlar:</span>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
