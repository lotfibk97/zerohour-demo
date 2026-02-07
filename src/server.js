/**
 * Server Entry Point
 * Single Responsibility: Server startup and port binding
 */

const app = require('./app');
const config = require('./config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log('');
  console.log('=========================================');
  console.log('  ZeroHour Demo Backend');
  console.log('=========================================');
  console.log(`  Server running on: http://localhost:${PORT}`);
  console.log(`  Admin API Key: ${config.adminApiKey}`);
  console.log('');
  console.log('  Endpoints:');
  console.log('    GET  /health           - Health check');
  console.log('    GET  /scenario/current - Current state');
  console.log('    GET  /scenario/list    - Available scenarios');
  console.log('    GET  /exposure/summary - Exposure summary');
  console.log('    GET  /exposure/domains - Risk domains');
  console.log('    GET  /exposure/timeline - Event timeline');
  console.log('    POST /admin/setScenario - Set scenario (auth)');
  console.log('    POST /admin/setState   - Set state (auth)');
  console.log('    POST /admin/reset      - Reset state (auth)');
  console.log('=========================================');
  console.log('');
});
