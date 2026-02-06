// Grudge Warlords - Character System
// 6 Races, 4 Classes from Grudge Studio

export type ClassType = 'warrior' | 'mage' | 'ranger' | 'worg';
export type RaceType = 'human' | 'orc' | 'elf' | 'dwarf' | 'undead' | 'demon';

export interface RaceBonus {
  type: string;
  value: number;
  description: string;
}

export interface Race {
  id: RaceType;
  name: string;
  description: string;
  lore: string;
  bonuses: string[];
  recommendedClasses: ClassType[];
  icon: string;
}

export interface ClassInfo {
  id: ClassType;
  name: string;
  role: string;
  description: string;
  primaryStats: string[];
  armorTypes: string[];
  weaponTypes: string[];
  resource: string;
  startingAttributes: Record<string, number>;
  icon: string;
  color: string;
  specialAbility: {
    name: string;
    description: string;
    effects: string[];
  };
}

export interface Attributes {
  STR: number; // Strength - Physical damage, carrying capacity
  DEX: number; // Dexterity - Accuracy, critical chance
  INT: number; // Intellect - Magic damage, mana pool
  VIT: number; // Vitality - Health, health regen
  WIS: number; // Wisdom - Mana regen, healing power
  AGI: number; // Agility - Attack speed, dodge
  END: number; // Endurance - Stamina, defense
  LCK: number; // Luck - Drop rates, critical chance
}

export interface CombatStats {
  physicalDamage: number;
  magicalDamage: number;
  physicalDefense: number;
  magicalDefense: number;
  critChance: number;
  critDamage: number;
  blockChance: number;
  blockReduction: number;
  attackSpeed: number;
  accuracy: number;
  evasion: number;
}

export interface ElementalResistances {
  fire: number;
  ice: number;
  lightning: number;
  arcane: number;
  holy: number;
  nature: number;
  physical: number;
}

export interface Character {
  id: string;
  name: string;
  race: RaceType;
  classType: ClassType;
  level: number;
  experience: number;
  experienceToNext: number;
  attributes: Attributes;
  attributePoints: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
  combatStats: CombatStats;
  resistances: ElementalResistances;
  equipment: Equipment;
  inventory: InventoryItem[];
  skillPoints: number;
  unlockedSkills: string[];
  gold: number;
}

