// @ts-check
// ============================================================================
// GLOBAL DASHBOARD CONFIG
// ============================================================================
// Shared settings for all dashboards. Specific dashboards import and extend
// this config with template-specific options.
//
// This file is never overwritten by the generator.
// ============================================================================

import { PARENTS } from '../users.js'

/** @type {import('../inventory/types/config.js').GlobalDashboardConfig} */
const config = {
  schemaVersion: 1,

  // Language for translations (from i18n/*.csv)
  language: 'he',

  // Areas to pin at the top of the dashboard (in order)
  pinned_areas: [
    'living_room',
    'kitchen',
    'bedroom',
    'shahar_s_studio',
    'sharon_s_studio',
    'office',
    'corridor',
    'laundry_room',
    'mamad',
    'parent_s_wc',
    'studio_solaris',
  ],

  // Areas to exclude from the dashboard
  excluded_areas: ['home_assistant', 'home'],

  // Scene suffix for default tap action (scene.<prefix><suffix>)
  default_scene_suffix: 'standard',

  // Per-area dashboard configuration
  // Browse inventory/entities.js to find entity IDs
  areas: {
    living_room: {
      excluded_lights: ['light.lr_lt_outdoor_projector', 'light.lr_lt_ceiling'],
      included_lights: ['switch.lr_soc_e'],
    },
    kitchen: {
      included_scenes: ['scene.lr_twilight_zone'],
    },
    bedroom: {
      excluded_lights: ['light.mb_lt_wardrobe', 'light.mb_wardrobe_ikea_bulb'],
      included_lights: ['switch.mb_soc'],
      included_scenes: ['scene.lr_twilight_zone'],
      visible_to_users: PARENTS,
    },
    shahar_s_studio: {
      visible_to_users: PARENTS,
    },
    sharon_s_studio: {
      visible_to_users: PARENTS,
    },
    studio_solaris: {
      visible_to_users: PARENTS,
    },
  },
}

export default config
