// @ts-check
// ============================================================================
// DASHBOARD GENERATOR CONFIG
// ============================================================================
// Purpose: Configures the Lovelace dashboard generator (npm run generate:dashboard)
// Outputs: lovelace/generated.yaml (Bubble Card-based dashboard)
//
// Key options:
//   pinned_areas     - Areas shown first on the dashboard (in order)
//   excluded_areas   - Areas hidden from the dashboard entirely
//   excluded_lights  - Lights moved from "Lights" section to "Other" section
//   included_lights  - Entities added to "Lights" section (display only, not group)
//   visible_to_users - Restrict area visibility to specific HA user IDs
//
// Note: included_lights only affects dashboard display. To also add entities
// to the light group (for all-on/off), use include_in_group in generator-config.js
//
// This file is never overwritten by the generator.
// ============================================================================

import { PARENTS } from './users.js'

/** @type {import('./inventory/types/config.d.ts').DashboardConfig} */
const config = {
  // Schema version - do not change manually
  schemaVersion: 1,

  // Dashboard view title
  dashboard_name: 'Home',

  // Areas to pin at the top of the dashboard (in order)
  pinned_areas: ['living_room', 'kitchen', 'bedroom', 'shahar_s_studio', 'sharon_s_studio', 'office', 'corridor', 'laundry_room', 'mamad', 'parent_s_wc', 'studio_solaris'],

  // Areas to exclude from the dashboard
  excluded_areas: ['home_assistant'],

  // Scene suffix for default tap action (scene.<prefix><suffix>)
  default_scene_suffix: 'standard',

  // Per-area dashboard configuration
  // Browse output/entities.js to find entity IDs
  areas: {
    living_room: {
      excluded_lights: ['light.lr_lt_outdoor_projector', 'light.lr_lt_ceiling'],
      included_lights: ['switch.lr_soc_e'],
    },
    bedroom: {
      excluded_lights: ['light.mb_lt_wardrobe', 'light.mb_lt_ceiling_hall'],
      visible_to_users: PARENTS,
      included_lights: ['switch.mb_soc'],
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
