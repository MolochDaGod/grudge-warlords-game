// Grudge Warlords - Combat System
// Formula: ((physical_damage + magic_damage + stats + boosts) - resistances%) / 2 = final_damage

import type { Character, ClassType, CombatStats, ElementalResistances } from '../data/characters';

export type ElementType = 'fire' | 'ice' | 'lightning' | 'arcane' | 'holy' | 'nature' | 'physical';

export interface Ability {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'active' | 'passive' | 'ultimate';
  element?: ElementType;
  damageMultiplier: number;
  scaling: { stat: 'STR' | 'DEX' | 'INT' | 'WIS' | 'AGI'; ratio: number };
  cooldown: number;
  manaCost: number;
  staminaCost: number;
  effects: string[];
}

export interface Combatant {
  id: string;
  name: string;
  classType: ClassType;
  level: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
  stats: CombatStats;
  resistances: ElementalResistances;
  buffs: CombatBuff[];
  debuffs: CombatDebuff[];
  comboState: ComboState;
  isPlayer: boolean;
}

export interface CombatBuff {
  id: string;
  name: string;
  duration: number;
  icon: string;
  statBonus: { stat: keyof CombatStats; value: number }[];
}

export interface CombatDebuff {
  id: string;
  name: string;
  duration: number;
  icon: string;
  statPenalty: { stat: keyof CombatStats; value: number }[];
  damagePerTurn?: number;
}

export interface ComboState {
  comboCounter: number;
  lastAbilityUsed: string | null;
  canCombo: boolean;
  counterTarget: string | null;
}

export interface DamageResult {
  physicalDamage: number;
  magicalDamage: number;
  totalDamage: number;
  isCrit: boolean;
  isBlocked: boolean;
  isMiss: boolean;
  elementApplied: ElementType | null;
  comboTriggered: boolean;
  effects: string[];
}

export interface CombatLog {
  timestamp: number;
  attackerId: string;
  attackerName: string;
  targetId: string;
  targetName: string;
  abilityName: string;
  result: DamageResult;
}

// Resistance cap at 75%
const RESISTANCE_CAP = 75;

// Apply resistance cap (can go negative for vulnerability)
function capResistance(value: number): number {
  return Math.min(RESISTANCE_CAP, Math.max(-50, value));
}

// Get effective stats with buffs/debuffs applied
function getEffectiveStats(combatant: Combatant): CombatStats {
  const stats = { ...combatant.stats };

  // Apply buffs
  for (const buff of combatant.buffs) {
    for (const bonus of buff.statBonus) {
      stats[bonus.stat] = (stats[bonus.stat] || 0) + bonus.value;
    }
  }

  // Apply debuffs
  for (const debuff of combatant.debuffs) {
    for (const penalty of debuff.statPenalty) {
      stats[penalty.stat] = (stats[penalty.stat] || 0) - penalty.value;
    }
  }

  return stats;
}

