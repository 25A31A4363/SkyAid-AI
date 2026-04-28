import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ControlDashboard = ({ setCurrentScreen, state = {}, autoAllowed = false, triageStatus = 'PENDING', battery = 0, statusInfo = {}, missionQueue = [], activeMission = null, notificationLog = [] }) => {
  const [timestamp, setTimestamp] = useState(
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  );
  const incomingCases = missionQueue.length;
  const activeLabel = activeMission ? `${activeMission.name} (${activeMission.status.toUpperCase()})` : 'NO ACTIVE MISSION';
  const receivedAlerts = notificationLog.length;
  const batteryLabel = statusInfo?.battery || `${Number(battery).toFixed(0)}%`;
  const triageColor = triageStatus === 'CRITICAL' ? 'var(--red)' : triageStatus === 'MODERATE' ? 'var(--amber)' : 'var(--green)';

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimestamp(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!autoAllowed) return;
    const timer = window.setTimeout(() => setCurrentScreen('hospital', false), 15000);
    return () => window.clearTimeout(timer);
  }, [autoAllowed, setCurrentScreen]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        paddingTop: '104px',
        background: `
          radial-gradient(ellipse 50% 40% at 50% 0%, rgba(0,229,255,0.08) 0%, transparent 70%),
          var(--bg)
        `,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: '2rem',
          color: 'var(--text)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '30px',
          marginTop: '20px',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '18px 22px',
          borderRadius: '20px',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.22)',
          textShadow: '0 0 18px rgba(0, 229, 255, 0.14)'
        }}
      >
        CONTROL DASHBOARD
      </motion.h1>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div>COMMAND CENTER</div>
        <div>QUEUE: {incomingCases}</div>
        <div>ACTIVE: {activeLabel}</div>
        <div style={{ color: triageColor, fontWeight: 700 }}>TRIAGE: {triageStatus}</div>
        <div>HOSPITAL: {statusInfo.hospital || 'PENDING'}</div>
        <div>ALERTS: {receivedAlerts}</div>
        <div>LAST UPDATED {timestamp}</div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}
      >
        <motion.div
          variants={item}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,229,255,0.2)' }}
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <motion.div
            animate={{ opacity: [0, 0.1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.1), transparent)'
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 1
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>🚁</span>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--cyan)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                DRONE STATUS
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '1px'
                }}
              >
                DISPATCH UNIT 01
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(0, 230, 118, 0.1)',
              border: '1px solid rgba(0, 230, 118, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ color: 'var(--green)', fontWeight: 700 }}>✓ ACTIVE</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>SPEED:</span>
              <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>54 km/h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>ALTITUDE:</span>
              <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>220 m</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>BATTERY:</span>
              <span style={{ color: battery > 30 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>{batteryLabel}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,26,26,0.2)' }}
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid rgba(255, 26, 26, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <motion.div
            animate={{ opacity: [0, 0.1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,26,26,0.1), transparent)'
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 1
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>🚨</span>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--red)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                VICTIM INFO
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '1px'
                }}
              >
                PATIENT SUMMARY
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 26, 26, 0.08)',
              border: '1px solid rgba(255, 26, 26, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ color: 'var(--red)', fontWeight: 700 }}>CRITICAL CASE</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>NAME:</span>
              <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{state.name || '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>ESTIMATED AGE:</span>
              <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{state.estimatedAge ?? '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>AID KIT:</span>
              <span style={{ color: 'var(--amber)', fontWeight: 700 }}>🩹 Trauma</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,230,118,0.2)' }}
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid rgba(0, 230, 118, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <motion.div
            animate={{ opacity: [0, 0.1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(0,230,118,0.1), transparent)'
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 1
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>📋</span>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--green)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                TIMELINE
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '1px'
                }}
              >
                OPERATIONAL LOG
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {[
              { label: 'SOS Received', status: '✓' },
              { label: 'Drone Dispatched', status: '✓' },
              { label: 'AI Assessment', status: '✓' },
              { label: 'Hospital Notified', status: '✓' }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.8rem'
                }}
              >
                <span
                  style={{
                    color: 'var(--green)',
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}
                >
                  {step.status}
                </span>
                <span style={{ color: 'var(--text-dim)' }}>{step.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: 'auto'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen('hospital')}
          style={{
            flex: 1,
            padding: '12px',
            background: 'rgba(255, 26, 26, 0.1)',
            border: '1px solid var(--red)',
            borderRadius: '8px',
            color: 'var(--red)',
            fontFamily: 'var(--font-head)',
            fontWeight: 700,
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          → HOSPITAL ALERT
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ControlDashboard;
