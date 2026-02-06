// Grudge Warlords - 3D Enemy Model
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { EnemyType } from '../../systems/enemies';

interface EnemyModelProps {
  position: [number, number, number];
  enemyType: EnemyType;
  name: string;
  hp: number;
  maxHp: number;
}

// Enemy type visual configurations
const ENEMY_CONFIGS: Record<EnemyType, {
  color: string;
  emissive: string;
  scale: number;
  shape: 'humanoid' | 'beast' | 'large' | 'boss';
}> = {
  normal: {
    color: '#6b7280',
    emissive: '#374151',
    scale: 1,
    shape: 'humanoid'
  },
  elite: {
    color: '#fbbf24',
    emissive: '#d97706',
    scale: 1.2,
    shape: 'humanoid'
  },
  boss: {
    color: '#ef4444',
    emissive: '#b91c1c',
    scale: 1.8,
    shape: 'large'
  },
  world_boss: {
    color: '#8b5cf6',
    emissive: '#6d28d9',
    scale: 2.5,
    shape: 'boss'
  },
  divine_boss: {
    color: '#f59e0b',
    emissive: '#d97706',
    scale: 3,
    shape: 'boss'
  }
};

function EnemyHealthBar({ hp, maxHp, name, yOffset }: { hp: number; maxHp: number; name: string; yOffset: number }) {
  const hpPercent = (hp / maxHp) * 100;
  const barColor = hpPercent > 60 ? '#ef4444' : hpPercent > 30 ? '#f59e0b' : '#dc2626';

  return (
    <Billboard position={[0, yOffset, 0]}>
      <Html center transform occlude>
        <div style={{
          minWidth: '100px',
          background: 'rgba(0,0,0,0.9)',
          borderRadius: '6px',
          padding: '4px 8px',
          border: '2px solid #ef4444'
        }}>
          <div style={{
            fontSize: '11px',
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '4px',
            textShadow: '1px 1px 2px #000'
          }}>
            {name}
          </div>
          <div style={{
            height: '10px',
            background: '#1e1e2e',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${hpPercent}%`,
              height: '100%',
              background: `linear-gradient(90deg, #b91c1c, ${barColor})`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            fontSize: '9px',
            color: '#94a3b8',
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

function HumanoidEnemy({ config }: { config: typeof ENEMY_CONFIGS.normal }) {
  return (
    <group scale={config.scale}>
      {/* Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
        <meshStandardMaterial 
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={0.3}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
      {/* Evil eyes */}
      <mesh position={[0.06, 1.38, 0.14]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.06, 1.38, 0.14]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
      {/* Arms */}
      <mesh position={[0.35, 0.7, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.08, 0.4]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
      <mesh position={[-0.35, 0.7, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.08, 0.4]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
    </group>
  );
}

function BeastEnemy({ config }: { config: typeof ENEMY_CONFIGS.normal }) {
  return (
    <group scale={config.scale}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 6, 0, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial 
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.7, 0.4]} castShadow>
        <coneGeometry args={[0.2, 0.4, 8]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.1, 0.75, 0.55]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.1, 0.75, 0.55]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>
      {/* Legs */}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.5]} />
          <meshStandardMaterial color={config.color} />
        </mesh>
      ))}
    </group>
  );
}

function LargeEnemy({ config }: { config: typeof ENEMY_CONFIGS.normal }) {
  return (
    <group scale={config.scale}>
      {/* Massive body */}
      <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.4, 1, 8, 16]} />
        <meshStandardMaterial 
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={0.4}
          metalness={0.3}
        />
      </mesh>
      {/* Large head */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
      {/* Horns */}
      <mesh position={[0.2, 2.1, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.06, 0.3, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.2, 2.1, 0]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.06, 0.3, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Glowing eyes */}
      <mesh position={[0.12, 1.95, 0.28]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.12, 1.95, 0.28]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function BossEnemy({ config }: { config: typeof ENEMY_CONFIGS.normal }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Boss aura rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group scale={config.scale}>
      {/* Aura rings */}
      <group ref={groupRef}>
        <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.05, 8, 32]} />
          <meshStandardMaterial color={config.emissive} emissive={config.emissive} emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.03, 8, 32]} />
          <meshStandardMaterial color={config.emissive} emissive={config.emissive} emissiveIntensity={0.8} transparent opacity={0.4} />
        </mesh>
      </group>
      
      {/* Core body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <dodecahedronGeometry args={[0.5]} />
        <meshStandardMaterial 
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={0.6}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      
      {/* Crown */}
      <mesh position={[0, 1.9, 0]}>
        <coneGeometry args={[0.3, 0.4, 6]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Central eye */}
      <mesh position={[0, 1.2, 0.45]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 1.2, 0.5]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

export default function EnemyModel({ position, enemyType, name, hp, maxHp }: EnemyModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const config = ENEMY_CONFIGS[enemyType];

  // Enemy idle animation
  useFrame((state) => {
    if (groupRef.current) {
      // Menacing hover
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      // Face toward player
      groupRef.current.rotation.y = Math.PI + Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  const yOffset = config.scale * 2 + 0.5;

  return (
    <group ref={groupRef} position={position}>
      {/* Health Bar with Name */}
      <EnemyHealthBar hp={hp} maxHp={maxHp} name={name} yOffset={yOffset} />

      {/* Render appropriate enemy shape */}
      {config.shape === 'humanoid' && <HumanoidEnemy config={config} />}
      {config.shape === 'beast' && <BeastEnemy config={config} />}
      {config.shape === 'large' && <LargeEnemy config={config} />}
      {config.shape === 'boss' && <BossEnemy config={config} />}

      {/* Enemy target ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.5 * config.scale, 0.6 * config.scale, 32]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} transparent opacity={0.6} />
      </mesh>

      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.5 * config.scale, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
