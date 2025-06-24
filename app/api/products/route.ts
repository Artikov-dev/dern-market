import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

export const revalidate = 60 // ISR: refresh the cache every minute

export async function GET() {
  try {
    // public/products.json faylini o'qish
    const filePath = join(process.cwd(), "public", "products.json")
    const fileContents = readFileSync(filePath, "utf8")
    const products = JSON.parse(fileContents)

    return NextResponse.json(products)
  } catch (error) {
    console.error("Products API error:", error)

    // Agar fayl topilmasa, default mahsulotlar qaytarish
    const defaultProducts = [
      {
        id: 101,
        nomi: "iPhone 15 Pro Max 256GB",
        tavsif: "Apple A17 Pro chipi, 6.7″ Super Retina XDR displey, 48MP kamera tizimi",
        narx: 17500000,
        rasm: "/15pro.png?height=300&width=300",
        kategoriya: "Smartfonlar",
        zaxira: 12,
        yangi: true,
      },
      {
        id: 102,
        nomi: "Samsung Galaxy S24 Ultra 512GB",
        tavsif: "Snapdragon 8 Gen 3, 200MP kamera, 6.8″ Dynamic AMOLED 2X",
        narx: 16200000,
        rasm: "/15pro.png?height=300&width=300",
        kategoriya: "Smartfonlar",
        zaxira: 8,
        yangi: true,
      },
      {
        id: 201,
        nomi: "MacBook Pro 14″ M3 Pro 512GB",
        tavsif: "Apple M3 Pro chip, 14″ Liquid Retina XDR, 18 soat batareya",
        narx: 28500000,
        rasm: "/15pro.png?height=300&width=300",
        kategoriya: "Noutbuklar",
        zaxira: 6,
        yangi: true,
      },
      {
        id: 301,
        nomi: "Sony WH-1000XM5",
        tavsif: "Premium noise canceling, 30 soat quvvat, Hi-Res Audio",
        narx: 3800000,
      rasm: "/15pro.png?height=300&width=300",
        kategoriya: "Audio",
        zaxira: 20,
        yangi: false,
      },
    ]

    return NextResponse.json(defaultProducts)
  }
}
