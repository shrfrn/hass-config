import { readFile, access } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import { generateAreaPackages } from './generators/area-package.js'
import { generateFloorPackages } from './generators/floor-package.js'
import { generateLabelPackages } from './generators/label-package.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TOOL_ROOT = join(__dirname, '..')
const OUTPUT_DIR = join(TOOL_ROOT, 'output')
const INVENTORY_FILE = join(OUTPUT_DIR, 'hass-data.json')
const CONFIG_FILE = join(TOOL_ROOT, 'generator-config.js')

async function main() {
  console.log('Home Assistant YAML Generator')
  console.log('=============================\n')

  try {
    const inventory = await loadInventory()
    const config = await loadConfig()

    await generateAreaPackages(inventory, config, OUTPUT_DIR)
    await generateFloorPackages(inventory, OUTPUT_DIR)
    await generateLabelPackages(inventory, OUTPUT_DIR)

    console.log('\n✅ YAML generation complete!')
    console.log(`   Output: ${join(OUTPUT_DIR, 'packages')}`)
    console.log('\n💡 Copy packages to your Home Assistant config:')
    console.log('   cp -r output/packages/* /path/to/homeassistant/packages/')
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

    // Dynamic import of JS config
    const configUrl = pathToFileURL(CONFIG_FILE).href
    const module = await import(configUrl)
    const config = module.default || module

    console.log('Loaded generator-config.js')

    return config
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('No generator-config.js found, using defaults')
      console.log('Tip: cp output/generator-config.starter.js generator-config.js\n')

      return { default_vacancy_duration: '00:10:00', areas: {}, }
    }

    throw err
  }
}

main()
