/**
 * Exposure Routes
 * Single Responsibility: Exposure data endpoint handlers
 *
 * Response schemas per client spec:
 * - GET /exposure/summary: { risk_level, confidence, domains, summary }
 * - GET /exposure/domains: { legal, cyber, reputational, third_party }
 * - GET /exposure/timeline: { past, present, next }
 */

const express = require('express');
const StateEngine = require('../services/stateEngine.service');
const ScenarioDataService = require('../services/scenarioData.service');

/**
 * Create exposure router with injected dependencies
 * @param {StateEngine} stateEngine - State engine instance
 * @param {ScenarioDataService} dataService - Data service instance
 * @returns {Router} Express router
 */
const createExposureRouter = (stateEngine, dataService) => {
  const router = express.Router();

  /**
   * GET /exposure/summary
   * Schema: { risk_level, confidence, domains, summary }
   */
  router.get('/summary', (req, res) => {
    const { scenario, state } = stateEngine.getCurrent();
    const summary = dataService.getExposureSummary(scenario, state);

    if (!summary) {
      return res.status(404).json({
        error: 'Scenario data not found'
      });
    }

    res.json(summary);
  });

  /**
   * GET /exposure/domains
   * Schema: { legal: {status, note}, cyber: {status, note}, ... }
   */
  router.get('/domains', (req, res) => {
    const { scenario, state } = stateEngine.getCurrent();
    const domains = dataService.getExposureDomains(scenario, state);

    if (!domains) {
      return res.status(404).json({
        error: 'Scenario data not found'
      });
    }

    res.json(domains);
  });

  /**
   * GET /exposure/timeline
   * Schema: { past, present, next }
   */
  router.get('/timeline', (req, res) => {
    const { scenario, state } = stateEngine.getCurrent();
    const timeline = dataService.getExposureTimeline(scenario, state);

    if (!timeline) {
      return res.status(404).json({
        error: 'Scenario data not found'
      });
    }

    res.json(timeline);
  });

  /**
   * GET /exposure/signals
   * Returns observed signals for the current scenario/state
   */
  router.get('/signals', (req, res) => {
    const { scenario, state } = stateEngine.getCurrent();
    const signals = dataService.getObservedSignals(scenario, state);
    res.json(signals);
  });

  return router;
};

module.exports = createExposureRouter;
