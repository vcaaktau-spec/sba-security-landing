"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { 
  Shield, Send, CheckCircle2, Loader2, Calculator as CalcIcon, HardDrive
} from "lucide-react"
import { useInView } from "react-intersection-observer"

// --- СТРОГИЕ ТИПЫ ДЛЯ TYPESCRIPT ---
type Resolution = "2MP" | "4MP" | "8MP"
type Channels = 4 | 8 | 16 | 32
// Используем англ ключи для логики, чтобы не зависеть от перевода
type CableLoc = "indoor" | "outdoor"
type Conduit = "none" | "gofra" | "channel"
type Archive = "7" | "14" | "30"
type InstallLevel = "standard" | "complex" | "hard"

// --- ПРОФЕССИОНАЛЬНЫЕ ПРАЙСЫ (АКТАУ 2026) ---
const PRICES = {
  cameraBase: 15000, 
  resAddon: {
    "2MP": 0,
    "4MP": 10000,
    "8MP": 35000,
  } as Record<Resolution, number>,

  nvr: {
    "2MP": { 4: 25000, 8: 35000, 16: 60000, 32: 110000 },
    "4MP": { 4: 30000, 8: 42000, 16: 75000, 32: 130000 },
    "8MP": { 4: 40000, 8: 55000, 16: 95000, 32: 160000 }
  } as Record<Resolution, Record<Channels, number>>,

  poe: { 4: 15000, 8: 28000, 16: 55000, 32: 95000 } as Record<Channels, number>,

  cableIndoor: 180,
  cableOutdoor: 250,

  conduitNone: 0,
  conduitGofra: 150,
  conduitChannel: 350,

  hddBase: {
    "7": 22000,
    "14": 38000,
    "30": 65000,
  } as Record<Archive, number>,

  install: {
    "standard": 8000,
    "complex": 12000,
    "hard": 15000,
  } as Record<InstallLevel, number>
}

const HDD_RATES = { "2MP": 20, "4MP": 40, "8MP": 80 } as Record<Resolution, number>
const ARCHIVE_DAYS = { "7": 7, "14": 14, "30": 30 } as Record<Archive, number>

interface CalculatorProps {
  onClose?: () => void;
}

