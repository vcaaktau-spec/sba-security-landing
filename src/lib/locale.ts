// Единственная поддерживаемая на URL-уровне пара: "" (ru, дефолт, без префикса) и "en".
// kz остаётся только переключателем интерфейса (i18n.language === 'kz') без своего URL —
// см. docs аудита: казахский требует проверки носителем языка перед публикацией отдельных страниц.
const EN_PREFIX = "/en"

export function stripLocalePrefix(pathname: string): string {
  if (pathname === EN_PREFIX) return "/"
  if (pathname.startsWith(EN_PREFIX + "/")) return pathname.slice(EN_PREFIX.length) || "/"
  return pathname
}

export function withLocalePrefix(path: string, lang: string): string {
  if (lang !== "en") return path
  return path === "/" ? EN_PREFIX : `${EN_PREFIX}${path}`
}
