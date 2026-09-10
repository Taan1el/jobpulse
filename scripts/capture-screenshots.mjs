import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const baseUrl = process.env.JOBPULSE_URL ?? 'http://127.0.0.1:5173'
const outputDir = new URL('../docs/screenshots/', import.meta.url)

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch()

const viewports = [
  { name: 'desktop', width: 1440, height: 1100 },
  { name: 'mobile', width: 390, height: 1400 },
]

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport })

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.screenshot({
    fullPage: true,
    path: fileURLToPath(new URL(`jobpulse-${viewport.name}.png`, outputDir)),
  })
  await page.close()
}

await browser.close()
