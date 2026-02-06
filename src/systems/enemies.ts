// Grudge Warlords - Enemy AI System
// Enemies based on zones and drop sources from armor_with_drops.csv

import type { ClassType, CombatStats, ElementalResistances } from '../data/characters';
import type { Combatant, Ability } from './combat';

export type EnemyType = 'normal' | 'elite' | 'boss' | 'world_boss' | 'divine_boss';

export interface Enemy {
  id: string;
  name: string;
  type: EnemyType;
  level: number;
  zone: string;
  dropNode: string;
  baseHp: number;
  baseMana: number;
  baseStamina: number;
  baseStats: Partial<CombatStats>;
  resistances: Partial<ElementalResistances>;
  abilities: string[];
  lootTable: LootDrop[];
  aiType: 'aggressive' | 'defensive' | 'support' | 'berserker';
  icon: string;
}

export interface LootDrop {
  itemId: string;
  dropRate: number; // Percentage (0-100)
  minQuantity: number;
  maxQuantity: number;
}

export interface EnemyInstance extends Combatant {
  enemyType: EnemyType;
  zone: string;
  lootTable: LootDrop[];
  aiType: 'aggressive' | 'defensive' | 'support' | 'berserker';
  abilities: Ability[];
  abilityCooldowns: Record<string, number>;
  targetPriority: 'lowest_hp' | 'highest_threat' | 'healers' | 'random';
}

// Zone definitions
export const ZONES = [
  { id: 'bandit_camp', name: 'Bandit Camp', levelRange: [1, 5], type: 'Combat' },
  { id: 'goblin_cave', name: 'Goblin Cave', levelRange: [1, 5], type: 'Combat' },
  { id: 'orc_fort', name: 'Orc Fort', levelRange: [3, 8], type: 'Combat' },
  { id: 'castle', name: 'Castle', levelRange: [5, 10], type: 'Combat' },
  { id: 'fortress', name: 'Fortress', levelRange: [6, 12], type: 'Combat|Boss' },
  { id: 'arena', name: 'Arena', levelRange: [6, 12], type: 'Combat|Boss' },
  { id: 'magic_castle', name: 'Magic Castle', levelRange: [11, 15], type: 'Combat|Boss' },
  { id: 'mithril_mine', name: 'Mithril Mine', levelRange: [11, 15], type: 'Combat|Boss' },
  { id: 'deep_fortress', name: 'Deep Fortress', levelRange: [16, 18], type: 'Combat|Boss' },
  { id: 'dragon_gate', name: 'Dragon Gate', levelRange: [16, 18], type: 'Combat|Boss' },
  { id: 'titan_hall', name: 'Titan Hall', levelRange: [18, 20], type: 'Raid Boss' },
  { id: 'ancient_ruins', name: 'Ancient Ruins', levelRange: [18, 20], type: 'Raid Boss' },
  { id: 'star_temple', name: 'Star Temple', levelRange: [20, 20], type: 'World Boss' },
  { id: 'celestial_gate', name: 'Celestial Gate', levelRange: [20, 20], type: 'World Boss' },
  { id: 'divine_arena', name: 'Divine Arena', levelRange: [20, 20], type: 'Divine Boss' },
  { id: 'holy_sanctum', name: 'Holy Sanctum', levelRange: [20, 20], type: 'Divine Boss' },
  { id: 'ocean', name: 'Ocean', levelRange: [1, 20], type: 'Boat Combat' },
];

