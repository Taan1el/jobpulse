import { createServer } from 'node:http'
import type { IncomingMessage } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { initialState, type JobPulseState } from '../shared/jobpulse.js'

const port = Number(process.env.PORT ?? 4174)
const dataDir = join(process.cwd(), 'server', 'data')
const dataPath = join(dataDir, 'jobpulse-state.json')

async function readState(): Promise<JobPulseState> {
  try {
    return JSON.parse(await readFile(dataPath, 'utf8')) as JobPulseState
  } catch {
    return initialState
  }
}

async function writeState(state: JobPulseState) {
  await writeFile(dataPath, `${JSON.stringify(state, null, 2)}\n`)
}

function readRequestBody(request: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk
    })
    request.on('end', () => resolve(body))
    request.on('error', reject)
  })
}

createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }

  if (request.url === '/api/health' && request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ ok: true }))
    return
  }

  if (request.url === '/api/state' && request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(await readState()))
    return
  }

  if (request.url === '/api/state' && request.method === 'PUT') {
    const body = await readRequestBody(request)
    const state = JSON.parse(body) as JobPulseState

    await writeState(state)
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(state))
    return
  }

  response.writeHead(404, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ error: 'Not found' }))
}).listen(port, '127.0.0.1', () => {
  console.log(`JobPulse API listening on http://127.0.0.1:${port}`)
})
