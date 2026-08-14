import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { 
  Cctv, Flame, ShieldCheck, Network, 
  X, ChevronRight, BookOpen, Loader2, Info
} from "lucide-react";
import { GlobalBackground } from "../components/GlobalBackground";
import { SbaPlanner } from "../components/SbaPlanner";

// === ДАННЫЕ ДЛЯ ШПАРГАЛОК ===
const cheatSheets = [
  {
    id: 'cctv',
    title: 'Видеонаблюдение',
    desc: 'Архив, настройка времени, камеры',
    icon: Cctv,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    guides: [
      {
        q: 'Как настроить время на регистраторе Hikvision / HiWatch?',
        a: '1. Нажмите правой кнопкой мыши и войдите в Главное меню.\n2. Перейдите в раздел "Система" (System) -> "Общие" (General).\n3. В поле "Часовой пояс" выберите GMT+5 (для Актау).\n4. Настройте системное время вручную или поставьте галочку NTP (синхронизация через интернет).\n5. Нажмите "Применить" (Apply).'
      },
      {
        q: 'Как выгрузить видеоархив на USB-флешку?',
        a: '1. Вставьте флешку (формат FAT32) в USB-порт регистратора.\n2. Зайдите в Главное меню -> "Воспроизведение" или "Экспорт".\n3. Выберите нужную камеру, дату и время начала/конца.\n4. Нажмите "Экспорт", выберите вашу флешку в списке и формат MP4.\n5. Дождитесь окончания загрузки.'
      },
      {
        q: 'Камера показывает черный экран ("No Video"). Что делать?',
        a: '1. Проверьте, светится ли ИК-подсветка на камере (закройте датчик света пальцем).\n2. Перезагрузите коммутатор или блок питания камер (вытащите из розетки на 10 секунд).\n3. Проверьте целостность кабеля возле камеры и регистратора.\n4. Если не помогло — свяжитесь с техподдержкой SBA.'
      }
    ]
  },
  {
    id: 'fire',
    title: 'Пожарная система (АПС)',
    desc: 'Датчики, сброс тревоги, пульт',
    icon: Flame,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    guides: [
      {
        q: 'Как правильно очистить дымовой датчик от пыли?',
        a: 'Пыль часто вызывает ложные срабатывания. \n1. Не используйте влажные тряпки!\n2. Снимите датчик (повернув против часовой стрелки).\n3. Продуйте его сжатым воздухом (баллончиком) или аккуратно пропылесосьте на минимальной мощности.\n4. Установите обратно до щелчка.'
      },
      {
        q: 'Как сбросить звуковую тревогу при ложном срабатывании?',
        a: 'На приемно-контрольном приборе (пульте):\n1. Введите код доступа пользователя (если требуется).\n2. Нажмите кнопку "Сброс" (Reset) или "Откл. Звука".\n3. Убедитесь, что причина тревоги устранена (например, проветрено помещение от дыма).'
      },
      {
        q: 'Что означают индикаторы на датчике?',
        a: '• Редкое мигание (раз в 5-10 сек) — дежурный режим, всё работает штатно.\n• Постоянное свечение красным — зафиксирована тревога (дым/огонь).\n• Отсутствие мигания вообще — нет питания, обрыв линии или неисправность датчика.'
      }
    ]
  },
  {
    id: 'access',
    title: 'Охранка и СКУД',
    desc: 'Магнитные замки, ключи, коды',
    icon: ShieldCheck,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    guides: [
      {
        q: 'Как добавить новый ключ (брелок) в систему?',
        a: 'Вам понадобится "Мастер-ключ" (выдается при монтаже):\n1. Приложите Мастер-ключ к считывателю (раздастся длинный писк).\n2. По очереди прикладывайте новые ключи, которые нужно добавить (каждый подтвердится коротким писком).\n3. Снова приложите Мастер-ключ для выхода из режима записи.'
      },
      {
        q: 'Магнитный замок слабо держит дверь. Причина?',
        a: '1. Проверьте пластину на самой двери — она должна немного "люфтить", чтобы плотно прилегать к магниту.\n2. Протрите поверхность магнита и пластины спиртом (грязь сильно снижает силу удержания).\n3. Возможно, упало напряжение в блоке питания (требуется выезд инженера).'
      },
      {
        q: 'Как поставить помещение на охрану?',
        a: 'На клавиатуре охранной панели:\n1. Убедитесь, что все двери и окна закрыты (индикатор готовности горит зеленым).\n2. Введите ваш персональный PIN-код.\n3. Нажмите кнопку "Взятие" (или Away).\n4. Покиньте помещение до окончания обратного отсчета (обычно 30-60 секунд).'
      }
    ]
  },
  {
    id: 'it',
    title: 'IT и Локальные сети',
    desc: 'Роутеры, интернет, коммутаторы',
    icon: Network,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    guides: [
      {
        q: 'Как правильно перезагрузить сетевое оборудование?',
        a: 'Никогда не используйте кнопку Reset (она сбросит все настройки до заводских)!\n1. Отключите блок питания роутера/коммутатора из розетки.\n2. Подождите минимум 15 секунд (чтобы сбросить кэш памяти).\n3. Включите обратно и подождите 2-3 минуты до полной загрузки.'
      },
      {
        q: 'Пропал интернет в офисе. Базовая диагностика',
        a: '1. Проверьте роутер: горит ли индикатор WAN/Internet.\n2. Перезагрузите роутер по питанию (см. пункт выше).\n3. Если интернета всё еще нет, подключите кабель провайдера напрямую в ноутбук.\n4. Если напрямую работает — проблема в роутере/сети. Если не работает — звоните провайдеру (Казахтелеком и т.д.).'
      },
      {
        q: 'Компьютер не видит сеть (кабель подключен)',
        a: '1. Проверьте патч-корд (кабель от розетки до ПК) — защелки должны быть целыми.\n2. Посмотрите на порт в компьютере — там должны мигать зеленый/желтый светодиоды.\n3. Попробуйте вставить кабель в другой порт на коммутаторе.\n4. Проверьте настройки адаптера в Windows (не сбились ли IP-адреса).'
      }
    ]
  }
];

