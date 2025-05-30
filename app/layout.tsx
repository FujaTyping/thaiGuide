import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import 'swiper/css';
import 'swiper/css/effect-fade';
import Chatbot from "@/components/chatbot"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "PhuGuide Travel Advisor",
  description: "Gamified tourism platform for Phuket, Thailand",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <Navigation />
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  )
}
