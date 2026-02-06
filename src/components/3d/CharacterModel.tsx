// Grudge Warlords - 3D Character Model
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { ClassType } from '../../data/characters';

interface CharacterModelProps {
  position: [number, number, number];
  classType: ClassType;
  isPlayer: boolean;
  hp: number;
  maxHp: number;
}

// Class-specific visual configurations
const CLASS_CONFIGS: Record<ClassType, {
  color: string;
  emissive: string;
  height: number;
  weaponType: 'sword' | 'staff' | 'bow' | 'claws';
  icon: string;
}> = {
  warrior: {
    color: '#dc2626',
    emissive: '#991b1b',
    height: 1.8,
    weaponType: 'sword',
    icon: '⚔️'
  },
  mage: {
    color: '#3b82f6',
    emissive: '#1d4ed8',
    height: 1.7,
    weaponType: 'staff',
    icon: '🔮'
  },
  ranger: {
    color: '#22c55e',
    emissive: '#15803d',
    height: 1.75,
    weaponType: 'bow',
    icon: '🏹'
  },
  worg: {
    color: '#a855f7',
    emissive: '#7e22ce',
    height: 1.6,
    weaponType: 'claws',
    icon: '🐺'
  }
};

function HealthBar3D({ hp, maxHp, yOffset }: { hp: number; maxHp: number; yOffset: number }) {
  const hpPercent = (hp / maxHp) * 100;
  const barColor = hpPercent > 60 ? '#22c55e' : hpPercent > 30 ? '#f59e0b' : '#ef4444';

  return (
    <Billboard position={[0, yOffset, 0]}>
      <Html center transform occlude>
        <div style={{
          width: '80px',
          background: 'rgba(0,0,0,0.8)',
          borderRadius: '4px',
          padding: '2px',
          border: '1px solid #334155'
        }}>
          <div style={{
            height: '8px',
            background: '#1e1e2e',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${hpPercent}%`,
              height: '100%',
              background: barColor,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            fontSize: '10px',
            color: '#fff',
            textAlign: 'center',
            marginTop: '2px'
          }}>
            {hp}/{maxHp}
          </div>
        </div>
      </Html>
    </Billboard>
  );
}

function Weapon({ type, color }: { type: string; color: string }) {
  const weaponRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (weaponRef.current) {
      // Subtle weapon idle animation
      weaponRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  switch (type) {
    case 'sword':
      return (
        <group ref={weaponRef} position={[0.6, 0.3, 0]} rotation={[0, 0, -0.3]}>
          {/* Blade */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.08, 0.8, 0.02]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Handle */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.25]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          {/* Guard */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.2, 0.04, 0.04]} />
            <meshStandardMaterial color={color} metalness={0.8} />
          </mesh>
        </group>
      );
    case 'staff':
      return (
        <group ref={weaponRef} position={[0.5, 0.5, 0]} rotation={[0, 0, 0.1]}>
          {/* Shaft */}
          <mesh>
            <cylinderGeometry args={[0.03, 0.04, 1.8]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
          {/* Crystal */}
          <mesh position={[0, 0.95, 0]}>
            <octahedronGeometry args={[0.12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
          </mesh>
        </group>
      );
    case 'bow':
      return (
        <group ref={weaponRef} position={[0.4, 0.4, -0.2]} rotation={[0, 0.5, 0]}>
          {/* Bow arc */}
          <mesh>
            <torusGeometry args={[0.5, 0.02, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#5c4033" />
          </mesh>
          {/* String */}
          <mesh>
            <cylinderGeometry args={[0.005, 0.005, 1]} />
            <meshStandardMaterial color="#f5f5dc" />
          </mesh>
        </group>
      );
    case 'claws':
      return (
        <group ref={weaponRef} position={[0.45, 0.1, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0.1, (i - 1) * 0.08]} rotation={[0.3, 0, 0]}>
              <coneGeometry args={[0.015, 0.2, 8]} />
              <meshStandardMaterial color="#808080" metalness={0.9} />
            </mesh>
          ))}
        </group>
      );
    default:
      return null;
  }
}

export default function CharacterModel({ position, classType, isPlayer, hp, maxHp }: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const config = CLASS_CONFIGS[classType];

  // Idle animation
  useFrame((state) => {
    if (groupRef.current) {
      // Breathing animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      // Subtle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Player glow effect
  const glowColor = useMemo(() => new THREE.Color(config.emissive), [config.emissive]);

  return (
    <group ref={groupRef} position={position}>
      {/* Health Bar */}
      <HealthBar3D hp={hp} maxHp={maxHp} yOffset={config.height + 0.5} />
      
      {/* Body */}
      <mesh position={[0, config.height / 2, 0]} castShadow>
        <capsuleGeometry args={[0.3, config.height - 0.6, 8, 16]} />
        <meshStandardMaterial 
          color={config.color} 
          emissive={isPlayer ? glowColor : undefined}
          emissiveIntensity={isPlayer ? 0.2 : 0}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, config.height - 0.15, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#f5deb3" />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.08, config.height - 0.12, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.08, config.height - 0.12, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Weapon */}
      <Weapon type={config.weaponType} color={config.color} />

      {/* Player indicator ring */}
      {isPlayer && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
