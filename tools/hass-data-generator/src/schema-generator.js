import { readFile, writeFile, access } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TOOL_ROOT = join(__dirname, '..')
const OUTPUT_DIR = join(TOOL_ROOT, 'output')
const GENERATOR_CONFIG_FILE = join(TOOL_ROOT, 'generator-config.js')
const DASHBOARD_CONFIG_FILE = join(TOOL_ROOT, 'dashboard-config.js')

export async function generateSchemaAndStarterConfig(inventoryPath) {
  console.log('\nGenerating config files...')

  const inventory = await loadInventory(inventoryPath)
  const { areas, entities, } = inventory

  const areaIds = areas.map(a => a.id)
  const areaNames = Object.fromEntries(areas.map(a => [a.id, a.name]))
  const entityIds = entities.map(e => e.entity_id)

  // Always regenerate types and reference (safe to overwrite)
  await writeGeneratorTypeDefinitions(areaIds, entityIds)
  await writeDashboardTypeDefinitions(areaIds, entityIds)
  await writeEntityReference(entities, areaNames)

  // Only create user configs if they don't exist
  const generatorConfigCreated = await createGeneratorConfigIfMissing()
  const dashboardConfigCreated = await createDashboardConfigIfMissing()

  console.log(`  ✓ Types: generator-config.d.ts (${areaIds.length} areas, ${entityIds.length} entities)`)
  console.log(`  ✓ Types: dashboard-config.d.ts`)
  console.log(`  ✓ Reference: output/entities.js`)

  if (generatorConfigCreated) {
    console.log(`  ✓ Config: generator-config.js (created)`)
  } else {
    console.log(`  ✓ Config: generator-config.js (preserved)`)
  }

  if (dashboardConfigCreated) {
    console.log(`  ✓ Config: dashboard-config.js (created)`)
  } else {
    console.log(`  ✓ Config: dashboard-config.js (preserved)`)
  }
}

async function loadInventory(inventoryPath) {
  const content = await readFile(inventoryPath, 'utf-8')
  return JSON.parse(content)
}

async function writeGeneratorTypeDefinitions(areaIds, entityIds) {
  const areaUnion = areaIds.map(id => `  | '${id}'`).join('\n')
  const entityUnion = entityIds.map(id => `  | '${id}'`).join('\n')

  const content = `// Auto-generated type definitions for generator config
// Regenerated on each inventory run - DO NOT EDIT

/** Valid area IDs from Home Assistant */
export type AreaId =
${areaUnion}

/** Valid entity IDs from Home Assistant */
export type EntityId =
${entityUnion}

/** Configuration for a specific area */
export interface AreaConfig {
  /** Override vacancy timer duration (HH:MM:SS format) */
  vacancy_timer_duration?: string

  /** Additional entities to include in the light group (e.g., switches acting as lights) */
  include_in_group?: EntityId[]

  /** Entities to exclude from the light group */
  exclude_from_group?: EntityId[]
}

/** Generator configuration */
export interface GeneratorConfig {
  /** Default vacancy timer duration (HH:MM:SS format). Default: "00:10:00" */
  default_vacancy_duration?: string

  /** Per-area configuration overrides */
  areas?: Partial<Record<AreaId, AreaConfig>>
}
`

  const typesPath = join(TOOL_ROOT, 'generator-config.d.ts')
  await writeFile(typesPath, content, 'utf-8')
}

