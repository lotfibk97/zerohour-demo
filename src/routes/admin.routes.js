/**
 * Admin Routes
 * Single Responsibility: Admin endpoint handlers
 * Auth: Bearer token (Authorization: Bearer DEMO_ADMIN_TOKEN)
 */

const express = require('express');
const { validateAdminToken } = require('../middleware/auth.middleware');
const { validateSetScenarioRequest } = require('../validators/scenario.validator');
const StateEngine = require('../services/stateEngine.service');

/**
 * Create admin router with injected dependencies
 * @param {StateEngine} stateEngine - State engine instance
 * @returns {Router} Express router
 */
const createAdminRouter = (stateEngine) => {
  const router = express.Router();

  // All admin routes require Bearer token
  router.use(validateAdminToken);

  /**
   * POST /admin/setScenario
   * Set the current scenario and optionally the state
   */
  router.post('/setScenario', (req, res) => {
    const validation = validateSetScenarioRequest(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const { scenario, state } = req.body;

    // Set scenario first
    const scenarioResult = stateEngine.setScenario(scenario);

    if (!scenarioResult.success) {
      return res.status(400).json(scenarioResult);
    }

    // If state provided, set it
    if (state) {
      const stateResult = stateEngine.setState(state);

      if (!stateResult.success) {
        return res.status(400).json(stateResult);
      }
    }

    res.json({
      success: true,
      message: `Scenario set to '${scenario}', state set to '${state || 'normal'}'`,
      previous: scenarioResult.previous,
      current: stateEngine.getCurrent()
    });
  });

  /**
   * POST /admin/reset
   * Reset to default scenario and state
   */
  router.post('/reset', (req, res) => {
    const previous = stateEngine.getCurrent();
    stateEngine.reset();

    res.json({
      success: true,
      message: 'Reset to default state',
      previous,
      current: stateEngine.getCurrent()
    });
  });

  /**
   * POST /admin/setState
   * Set only the state (keeps current scenario)
   */
  router.post('/setState', (req, res) => {
    const { state } = req.body;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State is required.'
      });
    }

    const result = stateEngine.setState(state);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: `State set to '${state}'`,
      previous: result.previous,
      current: result.current
    });
  });

  return router;
};

module.exports = createAdminRouter;
