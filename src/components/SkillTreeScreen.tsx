import { useGameStore } from '../store/gameStore';
import { SKILL_TREES, getAvailableSkills } from '../data/skillTrees';

export default function SkillTreeScreen() {
  const { character, skillPoints, unlockedSkills, unlockSkill, setScreen } = useGameStore();

  if (!character) return null;

  const skillTree = SKILL_TREES[character.classType];
  const availableSkills = getAvailableSkills(character.classType, character.level, unlockedSkills);

  const skillsByTier = skillTree.skills.reduce((acc, skill) => {
    if (!acc[skill.tier]) acc[skill.tier] = [];
    acc[skill.tier].push(skill);
    return acc;
  }, {} as Record<number, typeof skillTree.skills>);

  const handleUnlock = (skillId: string) => {
    if (skillPoints > 0 && availableSkills.some(s => s.id === skillId)) {
      unlockSkill(skillId);
    }
  };

  const isUnlocked = (skillId: string) => unlockedSkills.includes(skillId);
  const isAvailable = (skillId: string) => availableSkills.some(s => s.id === skillId);

  return (
    <div className="skill-tree-screen">
      <div className="skill-tree-header">
        <div>
          <h1>{skillTree.className} Skills</h1>
          <p style={{ color: '#94a3b8' }}>{skillTree.description}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="skill-points-display">
            Skill Points: <span style={{ color: skillPoints > 0 ? '#22c55e' : '#94a3b8' }}>{skillPoints}</span>
          </div>
          <button className="btn btn-secondary" style={{ marginTop: '12px' }} onClick={() => setScreen('game')}>
            ← Back to Game
          </button>
        </div>
      </div>

      <div className="skill-tiers">
        {Object.entries(skillsByTier).map(([tier, skills]) => (
          <div key={tier} className="skill-tier">
            <div className="tier-header">
              Tier {tier} {Number(tier) === 6 ? '- Ultimate' : ''}
              <span style={{ fontSize: '0.875rem', color: '#94a3b8', marginLeft: '12px' }}>
                (Unlocks at Level {skills[0]?.unlockLevel})
              </span>
            </div>
            <div className="tier-skills">
              {skills.map(skill => {
                const unlocked = isUnlocked(skill.id);
                const available = isAvailable(skill.id);
                const locked = !unlocked && !available;

                return (
                  <div
                    key={skill.id}
                    className={`skill-card ${unlocked ? 'unlocked' : ''} ${locked ? 'locked' : ''}`}
                    onClick={() => !unlocked && available && handleUnlock(skill.id)}
                  >
                    <div className="skill-icon">{skill.icon}</div>
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-type">{skill.type}</div>
                    <div className="skill-description">{skill.description}</div>

                    {skill.manaCost || skill.staminaCost ? (
                      <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                        {skill.manaCost ? `${skill.manaCost} Mana` : ''}
                        {skill.manaCost && skill.staminaCost ? ' • ' : ''}
                        {skill.staminaCost ? `${skill.staminaCost} Stamina` : ''}
                        {skill.cooldown ? ` • ${skill.cooldown}s CD` : ''}
                      </div>
                    ) : null}

                    <div style={{ marginTop: '8px', fontSize: '0.75rem' }}>
                      {skill.effects.map((effect, i) => (
                        <div key={i} style={{ color: '#22c55e' }}>
                          {effect.description}
                        </div>
                      ))}
                    </div>

                    {unlocked && (
                      <div style={{ 
                        marginTop: '12px', 
                        padding: '4px 8px', 
                        background: '#22c55e20', 
                        borderRadius: '4px',
                        color: '#22c55e',
                        fontSize: '0.75rem',
                        textAlign: 'center'
                      }}>
                        ✓ Unlocked
                      </div>
                    )}

                    {!unlocked && available && skillPoints > 0 && (
                      <div style={{ 
                        marginTop: '12px', 
                        padding: '4px 8px', 
                        background: '#8b5cf620', 
                        borderRadius: '4px',
                        color: '#8b5cf6',
                        fontSize: '0.75rem',
                        textAlign: 'center'
                      }}>
                        Click to Unlock
                      </div>
                    )}

                    {locked && skill.prerequisite && (
                      <div style={{ 
                        marginTop: '12px', 
                        fontSize: '0.75rem',
                        color: '#64748b'
                      }}>
                        Requires: {skillTree.skills.find(s => s.id === skill.prerequisite)?.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
