// @ts-check
// ============================================================================
// VIEWS-BASED DASHBOARD CONFIG
// ============================================================================
// Purpose: Configures a multi-view Lovelace dashboard (npm run generate:dashboard)
// Outputs: lovelace/views.yaml (Bubble Card-based dashboard with HA views)
//
// This dashboard uses Home Assistant's built-in views instead of popups.
// Each area has its own dedicated view accessible from the main area list.
//
// This file is never overwritten by the generator.
// ============================================================================

import { PARENTS } from '../users.js'

/** @type {import('../inventory/types/config.d.ts').DashboardConfig} */
const config = {
  // Schema version - do not change manually
  schemaVersion: 1,

  // Dashboard template to use
  template: 'bubble-views',

  // Output file path (relative to project root)
  output: 'lovelace/views.yaml',

  // Dashboard view title
  dashboard_name: 'Home',

  // HA registration settings (auto-updates configuration.yaml)
  // Note: dashboard_path must contain a hyphen (HA requirement)
  dashboard_path: 'home-views',
  dashboard_title: 'Home (Views)',
  dashboard_icon: 'mdi:view-dashboard-variant',

  // Areas to pin at the top of the dashboard (in order)
  pinned_areas: ['living_room', 'kitchen', 'bedroom', 'shahar_s_studio', 'sharon_s_studio', 'office', 'corridor', 'laundry_room', 'mamad', 'parent_s_wc', 'studio_solaris'],

  // Areas to exclude from the dashboard
  excluded_areas: ['home_assistant'],

  // Scene suffix for default tap action (scene.<prefix><suffix>)
  default_scene_suffix: 'standard',

  // Home card - quick actions at the top
  home_card: {
    sub_buttons: [
      { entity: 'switch.ptio_gate_ne', icon: 'mdi:key' },
      { entity: 'light.lr_lt_ceiling', icon: 'mdi:cctv' },
      { entity: 'switch.home_sw_pima', name: 'Alarm', action: 'hold' },
      { entity: 'script.ac_off', icon: 'mdi:snowflake-off', action: 'hold' },
      { entity: 'switch.home_sw_heating', action: 'hold' },
    ],
  },

  // Presence card - who's home
  presence_card: {
    entity: 'binary_sensor.anyone_home',
    users: [
      { name: 'Sharon', entity: 'binary_sensor.sharon_home', icon: 'mdi:account' },
      { name: 'Shahar', entity: 'binary_sensor.shahar_home', icon: 'mdi:account-tie-woman' },
      { name: 'Tom', entity: 'binary_sensor.tom_home', icon: 'mdi:human-female-girl' },
      { name: 'Amai', entity: 'binary_sensor.amai_home', icon: 'mdi:human-female-girl' },
    ],
  },

  // Per-area dashboard configuration
  // Browse output/entities.js to find entity IDs
  areas: {
    living_room: {
      excluded_lights: ['light.lr_lt_outdoor_projector', 'light.lr_lt_ceiling'],
      included_lights: ['switch.lr_soc_e'],
    },
    kitchen: {
      included_scenes: ['scene.lr_twilight_zone'],
    },
    bedroom: {
      excluded_lights: ['light.mb_lt_wardrobe', 'light.mb_lt_ceiling_hall'],
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
