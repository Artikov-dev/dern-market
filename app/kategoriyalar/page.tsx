"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Mahsulot {
  id: number
  nomi: string
  kategoriya: string
}

export default function KategoriyalarPage() {
  const [mahsulotlar, setMahsulotlar] = useState<Mahsulot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    fetch("/api/products")
      .then(async (res) => {
        if (!res.ok) {
          // 4xx / 5xx – surface the status code
          throw new Error(`HTTP ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setMahsulotlar(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Mahsulotlarni yuklashda xatolik:", err)
        setMahsulotlar([]) // keep state consistent
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Kategoriyalar yuklanmoqda...</div>
      </div>
    )
  }

  if (!loading && mahsulotlar.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-6xl">🚫</div>
        <h2 className="text-2xl font-semibold">Maʼlumotlarni yuklab boʻlmadi</h2>
        <p className="text-muted-foreground">Iltimos keyinroq qayta urining yoki administrator bilan bogʻlaning.</p>
      </div>
    )
  }

  // Kategoriyalar bo'yicha mahsulotlarni guruhlash
  const kategoriyalar = mahsulotlar.reduce(
    (acc, mahsulot) => {
      if (!acc[mahsulot.kategoriya]) {
        acc[mahsulot.kategoriya] = []
      }
      acc[mahsulot.kategoriya].push(mahsulot)
      return acc
    },
    {} as Record<string, Mahsulot[]>,
  )

  const kategoriyaIkonlari: Record<string, string> = {
    Smartfonlar: "📱",
    Noutbuklar: "💻",
    Planshetlar: "📱",
    Audio: "🎧",
    Monitorlar: "🖥️",
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Kategoriyalar</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(kategoriyalar).map(([kategoriya, mahsulotlarRoyxati]) => (
          <Link key={kategoriya} href={`/mahsulotlar?kategoriya=${kategoriya}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">{kategoriyaIkonlari[kategoriya] || "📦"}</div>
                <CardTitle className="text-xl">{kategoriya}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="secondary" className="mb-4">
                  {mahsulotlarRoyxati.length} mahsulot
                </Badge>
                <div className="space-y-1">
                  {mahsulotlarRoyxati.slice(0, 3).map((mahsulot) => (
                    <p key={mahsulot.id} className="text-sm text-gray-600 truncate">
                      {mahsulot.nomi}
                    </p>
                  ))}
                  {mahsulotlarRoyxati.length > 3 && (
                    <p className="text-sm text-gray-500">
                      va yana {mahsulotlarRoyxati.length - 3} ta mahsulot mavjud...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
