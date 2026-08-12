"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Shield, Phone, MessageCircle, ShoppingCart } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"
import { SmoothScroll } from "./smooth-scroll"
import { GlobalBackground } from "./GlobalBackground"
import { CartDrawer } from "./CartDrawer"
import { useCart } from "@/contexts/CartContext"

interface ServiceLayoutProps {
  children: React.ReactNode
}

export const ServiceLayout = ({ children }: ServiceLayoutProps) => {
  const { theme, setTheme } = useTheme()
  const { totalQty } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <SmoothScroll>
      <GlobalBackground />
      <div className="relative min-h-screen bg-background text-foreground">

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 rounded-md bg-red-600 flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                <Shield size={14} className="text-white" />
              </div>
              <span className="font-black text-sm uppercase tracking-tight">
                SBA <span className="text-muted-foreground font-medium">Актау</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Открыть корзину"
              >
                <ShoppingCart size={14} />
                {totalQty > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                    {totalQty}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Переключить тему"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <Link
                to="/"
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={13} />
                На главную
              </Link>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-border/30 py-8 mt-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center">
                <Shield size={11} className="text-white" />
              </div>
              <span className="text-sm font-bold uppercase tracking-tight">SBA Security</span>
              <span className="text-xs text-muted-foreground/50">© 2016–2026</span>
            </div>
            <div className="flex items-center gap-5">
              <a
                href="tel:+77779204988"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone size={12} />
                +7 777 920 49 88
              </a>
              <a
                href="https://wa.me/77779204988"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
              >
                <MessageCircle size={12} />
                WhatsApp
              </a>
            </div>
          </div>
        </footer>

      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </SmoothScroll>
  )
}
