/**
 * Exposure Routes Integration Tests
 * Updated for client spec schemas
 */

const request = require('supertest');
const app = require('../../src/app');
const config = require('../../src/config');

describe('Exposure Routes', () => {
  const authHeader = `Bearer ${config.adminToken}`;

  beforeEach(async () => {
    // Reset to known state before each test
    await request(app)
      .post('/admin/reset')
      .set('Authorization', authHeader);
  });

  describe('GET /exposure/summary', () => {
    it('should return summary with schema: { risk_level, confidence, domains, summary }', async () => {
      const response = await request(app)
        .get('/exposure/summary');

      expect(response.status).toBe(200);
      expect(response.body.risk_level).toBeDefined();
      expect(response.body.confidence).toBeDefined();
      expect(response.body.domains).toBeDefined();
      expect(response.body.summary).toBeDefined();
    });

    it('should return valid risk_level values', async () => {
      const response = await request(app)
        .get('/exposure/summary');

      expect(['low', 'elevated', 'high']).toContain(response.body.risk_level);
    });

    it('should return valid confidence values', async () => {
      const response = await request(app)
        .get('/exposure/summary');

      expect(['medium', 'high']).toContain(response.body.confidence);
    });

    it('should reflect state changes', async () => {
      await request(app)
        .post('/admin/setScenario')
        .set('Authorization', authHeader)
        .send({
          scenario: 'cyber_breach_pre_disclosure',
          state: 'escalation_imminent'
        });

      const response = await request(app)
        .get('/exposure/summary');

      expect(response.body.risk_level).toBe('high');
    });

    it('should not require authentication', async () => {
      const response = await request(app)
        .get('/exposure/summary');

      expect(response.status).toBe(200);
    });

    it('should NOT include scenario/state in response (clean schema)', async () => {
      const response = await request(app)
        .get('/exposure/summary');

      expect(response.body.scenario).toBeUndefined();
      expect(response.body.state).toBeUndefined();
    });
  });

  describe('GET /exposure/domains', () => {
    it('should return domains with schema: { legal, cyber, reputational, third_party }', async () => {
      const response = await request(app)
        .get('/exposure/domains');

      expect(response.status).toBe(200);
      expect(response.body.legal).toBeDefined();
      expect(response.body.cyber).toBeDefined();
      expect(response.body.reputational).toBeDefined();
      expect(response.body.third_party).toBeDefined();
    });

    it('should have status and note for each domain', async () => {
      const response = await request(app)
        .get('/exposure/domains');

      const domains = ['legal', 'cyber', 'reputational', 'third_party'];
      domains.forEach(domain => {
        expect(response.body[domain].status).toBeDefined();
        expect(response.body[domain].note).toBeDefined();
      });
    });

    it('should return valid status values', async () => {
      const response = await request(app)
        .get('/exposure/domains');

      const validStatuses = ['neutral', 'forming', 'active'];
      const domains = ['legal', 'cyber', 'reputational', 'third_party'];

      domains.forEach(domain => {
        expect(validStatuses).toContain(response.body[domain].status);
      });
    });

    it('should NOT include scenario/state in response (clean schema)', async () => {
      const response = await request(app)
        .get('/exposure/domains');

      expect(response.body.scenario).toBeUndefined();
      expect(response.body.state).toBeUndefined();
    });
  });

  describe('GET /exposure/timeline', () => {
    it('should return timeline with schema: { past, present, next }', async () => {
      const response = await request(app)
        .get('/exposure/timeline');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('past');
      expect(response.body).toHaveProperty('present');
      expect(response.body).toHaveProperty('next');
    });

    it('should return state names only (no timestamps)', async () => {
      await request(app)
        .post('/admin/setScenario')
        .set('Authorization', authHeader)
        .send({
          scenario: 'cyber_breach_pre_disclosure',
          state: 'signal_convergence'
        });

      const response = await request(app)
        .get('/exposure/timeline');

      expect(response.body.past).toBe('normal');
      expect(response.body.present).toBe('signal_convergence');
      expect(response.body.next).toBe('exposure_window_open');
    });

    it('should return null past for first state', async () => {
      const response = await request(app)
        .get('/exposure/timeline');

      expect(response.body.past).toBeNull();
      expect(response.body.present).toBe('normal');
    });

    it('should return null next for last state', async () => {
      await request(app)
        .post('/admin/setScenario')
        .set('Authorization', authHeader)
        .send({
          scenario: 'cyber_breach_pre_disclosure',
          state: 'escalation_imminent'
        });

      const response = await request(app)
        .get('/exposure/timeline');

      expect(response.body.present).toBe('escalation_imminent');
      expect(response.body.next).toBeNull();
    });

    it('should NOT include events array (state-based only)', async () => {
      const response = await request(app)
        .get('/exposure/timeline');

      expect(response.body.events).toBeUndefined();
    });
  });
});
