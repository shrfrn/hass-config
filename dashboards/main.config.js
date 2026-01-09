// @ts-check
// ============================================================================
// MAIN DASHBOARD CONFIG (Bubble template)
// ============================================================================
// Popup-based dashboard using Bubble Card.
// Extends global config with template-specific settings.
//
// This file is never overwritten by the generator.
// ============================================================================

import globalConfig from './shared.js'

/** @type {import('../inventory/types/dashboard-bubble.d.ts').BubbleDashboardConfig} */
const config = {
  ...globalConfig,

  // Dashboard template
  template: 'bubble',

  // Output file path (relative to project root)
  output: 'lovelace/main.yaml',

  // Dashboard view title
  dashboard_name: 'Home',

  // HA registration settings (auto-updates configuration.yaml)
  dashboard_path: 'home-main',
  dashboard_title: 'Home',
  dashboard_icon: 'mdi:view-dashboard',
}

export default config