// Main damage calculation
export function calculateDamage(
  attacker: Combatant,
  defender: Combatant,
  ability: Ability,
  weaponDamage: { physical: number; magical: number }
): DamageResult {
  const attackerStats = getEffectiveStats(attacker);
  const defenderStats = getEffectiveStats(defender);

  // Check for miss based on accuracy vs evasion
  const hitChance = Math.min(95, Math.max(5, attackerStats.accuracy - defenderStats.evasion));
  if (Math.random() * 100 > hitChance) {
    return {
      physicalDamage: 0,
      magicalDamage: 0,
      totalDamage: 0,
      isCrit: false,
      isBlocked: false,
      isMiss: true,
      elementApplied: null,
      comboTriggered: false,
      effects: ['MISS']
    };
  }

  // Step 1: Calculate base damage
  const baseDamage = (weaponDamage.physical + weaponDamage.magical) * ability.damageMultiplier;

  // Step 2: Add attribute scaling
  const attributeBonus = getAttributeBonus(attacker, ability);
  const totalBaseDamage = baseDamage + attributeBonus;

  // Step 3: Split into physical and magical components
  const totalWeaponDamage = weaponDamage.physical + weaponDamage.magical || 1;
  const physicalRatio = weaponDamage.physical / totalWeaponDamage;
  const magicalRatio = 1 - physicalRatio;

  let physicalDamage = totalBaseDamage * physicalRatio;
  let magicalDamage = totalBaseDamage * magicalRatio;

  // Step 4: Apply element-specific resistance for magical damage
  const element = ability.element || 'physical';
  const elementResist = capResistance(defender.resistances[element] || 0);

  // Apply resistances
  const physicalResist = capResistance(defender.resistances.physical);
  physicalDamage = physicalDamage * (1 - physicalResist / 100);
  magicalDamage = magicalDamage * (1 - elementResist / 100);

  // Step 5: Apply defense mitigation (sqrt formula for diminishing returns)
  const physDefMitigation = Math.min(90, Math.sqrt(defenderStats.physicalDefense));
  const magDefMitigation = Math.min(90, Math.sqrt(defenderStats.magicalDefense));

  physicalDamage = physicalDamage * (100 - physDefMitigation) / 100;
  magicalDamage = magicalDamage * (100 - magDefMitigation) / 100;

  // Step 6: Apply damage variance (±25%)
  const variance = 0.75 + Math.random() * 0.5;
  physicalDamage *= variance;
  magicalDamage *= variance;

  // Step 7: Check block (physical only)
  let isBlocked = false;
  if (Math.random() * 100 < Math.min(75, defenderStats.blockChance)) {
    isBlocked = true;
    physicalDamage *= (1 - Math.min(0.9, defenderStats.blockReduction / 100));
  }

  // Step 8: Check critical (cannot crit if blocked)
  let isCrit = false;
  if (!isBlocked && Math.random() * 100 < Math.min(75, attackerStats.critChance)) {
    isCrit = true;
    const critMult = Math.min(3, attackerStats.critDamage / 100);
    physicalDamage *= critMult;
    magicalDamage *= critMult;
  }

  // Combine damage using formula: (phys + mag) / 2 after resists applied individually
  const totalDamage = Math.max(1, Math.floor((physicalDamage + magicalDamage) / 2));

  // Check for combo trigger
  const comboTriggered = checkComboTrigger(attacker, ability);

  return {
    physicalDamage: Math.floor(physicalDamage),
    magicalDamage: Math.floor(magicalDamage),
    totalDamage,
    isCrit,
    isBlocked,
    isMiss: false,
    elementApplied: ability.element || null,
    comboTriggered,
    effects: ability.effects
  };
}

// Get attribute bonus based on ability scaling
function getAttributeBonus(attacker: Combatant, ability: Ability): number {
  const scalingStat = ability.scaling.stat;
  const ratio = ability.scaling.ratio;

  // Map to combat stats
  const statMap: Record<string, number> = {
    STR: attacker.stats.physicalDamage,
    DEX: attacker.stats.critChance,
    INT: attacker.stats.magicalDamage,
    WIS: attacker.stats.magicalDefense,
    AGI: attacker.stats.attackSpeed
  };

  const baseStatValue = statMap[scalingStat] || 10;
  return baseStatValue * ratio;
}

// Check if combo is triggered based on class
function checkComboTrigger(attacker: Combatant, ability: Ability): boolean {
  if (!attacker.comboState.canCombo) return false;

  switch (attacker.classType) {
    case 'warrior':
      // Warrior: Chain attacks together (basic attack followed by attack)
      return ability.type !== 'passive' && attacker.comboState.lastAbilityUsed === 'basic_attack';
    case 'ranger':
      // Ranger: Combo grants 50% reduced time to next turn
      return attacker.comboState.comboCounter >= 2;
    case 'worg':
      // Worg: Counter attack when damaged
      return attacker.comboState.counterTarget !== null;
    case 'mage':
      // Mage: Recast same spell at 1/2 damage, no mana
      return ability.type === 'active' && attacker.comboState.lastAbilityUsed === ability.id;
    default:
      return false;
  }
}

