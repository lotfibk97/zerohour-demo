/**
 * Target Routes
 * Single Responsibility: Target entity and countdown endpoint handlers
 */

const express = require('express');

/**
 * Create target router with injected dependencies
 * @param {StateEngine} stateEngine - State engine instance
 * @param {ScenarioDataService} dataService - Data service instance
 * @returns {Router} Express router
 */
const createTargetRouter = (stateEngine, dataService) => {
  const router = express.Router();

  /**
   * GET /target/current
   * Returns target entity information
   */
  router.get('/current', (req, res) => {
    const targetEntity = dataService.getTargetEntity();
    res.json(targetEntity);
  });

  /**
   * GET /target/countdown
   * Returns countdown/timeline data for the current scenario and state
   */
  router.get('/countdown', (req, res) => {
    const { scenario, state } = stateEngine.getCurrent();
    const countdownData = dataService.getCountdownData(scenario, state);
    res.json(countdownData);
  });

  return router;
};

module.exports = createTargetRouter;
