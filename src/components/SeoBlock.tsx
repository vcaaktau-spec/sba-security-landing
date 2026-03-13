"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

export const SeoBlock = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="w-full max-w-[1200px] mx-auto px-6 pt-4 pb-8 border-t border-border/10">
      <div className="flex flex-col items-center">
        
        {/* Кнопка-спойлер */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground/40 hover:text-foreground transition-colors"
        >
          <span>SEO & Информация о компании</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={14} />
          </motion.div>
        </button>

        {/* Раскрывающийся текст */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden w-full"
            >
              <div className="flex flex-col gap-4 text-[11px] leading-relaxed text-muted-foreground/40 text-justify sm:text-left pt-6 pb-2">
                <h2 className="sr-only">Профессиональная установка систем видеонаблюдения в Актау</h2>
                <p>
                  <strong>Компания SBA (Система Безопасности Актау)</strong> — ваш надежный партнер в сфере интеграции современных систем безопасности и IT-инфраструктуры в Актау и Мангистауской области. Мы специализируемся на профессиональном проектировании и монтаже систем видеонаблюдения (CCTV) премиум-класса для частных домов, квартир, магазинов, офисов и крупных промышленных складов. Работая исключительно с сертифицированным оборудованием от мировых брендов (Hikvision, Dahua, Tiandy, Ezviz), мы гарантируем бесперебойную работу и высокое разрешение записи в любых условиях.
                </p>
                <p>
                  В комплекс наших услуг входит не только установка камер видеонаблюдения, но и настройка защищенного удаленного доступа через смартфон, внедрение систем контроля и управления доступом (СКУД), монтаж охранно-пожарной сигнализации (ОПС) и построение надежных корпоративных сетей (Wi-Fi, СКС). Мы гордимся эстетичным монтажом — скрытая прокладка кабеля, использование кабель-каналов и гофры, отсутствие "висящих проводов" и строительного мусора после завершения работ.
                </p>
                <p>
                  Заказывая установку систем безопасности под ключ в Актау у нас, вы получаете точный расчет сметы (через наш встроенный онлайн-калькулятор), индивидуальный подбор жестких дисков для долгосрочного архива видео и официальную гарантию на оборудование и монтаж. Доверьте защиту вашего бизнеса и имущества профессионалам SBA.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}