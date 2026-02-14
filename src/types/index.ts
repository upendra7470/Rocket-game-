import { Vector3 } from 'three';

export enum MissionPhase {
  PRE_FLIGHT = 'PRE_FLIGHT',
  LAUNCH = 'LAUNCH',
  ASCENT = 'ASCENT',
  ORBIT_INSERTION = 'ORBIT_INSERTION',
  ORBIT = 'ORBIT',
  DOCKING = 'DOCKING',
  RE_ENTRY = 'RE_ENTRY',
  LANDING = 'LANDING',
  MISSION_COMPLETE = 'MISSION_COMPLETE',
  MISSION_FAILED = 'MISSION_FAILED',
}

export enum MissionStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface RocketState {
  position: Vector3;
  velocity: Vector3;
  rotation: Vector3;
  angularVelocity: Vector3;
  fuel: number;
  maxFuel: number;
  thrust: number;
  maxThrust: number;
  mass: number;
  temperature: number;
  hullIntegrity: number;
  altitude: number;
  speed: number;
  pitch: number;
  yaw: number;
  roll: number;
  throttle: number;
  isEngineOn: boolean;
  isLanded: boolean;
  isDocked: boolean;
}

export interface EnvironmentState {
  atmosphereDensity: number;
  gravity: number;
  temperature: number;
  windVelocity: Vector3;
  timeOfDay: number;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  objectives: MissionObjective[];
  phases: MissionPhase[];
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  rewards: {
    experience: number;
    credits: number;
  };
  prerequisites: string[];
}

export interface MissionObjective {
  id: string;
  description: string;
  completed: boolean;
  optional: boolean;
  progress: number;
  targetValue: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface MFDPage {
  id: string;
  name: string;
  type: 'ORBIT' | 'SYSTEMS' | 'ENGINES' | 'NAVIGATION' | 'COMMS' | 'DOCKING';
}

export interface TelemetryData {
  timestamp: number;
  altitude: number;
  velocity: number;
  acceleration: number;
  fuelLevel: number;
  temperature: number;
  hullIntegrity: number;
  gForce: number;
}

export interface GameState {
  currentMission: Mission | null;
  missionPhase: MissionPhase;
  missionStatus: MissionStatus;
  rocket: RocketState;
  environment: EnvironmentState;
  achievements: Achievement[];
  availableMissions: Mission[];
  completedMissions: string[];
  telemetry: TelemetryData[];
  isPaused: boolean;
  gameTime: number;
  credits: number;
  experience: number;
  level: number;
}
