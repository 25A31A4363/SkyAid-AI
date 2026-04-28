import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HospitalAlert = ({ setCurrentScreen, state = {}, statusInfo = {}, triageStatus = 'PENDING', battery, notificationLog = [], autoAllowed = false }) => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }));

  const eta = statusInfo.eta || '2m 18s';
  const activeBadgeColor = triageStatus === 'CRITICAL' ? 'rgba(255,23,68,0.15)' : triageStatus === 'MODERATE' ? 'rgba(255,209,102,0.16)' : 'rgba(0,230,118,0.12)';
  const activeBorderColor = triageStatus === 'CRITICAL' ? 'var(--red)' : triageStatus === 'MODERATE' ? 'var(--amber)' : 'var(--green)';
  const activeTextColor = triageStatus === 'CRITICAL' ? 'var(--red)' : triageStatus === 'MODERATE' ? 'var(--amber)' : 'var(--green)';

  const hospitalNotes = triageStatus === 'CRITICAL'
    ? [
        'Prepare ICU with crash cart and airway kit.',
        'Alert trauma team on standby immediately.',
        'Ensure oxygen ready and IV access prepped.',
        'Activate direct transport corridor.',
        'Reserve OR and trauma bay for immediate arrival.',
        'Confirm blood products and emergency medications.',
        'Assign respiratory support and airway specialists.',
        'Deploy mobile imaging and stroke team alert.',
        'Prepare rapid transfer protocol for arrival.',
        'Establish continuous cardiac monitoring immediately.'
      ]
    : triageStatus === 'MODERATE'
      ? [
          'Prepare observation bay and monitor vitals.',
          'Notify ER team of incoming patient.',
          'Ready supplemental oxygen and IV fluids.',
          'Confirm receiving physician availability.',
          'Prepare fast-track assessment room.',
          'Align lab team for urgent blood work.',
          'Hold a standby bed in the acute care unit.',
          'Alert imaging for immediate scan support.',
          'Designate a focused triage nurse.',
          'Keep patient warm and reassess every 5 minutes.'
        ]
      : [
          'Keep hospital informed of arrival window.',
          'Prepare standby intake support.',
          'Verify landing zone clearance.',
          'Maintain open comms with EMS.',
          'Confirm bed availability in receiving area.',
          'Have nurses ready for guided reception.',
          'Ensure patient paperwork is prepared.',
          'Keep triage staff on alert for status change.',
          'Coordinate with transport team for quick handoff.',
          'Monitor the patient remotely until arrival.'
        ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!autoAllowed) return;
    const timer = window.setTimeout(() => {
      setCurrentScreen('home', false);
    }, 15000);
    return () => window.clearTimeout(timer);
  }, [autoAllowed, setCurrentScreen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        minHeight: '100vh',
        paddingTop: '88px',
        background: 'var(--bg)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: '1.6rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--red)' }}>HOSPITAL ALERT</div>
          <div style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginTop: '8px' }}>
            {triageStatus === 'CRITICAL' ? 'CRITICAL EMERGENCY' : triageStatus === 'MODERATE' ? 'MODERATE ALERT' : 'STANDBY PATIENT'}
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: activeBadgeColor, border: `1px solid ${activeBorderColor}`, borderRadius: '20px', padding: '12px 18px', color: activeTextColor, fontFamily: 'var(--font-hd)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
          {triageStatus === 'CRITICAL' ? 'EMERGENCY' : triageStatus === 'MODERATE' ? 'ALERT' : 'ACTIVE'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        {[
          { label: 'NAME', value: state.name || 'VICTIM 01' },
          { label: 'ESTIMATED AGE', value: state.estimatedAge ?? '—' },
          { label: 'CONDITION', value: triageStatus === 'PENDING' ? 'ASSESSING' : triageStatus },
          { label: 'ETA', value: eta },
          { label: 'LOCATION', value: statusInfo.location || '17.3850 N, 78.4867 E' },
          { label: 'BATTERY', value: battery ? `${Number(battery).toFixed(0)}%` : '—' }
        ].map((item) => (
          <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,23,68,0.18)', borderRadius: '16px', padding: '18px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '1.8px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>{item.label}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', color: 'var(--white)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '18px' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,23,68,0.22)', borderRadius: '20px', padding: '24px' }}>
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '16px' }}>AI Recommendations</div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {hospitalNotes.map((note, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                <span style={{ color: activeTextColor, marginTop: '2px' }}>•</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,23,68,0.2)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-hd)', fontSize: '0.8rem', letterSpacing: '2px', color: activeTextColor, textTransform: 'uppercase', marginBottom: '14px' }}>SYSTEM STATUS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: activeTextColor, boxShadow: `0 0 18px ${activeTextColor}` }} />
              <span style={{ fontFamily: 'var(--font-head)', color: 'var(--white)', fontSize: '1rem' }}>ACTIVE</span>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>ALERT LEVEL</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 800, color: activeTextColor }}>{triageStatus === 'CRITICAL' ? 'CRITICAL' : triageStatus === 'MODERATE' ? 'MODERATE' : 'STABLE'}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setCurrentScreen('home')}
          style={{
            flex: '1 1 220px',
            borderRadius: '18px',
            border: '1px solid rgba(255,23,68,0.28)',
            background: 'rgba(255, 23, 68, 0.12)',
            color: 'var(--red)',
            padding: '16px 20px',
            fontFamily: 'var(--font-head)',
            fontWeight: 700,
            letterSpacing: '2px',
            cursor: 'pointer'
          }}
        >
          BACK TO HOME
        </button>
      </div>
    </motion.div>
  );
};

export default HospitalAlert;
