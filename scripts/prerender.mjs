// Пре-рендер маршрутов SPA в статический HTML на этапе сборки.
// Раньше эту роль играл react-snap (Puppeteer 1.8), но его загрузчик Chromium
// не работал в билд-окружении Vercel — пре-рендер тихо отключался в CI
// (см. git-историю package.json). Playwright используется вместо него, так как
// его загрузчик браузера надёжнее работает в CI/Vercel.
import { config as loadEnv } from "dotenv";
import { chromium } from "playwright";
import { neon } from "@neondatabase/serverless";
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

// На Vercel переменные окружения уже в process.env до запуска любого шага
// сборки. Локально `node scripts/prerender.mjs` их не подхватывает сам —
// Vite грузит .env.local только для клиентского бандла, не в process.env
// произвольного Node-скрипта. dotenv не перезаписывает уже существующие
// переменные, так что вызов безопасен в обоих окружениях.
loadEnv({ path: path.join(root, ".env.local") });
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const SITE = "https://toosba.kz";

// Каждая страница существует в двух реальных, разных по контенту версиях:
// ru (без префикса) и en (/en/...). kz пока не в этом списке — без своего
// URL, только переключатель интерфейса (см. src/lib/locale.ts).
const PAGES = [
  {
    path: "/",
    ru: {
      title: "Видеонаблюдение в Актау — Установка под ключ | SBA Security",
      description:
        "Профессиональная установка видеонаблюдения, СКУД и охранных систем в Актау. Бесплатный выезд, смета за 10 минут, гарантия 12 месяцев.",
    },
    en: {
      title: "Security Systems Installation in Aktau | SBA Security",
      description:
        "Professional installation of CCTV, access control, and fire alarm systems in Aktau. Free site visit, quote in 10 minutes, 12-month warranty.",
    },
  },
  {
    path: "/uslugi/videonahljudenie",
    ru: {
      title: "Установка видеонаблюдения в Актау под ключ | SBA Security",
      description:
        "Монтаж IP-камер и аналоговых систем CCTV любой сложности в Актау и Мангистауской области. Работаем с 2016 года, выполнено 300+ объектов.",
    },
    en: {
      title: "CCTV Installation in Aktau — Turnkey | SBA Security",
      description:
        "IP and CCTV video surveillance installation in Aktau. Hikvision, Dahua, Tiandy. Free on-site visit, quote in 10 minutes, 12-month warranty.",
    },
  },
  {
    path: "/uslugi/skud",
    ru: {
      title: "Монтаж СКУД в Актау — система контроля доступа | SBA Security",
      description:
        "Системы контроля и управления доступом для офисов, складов и предприятий в Актау. Учёт рабочего времени, интеграция с видеонаблюдением.",
    },
    en: {
      title: "Access Control (ACS) Installation in Aktau | SBA Security",
      description:
        "Access control system (ACS) installation in Aktau. Magnetic locks, card readers, turnstiles, time tracking. 12-month warranty.",
    },
  },
  {
    path: "/uslugi/signalizaciya",
    ru: {
      title: "Охранно-пожарная сигнализация в Актау | SBA Security",
      description:
        "Проектирование и монтаж охранно-пожарной сигнализации и систем оповещения (СОУЭ) в Актау по строительным нормам Казахстана.",
    },
    en: {
      title: "Fire & Security Alarm Installation in Aktau | SBA Security",
      description:
        "Fire and security alarm installation and notification systems in Aktau. Smoke detectors, control panels, GSM alerts. Warranty and maintenance.",
    },
  },
  {
    path: "/uslugi/seti",
    ru: {
      title: "Корпоративные сети и Wi-Fi в Актау | SBA Security",
      description:
        "Структурированные кабельные системы, корпоративный Wi-Fi и серверные помещения для бизнеса в Актау.",
    },
    en: {
      title: "Corporate Wi-Fi Network Installation in Aktau | SBA Security",
      description:
        "Design and installation of corporate Wi-Fi networks and structured cabling in Aktau. MikroTik, Ubiquiti, Ruijie. Routers, server rooms, VLAN setup.",
    },
  },
  {
    path: "/katalog",
    ru: {
      title: "Каталог оборудования видеонаблюдения и СКУД в Актау | SBA Security",
      description:
        "Камеры видеонаблюдения, регистраторы и оборудование СКУД в наличии в Актау — актуальные цены и характеристики.",
    },
    en: {
      title: "Equipment Catalog — CCTV & Access Control in Aktau | SBA Security",
      description:
        "CCTV cameras, recorders, and access control equipment in stock in Aktau — current prices and specifications.",
    },
  },
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Товары живут в Neon Postgres (см. api/products.ts) и обновляются
// еженедельным кроном (api/cron/sync-catalog.ts) из фида поставщика Barlau —
// это не заглушка и не тестовые данные. Строка "index.js" в src/db/index.ts
// не существует физически (tsc здесь noEmit), поэтому вместо импорта того
// же модуля просто повторяем тот же самый запрос через отдельное
// подключение — код api/products.ts не трогаем.
async function fetchActiveProducts() {
  if (!process.env.DATABASE_URL) {
    console.warn("[prerender] DATABASE_URL не задан — карточки товаров и /katalog/:id пропущены");
    return [];
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT id, category, name, brand, specs, base_price AS "basePrice", active, sort_order AS "sortOrder"
      FROM products
      WHERE active = true
      ORDER BY sort_order, name
    `;
    return rows;
  } catch (err) {
    console.warn("[prerender] не удалось получить товары из БД — карточки пропущены:", err.message);
    return [];
  }
}

// Разворачиваем PAGES в плоский список маршрутов для рендера, сразу считая
// hreflang-альтернативы для каждого — ru и en всегда знают о существовании
// друг друга по-настоящему (не как раньше, когда все три hreflang молча
// указывали на один и тот же URL).
function buildPageRoutes() {
  return PAGES.flatMap((page) => {
    const ruPath = page.path;
    const enPath = page.path === "/" ? "/en" : `/en${page.path}`;
    const alternates = { ru: `${SITE}${ruPath}`, en: `${SITE}${enPath}` };
    return [
      { path: ruPath, lang: "ru", ...page.ru, alternates },
      { path: enPath, lang: "en", ...page.en, alternates },
    ];
  });
}

// Товарные страницы — только на русском (данные из Barlau на русском,
// машинный перевод характеристик без проверки не делаем, см. обсуждение
// Critical #3). hreflang для них — только self + x-default, без ложного
// заявления о несуществующей en-версии.
function buildProductRoutes(products) {
  return products.map((p) => {
    const productPath = `/katalog/${p.id}`;
    const priceLabel = `${Number(p.basePrice).toLocaleString("ru-RU")} ₸`;
    return {
      path: productPath,
      lang: "ru",
      title: `${p.name} — купить с установкой в Актау | SBA Security`,
      description: `${p.name}${p.brand ? ` (${p.brand})` : ""} — ${priceLabel}. Продажа с установкой в Актау. Бесплатный выезд инженера, гарантия 12 месяцев.`,
      alternates: { ru: `${SITE}${productPath}` },
    };
  });
}

function replaceTag(html, regex, replacement) {
  return regex.test(html) ? html.replace(regex, replacement) : html;
}

function applyMeta(html, route) {
  const canonical = `${SITE}${route.path}`;
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);

  html = replaceTag(html, /<html lang="[^"]*"/, `<html lang="${route.lang}"`);
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = replaceTag(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${description}" />`);
  html = replaceTag(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}" />`);
  html = replaceTag(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${description}" />`);
  html = replaceTag(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`);
  html = replaceTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${title}" />`);
  html = replaceTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${description}" />`);
  html = replaceTag(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`);

  const hreflangLines = [`<link rel="alternate" hreflang="ru" href="${route.alternates.ru}" />`];
  if (route.alternates.en) hreflangLines.push(`<link rel="alternate" hreflang="en" href="${route.alternates.en}" />`);
  hreflangLines.push(`<link rel="alternate" hreflang="x-default" href="${route.alternates.ru}" />`);
  html = replaceTag(
    html,
    /<link rel="alternate" hreflang="ru"[^>]*>(\s*<link rel="alternate" hreflang="en"[^>]*>)?\s*<link rel="alternate" hreflang="x-default"[^>]*>/,
    hreflangLines.join("\n    ")
  );

  // 404.html обслуживается Vercel-ом для ЛЮБОГО непойманного адреса — сама
  // эта капча не должна попасть в индекс сама по себе (иначе получится
  // одна страница-дубль под сотней разных URL), в отличие от статуса 404
  // на самом URL, который как раз и нужен поисковикам.
  if (route.noindex) {
    html = /<meta name="robots"/.test(html)
      ? replaceTag(html, /<meta name="robots" content="[^"]*"\s*\/?>/, `<meta name="robots" content="noindex, nofollow" />`)
      : html.replace("</title>", "</title>\n    <meta name=\"robots\" content=\"noindex, nofollow\" />");
  }

  return html;
}

// Обслуживается Vercel-ом как статус-код 404 для любого адреса, не
// пойманного ни одним rewrite в vercel.json (см. узкий whitelist там —
// только /dashboard, /sign-in, /sign-up, /admin остаются на index.html,
// всё остальное несуществующее должно реально 404-иться, а не тихо
// отдавать 200 с главной — это било по краулинговому бюджету).
const NOT_FOUND_ROUTE = {
  path: "/__not-found-capture__",
  lang: "ru",
  title: "Страница не найдена | SBA Security",
  description: "Запрошенная страница не найдена. Вернитесь на главную SBA Security — видеонаблюдение, СКУД и охранные системы в Актау.",
  alternates: { ru: `${SITE}/` },
  noindex: true,
};

function buildSitemap(pageRoutes, products) {
  const today = new Date().toISOString().slice(0, 10);
  const pageUrls = pageRoutes.map((r) => {
    const alt = [`<xhtml:link rel="alternate" hreflang="ru" href="${r.alternates.ru}" />`];
    if (r.alternates.en) alt.push(`<xhtml:link rel="alternate" hreflang="en" href="${r.alternates.en}" />`);
    alt.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${r.alternates.ru}" />`);
    return `  <url>\n    <loc>${SITE}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    ${alt.join("\n    ")}\n  </url>`;
  });
  const productUrls = products.map(
    (p) => `  <url>\n    <loc>${SITE}/katalog/${p.id}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${[...pageUrls, ...productUrls].join("\n")}\n</urlset>\n`;
}

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.status < 500) return resolve();
      } catch {
        // сервер ещё не поднялся
      }
      if (Date.now() - start > timeoutMs) return reject(new Error("vite preview не поднялся вовремя"));
      setTimeout(tick, 300);
    };
    tick();
  });
}

