/**
 * Route Index
 * Single Responsibility: Route aggregation and dependency wiring
 */

const createAdminRouter = require('./admin.routes');
const createScenarioRouter = require('./scenario.routes');
const createExposureRouter = require('./exposure.routes');
const createTargetRouter = require('./target.routes');

/**
 * Register all routes with dependencies
 * @param {Express} app - Express application
 * @param {Object} dependencies - Service dependencies
 */
const registerRoutes = (app, { stateEngine, dataService }) => {
  // Admin routes (requires auth)
  app.use('/admin', createAdminRouter(stateEngine));

  // Scenario routes (public)
  app.use('/scenario', createScenarioRouter(stateEngine, dataService));

  // Exposure routes (public)
  app.use('/exposure', createExposureRouter(stateEngine, dataService));

  // Target routes (public)
  app.use('/target', createTargetRouter(stateEngine, dataService));
};

module.exports = { registerRoutes };
