import { readFile, writeFile, mkdir, access } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import { generateDashboard } from './generators/dashboard-generator.js'
import { serializeToYaml } from './generators/yaml-utils.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TOOL_ROOT = join(__dirname, '..')
const HASS_CONFIG_ROOT = join(TOOL_ROOT, '..', '..')
const OUTPUT_DIR = join(TOOL_ROOT, 'output')
const LOVELACE_DIR = join(HASS_CONFIG_ROOT, 'lovelace')
const INVENTORY_FILE = join(OUTPUT_DIR, 'hass-data.json')
const CONFIG_FILE = join(TOOL_ROOT, 'dashboard-config.js')
const OUTPUT_FILE = join(LOVELACE_DIR, 'generated.yaml')

async function main() {
  console.log('Home Assistant Dashboard Generator')
  console.log('==================================\n')

  try {
    const inventory = await loadInventory()
    const config = await loadConfig()

    console.log('\nGenerating dashboard...')
    const dashboard = generateDashboard(inventory, config)

    await writeOutput(dashboard)

    console.log('\n✅ Dashboard generation complete!')
    console.log(`   Output: lovelace/generated.yaml`)
    console.log('\n💡 Dashboard is ready for Home Assistant!')
    console.log('   Included via lovelace: in configuration.yaml')
  } catch (err) {
    console.error('\n❌ Error:', err.message)
    process.exit(1)
  }
}

async function loadInventory() {
  try {
    const content = await readFile(INVENTORY_FILE, 'utf-8')
    const inventory = JSON.parse(content)

    console.log(`Loaded inventory: ${inventory.entities.length} entities, ${inventory.areas.length} areas`)

    return inventory
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Inventory not found. Run 'npm start' first to generate hass-data.json`)
    }

    throw err
  }
}

async function loadConfig() {
  try {
    await access(CONFIG_FILE)

    const configUrl = pathToFileURL(CONFIG_FILE).href
    const module = await import(configUrl)
    const config = module.default || module

    console.log('Loaded dashboard-config.js')

    return config
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('No dashboard-config.js found, using defaults')
      console.log('Tip: Run npm start to generate dashboard-config.js\n')

      return { excluded_areas: [], default_scene_suffix: 'standard', areas: {}, }
    }

    throw err
  }
}

async function writeOutput(dashboard) {
  await mkdir(LOVELACE_DIR, { recursive: true, })

  const header = `# Auto-generated dashboard by hass-data-generator
# Do not edit manually - changes will be overwritten

`

  const yaml = header + serializeToYaml(dashboard, 0, false)
  await writeFile(OUTPUT_FILE, yaml, 'utf-8')
}

main()

