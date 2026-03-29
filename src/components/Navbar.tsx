"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Menu, X, Cctv, Moon, Sun, Globe, LayoutDashboard, ArrowRight, User } from "lucide-react"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"

export const Navbar = () => {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious()
    if (previous && latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
    setScrolled(latest > 20)
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  if (!mounted) return null

  const isDark = theme === "dark"
  const toggleTheme = () => setTheme(isDark ? "light" : "dark")

  const languages = ['ru', 'kz', 'en']
  const toggleLanguage = () => {
    const currentIndex = languages.indexOf(i18n.language || 'ru')
    const nextIndex = (currentIndex + 1) % languages.length
    i18n.changeLanguage(languages[nextIndex])
  }

  const smoothEase = [0.22, 1, 0.36, 1]

  // Стилизация аватара для премиального вида (размер подогнан под новые тумблеры)
  const CustomUserButton = () => (
    <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 border border-border/50 shadow-sm" } }}>
      <UserButton.MenuItems>
        <UserButton.Link
          label={t("nav.dashboard")}
          labelIcon={<LayoutDashboard size={16} />}
          href="/dashboard"
        />
      </UserButton.MenuItems>
    </UserButton>
  );

  return (
    <>
      {/* === ДЕСКТОП: ПРЕМИАЛЬНЫЙ КОНТРОЛЬНЫЙ БАР === */}
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none hidden md:flex">
        <motion.nav 
          variants={{
            visible: { y: 0, opacity: 1 },
            hidden: { y: "-200%", opacity: 0 }
          }}
          animate={hidden ? "hidden" : "visible"}
          transition={{ duration: 0.5, ease: smoothEase as any }}
          className="flex items-center p-1.5 rounded-full backdrop-blur-2xl transition-all duration-500 pointer-events-auto border bg-background/80 dark:bg-black/80 border-border/50 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]"
        >
          {/* Логотип */}
          <a href="/" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted/80 transition-colors ml-1">
            <Cctv size={22} strokeWidth={1.5} className="text-foreground transition-colors group-hover:text-red-600" />
          </a>

          {/* ЕДИНЫЙ БЛОК КОНТРОЛОВ (Тумблеры + Логин) */}
          <div className="flex items-center bg-muted/40 p-1 rounded-full border border-border/30 mx-3">
            {/* Язык */}
            <button onClick={toggleLanguage} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground font-bold text-[11px] uppercase tracking-wider">
              {i18n.language || 'ru'}
            </button>

            <div className="w-[1px] h-4 bg-border/50 mx-1" />

            {/* Тема */}
            <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground">
              {isDark ? <Sun size={15} strokeWidth={2.5} /> : <Moon size={15} strokeWidth={2.5} />}
            </button>
            
            <div className="w-[1px] h-4 bg-border/50 mx-1" />

            {/* Клерк Вход/Аватар */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="h-8 px-3 flex items-center gap-1.5 rounded-full hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground font-bold text-[11px] uppercase tracking-widest">
                  <User size={14} strokeWidth={2.5} />
                  <span>{t("nav.login", "Войти")}</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="px-1 flex items-center justify-center">
                <CustomUserButton />
              </div>
            </SignedIn>
          </div>

          {/* СТРОГО КРАСНАЯ CTA КНОПКА */}
          <a 
            href="https://wa.me/77779204988"
            target="_blank" rel="noopener noreferrer"
            className="mr-1 px-6 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 text-[12px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md hover:shadow-red-600/20"
          >
            {t("nav.contact_btn", "Связаться")}
          </a>
        </motion.nav>
      </header>

      {/* === МОБИЛКА: КОМПАКТНАЯ ТАБЛЕТКА === */}
      <header className="fixed top-0 inset-x-0 z-50 p-4 md:hidden pointer-events-none">
        <motion.div 
          variants={{
            visible: { y: 0, opacity: 1 },
            hidden: { y: "-150%", opacity: 0 }
          }}
          animate={hidden && !isOpen ? "hidden" : "visible"}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`flex items-center justify-between p-2.5 rounded-3xl pointer-events-auto transition-all duration-300 border ${
            scrolled || isOpen
              ? "bg-background/95 dark:bg-[#050505]/95 backdrop-blur-md border-border/50 shadow-lg" 
              : "bg-transparent border-transparent"
          }`}
        >
          <a href="/" className="flex items-center gap-2 pl-2" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20">
              <Cctv size={20} strokeWidth={2} />
            </div>
            <span className="text-lg font-black tracking-tight uppercase text-foreground">SBA</span>
          </a>

          <div className="flex items-center gap-2">
            <SignedIn>
              <div className="scale-90"><CustomUserButton /></div>
            </SignedIn>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-muted/60 text-foreground"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.div>
      </header>

      {/* === ЭЛЕГАНТНЫЙ DRAWER МЕНЮ === */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col pt-24 pb-12 px-6 md:hidden overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          >
            <div className="flex flex-col gap-6 w-full max-w-sm mx-auto flex-grow h-full pt-10">
              
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/20">
                    <Cctv size={24} />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Управление</h3>
                </div>
              </div>

              {/* УНИФИЦИРОВАННЫЕ КОНТРОЛЫ НА МОБИЛКЕ */}
              <motion.div custom={1} variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}} initial="hidden" animate="visible" exit="hidden" className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <button onClick={toggleLanguage} className="flex-1 flex items-center justify-center gap-2 h-16 rounded-2xl bg-muted/50 font-bold uppercase tracking-wider text-sm active:scale-[0.98] transition-all border border-border/50">
                    <Globe size={18} className="text-muted-foreground"/> {i18n.language || 'ru'}
                  </button>
                  <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-2 h-16 rounded-2xl bg-muted/50 font-bold text-sm active:scale-[0.98] transition-all border border-border/50">
                    {isDark ? <Sun size={18} className="text-muted-foreground"/> : <Moon size={18} className="text-muted-foreground"/>} {isDark ? "Светлая" : "Темная"}
                  </button>
                </div>

                <SignedOut>
                  <SignInButton mode="modal">
                    <button onClick={() => setIsOpen(false)} className="w-full h-16 flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-muted/50 text-foreground font-bold text-sm uppercase tracking-widest active:scale-[0.98] transition-all">
                      <User size={18} className="text-muted-foreground" />
                      {t("nav.login", "Личный кабинет")}
                    </button>
                  </SignInButton>
                </SignedOut>
              </motion.div>

              <motion.a
                custom={3} variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}} initial="hidden" animate="visible" exit="hidden"
                href="https://wa.me/77779204988"
                target="_blank" rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full h-20 mt-auto flex items-center justify-center rounded-2xl bg-red-600 text-white font-black text-[15px] uppercase tracking-widest shadow-lg shadow-red-600/20 active:scale-[0.98] transition-transform"
              >
                {t("nav.contact_btn", "Связаться с нами")} <ArrowRight size={22} className="ml-2"/>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}