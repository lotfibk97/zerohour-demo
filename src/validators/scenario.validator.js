/**
 * Scenario Validators
 * Single Responsibility: Input validation for scenario operations
 */

const config = require('../config');

/**
 * Validate scenario name
 * @param {string} scenario - Scenario to validate
 * @returns {Object} Validation result
 */
const validateScenario = (scenario) => {
  if (!scenario) {
    return {
      valid: false,
      error: 'Scenario is required.'
    };
  }

  if (!config.validScenarios.includes(scenario)) {
    return {
      valid: false,
      error: `Invalid scenario: ${scenario}. Valid options: ${config.validScenarios.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Validate state name
 * @param {string} state - State to validate
 * @returns {Object} Validation result
 */
const validateState = (state) => {
  if (!state) {
    return { valid: true }; // State is optional, defaults to 'normal'
  }

  if (!config.validStates.includes(state)) {
    return {
      valid: false,
      error: `Invalid state: ${state}. Valid options: ${config.validStates.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Validate setScenario request body
 * @param {Object} body - Request body
 * @returns {Object} Validation result
 */
const validateSetScenarioRequest = (body) => {
  const scenarioValidation = validateScenario(body.scenario);
  if (!scenarioValidation.valid) {
    return scenarioValidation;
  }

  const stateValidation = validateState(body.state);
  if (!stateValidation.valid) {
    return stateValidation;
  }

  return { valid: true };
};

module.exports = {
  validateScenario,
  validateState,
  validateSetScenarioRequest
};
