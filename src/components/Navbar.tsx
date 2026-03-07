"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Cctv } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface RouteProps {
  href: string
  label: string
}

const routeList: RouteProps[] = [
  { href: "#services", label: "Услуги" },
  { href: "#projects", label: "Проекты" },
  { href: "#testimonials", label: "Отзывы" },
  { href: "#cta", label: "Контакты" },
]

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"
  const toggleTheme = () => setTheme(isDark ? "light" : "dark")

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "border-b bg-background/70 backdrop-blur-md py-3" 
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-10">
        
        {/* VERCEL STYLE LOGO: No box, clean typography */}
        <motion.a 
          href="/" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 group transition-opacity hover:opacity-70"
        >
          <Cctv 
            size={24} 
            strokeWidth={1.5} 
            className={isDark ? "text-white" : "text-black"} 
          />
          <span className="text-xl font-bold tracking-tight text-foreground uppercase">
            SBA
          </span>
        </motion.a>

        {/* DESKTOP NAVIGATION (Static as requested) */}
        <nav className="hidden md:flex items-center gap-6">
          {routeList.map((route) => (
            <a
              key={route.label}
              href={route.href}
              className="text-[14px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {route.label}
            </a>
          ))}
        </nav>

        {/* VERCEL STYLE ACTIONS: Compact text buttons */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* THEME SWITCHER AS TEXT */}
          <button
            onClick={toggleTheme}
            className="text-[14px] font-medium px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95 appearance-none"
          >
            {isDark ? "День" : "Ночь"}
          </button>

          {/* WHATSAPP AS COMPACT TEXT BUTTON */}
          <a 
            href="https://wa.me/77000000000"
            target="_blank"
            className={`
              text-[14px] font-medium px-4 py-1.5 rounded-md transition-all active:scale-95
              ${isDark 
                ? "bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 border border-[#25D366]/20"
                : "bg-[#075E54] text-white hover:bg-[#075E54]/90 shadow-sm"}
            `}
          >
            Связаться
          </a>
        </div>

        {/* MOBILE TRIGGER */}
        <div className="flex md:hidden items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] border-l p-0 bg-background">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-6 border-b text-left">
                  <SheetTitle className="text-lg font-bold flex items-center gap-2">
                    <Cctv size={20} /> SBA
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col p-6 gap-4 flex-grow">
                  {routeList.map(({ href, label }) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="text-[16px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </a>
                  ))}
                </nav>

                <div className="p-6 border-t flex flex-col gap-3">
                  <button 
                    onClick={toggleTheme}
                    className="w-full text-center py-2 text-sm font-medium border rounded-md"
                  >
                    {isDark ? "Switch to Light" : "Switch to Dark"}
                  </button>
                  <a 
                    href="https://wa.me/77000000000"
                    className="w-full text-center py-2 text-sm font-medium bg-foreground text-background rounded-md"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}