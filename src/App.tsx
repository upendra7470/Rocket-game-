import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { GameScene } from './components/GameScene';
import { Cockpit } from './components/Cockpit';
import { HUD } from './components/HUD';
import { MissionSelect } from './components/MissionSelect';
import { PauseMenu } from './components/PauseMenu';
import { MissionComplete, MissionFailed } from './components/MissionComplete';
import { Achievements } from './components/Achievements';
import { missions } from './missions/missions';
import { achievements, checkAchievement } from './game/achievements';
import { MissionPhase, MissionStatus } from './types';
import './index.css';

type AppState = 'menu' | 'mission' | 'paused' | 'complete' | 'failed' | 'achievements';

function App() {
  const [appState, setAppState] = useState<AppState>('menu');
  const { setAvailableMissions, setAchievements, unlockAchievement } = useGameStore();

  useEffect(() => {
    setAvailableMissions(missions);
    setAchievements(achievements);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      if (state.missionStatus === MissionStatus.IN_PROGRESS && !state.isPaused) {
        const newGameTime = state.gameTime + 1;
        useGameStore.setState({ gameTime: newGameTime });

        achievements.forEach((achievement) => {
          if (!achievement.unlocked && achievement.id !== 'first-flight' && achievement.id !== 'veteran') {
            if (checkAchievement(achievement.id, state)) {
              unlockAchievement(achievement.id);
            }
          }
        });

        const phase = state.missionPhase;
        if (phase === MissionPhase.LAUNCH && state.rocket.altitude > 1000) {
          useGameStore.getState().setMissionPhase(MissionPhase.ASCENT);
        } else if (phase === MissionPhase.ASCENT && state.rocket.altitude > 100000) {
          useGameStore.getState().setMissionPhase(MissionPhase.ORBIT_INSERTION);
        } else if (phase === MissionPhase.ORBIT_INSERTION && state.rocket.speed >= 7800) {
          useGameStore.getState().setMissionPhase(MissionPhase.ORBIT);
        } else if (phase === MissionPhase.ORBIT && state.gameTime > 100) {
          useGameStore.getState().setMissionPhase(MissionPhase.RE_ENTRY);
        } else if (phase === MissionPhase.RE_ENTRY && state.rocket.altitude < 50000) {
          useGameStore.getState().setMissionPhase(MissionPhase.LANDING);
        } else if (phase === MissionPhase.LANDING && state.rocket.isLanded) {
          useGameStore.getState().completeMission();
          setAppState('complete');
        }

        if (state.rocket.hullIntegrity <= 0) {
          useGameStore.getState().failMission();
          setAppState('failed');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockAchievement]);

  const handleStartMission = () => {
    setAppState('mission');
  };

  const handleResume = () => {
    setAppState('mission');
  };

  const handleRetry = () => {
    useGameStore.getState().resetMission();
    setAppState('mission');
  };

  const handleQuit = () => {
    useGameStore.getState().resetMission();
    setAppState('menu');
  };

  const handleShowAchievements = () => {
    setAppState('achievements');
  };

  const handleHideAchievements = () => {
    setAppState('menu');
  };

  return (
    <div className="app">
      {appState === 'menu' && (
        <div className="main-menu">
          <div className="menu-content">
            <h1 className="game-title">🚀 ROCKET SIMULATOR</h1>
            <p className="game-subtitle">Hyper-Realistic Space Flight Experience</p>
            
            <div className="menu-buttons">
              <button className="menu-button primary" onClick={handleStartMission}>
                START MISSION
              </button>
              <button className="menu-button secondary" onClick={handleShowAchievements}>
                ACHIEVEMENTS
              </button>
            </div>

            <div className="menu-info">
              <div className="info-box">
                <h3>FEATURES</h3>
                <ul>
                  <li>Realistic physics simulation</li>
                  <li>Complete mission cycles</li>
                  <li>Progressive difficulty</li>
                  <li>Achievement system</li>
                  <li>Immersive audio</li>
                </ul>
              </div>

              <div className="info-box">
                <h3>CONTROLS</h3>
                <ul>
                  <li>SPACE - Toggle Engine</li>
                  <li>W/S - Pitch Control</li>
                  <li>A/D - Yaw Control</li>
                  <li>Q/E - Roll Control</li>
                  <li>SHIFT/CTRL - Throttle</li>
                  <li>P - Pause</li>
                </ul>
              </div>
            </div>

            <div className="player-summary">
              <div className="summary-item">
                <span className="summary-icon">⭐</span>
                <span className="summary-value">{useGameStore.getState().level}</span>
                <span className="summary-label">Level</span>
              </div>
              <div className="summary-item">
                <span className="summary-icon">💰</span>
                <span className="summary-value">{useGameStore.getState().credits.toLocaleString()}</span>
                <span className="summary-label">Credits</span>
              </div>
              <div className="summary-item">
                <span className="summary-icon">🏆</span>
                <span className="summary-value">{useGameStore.getState().achievements.filter((a) => a.unlocked).length}</span>
                <span className="summary-label">Achievements</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {appState === 'menu' && <MissionSelect onSelect={handleStartMission} />}

      {appState === 'mission' && (
        <>
          <GameScene />
          <Cockpit />
          <HUD />
        </>
      )}

      {appState === 'paused' && (
        <>
          <GameScene />
          <PauseMenu onResume={handleResume} onQuit={handleQuit} />
        </>
      )}

      {appState === 'complete' && (
        <>
          <GameScene />
          <MissionComplete onContinue={handleQuit} />
        </>
      )}

      {appState === 'failed' && (
        <>
          <GameScene />
          <MissionFailed onRetry={handleRetry} onQuit={handleQuit} />
        </>
      )}

      {appState === 'achievements' && (
        <Achievements onClose={handleHideAchievements} />
      )}
    </div>
  );
}

export default App;
