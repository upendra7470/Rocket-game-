import { Achievement } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'first-flight',
    name: 'First Flight',
    description: 'Complete your first mission',
    unlocked: false,
    icon: '🚀',
    rarity: 'common',
  },
  {
    id: 'karman-line',
    name: 'Edge of Space',
    description: 'Reach the Karman line (100km)',
    unlocked: false,
    icon: '🌌',
    rarity: 'common',
  },
  {
    id: 'orbital',
    name: 'Orbital Pilot',
    description: 'Achieve stable orbit',
    unlocked: false,
    icon: '🌍',
    rarity: 'rare',
  },
  {
    id: 'docking-master',
    name: 'Docking Master',
    description: 'Successfully dock with a space station',
    unlocked: false,
    icon: '🔗',
    rarity: 'epic',
  },
  {
    id: 'lunar-lander',
    name: 'Lunar Lander',
    description: 'Land on the Moon',
    unlocked: false,
    icon: '🌙',
    rarity: 'legendary',
  },
  {
    id: 'perfect-landing',
    name: 'Perfect Landing',
    description: 'Land with less than 1 m/s vertical velocity',
    unlocked: false,
    icon: '🎯',
    rarity: 'rare',
  },
  {
    id: 'fuel-efficiency',
    name: 'Fuel Efficient',
    description: 'Complete a mission with 30% fuel remaining',
    unlocked: false,
    icon: '⛽',
    rarity: 'common',
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Reach 10,000 m/s',
    unlocked: false,
    icon: '⚡',
    rarity: 'rare',
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Complete a mission with hull integrity below 20%',
    unlocked: false,
    icon: '💥',
    rarity: 'epic',
  },
  {
    id: 'veteran',
    name: 'Veteran Pilot',
    description: 'Complete 10 missions',
    unlocked: false,
    icon: '🎖️',
    rarity: 'epic',
  },
  {
    id: 'millionaire',
    name: 'Space Millionaire',
    description: 'Earn 1,000,000 credits',
    unlocked: false,
    icon: '💰',
    rarity: 'legendary',
  },
  {
    id: 'orbital-veteran',
    name: 'Orbital Veteran',
    description: 'Spend 10 hours in orbit',
    unlocked: false,
    icon: '⏱️',
    rarity: 'epic',
  },
];

export const checkAchievement = (
  achievementId: string,
  gameState: any
): boolean => {
  const { rocket, missionPhase, completedMissions, credits } = gameState;

  switch (achievementId) {
    case 'first-flight':
      return completedMissions.length >= 1;
    case 'karman-line':
      return rocket.altitude >= 100000;
    case 'orbital':
      return missionPhase === 'ORBIT' && rocket.speed >= 7800;
    case 'docking-master':
      return rocket.isDocked;
    case 'lunar-lander':
      return missionPhase === 'LANDING' && rocket.altitude === 0;
    case 'perfect-landing':
      return rocket.isLanded && rocket.velocity.y < 1;
    case 'fuel-efficiency':
      return (rocket.fuel / rocket.maxFuel) * 100 >= 30;
    case 'speed-demon':
      return rocket.speed >= 10000;
    case 'survivor':
      return rocket.hullIntegrity < 20 && rocket.hullIntegrity > 0;
    case 'veteran':
      return completedMissions.length >= 10;
    case 'millionaire':
      return credits >= 1000000;
    case 'orbital-veteran':
      return gameState.gameTime >= 36000;
    default:
      return false;
  }
};
