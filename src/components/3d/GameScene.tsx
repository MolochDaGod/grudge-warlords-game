// Grudge Warlords - 3D Game Scene
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sky, Float } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import CharacterModel from './CharacterModel';
import EnemyModel from './EnemyModel';
import TerrainModel from './TerrainModel';
import { EffectsLayer } from './EffectsLayer';

interface GameSceneProps {
  mode: 'combat' | 'world' | 'hub';
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8b5cf6" wireframe />
    </mesh>
  );
}

// Zone-specific environment configurations
const ZONE_ENVIRONMENTS: Record<string, {
  skyColor: string;
  groundColor: string;
  ambientIntensity: number;
  fogColor: string;
  fogDensity: number;
}> = {
  bandit_camp: {
    skyColor: '#1a1a2e',
    groundColor: '#2d4a3e',
    ambientIntensity: 0.4,
    fogColor: '#1a1a2e',
    fogDensity: 0.02
  },
  goblin_cave: {
    skyColor: '#0d0d15',
    groundColor: '#1a1a1a',
    ambientIntensity: 0.2,
    fogColor: '#0a0a0f',
    fogDensity: 0.05
  },
  orc_fort: {
    skyColor: '#2d1f1f',
    groundColor: '#3d2a2a',
    ambientIntensity: 0.5,
    fogColor: '#2d1f1f',
    fogDensity: 0.015
  },
  dragon_gate: {
    skyColor: '#1a0a0a',
    groundColor: '#2a1515',
    ambientIntensity: 0.6,
    fogColor: '#1a0505',
    fogDensity: 0.01
  },
  divine_arena: {
    skyColor: '#1a1a3a',
    groundColor: '#2a2a4a',
    ambientIntensity: 0.8,
    fogColor: '#1a1a3a',
    fogDensity: 0.005
  }
};

function CombatScene() {
  const { character, enemies, currentZone } = useGameStore();
  const env = ZONE_ENVIRONMENTS[currentZone] || ZONE_ENVIRONMENTS.bandit_camp;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={env.ambientIntensity} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ff6600" />
      
      {/* Environment */}
      <fog attach="fog" args={[env.fogColor, 10, 50]} />
      <Sky sunPosition={[100, 20, 100]} turbidity={10} rayleigh={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Terrain */}
      <TerrainModel zoneId={currentZone} />

      {/* Player Character */}
      {character && (
        <CharacterModel
          position={[-3, 0, 0]}
          classType={character.classType}
          isPlayer={true}
          hp={character.hp}
          maxHp={character.maxHp}
        />
      )}

      {/* Enemies */}
      {enemies.map((enemy, index) => (
        <EnemyModel
          key={enemy.id}
          position={[3 + index * 2, 0, index * 0.5]}
          enemyType={enemy.enemyType}
          name={enemy.name}
          hp={enemy.hp}
          maxHp={enemy.maxHp}
        />
      ))}

      {/* Combat Effects */}
      <EffectsLayer />
    </>
  );
}

function WorldScene() {
  const { currentZone } = useGameStore();
  const env = ZONE_ENVIRONMENTS[currentZone] || ZONE_ENVIRONMENTS.bandit_camp;

  return (
    <>
      <ambientLight intensity={env.ambientIntensity} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
      
      <fog attach="fog" args={[env.fogColor, 20, 100]} />
      <Sky sunPosition={[100, 50, 100]} />
      <Stars radius={200} depth={100} count={8000} factor={6} />

      <TerrainModel zoneId={currentZone} />
      
      {/* World decorations */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 5, -10]}>
          <dodecahedronGeometry args={[1]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </>
  );
}

function HubScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#f59e0b" />
      
      <Sky sunPosition={[100, 100, 100]} />
      
      {/* Hub platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <circleGeometry args={[10, 32]} />
        <meshStandardMaterial color="#1e1e2e" />
      </mesh>

      {/* Portal ring */}
      <mesh position={[0, 2, 0]}>
        <torusGeometry args={[2, 0.2, 16, 100]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.8} />
      </mesh>
    </>
  );
}

export default function GameScene({ mode }: GameSceneProps) {
  return (
    <div className="game-scene-container">
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0a0f');
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {mode === 'combat' && <CombatScene />}
          {mode === 'world' && <WorldScene />}
          {mode === 'hub' && <HubScene />}
        </Suspense>
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>
    </div>
  );
}
