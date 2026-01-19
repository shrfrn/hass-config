// @ts-check
// ============================================================================
// YAML GENERATOR CONFIG
// ============================================================================
// Purpose: Configures the YAML package generator (npm run generate:yaml)
// Outputs: packages/areas/*.yaml (light groups, helpers, timers, etc.)
//
// This file is never overwritten by the generator.
// ============================================================================

/** @type {import('./inventory/types/config.d.ts').GeneratorConfig} */
const config = {
  // Schema version - do not change manually
  schemaVersion: 1,

  // ─────────────────────────────────────────────────────────────────────────
  // GLOBAL OPTIONS
  // ─────────────────────────────────────────────────────────────────────────

  // Default vacancy timer duration (when area becomes empty)
  default_vacancy_duration: '00:09:00',

  // Labels to exclude from ALL light groups by default
  // Entities with these labels won't be added to area light groups
  excluded_labels: ['outdoor', 'flood_light'],

  // ─────────────────────────────────────────────────────────────────────────
  // PER-AREA OVERRIDES
  // ─────────────────────────────────────────────────────────────────────────
  // Browse output/entities.js to find entity IDs and labels
  //
  // Example - all options:
  //   kitchen: {
  //     vacancy_timer_duration: '00:05:00',      // Override vacancy timer
  //     include_in_group: ['switch.kt_cabinet'], // Add entities to light group
  //     exclude_from_group: ['light.kt_notif'],  // Remove from light group
  //     excluded_labels: [],                     // Clear global exclusions for this area
  //     included_labels: ['outdoor'],            // Include outdoor lights in this area
  //   },

  areas: {
    living_room: {
      include_in_group: ['switch.lr_soc_e'],
    },

    bedroom: {
      syncedEntities: {
        mb_standing_lamp: {
          name: 'Master Bedroom Standing Lamp',
          power: null, // Always powered - switch doesn't cut power to bulb
          entities: [
            { entity_id: 'switch.mb_soc', sync: true },
            { entity_id: 'light.mb_soc_bulb', sync: true, controls: 'dimmable' },
            {   // IKEA remote - dimming handled by RODRET blueprint
              device_id: '295eb95ac369b35c6cb4d7ad18669167',
              sync: false,
              blueprint: {
                path: 'EPMatt/ikea_e2201.yaml',
                input: {
                  helper_long_press_delay: 100,             // Faster loop for(default: 250ms)
                  button_up_long_max_loop_repeats: 50,      // Allow enough loops for full range
                  button_down_long_max_loop_repeats: 50,    // Allow enough loops for full range
                  action_button_up_short: [
                    { service: 'light.turn_on', target: { entity_id: 'light.mb_soc_bulb' } },
                  ],
                  action_button_up_long: [
                    { service: 'light.turn_on', target: { entity_id: 'light.mb_soc_bulb' }, data: { brightness_step_pct: 2 } },
                  ],
                  action_button_down_short: [
                    { service: 'light.turn_off', target: { entity_id: 'light.mb_soc_bulb' } },
                  ],
                  action_button_down_long: [
                    { service: 'light.turn_on', target: { entity_id: 'light.mb_soc_bulb' }, data: { brightness_step_pct: -2 } },
                  ],
                },
              },
            },
          ],
        },
      },
    },

    office: {
      syncedEntities: {
        ofc_wall_light: {
          name: 'Office Wall Light',
          power: 'light.ofc_lt_walls', // KNX relay controls power to bulbs
          entities: [
            { entity_id: 'light.ofc_lt_walls', sync: true },
            { entity_id: 'light.ofc_lt_wall_bulbs', sync: true, controls: 'dimmable' },
          ],
        },
      },
    },

    sharon_s_studio: {
      include_in_group: ['switch.stdn_skt'],
      syncedEntities: {
        stdn_standing_lamp: {
          name: 'Studio Standing Lamp',
          power: null,
          entities: [
            { entity_id: 'switch.stdn_skt', sync: true },
            { entity_id: 'light.stdn_standing_lamp_bulb', sync: true, controls: 'dimmable' },
          ],
        },
      },
    },

    // Patio: include outdoor lights (normally excluded globally)
    front_yard: {
      included_labels: ['outdoor'],
    },

    parent_s_wc: {
      syncedEntities: {
        mwc_bathroom_wall_e_light: {
          name: 'Bathroom East Wall',
          power: null,
          entities: [
            { entity_id: 'light.mwc_lt_bathroom_wall_e', sync: true },
            { entity_id: 'switch.mwc_sw_bathroom_wall_e', sync: true },
          ],
        },
      },
    },
  },
}

export default config
