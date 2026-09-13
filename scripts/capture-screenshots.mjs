import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const outputDir = new URL('../docs/screenshots/', import.meta.url)
await mkdir(outputDir, { recursive: true })

// Set SCREENSHOT_PORT to pin the throwaway dev server to a specific port
// (useful when the default 5173 is taken by another project). Leaving it
// unset keeps the normal Vite behavior of picking the next free port.
const screenshotPort = process.env.SCREENSHOT_PORT
  ? Number(process.env.SCREENSHOT_PORT)
  : undefined

const server = await createServer({
  logLevel: 'error',
  server: screenshotPort ? { port: screenshotPort, strictPort: true } : undefined,
})
await server.listen()

// Vite moves to the next free port when 5173 is taken, so use the URL it
// actually bound instead of assuming the default.
const baseUrl = server.resolvedUrls?.local[0]

if (!baseUrl) {
  await server.close()
  throw new Error('Vite did not report a local URL for the screenshot server.')
}

const browser = await chromium.launch()

try {
  const viewports = [
    { name: 'desktop', width: 1440, height: 1100 },
    { name: 'mobile', width: 390, height: 1400 },
  ]

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport })
    await page.goto(baseUrl, { waitUntil: 'networkidle' })
    await page.screenshot({
      fullPage: true,
      path: fileURLToPath(new URL(`signaldesk-${viewport.name}.png`, outputDir)),
    })
    await page.close()
  }
} finally {
  await browser.close()
  await server.close()
}
