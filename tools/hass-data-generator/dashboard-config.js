// @ts-check
// Dashboard configuration - YOUR EDITS GO HERE
// This file is never overwritten by the generator

import { ADULTS } from './users.js'

/** @type {import('./dashboard-config.d.ts').DashboardConfig} */
const config = {
  // Dashboard view title
  dashboard_name: 'Home',

  // Areas to pin at the top of the dashboard (in order)
  pinned_areas: ['living_room', 'kitchen', 'bedroom', 'shahar_s_studio', 'sharon_s_studio', 'office', 'corridor', 'laundry_room', 'mamad', 'parent_s_wc', 'studio_solaris'],

  // Areas to exclude from the dashboard
  excluded_areas: [],

  // Scene suffix for default tap action (scene.<prefix><suffix>)
  default_scene_suffix: 'standard',

  // Per-area dashboard configuration
  // Browse output/entities.js to find entity IDs
  areas: {
    living_room: {
      excluded_lights: ['light.lr_lt_outdoor_projector'],
    },
    bedroom: {
      visible_to_users: ADULTS,
    },
    shahar_s_studio: {
      visible_to_users: ADULTS,
    },
    sharon_s_studio: {
      visible_to_users: ADULTS,
    },
    studio_solaris: {
      visible_to_users: ADULTS,
    },
  },
}

export default config
