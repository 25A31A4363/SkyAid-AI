import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const routeWaypoints = [
  { x: 8, y: 52, label: 'HOSPITAL' },
  { x: 32, y: 38, label: 'WAYPOINT 1' },
  { x: 56, y: 62, label: 'WAYPOINT 2' },
  { x: 88, y: 50, label: 'VICTIM' }
];

const lerp = (start, end, t) => start + (end - start) * t;

const getRoutePosition = (progress) => {
  const segments = routeWaypoints.length - 1;
  const fullProgress = Math.min(1, Math.max(0, progress));
  const index = Math.min(segments - 1, Math.floor(fullProgress * segments));
  const segmentProgress = fullProgress * segments - index;
  const from = routeWaypoints[index];
  const to = routeWaypoints[index + 1];

  return {
    x: lerp(from.x, to.x, segmentProgress),
    y: lerp(from.y, to.y, segmentProgress),
    nextLabel: to.label,
    segmentLabel: from.label
  };
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const DroneMap = ({ setCurrentScreen, state = {}, autoAllowed = false, battery = 85, setBattery, updateStatusInfo }) => {
  const [phase, setPhase] = useState('outbound');
  const [phaseTime, setPhaseTime] = useState(0);
  const [signal, setSignal] = useState(94);
  const [scanComplete, setScanComplete] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const progress = useMemo(() => {
    if (phase === 'outbound') return Math.min(1, phaseTime / 5);
    if (phase === 'scan' || phase === 'onScene') return 1;
    return 0;
  }, [phase, phaseTime]);

  const { x, y, nextLabel, segmentLabel } = useMemo(() => getRoutePosition(progress), [progress]);
  const victimName = state.name || 'VICTIM 01';
  const victimAge = state.age || state.estimatedAge || '30 ± 6';

  const etaValue = phase === 'outbound'
    ? Math.max(0, 5 - phaseTime)
    : phase === 'scan'
      ? Math.max(0, 5 - phaseTime)
      : 0;

  const statusLabel = phase === 'outbound'
    ? 'EN ROUTE TO VICTIM'
    : phase === 'scan'
      ? 'SCANNING VICTIM'
      : phase === 'onScene'
        ? 'AWAITING MEDICAL ARRIVAL'
        : phase === 'return'
          ? 'RETURNING TO HOSPITAL'
          : 'DRONE ON SITE / ALERT SENT';

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhaseTime((current) => {
        if (phase === 'outbound') {
          if (current >= 5) {
            setPhase('scan');
            return 0;
          }
          return Number((current + 0.1).toFixed(2));
        }

        if (phase === 'scan') {
          if (current >= 5) {
            setPhase('onScene');
            setScanComplete(true);
            setMessageSent(true);
            return 0;
          }
          return Number((current + 0.1).toFixed(2));
        }

        if (phase === 'onScene') {
          return Number((current + 0.1).toFixed(2));
        }

        return current;
      });
    }, 100);

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (!setBattery || battery <= 12) return;
    const timer = window.setTimeout(() => setBattery((value) => Math.max(12, Number((value - 0.16).toFixed(2)))), 1200);
    return () => window.clearTimeout(timer);
  }, [battery, setBattery]);

  useEffect(() => {
    if (signal <= 62) return;
    const timer = window.setTimeout(() => {
      setSignal((value) => {
        const next = value + (Math.random() - 0.5) * 5;
        return Math.max(62, Math.min(98, next));
      });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [signal]);

  useEffect(() => {
    if (!updateStatusInfo) return;
    updateStatusInfo({
      eta: formatTime(etaValue),
      etaSeconds: etaValue,
      battery: `${battery.toFixed(0)}%`,
      status: statusLabel,
      missionStage: phase.toUpperCase(),
      hospital: phase === 'onScene' ? 'AWAITING AMBULANCE' : phase === 'return' ? 'RETURNING' : phase === 'scan' ? 'SCANNING' : 'NOTIFIED'
    });
  }, [phase, etaValue, statusLabel, battery, updateStatusInfo]);

  useEffect(() => {
    if (phase !== 'onScene' || !autoAllowed) return;
    const timer = window.setTimeout(() => setCurrentScreen('triage', false), 2500);
    return () => window.clearTimeout(timer);
  }, [phase, autoAllowed, setCurrentScreen]);

  useEffect(() => {
    if (scanComplete) {
      const context = typeof window !== 'undefined' && window.AudioContext ? new window.AudioContext() : null;
      if (context) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, context.currentTime);
        gain.gain.setValueAtTime(0.12, context.currentTime);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.12);
      }
    }
  }, [scanComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '88px' }}
    >
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: '1.4rem', color: 'var(--white)', marginBottom: '6px' }}>SATELLITE COMMAND VIEW</div>
          <div style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.95rem' }}>Dark-mode route overlay with live ETA, hospital alerting, and autonomous drone telemetry.</div>
        </div>
        <button
          onClick={() => setCurrentScreen('home', true)}
          style={{
            borderRadius: '999px',
            border: '1px solid rgba(0,229,255,0.18)',
            background: 'rgba(0,0,0,0.24)',
            color: 'var(--white)',
            padding: '12px 18px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)'
          }}
        >
          EXIT TRACKING
        </button>
      </div>

      <div style={{ margin: '0 auto 24px', width: '60vw', maxWidth: '1100px', height: '50vh', minHeight: '340px', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.35)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(0,229,255,0.16), transparent 18%), radial-gradient(circle at bottom right, rgba(255,26,26,0.12), transparent 20%), linear-gradient(135deg, #071222 0%, #081f33 38%, #061720 100%)' }} />

        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: '100%', height: '100%' }}>
          {routeWaypoints.slice(0, -1).map((point, index) => {
            const next = routeWaypoints[index + 1];
            return (
              <line
                key={index}
                x1={`${point.x}%`}
                y1={`${point.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                stroke="rgba(0,229,255,0.28)"
                strokeWidth="0.5"
                strokeDasharray="2 3"
              />
            );
          })}

          <path
            d={routeWaypoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')}
            fill="none"
            stroke="rgba(0,229,255,0.55)"
            strokeWidth="0.9"
          />

          {routeWaypoints.map((point, index) => (
            <g key={`marker-${index}`}>
              <circle
                cx={`${point.x}%`}
                cy={`${point.y}%`}
                r={index === 0 || index === routeWaypoints.length - 1 ? 3.8 : 2.8}
                fill={point.label === 'VICTIM' ? 'var(--red)' : index === 0 ? 'var(--green)' : 'rgba(0,229,255,0.85)'}
                stroke={point.label === 'VICTIM' ? 'rgba(255,26,26,0.9)' : 'transparent'}
                strokeWidth={point.label === 'VICTIM' ? 1.4 : 0}
              />
              <text
                x={`${point.x}%`}
                y={`${point.y - 3}%`}
                textAnchor="middle"
                fill={point.label === 'VICTIM' ? 'var(--red)' : 'rgba(232,244,255,0.85)'}
                fontSize="2.8"
                fontFamily="var(--font-mono)"
                fontWeight={point.label === 'VICTIM' ? 700 : 500}
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>

        <motion.div
          animate={{ left: `${x}%`, top: `${y}%` }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: '3rem',
            zIndex: 12,
            filter: 'drop-shadow(0 0 18px rgba(0,229,255,0.9))'
          }}
        >
          ??
        </motion.div>

        <div style={{ position: 'absolute', top: '18px', left: '18px', padding: '18px', borderRadius: '20px', background: 'rgba(0,0,0,0.42)', border: '1px solid rgba(0,229,255,0.2)', color: 'var(--white)', zIndex: 15, minWidth: '220px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '10px' }}>GRID COORDINATES</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-head)', fontSize: '0.9rem', color: 'var(--cyan)' }}>
            <span>LAT</span>
            <span>17.3850°N</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-head)', fontSize: '0.9rem', color: 'var(--cyan)' }}>
            <span>LON</span>
            <span>78.4867°E</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        {[
          { label: 'ETA', value: formatTime(etaValue), color: 'var(--cyan)' },
          { label: 'BATTERY', value: `${battery.toFixed(0)}%`, color: battery > 30 ? 'var(--green)' : 'var(--red)' },
          { label: 'SIGNAL', value: `${signal.toFixed(0)}%`, color: 'var(--amber)' },
          { label: 'HOSPITAL', value: phase === 'onScene' ? 'NOTIFIED' : 'PENDING', color: phase === 'onScene' ? 'var(--green)' : 'var(--muted)' }
        ].map((item) => (
          <div key={item.label} style={{ background: 'rgba(15,30,50,0.92)', border: '1px solid rgba(26,58,92,1)', borderRadius: '20px', padding: '22px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '10px' }}>{item.label}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.7rem', color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 24px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div style={{ background: 'rgba(15,30,50,0.92)', border: '1px solid rgba(26,58,92,1)', borderRadius: '20px', padding: '22px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>VICTIM DETAILS</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', color: 'var(--white)', marginTop: '10px' }}>{victimName}</div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.92rem', marginTop: '6px' }}>Age {victimAge}</div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--red)', fontSize: '0.85rem', marginTop: '14px' }}>VICTIM LOCATION MARKED RED</div>
        </div>
        <div style={{ background: 'rgba(15,30,50,0.92)', border: '1px solid rgba(26,58,92,1)', borderRadius: '20px', padding: '22px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>MISSION STATUS</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', color: 'var(--cyan)', marginTop: '8px' }}>{segmentLabel}</div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.9rem', marginTop: '8px' }}>{statusLabel}</div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.9rem', marginTop: '8px' }}>Next: {nextLabel}</div>
        </div>
      </div>
      <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div style={{ background: 'rgba(15,30,50,0.92)', border: '1px solid rgba(26,58,92,1)', borderRadius: '20px', padding: '22px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>MESSAGE STATUS</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', color: messageSent ? 'var(--green)' : 'var(--text)', marginTop: '8px' }}>
            {messageSent ? 'HOSPITAL ALERT SENT' : 'AWAITING SCAN'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', color: messageSent ? 'var(--muted)' : 'var(--text-dim)', fontSize: '0.9rem', marginTop: '8px' }}>
            {messageSent ? 'Drone transmitted patient status to hospital.' : 'Drone will send report after scan.'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DroneMap;