export const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [activeSheet, setActiveSheet] = useState<typeof cheatSheets[0] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (activeSheet) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [activeSheet]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  const isAdmin = user?.publicMetadata?.role === "admin";
  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <div className="relative min-h-screen flex flex-col pt-32 pb-20 px-4 md:px-6">
      <GlobalBackground />
      <Navbar />
      
      <main className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col gap-8">
        
        {isAdmin ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                Рабочий стол <span className="text-red-600">Админа</span>
              </h1>
              <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-red-500/20 w-fit">
                Admin Mode
              </div>
            </div>
            <div className="w-full bg-background/80 border border-border rounded-[32px] p-4 md:p-8 backdrop-blur-xl shadow-xl min-h-[700px] overflow-hidden">
              <SbaPlanner />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto mt-4">
            
            <div className="flex flex-col text-center items-center mb-6">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen size={28} className="text-red-600" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-foreground leading-none">
                База знаний <span className="text-red-600">Клиента</span>
              </h1>
              <p className="text-muted-foreground text-[15px] max-w-lg font-medium">
                Быстрые инструкции и шпаргалки по эксплуатации ваших систем безопасности. Выберите нужную категорию.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {cheatSheets.map((sheet) => (
                <button
                  key={sheet.id}
                  onClick={() => setActiveSheet(sheet)}
                  className="group relative flex flex-col items-start p-6 md:p-8 rounded-[24px] bg-background/50 backdrop-blur-md border border-border hover:border-red-500/30 transition-all duration-300 text-left overflow-hidden"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${sheet.bg} ${sheet.color} ${sheet.border} group-hover:scale-110 transition-transform duration-500`}>
                    <sheet.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-red-600 transition-colors">
                    {sheet.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mb-6">
                    {sheet.desc}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/50 group-hover:text-red-500 transition-colors">
                    Открыть инструкции <ChevronRight size={14} />
                  </div>

                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-foreground/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-[24px] bg-muted/30 border border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <Info size={24} className="text-muted-foreground shrink-0 hidden sm:block" />
                <p className="text-sm font-medium text-muted-foreground">
                  Не нашли ответ на свой вопрос? Инженеры SBA всегда на связи и готовы помочь удаленно.
                </p>
              </div>
              <a 
                href="https://wa.me/77779204988" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="shrink-0 px-6 py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-colors"
              >
                Поддержка
              </a>
            </div>

          </div>
        )}
      </main>

      {/* ИСПРАВЛЕННЫЙ ПОРТАЛ: Добавлен key и безопасные проверки */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence mode="wait">
          {activeSheet && (
            <motion.div 
              key="cheat-sheet-modal" // <-- ВОТ ОН СПАСИТЕЛЬ ОТ БЕЛОГО ЭКРАНА
              className="fixed inset-0 z-[10000] flex justify-end text-foreground overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                onClick={() => setActiveSheet(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              />

              <motion.div
                initial={{ x: "100%", opacity: 0 }} animate={{ x: "0%", opacity: 1 }} exit={{ x: "100%", opacity: 0 }} 
                transition={{ duration: 0.5, ease: smoothEase }}
                className="relative w-full max-w-lg h-full bg-background border-l border-border/50 shadow-2xl flex flex-col z-[10001]"
              >
                <div className="flex-shrink-0 relative z-30 flex items-center justify-between p-6 sm:p-8 border-b border-border/50 bg-muted/10">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${activeSheet?.bg || ''} ${activeSheet?.color || ''} ${activeSheet?.border || ''}`}>
                      {/* Безопасный рендер иконки */}
                      {activeSheet?.icon && <activeSheet.icon size={20} />}
                    </div>
                    <h3 className="font-bold text-lg tracking-tight uppercase">{activeSheet?.title}</h3>
                  </div>
                  
                  <button onClick={() => setActiveSheet(null)} className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-border hover:border-red-500 hover:text-red-500 transition-colors text-muted-foreground">
                    <X size={18} />
                  </button>
                </div>

                <div className="relative z-30 px-6 sm:px-8 pb-10 pt-8 flex-grow overflow-y-auto flex flex-col gap-8 custom-scrollbar">
                  {/* Безопасный map */}
                  {activeSheet?.guides?.map((guide, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                      <h4 className="text-base font-bold text-foreground leading-snug flex gap-3">
                        <span className="text-red-600 font-black">Q:</span> {guide.q}
                      </h4>
                      <div className="text-[14px] text-muted-foreground font-medium leading-relaxed bg-muted/30 p-4 rounded-2xl border border-border/50 whitespace-pre-line">
                        {guide.a}
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-8 pt-8 border-t border-border/50 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-4">
                      Нужна помощь специалиста?
                    </p>
                    <a href="https://wa.me/77779204988" target="_blank" rel="noopener noreferrer" className="inline-flex w-full justify-center items-center px-6 py-4 bg-red-600/10 text-red-600 border border-red-600/20 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-colors">
                      Связаться с инженером
                    </a>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};