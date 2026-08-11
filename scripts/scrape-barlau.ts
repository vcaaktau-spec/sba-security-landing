import { parseBarlauProduct } from "./lib/parseBarlauProduct"

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

const FETCH_TIMEOUT_MS = 15_000

function isAllowedHost(hostname: string): boolean {
  return hostname === "barlau.kz" || hostname === "www.barlau.kz"
}

async function main(): Promise<void> {
  const url = process.argv[2]
  if (!url) {
    console.error("Usage: pnpm scrape:barlau <barlau.kz product URL>")
    process.exitCode = 1
    return
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    console.error(`Not a valid URL: ${url}`)
    process.exitCode = 1
    return
  }

  if (!isAllowedHost(parsedUrl.hostname)) {
    console.error(`Expected a barlau.kz URL, got host "${parsedUrl.hostname}"`)
    process.exitCode = 1
    return
  }

  let html: string
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!response.ok) {
      console.error(`Fetch failed: HTTP ${response.status} ${response.statusText}`)
      process.exitCode = 1
      return
    }

    const finalHostname = new URL(response.url).hostname
    if (!isAllowedHost(finalHostname)) {
      console.error(`Redirected away from barlau.kz to host "${finalHostname}" — refusing to parse`)
      process.exitCode = 1
      return
    }

    html = await response.text()
  } catch (err) {
    const message =
      err instanceof Error && err.name === "TimeoutError"
        ? `Fetch timed out after ${FETCH_TIMEOUT_MS / 1000}s`
        : (err as Error).message
    console.error(`Fetch failed: ${message}`)
    process.exitCode = 1
    return
  }

  try {
    const result = parseBarlauProduct(html, url)
    console.log(JSON.stringify(result, null, 2))
    console.error("Note: strip the _-prefixed fields before pasting into catalogSeed.ts")
  } catch (err) {
    console.error(`Failed to parse product page: ${(err as Error).message}`)
    process.exitCode = 1
    return
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
