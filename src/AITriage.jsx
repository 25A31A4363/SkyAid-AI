import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const getReasonData = (status) => {
  if (status === 'CRITICAL') {
    return {
      observedAction: 'Unresponsive posture, erratic breathing, weak pulse detected by camera analytics.',
      reasonSummary: 'The model cannot distinguish exact cause from vision alone, but the evidence suggests possible acute cardiac arrest, seizure, or heatstroke.',
      possibleReasons: [
        'No visible response to voice or motion.',
        'Irregular chest movement and facial pallor.',
        'Collapsed posture with limited limb movement.'
      ],
      requirements: [
        'Request immediate hospital trauma team.',
        'Prepare AED and oxygen support.',
        'Assign first aid to maintain airway and monitor breathing.'
      ],
      consciousnessSummary: 'Victim appears unconscious. Drone indicates priority response to possible cardiac distress.'
    };
  }

  if (status === 'MODERATE') {
    return {
      observedAction: 'Slower response, warm skin tone, and slight confusion captured by the camera.',
      reasonSummary: 'AI sees signs that may be heat exhaustion, dehydration, or early cardiac strain, but not a confirmed arrest.',
      possibleReasons: [
        'Elevated heart rate with mild agitation.',
        'Possible heatstroke from sun exposure.',
        'Reduced responsiveness and dizziness.'
      ],
      requirements: [
        'Keep the victim cool and hydrated if conscious.',
        'Alert nearest bystander to support and call EMS.',
        'Prepare hospital for differential diagnosis.'
      ],
      consciousnessSummary: 'Victim is drowsy but may still respond. Advise bystander assistance with calm guidance.'
    };
  }

  return {
    observedAction: 'Stable posture and clear response to surrounding cues are detected.',
    reasonSummary: 'No acute distress pattern is evident in the camera feed. The drone recommends standard monitoring and hospital notification if status changes.',
    possibleReasons: [
      'Normal breathing pattern.',
      'Responsive to voice and movement.',
      'No severe distress signatures detected.'
    ],
    requirements: [
      'Continue to monitor the victim remotely.',
      'Advise bystander to keep the area clear.',
      'Notify hospital team that situation is stable.'
    ],
    consciousnessSummary: 'Victim appears conscious and responsive. Use sound guidance to direct them or a nearby helper.'
  };
};

