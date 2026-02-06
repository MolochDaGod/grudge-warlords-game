import { useGameStore } from '../store/gameStore';
import { ZONES } from '../systems/enemies';

export default function WorldMap() {
  const { character, currentZone, unlockedZones, travelToZone, unlockZone, setScreen } = useGameStore();

  if (!character) return null;

  const zoneIcons: Record<string, string> = {
    bandit_camp: '🏕️',
    goblin_cave: '🕳️',
    orc_fort: '🏰',
    castle: '🏯',
    fortress: '⚔️',
    arena: '🏟️',
    magic_castle: '🔮',
    mithril_mine: '⛏️',
    deep_fortress: '🗡️',
    dragon_gate: '🐉',
    titan_hall: '👑',
    ancient_ruins: '🏛️',
    star_temple: '⭐',
    celestial_gate: '✨',
    divine_arena: '👼',
    holy_sanctum: '🌟',
    ocean: '🌊'
  };

  const handleTravel = (zoneId: string) => {
    const zone = ZONES.find(z => z.id === zoneId);
    if (!zone) return;

    // Check if zone is unlocked
    if (unlockedZones.includes(zoneId)) {
      travelToZone(zoneId);
      setScreen('game');
    } else {
      // Check if player can unlock this zone based on level
      const minLevel = zone.levelRange[0];
      if (character.level >= minLevel) {
        unlockZone(zoneId);
        travelToZone(zoneId);
        setScreen('game');
      }
    }
  };

  const canUnlock = (zoneId: string) => {
    const zone = ZONES.find(z => z.id === zoneId);
    if (!zone) return false;
    return character.level >= zone.levelRange[0];
  };

  return (
    <div className="world-map">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>🗺️ World Map</h1>
        <button className="btn btn-secondary" onClick={() => setScreen('game')}>
          ← Back to Game
        </button>
      </div>

      <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '30px' }}>
        Current Location: <span style={{ color: '#22c55e' }}>
          {ZONES.find(z => z.id === currentZone)?.name}
        </span>
        {' | '}Your Level: <span style={{ color: '#8b5cf6' }}>{character.level}</span>
      </p>

      <div className="zones-grid">
        {ZONES.map(zone => {
          const isUnlocked = unlockedZones.includes(zone.id);
          const isCurrent = currentZone === zone.id;
          const canAccess = isUnlocked || canUnlock(zone.id);
          const isLocked = !canAccess;
          const levelTooHigh = zone.levelRange[0] > character.level + 5;

          return (
            <div
              key={zone.id}
              className={`zone-card ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
              onClick={() => !isLocked && handleTravel(zone.id)}
              style={{
                borderColor: levelTooHigh && !isUnlocked ? '#ef4444' : undefined
              }}
            >
              <div className="zone-icon">{zoneIcons[zone.id] || '📍'}</div>
              <div className="zone-name">{zone.name}</div>
              <div className="zone-level">
                Level {zone.levelRange[0]} - {zone.levelRange[1]}
              </div>
              <div className="zone-type">{zone.type}</div>

              {isCurrent && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '4px 8px', 
                  background: '#22c55e20', 
                  borderRadius: '4px',
                  color: '#22c55e',
                  fontSize: '0.75rem',
                  textAlign: 'center'
                }}>
                  📍 You are here
                </div>
              )}

              {!isUnlocked && canAccess && !isCurrent && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '4px 8px', 
                  background: '#8b5cf620', 
                  borderRadius: '4px',
                  color: '#8b5cf6',
                  fontSize: '0.75rem',
                  textAlign: 'center'
                }}>
                  🔓 Click to Unlock
                </div>
              )}

              {isLocked && (
                <div style={{ 
                  marginTop: '12px', 
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  🔒 Requires Level {zone.levelRange[0]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        background: '#1e1e2e', 
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#f59e0b', marginBottom: '12px' }}>🚢 Ocean Travel</h3>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          Unlock boats to explore the vast ocean and discover hidden islands!
        </p>
        <button className="btn btn-secondary" disabled>
          Coming Soon - Boat Combat
        </button>
      </div>
    </div>
  );
}
