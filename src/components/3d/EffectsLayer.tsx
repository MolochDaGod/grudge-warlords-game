// Grudge Warlords - Combat Effects Layer
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

interface DamageNumber {
  id: number;
  value: number;
  position: [number, number, number];
  isCrit: boolean;
  isHeal: boolean;
  createdAt: number;
}

interface SpellEffect {
  id: number;
  type: 'fire' | 'ice' | 'lightning' | 'holy' | 'physical';
  position: [number, number, number];
  createdAt: number;
}

// Floating damage number component
function FloatingDamage({ damage }: { damage: DamageNumber }) {
  const groupRef = useRef<THREE.Group>(null);
  const [opacity, setOpacity] = useState(1);

  useFrame((state) => {
    if (groupRef.current) {
      const age = (state.clock.elapsedTime * 1000 - damage.createdAt) / 1000;
      groupRef.current.position.y = damage.position[1] + age * 2;
      setOpacity(Math.max(0, 1 - age / 1.5));
    }
  });

  if (opacity <= 0) return null;

  return (
    <group ref={groupRef} position={damage.position}>
      <Html center>
        <div style={{
          fontSize: damage.isCrit ? '28px' : '20px',
          fontWeight: 'bold',
          color: damage.isHeal ? '#22c55e' : damage.isCrit ? '#ffd700' : '#ef4444',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          opacity,
          transform: damage.isCrit ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.2s'
        }}>
          {damage.isHeal ? '+' : '-'}{damage.value}
          {damage.isCrit && ' CRIT!'}
        </div>
      </Html>
    </group>
  );
}

// Spell effect component
function SpellEffectVisual({ effect }: { effect: SpellEffect }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0.1);
  const [opacity, setOpacity] = useState(1);

  useFrame((state) => {
    if (meshRef.current) {
      const age = (state.clock.elapsedTime * 1000 - effect.createdAt) / 1000;
      const newScale = Math.min(1, age * 3);
      setScale(newScale);
      setOpacity(Math.max(0, 1 - age / 0.8));
      meshRef.current.rotation.y = state.clock.elapsedTime * 5;
    }
  });

  const effectColors: Record<string, { color: string; emissive: string }> = {
    fire: { color: '#ff4400', emissive: '#ff2200' },
    ice: { color: '#00ccff', emissive: '#0088ff' },
    lightning: { color: '#ffff00', emissive: '#ffcc00' },
    holy: { color: '#ffd700', emissive: '#ffaa00' },
    physical: { color: '#ffffff', emissive: '#cccccc' }
  };

  const colors = effectColors[effect.type] || effectColors.physical;

  if (opacity <= 0) return null;

  return (
    <group position={effect.position}>
      <mesh ref={meshRef} scale={[scale, scale, scale]}>
        <torusGeometry args={[1, 0.1, 8, 32]} />
        <meshStandardMaterial
          color={colors.color}
          emissive={colors.emissive}
          emissiveIntensity={1}
          transparent
          opacity={opacity * 0.8}
        />
      </mesh>
      <Sparkles
        count={20}
        scale={2 * scale}
        size={3}
        speed={0.5}
        color={colors.color}
        opacity={opacity}
      />
    </group>
  );
}

// Hit flash effect
function HitFlash({ position, active }: { position: [number, number, number]; active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);

  useFrame(() => {
    if (active && scale < 1) {
      setScale(Math.min(1, scale + 0.2));
    } else if (!active && scale > 0) {
      setScale(Math.max(0, scale - 0.1));
    }
  });

  if (scale <= 0) return null;

  return (
    <mesh ref={meshRef} position={position} scale={[scale, scale, scale]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={2}
        transparent
        opacity={0.6 * (1 - scale)}
      />
    </mesh>
  );
}

// Main effects layer that subscribes to combat state
export function EffectsLayer() {
  const combatLog = useGameStore((state) => state.combatLog);
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [spellEffects, setSpellEffects] = useState<SpellEffect[]>([]);
  const [hitFlash, setHitFlash] = useState<{ position: [number, number, number]; active: boolean }>({
    position: [0, 0, 0],
    active: false
  });
  const lastLogLength = useRef(0);

  // Parse combat log for new damage events
  useEffect(() => {
    if (combatLog.length > lastLogLength.current) {
      const newEntries = combatLog.slice(lastLogLength.current);
      
      newEntries.forEach((entry, index) => {
        // Parse damage numbers
        const damageMatch = entry.match(/(\d+) damage/i);
        const healMatch = entry.match(/Healed for (\d+)/i);
        const critMatch = entry.toLowerCase().includes('crit');

        if (damageMatch) {
          const value = parseInt(damageMatch[1], 10);
          const isEnemy = entry.includes('to you');
          const position: [number, number, number] = isEnemy 
            ? [-3 + Math.random() * 0.5, 2, Math.random() * 0.5]
            : [3 + Math.random() * 0.5, 2, Math.random() * 0.5];

          setDamageNumbers(prev => [...prev, {
            id: Date.now() + index,
            value,
            position,
            isCrit: critMatch,
            isHeal: false,
            createdAt: Date.now()
          }]);

          // Trigger hit flash
          setHitFlash({ position, active: true });
          setTimeout(() => setHitFlash(prev => ({ ...prev, active: false })), 150);
        }

        if (healMatch) {
          const value = parseInt(healMatch[1], 10);
          setDamageNumbers(prev => [...prev, {
            id: Date.now() + index + 1000,
            value,
            position: [-3 + Math.random() * 0.5, 2.5, Math.random() * 0.5],
            isCrit: false,
            isHeal: true,
            createdAt: Date.now()
          }]);
        }

        // Parse spell effects
        if (entry.includes('⚡')) {
          const spellType = entry.toLowerCase().includes('fire') ? 'fire'
            : entry.toLowerCase().includes('ice') ? 'ice'
            : entry.toLowerCase().includes('lightning') ? 'lightning'
            : entry.toLowerCase().includes('holy') ? 'holy'
            : 'physical';

          setSpellEffects(prev => [...prev, {
            id: Date.now() + index + 2000,
            type: spellType,
            position: [3, 1, 0],
            createdAt: Date.now()
          }]);
        }
      });

      lastLogLength.current = combatLog.length;
    }
  }, [combatLog]);

  // Clean up old effects
  useFrame(() => {
    const now = Date.now();
    setDamageNumbers(prev => prev.filter(d => now - d.createdAt < 2000));
    setSpellEffects(prev => prev.filter(e => now - e.createdAt < 1000));
  });

  return (
    <group>
      {/* Damage numbers */}
      {damageNumbers.map(damage => (
        <FloatingDamage key={damage.id} damage={damage} />
      ))}

      {/* Spell effects */}
      {spellEffects.map(effect => (
        <SpellEffectVisual key={effect.id} effect={effect} />
      ))}

      {/* Hit flash */}
      <HitFlash position={hitFlash.position} active={hitFlash.active} />

      {/* Ambient combat particles */}
      <Sparkles
        count={50}
        scale={15}
        size={1}
        speed={0.2}
        color="#8b5cf6"
        opacity={0.3}
      />
    </group>
  );
}

export default EffectsLayer;