export const Calculator = ({ onClose }: CalculatorProps) => {
  const { t } = useTranslation()
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  // СТЕЙТЫ ЛОГИКИ
  const [cameras, setCameras] = useState<number>(4)
  const [cable, setCable] = useState<number>(200)
  const [resolution, setResolution] = useState<Resolution>("2MP")
  const [cableLoc, setCableLoc] = useState<CableLoc>("indoor")
  const [conduit, setConduit] = useState<Conduit>("channel")
  const [archive, setArchive] = useState<Archive>("7")
  const [installLevel, setInstallLevel] = useState<InstallLevel>("hard")
  
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [calculatedTB, setCalculatedTB] = useState<number>(1)
  
  const [phone, setPhone] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  // АЛГОРИТМ РАСЧЕТА
  useEffect(() => {
    let total = 0
    total += (PRICES.cameraBase + PRICES.resAddon[resolution]) * cameras

    let channels: Channels = 4
    if (cameras > 4) channels = 8
    if (cameras > 8) channels = 16
    if (cameras > 16) channels = 32
    total += PRICES.nvr[resolution][channels]
    total += PRICES.poe[channels]

    let baseMetersPrice = cableLoc === "indoor" ? PRICES.cableIndoor : PRICES.cableOutdoor
    if (cable >= 100 && cable < 300) baseMetersPrice -= 20
    if (cable >= 300) baseMetersPrice -= 40
    total += cable * baseMetersPrice

    if (conduit === "gofra") total += cable * PRICES.conduitGofra
    if (conduit === "channel") total += cable * PRICES.conduitChannel

    const gbPerDay = HDD_RATES[resolution]
    const days = ARCHIVE_DAYS[archive]
    const totalGB = cameras * gbPerDay * days
    
    let reqTB = Math.ceil(totalGB / 1000)
    if (reqTB < 1) reqTB = 1
    setCalculatedTB(reqTB)
    
    const pricePerTB = reqTB === 1 ? 22000 : 18000
    total += reqTB * pricePerTB

    total += PRICES.install[installLevel] * cameras
    total = total * 1.05

    setTotalPrice(Math.round(total))
  }, [cameras, cable, resolution, cableLoc, conduit, archive, installLevel])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "")
    if (input.startsWith("7") || input.startsWith("8")) input = input.substring(1)
    let formatted = "+7"
    if (input.length > 0) formatted += ` (${input.substring(0, 3)}`
    if (input.length > 3) formatted += `) ${input.substring(3, 6)}`
    if (input.length > 6) formatted += `-${input.substring(6, 8)}`
    if (input.length > 8) formatted += `-${input.substring(8, 10)}`
    setPhone(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length !== 18) return
    setIsSubmitting(true)

    const text = `
⚡️ НОВЫЙ РАСЧЕТ СИСТЕМЫ:
💰 Итого: ${totalPrice.toLocaleString()} ₸
📞 Тел: ${phone}

🛠 ПАРАМЕТРЫ:
• Камер: ${cameras} шт (${resolution})
• Кабель: ${cable} м (${cableLoc})
• Защита: ${conduit}
• Монтаж: ${installLevel}
• Архив: ${archive} дней (HDD ~${calculatedTB} ТБ)
    `
    const formData = new FormData()
    formData.append("name", "Клиент с Калькулятора") 
    formData.append("company", "КАЛЬКУЛЯТОР") 
    formData.append("text", text)

    try {
      await fetch("/api/telegram", { method: "POST", body: formData })
      setIsSuccess(true)
      setTimeout(() => { 
        setIsSuccess(false)
        if (onClose) onClose() 
      }, 3000)
    } catch { 
      alert(t("calc.err_send", "Ошибка отправки. Пожалуйста, напишите нам в WhatsApp."))
    } finally {
      setIsSubmitting(false)
    }
  }

  const OptionBtn = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
    <button 
      type="button" 
      onClick={onClick} 
      // Добавлены flex-1, break-words и min-h для идеального отображения длинных слов (KZ)
      className={`flex-1 min-h-[48px] px-2 py-2 rounded-[14px] text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center text-center break-words leading-tight ${
        active 
          ? "bg-red-600 text-white shadow-[0_8px_20px_-6px_rgba(220,38,38,0.6)] border-red-600 scale-[1.02]" 
          : "bg-white dark:bg-white/[0.02] text-foreground/70 border border-black/10 dark:border-white/10 hover:border-red-500/50 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  )

  return (
    <section id="calculator" className="relative min-h-screen py-12 lg:py-24 bg-background flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-900/5 blur-[150px] rounded-full" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 mx-auto max-w-[1100px] mt-10">
        
        {/* === ЗАГОЛОВОК === */}
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 font-bold text-xs uppercase tracking-widest mb-6 border border-red-100 dark:border-red-500/20">
            <CalcIcon size={14} /> {t("calc.badge")}
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 text-foreground leading-[1.1]">
            {t("calc.title1")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              {t("calc.title2")}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {t("calc.subtitle")}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch pb-10">
          
          {/* === ЛЕВАЯ ПАНЕЛЬ НАСТРОЕК === */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} 
            className="flex-grow bg-white dark:bg-[#0c0c0e] border border-black/5 dark:border-white/5 rounded-[32px] sm:rounded-[40px] p-5 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-none"
          >
            
            {/* ПОЛЗУНКИ */}
            <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 mb-10">
              <div className="space-y-4">
                <label className="font-black text-[11px] sm:text-xs uppercase tracking-widest flex justify-between items-center text-foreground/70">
                  <span>{t("calc.cameras")}</span>
                  <span className="text-red-600 text-sm">{cameras} {t("calc.pcs")}</span>
                </label>
                <input type="range" min="1" max="32" value={cameras} onChange={(e) => setCameras(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600" />
              </div>
              <div className="space-y-4">
                <label className="font-black text-[11px] sm:text-xs uppercase tracking-widest flex justify-between items-center text-foreground/70">
                  <span>{t("calc.cable")}</span>
                  <span className="text-red-600 text-sm">{cable} {t("calc.meters")}</span>
                </label>
                <input type="range" min="10" max="1000" step="10" value={cable} onChange={(e) => setCable(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600" />
              </div>
            </div>

            {/* СЕТКА ПАРАМЕТРОВ (Заменены gap на меньшие для вместимости) */}
            <div className="grid sm:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
              
              <div className="space-y-3 flex flex-col">
                <label className="text-[10px] font-black uppercase text-foreground/50 tracking-widest">{t("calc.res")}</label>
                <div className="flex gap-2 w-full">
                  <OptionBtn active={resolution === "2MP"} label={t("calc.opt_2mp")} onClick={() => setResolution("2MP")} />
                  <OptionBtn active={resolution === "4MP"} label={t("calc.opt_4mp")} onClick={() => setResolution("4MP")} />
                  <OptionBtn active={resolution === "8MP"} label={t("calc.opt_8mp")} onClick={() => setResolution("8MP")} />
                </div>
              </div>

              <div className="space-y-3 flex flex-col">
                <label className="text-[10px] font-black uppercase text-foreground/50 tracking-widest">{t("calc.placement")}</label>
                <div className="flex gap-2 w-full">
                  <OptionBtn active={cableLoc === "indoor"} label={t("calc.inside")} onClick={() => setCableLoc("indoor")} />
                  <OptionBtn active={cableLoc === "outdoor"} label={t("calc.outside")} onClick={() => setCableLoc("outdoor")} />
                </div>
              </div>

              <div className="space-y-3 flex flex-col">
                <label className="text-[10px] font-black uppercase text-foreground/50 tracking-widest">{t("calc.protection_route", "Защита трассы")}</label>
                <div className="flex gap-2 w-full">
                  <OptionBtn active={conduit === "none"} label={t("calc.opt_none", "Без защиты")} onClick={() => setConduit("none")} />
                  <OptionBtn active={conduit === "gofra"} label={t("calc.opt_gofra", "Гофра")} onClick={() => setConduit("gofra")} />
                  <OptionBtn active={conduit === "channel"} label={t("calc.opt_channel", "К-Канал")} onClick={() => setConduit("channel")} />
                </div>
              </div>

              <div className="space-y-3 flex flex-col">
                <label className="text-[10px] font-black uppercase text-foreground/50 tracking-widest">{t("calc.install")}</label>
                <div className="flex gap-2 w-full">
                  <OptionBtn active={installLevel === "standard"} label={t("calc.standard")} onClick={() => setInstallLevel("standard")} />
                  <OptionBtn active={installLevel === "complex"} label={t("calc.complex")} onClick={() => setInstallLevel("complex")} />
                  <OptionBtn active={installLevel === "hard"} label={t("calc.opt_complex", "Сложный")} onClick={() => setInstallLevel("hard")} />
                </div>
              </div>

              <div className="space-y-3 sm:col-span-2 flex flex-col">
                <label className="text-[10px] font-black uppercase text-foreground/50 tracking-widest">{t("calc.archive")}</label>
                <div className="flex gap-2 w-full">
                  <OptionBtn active={archive === "7"} label={t("calc.days7")} onClick={() => setArchive("7")} />
                  <OptionBtn active={archive === "14"} label={t("calc.days14")} onClick={() => setArchive("14")} />
                  <OptionBtn active={archive === "30"} label={t("calc.days30")} onClick={() => setArchive("30")} />
                </div>
              </div>

            </div>
          </motion.div>

          {/* === ПРАВАЯ ПАНЕЛЬ ИТОГА === */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} 
            className="w-full lg:w-[400px] shrink-0 bg-[#111113] text-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 flex flex-col shadow-2xl relative overflow-hidden border border-white/5"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 blur-[60px] rounded-full pointer-events-none" />
            
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-wider text-white">
              <Shield size={22} className="text-red-500" /> {t("calc.summary_title")}
            </h3>
            
            <div className="space-y-5 mb-10 text-[11px] font-bold uppercase tracking-widest text-white/60">
              <div className="flex justify-between items-center gap-2">
                <span>{t("calc.nvr_included", "Оборудование:")}</span> <span className="text-white text-right">{t("calc.included")}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>{t("calc.cameras")} ({t(`calc.opt_${resolution.toLowerCase()}`)}):</span> <span className="text-white text-right">{cameras} {t("calc.pcs")}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>Трасса:</span> <span className="text-white text-right">{cable} {t("calc.meters")}</span>
              </div>
              <div className="flex justify-between items-center text-red-400 gap-2">
                <span className="flex items-center gap-1.5"><HardDrive size={14} className="shrink-0"/> {t("calc.archive")}:</span> 
                <span className="text-red-400 text-right whitespace-nowrap">HDD ~{calculatedTB} ТБ</span>
              </div>
            </div>

            <div className="mb-10">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-2">{t("calc.approx_cost")}</p>
              <div className="text-4xl sm:text-5xl font-black flex items-baseline gap-2 tracking-tighter text-white">
                {totalPrice.toLocaleString('ru-RU')} <span className="text-red-600 text-2xl font-bold">₸</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center mt-auto">
                  <CheckCircle2 className="text-green-500 mx-auto mb-3" size={40} />
                  <p className="text-green-400 font-bold text-lg leading-tight">{t("calc.success")}<br/><span className="text-xs font-medium text-green-400/80 mt-1 block">{t("calc.wait")}</span></p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4 mt-auto">
                  <input 
                    required type="tel" value={phone} onChange={handlePhoneChange} maxLength={18} placeholder="+7 (___) ___" 
                    className="w-full h-14 rounded-2xl bg-[#1c1c1e] border border-white/5 px-5 outline-none focus:border-red-600 transition-all font-mono text-base text-white placeholder:text-white/30" 
                  />
                  <button disabled={isSubmitting || phone.length < 18} className="w-full h-14 bg-[#8b1c1c] hover:bg-red-600 disabled:opacity-50 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 text-white shadow-lg">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={16} /> {t("calc.btn")}</>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

          </motion.div>

        </div>
      </div>
    </section>
  )
}