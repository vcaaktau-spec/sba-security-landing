"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { 
  Send, CheckCircle2, Loader2, Calculator as CalcIcon, HardDrive, 
  Video, Activity, Settings2, ShieldCheck, Home, Store, Factory 
} from "lucide-react"
import { useInView } from "react-intersection-observer"

// --- СТРОГИЕ ТИПЫ ДЛЯ TYPESCRIPT ---
type Resolution = "2MP" | "4MP" | "8MP"
type Channels = 4 | 8 | 16 | 32
type CableLoc = "indoor" | "outdoor"
type Conduit = "none" | "gofra" | "channel"
type InstallLevel = "standard" | "complex" | "hard"
type ObjectType = "home" | "commercial" | "industrial" // Новый тип для объектов

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
    "4MP": { 4: 46000, 8: 73000, 16: 115000, 32: 1700000 }, // Тут 1 700 000 в оригинале, оставил как есть
    "8MP": { 4: 71000, 8: 118000, 16: 172000, 32: 284000 }
  } as Record<Resolution, Record<Channels, number>>,

  poe: { 4: 21000, 8: 36000, 16: 87000 } as Record<number, number>,

  cableIndoor: 220,
  cableOutdoor: 280,

  conduitNone: 0,
  conduitGofra: 150,
  conduitChannel: 350,

  // Динамическая стоимость монтажа в зависимости от типа объекта
  install: {
    home: {
      "standard": 15000,
      "complex": 20000,
      "hard": 35000,
    },
    commercial: {
      "standard": 20000,
      "complex": 25000,
      "hard": 40000,
    },
    industrial: {
      "standard": 30000,
      "complex": 35000,
      "hard": 45000,
    }
  } as Record<ObjectType, Record<InstallLevel, number>>
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
  const [objectType, setObjectType] = useState<ObjectType>("home") // Новый стейт
  const [cameras, setCameras] = useState<number>(4)
  const [cable, setCable] = useState<number>(200)
  const [resolution, setResolution] = useState<Resolution>("2MP")
  const [cableLoc, setCableLoc] = useState<CableLoc>("indoor")
  const [conduit, setConduit] = useState<Conduit>("channel")
  const [archiveDays, setArchiveDays] = useState<number>(7)
  const [installLevel, setInstallLevel] = useState<InstallLevel>("standard") // По умолчанию standard
  
  const [phone, setPhone] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  // --- ЛОГИКА ПОШАГОВОГО КВИЗА (ТЕПЕРЬ 5 ШАГОВ) ---
  const [step, setStep] = useState<number>(1)
  const [direction, setDirection] = useState<number>(0)

  const nextStep = () => { setDirection(1); setStep((s) => Math.min(s + 1, 5)) }
  const prevStep = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)) }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 40 : -40, opacity: 0, position: "absolute" as any })
  }

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

  // Расчет стоимости монтажа с учетом типа объекта
  const installCost = PRICES.install[objectType][installLevel] * cameras
  
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
    const objectNames = { home: "Дом/Квартира", commercial: "Магазин/Офис", industrial: "Производство/Склад" }

