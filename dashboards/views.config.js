// @ts-check
// ============================================================================
// VIEWS DASHBOARD CONFIG (Bubble-views template)
// ============================================================================
// Multi-view dashboard using Bubble Card with HA native views.
// Each area has its own dedicated view accessible from the main area list.
// Extends global config with template-specific settings.
//
// This file is never overwritten by the generator.
// ============================================================================

import globalConfig from './shared.js'

/** @type {import('../inventory/types/dashboard-bubble-views.d.ts').BubbleViewsDashboardConfig} */
const config = {
  ...globalConfig,

  // Dashboard template
  template: 'bubble-views',

  // Output file path (relative to project root)
  output: 'lovelace/views.yaml',

  // Dashboard view title
  dashboard_name: 'Home',

  // HA registration settings (auto-updates configuration.yaml)
  dashboard_path: 'home-views',
  dashboard_title: 'Home (Views)',
  dashboard_icon: 'mdi:view-dashboard-variant',

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
}

export default config
