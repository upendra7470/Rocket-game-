# 🚀 Rocket Simulator

A hyper-realistic space rocket simulator game with full mission cycles, realistic physics, interactive 3D cockpit, and immersive audio/visuals.

## Features

- **Realistic Physics Simulation**
  - Gravity calculations based on altitude
  - Atmospheric drag effects
  - Fuel consumption mechanics
  - Temperature dynamics during re-entry
  - Hull integrity system

- **Complete Mission Cycles**
  - Pre-flight checks
  - Launch procedures
  - Ascent to orbit
  - Orbit insertion
  - Docking operations
  - Re-entry
  - Precision landing

- **Interactive 3D Cockpit**
  - Multi-function displays (MFDs)
  - Real-time telemetry
  - Attitude indicator
  - Engine status monitoring
  - Warning systems

- **Progressive Mission System**
  - Training missions
  - Suborbital flights
  - Orbital operations
  - Space station docking
  - Lunar missions

- **Achievement System**
  - Track your accomplishments
  - Rare and legendary achievements
  - Progress tracking

- **Immersive Experience**
  - Dynamic audio effects
  - Engine sounds
  - Warning alarms
  - Atmospheric visuals

## Controls

| Key | Action |
|-----|--------|
| SPACE | Toggle Engine |
| W / S | Pitch Up / Down |
| A / D | Yaw Left / Right |
| Q / E | Roll Left / Right |
| SHIFT | Increase Throttle |
| CTRL | Decrease Throttle |
| P | Pause Game |

## Tech Stack

- **React 18** - UI Framework
- **React Three Fiber** - 3D Rendering
- **Rapier.js** - Physics Engine
- **Zustand** - State Management
- **TypeScript** - Type Safety
- **Vite** - Build Tool

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Game Mechanics

### Physics Model

The game uses realistic physics including:
- Variable gravity based on distance from Earth
- Atmospheric density following exponential decay
- Drag calculation using drag equation
- Thrust-to-weight ratios
- Fuel consumption based on throttle

### Mission Phases

1. **Pre-Flight** - System checks and preparation
2. **Launch** - Initial ascent from launchpad
3. **Ascent** - Atmospheric climb to space
4. **Orbit Insertion** - Achieving orbital velocity
5. **Orbit** - Stable orbital operations
6. **Docking** - Approach and dock with station
7. **Re-Entry** - Atmospheric descent
8. **Landing** - Precision touchdown

### Telemetry

The game tracks comprehensive telemetry:
- Altitude and velocity
- Pitch, yaw, and roll angles
- Fuel levels and consumption
- Temperature readings
- Hull integrity
- G-force loads

## Mission Types

### Basic Flight Training
Learn the fundamentals of rocket control.

### Suborbital Flight
Reach the edge of space (100km) and return.

### Orbital Insertion
Achieve stable low Earth orbit.

### Docking Operations
Dock with the International Space Station.

### Lunar Approach
Journey to the Moon and establish lunar orbit.

## Performance

- Target: 60 FPS
- Optimized physics calculations
- Efficient 3D rendering
- Minimal state updates

## License

MIT
