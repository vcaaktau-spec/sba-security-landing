"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { 
  Send, CheckCircle2, Loader2, Calculator as CalcIcon, HardDrive, 
  Video, Activity, Settings2, ShieldCheck 
} from "lucide-react"
import { useInView } from "react-intersection-observer"

// --- СТРОГИЕ ТИПЫ ДЛЯ TYPESCRIPT ---
type Resolution = "2MP" | "4MP" | "8MP"
type Channels = 4 | 8 | 16 | 32
type CableLoc = "indoor" | "outdoor"
type Conduit = "none" | "gofra" | "channel"
type InstallLevel = "standard" | "complex" | "hard"

// --- ПРОФЕССИОНАЛЬНЫЕ ПРАЙСЫ (АКТАУ 2026) ---
const PRICES = {
  cameraBase: 34000, 
  resAddon: {
    "2MP": 0,
    "4MP": 10000,
    "8MP": 85000,
  } as Record<Resolution, number>,

  nvr: {
    "2MP": { 4: 29000, 8: 37000, 16: 72000, 32: 160000 },
    "4MP": { 4: 46000, 8: 73000, 16: 115000, 32: 1700000 },
    "8MP": { 4: 71000, 8: 118000, 16: 172000, 32: 284000 }
  } as Record<Resolution, Record<Channels, number>>,

  poe: { 4: 21000, 8: 36000, 16: 87000 } as Record<number, number>,

  cableIndoor: 220,
  cableOutdoor: 280,

  conduitNone: 0,
  conduitGofra: 150,
  conduitChannel: 350,

  install: {
    "standard": 30000,
    "complex": 35000,
    "hard": 45000,
  } as Record<InstallLevel, number>
}

const HDD_RATES = { "2MP": 20, "4MP": 40, "8MP": 80 } as Record<Resolution, number>