// Билд-контейнер Vercel — минимальный Linux-образ без системных библиотек
// вроде libnspr4, нужных обычному Chromium. @sparticuz/chromium собран
// специально для таких serverless/CI-окружений. Локально (Windows/macOS)
// его бинарник не работает — там используется обычный Chromium от Playwright,
// который уже скачан через `playwright install` в postinstall.
async function resolveLaunchOptions() {
  if (process.platform !== "linux") return {};
  const sparticuzChromium = (await import("@sparticuz/chromium")).default;
  return {
    executablePath: await sparticuzChromium.executablePath(),
    args: sparticuzChromium.args,
  };
}

// С сотнями товаров в каталоге (см. Barlau-фид) последовательный обход был
// бы самой долгой частью каждого деплоя — заводим пул вкладок вместо одной.
// queue.shift() безопасен без блокировок: JS однопоточный, и между проверкой
// длины и самим shift() нет await, так что гонки между воркерами исключены.
// Билд-машина Vercel — 2 ядра / 8 ГБ на весь процесс сборки (node, pnpm,
// сам Chromium). Даже 3 одновременных вкладки иногда роняли браузер целиком
// (OOM) — "Target page, context or browser has been closed", причём не
// стабильно: в одном прогоне падало после 150+ маршрутов, в другом почти
// сразу. Дальше падение уже не валит деплой (см. main), но по возможности
// лучше не терять пре-рендер вовсе — 2 вкладки надёжнее ценой длительности.
const CONCURRENCY = 2;