const text = `📞 Тел: ${phone}
💰 ИТОГО: ${totalPrice.toLocaleString('ru-RU')} ₸

📍 ОБЪЕКТ: ${objectNames[objectType]}

📊 ОБОРУДОВАНИЕ:
• Камеры: ${cameras} шт. (${resolution})
• Регистратор: На ${nvrChannels} каналов
• PoE Свитчи: ${poeSummary || "Не требуется"}
• Жесткий диск: ~${calculatedTB} ТБ (Архив ${archiveDays} дней)

🛠 МОНТАЖ И МАТЕРИАЛЫ:
• Кабель: ${cable} м. (${locNames[cableLoc]})
• Защита трассы: ${conduitNames[conduit]}
• Сложность работ: ${installNames[installLevel]}`;

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

  const ObjectCard = ({ active, icon: Icon, title, onClick }: { active: boolean, icon: any, title: string, onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-300 gap-3 ${
        active 
          ? "border-red-500 bg-red-500/10 text-foreground" 
          : "border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      }`}
    >
      <Icon size={32} className={active ? "text-red-500" : ""} />
      <span className="font-bold text-sm text-center">{title}</span>
    </button>
  )

  return (
    <section id="calculator" className="relative py-8 md:py-16 bg-white dark:bg-[#000] text-foreground font-sans selection:bg-red-500/30 overflow-hidden">
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 w-full max-w-full">
        
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* === ЛЕВАЯ ПАНЕЛЬ (КВИЗ) === */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} 
            className="lg:col-span-8 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#222] rounded-xl p-6 sm:p-8 flex flex-col shadow-sm min-h-[480px] w-full max-w-full relative overflow-hidden"
          >
            {/* ПРОГРЕСС БАР */}
            <div className="w-full bg-gray-100 dark:bg-[#222] h-1.5 rounded-full mb-6 overflow-hidden">
              <motion.div 
                className="h-full bg-red-600 dark:bg-red-500" 
                initial={{ width: "20%" }} 
                animate={{ width: `${(step / 5) * 100}%` }} 
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} 
              />
            </div>
            <div className="text-[11px] text-muted-foreground mb-6 uppercase tracking-widest font-bold flex justify-between">
              <span>Шаг {step} из 5</span>
              {step === 5 && <span className="text-red-500">Финал</span>}
            </div>

            {/* КОНТЕНТ ШАГОВ */}
            <div className="relative flex-grow w-full">
              <AnimatePresence custom={direction} mode="wait">
                
                {/* ШАГ 1: ВЫБОР ОБЪЕКТА */}
                {step === 1 && (
                  <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6 flex flex-col w-full h-full justify-center">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold mb-2">Где планируется установка?</h3>
                      <p className="text-muted-foreground text-sm">От типа объекта зависит сложность и стоимость монтажных работ.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <ObjectCard active={objectType === "home"} icon={Home} title="Дом / Квартира" onClick={() => {setObjectType("home"); nextStep()}} />
                      <ObjectCard active={objectType === "commercial"} icon={Store} title="Магазин / Офис" onClick={() => {setObjectType("commercial"); nextStep()}} />
                      <ObjectCard active={objectType === "industrial"} icon={Factory} title="Производство / Склады" onClick={() => {setObjectType("industrial"); nextStep()}} />
                    </div>
                  </motion.div>
                )}

                {/* ШАГ 2: КАМЕРЫ */}
                {step === 2 && (
                  <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6 flex flex-col w-full">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Video className="text-red-500" /> Оборудование</h3>
                    
                    <div className="flex flex-col gap-3">
                      <label className="font-semibold text-[12px] uppercase tracking-wider flex justify-between items-center text-muted-foreground">
                        <span>{t("calc.cameras")}</span>
                        <span className="text-foreground font-bold text-lg">{cameras} {t("calc.pcs")}</span>
                      </label>
                      <input type="range" min="1" max="32" value={cameras} onChange={(e) => setCameras(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600 dark:accent-red-500" />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">{t("calc.res")}</label>
                      <div className="grid grid-cols-3 gap-2">
                        <OptionBtn active={resolution === "2MP"} label={t("calc.opt_2mp")} onClick={() => setResolution("2MP")} />
                        <OptionBtn active={resolution === "4MP"} label={t("calc.opt_4mp")} onClick={() => setResolution("4MP")} />
                        <OptionBtn active={resolution === "8MP"} label={t("calc.opt_8mp")} onClick={() => setResolution("8MP")} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ШАГ 3: ТРАССА И МОНТАЖ */}
                {step === 3 && (
                  <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6 flex flex-col w-full">
                    <h3 className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="text-red-500" /> Монтаж и Трасса</h3>
                    
                    <div className="flex flex-col gap-3">
                      <label className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">{t("calc.placement")}</label>
                      <div className="grid grid-cols-2 gap-2">
                        <OptionBtn active={cableLoc === "indoor"} label={t("calc.opt_inside")} onClick={() => setCableLoc("indoor")} />
                        <OptionBtn active={cableLoc === "outdoor"} label={t("calc.opt_outside")} onClick={() => setCableLoc("outdoor")} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="font-semibold text-[12px] uppercase tracking-wider flex justify-between items-center text-muted-foreground">
                        <span>Длина кабеля</span>
                        <span className="text-foreground font-bold text-lg">{cable} м</span>
                      </label>
                      <input type="range" min="10" max="1000" step="10" value={cable} onChange={(e) => setCable(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600 dark:accent-red-500" />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">{t("calc.protection_route")}</label>
                      <div className="grid grid-cols-3 gap-2">
                        <OptionBtn active={conduit === "none"} label={t("calc.opt_none")} onClick={() => setConduit("none")} />
                        <OptionBtn active={conduit === "gofra"} label={t("calc.opt_gofra")} onClick={() => setConduit("gofra")} />
                        <OptionBtn active={conduit === "channel"} label={t("calc.opt_channel")} onClick={() => setConduit("channel")} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">{t("calc.install")}</label>
                      <div className="grid grid-cols-3 gap-2">
                        <OptionBtn active={installLevel === "standard"} label={t("calc.opt_standard")} onClick={() => setInstallLevel("standard")} />
                        <OptionBtn active={installLevel === "complex"} label={t("calc.opt_complex")} onClick={() => setInstallLevel("complex")} />
                        <OptionBtn active={installLevel === "hard"} label={t("calc.opt_hard")} onClick={() => setInstallLevel("hard")} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ШАГ 4: ХРАНЕНИЕ */}
                {step === 4 && (
                  <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6 flex flex-col w-full">
                    <h3 className="text-xl font-bold flex items-center gap-2"><HardDrive className="text-red-500" /> Хранение данных</h3>
                    
                    <div className="flex flex-col gap-4 mt-4">
                      <label className="font-semibold text-[12px] uppercase tracking-wider flex justify-between items-center text-muted-foreground">
                        <span>Срок хранения видео</span>
                        <span className="text-foreground font-bold text-lg bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-md">{archiveDays} {t("calc.days")}</span>
                      </label>
                      <input type="range" min="7" max="30" step="1" value={archiveDays} onChange={(e) => setArchiveDays(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600 dark:accent-red-500 mt-2" />
                      <div className="flex justify-between text-[11px] text-muted-foreground font-medium px-1">
                        <span>Неделя (7)</span>
                        <span>Две недели (14)</span>
                        <span>Месяц (30)</span>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-xl border border-border mt-4">
                      <p className="text-sm text-muted-foreground">Система автоматически подберет жесткий диск на <strong className="text-foreground">{calculatedTB} ТБ</strong> для обеспечения требуемого архива.</p>
                    </div>
                  </motion.div>
                )}

                {/* ШАГ 5: ФИНАЛ */}
                {step === 5 && (
                  <motion.div key="step5" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="space-y-6 flex flex-col w-full h-full justify-center">
                    
                    {isSuccess ? (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-10">
                        <CheckCircle2 className="text-green-500 mb-4" size={50} />
                        <h3 className="text-2xl font-bold mb-2">Смета успешно отправлена!</h3>
                        <p className="text-muted-foreground text-sm max-w-xs">{t("calc.success")} {t("calc.wait")}</p>
                      </motion.div>
                    ) : (
                      <>
                        <div className="text-center mb-4">
                          <h3 className="text-2xl font-extrabold mb-2">Остался один шаг!</h3>
                          <p className="text-muted-foreground text-sm">Оставьте ваш номер, чтобы мы зафиксировали расчет и связались с вами в WhatsApp.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto w-full">
                          <div className="relative">
                            <input 
                              required type="tel" inputMode="tel" value={phone} onChange={handlePhoneChange} maxLength={18} placeholder="+7 (___) ___" 
                              className="w-full h-14 rounded-xl bg-gray-50 dark:bg-black border-2 border-gray-200 dark:border-[#333] px-4 outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors font-mono text-base text-foreground placeholder:text-muted-foreground" 
                            />
                          </div>
                          <button disabled={isSubmitting || phone.length < 18} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 uppercase">
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={16} /> Получить смету</>}
                          </button>
                        </form>
                      </>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* НАВИГАЦИЯ КВИЗА */}
            {!isSuccess && step > 1 && (
              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-[#222] flex justify-between items-center z-10">
                <button onClick={prevStep} className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Назад
                </button>
                
                {step < 5 ? (
                  <button onClick={nextStep} className="px-8 py-2.5 bg-foreground text-background rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-transform">
                    Далее
                  </button>
                ) : <div />}
              </div>
            )}
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
                <span className="font-semibold">{cameras} шт.</span>
              </div>
              <div className="flex justify-between items-center gap-2 border-b border-gray-200 dark:border-[#222] pb-2">
                <span className="text-muted-foreground">Длина трассы</span> 
                <span className="font-semibold">{cable} м</span>
              </div>
              <div className="flex justify-between items-center gap-2 border-b border-gray-200 dark:border-[#222] pb-2">
                <span className="text-muted-foreground">PoE Свитчи</span> 
                <span className="font-semibold text-right">{poeSummary || "-"}</span>
              </div>
              <div className="flex justify-between items-center gap-2 border-b border-gray-200 dark:border-[#222] pb-2">
                <span className="text-muted-foreground">Сложность</span> 
                <span className="font-semibold uppercase text-[10px]">{t(`calc.opt_${installLevel}`)}</span>
              </div>
              <div className="flex justify-between items-center gap-2 pt-1">
                <span className="flex items-center gap-1.5 text-muted-foreground shrink-0"><Settings2 size={14}/> Архив:</span> 
                <span className="font-semibold whitespace-nowrap">{archiveDays} дн. (~{calculatedTB} ТБ)</span>
              </div>
            </div>

            {/* БЛОК С ЦЕНОЙ (С ИНТРИГОЙ) */}
            <div className="mt-auto bg-white dark:bg-black p-5 rounded-xl border border-gray-200 dark:border-[#222] w-full relative overflow-hidden">
              <p className="text-[10px] uppercase font-semibold tracking-widest text-muted-foreground mb-1">{t("calc.approx_cost")}</p>
              
              <div className={`text-3xl xl:text-4xl font-extrabold tracking-tighter text-foreground flex items-baseline gap-2 transition-all duration-500 ${step < 5 ? "blur-sm opacity-50 select-none" : ""}`}>
                {totalPrice.toLocaleString('ru-RU')} <span className="text-red-600 dark:text-red-500 text-lg font-bold">₸</span>
              </div>

              {step < 5 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/20 backdrop-blur-[2px]">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-foreground text-background px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Расчет...
                  </span>
                </div>
              )}
            </div>
            
            {step < 5 && (
              <p className="text-[10px] text-center text-muted-foreground mt-4">Завершите квиз, чтобы разблокировать стоимость</p>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  )
}