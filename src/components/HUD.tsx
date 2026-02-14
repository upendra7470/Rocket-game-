import { useGameStore } from '../store/gameStore';
import { MissionPhase } from '../types';

export function HUD() {
  const { rocket, missionPhase, currentMission } = useGameStore();

  const formatAltitude = (alt: number): string => {
    if (alt >= 1000) return `${(alt / 1000).toFixed(2)} km`;
    return `${alt.toFixed(0)} m`;
  };

  const formatVelocity = (vel: number): string => {
    if (vel >= 1000) return `${(vel / 1000).toFixed(2)} km/s`;
    return `${vel.toFixed(0)} m/s`;
  };

  const getThrottleColor = () => {
    const percent = rocket.throttle * 100;
    if (percent < 30) return '#00ff00';
    if (percent < 70) return '#ffff00';
    return '#ff4444';
  };

  const getPhaseColor = () => {
    switch (missionPhase) {
      case MissionPhase.PRE_FLIGHT:
        return '#00aaff';
      case MissionPhase.LAUNCH:
        return '#ffaa00';
      case MissionPhase.ASCENT:
        return '#ff6600';
      case MissionPhase.ORBIT_INSERTION:
        return '#00ff00';
      case MissionPhase.ORBIT:
        return '#00ffff';
      case MissionPhase.DOCKING:
        return '#ff00ff';
      case MissionPhase.RE_ENTRY:
        return '#ff4400';
      case MissionPhase.LANDING:
        return '#00ffaa';
      case MissionPhase.MISSION_COMPLETE:
        return '#00ff00';
      case MissionPhase.MISSION_FAILED:
        return '#ff0000';
      default:
        return '#ffffff';
    }
  };

  return (
    <div className="hud">
      <div className="hud-top-left">
        <div className="hud-item">
          <span className="hud-label">ALT</span>
          <span className="hud-value">{formatAltitude(rocket.altitude)}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">VEL</span>
          <span className="hud-value">{formatVelocity(rocket.speed)}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">VERT</span>
          <span className={`hud-value ${rocket.velocity.y < -50 ? 'warning' : ''}`}>
            {rocket.velocity.y.toFixed(0)} m/s
          </span>
        </div>
      </div>

      <div className="hud-top-center">
        <div className="mission-indicator" style={{ borderColor: getPhaseColor() }}>
          <span className="mission-phase">{missionPhase.replace(/_/g, ' ')}</span>
        </div>
        {currentMission && (
          <div className="mission-name">{currentMission.name}</div>
        )}
      </div>

      <div className="hud-top-right">
        <div className="hud-item">
          <span className="hud-label">FUEL</span>
          <span className={`hud-value ${(rocket.fuel / rocket.maxFuel) * 100 < 20 ? 'warning' : ''}`}>
            {((rocket.fuel / rocket.maxFuel) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="hud-item">
          <span className="hud-label">TEMP</span>
          <span className={`hud-value ${rocket.temperature > 800 ? 'warning' : ''}`}>
            {rocket.temperature.toFixed(0)} K
          </span>
        </div>
        <div className="hud-item">
          <span className="hud-label">HULL</span>
          <span className={`hud-value ${rocket.hullIntegrity < 50 ? 'warning' : ''}`}>
            {rocket.hullIntegrity.toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="hud-bottom-left">
        <div className="throttle-indicator">
          <div className="throttle-label">THROTTLE</div>
          <div className="throttle-bar">
            <div
              className="throttle-fill"
              style={{
                width: `${rocket.throttle * 100}%`,
                backgroundColor: getThrottleColor(),
              }}
            />
          </div>
          <div className="throttle-value">{(rocket.throttle * 100).toFixed(0)}%</div>
        </div>
      </div>

      <div className="hud-bottom-center">
        <div className="engine-status">
          <span className={`engine-indicator ${rocket.isEngineOn ? 'on' : 'off'}`} />
          <span className="engine-text">
            ENGINE: {rocket.isEngineOn ? 'ACTIVE' : 'OFF'}
          </span>
        </div>
      </div>

      <div className="hud-bottom-right">
        <div className="attitude-display">
          <div className="attitude-row">
            <span className="att-label">PITCH</span>
            <span className="att-value">{rocket.pitch.toFixed(1)}°</span>
          </div>
          <div className="attitude-row">
            <span className="att-label">YAW</span>
            <span className="att-value">{rocket.yaw.toFixed(1)}°</span>
          </div>
          <div className="attitude-row">
            <span className="att-label">ROLL</span>
            <span className="att-value">{rocket.roll.toFixed(1)}°</span>
          </div>
        </div>
      </div>

      <div className="hud-center">
        <div className="crosshair">
          <div className="crosshair-horizontal" />
          <div className="crosshair-vertical" />
          <div className="crosshair-circle" />
        </div>
      </div>
    </div>
  );
}