// Билд Vercel один раз реально упёрся в лимит 45 минут на прогоне с
// networkidle: сайт грузит GA/Метрику/Vercel Analytics/Speed Insights, а в
// билд-контейнере внешний интернет, похоже, недоступен — эти запросы висят,
// и networkidle (нет сетевой активности 500мс) физически не наступает,
// так что КАЖДАЯ навигация съедала полный тайм-аут. Блокируем сторонние
// трекеры на уровне запросов (незачем и вредно писать их в пре-рендер) и
// ждём просто "load" — тогда сеть не держит рендер заложником.
const BLOCKED_HOSTS = [
  "googletagmanager.com",
  "google-analytics.com",
  "mc.yandex.ru",
  "vitals.vercel-insights.com",
  "va.vercel-scripts.com",
  // Продакшн-ключ Clerk (pk_live_...) домен-заблокирован строго на toosba.kz.
  // Захват идёт на localhost (и локально, и в билд-контейнере Vercel), так
  // что Clerk там ловит "Origin header must be equal to or a subdomain of
  // the requesting URL" и не может нормально проинициализироваться — то
  // состояние SignedIn/SignedOut, что он успевает отрендерить в этом сбойном
  // виде, попадает в пре-рендер и НЕ совпадает с тем, что вычисляет реальная
  // гидратация на настоящем домене — отсюда React error #418/#423 на каждой
  // странице. Блокируем сам Clerk на время захвата: тогда SignedIn/SignedOut
  // остаются в чистом "ещё не определено" состоянии и в захвате, и в первом
  // кадре настоящей гидратации — гонки не возникает.
  "clerk.toosba.kz",
];

