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

  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

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
          transition={{ duration: 0.5, ease: smoothEase }}
          className="flex items-center p-1.5 rounded-xl backdrop-blur-md transition-all duration-500 pointer-events-auto border bg-white/90 dark:bg-slate-950/95 border-slate-300 dark:border-slate-800 shadow-[0_6px_24px_rgba(0,0,0,0.02)]"
        >
          {/* Логотип */}
          <a href="/" className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors ml-0.5">
            <Cctv size={16} strokeWidth={1.5} className="text-slate-900 dark:text-white transition-colors hover:text-red-600" />
          </a>

          {/* ЕДИНЫЙ БЛОК КОНТРОЛОВ (Тумблеры + Логин) */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-900/50 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 mx-2">
            {/* Язык */}
            <button 
              onClick={toggleLanguage} 
              aria-label="Сменить язык / Change language"
              className="w-9 h-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-800 hover:shadow-[0_1px_4px_rgba(0,0,0,0.02)] dark:hover:shadow-none transition-all text-slate-550 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white font-mono font-bold text-[10px] uppercase tracking-wider"
            >
              {i18n.language || 'ru'}
            </button>

            <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-800 mx-1" />

            {/* Тема */}
            <button 
              onClick={toggleTheme} 
              aria-label={isDark ? "Включить светлую тему" : "Включить темную тему"}
              className="w-9 h-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-800 hover:shadow-[0_1px_4px_rgba(0,0,0,0.02)] dark:hover:shadow-none transition-all text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            >
              {isDark ? <Sun size={12} strokeWidth={2.5} /> : <Moon size={12} strokeWidth={2.5} />}
            </button>
            
            <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-800 mx-1" />

            {/* Клерк Вход/Аватар */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="h-8 px-3.5 flex items-center gap-1.5 rounded-md hover:bg-white dark:hover:bg-slate-800 hover:shadow-[0_1px_4px_rgba(0,0,0,0.02)] dark:hover:shadow-none transition-all text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white font-mono font-bold text-[10px] uppercase tracking-wider">
                  <User size={11} strokeWidth={2.5} />
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
            className="mr-0.5 px-4 h-8 flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
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
          className={`flex items-center justify-between p-2 rounded-xl pointer-events-auto transition-all duration-300 border ${
            scrolled || isOpen
              ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-slate-300 dark:border-slate-800 shadow-md" 
              : "bg-transparent border-transparent"
          }`}
        >
          <a href="/" className="flex items-center gap-2 pl-2" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-red-650 bg-red-600 text-white flex items-center justify-center shadow-sm">
              <Cctv size={16} strokeWidth={2} />
            </div>
            <span className="text-sm font-black tracking-tight uppercase text-slate-900 dark:text-white font-display">SBA</span>
          </a>

          <div className="flex items-center gap-2">
            <SignedIn>
              <div className="scale-90"><CustomUserButton /></div>
            </SignedIn>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
            >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </motion.div>
      </header>

      {/* === ЭЛЕГАНТНЫЙ DRAWER МЕНЮ === */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-[#0a0f1a] flex flex-col pt-24 pb-12 px-6 md:hidden overflow-y-auto relative"
            onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          >
            {/* Tactical Blueprint Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.1]" 
                 style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                 
            <div className="flex flex-col gap-6 w-full max-w-sm mx-auto flex-grow h-full pt-10 relative z-10">
              
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-md">
                    <Cctv size={20} />
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-tight text-slate-900 dark:text-white font-display">Управление</h3>
                </div>
              </div>

              {/* УНИФИЦИРОВАННЫЕ КОНТРОЛЫ НА МОБИЛКЕ */}
              <motion.div custom={1} variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}} initial="hidden" animate="visible" exit="hidden" className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <button onClick={toggleLanguage} className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-slate-900 font-mono font-bold uppercase tracking-wider text-xs active:scale-[0.98] transition-all border border-slate-800 text-white hover:bg-slate-800 hover:border-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    <Globe size={16} className="text-slate-400"/> {i18n.language || 'ru'}
                  </button>
                  <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-slate-900 font-mono font-bold text-xs active:scale-[0.98] transition-all border border-slate-800 text-white hover:bg-slate-800 hover:border-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] break-words text-center leading-tight">
                    {isDark ? <Sun size={16} className="text-slate-400"/> : <Moon size={16} className="text-slate-400"/>} {isDark ? "Светлая" : "Темная"}
                  </button>
                </div>

                <SignedOut>
                  <SignInButton mode="modal">
                    <button onClick={() => setIsOpen(false)} className="w-full h-14 flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all hover:bg-slate-800 hover:border-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] break-words">
                      <User size={16} className="text-slate-400" />
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
                className="w-full h-16 mt-auto flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-[13px] uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] active:scale-[0.98] transition-all break-words text-center leading-tight px-4"
              >
                {t("nav.contact_btn", "Связаться с нами")} <ArrowRight size={18} className="ml-2 flex-shrink-0"/>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}