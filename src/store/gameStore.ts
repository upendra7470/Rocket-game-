import { create } from 'zustand';
import { GameState, MissionPhase, MissionStatus, RocketState, TelemetryData, Mission, Achievement } from '../types';
import { Vector3 } from 'three';

const initialRocketState: RocketState = {
  position: new Vector3(0, 0, 0),
  velocity: new Vector3(0, 0, 0),
  rotation: new Vector3(0, 0, 0),
  angularVelocity: new Vector3(0, 0, 0),
  fuel: 10000,
  maxFuel: 10000,
  thrust: 0,
  maxThrust: 30000,
  mass: 5000,
  temperature: 288,
  hullIntegrity: 100,
  altitude: 0,
  speed: 0,
  pitch: 0,
  yaw: 0,
  roll: 0,
  throttle: 0,
  isEngineOn: false,
  isLanded: true,
  isDocked: false,
};

interface GameStore extends GameState {
  setMissionPhase: (phase: MissionPhase) => void;
  setMissionStatus: (status: MissionStatus) => void;
  updateRocket: (updates: Partial<RocketState>) => void;
  setThrottle: (throttle: number) => void;
  setEngineOn: (on: boolean) => void;
  togglePause: () => void;
  addTelemetry: (data: TelemetryData) => void;
  unlockAchievement: (id: string) => void;
  startMission: (missionId: string) => void;
  completeObjective: (objectiveId: string) => void;
  completeMission: () => void;
  failMission: () => void;
  resetMission: () => void;
  updateTelemetry: () => void;
  addCredits: (amount: number) => void;
  addExperience: (amount: number) => void;
  setAvailableMissions: (missions: Mission[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  currentMission: null,
  missionPhase: MissionPhase.PRE_FLIGHT,
  missionStatus: MissionStatus.NOT_STARTED,
  rocket: initialRocketState,
  environment: {
    atmosphereDensity: 1.225,
    gravity: 9.81,
    temperature: 288,
    windVelocity: new Vector3(0, 0, 0),
    timeOfDay: 0,
  },
  achievements: [],
  availableMissions: [],
  completedMissions: [],
  telemetry: [],
  isPaused: false,
  gameTime: 0,
  credits: 0,
  experience: 0,
  level: 1,

  setMissionPhase: (phase) => set({ missionPhase: phase }),

  setMissionStatus: (status) => set({ missionStatus: status }),

  updateRocket: (updates) =>
    set((state) => ({
      rocket: { ...state.rocket, ...updates },
    })),

  setThrottle: (throttle) =>
    set((state) => ({
      rocket: { ...state.rocket, throttle: Math.max(0, Math.min(1, throttle)) },
    })),

  setEngineOn: (on) =>
    set((state) => ({
      rocket: { ...state.rocket, isEngineOn: on },
    })),

  togglePause: () =>
    set((state) => ({
      isPaused: !state.isPaused,
      missionStatus: state.isPaused ? MissionStatus.IN_PROGRESS : MissionStatus.PAUSED,
    })),

  addTelemetry: (data) =>
    set((state) => ({
      telemetry: [...state.telemetry.slice(-100), data],
    })),

  unlockAchievement: (id) =>
    set((state) => ({
      achievements: state.achievements.map((a) =>
        a.id === id ? { ...a, unlocked: true, unlockedAt: new Date() } : a
      ),
    })),

  startMission: (missionId) =>
    set((state) => {
      const mission = state.availableMissions.find((m) => m.id === missionId);
      if (!mission) return state;
      return {
        currentMission: {
          ...mission,
          objectives: mission.objectives.map((o) => ({ ...o, completed: false })),
        },
        missionPhase: MissionPhase.PRE_FLIGHT,
        missionStatus: MissionStatus.IN_PROGRESS,
        rocket: initialRocketState,
        telemetry: [],
        gameTime: 0,
      };
    }),

  completeObjective: (objectiveId) =>
    set((state) => {
      if (!state.currentMission) return state;
      return {
        currentMission: {
          ...state.currentMission,
          objectives: state.currentMission.objectives.map((o) =>
            o.id === objectiveId ? { ...o, completed: true } : o
          ),
        },
      };
    }),

  completeMission: () =>
    set((state) => {
      if (!state.currentMission) return state;
      return {
        missionPhase: MissionPhase.MISSION_COMPLETE,
        missionStatus: MissionStatus.COMPLETED,
        completedMissions: [...state.completedMissions, state.currentMission.id],
        credits: state.credits + state.currentMission.rewards.credits,
        experience: state.experience + state.currentMission.rewards.experience,
        level: Math.floor((state.experience + state.currentMission.rewards.experience) / 1000) + 1,
      };
    }),

  failMission: () =>
    set({
      missionPhase: MissionPhase.MISSION_FAILED,
      missionStatus: MissionStatus.FAILED,
    }),

  resetMission: () =>
    set({
      rocket: initialRocketState,
      telemetry: [],
      gameTime: 0,
      missionPhase: MissionPhase.PRE_FLIGHT,
      missionStatus: MissionStatus.NOT_STARTED,
    }),

  updateTelemetry: () =>
    set((state) => {
      const { rocket, environment } = state;
      const telemetryData: TelemetryData = {
        timestamp: state.gameTime,
        altitude: rocket.altitude,
        velocity: rocket.speed,
        acceleration: rocket.thrust / rocket.mass - environment.gravity,
        fuelLevel: (rocket.fuel / rocket.maxFuel) * 100,
        temperature: rocket.temperature,
        hullIntegrity: rocket.hullIntegrity,
        gForce: rocket.thrust / (rocket.mass * 9.81),
      };
      return {
        telemetry: [...state.telemetry.slice(-100), telemetryData],
      };
    }),

  addCredits: (amount) =>
    set((state) => ({
      credits: state.credits + amount,
    })),

  addExperience: (amount) =>
    set((state) => ({
      experience: state.experience + amount,
      level: Math.floor((state.experience + amount) / 1000) + 1,
    })),

  setAvailableMissions: (missions) => set({ availableMissions: missions }),

  setAchievements: (achievements) => set({ achievements }),
}));