// Второй, независимый уровень защиты от повторного разгона за лимит
// площадки — сколько бы воркеров или ретраев ни было, вся фаза
// пре-рендера принудительно останавливается по бюджету времени.
const TIME_BUDGET_MS = 20 * 60 * 1000;
const budgetStart = Date.now();
const budgetExceeded = () => Date.now() - budgetStart > TIME_BUDGET_MS;

async function openPage(browser, products) {
  const page = await browser.newPage();
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (BLOCKED_HOSTS.some((host) => url.includes(host))) return route.abort();
    return route.continue();
  });
  await page.route("**/api/products", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ source: "db", items: products }),
    })
  );
  return page;
}

async function renderWorker(browser, queue, products) {
  let page = await openPage(browser, products);

  let failures = 0;
  while (queue.length > 0) {
    if (budgetExceeded()) {
      console.warn(`[prerender] бюджет времени исчерпан — ${queue.length} маршрутов остались без пре-рендера в этот раз`);
      failures += queue.length;
      queue.length = 0;
      break;
    }

    const route = queue.shift();
    if (!route) break;

    // Изредка отдельная навигация всё равно не укладывается в тайм-аут.
    // Повторная попытка НА ТОЙ ЖЕ вкладке даёт "navigation interrupted",
    // если предыдущий goto ещё не до конца остыл (особенно на медленной
    // машине) — поэтому ретрай идёт на свежей вкладке, а не на старой.
    let lastErr;
    let ok = false;
    for (let attempt = 0; attempt < 2 && !ok; attempt++) {
      try {
        await page.goto(BASE + route.path, { waitUntil: "load", timeout: 15000 });
        await page.waitForTimeout(400);

        const html = applyMeta(await page.content(), route);

        const outFile = route.path === NOT_FOUND_ROUTE.path
          ? path.join(distDir, "404.html")
          : path.join(route.path === "/" ? distDir : path.join(distDir, route.path.replace(/^\//, "")), "index.html");
        mkdirSync(path.dirname(outFile), { recursive: true });
        writeFileSync(outFile, html, "utf-8");
        console.log(`[prerender] ok  ${route.path} -> ${path.relative(root, outFile)}`);
        ok = true;
      } catch (err) {
        lastErr = err;
        await page.close().catch(() => {});
        page = await openPage(browser, products);
      }
    }
    if (!ok) {
      failures += 1;
      console.error(`[prerender] FAILED ${route.path}:`, lastErr.message);
    }
  }

  await page.close();
  return failures;
}

async function main() {
  const pristineShell = readFileSync(path.join(distDir, "index.html"), "utf-8"); // fail fast если build не запускался

  // /dashboard, /sign-in, /sign-up, /admin — чисто клиентские маршруты
  // (реального контента для них нет, только React после логина через
  // Clerk), но vercel.json заворачивает их на index.html — а прямо ниже
  // этот же index.html будет ПЕРЕЗАПИСАН пре-рендером главной страницы
  // (Hero/PainSection/Footer и т.д.). Открыв /dashboard напрямую, браузер
  // сперва получает HTML главной страницы, а React пытается гидрировать
  // поверх него дерево Dashboard — несовпадающие деревья, часть старого
  // DOM домашней страницы (тот же Footer) остаётся на месте рядом с
  // реальным личным кабинетом. Сохраняем ДО перезаписи чистую, пустую
  // SPA-болванку (какой index.html был сразу после `vite build`, ещё без
  // пре-рендера) в app.html — на неё в vercel.json переключены эти
  // маршруты, так что React монтируется с нуля (createRoot), а не
  // гидрируется поверх чужого контента.
  writeFileSync(path.join(distDir, "app.html"), pristineShell, "utf-8");

  const products = await fetchActiveProducts();
  const pageRoutes = buildPageRoutes();
  const productRoutes = buildProductRoutes(products);
  // NOT_FOUND_ROUTE — первым в очереди, а не последним: браузер на
  // Vercel иногда падает целиком где-то посреди сотен товарных страниц
  // (см. комментарий про CONCURRENCY выше), и тогда всё, что стояло в
  // очереди ПОСЛЕ точки падения, просто не рендерится в этот раз. 404.html
  // — маленький фиксированный набор из 13 страниц (12 + сам 404), он
  // должен успеть отрендериться даже если товарный цикл потом упадёт.
  const ROUTES = [NOT_FOUND_ROUTE, ...pageRoutes, ...productRoutes];

  // Запускаем JS-энтрипоинт vite напрямую через node — без shell:true и без
  // .cmd-обёртки (на Windows spawn .cmd без shell даёт EINVAL). Так .kill()
  // реально останавливает процесс, а не оставляет vite preview висеть в фоне.
  const viteEntry = path.join(root, "node_modules", "vite", "bin", "vite.js");
  const server = spawn(process.execPath, [viteEntry, "preview", "--port", String(PORT), "--strictPort"], {
    cwd: root,
    stdio: "inherit",
  });

  const cleanup = () => {
    try {
      server.kill();
    } catch {
      // уже остановлен
    }
  };
  process.on("exit", cleanup);

  let browser;
  let failures = 0;

  // Пре-рендер — это оптимизация поверх рабочего клиентского SPA, а не
  // обязательное условие для сайта. Раньше падение браузера целиком (OOM,
  // краш и т.п.) вылетало необработанным исключением из Promise.all,
  // валило весь скрипт с кодом 1 и тем самым — весь `pnpm run build` на
  // Vercel: ни один из уже успешно отрендеренных файлов не попадал в
  // деплой, потому что деплой атомарный. Теперь любая ошибка на этом
  // этапе (включая падение самого браузера) — не более чем "часть
  // маршрутов не пре-рендерилась в этот раз", а не сорванный деплой.
  try {
    await waitForServer(BASE + "/");
    browser = await chromium.launch(await resolveLaunchOptions());

    // vite preview не поднимает serverless-функции — /api/products при
    // прямом обращении недоступен. Подставляем реальные данные из той же
    // БД, что использует сама функция, так /katalog и карточки товара
    // рендерятся с настоящим содержимым, а не пустым состоянием загрузки.
    // Регистрируется на каждой вкладке воркера отдельно — маршрутизация в
    // Playwright привязана к странице, не к браузеру целиком.
    const queue = [...ROUTES];
    const workerCount = Math.min(CONCURRENCY, queue.length);
    const results = await Promise.all(
      Array.from({ length: workerCount }, () => renderWorker(browser, queue, products))
    );
    failures = results.reduce((sum, n) => sum + n, 0);
  } catch (err) {
    console.error("[prerender] сбой этапа рендера (браузер мог упасть целиком) — продолжаю без него:", err.message);
    failures = -1; // неизвестное точное число — просто сигнал "было прервано"
  } finally {
    try {
      if (browser) await browser.close();
    } catch {
      // браузер уже мог быть мёртв — не мешаем финализации
    }
    cleanup();
  }

  writeFileSync(path.join(distDir, "sitemap.xml"), buildSitemap(pageRoutes, products), "utf-8");
  console.log(`[prerender] sitemap.xml: ${pageRoutes.length} страниц + ${products.length} товаров`);

  if (failures < 0) {
    console.warn(`[prerender] этап рендера прервался раньше срока — часть маршрутов осталась без пре-рендера в этот раз`);
  } else if (failures > 0) {
    console.warn(`[prerender] завершено с ${failures} ошибками из ${ROUTES.length} маршрутов — деплой не блокирую`);
  } else {
    console.log(`[prerender] все ${ROUTES.length} маршрутов готовы`);
  }

  // На Windows spawn(..., {shell:true}) может оставлять дочерний процесс
  // vite preview недобитым, что держит event loop открытым бесконечно —
  // форсируем выход явно вместо того, чтобы ждать естественного завершения.
  // Всегда 0: провал пре-рендера не должен валить деплой (см. комментарий выше).
  process.exit(0);
}

main().catch((err) => {
  // Совсем катастрофический случай (например vite preview не поднялся) —
  // всё равно не валим деплой, просто явно предупреждаем в логах.
  console.error("[prerender] критическая ошибка — деплой продолжится без пре-рендера:", err);
  process.exit(0);
});
