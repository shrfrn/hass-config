import { config } from 'dotenv'
import { writeFile, mkdir } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { connect, disconnect } from './websocket.js'
import { fetchAllData } from './fetchers.js'
import { transformData } from './transform.js'
import { checkNamingConsistency } from './naming-check.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(__dirname, '..', 'output')
const OUTPUT_FILE = join(OUTPUT_DIR, 'hass-data.json')

async function main() {
  console.log('Home Assistant Data Generator')
  console.log('=============================\n')

  loadConfig()
  const { host, port, token, } = getConnectionConfig()

  try {
    await connect(host, port, token)
    const rawData = await fetchAllData()
    const transformedData = transformData(rawData)

    await writeOutput(transformedData)
    await checkNamingConsistency(OUTPUT_FILE)

    console.log('\n✅ Data generation complete!')
    console.log(`   Output: ${OUTPUT_FILE}`)
  } catch (err) {
    console.error('\n❌ Error:', err.message)
    process.exit(1)
  } finally {
    disconnect()
  }
}

function loadConfig() {
  config({ path: join(__dirname, '..', '.env'), })
}

function getConnectionConfig() {
  const host = process.env.HASS_HOST
  const port = process.env.HASS_PORT || '8123'
  const token = process.env.HASS_TOKEN

  if (!host) {
    console.error('❌ HASS_HOST is not set in .env file')
    process.exit(1)
  }

  if (!token) {
    console.error('❌ HASS_TOKEN is not set in .env file')
    process.exit(1)
  }

  console.log(`Connecting to Home Assistant at ${host}:${port}\n`)

  return { host, port, token, }
}

async function writeOutput(data) {
  await mkdir(OUTPUT_DIR, { recursive: true, })

  const json = JSON.stringify(data, null, 2)
  await writeFile(OUTPUT_FILE, json, 'utf-8')

  const stats = summarizeData(data)
  console.log('\nData summary:')
  console.log(`  Floors:   ${stats.floors}`)
  console.log(`  Areas:    ${stats.areas}`)
  console.log(`  Devices:  ${stats.devices}`)
  console.log(`  Labels:   ${stats.labels}`)
  console.log(`  Entities: ${stats.entities}`)
  console.log(`  Scenes:   ${stats.scenes}`)
  console.log(`  Zones:    ${stats.zones}`)
  console.log(`  Persons:  ${stats.persons}`)
}

function summarizeData(data) {
  return {
    floors: data.floors.length,
    areas: data.areas.length,
    devices: data.devices.length,
    labels: data.labels.length,
    entities: data.entities.length,
    scenes: data.scenes.length,
    zones: data.zones.length,
    persons: data.persons.length,
  }
}

main()

