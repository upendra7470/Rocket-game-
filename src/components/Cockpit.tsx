import { useGameStore } from '../store/gameStore';

interface MFDDisplayProps {
  title: string;
  data: { [key: string]: string | number };
  color?: string;
}

function MFDDisplay({ title, data, color = '#00ff00' }: MFDDisplayProps) {
  return (
    <div className="mfd-display" style={{ borderColor: color }}>
      <div className="mfd-title">{title}</div>
      <div className="mfd-content">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="mfd-row">
            <span className="mfd-label">{key}:</span>
            <span className="mfd-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface InstrumentProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

function Gauge({ label, value, min, max, unit }: InstrumentProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 270 - 135;

  return (
    <div className="gauge">
      <svg viewBox="0 0 200 120" className="gauge-svg">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#333"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d={`M 20 100 A 80 80 0 0 1 ${100 + 80 * Math.cos((angle * Math.PI) / 180)} ${100 - 80 * Math.sin((angle * Math.PI) / 180)}`}
          fill="none"
          stroke={percentage > 80 ? '#ff4444' : percentage > 50 ? '#ffaa00' : '#00ff00'}
          strokeWidth="20"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="100"
          x2={100 + 60 * Math.cos((angle * Math.PI) / 180)}
          y2={100 - 60 * Math.sin((angle * Math.PI) / 180)}
          stroke="#fff"
          strokeWidth="3"
        />
        <circle cx="100" cy="100" r="8" fill="#fff" />
      </svg>
      <div className="gauge-label">{label}</div>
      <div className="gauge-value">
        {value.toFixed(1)} {unit}
      </div>
    </div>
  );
}

export function Cockpit() {
  const { rocket, missionPhase, gameTime } = useGameStore();

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="cockpit">
      <div className="cockpit-header">
        <div className="mission-phase-display">
          <span className="phase-label">PHASE:</span>
          <span className="phase-value">{missionPhase.replace(/_/g, ' ')}</span>
        </div>
        <div className="mission-time-display">
          <span className="time-label">T+:</span>
          <span className="time-value">{formatTime(gameTime)}</span>
        </div>
      </div>

      <div className="cockpit-instruments">
        <Gauge label="ALTITUDE" value={rocket.altitude} min={0} max={200000} unit="m" />
        <Gauge label="VELOCITY" value={rocket.speed} min={0} max={10000} unit="m/s" />
        <Gauge label="VERTICAL" value={rocket.velocity.y} min={-500} max={500} unit="m/s" />
        <Gauge label="FUEL" value={rocket.fuel} min={0} max={rocket.maxFuel} unit="kg" />
      </div>

      <div className="cockpit-mfds">
        <MFDDisplay
          title="TELEMETRY"
          color="#00ff00"
          data={{
            'Pitch': `${rocket.pitch.toFixed(1)}°`,
            'Yaw': `${rocket.yaw.toFixed(1)}°`,
            'Roll': `${rocket.roll.toFixed(1)}°`,
            'G-Force': ((rocket.thrust / rocket.mass / 9.81)).toFixed(2),
            'Temperature': `${rocket.temperature.toFixed(0)} K`,
            'Hull': `${rocket.hullIntegrity.toFixed(0)}%`,
          }}
        />

        <MFDDisplay
          title="ENGINE STATUS"
          color={rocket.isEngineOn ? '#00ff00' : '#ff4444'}
          data={{
            'Status': rocket.isEngineOn ? 'ACTIVE' : 'OFF',
            'Throttle': `${(rocket.throttle * 100).toFixed(0)}%`,
            'Thrust': `${rocket.thrust.toFixed(0)} kN`,
            'Fuel Flow': `${(rocket.throttle * 50).toFixed(1)} kg/s`,
            'ISP': '450 s',
          }}
        />

        <MFDDisplay
          title="ATMOSPHERE"
          color="#00aaff"
          data={{
            'Density': `${(1.225 * Math.exp(-rocket.altitude / 8500)).toFixed(4)} kg/m³`,
            'Pressure': `${(101325 * Math.exp(-rocket.altitude / 8500)).toFixed(0)} Pa`,
            'Temp': `${(288 - 0.0065 * Math.min(rocket.altitude, 11000)).toFixed(0)} K`,
            'Wind': '0 m/s',
          }}
        />
      </div>

      <div className="cockpit-warnings">
        {rocket.hullIntegrity < 30 && (
          <div className="warning critical">CRITICAL: HULL INTEGRITY LOW</div>
        )}
        {rocket.fuel / rocket.maxFuel < 0.1 && (
          <div className="warning critical">CRITICAL: FUEL LOW</div>
        )}
        {rocket.temperature > 1000 && (
          <div className="warning critical">WARNING: HIGH TEMPERATURE</div>
        )}
        {rocket.altitude > 100000 && !rocket.isLanded && rocket.speed > 100 && (
          <div className="warning">ATMOSPHERIC RE-ENTRY DETECTED</div>
        )}
      </div>

      <div className="attitude-indicator">
        <div className="attitude-horizon">
          <div
            className="horizon-line"
            style={{
              transform: `rotate(${-rocket.roll}deg) translateY(${rocket.pitch}px)`,
            }}
          />
        </div>
        <div className="attitude-crosshair" />
      </div>
    </div>
  );
}
