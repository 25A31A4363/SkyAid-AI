import { motion } from 'framer-motion';

const SOS = ({
  victimName,
  setVictimName,
  sosDispatched,
  countdown,
  dispatchSOS,
  handleTrackDrone,
  queuedCount = 0
}) => {
  const displayName = victimName || 'VICTIM 01';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        paddingTop: '104px',
        background: 'linear-gradient(180deg, #05080f 0%, #080e1a 100%)',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'rgba(8, 12, 22, 0.95)',
          border: '1px solid rgba(255, 23, 68, 0.24)',
          borderRadius: '32px',
          padding: '36px',
          boxShadow: '0 32px 120px rgba(255, 23, 68, 0.16)',
          backdropFilter: 'blur(18px)',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', inset: '0', background: 'radial-gradient(circle at 50% 20%, rgba(255, 26, 26, 0.12), transparent 26%)', pointerEvents: 'none', borderRadius: '32px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              fontFamily: 'var(--font-head)',
              fontSize: '2rem',
              fontWeight: 900,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: 'var(--red)',
              textShadow: '0 0 30px rgba(255, 23, 68, 0.45)'
            }}>
              EMERGENCY SOS
            </div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)',
              fontSize: '0.88rem',
              marginTop: '10px'
            }}>
              Emergency protocol activated — input victim details or dispatch immediately.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '18px', marginBottom: '28px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Victim Name
              <input
                value={victimName}
                onChange={(event) => setVictimName(event.target.value)}
                placeholder="Enter name or auto-assign"
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: '18px',
                  border: '1px solid rgba(0,229,255,0.18)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  boxShadow: '0 0 24px rgba(0,229,255,0.08)'
                }}
              />
            </label>
          </div>

          {!sosDispatched ? (
            <button
              onClick={dispatchSOS}
              style={{
                width: '100%',
                height: '120px',
                borderRadius: '999px',
                border: 'none',
                background: 'radial-gradient(circle, #ff4f6a 0%, #d4002f 48%, #84000f 100%)',
                color: '#fff',
                fontFamily: 'var(--font-head)',
                fontSize: '1.8rem',
                letterSpacing: '3px',
                cursor: 'pointer',
                boxShadow: '0 0 50px rgba(255, 23, 68, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              🔴 SOS LAUNCH
            </button>
          ) : (
            <div style={{ display: 'grid', gap: '22px', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', color: 'var(--red)', textShadow: '0 0 30px rgba(255, 23, 68, 0.4)' }}>🚁</div>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.85rem', color: 'var(--red)', marginBottom: '10px' }}>DRONE DISPATCH IN PROGRESS</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontSize: '0.92rem' }}>Patient: {displayName}</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontSize: '0.92rem', marginTop: '4px' }}>{queuedCount > 1 ? `${queuedCount - 1} mission(s) queued` : 'Priority dispatch active'}</div>
              </div>
              <div style={{
                display: 'grid',
                gap: '6px',
                padding: '22px',
                borderRadius: '24px',
                background: 'rgba(255,23,68,0.08)',
                border: '1px solid rgba(255,23,68,0.28)'
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Drone Dispatch in:</div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.6rem', color: 'var(--red)', letterSpacing: '2px' }}>{String(Math.max(0, countdown)).padStart(2, '0')}s</div>
              </div>
              <button
                onClick={() => handleTrackDrone(true)}
                style={{
                  width: '100%',
                  borderRadius: '22px',
                  border: '1px solid rgba(0,212,255,0.4)',
                  background: 'rgba(0,212,255,0.12)',
                  color: 'var(--cyan)',
                  fontFamily: 'var(--font-head)',
                  fontSize: '0.95rem',
                  padding: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 0 28px rgba(0,212,255,0.18)'
                }}
              >
                🗺 TRACK DRONE
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SOS;
