// @ts-check
// ============================================================================
// YAML GENERATOR CONFIG
// ============================================================================
// Purpose: Configures the YAML package generator (npm run generate:yaml)
// Outputs: packages/areas/*.yaml (light groups, helpers, timers, etc.)
//
// This file is never overwritten by the generator.
// ============================================================================

import { ikeaE2201Base, ikeaE2201DblClick, ikeaE2213Base, ikeaE2213DblClick } from 'hass-generator/src/blueprints/index.js'

/** @type {import('./inventory/types/config.d.ts').GeneratorConfig} */
const config = {
    // Schema version - do not change mikeaE2213Baseanually
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
            exclude_from_group: ['light.mb_wardrobe_ikea_bulb'],
            syncedEntities: {
                mb_standing_lamp: {
                    name: 'Master Bedroom Standing Lamp',
                    power: null, // Always powered - switch doesn't cut power to bulb
                    entities: [
                        { entity_id: 'switch.mb_soc', sync: true },
                        { entity_id: 'light.mb_soc_bulb', sync: true, controls: 'dimmable' },
                        {   // IKEA remote (Sharon's) - dimming handled by RODRET blueprint
                            device_id: '295eb95ac369b35c6cb4d7ad18669167',
                            sync: false,
                            blueprint: ikeaE2201DblClick('light.mb_soc_bulb'),
                        },
                    ],
                },
                mb_wardrobe_counter_lamp: {
                    name: 'Wardrobe Counter Lamp',
                    power: null, // Always powered - switch doesn't cut power to bulb
                    entities: [
                        { entity_id: 'light.mb_wardrobe_ikea_bulb', sync: true, controls: 'dimmable' },
                        {   // IKEA remote (wardrobe) - dimming handled by SOMRIG blueprint
                            device_id: '040ff523d1637c52a0e79e8f4f7d3353',
                            sync: false,
                            blueprint: ikeaE2213Base('light.mb_wardrobe_ikea_bulb'),
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
                        {   // IKEA remote - dimming handled by RODRET blueprint
                            device_id: '09fbd2ceffb101e3b5e10adf0f7a83b9',
                            name: 'shahar',
                            sync: false,
                            blueprint: ikeaE2201Base('light.ofc_wall_light'),
                        },
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
                bathroom_wall_lights: {
                    name: 'Bathroom Wall Lights',
                    power: null,
                    entities: [
                        // { entity_id: 'light.mwc_lt_bathroom_wall_e', sync: true },
                        { entity_id: 'light.mwc_bathroom_east_wall_ikea_bulb', sync: true, controls: 'dimmable' },
                        { entity_id: 'light.mwc_bathroom_south_wall_ikea_bulb', sync: true, controls: 'dimmable' },
                        { entity_id: 'switch.mwc_sw_bathroom_wall_e', sync: true },
                        {
                            device_id: '9ac17cdea1e5d29ba9f8739af9b77d99',
                            name: 'Bathroom Remote',
                            sync: false,
                            blueprint: ikeaE2213Base('bathroom_wall_lights'),
                        }
                    ],
                },
            },
        },
    },
}

export default config
