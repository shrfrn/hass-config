// @ts-check
// Dashboard configuration - YOUR EDITS GO HERE
// This file is never overwritten by the generator

/** @type {import('./dashboard-config.d.ts').DashboardConfig} */
const config = {
  // Areas to pin at the top of the dashboard (in order)
  pinned_areas: ['living_room', 'bedroom', 'kitchen'],

  // Areas to exclude from the dashboard
  excluded_areas: [],

  // Scene suffix for default tap action (scene.<prefix><suffix>)
  default_scene_suffix: 'standard',

  // Per-area dashboard configuration
  // Browse output/entities.js to find entity IDs
  areas: {
    // Example:
    living_room: {
      excluded_lights: ['light.lr_lt_outdoor_projector'],  // moved to Other section
    //   included_lights: ['switch.lr_floor_lamp'],   // added to Lights section
    },
  },
}

export default config
