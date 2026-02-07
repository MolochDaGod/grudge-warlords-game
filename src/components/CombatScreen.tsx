import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ZONES } from '../systems/enemies';
import { SKILL_TREES } from '../data/skillTrees';
import { GameScene } from './3d';
import './CombatScreen.css';

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
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>{enemies.length} {enemies.length === 1 ? 'enemy' : 'enemies'}</span>
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

          <div className="stat-text">
            <span>HP</span>
            <span>{currentEnemy.hp}/{currentEnemy.maxHp}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill progress-bar-hp" 
              style={{ width: `${enemyHpPercent}%` }} 
            />
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
          <div className="combatant-name">{character.name}</div>
          <div className="combatant-level">Lv.{character.level} {character.classType}</div>

          <div className="stat-text">
            <span>HP</span>
            <span>{playerCombatant.hp}/{playerCombatant.maxHp}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill progress-bar-hp" 
              style={{ width: `${playerHpPercent}%` }} 
            />
          </div>

          <div className="stat-text">
            <span>MP</span>
            <span>{playerCombatant.mana}/{playerCombatant.maxMana}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill progress-bar-mana" 
              style={{ width: `${(playerCombatant.mana / playerCombatant.maxMana) * 100}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Combat Log */}
      <div className="combat-log">
        {combatLog.slice(-8).map((entry, index) => (
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
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                    title={`${skill.name}\n${skill.description}\n${skill.manaCost ? `Mana: ${skill.manaCost}` : ''} ${skill.staminaCost ? `Stamina: ${skill.staminaCost}` : ''}\nCooldown: ${skill.cooldown}s`}
                  >
                    <div style={{ fontSize: '1.5rem' }}>{skill.icon}</div>
                    {cooldown > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.9)',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fbbf24',
                        fontWeight: '700',
                        fontSize: '0.75rem'
                      }}>
                        {cooldown}
                      </div>
                    )}
                  </button>
                );
              })}
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
