import { useGameStore } from '../store/gameStore';
import { WEAPONS } from '../data/weapons';

export default function InventoryScreen() {
  const { 
    character, 
    inventory, 
    equippedWeapon, 
    gold,
    equipWeapon,
    unequipWeapon,
    setScreen 
  } = useGameStore();

  if (!character) return null;

  // Get available weapons from inventory
  const weaponItems = inventory.filter(item => item.type === 'weapon');
  const materialItems = inventory.filter(item => item.type === 'material');
  const consumableItems = inventory.filter(item => item.type === 'consumable');

  const handleEquipWeapon = (weaponId: string) => {
    equipWeapon(weaponId);
  };

  return (
    <div className="inventory-screen">
      <div className="inventory-header">
        <h1>🎒 Inventory</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ color: '#f59e0b', fontSize: '1.25rem' }}>
            💰 {gold} Gold
          </div>
          <button className="btn btn-secondary" onClick={() => setScreen('game')}>
            ← Back to Game
          </button>
        </div>
      </div>

      <div className="inventory-grid">
        {/* Equipment Panel */}
        <div className="card equipment-panel">
          <h3 style={{ color: '#8b5cf6', marginBottom: '16px' }}>⚔️ Equipment</h3>
          
          <div className="equipment-slots">
            <div className="equipment-slot">
              <div className="slot-label">Main Hand</div>
              <div className="slot-item">
                {equippedWeapon ? (
                  <div className="equipped-item">
                    <span className="item-icon">{equippedWeapon.icon}</span>
                    <div className="item-info">
                      <div className="item-name">{equippedWeapon.name}</div>
                      <div className="item-stats">
                        {equippedWeapon.baseStats.ATK && <span>ATK: {equippedWeapon.baseStats.ATK}</span>}
                        {equippedWeapon.baseStats.MAG && <span>MAG: {equippedWeapon.baseStats.MAG}</span>}
                      </div>
                      <div className="item-tier">Tier {equippedWeapon.tier}</div>
                    </div>
                    <button 
                      className="btn-unequip" 
                      onClick={() => unequipWeapon()}
                      title="Unequip"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="empty-slot">Empty</div>
                )}
              </div>
            </div>

            <div className="equipment-slot">
              <div className="slot-label">Off Hand</div>
              <div className="slot-item">
                <div className="empty-slot">Empty</div>
              </div>
            </div>

            <div className="equipment-slot">
              <div className="slot-label">Head</div>
              <div className="slot-item">
                <div className="empty-slot">Empty</div>
              </div>
            </div>

            <div className="equipment-slot">
              <div className="slot-label">Chest</div>
              <div className="slot-item">
                <div className="empty-slot">Empty</div>
              </div>
            </div>

            <div className="equipment-slot">
              <div className="slot-label">Legs</div>
              <div className="slot-item">
                <div className="empty-slot">Empty</div>
              </div>
            </div>

            <div className="equipment-slot">
              <div className="slot-label">Feet</div>
              <div className="slot-item">
                <div className="empty-slot">Empty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bag Panel */}
        <div className="card bag-panel">
          <h3 style={{ color: '#f59e0b', marginBottom: '16px' }}>🎒 Bag</h3>
          
          {inventory.length === 0 ? (
            <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
              Your bag is empty. Defeat enemies to collect loot!
            </div>
          ) : (
            <div className="bag-sections">
              {/* Weapons */}
              {weaponItems.length > 0 && (
                <div className="bag-section">
                  <h4>Weapons ({weaponItems.length})</h4>
                  <div className="item-grid">
                    {weaponItems.map(item => {
                      const weapon = WEAPONS.find(w => w.id === item.itemId);
                      return (
                        <div key={item.id} className="bag-item weapon">
                          <span className="item-icon">{weapon?.icon || '⚔️'}</span>
                          <div className="item-name">{item.name}</div>
                          {weapon && (
                            <div className="item-stats-mini">
                              {weapon.baseStats.ATK && `ATK ${weapon.baseStats.ATK}`}
                              {weapon.baseStats.MAG && `MAG ${weapon.baseStats.MAG}`}
                            </div>
                          )}
                          <button 
                            className="btn-equip"
                            onClick={() => handleEquipWeapon(item.itemId)}
                          >
                            Equip
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Materials */}
              {materialItems.length > 0 && (
                <div className="bag-section">
                  <h4>Materials ({materialItems.length})</h4>
                  <div className="item-grid">
                    {materialItems.map(item => (
                      <div key={item.id} className="bag-item material">
                        <span className="item-icon">📦</span>
                        <div className="item-name">{item.name}</div>
                        <div className="item-quantity">x{item.quantity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consumables */}
              {consumableItems.length > 0 && (
                <div className="bag-section">
                  <h4>Consumables ({consumableItems.length})</h4>
                  <div className="item-grid">
                    {consumableItems.map(item => (
                      <div key={item.id} className="bag-item consumable">
                        <span className="item-icon">🧪</span>
                        <div className="item-name">{item.name}</div>
                        <div className="item-quantity">x{item.quantity}</div>
                        <button className="btn-use">Use</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Character Stats Summary */}
      <div className="card stats-summary">
        <h3 style={{ color: '#22c55e', marginBottom: '16px' }}>📊 Combat Stats</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Physical DMG</span>
            <span className="stat-value">{character.combatStats.physicalDamage}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Magic DMG</span>
            <span className="stat-value">{character.combatStats.magicalDamage}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Physical DEF</span>
            <span className="stat-value">{character.combatStats.physicalDefense}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Magic DEF</span>
            <span className="stat-value">{character.combatStats.magicalDefense}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Crit Chance</span>
            <span className="stat-value">{character.combatStats.critChance.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Crit Damage</span>
            <span className="stat-value">{character.combatStats.critDamage}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Block Chance</span>
            <span className="stat-value">{character.combatStats.blockChance.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Attack Speed</span>
            <span className="stat-value">{character.combatStats.attackSpeed}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
