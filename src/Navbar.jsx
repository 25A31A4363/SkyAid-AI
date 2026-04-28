import { motion } from "framer-motion";

const Navbar = ({ currentScreen, setCurrentScreen }) => {
  const screens = [
    { id: "home", label: "HOME" },
    { id: "sos", label: "SOS" },
    { id: "map", label: "DRONE MAP" },
    { id: "triage", label: "AI TRIAGE" },
    { id: "dashboard", label: "DASHBOARD" },
    { id: "hospital", label: "HOSPITAL" }
  ];

  const isMapScreen = currentScreen === "map";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: "rgba(5, 11, 20, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0, 229, 255, 0.18)",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "0 1rem",
        minHeight: "56px",
        gap: "10px",
        fontFamily: "var(--font-head)"
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          position: "relative",
          fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)",
          fontWeight: 700,
          color: "var(--cyan)",
          letterSpacing: "2px",
          marginRight: "1rem",
          textShadow: "var(--glow-cyan)",
          fontFamily: "var(--font-head)",
          padding: "0.5rem 0.75rem",
          borderRadius: "16px",
          backgroundImage: isMapScreen
            ? "radial-gradient(circle at left center, rgba(0,229,255,0.18), transparent 55%)"
            : "none"
        }}
      >
        <span style={{ color: "var(--cyan)" }}>SKY</span>
        <span style={{ color: "var(--red)" }}>AID</span>
      </motion.div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {screens.map((screen) => (
          <motion.button
            key={screen.id}
            onClick={() => setCurrentScreen(screen.id, true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "0.55rem 0.85rem",
              background:
                currentScreen === screen.id
                  ? "rgba(0, 229, 255, 0.08)"
                  : "transparent",
              border: `1px solid ${
                currentScreen === screen.id
                  ? "var(--cyan)"
                  : "rgba(0, 229, 255, 0.18)"
              }`,
              color:
                currentScreen === screen.id
                  ? "var(--cyan)"
                  : "var(--text-dim)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "1px",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow:
                currentScreen === screen.id
                  ? "0 0 18px rgba(0,229,255,0.3)"
                  : "none",
              fontWeight: currentScreen === screen.id ? 700 : 400
            }}
          >
            {screen.label}
          </motion.button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <motion.div
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--green)",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            background: "var(--green)",
            borderRadius: "50%",
            boxShadow: "0 0 8px var(--green)"
          }}
        />
        SYSTEM ACTIVE
      </motion.div>
    </nav>
  );
};

export default Navbar;