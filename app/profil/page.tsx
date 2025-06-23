"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Package, Edit } from "lucide-react"
import { LoginModal } from "@/components/login-modal"

interface Buyurtma {
  id: string
  buyurtma_raqami: string
  mahsulotlar: any[]
  umumiy_narx: number
  holat: string
  sana: string
  mijoz_malumotlari: any
}

export default function ProfilPage() {
  const { user, updateUser } = useAuth()
  const [buyurtmalar, setBuyurtmalar] = useState<Buyurtma[]>([])
  const [tahrirlash, setTahrirlash] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [formData, setFormData] = useState({
    ism: "",
    telefon: "",
    manzil: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        ism: user.ism,
        telefon: user.telefon || "",
        manzil: user.manzil || "",
      })

      // Foydalanuvchi buyurtmalarini yuklash
      const allOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const userOrders = allOrders.filter((order: Buyurtma) => order.foydalanuvchi_id === user.id)
      setBuyurtmalar(userOrders)
    }
  }, [user])

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center">
          <CardContent className="p-8">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Profilni ko'rish uchun kiring</h2>
            <Button onClick={() => setShowLoginModal(true)}>Kirish</Button>
          </CardContent>
        </Card>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </div>
    )
  }

  const handleSave = () => {
    updateUser(formData)
    setTahrirlash(false)
  }

  const formatNarx = (narx: number) => {
    return new Intl.NumberFormat("uz-UZ").format(narx) + " so'm"
  }

  const formatSana = (sana: string) => {
    return new Date(sana).toLocaleDateString("uz-UZ")
  }

  const getHolatColor = (holat: string) => {
    switch (holat) {
      case "Ko'rib chiqilmoqda":
        return "bg-yellow-100 text-yellow-800"
      case "Tasdiqlandi":
        return "bg-blue-100 text-blue-800"
      case "Yetkazilmoqda":
        return "bg-purple-100 text-purple-800"
      case "Yetkazildi":
        return "bg-green-100 text-green-800"
      case "Bekor qilindi":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mening profilim</h1>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profil">Profil ma'lumotlari</TabsTrigger>
          <TabsTrigger value="buyurtmalar">Buyurtmalarim</TabsTrigger>
        </TabsList>

        <TabsContent value="profil">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
              <Button variant="outline" onClick={() => (tahrirlash ? handleSave() : setTahrirlash(true))}>
                <Edit className="h-4 w-4 mr-2" />
                {tahrirlash ? "Saqlash" : "Tahrirlash"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ism">To'liq ism</Label>
                <Input
                  id="ism"
                  value={formData.ism}
                  onChange={(e) => setFormData({ ...formData, ism: e.target.value })}
                  disabled={!tahrirlash}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled className="bg-gray-50" />
                <p className="text-sm text-gray-500 mt-1">Email manzilini o'zgartirib bo'lmaydi</p>
              </div>

              <div>
                <Label htmlFor="telefon">Telefon raqam</Label>
                <Input
                  id="telefon"
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  disabled={!tahrirlash}
                  placeholder="+998 90 123 45 67"
                />
              </div>

              <div>
                <Label htmlFor="manzil">Manzil</Label>
                <Input
                  id="manzil"
                  value={formData.manzil}
                  onChange={(e) => setFormData({ ...formData, manzil: e.target.value })}
                  disabled={!tahrirlash}
                  placeholder="Shahar, ko'cha, uy raqami"
                />
              </div>

              {user.admin && (
                <div className="pt-4 border-t">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Administrator
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buyurtmalar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Buyurtmalarim ({buyurtmalar.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {buyurtmalar.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Hali buyurtma bermagansiz</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {buyurtmalar.map((buyurtma) => (
                    <Card key={buyurtma.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">Buyurtma #{buyurtma.buyurtma_raqami}</h3>
                            <p className="text-sm text-gray-500">{formatSana(buyurtma.sana)}</p>
                          </div>
                          <Badge className={getHolatColor(buyurtma.holat)}>{buyurtma.holat}</Badge>
                        </div>

                        <div className="space-y-2 mb-3">
                          {buyurtma.mahsulotlar.map((mahsulot) => (
                            <div key={mahsulot.id} className="flex justify-between text-sm">
                              <span>
                                {mahsulot.nomi} x{mahsulot.miqdor}
                              </span>
                              <span>{formatNarx(mahsulot.narx * mahsulot.miqdor)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t">
                          <span className="font-semibold">Jami:</span>
                          <span className="font-bold text-blue-600">{formatNarx(buyurtma.umumiy_narx)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
