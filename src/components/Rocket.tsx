import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

interface RocketProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

export function Rocket({ position, rotation }: RocketProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const { rocket } = useGameStore();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2]);
      groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }

    if (flameRef.current && rocket.isEngineOn) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 30) * 0.1;
      flameRef.current.scale.set(scale, scale * rocket.throttle, scale);
      if (Array.isArray(flameRef.current.material)) {
        flameRef.current.material[0].opacity = rocket.throttle;
      } else {
        flameRef.current.material.opacity = rocket.throttle;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 5, 0]}>
        <coneGeometry args={[1.5, 4, 32]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 6, 32]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[1.5, 2, 2, 32]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[2, 2.5, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </mesh>

      {rocket.isEngineOn && (
        <mesh ref={flameRef} position={[0, -4, 0]}>
          <coneGeometry args={[0.8, 4, 16]} />
          <meshStandardMaterial
            color="#ff6600"
            emissive="#ff3300"
            emissiveIntensity={2}
            transparent
            opacity={rocket.throttle}
          />
        </mesh>
      )}

      <mesh position={[2.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[3, 0.8, 0.1]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[-2.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[3, 0.8, 0.1]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0, 2.2]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[3, 0.8, 0.1]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0, -2.2]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[3, 0.8, 0.1]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0.5, 4.5, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      <mesh position={[0.5, 3.5, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      <mesh position={[0.5, 2.5, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}
