/**
 * Scenario Routes
 * Single Responsibility: Scenario state endpoint handlers
 */

const express = require('express');
const StateEngine = require('../services/stateEngine.service');
const ScenarioDataService = require('../services/scenarioData.service');

/**
 * Create scenario router with injected dependencies
 * @param {StateEngine} stateEngine - State engine instance
 * @param {ScenarioDataService} dataService - Data service instance
 * @returns {Router} Express router
 */
const createScenarioRouter = (stateEngine, dataService) => {
  const router = express.Router();

  /**
   * GET /scenario/current
   * Get current scenario, state, and progression info
   */
  router.get('/current', (req, res) => {
    const current = stateEngine.getCurrent();
    const progression = stateEngine.getStateProgression();

    res.json({
      ...current,
      progression
    });
  });

  /**
   * GET /scenario/list
   * Get all available scenarios and states
   */
  router.get('/list', (req, res) => {
    res.json({
      scenarios: dataService.getAllScenarios(),
      states: dataService.getAllStates()
    });
  });

  return router;
};

module.exports = createScenarioRouter;
