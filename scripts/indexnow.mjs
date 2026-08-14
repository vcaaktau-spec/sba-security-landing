// Отправляет все URL из живого sitemap.xml в IndexNow (api.indexnow.org) —
// один запрос веерно расходится по всем участникам протокола (Bing,
// Яндекс, Seznam, Naver), так что новый/изменённый контент подхватывается
// быстрее, чем через обычное периодическое переобхождение краулером.
//
// НЕ встроен в build/prerender: билд-контейнер Vercel, судя по всему, без
// доступа к интернету за пределами самого Vercel (см. комментарий в
// prerender.mjs про зависающие GA/Метрику запросы) — сетевой вызов отсюда
// рисковал бы повторить ту же историю с зависанием сборки. Запускается
// вручную с любой машины с интернетом: `node scripts/indexnow.mjs`.
const SITE = "https://toosba.kz";
const KEY = "215053c4d307314a5010888647da879e";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

async function main() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml недоступен: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error("sitemap.xml не содержит <loc> — проверь URL");

  console.log(`[indexnow] найдено ${urls.length} URL в sitemap.xml, отправляю...`);

  const submitRes = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }),
  });

  console.log(`[indexnow] ответ: ${submitRes.status} ${submitRes.statusText}`);
  if (submitRes.status !== 200 && submitRes.status !== 202) {
    const text = await submitRes.text().catch(() => "");
    throw new Error(`IndexNow отклонил запрос: ${submitRes.status} ${text}`);
  }
  console.log("[indexnow] готово — Bing и Яндекс получили сигнал об обновлении.");
}

main().catch((err) => {
  console.error("[indexnow] ошибка:", err.message);
  process.exit(1);
});
