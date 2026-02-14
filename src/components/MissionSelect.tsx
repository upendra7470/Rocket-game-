import { useGameStore } from '../store/gameStore';
import { missions } from '../missions/missions';
import { audioManager } from '../audio/audioManager';

export function MissionSelect({ onSelect }: { onSelect: () => void }) {
  const { startMission, completedMissions, level, experience, credits } = useGameStore();

  const getAvailableMissions = () => {
    return missions.filter((mission) => {
      if (completedMissions.includes(mission.id)) return false;
      return mission.prerequisites.every((prereq) => completedMissions.includes(prereq));
    });
  };

  const handleStartMission = (missionId: string) => {
    audioManager.playClick();
    startMission(missionId);
    onSelect();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#00ff00';
      case 'medium':
        return '#ffff00';
      case 'hard':
        return '#ff6600';
      case 'extreme':
        return '#ff0000';
      default:
        return '#ffffff';
    }
  };

  return (
    <div className="mission-select">
      <div className="mission-select-header">
        <h1>MISSION SELECT</h1>
        <div className="player-stats">
          <div className="stat">
            <span className="stat-label">LEVEL</span>
            <span className="stat-value">{level}</span>
          </div>
          <div className="stat">
            <span className="stat-label">XP</span>
            <span className="stat-value">{experience}</span>
          </div>
          <div className="stat">
            <span className="stat-label">CREDITS</span>
            <span className="stat-value">{credits.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mission-list">
        {getAvailableMissions().map((mission) => (
          <div key={mission.id} className="mission-card">
            <div className="mission-card-header">
              <h2 className="mission-name">{mission.name}</h2>
              <span
                className="mission-difficulty"
                style={{ color: getDifficultyColor(mission.difficulty) }}
              >
                {mission.difficulty.toUpperCase()}
              </span>
            </div>
            <p className="mission-description">{mission.description}</p>
            <div className="mission-objectives">
              <h3>OBJECTIVES:</h3>
              <ul>
                {mission.objectives.map((obj) => (
                  <li key={obj.id} className={obj.optional ? 'optional' : ''}>
                    {obj.description}
                    {obj.optional && ' (Optional)'}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mission-rewards">
              <span className="reward">
                <span className="reward-icon">⭐</span>
                {mission.rewards.experience} XP
              </span>
              <span className="reward">
                <span className="reward-icon">💰</span>
                {mission.rewards.credits.toLocaleString()} Credits
              </span>
            </div>
            <div className="mission-info">
              <span className="info-item">
                <span className="info-icon">⏱️</span>
                Duration: {Math.floor(mission.duration / 60)} min
              </span>
              <span className="info-item">
                <span className="info-icon">🎯</span>
                Phases: {mission.phases.length}
              </span>
            </div>
            <button
              className="mission-start-button"
              onClick={() => handleStartMission(mission.id)}
            >
              START MISSION
            </button>
          </div>
        ))}

        {getAvailableMissions().length === 0 && (
          <div className="no-missions">
            <h2>All missions completed!</h2>
            <p>Congratulations, Commander!</p>
          </div>
        )}
      </div>
    </div>
  );
}
