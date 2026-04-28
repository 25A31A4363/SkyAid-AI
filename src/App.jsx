import { useEffect, useState, useCallback, useMemo } from "react";
import Navbar from "./Navbar.jsx";
import Home from "./Home.jsx";
import SOS from "./SOS.jsx";
import DroneMap from "./DroneMapV2.jsx";
import AITriage from "./AITriage.jsx";
import ControlDashboard from "./ControlDashboardV2.jsx";
import HospitalAlert from "./HospitalAlertV2.jsx";

const themeOptions = [
  { id: "dark", label: "DARK" },
  { id: "light", label: "LIGHT" },
  { id: "bright", label: "BRIGHT" }
];

const normalizeVictimId = (name) => {
  const normalized = String(name || "VICTIM 01").trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  return normalized || `VICTIM_${Date.now()}`;
};

const getRandomAgeEstimate = () => 18 + Math.floor(Math.random() * 28);

export default function App() {
  const [screen, setScreen] = useState("home");
  const [theme, setTheme] = useState(localStorage.getItem("skyaid-theme") || "dark");
  const [victimName, setVictimName] = useState("VICTIM 01");
  const [sosDispatched, setSosDispatched] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [autoFlow, setAutoFlow] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [triageStatus, setTriageStatus] = useState("PENDING");
  const [droneBattery, setDroneBattery] = useState(85);
  const [statusInfo, setStatusInfo] = useState({
    eta: "00:05",
    etaSeconds: 5,
    battery: "85%",
    signal: "STRONG",
    hospital: "STANDBY",
    location: "12.9611 N, 77.6387 E",
    status: "WAITING",
    missionStage: "READY"
  });
  const [missionQueue, setMissionQueue] = useState([]);
  const [activeMissionId, setActiveMissionId] = useState(null);
  const [triageSessions, setTriageSessions] = useState({});
  const [triageRecords, setTriageRecords] = useState(() => {
    const stored = window.localStorage.getItem("skyaid-triage-records");
    try {
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [notificationLog, setNotificationLog] = useState([]);

  const activeMission = useMemo(
    () => missionQueue.find((job) => job.id === activeMissionId) || null,
    [missionQueue, activeMissionId]
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("skyaid-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (sosDispatched && countdown > 0 && screen === "sos") {
      const timer = window.setTimeout(() => setCountdown((value) => Math.max(0, value - 1)), 1000);
      return () => window.clearTimeout(timer);
    }
  }, [countdown, sosDispatched, screen]);

  useEffect(() => {
    window.localStorage.setItem("skyaid-triage-records", JSON.stringify(triageRecords));
  }, [triageRecords]);

  const updateStatusInfo = useCallback((updates) => {
    setStatusInfo((prev) => ({ ...prev, ...updates }));
  }, []);

  const goToScreen = useCallback((next, manual = false) => {
    if (manual) {
      setManualMode(true);
    }

    if (next === "hospital") {
      setAutoFlow(false);
      setManualMode(true);
    }

    setScreen(next);
  }, []);

  const handleTrackDrone = useCallback(
    (manual = true) => {
      if (manual) {
        setManualMode(true);
      }
      goToScreen("map", manual);
    },
    [goToScreen]
  );

  const queueNextMission = useCallback(() => {
    if (manualMode || activeMissionId) return;
    const nextMission = missionQueue.find((job) => job.status === "queued");
    if (!nextMission) return;

    setMissionQueue((prev) =>
      prev.map((job) =>
        job.id === nextMission.id ? { ...job, status: "active" } : job
      )
    );
    setActiveMissionId(nextMission.id);
    setStatusInfo((prev) => ({
      ...prev,
      eta: "00:05",
      etaSeconds: 5,
      battery: `${droneBattery.toFixed(0)}%`,
      signal: "STRONG",
      hospital: "NOTIFIED",
      location: nextMission.location,
      victimName: nextMission.name,
      status: "OUTBOUND",
      missionStage: "OUTBOUND"
    }));
    setScreen("map");
  }, [activeMissionId, droneBattery, manualMode, missionQueue]);

  useEffect(() => {
    if (!sosDispatched || manualMode || activeMissionId || missionQueue.length === 0) return;
    const timer = window.setTimeout(() => {
      queueNextMission();
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [sosDispatched, manualMode, activeMissionId, missionQueue, queueNextMission]);

  useEffect(() => {
    if (manualMode || activeMissionId) return;
    if (!missionQueue.some((job) => job.status === "queued")) return;
    const timer = window.setTimeout(() => {
      queueNextMission();
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [manualMode, activeMissionId, missionQueue, queueNextMission]);

  const dispatchSOS = () => {
    const name = victimName?.trim() || "VICTIM 01";
    const estimatedAge = getRandomAgeEstimate();
    const id = normalizeVictimId(name);
    const newMission = {
      id,
      name,
      estimatedAge: `${estimatedAge} ± 6`,
      location: "12.9611 N, 77.6387 E",
      status: "queued",
      requestedAt: Date.now()
    };

    setMissionQueue((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === id);
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        if (existing.name === name && existing.estimatedAge === newMission.estimatedAge) {
          return prev;
        }
        return prev.map((item) =>
          item.id === id ? { ...item, ...newMission, requestedAt: Date.now() } : item
        );
      }
      return [...prev, newMission];
    });

    setAutoFlow(true);
    setManualMode(false);
    setSosDispatched(true);
    setCountdown(5);
    setStatusInfo((prev) => ({
      ...prev,
      eta: "00:05",
      etaSeconds: 5,
      battery: `${droneBattery.toFixed(0)}%`,
      signal: "STRONG",
      hospital: "NOTIFIED",
      location: "12.9611 N, 77.6387 E",
      status: "QUEUED",
      missionStage: "QUEUED"
    }));
    goToScreen("sos", false);
  };

  const saveTriageRecord = (mission, priority) => {
    setTriageStatus(priority);
    setTriageRecords((prev) => {
      const existing = prev[mission.id];
      if (
        existing &&
        existing.priority === priority &&
        existing.estimatedAge === mission.estimatedAge &&
        existing.location === mission.location
      ) {
        return prev;
      }
      return {
        ...prev,
        [mission.id]: {
          ...mission,
          priority,
          updatedAt: Date.now()
        }
      };
    });
    setTriageSessions((prev) => ({
      ...prev,
      [mission.id]: {
        ...prev[mission.id],
        priority,
        complete: true
      }
    }));

    setNotificationLog((prev) => [
      {
        id: mission.id,
        name: mission.name,
        age: mission.estimatedAge ?? 'UNKNOWN',
        condition: priority,
        location: mission.location,
        time: new Date().toLocaleTimeString()
      },
      ...prev
    ].slice(0, 6));

    setStatusInfo((prev) => ({
      ...prev,
      eta: "00:00",
      etaSeconds: 0,
      battery: `${droneBattery.toFixed(0)}%`,
      signal: "STRONG",
      hospital: "NOTIFIED",
      location: mission.location,
      victimId: mission.id,
      victimName: mission.name,
      priority,
      status: "HOSPITAL ALERT",
      missionStage: "ALERT SENT"
    }));
  };

  const completeMission = useCallback(
    (missionId) => {
      setMissionQueue((prev) =>
        prev.map((job) =>
          job.id === missionId ? { ...job, status: "completed" } : job
        )
      );
      if (activeMissionId === missionId) {
        setActiveMissionId(null);
      }
    },
    [activeMissionId]
  );

  const missionPayload = activeMission || missionQueue[0] || { id: "UNKNOWN", name: "VICTIM 01", estimatedAge: '30 ± 6', location: "12.9611 N, 77.6387 E" };
  const savedTriage = missionPayload ? triageRecords[missionPayload.id] : null;
  const activeTriageSession = missionPayload ? triageSessions[missionPayload.id] : null;
  const dashboardMission = savedTriage || missionPayload;

  return (
    <>
      <Navbar
        currentScreen={screen}
        setCurrentScreen={goToScreen}
        theme={theme}
        setTheme={setTheme}
        themeOptions={themeOptions}
      />

      <main className="app-shell">
        {screen === "home" && <Home />}

        {screen === "sos" && (
          <SOS
            victimName={victimName}
            setVictimName={setVictimName}
            sosDispatched={sosDispatched}
            countdown={countdown}
            dispatchSOS={dispatchSOS}
            handleTrackDrone={handleTrackDrone}
            queuedCount={missionQueue.length}
          />
        )}

        {screen === "map" && (
          <DroneMap
            setCurrentScreen={goToScreen}
            mission={missionPayload}
            autoAllowed={autoFlow && !manualMode}
            battery={droneBattery}
            setBattery={setDroneBattery}
            updateStatusInfo={updateStatusInfo}
          />
        )}

        {screen === "triage" && (
          <AITriage
            setCurrentScreen={goToScreen}
            state={missionPayload}
            autoAllowed={autoFlow && !manualMode}
            triageStatus={triageStatus}
            setTriageStatus={setTriageStatus}
            existingRecord={activeTriageSession || savedTriage}
            onSessionCreate={(session) => {
              if (!missionPayload?.id) return;
              setTriageSessions((prev) => ({
                ...prev,
                [missionPayload.id]: {
                  ...prev[missionPayload.id],
                  ...session,
                  mission: missionPayload
                }
              }));
            }}
            onTriageComplete={(priority) => {
              if (missionPayload?.id) {
                saveTriageRecord(missionPayload, priority);
                completeMission(missionPayload.id);
              }
            }}
          />
        )}

        {screen === "dashboard" && (
          <ControlDashboard
            setCurrentScreen={goToScreen}
            state={dashboardMission}
            autoAllowed={autoFlow && !manualMode}
            triageStatus={triageStatus}
            battery={droneBattery}
            statusInfo={statusInfo}
            missionQueue={missionQueue}
            activeMission={activeMission}
            notificationLog={notificationLog}
          />
        )}

        {screen === "hospital" && (
          <HospitalAlert
            setCurrentScreen={goToScreen}
            state={dashboardMission}
            statusInfo={statusInfo}
            triageStatus={triageStatus}
            battery={droneBattery}
            notificationLog={notificationLog}
            autoAllowed={autoFlow && !manualMode}
          />
        )}
      </main>
    </>
  );
}
