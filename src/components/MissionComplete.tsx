import { useGameStore } from '../store/gameStore';
import { audioManager } from '../audio/audioManager';

interface MissionCompleteProps {
  onContinue: () => void;
}

export function MissionComplete({ onContinue }: MissionCompleteProps) {
  const {
    currentMission,
    rocket,
    telemetry,
    completeMission,
  } = useGameStore();

  const handleContinue = () => {
    audioManager.playClick();
    completeMission();
    onContinue();
  };

  const calculateScore = () => {
    if (!currentMission) return 0;
    let score = 1000;
    score += currentMission.objectives.filter((o) => o.completed).length * 500;
    if ((rocket.fuel / rocket.maxFuel) * 100 > 30) score += 500;
    if (rocket.hullIntegrity > 80) score += 300;
    if (telemetry.length > 0) {
      const maxG = Math.max(...telemetry.map((t) => t.gForce));
      if (maxG < 5) score += 200;
    }
    return score;
  };

  return (
    <div className="mission-complete">
      <div className="mission-complete-content">
        <h1 className="mission-complete-title">MISSION COMPLETE</h1>

        {currentMission && (
          <>
            <h2 className="mission-name">{currentMission.name}</h2>

            <div className="mission-summary">
              <div className="summary-section">
                <h3>OBJECTIVES COMPLETED</h3>
                <div className="objectives-list">
                  {currentMission.objectives.map((obj) => (
                    <div
                      key={obj.id}
                      className={`objective-item ${obj.completed ? 'completed' : 'failed'}`}
                    >
                      <span className="objective-status">{obj.completed ? '✓' : '✗'}</span>
                      <span className="objective-text">{obj.description}</span>
                      {obj.optional && <span className="objective-badge">OPTIONAL</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-section">
                <h3>STATISTICS</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Final Altitude</span>
                    <span className="stat-value">{rocket.altitude.toFixed(0)} m</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Max Speed</span>
                    <span className="stat-value">{rocket.speed.toFixed(0)} m/s</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Fuel Remaining</span>
                    <span className="stat-value">{((rocket.fuel / rocket.maxFuel) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Hull Integrity</span>
                    <span className="stat-value">{rocket.hullIntegrity.toFixed(0)}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Max Temperature</span>
                    <span className="stat-value">{rocket.temperature.toFixed(0)} K</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Mission Time</span>
                    <span className="stat-value">
                      {Math.floor(useGameStore.getState().gameTime / 60)}:
                      {(useGameStore.getState().gameTime % 60).toFixed(0).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="summary-section rewards-section">
                <h3>REWARDS</h3>
                <div className="rewards-list">
                  <div className="reward-item">
                    <span className="reward-icon">⭐</span>
                    <span className="reward-label">Experience</span>
                    <span className="reward-value">+{currentMission.rewards.experience}</span>
                  </div>
                  <div className="reward-item">
                    <span className="reward-icon">💰</span>
                    <span className="reward-label">Credits</span>
                    <span className="reward-value">+{currentMission.rewards.credits.toLocaleString()}</span>
                  </div>
                  <div className="reward-item">
                    <span className="reward-icon">🏆</span>
                    <span className="reward-label">Mission Score</span>
                    <span className="reward-value">{calculateScore()}</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="continue-button" onClick={handleContinue}>
              CONTINUE
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function MissionFailed({ onRetry, onQuit }: { onRetry: () => void; onQuit: () => void }) {
  const { currentMission, rocket, resetMission } = useGameStore();

  const handleRetry = () => {
    audioManager.playClick();
    resetMission();
    onRetry();
  };

  const handleQuit = () => {
    audioManager.playClick();
    onQuit();
  };

  const getFailureReason = () => {
    if (rocket.hullIntegrity <= 0) return 'Critical hull failure';
    if (rocket.fuel <= 0 && rocket.altitude > 1000) return 'Fuel depletion';
    if (rocket.altitude > 100000 && rocket.speed < 100) return 'Orbital velocity not achieved';
    return 'Mission objectives not met';
  };

  return (
    <div className="mission-failed">
      <div className="mission-failed-content">
        <h1 className="mission-failed-title">MISSION FAILED</h1>

        {currentMission && (
          <>
            <h2 className="mission-name">{currentMission.name}</h2>
            <p className="failure-reason">{getFailureReason()}</p>

            <div className="failure-stats">
              <div className="stat-item">
                <span className="stat-label">Altitude Reached</span>
                <span className="stat-value">{rocket.altitude.toFixed(0)} m</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Max Speed</span>
                <span className="stat-value">{rocket.speed.toFixed(0)} m/s</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Hull Integrity</span>
                <span className="stat-value">{rocket.hullIntegrity.toFixed(0)}%</span>
              </div>
            </div>

            <div className="failure-buttons">
              <button className="menu-button primary" onClick={handleRetry}>
                RETRY MISSION
              </button>
              <button className="menu-button secondary" onClick={handleQuit}>
                RETURN TO MENU
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
