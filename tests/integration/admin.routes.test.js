/**
 * Admin Routes Integration Tests
 * Updated for Bearer token auth
 */

const request = require('supertest');
const app = require('../../src/app');
const config = require('../../src/config');

describe('Admin Routes', () => {
  const validToken = config.adminToken;
  const authHeader = `Bearer ${validToken}`;

  describe('POST /admin/setScenario', () => {
    it('should set scenario and state with valid Bearer token', async () => {
      const response = await request(app)
        .post('/admin/setScenario')
        .set('Authorization', authHeader)
        .send({
          scenario: 'weaponized_public_narrative',
          state: 'signal_convergence'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.current.scenario).toBe('weaponized_public_narrative');
      expect(response.body.current.state).toBe('signal_convergence');
    });

    it('should set scenario with default state when state not provided', async () => {
      const response = await request(app)
        .post('/admin/setScenario')
        .set('Authorization', authHeader)
        .send({
          scenario: 'legal_escalation_pre_filing'
        });

      expect(response.status).toBe(200);
      expect(response.body.current.scenario).toBe('legal_escalation_pre_filing');
      expect(response.body.current.state).toBe('normal');
    });

    it('should reject request without Authorization header', async () => {
      const response = await request(app)
        .post('/admin/setScenario')
        .send({
          scenario: 'cyber_breach_pre_disclosure'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Authorization');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .post('/admin/setScenario')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          scenario: 'cyber_breach_pre_disclosure'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid');
    });

    it('should reject request with wrong auth format', async () => {
      const response = await request(app)
        .post('/admin/setScenario')
        .set('Authorization', 'Basic sometoken')
        .send({
          scenario: 'cyber_breach_pre_disclosure'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Bearer');
    });

    it('should reject invalid scenario', async () => {
      const response = await request(app)
        .post('/admin/setScenario')
        .set('Authorization', authHeader)
        .send({
          scenario: 'invalid_scenario'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid scenario');
    });

    it('should reject invalid state', async () => {
      const response = await request(app)
        .post('/admin/setScenario')
        .set('Authorization', authHeader)
        .send({
          scenario: 'cyber_breach_pre_disclosure',
          state: 'invalid_state'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid state');
    });

    it('should return previous state info in response', async () => {
      // Set initial state
      await request(app)
        .post('/admin/setScenario')
        .set('Authorization', authHeader)
        .send({
          scenario: 'cyber_breach_pre_disclosure',
          state: 'normal'
        });

      // Change state
      const response = await request(app)
        .post('/admin/setScenario')
        .set('Authorization', authHeader)
        .send({
          scenario: 'third_party_exposure_event',
          state: 'escalation_imminent'
        });

      expect(response.body.previous).toBeDefined();
      expect(response.body.previous.scenario).toBe('cyber_breach_pre_disclosure');
    });
  });

  describe('POST /admin/reset', () => {
    it('should reset to default state', async () => {
      // Set non-default state
      await request(app)
        .post('/admin/setScenario')
        .set('Authorization', authHeader)
        .send({
          scenario: 'legal_escalation_pre_filing',
          state: 'escalation_imminent'
        });

      // Reset
      const response = await request(app)
        .post('/admin/reset')
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body.current.scenario).toBe(config.defaultScenario);
      expect(response.body.current.state).toBe(config.defaultState);
    });

    it('should require Authorization header', async () => {
      const response = await request(app)
        .post('/admin/reset');

      expect(response.status).toBe(401);
    });
  });
});
