/**
 * Scenario Routes Integration Tests
 */

const request = require('supertest');
const app = require('../../src/app');
const config = require('../../src/config');

describe('Scenario Routes', () => {
  const authHeader = `Bearer ${config.adminToken}`;

  beforeEach(async () => {
    // Reset to known state before each test
    await request(app)
      .post('/admin/reset')
      .set('Authorization', authHeader);
  });

  describe('GET /scenario/current', () => {
    it('should return current scenario and state', async () => {
      const response = await request(app)
        .get('/scenario/current');

      expect(response.status).toBe(200);
      expect(response.body.scenario).toBeDefined();
      expect(response.body.state).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
    });

    it('should reflect state changes', async () => {
      // Set specific state
      await request(app)
        .post('/admin/setScenario')
        .set('Authorization', authHeader)
        .send({
          scenario: 'weaponized_public_narrative',
          state: 'exposure_window_open'
        });

      const response = await request(app)
        .get('/scenario/current');

      expect(response.body.scenario).toBe('weaponized_public_narrative');
      expect(response.body.state).toBe('exposure_window_open');
    });

    it('should include state progression info', async () => {
      const response = await request(app)
        .get('/scenario/current');

      expect(response.body.stateIndex).toBeDefined();
      expect(response.body.totalStates).toBe(4);
      expect(response.body.progression).toBeDefined();
      expect(Array.isArray(response.body.progression)).toBe(true);
    });

    it('should not require authentication', async () => {
      const response = await request(app)
        .get('/scenario/current');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /scenario/list', () => {
    it('should return all available scenarios', async () => {
      const response = await request(app)
        .get('/scenario/list');

      expect(response.status).toBe(200);
      expect(response.body.scenarios).toEqual(config.validScenarios);
      expect(response.body.states).toEqual(config.validStates);
    });
  });
});
