import { parseBarlauProduct } from "./lib/parseBarlauProduct"

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

async function main(): Promise<void> {
  const url = process.argv[2]
  if (!url) {
    console.error("Usage: pnpm scrape:barlau <barlau.kz product URL>")
    process.exit(1)
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    console.error(`Not a valid URL: ${url}`)
    process.exit(1)
    return
  }

  if (parsedUrl.hostname !== "barlau.kz" && parsedUrl.hostname !== "www.barlau.kz") {
    console.error(`Expected a barlau.kz URL, got host "${parsedUrl.hostname}"`)
    process.exit(1)
    return
  }

  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
  if (!response.ok) {
    console.error(`Fetch failed: HTTP ${response.status} ${response.statusText}`)
    process.exit(1)
    return
  }

  const html = await response.text()

  try {
    const result = parseBarlauProduct(html, url)
    console.log(JSON.stringify(result, null, 2))
  } catch (err) {
    console.error(`Failed to parse product page: ${(err as Error).message}`)
    process.exit(1)
  }
}

main()