// Class-specific combo effects
export interface ComboResult {
  damageMultiplier: number;
  turnSpeedModifier: number;
  manaCostMultiplier: number;
  staminaCostMultiplier: number;
  additionalEffects: string[];
}

export function getClassComboEffect(attacker: Combatant, ability: Ability): ComboResult {
  const baseResult: ComboResult = {
    damageMultiplier: 1,
    turnSpeedModifier: 1,
    manaCostMultiplier: 1,
    staminaCostMultiplier: 1,
    additionalEffects: []
  };

  if (!checkComboTrigger(attacker, ability)) {
    return baseResult;
  }

  switch (attacker.classType) {
    case 'warrior':
      // Chain attack bonus: +25% damage
      return {
        ...baseResult,
        damageMultiplier: 1.25,
        additionalEffects: ['⚔️ Combo Chain!']
      };

    case 'ranger':
      // Swift action: 50% reduced time to next turn
      return {
        ...baseResult,
        turnSpeedModifier: 0.5,
        additionalEffects: ['💨 Swift Action!']
      };

    case 'worg':
      // Counter attack: +50% damage
      return {
        ...baseResult,
        damageMultiplier: 1.5,
        additionalEffects: ['🐺 Counter Strike!']
      };

    case 'mage':
      // Echo cast: 50% damage, no mana cost
      return {
        ...baseResult,
        damageMultiplier: 0.5,
        manaCostMultiplier: 0,
        additionalEffects: ['✨ Echo Cast!']
      };

    default:
      return baseResult;
  }
}

// Apply damage to a combatant
export function applyDamage(target: Combatant, damage: number): Combatant {
  return {
    ...target,
    hp: Math.max(0, target.hp - damage)
  };
}

// Apply healing to a combatant
export function applyHealing(target: Combatant, healing: number): Combatant {
  return {
    ...target,
    hp: Math.min(target.maxHp, target.hp + healing)
  };
}

// Calculate healing amount
export function calculateHealing(
  healer: Combatant,
  baseHeal: number,
  scalingStat: 'INT' | 'WIS' = 'WIS'
): number {
  const stats = getEffectiveStats(healer);
  const statBonus = scalingStat === 'WIS' ? stats.magicalDefense : stats.magicalDamage;
  const healing = baseHeal + (statBonus * 0.5);
  const variance = 0.9 + Math.random() * 0.2;
  return Math.floor(healing * variance);
}

// Calculate turn order based on speed
export function calculateTurnOrder(combatants: Combatant[]): Combatant[] {
  return [...combatants].sort((a, b) => {
    const aSpeed = getEffectiveStats(a).attackSpeed;
    const bSpeed = getEffectiveStats(b).attackSpeed;

    // Higher speed goes first
    if (bSpeed !== aSpeed) {
      return bSpeed - aSpeed;
    }

    // Tie-breaker: higher level
    return b.level - a.level;
  });
}

// Process debuff damage over time
export function processDebuffs(combatant: Combatant): { combatant: Combatant; damage: number } {
  let totalDamage = 0;

  // Calculate DoT damage
  for (const debuff of combatant.debuffs) {
    if (debuff.damagePerTurn) {
      totalDamage += debuff.damagePerTurn;
    }
  }

  // Reduce debuff durations
  const updatedDebuffs = combatant.debuffs
    .map(d => ({ ...d, duration: d.duration - 1 }))
    .filter(d => d.duration > 0);

  return {
    combatant: {
      ...combatant,
      hp: Math.max(0, combatant.hp - totalDamage),
      debuffs: updatedDebuffs
    },
    damage: totalDamage
  };
}

// Process buff durations
export function processBuffs(combatant: Combatant): Combatant {
  const updatedBuffs = combatant.buffs
    .map(b => ({ ...b, duration: b.duration - 1 }))
    .filter(b => b.duration > 0);

  return {
    ...combatant,
    buffs: updatedBuffs
  };
}

