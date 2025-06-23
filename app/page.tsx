"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Truck, Shield, Headphones, Star, TrendingUp, Users, Award } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Kategoriya {
  id: number
  nomi: string
  tavsif: string
  icon: string
  rang: string
  faol: boolean
  chegirma: number
}

export default function HomePage() {
  const { user } = useAuth()
  const [kategoriyalar, setKategoriyalar] = useState<Kategoriya[]>([])

  useEffect(() => {
    fetch("/categories.json")
      .then((res) => res.json())
      .then((data) => setKategoriyalar(data.filter((k: Kategoriya) => k.faol)))
      .catch((error) => console.error("Kategoriyalarni yuklashda xatolik:", error))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Texnologiya Dunyosi
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-foreground/80 max-w-3xl mx-auto animate-slide-up">
              Eng so'nggi smartfonlar, noutbuklar va texnologiya mahsulotlari
              {user && <span className="text-primary font-semibold"> - Maxsus chegirmalar bilan!</span>}
            </p>
            <div className="space-x-4 animate-bounce-in">
              <Link href="/mahsulotlar">
                <Button size="lg" className="hover:scale-105 transition-transform duration-200 shadow-lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Xarid qilish
                </Button>
              </Link>
              <Link href="/kategoriyalar">
                <Button
                  size="lg"
                  variant="outline"
                  className="hover:scale-105 transition-transform duration-200 glass-effect"
                >
                  Kategoriyalar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "Mijozlar", value: "10,000+", color: "text-blue-500" },
              { icon: ShoppingBag, label: "Mahsulotlar", value: "500+", color: "text-green-500" },
              { icon: Award, label: "Brendlar", value: "50+", color: "text-purple-500" },
              { icon: TrendingUp, label: "Mamnunlik", value: "99%", color: "text-orange-500" },
            ].map((stat, index) => (
              <Card
                key={index}
                className="text-center hover-lift glass-effect animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mashhur kategoriyalar</h2>
            <p className="text-xl text-muted-foreground">Eng yaxshi mahsulotlarni toping</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kategoriyalar.map((kategoriya, index) => (
              <Link key={kategoriya.id} href={`/mahsulotlar?kategoriya=${kategoriya.nomi}`}>
                <Card
                  className="hover-lift glass-effect cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${kategoriya.rang} text-white text-2xl`}
                    >
                      {kategoriya.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{kategoriya.nomi}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{kategoriya.tavsif}</p>
                    {user && kategoriya.chegirma > 0 && (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse">
                        -{kategoriya.chegirma}% chegirma
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
            Nima uchun bizni tanlaysiz?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShoppingBag,
                title: "Keng tanlov",
                description: "Eng so'nggi va sifatli texnologiya mahsulotlari",
                color: "text-blue-500",
              },
              {
                icon: Truck,
                title: "Tez yetkazib berish",
                description: "Toshkent bo'ylab 1-2 kun ichida yetkazib berish",
                color: "text-green-500",
              },
              {
                icon: Shield,
                title: "Kafolat",
                description: "Barcha mahsulotlarga rasmiy kafolat",
                color: "text-purple-500",
              },
              {
                icon: Headphones,
                title: "24/7 qo'llab-quvvatlash",
                description: "Har qanday savolingiz bo'yicha yordam",
                color: "text-orange-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center hover-lift glass-effect animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers for Logged Users */}
      {user && (
        <section className="py-16 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-bounce-in">
              <h2 className="text-3xl font-bold mb-4">Salom, {user.ism}! 👋</h2>
              <p className="text-xl mb-6 text-muted-foreground">Sizga maxsus chegirmalar va takliflar tayyorladik</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/chegirmalar">
                  <Button size="lg" className="hover:scale-105 transition-transform duration-200">
                    <Star className="mr-2 h-5 w-5" />
                    Chegirmalarni ko'rish
                  </Button>
                </Link>
                <Link href="/profil">
                  <Button size="lg" variant="outline" className="hover:scale-105 transition-transform duration-200">
                    Profilim
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hoziroq xarid qiling!</h2>
            <p className="text-xl mb-8 opacity-90">
              Eng yaxshi narxlarda sifatli mahsulotlar
              {!user && " - Ro'yxatdan o'ting va chegirmalardan foydalaning!"}
            </p>
            <div className="space-x-4">
              <Link href="/mahsulotlar">
                <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform duration-200">
                  Xarid qilishni boshlash
                </Button>
              </Link>
              {!user && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 hover:scale-105 transition-all duration-200"
                >
                  Ro'yxatdan o'tish
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
