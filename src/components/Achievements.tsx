import { useGameStore } from '../store/gameStore';
import { achievements } from '../game/achievements';

export function Achievements({ onClose }: { onClose: () => void }) {
  const achievementsState = useGameStore((state) => state.achievements);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#aaaaaa';
      case 'rare':
        return '#0070dd';
      case 'epic':
        return '#a335ee';
      case 'legendary':
        return '#ff8000';
      default:
        return '#ffffff';
    }
  };

  return (
    <div className="achievements-overlay">
      <div className="achievements-content">
        <div className="achievements-header">
          <h1>ACHIEVEMENTS</h1>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="achievements-stats">
          <div className="achievement-stat">
            <span className="stat-value">{achievementsState.filter((a) => a.unlocked).length}</span>
            <span className="stat-label">Unlocked</span>
          </div>
          <div className="achievement-stat">
            <span className="stat-value">{achievements.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="achievement-stat">
            <span className="stat-value">
              {((achievementsState.filter((a) => a.unlocked).length / achievements.length) * 100).toFixed(0)}%
            </span>
            <span className="stat-label">Completion</span>
          </div>
        </div>

        <div className="achievements-list">
          {achievements.map((achievementTemplate) => {
            const achievement = achievementsState.find((a) => a.id === achievementTemplate.id) || achievementTemplate;
            return (
            <div
              key={achievement.id}
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              style={{
                borderColor: achievement.unlocked ? getRarityColor(achievement.rarity) : '#333',
              }}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <h3 className="achievement-name">{achievement.name}</h3>
                <p className="achievement-description">{achievement.description}</p>
                <div className="achievement-meta">
                  <span
                    className="achievement-rarity"
                    style={{ color: getRarityColor(achievement.rarity) }}
                  >
                    {achievement.rarity.toUpperCase()}
                  </span>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <span className="achievement-date">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              {achievement.unlocked && (
                <div className="achievement-check">✓</div>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