// Add a buff to a combatant
export function addBuff(combatant: Combatant, buff: CombatBuff): Combatant {
  // Check if buff already exists, refresh if so
  const existingIndex = combatant.buffs.findIndex(b => b.id === buff.id);
  if (existingIndex >= 0) {
    const updatedBuffs = [...combatant.buffs];
    updatedBuffs[existingIndex] = buff;
    return { ...combatant, buffs: updatedBuffs };
  }

  return {
    ...combatant,
    buffs: [...combatant.buffs, buff]
  };
}

// Add a debuff to a combatant
export function addDebuff(combatant: Combatant, debuff: CombatDebuff): Combatant {
  const existingIndex = combatant.debuffs.findIndex(d => d.id === debuff.id);
  if (existingIndex >= 0) {
    const updatedDebuffs = [...combatant.debuffs];
    updatedDebuffs[existingIndex] = debuff;
    return { ...combatant, debuffs: updatedDebuffs };
  }

  return {
    ...combatant,
    debuffs: [...combatant.debuffs, debuff]
  };
}

// Check if combatant is dead
export function isDead(combatant: Combatant): boolean {
  return combatant.hp <= 0;
}

// Convert Character to Combatant for combat
export function characterToCombatant(character: Character): Combatant {
  return {
    id: character.id,
    name: character.name,
    classType: character.classType,
    level: character.level,
    hp: character.hp,
    maxHp: character.maxHp,
    mana: character.mana,
    maxMana: character.maxMana,
    stamina: character.stamina,
    maxStamina: character.maxStamina,
    stats: character.combatStats,
    resistances: character.resistances,
    buffs: [],
    debuffs: [],
    comboState: {
      comboCounter: 0,
      lastAbilityUsed: null,
      canCombo: true,
      counterTarget: null
    },
    isPlayer: true
  };
}

// Combat result interface
export interface CombatResult {
  damage: number;
  isCritical: boolean;
  isBlocked: boolean;
  isMiss: boolean;
  effects: string[];
}

// Create combatant from character with weapon stats
export function createCombatantFromCharacter(character: Character, weapon?: { minDamage?: number; maxDamage?: number } | null): Combatant {
  const combatant = characterToCombatant(character);
  
  // Add weapon damage to stats
  if (weapon && weapon.minDamage && weapon.maxDamage) {
    const avgDamage = (weapon.minDamage + weapon.maxDamage) / 2;
    combatant.stats = {
      ...combatant.stats,
      physicalDamage: combatant.stats.physicalDamage + avgDamage
    };
  }
  
  return combatant;
}

// Process a combat round (simplified)
export function processCombatRound(attacker: Combatant, defender: Combatant): CombatResult {
  const stats = getEffectiveStats(attacker);
  const defenderStats = getEffectiveStats(defender);
  
  // Check for miss
  const hitChance = Math.min(95, Math.max(5, stats.accuracy - defenderStats.evasion));
  if (Math.random() * 100 > hitChance) {
    return { damage: 0, isCritical: false, isBlocked: false, isMiss: true, effects: ['MISS'] };
  }
  
  // Calculate base damage
  let damage = stats.physicalDamage + stats.magicalDamage / 2;
  
  // Apply defense
  const defMitigation = Math.min(0.9, (defenderStats.physicalDefense + defenderStats.magicalDefense) / 500);
  damage *= (1 - defMitigation);
  
  // Check block
  let isBlocked = false;
  if (Math.random() * 100 < defenderStats.blockChance) {
    isBlocked = true;
    damage *= (1 - defenderStats.blockReduction / 100);
  }
  
  // Check crit
  let isCritical = false;
  if (!isBlocked && Math.random() * 100 < stats.critChance) {
    isCritical = true;
    damage *= stats.critDamage / 100;
  }
  
  // Add variance
  damage *= 0.85 + Math.random() * 0.3;
  
  return {
    damage: Math.max(1, Math.floor(damage)),
    isCritical,
    isBlocked,
    isMiss: false,
    effects: []
  };
}
