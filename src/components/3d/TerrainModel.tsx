// Grudge Warlords - 3D Terrain Model
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TerrainModelProps {
  zoneId: string;
}

// Zone terrain configurations
const ZONE_TERRAINS: Record<string, {
  groundColor: string;
  accentColor: string;
  props: 'forest' | 'cave' | 'fortress' | 'volcanic' | 'divine' | 'ocean';
}> = {
  bandit_camp: { groundColor: '#2d4a3e', accentColor: '#1a3028', props: 'forest' },
  goblin_cave: { groundColor: '#1a1a1a', accentColor: '#2a2a2a', props: 'cave' },
  orc_fort: { groundColor: '#3d2a2a', accentColor: '#4a3535', props: 'fortress' },
  castle: { groundColor: '#3a3a4a', accentColor: '#2a2a3a', props: 'fortress' },
  fortress: { groundColor: '#2a2a2a', accentColor: '#3a3a3a', props: 'fortress' },
  dragon_gate: { groundColor: '#2a1515', accentColor: '#3a2020', props: 'volcanic' },
  titan_hall: { groundColor: '#1a1a2a', accentColor: '#2a2a3a', props: 'fortress' },
  divine_arena: { groundColor: '#2a2a4a', accentColor: '#3a3a5a', props: 'divine' },
  holy_sanctum: { groundColor: '#3a3a5a', accentColor: '#4a4a6a', props: 'divine' },
  ocean: { groundColor: '#1a3a4a', accentColor: '#2a4a5a', props: 'ocean' }
};

function ForestProps() {
  const trees = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 8 + Math.random() * 12;
      positions.push([
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      ]);
    }
    return positions;
  }, []);

  return (
    <>
      {trees.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Tree trunk */}
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <coneGeometry args={[1.2, 2.5, 8]} />
            <meshStandardMaterial color="#1a4a1a" />
          </mesh>
          <mesh position={[0, 3.5, 0]} castShadow>
            <coneGeometry args={[0.8, 2, 8]} />
            <meshStandardMaterial color="#2a5a2a" />
          </mesh>
        </group>
      ))}
      {/* Rocks */}
      {[[-5, 0, 3], [4, 0, -4], [-3, 0, -6]].map((pos, i) => (
        <mesh key={`rock-${i}`} position={pos as [number, number, number]} castShadow>
          <dodecahedronGeometry args={[0.5 + Math.random() * 0.5]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

function CaveProps() {
  return (
    <>
      {/* Stalactites */}
      {[[-3, 6, 2], [2, 5.5, -3], [0, 6.5, 5], [-4, 5, -2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.3, 1.5, 6]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
      ))}
      {/* Glowing crystals */}
      {[[3, 0.5, 2], [-2, 0.3, -3], [1, 0.4, -2]].map((pos, i) => (
        <mesh key={`crystal-${i}`} position={pos as [number, number, number]} rotation={[0.2, i, 0.3]}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.8} />
        </mesh>
      ))}
      {/* Cave walls (curved) */}
      <mesh position={[0, 3, -12]} rotation={[0.3, 0, 0]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#1a1a1a" side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

function FortressProps() {
  return (
    <>
      {/* Stone pillars */}
      {[[-6, 0, -6], [6, 0, -6], [-6, 0, 6], [6, 0, 6]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.6, 4, 8]} />
            <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.2, 0]}>
            <boxGeometry args={[1.2, 0.4, 1.2]} />
            <meshStandardMaterial color="#3a3a3a" />
          </mesh>
        </group>
      ))}
      {/* Broken walls */}
      <mesh position={[-8, 1, 0]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 2, 4]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      {/* Torches */}
      {[[-6, 3, -6], [6, 3, -6]].map((pos, i) => (
        <pointLight key={i} position={pos as [number, number, number]} intensity={0.5} color="#ff6600" distance={5} />
      ))}
    </>
  );
}

function VolcanicProps() {
  const lavaRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (lavaRef.current) {
      // Pulsing lava glow
      const material = lavaRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <>
      {/* Lava pools */}
      <mesh ref={lavaRef} rotation={[-Math.PI / 2, 0, 0]} position={[5, 0.05, 5]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={0.8} />
      </mesh>
      {/* Volcanic rocks */}
      {[[-4, 0.5, 3], [3, 0.3, -4], [-2, 0.4, -5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <dodecahedronGeometry args={[0.8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={1} />
        </mesh>
      ))}
      {/* Fire particles (point lights) */}
      <pointLight position={[5, 1, 5]} intensity={1} color="#ff4400" distance={8} />
      <pointLight position={[-3, 0.5, 4]} intensity={0.3} color="#ff6600" distance={4} />
    </>
  );
}

function DivineProps() {
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (haloRef.current) {
      haloRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <>
      {/* Divine pillars of light */}
      {[[-5, 0, -5], [5, 0, -5], [0, 0, 8]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 5, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 10]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
      {/* Floating halo */}
      <mesh ref={haloRef} position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.1, 16, 64]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1} />
      </mesh>
      {/* Floating crystals */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 4, 3 + Math.sin(i) * 0.5, Math.sin(angle) * 4]}>
            <octahedronGeometry args={[0.4]} />
            <meshStandardMaterial color="#ffffff" emissive="#8b5cf6" emissiveIntensity={0.6} />
          </mesh>
        );
      })}
    </>
  );
}

function OceanProps() {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <>
      {/* Animated water plane */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[50, 50, 32, 32]} />
        <meshStandardMaterial color="#1a4a6a" transparent opacity={0.8} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Floating debris */}
      {[[3, 0, 4], [-4, 0, 2], [2, 0, -3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.5, 0.1, 1]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
      ))}
    </>
  );
}

export default function TerrainModel({ zoneId }: TerrainModelProps) {
  const terrain = ZONE_TERRAINS[zoneId] || ZONE_TERRAINS.bandit_camp;

  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={terrain.groundColor} />
      </mesh>

      {/* Combat arena circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[6, 8, 64]} />
        <meshStandardMaterial color={terrain.accentColor} transparent opacity={0.5} />
      </mesh>

      {/* Zone-specific props */}
      {terrain.props === 'forest' && <ForestProps />}
      {terrain.props === 'cave' && <CaveProps />}
      {terrain.props === 'fortress' && <FortressProps />}
      {terrain.props === 'volcanic' && <VolcanicProps />}
      {terrain.props === 'divine' && <DivineProps />}
      {terrain.props === 'ocean' && <OceanProps />}
    </group>
  );
}
