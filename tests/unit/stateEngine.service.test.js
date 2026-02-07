/**
 * State Engine Service Tests (TDD)
 * Tests the core state machine functionality
 */

const StateEngine = require('../../src/services/stateEngine.service');
const config = require('../../src/config');

describe('StateEngine Service', () => {
  let stateEngine;

  beforeEach(() => {
    stateEngine = new StateEngine();
  });

  describe('initialization', () => {
    it('should initialize with default scenario and state', () => {
      const current = stateEngine.getCurrent();

      expect(current.scenario).toBe(config.defaultScenario);
      expect(current.state).toBe(config.defaultState);
    });

    it('should have timestamp on initialization', () => {
      const current = stateEngine.getCurrent();

      expect(current.timestamp).toBeDefined();
      expect(typeof current.timestamp).toBe('string');
    });
  });

  describe('setScenario', () => {
    it('should set a valid scenario', () => {
      const result = stateEngine.setScenario('weaponized_public_narrative');

      expect(result.success).toBe(true);
      expect(stateEngine.getCurrent().scenario).toBe('weaponized_public_narrative');
    });

    it('should reset state to normal when changing scenario', () => {
      stateEngine.setState('escalation_imminent');
      stateEngine.setScenario('legal_escalation_pre_filing');

      expect(stateEngine.getCurrent().state).toBe('normal');
    });

    it('should reject invalid scenario', () => {
      const result = stateEngine.setScenario('invalid_scenario');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid scenario');
    });

    it('should return previous and new state info', () => {
      stateEngine.setScenario('cyber_breach_pre_disclosure');
      stateEngine.setState('signal_convergence');

      const result = stateEngine.setScenario('legal_escalation_pre_filing');

      expect(result.previous.scenario).toBe('cyber_breach_pre_disclosure');
      expect(result.previous.state).toBe('signal_convergence');
      expect(result.current.scenario).toBe('legal_escalation_pre_filing');
      expect(result.current.state).toBe('normal');
    });
  });

  describe('setState', () => {
    it('should set a valid state', () => {
      const result = stateEngine.setState('signal_convergence');

      expect(result.success).toBe(true);
      expect(stateEngine.getCurrent().state).toBe('signal_convergence');
    });

    it('should reject invalid state', () => {
      const result = stateEngine.setState('invalid_state');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid state');
    });

    it('should allow setting any valid state (demo flexibility)', () => {
      // In demo mode, we allow jumping to any state
      stateEngine.setState('escalation_imminent');
      expect(stateEngine.getCurrent().state).toBe('escalation_imminent');

      stateEngine.setState('normal');
      expect(stateEngine.getCurrent().state).toBe('normal');
    });
  });

  describe('getCurrent', () => {
    it('should return current scenario, state, and metadata', () => {
      stateEngine.setScenario('third_party_exposure_event');
      stateEngine.setState('exposure_window_open');

      const current = stateEngine.getCurrent();

      expect(current).toEqual(expect.objectContaining({
        scenario: 'third_party_exposure_event',
        state: 'exposure_window_open',
        stateIndex: 2,
        totalStates: 4
      }));
    });
  });

  describe('getStateProgression', () => {
    it('should return all states with current marked', () => {
      stateEngine.setState('signal_convergence');

      const progression = stateEngine.getStateProgression();

      expect(progression).toHaveLength(4);
      expect(progression[0]).toEqual({ name: 'normal', isCurrent: false, index: 0 });
      expect(progression[1]).toEqual({ name: 'signal_convergence', isCurrent: true, index: 1 });
    });
  });

  describe('reset', () => {
    it('should reset to default state', () => {
      stateEngine.setScenario('legal_escalation_pre_filing');
      stateEngine.setState('escalation_imminent');

      stateEngine.reset();

      const current = stateEngine.getCurrent();
      expect(current.scenario).toBe(config.defaultScenario);
      expect(current.state).toBe(config.defaultState);
    });
  });
});
