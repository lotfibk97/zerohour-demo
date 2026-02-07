/**
 * State Engine Service
 * Single Responsibility: Manages scenario and state transitions
 * Open/Closed: Can extend with new scenarios without modifying core logic
 */

const config = require('../config');

class StateEngine {
  constructor() {
    this.currentScenario = config.defaultScenario;
    this.currentState = config.defaultState;
    this.lastUpdated = new Date().toISOString();
  }

  /**
   * Get current scenario and state information
   * @returns {Object} Current state information
   */
  getCurrent() {
    return {
      scenario: this.currentScenario,
      state: this.currentState,
      stateIndex: config.validStates.indexOf(this.currentState),
      totalStates: config.validStates.length,
      timestamp: this.lastUpdated
    };
  }

  /**
   * Set the active scenario
   * @param {string} scenario - The scenario to activate
   * @returns {Object} Result with success status
   */
  setScenario(scenario) {
    if (!config.validScenarios.includes(scenario)) {
      return {
        success: false,
        error: `Invalid scenario: ${scenario}. Valid scenarios: ${config.validScenarios.join(', ')}`
      };
    }

    const previous = this.getCurrent();

    this.currentScenario = scenario;
    this.currentState = config.defaultState; // Reset state when changing scenario
    this.lastUpdated = new Date().toISOString();

    return {
      success: true,
      previous,
      current: this.getCurrent()
    };
  }

  /**
   * Set the current state within the active scenario
   * @param {string} state - The state to set
   * @returns {Object} Result with success status
   */
  setState(state) {
    if (!config.validStates.includes(state)) {
      return {
        success: false,
        error: `Invalid state: ${state}. Valid states: ${config.validStates.join(', ')}`
      };
    }

    const previous = this.getCurrent();

    this.currentState = state;
    this.lastUpdated = new Date().toISOString();

    return {
      success: true,
      previous,
      current: this.getCurrent()
    };
  }

  /**
   * Get state progression with current marker
   * @returns {Array} Array of states with current marker
   */
  getStateProgression() {
    return config.validStates.map((state, index) => ({
      name: state,
      isCurrent: state === this.currentState,
      index
    }));
  }

  /**
   * Reset to default scenario and state
   */
  reset() {
    this.currentScenario = config.defaultScenario;
    this.currentState = config.defaultState;
    this.lastUpdated = new Date().toISOString();
  }
}

// Singleton instance for application-wide state
let instance = null;

module.exports = StateEngine;

module.exports.getInstance = () => {
  if (!instance) {
    instance = new StateEngine();
  }
  return instance;
};

module.exports.resetInstance = () => {
  instance = new StateEngine();
  return instance;
};
