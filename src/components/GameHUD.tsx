import { useGameStore } from '../store/gameStore';
import { ZONES } from '../systems/enemies';

export default function GameHUD() {
  const { 
    character, 
    gold, 
    experience, 
    experienceToLevel,
    equippedWeapon,
    currentZone,
    skillPoints,
    setScreen,
    startCombat,
    healCharacter,
    restoreMana
  } = useGameStore();

  if (!character) return null;

  const zone = ZONES.find(z => z.id === currentZone);
  const hpPercent = (character.hp / character.maxHp) * 100;
  const manaPercent = (character.mana / character.maxMana) * 100;
  const staminaPercent = (character.stamina / character.maxStamina) * 100;
  const xpPercent = (experience / experienceToLevel) * 100;

  const handleRest = () => {
    healCharacter(Math.floor(character.maxHp * 0.5));
    restoreMana(Math.floor(character.maxMana * 0.5));
  };

  return (
    <div className="game-hud">
      {/* Player Panel - Left */}
      <div className="player-panel card">
        <h3 style={{ color: '#8b5cf6', marginBottom: '16px' }}>
          {character.name}
        </h3>
        <p style={{ color: '#94a3b8', marginBottom: '8px' }}>
          Level {character.level} {character.race.charAt(0).toUpperCase() + character.race.slice(1)} {character.classType.charAt(0).toUpperCase() + character.classType.slice(1)}
        </p>

        {/* Resource Bars */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>HP</span>
              <span>{character.hp}/{character.maxHp}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill progress-bar-hp" style={{ width: `${hpPercent}%` }} />
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Mana</span>
              <span>{character.mana}/{character.maxMana}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill progress-bar-mana" style={{ width: `${manaPercent}%` }} />
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Stamina</span>
              <span>{character.stamina}/{character.maxStamina}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill progress-bar-stamina" style={{ width: `${staminaPercent}%` }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>XP</span>
              <span>{experience}/{experienceToLevel}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill progress-bar-xp" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Equipped Weapon */}
        <div style={{ padding: '12px', background: '#151520', borderRadius: '8px', marginBottom: '16px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>WEAPON</div>
          {equippedWeapon ? (
            <>
              <div style={{ fontWeight: '600' }}>{equippedWeapon.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#ef4444' }}>
                {Math.floor((equippedWeapon.baseStats.ATK || 0) * 0.8 + (equippedWeapon.baseStats.MAG || 0) * 0.8)}-{Math.ceil((equippedWeapon.baseStats.ATK || 0) * 1.2 + (equippedWeapon.baseStats.MAG || 0) * 1.2)} DMG
              </div>
            </>
          ) : (
            <div style={{ color: '#64748b' }}>No weapon equipped</div>
          )}
        </div>

        {/* Gold */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>💰</span>
          <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f59e0b' }}>{gold}</span>
        </div>
      </div>

      {/* Main Area - Center */}
      <div className="main-area">
        <div className="zone-display card">
          <h2>{zone?.name || 'Unknown Zone'}</h2>
          <p style={{ color: '#94a3b8', marginTop: '8px' }}>
            Level Range: {zone?.levelRange[0]} - {zone?.levelRange[1]}
          </p>
          <p style={{ color: '#8b5cf6', fontSize: '0.875rem', marginTop: '4px' }}>
            {zone?.type}
          </p>
        </div>

        <div className="action-buttons">
          <button className="btn btn-danger" onClick={() => startCombat()}>
            ⚔️ Fight
          </button>
          <button className="btn btn-secondary" onClick={handleRest}>
            🏕️ Rest
          </button>
          <button className="btn btn-secondary" onClick={() => setScreen('world_map')}>
            🗺️ Travel
          </button>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '16px', color: '#f59e0b' }}>Adventure Log</h3>
          <p style={{ color: '#94a3b8' }}>
            You stand ready in {zone?.name}. Enemies lurk nearby...
          </p>
        </div>
      </div>

      {/* Stats Panel - Right */}
      <div className="stats-panel card">
        <h3 style={{ color: '#8b5cf6', marginBottom: '16px' }}>Attributes</h3>
        
        <div style={{ display: 'grid', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>STR</span>
            <span style={{ fontWeight: '600' }}>{character.attributes.STR}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>DEX</span>
            <span style={{ fontWeight: '600' }}>{character.attributes.DEX}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>INT</span>
            <span style={{ fontWeight: '600' }}>{character.attributes.INT}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>VIT</span>
            <span style={{ fontWeight: '600' }}>{character.attributes.VIT}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>WIS</span>
            <span style={{ fontWeight: '600' }}>{character.attributes.WIS}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>AGI</span>
            <span style={{ fontWeight: '600' }}>{character.attributes.AGI}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>END</span>
            <span style={{ fontWeight: '600' }}>{character.attributes.END}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>LCK</span>
            <span style={{ fontWeight: '600' }}>{character.attributes.LCK}</span>
          </div>
        </div>

        {character.attributePoints > 0 && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#22c55e20', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ color: '#22c55e' }}>
              {character.attributePoints} Attribute Points Available!
            </span>
          </div>
        )}

        <div style={{ marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '16px' }}>
          <h4 style={{ color: '#f59e0b', marginBottom: '12px' }}>Combat Stats</h4>
          <div style={{ fontSize: '0.875rem', display: 'grid', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Phys DMG</span>
              <span>{character.combatStats.physicalDamage}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Magic DMG</span>
              <span>{character.combatStats.magicalDamage}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Defense</span>
              <span>{character.combatStats.physicalDefense}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Crit %</span>
              <span>{character.combatStats.critChance}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setScreen('skills')}>
            📚 Skills {skillPoints > 0 && <span style={{ color: '#22c55e' }}>({skillPoints})</span>}
          </button>
          <button className="btn btn-secondary" onClick={() => setScreen('inventory')}>
            🎒 Inventory
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setScreen('main_menu')}>
            🏠 Menu
          </button>
        </div>
      </div>
    </div>
  );
}
