import './SkyAidHome.css';

const metrics = [
  {
    id: 1,
    value: '30s',
    label: 'Response Time'
  },
  {
    id: 2,
    value: '92%',
    label: 'Success Rate'
  },
  {
    id: 3,
    value: '3x',
    label: 'Faster Than EMS'
  },
  {
    id: 4,
    value: '24/7',
    label: 'Active Coverage'
  }
];

const Home = () => {
  return (
    <div className="skyaid-home">
      <nav className="navbar">
        <div className="logo">SKYAID</div>
        <ul className="nav-links">
          <li><a href="#home">HOME</a></li>
          <li><a href="#sos">SOS</a></li>
          <li><a href="#drone-map">DRONE MAP</a></li>
          <li><a href="#ai-triage">AI TRIAGE</a></li>
          <li><a href="#dashboard">DASHBOARD</a></li>
          <li><a href="#hospital">HOSPITAL</a></li>
        </ul>
        <div className="status-indicator">
          <span className="status-dot"></span>
          SYSTEM ACTIVE
        </div>
      </nav>

      <div className="title-section">
        <h1 className="main-title">
          <span className="title-sky">SKY</span>
          <span className="title-aid">AID</span>
        </h1>
        <p className="subtitle">Artificial Intelligence · Emergency Rescue</p>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div key={metric.id} className="metric-card">
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="drone-fact-section">
        <div className="drone-fact">
          <div className="drone-fact-title">Drone Fact</div>
          <div className="drone-fact-text">
            The SkyAid rescue drone can autonomously navigate to a victim, stream live thermal and environmental data, and carry a compact first-aid kit to support the first response team.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
