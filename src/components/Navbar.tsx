"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Menu, X, Cctv, Moon, Sun, Globe } from "lucide-react"

export const Navbar = () => {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { scrollY } = useScroll()

  // Меньше порог скрытия для большей плавности отклика
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious()
    if (previous && latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
    setScrolled(latest > 20)
  })

  const routeList = [
    { href: "#services", label: t("nav.services") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#testimonials", label: t("nav.testimonials") },
    { href: "#cta", label: t("nav.contacts") },
  ]

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

  // === ОПТИМИЗИРОВАННЫЕ АНИМАЦИИ БЕЗ БЛЮРА ===
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any} },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }
    })
  }

  return (
    <>
      {/* === DESKTOP NAVBAR (Floating Pill) === */}
      {/* На ПК оставляем мощный backdrop-blur-2xl, макбуки и пк это тянут без проблем */}
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center mt-4 px-4 pointer-events-none hidden md:flex">
        <motion.nav 
          variants={{
            visible: { y: 0, opacity: 1 },
            hidden: { y: "-150%", opacity: 0 }
          }}
          animate={hidden ? "hidden" : "visible"}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`flex items-center gap-1 p-1.5 rounded-full backdrop-blur-2xl transition-all duration-500 pointer-events-auto border ${
            scrolled 
              ? "bg-white/70 dark:bg-[#0a0a0c]/70 border-black/10 dark:border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]" 
              : "bg-white/40 dark:bg-white/[0.02] border-transparent shadow-sm"
          }`}
        >
          {/* ЛОГОТИП */}
          <a href="/" className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors group pl-1">
            <Cctv size={22} strokeWidth={1.5} className="text-foreground group-hover:text-red-500 transition-colors" />
          </a>

          <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 mx-2" />

          {/* ССЫЛКИ */}
          <div className="flex items-center px-2 gap-1">
            {routeList.map((route) => (
              <a
                key={route.label}
                href={route.href}
                className="relative px-4 py-2 text-[14px] font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              >
                {route.label}
              </a>
            ))}
          </div>

          <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 mx-2" />

          {/* КОНТРОЛЛЫ (Тема и Язык) */}
          <div className="flex items-center gap-1">
            <button onClick={toggleLanguage} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground font-bold text-xs uppercase tracking-wider">
              {i18n.language || 'ru'}
            </button>
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
              {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
            </button>
          </div>

          {/* КНОПКА СВЯЗИ */}
          <a 
            href="https://wa.me/77779204988"
            target="_blank" rel="noopener noreferrer"
            className="ml-2 px-6 py-3 rounded-full bg-foreground text-background text-[14px] font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            {t("nav.contact_btn")}
          </a>
        </motion.nav>
      </header>

      {/* === MOBILE NAVBAR === */}
      <header className="fixed top-0 inset-x-0 z-50 p-4 md:hidden pointer-events-none">
        <motion.div 
          variants={{
            visible: { y: 0, opacity: 1 },
            hidden: { y: "-150%", opacity: 0 }
          }}
          animate={hidden && !isOpen ? "hidden" : "visible"}
          transition={{ duration: 0.3, ease: "easeOut" }} // Ускорили анимацию скрытия
          // ВАЖНО: Снизили backdrop-blur-2xl до backdrop-blur-md и увеличили opacity цвета.
          // Сильный блюр на fixed элементе при скролле = гарантированные лаги.
          className={`flex items-center justify-between p-3 rounded-3xl pointer-events-auto transition-all duration-300 border ${
            scrolled || isOpen
              ? "bg-white/95 dark:bg-[#050505]/95 backdrop-blur-md border-black/10 dark:border-white/10 shadow-lg" 
              : "bg-transparent border-transparent"
          }`}
        >
          {/* ЛОГО */}
          <a href="/" className="flex items-center gap-2 pl-2" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <Cctv size={20} strokeWidth={2} />
            </div>
            <span className="text-lg font-bold tracking-tight uppercase">SBA</span>
          </a>

          {/* КНОПКА ГАМБУРГЕРА */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-foreground"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>
      </header>

      {/* === MOBILE FULLSCREEN MENU === */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden" animate="visible" exit="exit"
            // ВАЖНО: Убрали backdrop-blur-3xl вообще. Оставили просто сплошной цвет.
            // Меню открывается на весь экран, под ним скролла нет, блюр тут бесполезен, но жрет ресурсы.
            className="fixed inset-0 z-40 bg-background flex flex-col pt-28 pb-8 px-6 md:hidden overflow-y-auto"
          >
            {/* Ссылки (Крупная типографика) */}
            <nav className="flex flex-col gap-6 mt-8">
              {routeList.map((route, i) => (
                <motion.a
                  custom={i} variants={linkVariants} initial="hidden" animate="visible" exit="hidden"
                  key={route.label}
                  href={route.href}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-extrabold tracking-tight text-foreground active:text-red-500 transition-colors"
                >
                  {route.label}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto pt-10 flex flex-col gap-6">
              
              {/* Контроллы: Язык и Тема */}
              <motion.div custom={4} variants={linkVariants} initial="hidden" animate="visible" exit="hidden" className="flex items-center gap-4 border-t border-black/5 dark:border-white/5 pt-8">
                <button onClick={toggleLanguage} className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-muted font-bold uppercase tracking-wider active:bg-muted/80">
                  <Globe size={18} /> {i18n.language || 'ru'}
                </button>
                <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-muted font-bold active:bg-muted/80">
                  {isDark ? <Sun size={18} /> : <Moon size={18} />} {isDark ? "Light" : "Dark"}
                </button>
              </motion.div>

              {/* Большая кнопка связи */}
              <motion.a
                custom={5} variants={linkVariants} initial="hidden" animate="visible" exit="hidden"
                href="https://wa.me/77779204988"
                target="_blank" rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full h-16 flex items-center justify-center rounded-2xl bg-red-600 text-white font-bold text-xl shadow-lg active:scale-[0.98] transition-transform"
              >
                {t("nav.contact_btn")}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}