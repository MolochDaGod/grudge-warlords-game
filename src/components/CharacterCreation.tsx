import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { RACES, CLASSES, type RaceType, type ClassType } from '../data/characters';

export default function CharacterCreation() {
  const { createNewCharacter, setScreen } = useGameStore();
  const [name, setName] = useState('');
  const [selectedRace, setSelectedRace] = useState<RaceType>('human');
  const [selectedClass, setSelectedClass] = useState<ClassType>('warrior');

  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (name.trim() && !isCreating) {
      setIsCreating(true);
      try {
        await createNewCharacter(name.trim(), selectedRace, selectedClass);
      } catch (error) {
        console.error('Failed to create character:', error);
      } finally {
        setIsCreating(false);
      }
    }
  };

  const raceIcons: Record<RaceType, string> = {
    human: '👤',
    orc: '👹',
    elf: '🧝',
    dwarf: '🧔',
    undead: '💀',
    demon: '😈'
  };

  const classIcons: Record<ClassType, string> = {
    warrior: '⚔️',
    mage: '🔮',
    ranger: '🏹',
    worg: '🐺'
  };

  return (
    <div className="character-creation">
      <h1>Create Your Hero</h1>

      <input
        type="text"
        className="name-input"
        placeholder="Enter character name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={20}
      />

      <div className="creation-grid">
        {/* Race Selection */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#8b5cf6' }}>Select Race</h3>
          <div className="selection-grid">
            {RACES.map((race) => (
              <div
                key={race.id}
                className={`selection-card ${selectedRace === race.id ? 'selected' : ''}`}
                onClick={() => setSelectedRace(race.id)}
              >
                <div className="icon">{raceIcons[race.id]}</div>
                <div className="name">{race.name}</div>
                <div className="description">{race.description}</div>
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#22c55e' }}>
                  {race.bonuses.map((b, i) => (
                    <div key={i}>{b}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Selection */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#8b5cf6' }}>Select Class</h3>
          <div className="selection-grid">
            {CLASSES.map((cls) => (
              <div
                key={cls.id}
                className={`selection-card class-${cls.id} ${selectedClass === cls.id ? 'selected' : ''}`}
                onClick={() => setSelectedClass(cls.id)}
              >
                <div className="icon">{classIcons[cls.id]}</div>
                <div className="name">{cls.name}</div>
                <div className="description">{cls.description}</div>
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#f59e0b' }}>
                  {cls.role}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Primary: {cls.primaryStats.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
        <button className="btn btn-secondary" onClick={() => setScreen('main_menu')}>
          Back
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleCreate}
          disabled={!name.trim() || isCreating}
        >
          {isCreating ? 'Creating...' : 'Begin Adventure'}
        </button>
      </div>
    </div>
  );
}
