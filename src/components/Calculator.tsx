"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Camera, HardDrive, Wrench, Shield, 
  Send, CheckCircle2, Loader2, Calculator as CalcIcon,
  Network
} from "lucide-react"
import { useInView } from "react-intersection-observer"

// --- ЦЕНЫ ДЛЯ НАСТРОЙКИ (В ТЕНГЕ) ---
const PRICES = {
  // Камеры
  cameraBase: 12000,
  res2MP: 0,
  res4MP: 8000,
  res8MP: 25000,
  typeIndoor: 0,
  typeOutdoor: 4000,

  // Видеорегистраторы (NVR / DVR)
  nvr4: 25000,
  nvr8: 35000,
  nvr16: 60000,
  nvr32: 110000,

  // Питание / PoE Коммутаторы
  power4: 12000,
  power8: 22000,
  power16: 45000,
  power32: 85000,

  // Кабель (цена за 1 метр UTP/Коаксиала + расходники)
  cablePerMeter: 150,

  // Жесткие диски
  hdd1Week: 18000,
  hdd2Weeks: 32000,
  hdd1Month: 55000,

  // Монтаж
  installStandard: 8000,
  installComplex: 15000,
}

interface CalculatorProps {
  onClose?: () => void;
}

export const Calculator = ({ onClose }: CalculatorProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  // СТЕЙТЫ
  const [cameras, setCameras] = useState<number>(4)
  const [cable, setCable] = useState<number>(100) // Длина кабеля по умолчанию
  const [resolution, setResolution] = useState<"2MP" | "4MP" | "8MP">("2MP")
  const [camType, setCamType] = useState<"Внутренние" | "Уличные" | "Микс">("Внутренние")
  const [archive, setArchive] = useState<"1 неделя" | "2 недели" | "1 месяц">("2 недели")
  const [install, setInstall] = useState<"Стандарт" | "Сложный (высота/улица)">("Стандарт")
  
  const [totalPrice, setTotalPrice] = useState(0)

  // ФОРМА
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // ЯДРО КАЛЬКУЛЯТОРА
  useEffect(() => {
    let price = 0
    
    // 1. Камеры
    let camPrice = PRICES.cameraBase
    if (resolution === "4MP") camPrice += PRICES.res4MP
    if (resolution === "8MP") camPrice += PRICES.res8MP
    if (camType === "Уличные" || camType === "Микс") camPrice += PRICES.typeOutdoor
    price += camPrice * cameras

    // 2. Автоматический подбор NVR и Питания (по градациям)
    let nvrPrice = 0
    let powerPrice = 0
    
    if (cameras <= 4) {
      nvrPrice = PRICES.nvr4
      powerPrice = PRICES.power4
    } else if (cameras <= 8) {
      nvrPrice = PRICES.nvr8
      powerPrice = PRICES.power8
    } else if (cameras <= 16) {
      nvrPrice = PRICES.nvr16
      powerPrice = PRICES.power16
    } else {
      nvrPrice = PRICES.nvr32
      powerPrice = PRICES.power32
    }
    price += nvrPrice + powerPrice

    // 3. Кабель
    price += cable * PRICES.cablePerMeter

    // 4. Жесткий диск (добавляем доп. диски если камер много)
    let hddPrice = PRICES.hdd1Week
    if (archive === "2 недели") hddPrice = PRICES.hdd2Weeks
    if (archive === "1 месяц") hddPrice = PRICES.hdd1Month
    price += hddPrice * (Math.ceil(cameras / 4)) // Грубый расчет: 1 диск нужного объема на каждые 4 камеры

    // 5. Монтаж
    let installPrice = install === "Стандарт" ? PRICES.installStandard : PRICES.installComplex
    price += installPrice * cameras

    setTotalPrice(price)
  }, [cameras, cable, resolution, camType, archive, install])

  // МАСКА ТЕЛЕФОНА
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
    if (phone.length !== 18) { alert("Пожалуйста, введите корректный номер телефона."); return }

    setIsSubmitting(true)

    // Определяем какое оборудование было подобрано
    let equipLevel = cameras <= 4 ? "4-канальное" : cameras <= 8 ? "8-канальное" : cameras <= 16 ? "16-канальное" : "32-канальное"

    const formData = new FormData()
    formData.append("name", "Клиент из Калькулятора")
    formData.append("company", "КАЛЬКУЛЯТОР")
    formData.append("rating", "0")
    
    const text = `
📞 Телефон: ${phone}
💰 Предварительная цена: ${totalPrice.toLocaleString()} ₸

📊 ПАРАМЕТРЫ:
• Камер: ${cameras} шт.
• Кабель: ${cable} метров
• Качество: ${resolution}
• Тип: ${camType}
• Архив: ${archive}
• Монтаж: ${install}

⚙️ АВТОМАТИКА:
• Регистратор и Питание: ${equipLevel} (подобрано алгоритмом)
    `
    formData.append("text", text)

    try {
      await fetch("/api/telegram", { method: "POST", body: formData })
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        setPhone("")
        if (onClose) onClose()
      }, 3000)
    } catch (error) {
      alert("Ошибка. Пожалуйста, напишите в WhatsApp.")
      setIsSubmitting(false)
    } 
  }

  const OptionBtn = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
    <button type="button" onClick={onClick} className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${active ? "bg-red-600 text-white shadow-lg shadow-red-500/30 scale-[1.02]" : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border"}`}>
      {label}
    </button>
  )

  return (
    <section id="calculator" className="relative min-h-screen py-12 sm:py-24 bg-background overflow-hidden flex flex-col justify-center">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-900/5 blur-[150px] rounded-full" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 mx-auto max-w-6xl mt-12 sm:mt-0">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 font-semibold text-sm mb-4">
            <CalcIcon size={16} /> Онлайн расчет
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Соберите свою <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">систему</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">Выберите параметры, чтобы получить предварительную смету. Точная стоимость фиксируется после бесплатного выезда инженера.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start pb-20 sm:pb-0">
          
          {/* ПАНЕЛЬ НАСТРОЕК */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-white/5 dark:bg-[#0a0a0a]/50 backdrop-blur-xl border border-border rounded-[32px] p-5 sm:p-8 space-y-6 sm:space-y-8 shadow-xl">
            
            {/* ПОЛЗУНКИ (КАМЕРЫ И КАБЕЛЬ) */}
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 bg-muted/20 p-4 sm:p-6 rounded-2xl border border-border/50">
              {/* Камеры */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="font-bold flex items-center gap-2"><Camera size={18} className="text-red-500"/> Камеры: <span className="text-xl text-red-600">{cameras}</span></label>
                </div>
                <input type="range" min="1" max="32" value={cameras} onChange={(e) => setCameras(Number(e.target.value))} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-red-600" />
                <div className="flex justify-between text-xs text-muted-foreground font-medium"><span>1 шт</span><span>32 шт</span></div>
              </div>

              {/* Кабель */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="font-bold flex items-center gap-2"><Network size={18} className="text-red-500"/> Кабель: <span className="text-xl text-red-600">{cable} м</span></label>
                </div>
                <input type="range" min="10" max="1000" step="10" value={cable} onChange={(e) => setCable(Number(e.target.value))} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-red-600" />
                <div className="flex justify-between text-xs text-muted-foreground font-medium"><span>10 м</span><span>1000 м</span></div>
              </div>
            </div>

            {/* КНОПКИ ПАРАМЕТРОВ */}
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3"><label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Разрешение</label>
                <div className="grid grid-cols-3 gap-2">
                  <OptionBtn active={resolution === "2MP"} label="2 Мп" onClick={() => setResolution("2MP")} />
                  <OptionBtn active={resolution === "4MP"} label="4 Мп" onClick={() => setResolution("4MP")} />
                  <OptionBtn active={resolution === "8MP"} label="8 Мп" onClick={() => setResolution("8MP")} />
                </div>
              </div>
              <div className="space-y-3"><label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Расположение</label>
                <div className="grid grid-cols-3 gap-2">
                  <OptionBtn active={camType === "Внутренние"} label="Внутри" onClick={() => setCamType("Внутренние")} />
                  <OptionBtn active={camType === "Уличные"} label="Улица" onClick={() => setCamType("Уличные")} />
                  <OptionBtn active={camType === "Микс"} label="Микс" onClick={() => setCamType("Микс")} />
                </div>
              </div>
              <div className="space-y-3"><label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><HardDrive size={16}/> Архив записей</label>
                <div className="grid grid-cols-3 gap-2">
                  <OptionBtn active={archive === "1 неделя"} label="7 дней" onClick={() => setArchive("1 неделя")} />
                  <OptionBtn active={archive === "2 недели"} label="14 дней" onClick={() => setArchive("2 недели")} />
                  <OptionBtn active={archive === "1 месяц"} label="30 дней" onClick={() => setArchive("1 месяц")} />
                </div>
              </div>
              <div className="space-y-3"><label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Wrench size={16}/> Сложность монтажа</label>
                <div className="grid grid-cols-2 gap-2">
                  <OptionBtn active={install === "Стандарт"} label="Стандарт" onClick={() => setInstall("Стандарт")} />
                  <OptionBtn active={install === "Сложный (высота/улица)"} label="Высота" onClick={() => setInstall("Сложный (высота/улица)")} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ПАНЕЛЬ ИТОГА */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }} className="bg-foreground text-background rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[50px] rounded-full" />
            
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield className="text-red-500" /> Итоговая смета</h3>
              <p className="text-background/60 text-sm mb-6">Включает оборудование, кабель и работу под ключ.</p>
              
              <div className="mb-8">
                <span className="text-sm font-bold uppercase tracking-widest text-background/50">Примерная стоимость</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <motion.span key={totalPrice} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-black tracking-tighter">
                    {totalPrice.toLocaleString('ru-RU')}
                  </motion.span>
                  <span className="text-2xl text-red-500 font-bold">₸</span>
                </div>
              </div>

              <div className="space-y-3 mb-8 text-sm font-medium border-t border-background/10 pt-6">
                <div className="flex justify-between"><span>Камеры:</span> <span>{cameras} шт. ({resolution})</span></div>
                <div className="flex justify-between"><span>Кабель:</span> <span>{cable} м.</span></div>
                <div className="flex justify-between"><span>Архив:</span> <span>{archive}</span></div>
                
                {/* Подсказка для клиента, что оборудование включено */}
                <div className="flex justify-between text-background/50 text-xs mt-4 pt-4 border-t border-background/5">
                  <span>* Регистратор и Питание:</span> <span>Включены в расчет</span>
                </div>
              </div>
            </div>

            {/* ФОРМА ОТПРАВКИ */}
            <div className="mt-auto">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex flex-col items-center text-center">
                    <CheckCircle2 className="text-green-500 mb-2" size={32} />
                    <span className="font-bold text-green-400">Расчет отправлен!</span>
                    <span className="text-xs text-background/70 mt-1">Мы свяжемся с вами за 10 минут.</span>
                  </motion.div>
                ) : (
                  <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-3">
                    <input 
                      required 
                      type="tel" 
                      value={phone} 
                      onChange={handlePhoneChange}
                      maxLength={18}
                      placeholder="+7 (___) ___-__-__" 
                      className="w-full h-12 px-4 rounded-xl bg-background/10 border border-background/20 focus:border-red-500 text-background placeholder:text-background/40 outline-none transition-all"
                    />
                    <button 
                      disabled={isSubmitting || phone.length !== 18}
                      type="submit" 
                      className="w-full h-12 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Получить точный расчет</>}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}