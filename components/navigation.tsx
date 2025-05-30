"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/assets/favicon.png"
import { Menu, MapPin, Calendar, Info, Utensils, Camera, Home, Activity } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: MapPin },
    { href: "/activities", label: "Activities", icon: Activity },
    { href: "/trip-planner", label: "Trip Planner", icon: Calendar },
    { href: "/food", label: "Food", icon: Utensils },
    { href: "/photo-spots", label: "Photo Spots", icon: Camera },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Info },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src={Logo.src} alt="Logo" className="max-w-md h-10" />
            <span className="font-bold text-xl text-gray-800 font-poppins">PhuGuide</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="flex items-center space-x-1">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>

            {/* Contact Link */}
            <Link href="/contact">
              <Button className="bg-orange-500 hover:bg-orange-600 hidden sm:flex">Contact</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