// Enemy templates based on drop sources
export const ENEMY_TEMPLATES: Enemy[] = [
  // Tier 1 enemies (Level 1-5)
  {
    id: 'goblin',
    name: 'Goblin',
    type: 'normal',
    level: 1,
    zone: 'goblin_cave',
    dropNode: 'Goblin Cave',
    baseHp: 50,
    baseMana: 20,
    baseStamina: 40,
    baseStats: { physicalDamage: 8, physicalDefense: 5, critChance: 5 },
    resistances: {},
    abilities: ['basic_attack', 'quick_stab'],
    lootTable: [
      { itemId: 'copper-helm', dropRate: 15, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'gold', dropRate: 100, minQuantity: 5, maxQuantity: 15 }
    ],
    aiType: 'aggressive',
    icon: '👺'
  },
  {
    id: 'bandit',
    name: 'Bandit',
    type: 'normal',
    level: 2,
    zone: 'bandit_camp',
    dropNode: 'Bandit Camp',
    baseHp: 65,
    baseMana: 15,
    baseStamina: 50,
    baseStats: { physicalDamage: 12, physicalDefense: 8, accuracy: 85 },
    resistances: {},
    abilities: ['basic_attack', 'power_strike'],
    lootTable: [
      { itemId: 'copper-chestplate', dropRate: 15, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'gold', dropRate: 100, minQuantity: 8, maxQuantity: 20 }
    ],
    aiType: 'aggressive',
    icon: '🥷'
  },
  {
    id: 'bandit_leader',
    name: 'Bandit Leader',
    type: 'elite',
    level: 5,
    zone: 'bandit_camp',
    dropNode: 'Bandit Hideout',
    baseHp: 150,
    baseMana: 30,
    baseStamina: 80,
    baseStats: { physicalDamage: 20, physicalDefense: 15, critChance: 10, critDamage: 160 },
    resistances: { physical: 10 },
    abilities: ['basic_attack', 'power_strike', 'whirlwind'],
    lootTable: [
      { itemId: 'copper-chestplate', dropRate: 25, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'gold', dropRate: 100, minQuantity: 20, maxQuantity: 50 }
    ],
    aiType: 'berserker',
    icon: '⚔️'
  },

  // Tier 2 enemies (Level 5-10)
  {
    id: 'orc_warrior',
    name: 'Orc Warrior',
    type: 'normal',
    level: 5,
    zone: 'orc_fort',
    dropNode: 'Orc Fort',
    baseHp: 120,
    baseMana: 20,
    baseStamina: 70,
    baseStats: { physicalDamage: 25, physicalDefense: 18, blockChance: 10 },
    resistances: { physical: 5 },
    abilities: ['basic_attack', 'cleave', 'war_cry'],
    lootTable: [
      { itemId: 'iron-helm', dropRate: 8, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'gold', dropRate: 100, minQuantity: 15, maxQuantity: 35 }
    ],
    aiType: 'aggressive',
    icon: '👹'
  },
  {
    id: 'knight',
    name: 'Knight',
    type: 'normal',
    level: 7,
    zone: 'castle',
    dropNode: 'Castle',
    baseHp: 180,
    baseMana: 25,
    baseStamina: 100,
    baseStats: { physicalDamage: 30, physicalDefense: 35, blockChance: 25, blockReduction: 40 },
    resistances: { physical: 15 },
    abilities: ['basic_attack', 'shield_bash', 'defensive_stance'],
    lootTable: [
      { itemId: 'iron-chestplate', dropRate: 8, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'gold', dropRate: 100, minQuantity: 25, maxQuantity: 50 }
    ],
    aiType: 'defensive',
    icon: '🛡️'
  },

  // Tier 3 enemies (Level 10-15)
  {
    id: 'elite_guard',
    name: 'Elite Guard',
    type: 'elite',
    level: 10,
    zone: 'fortress',
    dropNode: 'Fortress',
    baseHp: 300,
    baseMana: 50,
    baseStamina: 120,
    baseStats: { physicalDamage: 45, physicalDefense: 50, critChance: 15, blockChance: 30 },
    resistances: { physical: 20, fire: 10 },
    abilities: ['basic_attack', 'power_strike', 'shield_wall', 'taunt'],
    lootTable: [
      { itemId: 'steel-helm', dropRate: 5, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'gold', dropRate: 100, minQuantity: 40, maxQuantity: 80 }
    ],
    aiType: 'defensive',
    icon: '⚔️'
  },
  {
    id: 'arena_champion',
    name: 'Arena Champion',
    type: 'boss',
    level: 12,
    zone: 'arena',
    dropNode: 'Arena',
    baseHp: 800,
    baseMana: 100,
    baseStamina: 200,
    baseStats: { physicalDamage: 65, physicalDefense: 45, critChance: 20, critDamage: 180, attackSpeed: 120 },
    resistances: { physical: 25, fire: 15, ice: 15 },
    abilities: ['basic_attack', 'execute', 'whirlwind', 'berserker_rage'],
    lootTable: [
      { itemId: 'steel-chestplate', dropRate: 15, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'gold', dropRate: 100, minQuantity: 100, maxQuantity: 200 }
    ],
    aiType: 'berserker',
    icon: '🏆'
  },

  // Tier 4-5 enemies (Level 15-20)
  {
    id: 'mithril_golem',
    name: 'Mithril Golem',
    type: 'elite',
    level: 15,
    zone: 'mithril_mine',
    dropNode: 'Mithril Mine',
    baseHp: 600,
    baseMana: 80,
    baseStamina: 150,
    baseStats: { physicalDamage: 70, physicalDefense: 80, magicalDefense: 60 },
    resistances: { physical: 40, arcane: 20 },
    abilities: ['basic_attack', 'ground_slam', 'earthquake'],
    lootTable: [
      { itemId: 'mithril-helm', dropRate: 4, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'gold', dropRate: 100, minQuantity: 80, maxQuantity: 150 }
    ],
    aiType: 'aggressive',
    icon: '🗿'
  },
  {
    id: 'dragon_knight',
    name: 'Dragon Knight',
    type: 'boss',
    level: 18,
    zone: 'dragon_gate',
    dropNode: 'Dragon Gate',
    baseHp: 1500,
    baseMana: 200,
    baseStamina: 300,
    baseStats: { physicalDamage: 100, physicalDefense: 70, magicalDamage: 50, critChance: 25 },
    resistances: { physical: 30, fire: 50, ice: -20 },
    abilities: ['basic_attack', 'dragon_breath', 'flame_charge', 'burning_aura'],
    lootTable: [
      { itemId: 'adamantine-helm', dropRate: 3, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'gold', dropRate: 100, minQuantity: 150, maxQuantity: 300 }
    ],
    aiType: 'berserker',
    icon: '🐉'
  },

  // Tier 6-8 Bosses (Level 20)
  {
    id: 'titan_guard',
    name: 'Titan Guard',
    type: 'world_boss',
    level: 20,
    zone: 'titan_hall',
    dropNode: 'Titan Hall',
    baseHp: 5000,
    baseMana: 500,
    baseStamina: 600,
    baseStats: { physicalDamage: 150, physicalDefense: 120, magicalDefense: 100, critChance: 20 },
    resistances: { physical: 50, fire: 30, ice: 30, lightning: 30 },
    abilities: ['basic_attack', 'titan_smash', 'earthquake', 'summon_minions', 'rage'],
    lootTable: [
      { itemId: 'orichalcum-helm', dropRate: 2.5, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'gold', dropRate: 100, minQuantity: 500, maxQuantity: 1000 }
    ],
    aiType: 'berserker',
    icon: '👑'
  },
  {
    id: 'celestial_knight',
    name: 'Celestial Knight',
    type: 'world_boss',
    level: 20,
    zone: 'star_temple',
    dropNode: 'Star Temple',
    baseHp: 8000,
    baseMana: 800,
    baseStamina: 800,
    baseStats: { physicalDamage: 180, physicalDefense: 150, magicalDefense: 150, critChance: 30, critDamage: 200 },
    resistances: { physical: 50, holy: 75, arcane: 50 },
    abilities: ['basic_attack', 'divine_strike', 'celestial_beam', 'invulnerability', 'mass_heal'],
    lootTable: [
      { itemId: 'starmetal-helm', dropRate: 2, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'gold', dropRate: 100, minQuantity: 1000, maxQuantity: 2000 }
    ],
    aiType: 'support',
    icon: '⭐'
  },
  {
    id: 'divine_warrior',
    name: 'Divine Warrior',
    type: 'divine_boss',
    level: 20,
    zone: 'divine_arena',
    dropNode: 'Divine Arena',
    baseHp: 15000,
    baseMana: 1500,
    baseStamina: 1200,
    baseStats: { physicalDamage: 250, physicalDefense: 200, magicalDefense: 200, critChance: 40, critDamage: 250 },
    resistances: { physical: 60, fire: 50, ice: 50, lightning: 50, arcane: 50, holy: 75, nature: 50 },
    abilities: ['basic_attack', 'divine_judgment', 'wrath_of_gods', 'invulnerability', 'resurrection', 'ultimate_form'],
    lootTable: [
      { itemId: 'divine-helm', dropRate: 1, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'gold', dropRate: 100, minQuantity: 5000, maxQuantity: 10000 }
    ],
    aiType: 'berserker',
    icon: '👼'
  },

  // Ocean/Boat enemies
  {
    id: 'pirate',
    name: 'Pirate',
    type: 'normal',
    level: 5,
    zone: 'ocean',
    dropNode: 'Ocean',
    baseHp: 100,
    baseMana: 30,
    baseStamina: 80,
    baseStats: { physicalDamage: 22, physicalDefense: 12, accuracy: 90 },
    resistances: { ice: -10 },
    abilities: ['basic_attack', 'cannon_shot', 'boarding_action'],
    lootTable: [
      { itemId: 'gold', dropRate: 100, minQuantity: 30, maxQuantity: 60 }
    ],
    aiType: 'aggressive',
    icon: '🏴‍☠️'
  },
  {
    id: 'sea_monster',
    name: 'Sea Monster',
    type: 'boss',
    level: 15,
    zone: 'ocean',
    dropNode: 'Deep Ocean',
    baseHp: 2000,
    baseMana: 300,
    baseStamina: 400,
    baseStats: { physicalDamage: 90, physicalDefense: 60, magicalDamage: 40 },
    resistances: { ice: 30, lightning: -30 },
    abilities: ['basic_attack', 'tentacle_slam', 'tidal_wave', 'ink_cloud'],
    lootTable: [
      { itemId: 'gold', dropRate: 100, minQuantity: 200, maxQuantity: 400 }
    ],
    aiType: 'aggressive',
    icon: '🦑'
  }
];

