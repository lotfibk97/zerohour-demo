/**
 * Application configuration
 * Single Responsibility: Centralized configuration management
 */

const config = {
  port: process.env.PORT || 3000,

  // Admin auth token (Bearer token)
  adminToken: process.env.ADMIN_TOKEN || 'DEMO_ADMIN_TOKEN',

  // Valid states in order of progression
  validStates: [
    'normal',
    'signal_convergence',
    'exposure_window_open',
    'escalation_imminent'
  ],

  // Valid scenarios
  validScenarios: [
    'cyber_breach_pre_disclosure',
    'weaponized_public_narrative',
    'legal_escalation_pre_filing',
    'third_party_exposure_event'
  ],

  // Fixed risk domains
  domains: ['legal', 'cyber', 'reputational', 'third_party'],

  // Risk levels
  riskLevels: ['low', 'elevated', 'high'],

  // Confidence levels
  confidenceLevels: ['medium', 'high'],

  // Domain statuses
  domainStatuses: ['neutral', 'forming', 'active'],

  // Default state
  defaultScenario: 'cyber_breach_pre_disclosure',
  defaultState: 'normal',

  // Target entity configuration
  targetEntity: {
    name: 'MERIDIAN HOLDINGS',
    id: 'E-08471'
  },

  // Countdown/timeline defaults (demo values in minutes from "now")
  countdownDefaults: {
    detected: -106, // 1h 46min ago
    windowCloses: 98, // 98 min remaining
    exposureLost: 248 // ~4h from now
  }
};

module.exports = config;
