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
      included_lights: ['switch.lr_soc_e', 'switch.lr_soc_w'],
      tv: {
        tv_remote_entity: 'remote.tv_samsung_7_series_65',
        tv_media_player_entity: 'media_player.tv_samsung_7_series_65',
        tv_platform: 'Samsung TV',

        controls: [
          {
            id: 'volume_down',
            name: 'Volume Down',
            icon: 'mdi:volume-minus',
            command: {
              entity: 'remote.tv_samsung_7_series_65',
              type: 'send_command',
              payload: { command: 'KEY_VOLUMEDOWN' },
            },
          },
          {
            id: 'mute',
            name: 'Mute',
            icon: 'mdi:volume-mute',
            command: {
              entity: 'remote.tv_samsung_7_series_65',
              type: 'send_command',
              payload: { command: 'KEY_MUTE' },
            },
          },
          {
            id: 'volume_up',
            name: 'Volume Up',
            icon: 'mdi:volume-plus',
            command: {
              entity: 'remote.tv_samsung_7_series_65',
              type: 'send_command',
              payload: { command: 'KEY_VOLUMEUP' },
            },
          },
        ],

        sources: [
          {
            id: 'tv',
            name: 'TV',
            icon: 'mdi:television',
            select_source: { source: 'TV' },
            favorites: [
              {
                id: 'tv_tuner',
                name: 'TV',
                icon: 'mdi:television',
                command: {
                  entity: 'media_player.tv_samsung_7_series_65',
                  type: 'select_source',
                  payload: { source: 'TV' },
                },
              },
              {
                id: 'tv_netflix',
                name: 'Netflix',
                icon: 'mdi:netflix',
                command: {
                  entity: 'media_player.tv_samsung_7_series_65',
                  type: 'select_source',
                  payload: { source: 'Netflix' },
                },
              },
              {
                id: 'tv_hdmi1',
                name: 'HDMI 1',
                icon: 'mdi:hdmi-port',
                command: {
                  entity: 'media_player.tv_samsung_7_series_65',
                  type: 'select_source',
                  payload: { source: 'HDMI 1' },
                },
              },
            ],
          },
          {
            id: 'apple_tv',
            name: 'Apple TV',
            icon: 'mdi:apple',
            select_source: { source: 'HDMI 3' }, // verify which HDMI port Apple TV uses
            platform: 'Apple TV',
            remote_entity: 'remote.slvn',
            media_player_entity: 'media_player.lr_apple_tv',
            favorites: [
              {
                id: 'netflix',
                name: 'Netflix',
                icon: 'mdi:netflix',
                command: {
                  entity: 'media_player.lr_apple_tv',
                  type: 'select_source',
                  payload: { source: 'Netflix' },
                },
              },
              {
                id: 'youtube',
                name: 'YouTube',
                icon: 'mdi:youtube',
                command: {
                  entity: 'media_player.lr_apple_tv',
                  type: 'select_source',
                  payload: { source: 'YouTube' },
                },
              },
            ],
            controls: [
              {
                id: 'play_pause',
                name: 'Play / Pause',
                icon: 'mdi:play-pause',
                command: {
                  entity: 'remote.slvn',
                  type: 'send_command',
                  payload: { command: 'play_pause' },
                },
              },
              {
                id: 'back',
                name: 'Back',
                icon: 'mdi:chevron-left',
                command: {
                  entity: 'remote.slvn',
                  type: 'send_command',
                  payload: { command: 'menu' },
                },
              },
              {
                id: 'home',
                name: 'Home',
                icon: 'mdi:television',
                command: {
                  entity: 'remote.slvn',
                  type: 'send_command',
                  payload: { command: 'home' },
                },
              },
            ],
          },
        ],
      },
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
	parent_s_wc: {
		visible_to_users: PARENTS,
		excluded_lights: ['light.mwc_lt_bathroom_wall_s', 'light.mwc_lt_bathroom_wall_e'],
	},
  },
}

export default config
