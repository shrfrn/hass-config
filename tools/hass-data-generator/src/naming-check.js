import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'

const VIOLATIONS_FILE = 'naming-violations.json'

export async function checkNamingConsistency(hassDataPath) {
  console.log('\nRunning naming consistency check...')

  const { entities, lines, } = await loadEntitiesWithLineNumbers(hassDataPath)
  const entitiesWithArea = entities.filter(e => e.area_id)

  if (entitiesWithArea.length === 0) {
    console.log('  No entities with area assignments found')
    return
  }

  const areaPrefixes = establishAreaPrefixes(entitiesWithArea)
  const violations = findViolations(entitiesWithArea, areaPrefixes, lines)

  if (violations.length === 0) {
    console.log('  ✓ All entities follow naming conventions')
    return
  }

  const report = buildReport(areaPrefixes, violations)
  const outputPath = join(dirname(hassDataPath), VIOLATIONS_FILE)

  await writeFile(outputPath, JSON.stringify(report, null, 2), 'utf-8')

  const areasWithViolations = new Set(violations.map(v => v.area_id)).size

  console.log(`  ⚠️  Found ${violations.length} violations in ${areasWithViolations} areas`)
  console.log(`     See: ${outputPath}`)
}

async function loadEntitiesWithLineNumbers(hassDataPath) {
  const content = await readFile(hassDataPath, 'utf-8')
  const data = JSON.parse(content)
  const lines = content.split('\n')

  const entityLineMap = buildEntityLineMap(lines)

  const entities = data.entities.map(entity => ({
    ...entity,
    line: entityLineMap.get(entity.entity_id) || null,
  }))

  return { entities, lines, }
}

function buildEntityLineMap(lines) {
  const map = new Map()
  const entityIdPattern = /"entity_id":\s*"([^"]+)"/

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(entityIdPattern)

    if (match) {
      map.set(match[1], i + 1) // 1-based line numbers
    }
  }

  return map
}

function establishAreaPrefixes(entities) {
  const prefixes = new Map()

  for (const entity of entities) {
    const { area_id, } = entity

    if (prefixes.has(area_id)) continue

    const prefix = extractPrefix(entity.entity_id)

    if (prefix) {
      prefixes.set(area_id, prefix)
    }
  }

  return prefixes
}

function extractPrefix(entityId) {
  const name = entityId.split('.')[1] // get part after domain

  if (!name) return null

  const underscoreIndex = name.indexOf('_')

  if (underscoreIndex === -1) return null

  return name.substring(0, underscoreIndex + 1) // include the underscore
}

function findViolations(entities, areaPrefixes, lines) {
  const violations = []

  for (const entity of entities) {
    const { entity_id, area_id, line, } = entity
    const expectedPrefix = areaPrefixes.get(area_id)

    if (!expectedPrefix) continue

    const actualPrefix = extractPrefix(entity_id)

    if (actualPrefix !== expectedPrefix) {
      violations.push({
        entity_id,
        area_id,
        expected_prefix: expectedPrefix,
        actual_prefix: actualPrefix || '(no prefix)',
        line_in_hass_data: line,
      })
    }
  }

  return violations
}

function buildReport(areaPrefixes, violations) {
  const areasWithViolations = new Set(violations.map(v => v.area_id))

  const prefixesObject = {}

  for (const [areaId, prefix] of areaPrefixes) {
    prefixesObject[areaId] = prefix
  }

  return {
    generated_at: new Date().toISOString(),
    summary: {
      total_areas_checked: areaPrefixes.size,
      areas_with_violations: areasWithViolations.size,
      total_violations: violations.length,
    },
    area_prefixes: prefixesObject,
    violations,
  }
}

