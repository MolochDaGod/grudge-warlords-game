import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ZONES } from '../systems/enemies';
import { SKILL_TREES } from '../data/skillTrees';
import { GameScene } from './3d';

export default function CombatScreen() {
  const [show3D, setShow3D] = useState(true);
  const {
    character,
    enemies,
    combatLog,
    playerCombatant,
    currentZone,
    unlockedSkills,
    skillCooldowns,
    playerAttack,
    useSkill,
    endCombat
  } = useGameStore();

  if (!character || !playerCombatant) return null;

  const zone = ZONES.find(z => z.id === currentZone);
  const currentEnemy = enemies[0];

  const playerHpPercent = (playerCombatant.hp / playerCombatant.maxHp) * 100;
  const enemyHpPercent = currentEnemy ? (currentEnemy.hp / currentEnemy.maxHp) * 100 : 0;

  const handleAttack = () => {
    playerAttack();
  };

  const handleFlee = () => {
    endCombat(false);
  };

  const classIcons: Record<string, string> = {
    warrior: '⚔️',
    mage: '🔮',
    ranger: '🏹',
    worg: '🐺'
  };

  return (
    <div className="combat-screen-3d">
      {/* 3D Scene Background */}
      {show3D && (
        <div className="combat-scene-3d">
          <GameScene mode="combat" />
        </div>
      )}

      {/* UI Overlay */}
      <div className="combat-ui-overlay">
        <div className="combat-header">
          <h1>⚔️ COMBAT - {zone?.name}</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <p style={{ color: '#94a3b8', margin: 0 }}>
              {enemies.length} {enemies.length === 1 ? 'enemy' : 'enemies'} remaining
            </p>
            <button
              onClick={() => setShow3D(!show3D)}
              style={{
                padding: '4px 8px',
                background: show3D ? '#8b5cf620' : '#1e1e2e',
                border: '1px solid #334155',
                borderRadius: '4px',
                color: '#94a3b8',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              {show3D ? '2D Mode' : '3D Mode'}
            </button>
          </div>
        </div>

        <div className="combat-arena">
        {/* Enemy Side */}
        <div className="combatant-card enemy">
          {currentEnemy ? (
            <>
              <div className="combatant-icon">
                {currentEnemy.enemyType === 'boss' ? '👹' :
                 currentEnemy.enemyType === 'elite' ? '⚔️' :
                 currentEnemy.enemyType === 'world_boss' ? '👑' :
                 currentEnemy.enemyType === 'divine_boss' ? '👼' : '👺'}
              </div>
              <div className="combatant-name">{currentEnemy.name}</div>
              <div className="combatant-level">Level {currentEnemy.level} {currentEnemy.enemyType}</div>

              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>HP</span>
                  <span>{currentEnemy.hp}/{currentEnemy.maxHp}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill progress-bar-hp" 
                    style={{ width: `${enemyHpPercent}%` }} 
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '16px' }}>
                <div>Physical DMG: {currentEnemy.stats.physicalDamage}</div>
                <div>Physical DEF: {currentEnemy.stats.physicalDefense}</div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '4rem' }}>🎉</div>
              <div style={{ fontSize: '1.5rem', marginTop: '16px', color: '#22c55e' }}>
                Victory!
              </div>
            </div>
          )}
        </div>

        {/* Player Side */}
        <div className="combatant-card player">
          <div className="combatant-icon">{classIcons[character.classType] || '👤'}</div>
          <div className="combatant-name">{character.name}</div>
          <div className="combatant-level">Level {character.level} {character.classType}</div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>HP</span>
              <span>{playerCombatant.hp}/{playerCombatant.maxHp}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill progress-bar-hp" 
                style={{ width: `${playerHpPercent}%` }} 
              />
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Mana</span>
              <span>{playerCombatant.mana}/{playerCombatant.maxMana}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill progress-bar-mana" 
                style={{ width: `${(playerCombatant.mana / playerCombatant.maxMana) * 100}%` }} 
              />
            </div>
          </div>

          <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '16px' }}>
            <div>Physical DMG: {playerCombatant.stats.physicalDamage}</div>
            <div>Crit Chance: {playerCombatant.stats.critChance}%</div>
          </div>
        </div>
      </div>

      {/* Combat Log */}
      <div className="combat-log">
        <h4 style={{ marginBottom: '12px', color: '#f59e0b' }}>Combat Log</h4>
        {combatLog.slice(-10).map((entry, index) => (
          <div 
            key={index} 
            className={`combat-log-entry ${
              entry.includes('damage') ? 'damage' : 
              entry.includes('heal') || entry.includes('Victory') ? 'heal' : ''
            }`}
          >
            {entry}
          </div>
        ))}
      </div>

      {/* Skills Bar */}
      {enemies.length > 0 && character && (
        <div className="skills-bar">
          <h4 style={{ marginBottom: '8px', color: '#8b5cf6' }}>⚡ Skills</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SKILL_TREES[character.classType].skills
              .filter(skill => unlockedSkills.includes(skill.id) && skill.type !== 'passive')
              .map(skill => {
                const cooldown = skillCooldowns[skill.id] || 0;
                const canAffordMana = !skill.manaCost || character.mana >= skill.manaCost;
                const canAffordStamina = !skill.staminaCost || character.stamina >= skill.staminaCost;
                const canUse = cooldown === 0 && canAffordMana && canAffordStamina;

                return (
                  <button
                    key={skill.id}
                    className={`skill-button ${canUse ? '' : 'disabled'}`}
                    onClick={() => canUse && useSkill(skill.id)}
                    disabled={!canUse}
                    title={`${skill.description}\n${skill.manaCost ? `Mana: ${skill.manaCost}` : ''} ${skill.staminaCost ? `Stamina: ${skill.staminaCost}` : ''}\nCooldown: ${skill.cooldown}s`}
                    style={{
                      padding: '8px 12px',
                      background: canUse ? '#8b5cf620' : '#1e1e2e',
                      border: `2px solid ${canUse ? '#8b5cf6' : '#334155'}`,
                      borderRadius: '8px',
                      color: canUse ? '#fff' : '#64748b',
                      cursor: canUse ? 'pointer' : 'not-allowed',
                      position: 'relative',
                      minWidth: '80px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '1.25rem' }}>{skill.icon}</div>
                    <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>{skill.name}</div>
                    {cooldown > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.8)',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#f59e0b',
                        fontWeight: 'bold'
                      }}>
                        {cooldown}
                      </div>
                    )}
                    {!canAffordMana && cooldown === 0 && (
                      <div style={{ fontSize: '0.6rem', color: '#3b82f6' }}>No Mana</div>
                    )}
                    {!canAffordStamina && canAffordMana && cooldown === 0 && (
                      <div style={{ fontSize: '0.6rem', color: '#22c55e' }}>No Stamina</div>
                    )}
                  </button>
                );
              })}
            {unlockedSkills.filter(id => {
              const skill = SKILL_TREES[character.classType].skills.find(s => s.id === id);
              return skill && skill.type !== 'passive';
            }).length === 0 && (
              <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                No active skills learned. Visit Skills menu to unlock abilities!
              </div>
            )}
          </div>
        </div>
      )}

        {/* Combat Actions */}
        <div className="combat-actions">
          {enemies.length > 0 ? (
            <>
              <button className="btn btn-danger" onClick={handleAttack}>
                ⚔️ Basic Attack
              </button>
              <button className="btn btn-secondary" disabled>
                🧪 Items
              </button>
              <button className="btn btn-secondary" onClick={handleFlee}>
                🏃 Flee
              </button>
            </>
          ) : (
            <button className="btn btn-success" onClick={() => endCombat(true)}>
              ✨ Collect Rewards
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
