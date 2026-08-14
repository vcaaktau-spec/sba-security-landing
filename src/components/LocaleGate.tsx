import { useTranslation } from "react-i18next"

interface LocaleGateProps {
  lang: string
  children: React.ReactNode
}

// URL — единственный источник правды для языка на маршрутизируемых
// страницах: если i18n ещё не совпадает с языком этого маршрута,
// переключаем его прямо в теле рендера (ресурсы уже загружены синхронно,
// changeLanguage идемпотентен — это не async-эффект с "миганием" контента).
export const LocaleGate = ({ lang, children }: LocaleGateProps) => {
  const { i18n } = useTranslation()
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang)
  }
  return <>{children}</>
}
