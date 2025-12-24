import { join } from 'path'
import { writeYamlFile, generateLabelHeader } from './yaml-utils.js'

export async function generateLabelPackages(inventory, packagesDir) {
  const { labels, entities, } = inventory
  const labelsDir = join(packagesDir, 'labels')

  if (!labels || labels.length === 0) {
    console.log('\nNo labels defined, skipping label packages')
    return
  }

  console.log('\nGenerating label packages...')

  for (const label of labels) {
    const labelEntities = getLabelLights(entities, label.id)

    if (labelEntities.length === 0) {
      console.log(`  ⚠ Skipping ${label.name}: no light entities`)
      continue
    }

    const pkg = buildLabelPackage(label, labelEntities)
    const fileName = `label_${sanitizeFileName(label.id)}.yaml`
    const filePath = join(labelsDir, fileName)

    await writeYamlFile(filePath, pkg, generateLabelHeader(label.name))
    console.log(`  ✓ ${fileName}`)
  }
}

function sanitizeFileName(str) {
  return str.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

function getLabelLights(entities, labelId) {
  return entities
    .filter(e => e.labels?.includes(labelId) && e.domain === 'light')
    .map(e => e.entity_id)
    .sort()
}

function buildLabelPackage(label, lightEntities) {
  const groupId = `label_${sanitizeFileName(label.id)}_lights`

  return {
    group: {
      [groupId]: {
        name: `${label.name} Lights`,
        entities: lightEntities,
      },
    },
  }
}

