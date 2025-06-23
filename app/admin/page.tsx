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
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Edit,
  Trash2,
  ShoppingCart,
  Users,
  Eye,
  Mail,
  Phone,
  X,
  CheckCircle,
  Clock,
  Truck,
  Package,
  Grid3X3,
} from "lucide-react"

interface User {
  id: string
  ism: string
  email: string
  telefon?: string
  manzil?: string
  admin: boolean
  parol?: string
}

interface Buyurtma {
  id: string
  buyurtma_raqami: string
  foydalanuvchi_id: string
  mahsulotlar: any[]
  umumiy_narx: number
  holat: string
  sana: string
  mijoz_malumotlari: any
}

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

interface Kategoriya {
  id: number
  nomi: string
  tavsif: string
  icon: string
  rang: string
  faol: boolean
  chegirma: number
}

export default function AdminPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [buyurtmalar, setBuyurtmalar] = useState<Buyurtma[]>([])
  const [mahsulotlar, setMahsulotlar] = useState<Mahsulot[]>([])
  const [kategoriyalar, setKategoriyalar] = useState<Kategoriya[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Buyurtma | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  // Form states
  const [tahrirlashUser, setTahrirlashUser] = useState<User | null>(null)
  const [yangiUser, setYangiUser] = useState(false)
  const [tahrirlashMahsulot, setTahrirlashMahsulot] = useState<Mahsulot | null>(null)
  const [yangiMahsulot, setYangiMahsulot] = useState(false)
  const [tahrirlashKategoriya, setTahrirlashKategoriya] = useState<Kategoriya | null>(null)
  const [yangiKategoriya, setYangiKategoriya] = useState(false)

  const [userFormData, setUserFormData] = useState({
    ism: "",
    email: "",
    telefon: "",
    manzil: "",
    parol: "",
    admin: false,
  })

  const [mahsulotFormData, setMahsulotFormData] = useState({
    nomi: "",
    tavsif: "",
    narx: 0,
    rasm: "",
    kategoriya: "",
    zaxira: 0,
    yangi: false,
  })

  const [kategoriyaFormData, setKategoriyaFormData] = useState({
    nomi: "",
    tavsif: "",
    icon: "",
    rang: "bg-blue-500",
    faol: true,
    chegirma: 0,
  })

  useEffect(() => {
    // Ma'lumotlarni yuklash
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(savedUsers)

    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    setBuyurtmalar(orders)

    // Mahsulotlarni API dan yuklash
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setMahsulotlar(data))
      .catch((err) => console.error("Mahsulotlar yuklanmadi:", err))

    // Kategoriyalarni yuklash
    fetch("/categories.json")
      .then((res) => res.json())
      .then((data) => setKategoriyalar(data))
      .catch((err) => console.error("Kategoriyalar yuklanmadi:", err))
  }, [])

  // Admin huquqini tekshirish
  if (!user || !user.admin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center glass-effect">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-semibold text-destructive mb-4">Ruxsat berilmagan</h2>
            <p className="text-muted-foreground">Bu sahifaga faqat administratorlar kira oladi</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User CRUD functions
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const userData = {
      id: tahrirlashUser ? tahrirlashUser.id : Date.now().toString(),
      ism: userFormData.ism,
      email: userFormData.email,
      telefon: userFormData.telefon,
      manzil: userFormData.manzil,
      admin: userFormData.admin,
      parol: userFormData.parol || "user123",
    }

    let yangiUsers
    if (tahrirlashUser) {
      yangiUsers = users.map((u) => (u.id === tahrirlashUser.id ? userData : u))
    } else {
      yangiUsers = [...users, userData]
    }

    setUsers(yangiUsers)
    localStorage.setItem("users", JSON.stringify(yangiUsers))

    // Form reset
    setUserFormData({
      ism: "",
      email: "",
      telefon: "",
      manzil: "",
      parol: "",
      admin: false,
    })
    setTahrirlashUser(null)
    setYangiUser(false)
  }

  // Mahsulot CRUD functions
  const handleMahsulotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mahsulotData = {
      id: tahrirlashMahsulot ? tahrirlashMahsulot.id : Date.now(),
      nomi: mahsulotFormData.nomi,
      tavsif: mahsulotFormData.tavsif,
      narx: Number(mahsulotFormData.narx),
      rasm: mahsulotFormData.rasm || "/placeholder.svg?height=300&width=300",
      kategoriya: mahsulotFormData.kategoriya,
      zaxira: Number(mahsulotFormData.zaxira),
      yangi: mahsulotFormData.yangi,
    }

    let yangiMahsulotlar
    if (tahrirlashMahsulot) {
      yangiMahsulotlar = mahsulotlar.map((m) => (m.id === tahrirlashMahsulot.id ? mahsulotData : m))
    } else {
      yangiMahsulotlar = [...mahsulotlar, mahsulotData]
    }

    setMahsulotlar(yangiMahsulotlar)
    // localStorage ga saqlash (real loyihada API ga yuboriladi)
    localStorage.setItem("admin_products", JSON.stringify(yangiMahsulotlar))

    // Form reset
    setMahsulotFormData({
      nomi: "",
      tavsif: "",
      narx: 0,
      rasm: "",
      kategoriya: "",
      zaxira: 0,
      yangi: false,
    })
    setTahrirlashMahsulot(null)
    setYangiMahsulot(false)
  }

  // Kategoriya CRUD functions
  const handleKategoriyaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const kategoriyaData = {
      id: tahrirlashKategoriya ? tahrirlashKategoriya.id : Date.now(),
      nomi: kategoriyaFormData.nomi,
      tavsif: kategoriyaFormData.tavsif,
      icon: kategoriyaFormData.icon,
      rang: kategoriyaFormData.rang,
      faol: kategoriyaFormData.faol,
      chegirma: Number(kategoriyaFormData.chegirma),
    }

    let yangiKategoriyalar
    if (tahrirlashKategoriya) {
      yangiKategoriyalar = kategoriyalar.map((k) => (k.id === tahrirlashKategoriya.id ? kategoriyaData : k))
    } else {
      yangiKategoriyalar = [...kategoriyalar, kategoriyaData]
    }

    setKategoriyalar(yangiKategoriyalar)
    // localStorage ga saqlash (real loyihada API ga yuboriladi)
    localStorage.setItem("admin_categories", JSON.stringify(yangiKategoriyalar))

    // Form reset
    setKategoriyaFormData({
      nomi: "",
      tavsif: "",
      icon: "",
      rang: "bg-blue-500",
      faol: true,
      chegirma: 0,
    })
    setTahrirlashKategoriya(null)
    setYangiKategoriya(false)
  }

  const userniTahrirlash = (user: User) => {
    setTahrirlashUser(user)
    setUserFormData({
      ism: user.ism,
      email: user.email,
      telefon: user.telefon || "",
      manzil: user.manzil || "",
      parol: "",
      admin: user.admin,
    })
    setYangiUser(true)
  }

  const mahsulotniTahrirlash = (mahsulot: Mahsulot) => {
    setTahrirlashMahsulot(mahsulot)
    setMahsulotFormData({
      nomi: mahsulot.nomi,
      tavsif: mahsulot.tavsif,
      narx: mahsulot.narx,
      rasm: mahsulot.rasm,
      kategoriya: mahsulot.kategoriya,
      zaxira: mahsulot.zaxira,
      yangi: mahsulot.yangi,
    })
    setYangiMahsulot(true)
  }

  const kategoriyaniTahrirlash = (kategoriya: Kategoriya) => {
    setTahrirlashKategoriya(kategoriya)
    setKategoriyaFormData({
      nomi: kategoriya.nomi,
      tavsif: kategoriya.tavsif,
      icon: kategoriya.icon,
      rang: kategoriya.rang,
      faol: kategoriya.faol,
      chegirma: kategoriya.chegirma,
    })
    setYangiKategoriya(true)
  }

  const userniOchirish = (id: string) => {
    if (confirm("Rostdan ham bu foydalanuvchini o'chirmoqchimisiz?")) {
      const yangiUsers = users.filter((u) => u.id !== id)
      setUsers(yangiUsers)
      localStorage.setItem("users", JSON.stringify(yangiUsers))
    }
  }

  const mahsulotniOchirish = (id: number) => {
    if (confirm("Rostdan ham bu mahsulotni o'chirmoqchimisiz?")) {
      const yangiMahsulotlar = mahsulotlar.filter((m) => m.id !== id)
      setMahsulotlar(yangiMahsulotlar)
      localStorage.setItem("admin_products", JSON.stringify(yangiMahsulotlar))
    }
  }

  const kategoriyaniOchirish = (id: number) => {
    if (confirm("Rostdan ham bu kategoriyani o'chirmoqchimisiz?")) {
      const yangiKategoriyalar = kategoriyalar.filter((k) => k.id !== id)
      setKategoriyalar(yangiKategoriyalar)
      localStorage.setItem("admin_categories", JSON.stringify(yangiKategoriyalar))
    }
  }

  const userTafsilotlari = (user: User) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  const buyurtmaTafsilotlari = (buyurtma: Buyurtma) => {
    setSelectedOrder(buyurtma)
    setShowOrderDetails(true)
  }

  const buyurtmaHolatiniOzgartirish = (buyurtmaId: string, yangiHolat: string) => {
    const yangiBuyurtmalar = buyurtmalar.map((b) => (b.id === buyurtmaId ? { ...b, holat: yangiHolat } : b))
    setBuyurtmalar(yangiBuyurtmalar)
    localStorage.setItem("orders", JSON.stringify(yangiBuyurtmalar))
  }

  const formatNarx = (narx: number) => {
    return new Intl.NumberFormat("uz-UZ").format(narx) + " so'm"
  }

  const formatSana = (sana: string) => {
    return new Date(sana).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getHolatColor = (holat: string) => {
    switch (holat) {
      case "Ko'rib chiqilmoqda":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Tasdiqlandi":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Yetkazilmoqda":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Yetkazildi":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Bekor qilindi":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getHolatIcon = (holat: string) => {
    switch (holat) {
      case "Ko'rib chiqilmoqda":
        return <Clock className="h-4 w-4" />
      case "Tasdiqlandi":
        return <CheckCircle className="h-4 w-4" />
      case "Yetkazilmoqda":
        return <Truck className="h-4 w-4" />
      case "Yetkazildi":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Statistika
  const yangiBuyurtmalar = buyurtmalar.filter((b) => b.holat === "Ko'rib chiqilmoqda").length
  const umumiyDaromad = buyurtmalar
    .filter((b) => b.holat === "Yetkazildi")
    .reduce((total, b) => total + b.umumiy_narx, 0)

  const kategoriyaNomlari = [...new Set(kategoriyalar.map((k) => k.nomi))]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <p className="text-muted-foreground">To'liq boshqaruv paneli</p>
      </div>

      {/* Qisqa statistika */}
      <div className="grid md:grid-cols-5 gap-6 mb-8">
        <Card className="glass-effect hover-lift animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Foydalanuvchilar</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect hover-lift animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Mahsulotlar</p>
                <p className="text-2xl font-bold">{mahsulotlar.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect hover-lift animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Grid3X3 className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Kategoriyalar</p>
                <p className="text-2xl font-bold">{kategoriyalar.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect hover-lift animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Buyurtmalar</p>
                <p className="text-2xl font-bold">{buyurtmalar.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect hover-lift animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Daromad</p>
                <p className="text-lg font-bold">{formatNarx(umumiyDaromad)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mahsulotlar" className="space-y-6">
        <TabsList className="glass-effect">
          <TabsTrigger value="mahsulotlar">Mahsulotlar</TabsTrigger>
          <TabsTrigger value="kategoriyalar">Kategoriyalar</TabsTrigger>
          <TabsTrigger value="buyurtmalar">Buyurtmalar</TabsTrigger>
          <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
        </TabsList>

        {/* Mahsulotlar Tab */}
        <TabsContent value="mahsulotlar">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Mahsulotlar boshqaruvi</h2>
              <Button
                onClick={() => setYangiMahsulot(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yangi mahsulot
              </Button>
            </div>

            {/* Mahsulot Form */}
            {yangiMahsulot && (
              <Card className="glass-effect animate-slide-up">
                <CardHeader>
                  <CardTitle>{tahrirlashMahsulot ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMahsulotSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mahsulot-nomi">Mahsulot nomi *</Label>
                        <Input
                          id="mahsulot-nomi"
                          value={mahsulotFormData.nomi}
                          onChange={(e) => setMahsulotFormData({ ...mahsulotFormData, nomi: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="mahsulot-kategoriya">Kategoriya *</Label>
                        <Select
                          value={mahsulotFormData.kategoriya}
                          onValueChange={(value) => setMahsulotFormData({ ...mahsulotFormData, kategoriya: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Kategoriyani tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {kategoriyaNomlari.map((nom) => (
                              <SelectItem key={nom} value={nom}>
                                {nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="mahsulot-tavsif">Tavsif *</Label>
                      <Textarea
                        id="mahsulot-tavsif"
                        value={mahsulotFormData.tavsif}
                        onChange={(e) => setMahsulotFormData({ ...mahsulotFormData, tavsif: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="mahsulot-narx">Narx (so'm) *</Label>
                        <Input
                          id="mahsulot-narx"
                          type="number"
                          value={mahsulotFormData.narx}
                          onChange={(e) => setMahsulotFormData({ ...mahsulotFormData, narx: Number(e.target.value) })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="mahsulot-zaxira">Zaxira *</Label>
                        <Input
                          id="mahsulot-zaxira"
                          type="number"
                          value={mahsulotFormData.zaxira}
                          onChange={(e) => setMahsulotFormData({ ...mahsulotFormData, zaxira: Number(e.target.value) })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="mahsulot-rasm">Rasm URL</Label>
                        <Input
                          id="mahsulot-rasm"
                          value={mahsulotFormData.rasm}
                          onChange={(e) => setMahsulotFormData({ ...mahsulotFormData, rasm: e.target.value })}
                          placeholder="/placeholder.svg?height=300&width=300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="mahsulot-yangi"
                        checked={mahsulotFormData.yangi}
                        onChange={(e) => setMahsulotFormData({ ...mahsulotFormData, yangi: e.target.checked })}
                      />
                      <Label htmlFor="mahsulot-yangi">Yangi mahsulot</Label>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" className="hover:scale-105 transition-transform duration-200">
                        {tahrirlashMahsulot ? "Yangilash" : "Qo'shish"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setYangiMahsulot(false)
                          setTahrirlashMahsulot(null)
                          setMahsulotFormData({
                            nomi: "",
                            tavsif: "",
                            narx: 0,
                            rasm: "",
                            kategoriya: "",
                            zaxira: 0,
                            yangi: false,
                          })
                        }}
                      >
                        Bekor qilish
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Mahsulotlar Table */}
            <Card className="glass-effect">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nomi</TableHead>
                      <TableHead>Kategoriya</TableHead>
                      <TableHead>Narx</TableHead>
                      <TableHead>Zaxira</TableHead>
                      <TableHead>Holat</TableHead>
                      <TableHead>Amallar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mahsulotlar.map((mahsulot) => (
                      <TableRow key={mahsulot.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{mahsulot.nomi}</TableCell>
                        <TableCell>{mahsulot.kategoriya}</TableCell>
                        <TableCell>{formatNarx(mahsulot.narx)}</TableCell>
                        <TableCell>{mahsulot.zaxira}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {mahsulot.yangi && <Badge variant="secondary">Yangi</Badge>}
                            {mahsulot.zaxira < 5 && <Badge variant="destructive">Kam</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => mahsulotniTahrirlash(mahsulot)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => mahsulotniOchirish(mahsulot.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Kategoriyalar Tab */}
        <TabsContent value="kategoriyalar">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Kategoriyalar boshqaruvi</h2>
              <Button
                onClick={() => setYangiKategoriya(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yangi kategoriya
              </Button>
            </div>

            {/* Kategoriya Form */}
            {yangiKategoriya && (
              <Card className="glass-effect animate-slide-up">
                <CardHeader>
                  <CardTitle>
                    {tahrirlashKategoriya ? "Kategoriyani tahrirlash" : "Yangi kategoriya qo'shish"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleKategoriyaSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="kategoriya-nomi">Kategoriya nomi *</Label>
                        <Input
                          id="kategoriya-nomi"
                          value={kategoriyaFormData.nomi}
                          onChange={(e) => setKategoriyaFormData({ ...kategoriyaFormData, nomi: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="kategoriya-icon">Icon (emoji) *</Label>
                        <Input
                          id="kategoriya-icon"
                          value={kategoriyaFormData.icon}
                          onChange={(e) => setKategoriyaFormData({ ...kategoriyaFormData, icon: e.target.value })}
                          placeholder="📱"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="kategoriya-tavsif">Tavsif *</Label>
                      <Textarea
                        id="kategoriya-tavsif"
                        value={kategoriyaFormData.tavsif}
                        onChange={(e) => setKategoriyaFormData({ ...kategoriyaFormData, tavsif: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="kategoriya-rang">Rang</Label>
                        <Select
                          value={kategoriyaFormData.rang}
                          onValueChange={(value) => setKategoriyaFormData({ ...kategoriyaFormData, rang: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bg-blue-500">Ko'k</SelectItem>
                            <SelectItem value="bg-green-500">Yashil</SelectItem>
                            <SelectItem value="bg-purple-500">Binafsha</SelectItem>
                            <SelectItem value="bg-orange-500">To'q sariq</SelectItem>
                            <SelectItem value="bg-red-500">Qizil</SelectItem>
                            <SelectItem value="bg-pink-500">Pushti</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="kategoriya-chegirma">Chegirma (%)</Label>
                        <Input
                          id="kategoriya-chegirma"
                          type="number"
                          min="0"
                          max="50"
                          value={kategoriyaFormData.chegirma}
                          onChange={(e) =>
                            setKategoriyaFormData({ ...kategoriyaFormData, chegirma: Number(e.target.value) })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="kategoriya-faol"
                        checked={kategoriyaFormData.faol}
                        onChange={(e) => setKategoriyaFormData({ ...kategoriyaFormData, faol: e.target.checked })}
                      />
                      <Label htmlFor="kategoriya-faol">Faol kategoriya</Label>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" className="hover:scale-105 transition-transform duration-200">
                        {tahrirlashKategoriya ? "Yangilash" : "Qo'shish"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setYangiKategoriya(false)
                          setTahrirlashKategoriya(null)
                          setKategoriyaFormData({
                            nomi: "",
                            tavsif: "",
                            icon: "",
                            rang: "bg-blue-500",
                            faol: true,
                            chegirma: 0,
                          })
                        }}
                      >
                        Bekor qilish
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Kategoriyalar Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kategoriyalar.map((kategoriya) => (
                <Card key={kategoriya.id} className="glass-effect hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center ${kategoriya.rang} text-white text-xl`}
                      >
                        {kategoriya.icon}
                      </div>
                      <div className="flex gap-1">
                        {!kategoriya.faol && <Badge variant="secondary">Nofaol</Badge>}
                        {kategoriya.chegirma > 0 && <Badge className="bg-green-500">-{kategoriya.chegirma}%</Badge>}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{kategoriya.nomi}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{kategoriya.tavsif}</p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => kategoriyaniTahrirlash(kategoriya)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Tahrirlash
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => kategoriyaniOchirish(kategoriya.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Buyurtmalar Tab */}
        <TabsContent value="buyurtmalar">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Buyurtmalar boshqaruvi ({buyurtmalar.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {buyurtmalar.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Hali buyurtmalar yo'q</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {buyurtmalar
                    .sort((a, b) => new Date(b.sana).getTime() - new Date(a.sana).getTime())
                    .map((buyurtma, index) => (
                      <Card
                        key={buyurtma.id}
                        className="border hover-lift animate-scale-in cursor-pointer"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => buyurtmaTafsilotlari(buyurtma)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">#{buyurtma.buyurtma_raqami}</h3>
                              <p className="text-sm text-muted-foreground">{formatSana(buyurtma.sana)}</p>
                              <p className="text-sm font-medium">{buyurtma.mijoz_malumotlari.ism}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-primary">{formatNarx(buyurtma.umumiy_narx)}</p>
                              <Badge className={`${getHolatColor(buyurtma.holat)} flex items-center gap-1`}>
                                {getHolatIcon(buyurtma.holat)}
                                {buyurtma.holat}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">{buyurtma.mahsulotlar.length} ta mahsulot</p>
                            <Select
                              value={buyurtma.holat}
                              onValueChange={(value) => {
                                buyurtmaHolatiniOzgartirish(buyurtma.id, value)
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Ko'rib chiqilmoqda">Ko'rib chiqilmoqda</SelectItem>
                                <SelectItem value="Tasdiqlandi">Tasdiqlandi</SelectItem>
                                <SelectItem value="Yetkazilmoqda">Yetkazilmoqda</SelectItem>
                                <SelectItem value="Yetkazildi">Yetkazildi</SelectItem>
                                <SelectItem value="Bekor qilindi">Bekor qilindi</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Foydalanuvchilar boshqaruvi</h2>
              <Button onClick={() => setYangiUser(true)} className="hover:scale-105 transition-transform duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Yangi foydalanuvchi
              </Button>
            </div>

            {/* User Form */}
            {yangiUser && (
              <Card className="glass-effect animate-slide-up">
                <CardHeader>
                  <CardTitle>
                    {tahrirlashUser ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi qo'shish"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUserSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user-ism">To'liq ism *</Label>
                        <Input
                          id="user-ism"
                          value={userFormData.ism}
                          onChange={(e) => setUserFormData({ ...userFormData, ism: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="user-email">Email *</Label>
                        <Input
                          id="user-email"
                          type="email"
                          value={userFormData.email}
                          onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user-telefon">Telefon raqam</Label>
                        <Input
                          id="user-telefon"
                          value={userFormData.telefon}
                          onChange={(e) => setUserFormData({ ...userFormData, telefon: e.target.value })}
                          placeholder="+998 90 123 45 67"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user-parol">Parol {!tahrirlashUser && "*"}</Label>
                        <Input
                          id="user-parol"
                          type="password"
                          value={userFormData.parol}
                          onChange={(e) => setUserFormData({ ...userFormData, parol: e.target.value })}
                          placeholder={tahrirlashUser ? "Bo'sh qoldiring o'zgarmaslik uchun" : "Parolni kiriting"}
                          required={!tahrirlashUser}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="user-manzil">Manzil</Label>
                      <Textarea
                        id="user-manzil"
                        value={userFormData.manzil}
                        onChange={(e) => setUserFormData({ ...userFormData, manzil: e.target.value })}
                        placeholder="To'liq manzil"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="user-admin"
                        checked={userFormData.admin}
                        onChange={(e) => setUserFormData({ ...userFormData, admin: e.target.checked })}
                      />
                      <Label htmlFor="user-admin">Administrator huquqlari</Label>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" className="hover:scale-105 transition-transform duration-200">
                        {tahrirlashUser ? "Yangilash" : "Qo'shish"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setYangiUser(false)
                          setTahrirlashUser(null)
                          setUserFormData({
                            ism: "",
                            email: "",
                            telefon: "",
                            manzil: "",
                            parol: "",
                            admin: false,
                          })
                        }}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        Bekor qilish
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Users Table */}
            <Card className="glass-effect">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ism</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Amallar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{user.ism}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.telefon || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={user.admin ? "default" : "secondary"}>{user.admin ? "Admin" : "User"}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => userTafsilotlari(user)}
                              className="hover:scale-105 transition-transform duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => userniTahrirlash(user)}
                              className="hover:scale-105 transition-transform duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => userniOchirish(user.id)}
                              className="text-red-600 hover:text-red-700 hover:scale-105 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-md w-full glass-effect animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Foydalanuvchi tafsilotlari</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowUserDetails(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{selectedUser.ism}</h3>
                <Badge variant={selectedUser.admin ? "default" : "secondary"} className="mt-2">
                  {selectedUser.admin ? "Administrator" : "Foydalanuvchi"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedUser.email}</span>
                </div>
                {selectedUser.telefon && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedUser.telefon}</span>
                  </div>
                )}
                {selectedUser.manzil && (
                  <div className="flex items-start space-x-3">
                    <div className="h-4 w-4 text-muted-foreground mt-0.5">📍</div>
                    <span className="text-sm">{selectedUser.manzil}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">ID: {selectedUser.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-2xl w-full glass-effect animate-scale-in max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Buyurtma #{selectedOrder.buyurtma_raqami}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowOrderDetails(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mijoz ma'lumotlari */}
              <div>
                <h4 className="font-semibold mb-3">Mijoz ma'lumotlari</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Ism:</strong> {selectedOrder.mijoz_malumotlari.ism}
                  </p>
                  <p>
                    <strong>Telefon:</strong> {selectedOrder.mijoz_malumotlari.telefon}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.mijoz_malumotlari.email}
                  </p>
                  <p>
                    <strong>Manzil:</strong> {selectedOrder.mijoz_malumotlari.manzil}
                  </p>
                  <p>
                    <strong>Shahar:</strong> {selectedOrder.mijoz_malumotlari.shahar}
                  </p>
                  <p>
                    <strong>To'lov turi:</strong> {selectedOrder.mijoz_malumotlari.tolov_turi}
                  </p>
                </div>
              </div>

              {/* Buyurtma ma'lumotlari */}
              <div>
                <h4 className="font-semibold mb-3">Buyurtma ma'lumotlari</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Sana:</strong> {formatSana(selectedOrder.sana)}
                  </p>
                  <p>
                    <strong>Holat:</strong>{" "}
                    <Badge className={getHolatColor(selectedOrder.holat)}>{selectedOrder.holat}</Badge>
                  </p>
                  <p>
                    <strong>Jami summa:</strong>{" "}
                    <span className="text-primary font-bold">{formatNarx(selectedOrder.umumiy_narx)}</span>
                  </p>
                </div>
              </div>

              {/* Mahsulotlar */}
              <div>
                <h4 className="font-semibold mb-3">Buyurtma qilingan mahsulotlar</h4>
                <div className="space-y-3">
                  {selectedOrder.mahsulotlar.map((mahsulot, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{mahsulot.nomi}</p>
                        <p className="text-sm text-muted-foreground">
                          {mahsulot.miqdor} x {formatNarx(mahsulot.narx)}
                        </p>
                      </div>
                      <p className="font-semibold">{formatNarx(mahsulot.narx * mahsulot.miqdor)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Holat o'zgartirish */}
              <div>
                <Label htmlFor="order-status">Buyurtma holatini o'zgartirish</Label>
                <Select
                  value={selectedOrder.holat}
                  onValueChange={(value) => {
                    buyurtmaHolatiniOzgartirish(selectedOrder.id, value)
                    setSelectedOrder({ ...selectedOrder, holat: value })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ko'rib chiqilmoqda">Ko'rib chiqilmoqda</SelectItem>
                    <SelectItem value="Tasdiqlandi">Tasdiqlandi</SelectItem>
                    <SelectItem value="Yetkazilmoqda">Yetkazilmoqda</SelectItem>
                    <SelectItem value="Yetkazildi">Yetkazildi</SelectItem>
                    <SelectItem value="Bekor qilindi">Bekor qilindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
