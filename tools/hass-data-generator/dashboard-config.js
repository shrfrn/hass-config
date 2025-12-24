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
    // User IDs: Sharon=bdc857a611d74e9998fdc8535024b263, Shahar=b10953f68ec043cea57260ca2f5e0880, Tom=42aa497a257c46f9a1c8650a32a46e57
    bedroom: {
      visible_to_users: ['bdc857a611d74e9998fdc8535024b263', 'b10953f68ec043cea57260ca2f5e0880'],  // Sharon & Shahar only
    },
    shahar_s_studio: {
      visible_to_users: ['bdc857a611d74e9998fdc8535024b263', 'b10953f68ec043cea57260ca2f5e0880'],  // Sharon & Shahar only
    },
    sharon_s_studio: {
      visible_to_users: ['bdc857a611d74e9998fdc8535024b263', 'b10953f68ec043cea57260ca2f5e0880'],  // Sharon & Shahar only
    },
    studio_solaris: {
      visible_to_users: ['bdc857a611d74e9998fdc8535024b263', 'b10953f68ec043cea57260ca2f5e0880'],  // Sharon & Shahar only
    },
  },
}

export default config