const Screen4AITriage = ({ setCurrentScreen, state = {}, autoAllowed = false, setTriageStatus, existingRecord = null, onSessionCreate, onTriageComplete }) => {
  const [verdict] = useState(() => {
    if (existingRecord?.priority) return existingRecord.priority;
    const roll = Math.random();
    if (roll > 0.72) return 'CRITICAL';
    if (roll > 0.36) return 'MODERATE';
    return 'SAFE';
  });
  const [{ observedAction, reasonSummary }] = useState(() => getReasonData(verdict));
  const initialConfidence = existingRecord?.confidence ?? 90;
  const [confidence, setConfidence] = useState(initialConfidence);
  const [analyzing, setAnalyzing] = useState(() => existingRecord?.complete ? false : true);
  const displayedConfidence = Math.max(confidence, 90);
  const victimName = state.name || 'VICTIM 01';
  const estimatedAge = state.estimatedAge || '30 ± 6';

  useEffect(() => {
    if (!existingRecord && onSessionCreate) {
      onSessionCreate({
        priority: verdict,
        confidence: initialConfidence,
        complete: false
      });
    }
  }, [existingRecord, onSessionCreate, verdict, initialConfidence]);

  useEffect(() => {
    if (!analyzing) return;

    let conf = confidence || 34;
    const interval = window.setInterval(() => {
      conf += Math.random() * 3;
      if (conf >= 92) {
        conf = 92 + Math.random() * 4;
        setConfidence(conf);
        setAnalyzing(false);
        window.clearInterval(interval);
        return;
      }
      setConfidence(conf);
    }, 45);

    return () => window.clearInterval(interval);
  }, [analyzing, confidence]);

  useEffect(() => {
    if (!analyzing && setTriageStatus) {
      setTriageStatus(verdict);
      if (onTriageComplete && !existingRecord?.complete) {
        onTriageComplete(verdict);
      }
    }
  }, [analyzing, setTriageStatus, verdict, onTriageComplete, existingRecord]);

  useEffect(() => {
    if (!analyzing || !autoAllowed) return;

    const timer = window.setTimeout(() => setCurrentScreen('dashboard', false), 20000);
    return () => window.clearTimeout(timer);
  }, [analyzing, setCurrentScreen, autoAllowed]);

  const getVerdictColor = (v) => {
    if (v.includes('CRITICAL')) return 'var(--red)';
    if (v.includes('MODERATE')) return 'var(--amber)';
    return 'var(--green)';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        paddingTop: '88px',
        background: `
          radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,26,26,0.12) 0%, transparent 70%),
          var(--bg-deep)
        `,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: '1.8rem',
          color: 'var(--cyan)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginTop: '0'
        }}
      >
        AI TRIAGE ANALYSIS
      </motion.h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '16px',
        alignItems: 'center',
        background: 'var(--bg-panel)',
        border: '1px solid rgba(0,229,255,0.14)',
        borderRadius: '18px',
        padding: '18px'
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px'
          }}>
            Victim profile
          </div>
          <div style={{
            fontFamily: 'var(--font-head)',
            fontSize: '1.15rem',
            color: 'var(--white)',
            fontWeight: 700
          }}>
            {victimName}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)',
            marginTop: '6px'
          }}>
            {`Estimated age ${estimatedAge}`}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--cyan)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px'
          }}>
            STATUS
          </div>
          <div style={{
            fontFamily: 'var(--font-head)',
            color: 'var(--green)',
            fontSize: '1.1rem',
            fontWeight: 700
          }}>
            ANALYZING
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid rgba(0, 229, 255, 0.14)',
            borderRadius: '18px',
            padding: '22px'
          }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--cyan)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '12px'
          }}>
            Camera Shot
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-dim)',
            lineHeight: 1.8,
            marginBottom: '20px'
          }}>
            The drone camera provides a visual assessment of posture, breathing cadence, and movement. The model uses these cues to estimate whether the victim is Safe, Moderate, or Critical.
          </div>
          <div style={{
            display: 'grid',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase'
            }}>
              <span>Face tracking</span>
              <span>ACTIVE</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase'
            }}>
              <span>Motion detection</span>
              <span>ENGAGED</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase'
            }}>
              <span>Breathing analysis</span>
              <span>STREAMING</span>
            </div>
          </div>
          <div style={{
            borderTop: `1px solid ${verdict === 'CRITICAL' ? 'rgba(255,26,26,0.28)' : 'rgba(255,255,255,0.08)'}`,
            paddingTop: '16px',
            background: verdict === 'CRITICAL' ? 'rgba(255,26,26,0.08)' : 'rgba(0,229,255,0.04)',
            borderRadius: '14px',
            padding: '18px'
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: getVerdictColor(verdict),
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '10px',
              fontWeight: 700
            }}>
              AI REASONING
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text)',
              lineHeight: 1.7,
              marginBottom: '10px',
              fontWeight: 600
            }}>
              {observedAction}
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-dim)',
              lineHeight: 1.7
            }}>
              {reasonSummary}
            </p>
          </div>
        </motion.div>

        {/* Victim Live Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid rgba(255, 26, 26, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--red)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '15px',
            fontWeight: 700
          }}>
            ⚠ VICTIM (Live Data)
          </div>

          {/* Visual Cues */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                textTransform: 'uppercase'
              }}>
                Visual Cues
              </span>
              <motion.span
                animate={verdict === 'CRITICAL' ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={verdict === 'CRITICAL' ? { duration: 0.8, repeat: Infinity } : { duration: 0 }}
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: '1.1rem',
                  color: 'var(--red)',
                  fontWeight: 700
                }}
              >
                {verdict === 'CRITICAL' ? 'UNRESPONSIVE' : verdict === 'MODERATE' ? 'DISTRESSED' : 'STABLE'}
              </motion.span>
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-dim)',
              lineHeight: 1.7
            }}>
              {verdict === 'CRITICAL'
                ? 'Camera shows erratic breathing and poor limb movement.'
                : verdict === 'MODERATE'
                  ? 'Camera sees slower reactions and shallow breathing.'
                  : 'Camera confirms steady posture and regular breathing patterns.'}
            </div>
          </div>

          {/* Movement */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                textTransform: 'uppercase'
              }}>
                Movement
              </span>
              <motion.span
                animate={verdict === 'CRITICAL' ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
                transition={verdict === 'CRITICAL' ? { duration: 1.5, repeat: Infinity } : { duration: 0 }}
                style={{
                  fontFamily: 'var(--font-head)',
                  color: verdict === 'CRITICAL' ? 'var(--red)' : verdict === 'MODERATE' ? 'var(--amber)' : 'var(--green)'
                }}
              >
                {verdict === 'CRITICAL' ? 'CRITICAL' : verdict === 'MODERATE' ? 'MODERATE' : 'SAFE'}
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>


      {/* Verdict Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          background: `rgba(255, 26, 26, 0.08)`,
          border: `1px solid rgba(255, 26, 26, 0.3)`,
          borderRadius: '12px',
          padding: '30px 20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {analyzing && (
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.2), transparent)',
              pointerEvents: 'none'
            }}
          />
        )}

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '15px'
        }}>
          AI VERDICT
        </div>

        <motion.div
          animate={verdict === 'CRITICAL' ? { fontSize: ['2.5rem', '3rem', '2.5rem'] } : { fontSize: '2.5rem' }}
          transition={verdict === 'CRITICAL' ? { duration: 0.5, repeat: Infinity } : { duration: 0 }}
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '4px',
            color: getVerdictColor(verdict),
            textTransform: 'uppercase',
            marginBottom: '15px'
          }}
        >
          {verdict}
        </motion.div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
            textTransform: 'uppercase'
          }}>
            Confidence:
          </span>
          <motion.span
            animate={{ color: getVerdictColor(verdict) }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: '1.3rem',
              fontWeight: 700,
              letterSpacing: '1px'
            }}
          >
            {displayedConfidence.toFixed(1)}%
          </motion.span>
        </div>

        {/* Confidence Bar */}
        <motion.div
          style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 26, 26, 0.2)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '15px'
          }}
        >
          <motion.div
            animate={{ width: `${displayedConfidence}%` }}
            transition={{ duration: 0.3 }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${getVerdictColor(verdict)}, var(--cyan))`,
              borderRadius: '4px'
            }}
          />
        </motion.div>
      </motion.div>


      {/* Auto Advance Button */}
      {!analyzing && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen('dashboard')}
          style={{
            padding: '12px 30px',
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid var(--cyan)',
            borderRadius: '8px',
            color: 'var(--cyan)',
            fontFamily: 'var(--font-head)',
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          → NEXT: CONTROL DASHBOARD
        </motion.button>
      )}
    </motion.div>
  );
};

export default Screen4AITriage;