// Create an enemy instance from template
export function createEnemyInstance(template: Enemy, levelModifier: number = 0): EnemyInstance {
  const level = Math.max(1, template.level + levelModifier);
  const scaleFactor = 1 + (levelModifier * 0.1);

  const baseStats: CombatStats = {
    physicalDamage: Math.floor((template.baseStats.physicalDamage || 10) * scaleFactor),
    magicalDamage: Math.floor((template.baseStats.magicalDamage || 5) * scaleFactor),
    physicalDefense: Math.floor((template.baseStats.physicalDefense || 10) * scaleFactor),
    magicalDefense: Math.floor((template.baseStats.magicalDefense || 5) * scaleFactor),
    critChance: template.baseStats.critChance || 5,
    critDamage: template.baseStats.critDamage || 150,
    blockChance: template.baseStats.blockChance || 0,
    blockReduction: template.baseStats.blockReduction || 20,
    attackSpeed: template.baseStats.attackSpeed || 100,
    accuracy: template.baseStats.accuracy || 80,
    evasion: template.baseStats.evasion || 5
  };

  const resistances: ElementalResistances = {
    fire: template.resistances.fire || 0,
    ice: template.resistances.ice || 0,
    lightning: template.resistances.lightning || 0,
    arcane: template.resistances.arcane || 0,
    holy: template.resistances.holy || 0,
    nature: template.resistances.nature || 0,
    physical: template.resistances.physical || 0
  };

  const maxHp = Math.floor(template.baseHp * scaleFactor);
  const maxMana = Math.floor(template.baseMana * scaleFactor);
  const maxStamina = Math.floor(template.baseStamina * scaleFactor);

  return {
    id: `${template.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    classType: 'warrior' as ClassType, // Default class for AI purposes
    level,
    hp: maxHp,
    maxHp,
    mana: maxMana,
    maxMana,
    stamina: maxStamina,
    maxStamina,
    stats: baseStats,
    resistances,
    buffs: [],
    debuffs: [],
    comboState: {
      comboCounter: 0,
      lastAbilityUsed: null,
      canCombo: false,
      counterTarget: null
    },
    isPlayer: false,
    enemyType: template.type,
    zone: template.zone,
    lootTable: template.lootTable,
    aiType: template.aiType,
    abilities: getEnemyAbilities(template.abilities),
    abilityCooldowns: {},
    targetPriority: template.aiType === 'aggressive' ? 'lowest_hp' : 
                     template.aiType === 'support' ? 'healers' : 
                     template.aiType === 'berserker' ? 'highest_threat' : 'random'
  };
}

// Get enemy abilities
function getEnemyAbilities(abilityIds: string[]): Ability[] {
  return abilityIds.map(id => ENEMY_ABILITIES[id] || ENEMY_ABILITIES.basic_attack);
}

// Enemy ability definitions
export const ENEMY_ABILITIES: Record<string, Ability> = {
  basic_attack: {
    id: 'basic_attack',
    name: 'Attack',
    description: 'A basic attack',
    icon: '⚔️',
    type: 'active',
    damageMultiplier: 1.0,
    scaling: { stat: 'STR', ratio: 0.5 },
    cooldown: 0,
    manaCost: 0,
    staminaCost: 5,
    effects: []
  },
  quick_stab: {
    id: 'quick_stab',
    name: 'Quick Stab',
    description: 'A fast stabbing attack',
    icon: '🗡️',
    type: 'active',
    damageMultiplier: 0.8,
    scaling: { stat: 'DEX', ratio: 0.6 },
    cooldown: 2,
    manaCost: 0,
    staminaCost: 8,
    effects: ['Fast attack']
  },
  power_strike: {
    id: 'power_strike',
    name: 'Power Strike',
    description: 'A powerful heavy attack',
    icon: '💥',
    type: 'active',
    damageMultiplier: 1.5,
    scaling: { stat: 'STR', ratio: 0.7 },
    cooldown: 4,
    manaCost: 0,
    staminaCost: 15,
    effects: ['+50% damage']
  },
  cleave: {
    id: 'cleave',
    name: 'Cleave',
    description: 'Hits multiple targets',
    icon: '🪓',
    type: 'active',
    damageMultiplier: 0.7,
    scaling: { stat: 'STR', ratio: 0.5 },
    cooldown: 5,
    manaCost: 0,
    staminaCost: 20,
    effects: ['AoE damage']
  },
  shield_bash: {
    id: 'shield_bash',
    name: 'Shield Bash',
    description: 'Stuns target briefly',
    icon: '🛡️',
    type: 'active',
    damageMultiplier: 0.5,
    scaling: { stat: 'STR', ratio: 0.3 },
    cooldown: 6,
    manaCost: 0,
    staminaCost: 15,
    effects: ['Stun 1s']
  },
  whirlwind: {
    id: 'whirlwind',
    name: 'Whirlwind',
    description: 'Spinning attack hitting all nearby enemies',
    icon: '🌀',
    type: 'active',
    damageMultiplier: 1.2,
    scaling: { stat: 'STR', ratio: 0.6 },
    cooldown: 8,
    manaCost: 0,
    staminaCost: 30,
    effects: ['AoE damage', 'Spin attack']
  },
  dragon_breath: {
    id: 'dragon_breath',
    name: 'Dragon Breath',
    description: 'Breathes fire in a cone',
    icon: '🔥',
    type: 'active',
    element: 'fire',
    damageMultiplier: 1.8,
    scaling: { stat: 'INT', ratio: 0.8 },
    cooldown: 6,
    manaCost: 50,
    staminaCost: 0,
    effects: ['Fire AoE', 'Burning 3s']
  },
  divine_judgment: {
    id: 'divine_judgment',
    name: 'Divine Judgment',
    description: 'Calls down holy wrath',
    icon: '⚡',
    type: 'ultimate',
    element: 'holy',
    damageMultiplier: 3.0,
    scaling: { stat: 'INT', ratio: 1.0 },
    cooldown: 15,
    manaCost: 200,
    staminaCost: 0,
    effects: ['Massive holy damage', 'Cannot be blocked']
  }
};

// AI decision making
export function selectEnemyAction(enemy: EnemyInstance, targets: Combatant[]): { ability: Ability; target: Combatant } | null {
  if (targets.length === 0) return null;

  // Get available abilities (not on cooldown)
  const availableAbilities = enemy.abilities.filter(ability => {
    const cooldown = enemy.abilityCooldowns[ability.id] || 0;
    return cooldown <= 0 && enemy.mana >= ability.manaCost && enemy.stamina >= ability.staminaCost;
  });

  if (availableAbilities.length === 0) {
    // Fall back to basic attack if all abilities on cooldown
    availableAbilities.push(ENEMY_ABILITIES.basic_attack);
  }

  // Select target based on AI type
  let target: Combatant;
  switch (enemy.targetPriority) {
    case 'lowest_hp':
      target = targets.reduce((min, t) => t.hp < min.hp ? t : min);
      break;
    case 'highest_threat':
      // Prioritize warriors and tanks
      target = targets.find(t => t.classType === 'warrior') || 
               targets.find(t => t.classType === 'worg') ||
               targets[0];
      break;
    case 'healers':
      // Prioritize mages (healers)
      target = targets.find(t => t.classType === 'mage') || targets[0];
      break;
    default:
      target = targets[Math.floor(Math.random() * targets.length)];
  }

  // Select ability based on AI behavior
  let selectedAbility: Ability;
  switch (enemy.aiType) {
    case 'berserker':
      // Prefer high damage abilities
      selectedAbility = availableAbilities.reduce((max, a) => 
        a.damageMultiplier > max.damageMultiplier ? a : max
      );
      break;
    case 'defensive':
      // Prefer abilities with defensive effects
      selectedAbility = availableAbilities.find(a => 
        a.effects.some(e => e.toLowerCase().includes('defense') || e.toLowerCase().includes('block'))
      ) || availableAbilities[0];
      break;
    case 'support':
      // Mix of damage and utility
      selectedAbility = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
      break;
    default:
      selectedAbility = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
  }

  return { ability: selectedAbility, target };
}

// Get enemies for a zone
export function getEnemiesForZone(zoneId: string): Enemy[] {
  return ENEMY_TEMPLATES.filter(e => e.zone === zoneId);
}

// Generate a random encounter for a zone
export function generateEncounter(zoneId: string, playerLevel: number): EnemyInstance[] {
  const zone = ZONES.find(z => z.id === zoneId);
  if (!zone) return [];

  const zoneEnemies = getEnemiesForZone(zoneId);
  if (zoneEnemies.length === 0) return [];

  // Determine encounter size based on zone type
  let enemyCount = 1;
  if (zone.type.includes('Boss')) {
    enemyCount = 1; // Single boss
  } else if (zone.type.includes('World Boss') || zone.type.includes('Divine Boss')) {
    enemyCount = 1; // Single major boss
  } else {
    enemyCount = Math.floor(Math.random() * 3) + 1; // 1-3 normal enemies
  }

  // Select enemies and create instances
  const encounter: EnemyInstance[] = [];
  for (let i = 0; i < enemyCount; i++) {
    const template = zoneEnemies[Math.floor(Math.random() * zoneEnemies.length)];
    // Scale level based on player level, with variance
    const levelDiff = Math.max(zone.levelRange[0], Math.min(zone.levelRange[1], playerLevel)) - template.level;
    const levelMod = Math.floor(Math.random() * 3) - 1 + Math.floor(levelDiff / 2); // Scale toward player level
    encounter.push(createEnemyInstance(template, levelMod));
  }

  return encounter;
}
