/**
 * Express Application
 * Single Responsibility: Application configuration and middleware setup
 * Dependency Injection: Services created and injected here
 */

const express = require('express');
const path = require('path');
const { registerRoutes } = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler.middleware');
const StateEngine = require('./services/stateEngine.service');
const ScenarioDataService = require('./services/scenarioData.service');

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// CORS headers for frontend integration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Request logging (simple) - skip for static files
app.use((req, res, next) => {
  if (!req.path.match(/\.(html|css|js|ico|png|jpg)$/)) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Create service instances (singletons for consistent state)
const stateEngine = StateEngine.getInstance();
const dataService = ScenarioDataService.getInstance();

// Serve static frontend (placeholder UI)
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'zerohour-demo-backend',
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    service: 'ZeroHour Demo Backend',
    version: '1.0.0',
    auth: 'Authorization: Bearer DEMO_ADMIN_TOKEN',
    endpoints: {
      health: 'GET /health',
      ui: 'GET / (placeholder frontend)',
      scenario: {
        current: 'GET /scenario/current',
        list: 'GET /scenario/list'
      },
      exposure: {
        summary: 'GET /exposure/summary → { risk_level, confidence, domains, summary }',
        domains: 'GET /exposure/domains → { legal, cyber, reputational, third_party }',
        timeline: 'GET /exposure/timeline → { past, present, next }'
      },
      admin: {
        setScenario: 'POST /admin/setScenario (requires Bearer token)',
        setState: 'POST /admin/setState (requires Bearer token)',
        reset: 'POST /admin/reset (requires Bearer token)'
      }
    }
  });
});

// Register routes with dependencies
registerRoutes(app, { stateEngine, dataService });

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
