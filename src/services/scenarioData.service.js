/**
 * Scenario Data Service
 * Single Responsibility: Provides mock data for scenarios and states
 *
 * Response schemas per client spec:
 * - summary: { risk_level, confidence, domains, summary }
 * - domains: { legal, cyber, reputational, third_party } each with { status, note }
 * - timeline: { past, present, next } (state-based only)
 */

const config = require('../config');

class ScenarioDataService {
  constructor() {
    this.scenarioData = this._initializeScenarioData();
  }

  /**
   * Initialize all scenario data
   * @private
   */
  _initializeScenarioData() {
    return {
      cyber_breach_pre_disclosure: this._generateCyberBreachData(),
      weaponized_public_narrative: this._generateNarrativeData(),
      legal_escalation_pre_filing: this._generateLegalData(),
      third_party_exposure_event: this._generateThirdPartyData()
    };
  }

  /**
   * Get exposure summary for a scenario/state combination
   * Schema: { risk_level, confidence, domains, summary }
   */
  getExposureSummary(scenario, state) {
    if (!config.validScenarios.includes(scenario)) {
      return null;
    }

    const data = this.scenarioData[scenario];
    const stateData = data.states[state] || data.states.normal;

    return {
      risk_level: stateData.summary.risk_level,
      confidence: stateData.summary.confidence,
      domains: stateData.summary.domains,
      summary: stateData.summary.summary
    };
  }

  /**
   * Get exposure domains for a scenario/state combination
   * Schema: { legal: {status, note}, cyber: {status, note}, ... }
   */
  getExposureDomains(scenario, state) {
    if (!config.validScenarios.includes(scenario)) {
      return null;
    }

    const data = this.scenarioData[scenario];
    const stateData = data.states[state] || data.states.normal;

    return stateData.domains;
  }

  /**
   * Get exposure timeline for a scenario/state combination
   * Schema: { past, present, next } (state names only)
   */
  getExposureTimeline(scenario, state) {
    if (!config.validScenarios.includes(scenario)) {
      return null;
    }

    const stateIndex = config.validStates.indexOf(state);

    return {
      past: stateIndex > 0 ? config.validStates[stateIndex - 1] : null,
      present: state,
      next: stateIndex < config.validStates.length - 1 ? config.validStates[stateIndex + 1] : null
    };
  }

  /**
   * Get all available scenarios
   */
  getAllScenarios() {
    return config.validScenarios;
  }

  /**
   * Get all valid states
   */
  getAllStates() {
    return config.validStates;
  }