export interface Equipment {
  mainHand: string | null;
  offHand: string | null;
  head: string | null;
  chest: string | null;
  legs: string | null;
  feet: string | null;
  hands: string | null;
  shoulders: string | null;
  ring1: string | null;
  ring2: string | null;
  amulet: string | null;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

// 6 Races
export const RACES: Race[] = [
  {
    id: 'human',
    name: 'Human',
    description: 'Adaptable and versatile',
    lore: 'Adaptable survivors who thrive in any environment.',
    bonuses: ['+10% XP gain', '+1 starting skill point', 'Better merchant prices'],
    recommendedClasses: ['warrior', 'mage', 'ranger', 'worg'],
    icon: '👤'
  },
  {
    id: 'orc',
    name: 'Orc',
    description: 'Fierce and powerful',
    lore: 'Fierce warriors from the northern wastes.',
    bonuses: ['+2 STR', '+5% physical damage', '+20% power when low HP'],
    recommendedClasses: ['warrior', 'worg'],
    icon: '👹'
  },
  {
    id: 'elf',
    name: 'Elf',
    description: 'Magical and precise',
    lore: 'Ancient beings with deep connection to magic.',
    bonuses: ['+2 INT', '+10% max mana', '+5% critical chance'],
    recommendedClasses: ['mage', 'ranger'],
    icon: '🧝'
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    description: 'Sturdy and resilient',
    lore: 'Stout mountain folk, master smiths and defenders.',
    bonuses: ['+2 END', '+10% physical defense', '+10% crafting bonus'],
    recommendedClasses: ['warrior', 'worg'],
    icon: '🧔'
  },
  {
    id: 'undead',
    name: 'Undead',
    description: 'Deathless and relentless',
    lore: 'Risen souls bound to serve the dark forces.',
    bonuses: ['+15% debuff resistance', '+5% lifesteal', 'Immortal will 3s'],
    recommendedClasses: ['warrior', 'mage'],
    icon: '💀'
  },
  {
    id: 'demon',
    name: 'Demon',
    description: 'Destructive and chaotic',
    lore: 'Infernal beings of chaos and destruction.',
    bonuses: ['+8% all damage', '+10% crit damage', '15% debuff chance'],
    recommendedClasses: ['mage', 'ranger'],
    icon: '😈'
  }
];

// 4 Classes
export const CLASSES: ClassInfo[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    role: 'Tank / Melee DPS',
    description: 'Front-line combatants specializing in physical damage and damage absorption. Warriors excel at protecting allies and controlling the battlefield.',
    primaryStats: ['STR', 'VIT', 'END'],
    armorTypes: ['Mail', 'Plate'],
    weaponTypes: ['Swords', 'Axes', 'Maces', 'Shields'],
    resource: 'Rage',
    startingAttributes: { STR: 10, DEX: 3, INT: 2, VIT: 5, WIS: 2, AGI: 3, END: 5 },
    icon: '⚔️',
    color: '#ef4444',
    specialAbility: {
      name: 'Invincibility',
      description: 'Become completely immune to all damage for 1-4 seconds.',
      effects: ['1-4 seconds immunity', 'Duration scales with level', 'Break free from CC']
    }
  },
  {
    id: 'mage',
    name: 'Mage Priest',
    role: 'Magic DPS / Healer',
    description: 'Wielders of arcane power who deal devastating magical damage from range or heal allies with divine magic.',
    primaryStats: ['INT', 'WIS'],
    armorTypes: ['Cloth'],
    weaponTypes: ['Staves', 'Wands', 'Orbs'],
    resource: 'Mana',
    startingAttributes: { STR: 2, DEX: 3, INT: 10, VIT: 3, WIS: 10, AGI: 2, END: 2 },
    icon: '🔮',
    color: '#8b5cf6',
    specialAbility: {
      name: 'Arcane Affinity',
      description: 'Passive mana shield that charges when not taking damage. Activate for massive spell power boost.',
      effects: ['Passive: Shield = 50% current mana', 'Active: +75% spell damage for 15s', 'Charges over 5s without damage']
    }
  },
  {
    id: 'ranger',
    name: 'Ranger Scout',
    role: 'Ranged DPS / Assassin',
    description: 'Agile fighters who rely on speed, precision, and critical strikes. Excel at eliminating high-value targets.',
    primaryStats: ['DEX', 'AGI', 'STR'],
    armorTypes: ['Leather'],
    weaponTypes: ['Bows', 'Crossbows', 'Daggers'],
    resource: 'Energy',
    startingAttributes: { STR: 6, DEX: 7, INT: 3, VIT: 4, WIS: 3, AGI: 7, END: 4 },
    icon: '🏹',
    color: '#22c55e',
    specialAbility: {
      name: "Hunter's Instinct",
      description: 'Passive accuracy and critical strike bonus. Enhanced tracking and movement speed in nature.',
      effects: ['+15% accuracy', '+10% crit chance', '+25% move speed in nature', 'Track enemy positions']
    }
  },
  {
    id: 'worg',
    name: 'Worg Shapeshifter',
    role: 'Tank / Burst DPS',
    description: 'Primal warriors who can transform into powerful beast forms. Masters of versatility and raw power.',
    primaryStats: ['STR', 'VIT', 'AGI'],
    armorTypes: ['Leather', 'Mail'],
    weaponTypes: ['Claws', 'Staves', 'Fist Weapons'],
    resource: 'Stamina',
    startingAttributes: { STR: 7, DEX: 4, INT: 3, VIT: 6, WIS: 4, AGI: 5, END: 5 },
    icon: '🐺',
    color: '#d97706',
    specialAbility: {
      name: 'Primal Shift',
      description: 'Transform into Bear Form with massive HP and defense bonuses.',
      effects: ['+100% HP', '+50% damage reduction', 'Threat generation aura', 'Cannot be polymorphed']
    }
  }
];

// Default starting attributes
export const BASE_ATTRIBUTES: Attributes = {
  STR: 5,
  DEX: 5,
  INT: 5,
  VIT: 5,
  WIS: 5,
  AGI: 5,
  END: 5,
  LCK: 5
};

export const DEFAULT_RESISTANCES: ElementalResistances = {
  fire: 0,
  ice: 0,
  lightning: 0,
  arcane: 0,
  holy: 0,
  nature: 0,
  physical: 0
};

// Calculate derived stats from attributes
export function calculateCombatStats(attributes: Attributes, level: number): CombatStats {
  return {
    physicalDamage: attributes.STR * 2 + level * 3,
    magicalDamage: attributes.INT * 2 + level * 2,
    physicalDefense: attributes.END * 3 + attributes.VIT * 1 + level * 2,
    magicalDefense: attributes.WIS * 2 + attributes.INT * 1 + level * 2,
    critChance: 5 + attributes.DEX * 0.5 + attributes.AGI * 0.3,
    critDamage: 150 + attributes.DEX * 2,
    blockChance: attributes.END * 0.5,
    blockReduction: 20 + attributes.STR * 0.5,
    attackSpeed: 100 + attributes.AGI * 2,
    accuracy: 80 + attributes.DEX * 1.5,
    evasion: 5 + attributes.AGI * 1
  };
}

// Calculate max HP from attributes
export function calculateMaxHp(attributes: Attributes, level: number, classType: ClassType): number {
  const baseHp = 100;
  const vitBonus = attributes.VIT * 10;
  const endBonus = attributes.END * 5;
  const levelBonus = level * 15;
  const classMultiplier = classType === 'warrior' ? 1.3 : classType === 'worg' ? 1.2 : classType === 'ranger' ? 0.9 : 0.8;
  return Math.floor((baseHp + vitBonus + endBonus + levelBonus) * classMultiplier);
}

