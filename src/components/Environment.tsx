import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Stars, Cloud } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

export function Environment() {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const { rocket } = useGameStore();

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0001;
    }
  });

  const getAtmosphereOpacity = () => {
    const opacity = Math.exp(-rocket.altitude / 50000);
    return Math.max(0, Math.min(0.8, opacity));
  };

  const getSunPosition = () => {
    return [1000, 500, 500] as [number, number, number];
  };

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={getSunPosition()}
        inclination={0}
        azimuth={0.25}
      />

      <Stars
        radius={300}
        depth={60}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <mesh ref={earthRef} position={[0, -6371000, 0]}>
        <sphereGeometry args={[6371000, 64, 64]} />
        <meshStandardMaterial
          color="#1a5276"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      <mesh ref={atmosphereRef} position={[0, -6371000, 0]} scale={1.02}>
        <sphereGeometry args={[6371000, 64, 64]} />
        <meshStandardMaterial
          color="#4a90d9"
          transparent
          opacity={getAtmosphereOpacity()}
          roughness={1}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>

      {rocket.altitude < 50000 && (
        <>
          <Cloud
            position={[1000, 2000, 1000]}
            opacity={getAtmosphereOpacity() * 0.8}
            speed={0.2}
          />
          <Cloud
            position={[-1500, 2500, -500]}
            opacity={getAtmosphereOpacity() * 0.6}
            speed={0.15}
          />
          <Cloud
            position={[500, 1800, 1500]}
            opacity={getAtmosphereOpacity() * 0.7}
            speed={0.25}
          />
        </>
      )}

      <ambientLight intensity={0.3} />
      <directionalLight
        position={getSunPosition()}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
}
