// @ts-check
// Dashboard configuration - YOUR EDITS GO HERE
// This file is never overwritten by the generator

/** @type {import('./dashboard-config.d.ts').DashboardConfig} */
const config = {
  // Areas to pin at the top of the dashboard (in order)
  pinned_areas: ['living_room', 'kitchen', 'bedroom', 'shahar_s_studio', 'sharon_s_studio', 'office', 'corridor', 'laundry_room', 'mamad', 'parent_s_wc', 'studio_solaris'],

  // Areas to exclude from the dashboard
  excluded_areas: [],

  // Scene suffix for default tap action (scene.<prefix><suffix>)
  default_scene_suffix: 'standard',

  // Per-area dashboard configuration
  // Browse output/entities.js to find entity IDs
  // Find user IDs: Settings > People > click user > look at URL
  areas: {
    living_room: {
      excluded_lights: ['light.lr_lt_outdoor_projector'],  // moved to Other section
      // included_lights: ['switch.lr_floor_lamp'],   // added to Lights section
    },
    // Example: Restrict area to specific users
    bedroom: {
      visible_to_users: ['person.sharon_frenkel', 'person.shahar_katz'],  // Only this user sees Office
    },
    shahar_s_studio: {
      visible_to_users: ['person.sharon_frenkel', 'person.shahar_katz'],  // Only this user sees Office
    },
    sharon_s_studio: {
      visible_to_users: ['person.sharon_frenkel', 'person.shahar_katz'],  // Only this user sees Office
    },
    studio_solaris: {
      visible_to_users: ['person.sharon_frenkel', 'person.shahar_katz'],  // Only this user sees Office
    },
  },
}

export default config