// Calculate max mana from attributes
export function calculateMaxMana(attributes: Attributes, level: number, classType: ClassType): number {
  const baseMana = 50;
  const intBonus = attributes.INT * 8;
  const wisBonus = attributes.WIS * 4;
  const levelBonus = level * 10;
  const classMultiplier = classType === 'mage' ? 1.5 : classType === 'worg' ? 0.8 : classType === 'ranger' ? 0.7 : 0.6;
  return Math.floor((baseMana + intBonus + wisBonus + levelBonus) * classMultiplier);
}

// Calculate max stamina from attributes
export function calculateMaxStamina(attributes: Attributes, level: number, classType: ClassType): number {
  const baseStamina = 100;
  const endBonus = attributes.END * 6;
  const agiBonus = attributes.AGI * 3;
  const levelBonus = level * 8;
  const classMultiplier = classType === 'warrior' ? 1.2 : classType === 'worg' ? 1.3 : classType === 'ranger' ? 1.1 : 0.7;
  return Math.floor((baseStamina + endBonus + agiBonus + levelBonus) * classMultiplier);
}

// Calculate experience needed for next level
export function calculateExpToNext(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Create a new character
export function createCharacter(name: string, race: RaceType, classType: ClassType): Character {
  const raceData = RACES.find(r => r.id === race)!;
  const classData = CLASSES.find(c => c.id === classType)!;

  // Apply race bonuses to starting attributes
  const attributes: Attributes = { ...BASE_ATTRIBUTES };
  
  // Apply class starting attributes
  Object.entries(classData.startingAttributes).forEach(([key, value]) => {
    attributes[key as keyof Attributes] = value;
  });

  // Apply race attribute bonuses (parse from strings like '+2 STR')
  raceData.bonuses.forEach(bonusStr => {
    const match = bonusStr.match(/\+(\d+)\s+(STR|DEX|INT|VIT|WIS|AGI|END|LCK)/i);
    if (match) {
      const value = parseInt(match[1], 10);
      const attr = match[2].toUpperCase() as keyof Attributes;
      if (attr in attributes) {
        attributes[attr] += value;
      }
    }
  });

  const level = 1;
  const combatStats = calculateCombatStats(attributes, level);
  const maxHp = calculateMaxHp(attributes, level, classType);
  const maxMana = calculateMaxMana(attributes, level, classType);
  const maxStamina = calculateMaxStamina(attributes, level, classType);

  return {
    id: crypto.randomUUID(),
    name,
    race,
    classType,
    level,
    experience: 0,
    experienceToNext: calculateExpToNext(level),
    attributes,
    hp: maxHp,
    maxHp,
    mana: maxMana,
    maxMana,
    stamina: maxStamina,
    maxStamina,
    combatStats,
    resistances: { ...DEFAULT_RESISTANCES },
    equipment: {
      mainHand: null,
      offHand: null,
      head: null,
      chest: null,
      legs: null,
      feet: null,
      hands: null,
      shoulders: null,
      ring1: null,
      ring2: null,
      amulet: null
    },
    inventory: [],
    skillPoints: 1,
    unlockedSkills: [],
    gold: 100,
    attributePoints: 0
  };
}

// Level up a character
export function levelUp(character: Character): Character {
  const newLevel = character.level + 1;
  const newAttributes = character.attributes;
  const newCombatStats = calculateCombatStats(newAttributes, newLevel);
  const newMaxHp = calculateMaxHp(newAttributes, newLevel, character.classType);
  const newMaxMana = calculateMaxMana(newAttributes, newLevel, character.classType);
  const newMaxStamina = calculateMaxStamina(newAttributes, newLevel, character.classType);
  
  return {
    ...character,
    level: newLevel,
    experienceToNext: calculateExpToNext(newLevel),
    combatStats: newCombatStats,
    maxHp: newMaxHp,
    hp: newMaxHp,
    maxMana: newMaxMana,
    mana: newMaxMana,
    maxStamina: newMaxStamina,
    stamina: newMaxStamina,
    attributePoints: character.attributePoints + 3
  };
}

// Allocate an attribute point
export function allocateAttributePoint(
  character: Character,
  attribute: keyof Attributes
): Character {
  if (character.attributePoints <= 0) return character;
  
  const newAttributes = {
    ...character.attributes,
    [attribute]: character.attributes[attribute] + 1
  };
  
  const newCombatStats = calculateCombatStats(newAttributes, character.level);
  const newMaxHp = calculateMaxHp(newAttributes, character.level, character.classType);
  const newMaxMana = calculateMaxMana(newAttributes, character.level, character.classType);
  const newMaxStamina = calculateMaxStamina(newAttributes, character.level, character.classType);
  
  return {
    ...character,
    attributes: newAttributes,
    attributePoints: character.attributePoints - 1,
    combatStats: newCombatStats,
    maxHp: newMaxHp,
    maxMana: newMaxMana,
    maxStamina: newMaxStamina
  };
}

// Get race by ID
export function getRaceById(id: RaceType): Race | undefined {
  return RACES.find(r => r.id === id);
}

// Get class by ID
export function getClassById(id: ClassType): ClassInfo | undefined {
  return CLASSES.find(c => c.id === id);
}