// УМНЫЙ АЛГОРИТМ ПОДБОРА HDD
const getHddCost = (tb: number): number => {
  const drives = [
    { cap: 1, price: 59000 },
    { cap: 2, price: 70000 },
    { cap: 4, price: 82500 },
    { cap: 6, price: 127500 },
    { cap: 8, price: 167500 },
    { cap: 10, price: 225000 },
  ];
  
  const maxCap = tb + 15; 
  const dp = new Array(maxCap).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 0; i < maxCap; i++) {
    if (dp[i] === Infinity) continue;
    for (const d of drives) {
      if (i + d.cap < maxCap) {
        dp[i + d.cap] = Math.min(dp[i + d.cap], dp[i] + d.price);
      }
    }
  }
  
  let minCost = Infinity;
  for (let i = tb; i < maxCap; i++) {
    minCost = Math.min(minCost, dp[i]);
  }
  return minCost;
};

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
  const [archiveDays, setArchiveDays] = useState<number>(7)
  const [installLevel, setInstallLevel] = useState<InstallLevel>("hard")
  
  const [phone, setPhone] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  // СИНХРОННЫЕ РАСЧЕТЫ
  let nvrChannels: Channels = 4
  if (cameras > 4) nvrChannels = 8
  if (cameras > 8) nvrChannels = 16
  if (cameras > 16) nvrChannels = 32
  const nvrCost = PRICES.nvr[resolution][nvrChannels]

  let poeCost = 0;
  let remainingCameras = cameras;
  let poeCounts = { 16: 0, 8: 0, 4: 0 };
  while (remainingCameras > 0) {
    if (remainingCameras >= 16) { poeCost += PRICES.poe[16]; remainingCameras -= 16; poeCounts[16]++; }
    else if (remainingCameras > 8) { poeCost += PRICES.poe[16]; remainingCameras -= 16; poeCounts[16]++; }
    else if (remainingCameras > 4) { poeCost += PRICES.poe[8]; remainingCameras -= 8; poeCounts[8]++; }
    else { poeCost += PRICES.poe[4]; remainingCameras -= 4; poeCounts[4]++; }
  }
  
  const summaryArr = [];
  if (poeCounts[16] > 0) summaryArr.push(`${poeCounts[16]}x 16-port`);
  if (poeCounts[8] > 0) summaryArr.push(`${poeCounts[8]}x 8-port`);
  if (poeCounts[4] > 0) summaryArr.push(`${poeCounts[4]}x 4-port`);
  const poeSummary = summaryArr.join(' + ');

  let baseMetersPrice = cableLoc === "indoor" ? PRICES.cableIndoor : PRICES.cableOutdoor
  if (cable >= 100 && cable < 300) baseMetersPrice -= 20
  if (cable >= 300) baseMetersPrice -= 40
  const cableCost = cable * baseMetersPrice

  let conduitCost = 0
  if (conduit === "gofra") conduitCost = cable * PRICES.conduitGofra
  if (conduit === "channel") conduitCost = cable * PRICES.conduitChannel

  const gbPerDay = HDD_RATES[resolution]
  const totalGB = cameras * gbPerDay * archiveDays
  let calculatedTB = Math.ceil(totalGB / 1000)
  if (calculatedTB < 1) calculatedTB = 1
  const hddCost = getHddCost(calculatedTB)

  const installCost = PRICES.install[installLevel] * cameras
  const baseCost = (PRICES.cameraBase + PRICES.resAddon[resolution]) * cameras
  
  const subtotal = baseCost + nvrCost + poeCost + cableCost + conduitCost + hddCost + installCost
  const totalPrice = Math.round(subtotal * 1.05)


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

    const conduitNames = { none: "Без защиты", gofra: "Гофра", channel: "К-канал" }
    const installNames = { standard: "Стандарт", complex: "Высота", hard: "Сложный" }
    const locNames = { indoor: "Внутри", outdoor: "Улица" }

    const text = `
⚡️ НОВЫЙ РАСЧЕТ СИСТЕМЫ (Калькулятор)

📞 Тел: ${phone}
💰 ИТОГО: ${totalPrice.toLocaleString('ru-RU')} ₸

📊 ОБОРУДОВАНИЕ:
• Камеры: ${cameras} шт. (${resolution})
• Регистратор: На ${nvrChannels} каналов
• PoE Свитчи: ${poeSummary || "Не требуется"}
• Жесткий диск: ~${calculatedTB} ТБ (Архив ${archiveDays} дней)

🛠 МОНТАЖ И МАТЕРИАЛЫ:
• Кабель: ${cable} м. (${locNames[cableLoc]})
• Защита трассы: ${conduitNames[conduit]}
• Сложность работ: ${installNames[installLevel]}
    `
    const formData = new FormData()
    formData.append("name", "Смета с Калькулятора") 
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
      alert(t("calc.err_send"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const OptionBtn = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
    <button 
      type="button" 
      onClick={onClick} 
      className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-semibold tracking-wide transition-all duration-200 border ${
        active 
          ? "bg-foreground text-background border-foreground shadow-sm" 
          : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  )

  const SectionGroup = ({ icon: Icon, title, children, className = "" }: { icon: any, title: string, children: React.ReactNode, className?: string }) => (
    <div className={`bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#222] rounded-xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm w-full max-w-full ${className}`}>
      <div className="flex items-center gap-2.5 text-foreground border-b border-gray-100 dark:border-[#222] pb-3 mb-1">
        <Icon size={16} className="text-muted-foreground shrink-0" />
        <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
      </div>
      <div className="flex flex-col gap-4 flex-grow w-full max-w-full">
        {children}
      </div>
    </div>
  )

  return (
    // overflow-hidden жестко отрезает все, что пытается вылезти за пределы экрана по ширине
    <section id="calculator" className="relative py-8 md:py-16 bg-white dark:bg-[#000] text-foreground font-sans selection:bg-red-500/30 overflow-hidden">
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 w-full max-w-full">
        
        {/* === ЗАГОЛОВОК === */}
        <motion.div ref={ref} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-white/10 text-foreground font-medium text-[10px] uppercase tracking-widest mb-3">
            <CalcIcon size={14} /> {t("calc.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-foreground leading-tight">
            {t("calc.title1")} <span className="text-red-600 dark:text-red-500">{t("calc.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl text-sm lg:mx-0 mx-auto">
            {t("calc.subtitle")}
          </p>
        </motion.div>

        {/* СЕТКА */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* === ЛЕВАЯ ПАНЕЛЬ НАСТРОЕК === */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} 
            className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-full"
          >
            {/* Группа 1: Камеры */}
            <SectionGroup icon={Video} title={t("calc.group_cameras")}>
              <div className="flex flex-col gap-2 w-full max-w-full">
                <label className="font-semibold text-[11px] uppercase tracking-wider flex justify-between items-center text-muted-foreground">
                  <span>{t("calc.cameras")}</span>
                  <span className="text-foreground font-bold">{cameras} {t("calc.pcs")}</span>
                </label>
                <input 
                  type="range" min="1" max="32" value={cameras} 
                  onChange={(e) => setCameras(Number(e.target.value))} 
                  className="w-full max-w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600 dark:accent-red-500" 
                />
              </div>
              
              <div className="flex flex-col gap-2 w-full max-w-full">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">{t("calc.res")}</label>
                <div className="flex gap-2 w-full max-w-full">
                  <OptionBtn active={resolution === "2MP"} label={t("calc.opt_2mp")} onClick={() => setResolution("2MP")} />
                  <OptionBtn active={resolution === "4MP"} label={t("calc.opt_4mp")} onClick={() => setResolution("4MP")} />
                  <OptionBtn active={resolution === "8MP"} label={t("calc.opt_8mp")} onClick={() => setResolution("8MP")} />
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-full">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">{t("calc.placement")}</label>
                <div className="flex gap-2 w-full max-w-full">
                  <OptionBtn active={cableLoc === "indoor"} label={t("calc.opt_inside")} onClick={() => setCableLoc("indoor")} />
                  <OptionBtn active={cableLoc === "outdoor"} label={t("calc.opt_outside")} onClick={() => setCableLoc("outdoor")} />
                </div>
              </div>
            </SectionGroup>

            {/* Группа 2: Трасса и Защита */}
            <SectionGroup icon={ShieldCheck} title={t("calc.group_route")}>
              <div className="flex flex-col gap-2 w-full max-w-full">
                <label className="font-semibold text-[11px] uppercase tracking-wider flex justify-between items-center text-muted-foreground">
                  <span>{t("calc.cable")}</span>
                  <span className="text-foreground font-bold">{cable} {t("calc.meters")}</span>
                </label>
                <input 
                  type="range" min="10" max="1000" step="10" value={cable} 
                  onChange={(e) => setCable(Number(e.target.value))} 
                  className="w-full max-w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600 dark:accent-red-500" 
                />
              </div>

              <div className="flex flex-col gap-2 w-full max-w-full">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">{t("calc.protection_route")}</label>
                <div className="flex gap-2 w-full max-w-full">
                  <OptionBtn active={conduit === "none"} label={t("calc.opt_none")} onClick={() => setConduit("none")} />
                  <OptionBtn active={conduit === "gofra"} label={t("calc.opt_gofra")} onClick={() => setConduit("gofra")} />
                  <OptionBtn active={conduit === "channel"} label={t("calc.opt_channel")} onClick={() => setConduit("channel")} />
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-full">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">{t("calc.install")}</label>
                <div className="flex gap-2 w-full max-w-full">
                  <OptionBtn active={installLevel === "standard"} label={t("calc.opt_standard")} onClick={() => setInstallLevel("standard")} />
                  <OptionBtn active={installLevel === "complex"} label={t("calc.opt_complex")} onClick={() => setInstallLevel("complex")} />
                  <OptionBtn active={installLevel === "hard"} label={t("calc.opt_hard")} onClick={() => setInstallLevel("hard")} />
                </div>
              </div>
            </SectionGroup>

            {/* Группа 3: Архив */}
            <SectionGroup icon={HardDrive} title={t("calc.group_archive")} className="md:col-span-2">
              <div className="flex flex-col gap-2 w-full max-w-full">
                <label className="font-semibold text-[11px] uppercase tracking-wider flex justify-between items-center text-muted-foreground">
                  <span>{t("calc.archive")}</span>
                  <span className="text-foreground font-bold bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md">{archiveDays} {t("calc.days")}</span>
                </label>
                <input 
                  type="range" min="7" max="30" step="1" value={archiveDays} 
                  onChange={(e) => setArchiveDays(Number(e.target.value))} 
                  className="w-full max-w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600 dark:accent-red-500" 
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-medium pt-2 px-1">
                  <span>7 {t("calc.days")}</span>
                  <span>14 {t("calc.days")}</span>
                  <span>30 {t("calc.days")}</span>
                </div>
              </div>
            </SectionGroup>

          </motion.div>

          {/* === ПРАВАЯ ПАНЕЛЬ ИТОГА === */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} 
            className="lg:col-span-4 sticky top-24 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#222] rounded-xl p-6 sm:p-7 flex flex-col shadow-sm w-full max-w-full"
          >
            <h3 className="text-sm font-semibold mb-5 flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <Activity size={16} className="text-foreground shrink-0" /> {t("calc.summary_title")}
            </h3>
            
            <div className="space-y-3 mb-6 text-xs font-medium text-foreground w-full">
              <div className="flex justify-between items-center gap-2 border-b border-gray-200 dark:border-[#222] pb-2">
                <span className="text-muted-foreground">{t("calc.cameras")}</span> 
                <span className="font-semibold">{cameras} {t("calc.pcs")}</span>
              </div>
              <div className="flex justify-between items-center gap-2 border-b border-gray-200 dark:border-[#222] pb-2">
                <span className="text-muted-foreground">{t("calc.cable")}</span> 
                <span className="font-semibold">{cable} {t("calc.meters")}</span>
              </div>
              <div className="flex justify-between items-center gap-2 border-b border-gray-200 dark:border-[#222] pb-2">
                <span className="text-muted-foreground">PoE Свитчи:</span> 
                <span className="font-semibold text-right">{poeSummary || "-"}</span>
              </div>
              <div className="flex justify-between items-center gap-2 pt-1">
                <span className="flex items-center gap-1.5 text-muted-foreground shrink-0"><Settings2 size={14}/> {t("calc.archive")}:</span> 
                <span className="font-semibold whitespace-nowrap">HDD ~{calculatedTB} ТБ</span>
              </div>
            </div>

            <div className="mb-6 bg-white dark:bg-black p-4 rounded-lg border border-gray-200 dark:border-[#222] w-full max-w-full">
              <p className="text-[10px] uppercase font-semibold tracking-widest text-muted-foreground mb-1">{t("calc.approx_cost")}</p>
              <div className="text-3xl xl:text-4xl font-extrabold tracking-tighter text-foreground flex items-baseline gap-2">
                {totalPrice.toLocaleString('ru-RU')} <span className="text-red-600 dark:text-red-500 text-lg font-bold">₸</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-4 text-center mt-auto w-full max-w-full">
                  <CheckCircle2 className="text-green-600 dark:text-green-500 mx-auto mb-2" size={28} />
                  <p className="text-green-800 dark:text-green-400 font-semibold text-xs leading-tight">{t("calc.success")}<br/><span className="text-[10px] font-medium opacity-80 mt-1 block">{t("calc.wait")}</span></p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-3 mt-auto w-full max-w-full">
                  <input 
                    required type="tel" value={phone} onChange={handlePhoneChange} maxLength={18} placeholder="+7 (___) ___" 
                    className="w-full max-w-full h-11 rounded-md bg-white dark:bg-black border border-gray-300 dark:border-[#333] px-3 outline-none focus:border-foreground dark:focus:border-white transition-colors font-mono text-xs text-foreground placeholder:text-muted-foreground" 
                  />
                  <button disabled={isSubmitting || phone.length < 18} className="w-full max-w-full h-11 bg-foreground text-background hover:opacity-90 disabled:opacity-50 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={14} /> {t("calc.btn")}</>}
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