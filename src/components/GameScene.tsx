import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { Rocket } from './Rocket';
import { Environment } from './Environment';
import { RocketPhysics } from '../physics/rocketPhysics';
import { audioManager } from '../audio/audioManager';
import { MissionPhase } from '../types';
import { Vector3 } from 'three';

function GamePhysics() {
  const { rocket, environment, updateRocket, setThrottle, missionPhase } = useGameStore();
  const physicsRef = useRef<RocketPhysics | null>(null);

  useEffect(() => {
    physicsRef.current = new RocketPhysics(rocket, environment);
  }, []);

  useEffect(() => {
    if (rocket.isEngineOn) {
      audioManager.startEngine();
    } else {
      audioManager.stopEngine();
    }
  }, [rocket.isEngineOn]);

  useEffect(() => {
    audioManager.setEngineVolume(rocket.throttle);
  }, [rocket.throttle]);

  useFrame((_state, delta) => {
    if (!physicsRef.current) return;

    const updatedRocket = physicsRef.current.update(delta);
    updateRocket(updatedRocket);

    if (missionPhase === MissionPhase.LAUNCH && rocket.altitude > 1000) {
      setThrottle(1);
    }

    const gameState = useGameStore.getState();
    if (gameState.missionStatus === 'IN_PROGRESS') {
      useGameStore.getState().updateTelemetry();
    }
  });

  return null;
}

function GameController() {
  const { setEngineOn, updateRocket, rocket } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setEngineOn(!rocket.isEngineOn);
          audioManager.playClick();
          break;
        case 'w':
        case 'arrowup':
          updateRocket({
            angularVelocity: new Vector3(0.5, rocket.angularVelocity.y, rocket.angularVelocity.z),
          });
          break;
        case 's':
        case 'arrowdown':
          updateRocket({
            angularVelocity: new Vector3(-0.5, rocket.angularVelocity.y, rocket.angularVelocity.z),
          });
          break;
        case 'a':
        case 'arrowleft':
          updateRocket({
            angularVelocity: new Vector3(rocket.angularVelocity.x, 0.5, rocket.angularVelocity.z),
          });
          break;
        case 'd':
        case 'arrowright':
          updateRocket({
            angularVelocity: new Vector3(rocket.angularVelocity.x, -0.5, rocket.angularVelocity.z),
          });
          break;
        case 'q':
          updateRocket({
            angularVelocity: new Vector3(rocket.angularVelocity.x, rocket.angularVelocity.y, 0.5),
          });
          break;
        case 'e':
          updateRocket({
            angularVelocity: new Vector3(rocket.angularVelocity.x, rocket.angularVelocity.y, -0.5),
          });
          break;
        case 'shift':
          updateRocket({
            throttle: Math.min(1, rocket.throttle + 0.1),
          });
          break;
        case 'control':
          updateRocket({
            throttle: Math.max(0, rocket.throttle - 0.1),
          });
          break;
        case 'p':
          useGameStore.getState().togglePause();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 's':
        case 'arrowup':
        case 'arrowdown':
          updateRocket({
            angularVelocity: new Vector3(0, rocket.angularVelocity.y, rocket.angularVelocity.z),
          });
          break;
        case 'a':
        case 'd':
        case 'arrowleft':
        case 'arrowright':
          updateRocket({
            angularVelocity: new Vector3(rocket.angularVelocity.x, 0, rocket.angularVelocity.z),
          });
          break;
        case 'q':
        case 'e':
          updateRocket({
            angularVelocity: new Vector3(rocket.angularVelocity.x, rocket.angularVelocity.y, 0),
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [rocket, setEngineOn, updateRocket]);

  return null;
}

export function GameScene() {
  const { rocket } = useGameStore();

  useEffect(() => {
    audioManager.loadAllSounds();
    return () => audioManager.dispose();
  }, []);

  return (
    <div className="game-scene">
      <Canvas
        shadows
        camera={{ position: [20, 15, 20], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Physics gravity={[0, -9.81, 0]}>
          <GamePhysics />
          <GameController />

          <PerspectiveCamera makeDefault position={[20, 15, 20]} fov={60} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={100}
          />

          <ambientLight intensity={0.5} />
          <Environment />

          <Rocket
            position={[rocket.position.x, rocket.position.y, rocket.position.z]}
            rotation={[rocket.pitch, rocket.yaw, rocket.roll]}
          />

          <RigidBody type="fixed" position={[0, -0.5, 0]} colliders="hull">
            <mesh receiveShadow>
              <boxGeometry args={[100, 1, 100]} />
              <meshStandardMaterial color="#2d5a27" />
            </mesh>
          </RigidBody>
        </Physics>
      </Canvas>
    </div>
  );
}
