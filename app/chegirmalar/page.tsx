"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gift, Star, Clock, Users } from "lucide-react"
import Link from "next/link"

interface Kategoriya {
  id: number
  nomi: string
  tavsif: string
  icon: string
  rang: string
  faol: boolean
  chegirma: number
}

export default function ChegirmalarPage() {
  const { user } = useAuth()
  const [kategoriyalar, setKategoriyalar] = useState<Kategoriya[]>([])

  useEffect(() => {
    fetch("/categories.json")
      .then((res) => res.json())
      .then((data) => setKategoriyalar(data.filter((k: Kategoriya) => k.faol && k.chegirma > 0)))
      .catch((error) => console.error("Kategoriyalarni yuklashda xatolik:", error))
  }, [])

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center glass-effect">
          <CardContent className="p-8">
            <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Chegirmalarga kirish uchun ro'yxatdan o'ting</h2>
            <p className="text-muted-foreground mb-6">
              Ro'yxatdan o'tgan foydalanuvchilar uchun maxsus chegirmalar va takliflar
            </p>
            <Button size="lg">Ro'yxatdan o'tish</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Maxsus chegirmalar
        </h1>
        <p className="text-xl text-muted-foreground">Salom, {user.ism}! Sizga maxsus chegirmalar tayyorladik</p>
      </div>

      {/* Special Offers */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="glass-effect hover-lift animate-scale-in">
          <CardContent className="p-6 text-center">
            <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">VIP mijoz</h3>
            <p className="text-muted-foreground text-sm mb-4">Barcha mahsulotlarga qo'shimcha 5% chegirma</p>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">Faol</Badge>
          </CardContent>
        </Card>

        <Card className="glass-effect hover-lift animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Tezkor yetkazish</h3>
            <p className="text-muted-foreground text-sm mb-4">Bepul tezkor yetkazish xizmati</p>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">Bepul</Badge>
          </CardContent>
        </Card>

        <Card className="glass-effect hover-lift animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Do'stlarni taklif qiling</h3>
            <p className="text-muted-foreground text-sm mb-4">Har bir taklif uchun 10% bonus</p>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">10% bonus</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Category Discounts */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 animate-fade-in">Kategoriya bo'yicha chegirmalar</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kategoriyalar.map((kategoriya, index) => (
            <Card
              key={kategoriya.id}
              className="glass-effect hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${kategoriya.rang} text-white text-xl`}
                  >
                    {kategoriya.icon}
                  </div>
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 animate-pulse">
                    -{kategoriya.chegirma}%
                  </Badge>
                </div>
                <CardTitle className="text-lg">{kategoriya.nomi}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{kategoriya.tavsif}</p>
                <Link href={`/mahsulotlar?kategoriya=${kategoriya.nomi}`}>
                  <Button className="w-full hover:scale-105 transition-transform duration-200">Ko'rish</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How it works */}
      <Card className="glass-effect animate-fade-in">
        <CardHeader>
          <CardTitle className="text-center">Chegirmalar qanday ishlaydi?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="h-12 w-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Mahsulot tanlang</h3>
              <p className="text-muted-foreground text-sm">Chegirmali kategoriyalardan mahsulot tanlang</p>
            </div>
            <div>
              <div className="h-12 w-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Avtomatik chegirma</h3>
              <p className="text-muted-foreground text-sm">Chegirma avtomatik qo'llaniladi</p>
            </div>
            <div>
              <div className="h-12 w-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Tejang!</h3>
              <p className="text-muted-foreground text-sm">Arzon narxda sifatli mahsulot oling</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