  /**
   * Get observed signals for a scenario/state combination
   * Returns signal cards data for the frontend
   */
  getObservedSignals(scenario, state) {
    if (!config.validScenarios.includes(scenario)) {
      return [];
    }

    const stateIndex = config.validStates.indexOf(state);
    const today = new Date();
    const formatDate = (daysAgo) => {
      const d = new Date(today);
      d.setDate(d.getDate() - daysAgo);
      return `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    // Base signals for each scenario (6 signals each for horizontal scroll demo)
    const scenarioSignals = {
      cyber_breach_pre_disclosure: [
        { category: 'Cyber & Network Anomalies', title: 'Anomalous Traffic Pattern Detected', description: 'Network activity indicators are beginning to diverge from established baseline behavior across multiple vectors.' },
        { category: 'Corporate & Third-Party Behavior', title: 'Behavioral Shift Across Dependent Entities', description: 'Multiple third-party entities are exhibiting subtle but correlated changes in activity over a short time window.' },
        { category: 'Cyber & Network Anomalies', title: 'Persistent Network Irregularities Observed', description: 'Repeated low-level anomalies suggest emerging consistency rather than isolated or transient noise.' },
        { category: 'Cyber & Network Anomalies', title: 'Cross-System Signal Alignment Identified', description: 'Independent network signals that typically fluctuate separately are showing early signs of alignment.' },
        { category: 'Financial Stress Indicators', title: 'Unusual Data Transfer Volumes', description: 'Outbound data volumes exceeding normal thresholds during non-business hours.' },
        { category: 'Cyber & Network Anomalies', title: 'Authentication Pattern Deviation', description: 'Login attempts from unexpected geographic regions showing coordinated timing.' }
      ],
      weaponized_public_narrative: [
        { category: 'Open-Web & Reputational Precursors', title: 'Coordinated Narrative Formation Detected', description: 'Multiple independent sources beginning to echo similar themes across social platforms.' },
        { category: 'Open-Web & Reputational Precursors', title: 'Amplification Network Identified', description: 'Bot activity patterns suggest coordinated amplification of specific narrative threads.' },
        { category: 'Open-Web & Reputational Precursors', title: 'Sentiment Shift Acceleration', description: 'Rate of negative sentiment increase exceeds organic growth patterns.' },
        { category: 'Financial Stress Indicators', title: 'Market Positioning Anomaly', description: 'Unusual options activity detected in correlated securities.' },
        { category: 'Open-Web & Reputational Precursors', title: 'Influencer Engagement Spike', description: 'Key opinion leaders showing sudden interest in previously dormant topics.' },
        { category: 'Legal & Regulatory Signals', title: 'Media Inquiry Clustering', description: 'Multiple journalist inquiries arriving within compressed timeframe.' }
      ],
      legal_escalation_pre_filing: [
        { category: 'Legal & Regulatory Signals', title: 'Pre-Filing Activity Indicators', description: 'Legal counsel activity patterns suggest preparation for formal proceedings.' },
        { category: 'Legal & Regulatory Signals', title: 'Settlement Window Narrowing', description: 'Communication patterns indicate diminishing opportunity for pre-litigation resolution.' },
        { category: 'Open-Web & Reputational Precursors', title: 'Plaintiff-Side Media Outreach', description: 'Early indicators of coordinated media strategy from opposing counsel.' },
        { category: 'Legal & Regulatory Signals', title: 'Regulatory Interest Signals', description: 'Inquiry patterns from regulatory bodies showing increased attention.' },
        { category: 'Corporate & Third-Party Behavior', title: 'Witness Coordination Activity', description: 'Communication patterns suggesting preparation of third-party testimonials.' },
        { category: 'Legal & Regulatory Signals', title: 'Document Preservation Notices', description: 'Legal hold requests indicating imminent formal action.' }
      ],
      third_party_exposure_event: [
        { category: 'Corporate & Third-Party Behavior', title: 'Vendor Distress Signals Emerging', description: 'Key personnel movements and financial indicators suggest vendor stability concerns.' },
        { category: 'Corporate & Third-Party Behavior', title: 'Supply Chain Dependency Alert', description: 'Critical vendor showing signs of operational disruption affecting delivery commitments.' },
        { category: 'Financial Stress Indicators', title: 'Credit Risk Elevation', description: 'Third-party credit metrics deteriorating beyond seasonal variance.' },
        { category: 'Corporate & Third-Party Behavior', title: 'Unusual Third-Party Activity Detected', description: 'Behavioral indicators across external partners are deviating from historical norms in a coordinated pattern.' },
        { category: 'Cyber & Network Anomalies', title: 'Vendor System Access Irregularity', description: 'Access patterns from vendor-connected systems showing anomalous behavior.' },
        { category: 'Financial Stress Indicators', title: 'Payment Pattern Disruption', description: 'Vendor payment timing deviating from established schedules.' }
      ]
    };

    const baseSignals = scenarioSignals[scenario] || scenarioSignals.cyber_breach_pre_disclosure;

    // Trajectory progression based on state (6 signals)
    const trajectoryMap = {
      0: ['early', 'early', 'early', 'early', 'early', 'early'],                    // normal
      1: ['detected', 'detected', 'early', 'early', 'early', 'early'],              // signal_convergence
      2: ['alignment', 'alignment', 'detected', 'detected', 'early', 'early'],      // exposure_window_open
      3: ['exposure', 'exposure', 'alignment', 'alignment', 'detected', 'detected'] // escalation_imminent
    };

    const trajectories = trajectoryMap[stateIndex] || trajectoryMap[0];

    const signals = baseSignals.map((signal, index) => ({
      date: formatDate(index < 2 ? 2 : index < 4 ? 1 : 0),
      category: signal.category,
      title: signal.title,
      description: signal.description,
      trajectory: trajectories[index] || 'early',
      highlighted: stateIndex >= 2 && index === baseSignals.length - 1
    }));

    return signals;
  }

  /**
   * Get target entity information
   * @returns {Object} Target entity with name and id
   */
  getTargetEntity() {
    return {
      name: config.targetEntity.name,
      id: config.targetEntity.id
    };
  }

  /**
   * Get countdown/timeline data for display
   * @param {string} scenario - Current scenario
   * @param {string} state - Current state
   * @returns {Object} Countdown data with timestamps and remaining time
   */
  getCountdownData(scenario, state) {
    const now = new Date();
    const defaults = config.countdownDefaults;

    // Calculate timestamps based on current time and defaults
    const detected = new Date(now.getTime() + defaults.detected * 60000);
    const windowCloses = new Date(now.getTime() + defaults.windowCloses * 60000);
    const exposureLost = new Date(now.getTime() + defaults.exposureLost * 60000);

    // Format time as HH:MM
    const formatTime = (date) => {
      return date.toISOString().slice(11, 16);
    };

    // Format date as YYYY.MM.DD UTC
    const formatDate = (date) => {
      return date.toISOString().slice(0, 10).replace(/-/g, '.');
    };

    // Adjust minutes remaining based on state
    let minutesRemaining = defaults.windowCloses;
    if (state === 'escalation_imminent') {
      minutesRemaining = Math.max(5, Math.floor(defaults.windowCloses / 4));
    } else if (state === 'exposure_window_open') {
      minutesRemaining = Math.floor(defaults.windowCloses / 2);
    } else if (state === 'signal_convergence') {
      minutesRemaining = Math.floor(defaults.windowCloses * 0.75);
    }

    return {
      detected: formatTime(detected),
      window_closes: formatTime(windowCloses),
      exposure_lost: formatTime(exposureLost),
      minutes_remaining: minutesRemaining,
      date: formatDate(now) + ' UTC'
    };
  }

  // ============================================
  // Mock Data Generators for Each Scenario
  // ============================================

  _generateCyberBreachData() {
    return {
      name: 'Cyber Breach Pre-Disclosure',
      description: 'Potential data breach detected before public disclosure',
      states: {
        normal: {
          summary: {
            risk_level: 'low',
            confidence: 'high',
            domains: ['cyber'],
            summary: 'No material exposure detected. Systems operating within normal parameters.'
          },
          domains: {
            legal: { status: 'neutral', note: 'No pending legal concerns.' },
            cyber: { status: 'neutral', note: 'Security posture stable.' },
            reputational: { status: 'neutral', note: 'Public sentiment unchanged.' },
            third_party: { status: 'neutral', note: 'Vendor relationships secure.' }
          }
        },
        signal_convergence: {
          summary: {
            risk_level: 'elevated',
            confidence: 'medium',
            domains: ['cyber', 'legal'],
            summary: 'Anomalous network activity aligning with potential intrusion indicators. Early-stage investigation warranted.'
          },
          domains: {
            legal: { status: 'forming', note: 'Breach notification requirements under review.' },
            cyber: { status: 'active', note: 'Unusual data transfers detected; forensics initiated.' },
            reputational: { status: 'neutral', note: 'No external visibility yet.' },
            third_party: { status: 'neutral', note: 'Vendor access audit in progress.' }
          }
        },
        exposure_window_open: {
          summary: {
            risk_level: 'high',
            confidence: 'high',
            domains: ['cyber', 'legal', 'reputational'],
            summary: 'Confirmed unauthorized access to sensitive data. Disclosure window is open and regulatory notification is imminent.'
          },
          domains: {
            legal: { status: 'active', note: 'Regulatory notification timeline triggered.' },
            cyber: { status: 'active', note: 'Containment in progress; exfiltration confirmed.' },
            reputational: { status: 'forming', note: 'Media inquiries beginning; statement preparation underway.' },
            third_party: { status: 'forming', note: 'Partner notification protocols activated.' }
          }
        },
        escalation_imminent: {
          summary: {
            risk_level: 'high',
            confidence: 'high',
            domains: ['cyber', 'legal', 'reputational', 'third_party'],
            summary: 'Full breach exposure imminent. All stakeholders require immediate notification. Crisis protocol activated.'
          },
          domains: {
            legal: { status: 'active', note: 'Regulatory filings in progress; litigation risk elevated.' },
            cyber: { status: 'active', note: 'Active incident response; systems quarantined.' },
            reputational: { status: 'active', note: 'Public disclosure required within hours.' },
            third_party: { status: 'active', note: 'Customer and partner notifications underway.' }
          }
        }
      }
    };
  }

  _generateNarrativeData() {
    return {
      name: 'Weaponized Public Narrative',
      description: 'Coordinated disinformation campaign targeting organization',
      states: {
        normal: {
          summary: {
            risk_level: 'low',
            confidence: 'high',
            domains: ['reputational'],
            summary: 'No material exposure detected. Media landscape stable.'
          },
          domains: {
            legal: { status: 'neutral', note: 'No defamation concerns identified.' },
            cyber: { status: 'neutral', note: 'No coordinated bot activity detected.' },
            reputational: { status: 'neutral', note: 'Brand sentiment positive.' },
            third_party: { status: 'neutral', note: 'Partner relationships stable.' }
          }
        },
        signal_convergence: {
          summary: {
            risk_level: 'elevated',
            confidence: 'medium',
            domains: ['reputational', 'cyber'],
            summary: 'Coordinated narrative forming across social platforms. Bot amplification patterns detected.'
          },
          domains: {
            legal: { status: 'neutral', note: 'Monitoring for actionable defamation.' },
            cyber: { status: 'forming', note: 'Inauthentic account clusters identified.' },
            reputational: { status: 'active', note: 'Negative hashtag gaining traction.' },
            third_party: { status: 'neutral', note: 'No partner impact yet.' }
          }
        },
        exposure_window_open: {
          summary: {
            risk_level: 'high',
            confidence: 'high',
            domains: ['reputational', 'legal', 'third_party'],
            summary: 'Narrative has reached mainstream media. Counter-messaging window closing rapidly.'
          },
          domains: {
            legal: { status: 'forming', note: 'Cease and desist options under review.' },
            cyber: { status: 'active', note: 'Amplification network mapped; origin traced.' },
            reputational: { status: 'active', note: 'Major outlets covering story; crisis comms active.' },
            third_party: { status: 'forming', note: 'Partner distancing signals detected.' }
          }
        },
        escalation_imminent: {
          summary: {
            risk_level: 'high',
            confidence: 'high',
            domains: ['reputational', 'legal', 'third_party', 'cyber'],
            summary: 'Narrative fully weaponized. Executive visibility required. Stakeholder trust at critical threshold.'
          },
          domains: {
            legal: { status: 'active', note: 'Congressional inquiry possible; legal strategy engaged.' },
            cyber: { status: 'active', note: 'Persistent campaign; counter-operations considered.' },
            reputational: { status: 'active', note: 'CEO statement required; stock impact expected.' },
            third_party: { status: 'active', note: 'Major partner review triggered.' }
          }
        }
      }
    };
  }

  _generateLegalData() {
    return {
      name: 'Legal Escalation Pre-Filing',
      description: 'Material litigation risk before formal filing',
      states: {
        normal: {
          summary: {
            risk_level: 'low',
            confidence: 'high',
            domains: ['legal'],
            summary: 'No material exposure detected. Legal landscape clear.'
          },
          domains: {
            legal: { status: 'neutral', note: 'Routine contract matters only.' },
            cyber: { status: 'neutral', note: 'No discovery-related concerns.' },
            reputational: { status: 'neutral', note: 'No litigation publicity risk.' },
            third_party: { status: 'neutral', note: 'No counter-party disputes.' }
          }
        },
        signal_convergence: {
          summary: {
            risk_level: 'elevated',
            confidence: 'medium',
            domains: ['legal', 'reputational'],
            summary: 'Pre-filing legal indicators aligning with reputational signals. Plaintiff counsel activity detected.'
          },
          domains: {
            legal: { status: 'active', note: 'Demand letter received; class action investigation noted.' },
            cyber: { status: 'neutral', note: 'Document preservation notice issued.' },
            reputational: { status: 'forming', note: 'Plaintiff-side media outreach beginning.' },
            third_party: { status: 'neutral', note: 'Contract review initiated.' }
          }
        },
        exposure_window_open: {
          summary: {
            risk_level: 'high',
            confidence: 'high',
            domains: ['legal', 'reputational', 'third_party'],
            summary: 'Near-term legal escalation likely prior to public filing. Settlement window narrowing.'
          },
          domains: {
            legal: { status: 'active', note: 'Filing expected within days; settlement discussions stalled.' },
            cyber: { status: 'forming', note: 'E-discovery scope expanding.' },
            reputational: { status: 'active', note: 'Pre-filing media strategy detected from plaintiff.' },
            third_party: { status: 'forming', note: 'Insurance carrier notified; partner indemnity review.' }
          }
        },
        escalation_imminent: {
          summary: {
            risk_level: 'high',
            confidence: 'high',
            domains: ['legal', 'reputational', 'third_party', 'cyber'],
            summary: 'Litigation filing imminent. Full legal defense activation required. Board notification triggered.'
          },
          domains: {
            legal: { status: 'active', note: 'Complaint imminent; parallel regulatory exposure possible.' },
            cyber: { status: 'active', note: 'Forensic hold expanded; privileged review underway.' },
            reputational: { status: 'active', note: 'Public filing will trigger news cycle.' },
            third_party: { status: 'active', note: 'Counter-claims and indemnification in play.' }
          }
        }
      }
    };
  }

  _generateThirdPartyData() {
    return {
      name: 'Third Party Exposure Event',
      description: 'Critical vendor or partner failure creating exposure',
      states: {
        normal: {
          summary: {
            risk_level: 'low',
            confidence: 'high',
            domains: ['third_party'],
            summary: 'No material exposure detected. Vendor ecosystem healthy.'
          },
          domains: {
            legal: { status: 'neutral', note: 'Contract compliance verified.' },
            cyber: { status: 'neutral', note: 'Vendor security assessments current.' },
            reputational: { status: 'neutral', note: 'No partner-related publicity risk.' },
            third_party: { status: 'neutral', note: 'All critical vendors stable.' }
          }
        },
        signal_convergence: {
          summary: {
            risk_level: 'elevated',
            confidence: 'medium',
            domains: ['third_party', 'cyber'],
            summary: 'Critical vendor showing distress signals. Contingency evaluation initiated.'
          },
          domains: {
            legal: { status: 'neutral', note: 'Contract termination clauses under review.' },
            cyber: { status: 'forming', note: 'Vendor access audit triggered.' },
            reputational: { status: 'neutral', note: 'No public visibility of vendor issues.' },
            third_party: { status: 'active', note: 'Key personnel departures at vendor; financial distress indicators.' }
          }
        },
        exposure_window_open: {
          summary: {
            risk_level: 'high',
            confidence: 'high',
            domains: ['third_party', 'cyber', 'reputational'],
            summary: 'Vendor failure confirmed. Service transition required. Customer impact possible.'
          },
          domains: {
            legal: { status: 'forming', note: 'Breach of contract claim being evaluated.' },
            cyber: { status: 'active', note: 'Data retrieval urgent; access termination in progress.' },
            reputational: { status: 'forming', note: 'Customer communication drafts prepared.' },
            third_party: { status: 'active', note: 'Emergency vendor onboarding initiated.' }
          }
        },
        escalation_imminent: {
          summary: {
            risk_level: 'high',
            confidence: 'high',
            domains: ['third_party', 'cyber', 'reputational', 'legal'],
            summary: 'Vendor collapse imminent. Business continuity at risk. All domains activated.'
          },
          domains: {
            legal: { status: 'active', note: 'Vendor bankruptcy expected; asset recovery in motion.' },
            cyber: { status: 'active', note: 'Data migration critical; system cutover underway.' },
            reputational: { status: 'active', note: 'Customer notification required; SLA breach communications.' },
            third_party: { status: 'active', note: 'Full service transition deadline imminent.' }
          }
        }
      }
    };
  }
}

// Singleton instance
let instance = null;

module.exports = ScenarioDataService;

module.exports.getInstance = () => {
  if (!instance) {
    instance = new ScenarioDataService();
  }
  return instance;
};
