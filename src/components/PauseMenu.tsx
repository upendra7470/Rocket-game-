import { useGameStore } from '../store/gameStore';
import { audioManager } from '../audio/audioManager';

interface PauseMenuProps {
  onResume: () => void;
  onQuit: () => void;
}

export function PauseMenu({ onResume, onQuit }: PauseMenuProps) {
  const { resetMission, currentMission } = useGameStore();

  const handleResume = () => {
    audioManager.playClick();
    onResume();
  };

  const handleRestart = () => {
    audioManager.playClick();
    if (currentMission) {
      resetMission();
    }
    onResume();
  };

  const handleQuit = () => {
    audioManager.playClick();
    onQuit();
  };

  return (
    <div className="pause-menu">
      <div className="pause-menu-content">
        <h1>PAUSED</h1>

        {currentMission && (
          <div className="current-mission-info">
            <h2>{currentMission.name}</h2>
            <div className="mission-progress">
              <span>Progress:</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(currentMission.objectives.filter((o) => o.completed).length / currentMission.objectives.length) * 100}%`,
                  }}
                />
              </div>
              <span>
                {currentMission.objectives.filter((o) => o.completed).length} / {currentMission.objectives.length}
              </span>
            </div>
          </div>
        )}

        <div className="pause-menu-buttons">
          <button className="menu-button primary" onClick={handleResume}>
            RESUME
          </button>
          <button className="menu-button secondary" onClick={handleRestart}>
            RESTART MISSION
          </button>
          <button className="menu-button tertiary" onClick={handleQuit}>
            QUIT TO MENU
          </button>
        </div>

        <div className="controls-info">
          <h3>CONTROLS</h3>
          <div className="control-list">
            <div className="control-item">
              <span className="control-key">SPACE</span>
              <span className="control-desc">Toggle Engine</span>
            </div>
            <div className="control-item">
              <span className="control-key">W/S</span>
              <span className="control-desc">Pitch Up/Down</span>
            </div>
            <div className="control-item">
              <span className="control-key">A/D</span>
              <span className="control-desc">Yaw Left/Right</span>
            </div>
            <div className="control-item">
              <span className="control-key">Q/E</span>
              <span className="control-desc">Roll Left/Right</span>
            </div>
            <div className="control-item">
              <span className="control-key">SHIFT</span>
              <span className="control-desc">Increase Throttle</span>
            </div>
            <div className="control-item">
              <span className="control-key">CTRL</span>
              <span className="control-desc">Decrease Throttle</span>
            </div>
            <div className="control-item">
              <span className="control-key">P</span>
              <span className="control-desc">Pause Game</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