async function writeDashboardTypeDefinitions(areaIds, entityIds) {
  const areaUnion = areaIds.map(id => `  | '${id}'`).join('\n')
  const entityUnion = entityIds.map(id => `  | '${id}'`).join('\n')

  const content = `// Auto-generated type definitions for dashboard config
// Regenerated on each inventory run - DO NOT EDIT

/** Valid area IDs from Home Assistant */
export type AreaId =
${areaUnion}

/** Valid entity IDs from Home Assistant */
export type EntityId =
${entityUnion}

/** Dashboard configuration for a specific area */
export interface DashboardAreaConfig {
  /** Lights to exclude from the Lights section (moved to Other section) */
  excluded_lights?: EntityId[]

  /** Entities to include in Lights section (switches, etc). Order determines display order. */
  included_lights?: EntityId[]

  /** User IDs who can see this area. If not set, visible to all. Find IDs in Settings > People > user URL */
  visible_to_users?: string[]
}

/** Dashboard generator configuration */
export interface DashboardConfig {
  /** Areas to pin at the top of the dashboard (in order) */
  pinned_areas?: AreaId[]

  /** Areas to exclude from the dashboard entirely */
  excluded_areas?: AreaId[]

  /** Scene suffix for default tap action (e.g., 'standard' for scene.<prefix>standard) */
  default_scene_suffix?: string

  /** Per-area dashboard configuration */
  areas?: Partial<Record<AreaId, DashboardAreaConfig>>
}
`

  const typesPath = join(TOOL_ROOT, 'dashboard-config.d.ts')
  await writeFile(typesPath, content, 'utf-8')
}

async function writeEntityReference(entities, areaNames) {
  const byArea = {}

  for (const entity of entities) {
    const areaId = entity.area_id || '_unassigned'

    if (!byArea[areaId]) {
      byArea[areaId] = []
    }

    byArea[areaId].push(entity.entity_id)
  }

  let content = `// Entity reference - browse entities by area
// Regenerated on each inventory run - DO NOT EDIT
// Use this file to find entity IDs for your config

`

  const sortedAreas = Object.keys(byArea).sort()

  for (const areaId of sortedAreas) {
    const areaName = areaNames[areaId] || 'Unassigned'
    const areaEntities = byArea[areaId].sort()

    content += `// ${areaName} (${areaId})\n`
    content += `export const ${sanitizeVarName(areaId)} = [\n`

    for (const entityId of areaEntities) {
      content += `  '${entityId}',\n`
    }

    content += `]\n\n`
  }

  const refPath = join(OUTPUT_DIR, 'entities.js')
  await writeFile(refPath, content, 'utf-8')
}

async function createGeneratorConfigIfMissing() {
  try {
    await access(GENERATOR_CONFIG_FILE)
    return false
  } catch {
    const content = `// @ts-check
// Generator configuration - YOUR EDITS GO HERE
// This file is never overwritten by the generator

/** @type {import('./generator-config.d.ts').GeneratorConfig} */
const config = {
  // Default vacancy timer duration (when area becomes empty)
  default_vacancy_duration: '00:10:00',

  // Per-area configuration overrides
  // Only define areas you want to customize - others use defaults
  // Browse output/entities.js to find entity IDs
  areas: {
    // Example:
    // kitchen: {
    //   vacancy_timer_duration: '00:05:00',
    //   include_in_group: ['switch.kt_cabinet_lights'],
    //   exclude_from_group: ['light.kt_notification'],
    // },
  },
}

export default config
`

    await writeFile(GENERATOR_CONFIG_FILE, content, 'utf-8')
    return true
  }
}

async function createDashboardConfigIfMissing() {
  try {
    await access(DASHBOARD_CONFIG_FILE)
    return false
  } catch {
    const content = `// @ts-check
// Dashboard configuration - YOUR EDITS GO HERE
// This file is never overwritten by the generator

/** @type {import('./dashboard-config.d.ts').DashboardConfig} */
const config = {
  // Areas to exclude from the dashboard
  excluded_areas: [],

  // Scene suffix for default tap action (scene.<prefix><suffix>)
  default_scene_suffix: 'standard',

  // Per-area dashboard configuration
  // Browse output/entities.js to find entity IDs
  areas: {
    // Example:
    // living_room: {
    //   excluded_lights: ['light.lr_notification'],  // moved to Other section
    //   included_lights: ['switch.lr_floor_lamp'],   // added to Lights section
    // },
  },
}

export default config
`

    await writeFile(DASHBOARD_CONFIG_FILE, content, 'utf-8')
    return true
  }
}

function sanitizeVarName(str) {
  return str.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^[0-9]/, '_$&')
}
