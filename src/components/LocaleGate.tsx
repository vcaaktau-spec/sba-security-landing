import { useRef } from "react"
import { useTranslation } from "react-i18next"

interface LocaleGateProps {
  lang: string
  children: React.ReactNode
}

// URL — источник правды для ru/en, но kz намеренно не имеет своего URL
// (см. src/lib/locale.ts) — это единственный язык, который живёт только в
// i18n.language поверх любого ru/en маршрута. Раньше синхронизация шла
// при КАЖДОМ рендере, пока i18n.language !== lang — из-за этого выбор kz
// на переключателе языка (Navbar) немедленно откатывался обратно: смена
// языка триггерит ре-рендер LocaleGate, а тот видит несовпадение с lang
// маршрута и тут же зовёт changeLanguage(lang) снова, стирая kz. Теперь
// синхронизация происходит только когда сам prop lang меняется (реальная
// навигация ru↔en), а не при любом рассинхроне — так kz-выбор переживает
// ре-рендеры на том же маршруте.
export const LocaleGate = ({ lang, children }: LocaleGateProps) => {
  const { i18n } = useTranslation()
  const lastLangRef = useRef<string | null>(null)
  if (lastLangRef.current !== lang) {
    lastLangRef.current = lang
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }
  return <>{children}</>
}
