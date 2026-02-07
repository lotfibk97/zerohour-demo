/**
 * Scenario Data Service Tests (TDD)
 * Tests mock data retrieval for scenarios
 * Updated for client spec schemas
 */

const ScenarioDataService = require('../../src/services/scenarioData.service');
const config = require('../../src/config');

describe('ScenarioDataService', () => {
  let dataService;

  beforeEach(() => {
    dataService = new ScenarioDataService();
  });

  describe('getExposureSummary', () => {
    it('should return summary with correct schema: { risk_level, confidence, domains, summary }', () => {
      const summary = dataService.getExposureSummary('cyber_breach_pre_disclosure', 'normal');

      expect(summary).toBeDefined();
      expect(summary.risk_level).toBeDefined();
      expect(['low', 'elevated', 'high']).toContain(summary.risk_level);
      expect(summary.confidence).toBeDefined();
      expect(['medium', 'high']).toContain(summary.confidence);
      expect(summary.domains).toBeDefined();
      expect(Array.isArray(summary.domains)).toBe(true);
      expect(summary.summary).toBeDefined();
      expect(typeof summary.summary).toBe('string');
    });

    it('should return different risk levels for different states', () => {
      const normalSummary = dataService.getExposureSummary('cyber_breach_pre_disclosure', 'normal');
      const escalationSummary = dataService.getExposureSummary('cyber_breach_pre_disclosure', 'escalation_imminent');

      expect(normalSummary.risk_level).toBe('low');
      expect(escalationSummary.risk_level).toBe('high');
    });

    it('should return null for invalid scenario', () => {
      const summary = dataService.getExposureSummary('invalid', 'normal');
      expect(summary).toBeNull();
    });

    it('should have executive language in summary text', () => {
      const summary = dataService.getExposureSummary('legal_escalation_pre_filing', 'signal_convergence');
      expect(summary.summary).toContain('legal');
    });
  });

  describe('getExposureDomains', () => {
    it('should return domains with correct schema: { legal, cyber, reputational, third_party }', () => {
      const domains = dataService.getExposureDomains('cyber_breach_pre_disclosure', 'normal');

      expect(domains).toBeDefined();
      expect(domains.legal).toBeDefined();
      expect(domains.cyber).toBeDefined();
      expect(domains.reputational).toBeDefined();
      expect(domains.third_party).toBeDefined();
    });

    it('should have status and note for each domain', () => {
      const domains = dataService.getExposureDomains('cyber_breach_pre_disclosure', 'signal_convergence');

      Object.values(domains).forEach(domain => {
        expect(domain.status).toBeDefined();
        expect(['neutral', 'forming', 'active']).toContain(domain.status);
        expect(domain.note).toBeDefined();
        expect(typeof domain.note).toBe('string');
      });
    });

    it('should return different statuses for different states', () => {
      const normalDomains = dataService.getExposureDomains('cyber_breach_pre_disclosure', 'normal');
      const escalationDomains = dataService.getExposureDomains('cyber_breach_pre_disclosure', 'escalation_imminent');

      expect(normalDomains.cyber.status).toBe('neutral');
      expect(escalationDomains.cyber.status).toBe('active');
    });

    it('should return null for invalid scenario', () => {
      const domains = dataService.getExposureDomains('invalid', 'normal');
      expect(domains).toBeNull();
    });
  });

  describe('getExposureTimeline', () => {
    it('should return timeline with correct schema: { past, present, next }', () => {
      const timeline = dataService.getExposureTimeline('cyber_breach_pre_disclosure', 'signal_convergence');

      expect(timeline).toBeDefined();
      expect(timeline).toHaveProperty('past');
      expect(timeline).toHaveProperty('present');
      expect(timeline).toHaveProperty('next');
    });

    it('should return correct state progression for middle state', () => {
      const timeline = dataService.getExposureTimeline('cyber_breach_pre_disclosure', 'signal_convergence');

      expect(timeline.past).toBe('normal');
      expect(timeline.present).toBe('signal_convergence');
      expect(timeline.next).toBe('exposure_window_open');
    });

    it('should return null past for first state', () => {
      const timeline = dataService.getExposureTimeline('cyber_breach_pre_disclosure', 'normal');

      expect(timeline.past).toBeNull();
      expect(timeline.present).toBe('normal');
      expect(timeline.next).toBe('signal_convergence');
    });

    it('should return null next for last state', () => {
      const timeline = dataService.getExposureTimeline('cyber_breach_pre_disclosure', 'escalation_imminent');

      expect(timeline.past).toBe('exposure_window_open');
      expect(timeline.present).toBe('escalation_imminent');
      expect(timeline.next).toBeNull();
    });

    it('should return null for invalid scenario', () => {
      const timeline = dataService.getExposureTimeline('invalid', 'normal');
      expect(timeline).toBeNull();
    });
  });

  describe('getAllScenarios', () => {
    it('should return list of all available scenarios', () => {
      const scenarios = dataService.getAllScenarios();
      expect(scenarios).toEqual(config.validScenarios);
    });
  });

  describe('getAllStates', () => {
    it('should return list of all valid states', () => {
      const states = dataService.getAllStates();
      expect(states).toEqual(config.validStates);
    });
  });
});
