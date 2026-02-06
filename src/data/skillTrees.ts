// Grudge Warlords - Skill Trees Data
// Based on classSkillTrees.ts from Grudge Studio

import type { ClassType } from './characters';

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: number; // 1-6
  type: 'active' | 'passive' | 'ultimate';
  unlockLevel: number;
  prerequisite?: string;
  effects: SkillEffect[];
  manaCost?: number;
  staminaCost?: number;
  cooldown?: number;
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'stat_boost' | 'special';
  value: number;
  stat?: string;
  duration?: number;
  description: string;
}

export interface SkillTree {
  classType: ClassType;
  className: string;
  description: string;
  skills: Skill[];
}

// WARRIOR SKILL TREE
export const WARRIOR_SKILLS: Skill[] = [
  // Tier 1 (Level 1-3)
  {
    id: 'warrior_t1_power_strike',
    name: 'Power Strike',
    description: 'A powerful melee attack dealing 150% weapon damage',
    icon: '⚔️',
    tier: 1,
    type: 'active',
    unlockLevel: 1,
    manaCost: 0,
    staminaCost: 15,
    cooldown: 4,
    effects: [{ type: 'damage', value: 150, description: '+50% weapon damage' }]
  },
  {
    id: 'warrior_t1_toughness',
    name: 'Toughness',
    description: 'Increases maximum HP by 10%',
    icon: '🛡️',
    tier: 1,
    type: 'passive',
    unlockLevel: 1,
    effects: [{ type: 'stat_boost', value: 10, stat: 'maxHp', description: '+10% Max HP' }]
  },
  {
    id: 'warrior_t1_battle_cry',
    name: 'Battle Cry',
    description: 'Increases attack damage by 15% for 10 seconds',
    icon: '📣',
    tier: 1,
    type: 'active',
    unlockLevel: 2,
    manaCost: 10,
    staminaCost: 10,
    cooldown: 20,
    effects: [{ type: 'buff', value: 15, stat: 'physicalDamage', duration: 10, description: '+15% damage for 10s' }]
  },

  // Tier 2 (Level 4-6)
  {
    id: 'warrior_t2_cleave',
    name: 'Cleave',
    description: 'Swing weapon hitting all nearby enemies for 80% damage',
    icon: '🪓',
    tier: 2,
    type: 'active',
    unlockLevel: 4,
    prerequisite: 'warrior_t1_power_strike',
    manaCost: 0,
    staminaCost: 25,
    cooldown: 6,
    effects: [{ type: 'damage', value: 80, description: 'AoE 80% weapon damage' }]
  },
  {
    id: 'warrior_t2_iron_skin',
    name: 'Iron Skin',
    description: 'Increases physical defense by 20%',
    icon: '🔩',
    tier: 2,
    type: 'passive',
    unlockLevel: 4,
    prerequisite: 'warrior_t1_toughness',
    effects: [{ type: 'stat_boost', value: 20, stat: 'physicalDefense', description: '+20% Physical Defense' }]
  },
  {
    id: 'warrior_t2_shield_wall',
    name: 'Shield Wall',
    description: 'Block all attacks for 3 seconds',
    icon: '🛡️',
    tier: 2,
    type: 'active',
    unlockLevel: 5,
    manaCost: 20,
    staminaCost: 30,
    cooldown: 30,
    effects: [{ type: 'buff', value: 100, stat: 'blockChance', duration: 3, description: '100% block for 3s' }]
  },

  // Tier 3 (Level 7-9)
  {
    id: 'warrior_t3_whirlwind',
    name: 'Whirlwind',
    description: 'Spin attack dealing 120% damage to all enemies',
    icon: '🌀',
    tier: 3,
    type: 'active',
    unlockLevel: 7,
    prerequisite: 'warrior_t2_cleave',
    manaCost: 0,
    staminaCost: 40,
    cooldown: 10,
    effects: [{ type: 'damage', value: 120, description: 'AoE 120% damage' }]
  },
  {
    id: 'warrior_t3_berserker',
    name: 'Berserker Rage',
    description: 'Gain 30% attack speed and damage when below 30% HP',
    icon: '😤',
    tier: 3,
    type: 'passive',
    unlockLevel: 7,
    prerequisite: 'warrior_t2_iron_skin',
    effects: [
      { type: 'stat_boost', value: 30, stat: 'attackSpeed', description: '+30% attack speed when low HP' },
      { type: 'stat_boost', value: 30, stat: 'physicalDamage', description: '+30% damage when low HP' }
    ]
  },

  // Tier 4 (Level 10-12)
  {
    id: 'warrior_t4_execute',
    name: 'Execute',
    description: 'Deal 300% damage to enemies below 25% HP',
    icon: '💀',
    tier: 4,
    type: 'active',
    unlockLevel: 10,
    prerequisite: 'warrior_t3_whirlwind',
    manaCost: 0,
    staminaCost: 50,
    cooldown: 15,
    effects: [{ type: 'damage', value: 300, description: '300% damage to low HP enemies' }]
  },
  {
    id: 'warrior_t4_last_stand',
    name: 'Last Stand',
    description: 'Cannot die for 5 seconds when HP reaches 0',
    icon: '⚡',
    tier: 4,
    type: 'passive',
    unlockLevel: 10,
    effects: [{ type: 'special', value: 5, description: 'Immune to death for 5s' }]
  },

  // Tier 5 (Level 13-16)
  {
    id: 'warrior_t5_titan_strike',
    name: 'Titan Strike',
    description: 'Massive attack dealing 400% damage and stunning target',
    icon: '🔨',
    tier: 5,
    type: 'active',
    unlockLevel: 13,
    prerequisite: 'warrior_t4_execute',
    manaCost: 30,
    staminaCost: 60,
    cooldown: 20,
    effects: [
      { type: 'damage', value: 400, description: '400% weapon damage' },
      { type: 'debuff', value: 2, stat: 'stun', duration: 2, description: 'Stun for 2s' }
    ]
  },

  // Tier 6 (Level 17-20) - Ultimate
  {
    id: 'warrior_t6_invincibility',
    name: 'Invincibility',
    description: 'Become completely invulnerable for 8 seconds, +50% damage',
    icon: '👑',
    tier: 6,
    type: 'ultimate',
    unlockLevel: 17,
    prerequisite: 'warrior_t5_titan_strike',
    manaCost: 100,
    staminaCost: 100,
    cooldown: 120,
    effects: [
      { type: 'buff', value: 100, stat: 'invulnerable', duration: 8, description: 'Invulnerable for 8s' },
      { type: 'buff', value: 50, stat: 'physicalDamage', duration: 8, description: '+50% damage for 8s' }
    ]
  }
];

// MAGE PRIEST SKILL TREE
export const MAGE_SKILLS: Skill[] = [
  // Tier 1
  {
    id: 'mage_t1_fireball',
    name: 'Fireball',
    description: 'Launch a fireball dealing 130% magic damage',
    icon: '🔥',
    tier: 1,
    type: 'active',
    unlockLevel: 1,
    manaCost: 20,
    staminaCost: 0,
    cooldown: 3,
    effects: [{ type: 'damage', value: 130, description: '130% magic fire damage' }]
  },
  {
    id: 'mage_t1_meditation',
    name: 'Meditation',
    description: 'Increases mana regeneration by 25%',
    icon: '🧘',
    tier: 1,
    type: 'passive',
    unlockLevel: 1,
    effects: [{ type: 'stat_boost', value: 25, stat: 'manaRegen', description: '+25% mana regen' }]
  },
  {
    id: 'mage_t1_heal',
    name: 'Heal',
    description: 'Restore 25% of max HP',
    icon: '💚',
    tier: 1,
    type: 'active',
    unlockLevel: 2,
    manaCost: 30,
    staminaCost: 0,
    cooldown: 8,
    effects: [{ type: 'heal', value: 25, description: 'Heal 25% max HP' }]
  },

  // Tier 2
  {
    id: 'mage_t2_ice_bolt',
    name: 'Ice Bolt',
    description: 'Frost attack dealing 120% damage and slowing enemy',
    icon: '❄️',
    tier: 2,
    type: 'active',
    unlockLevel: 4,
    prerequisite: 'mage_t1_fireball',
    manaCost: 25,
    staminaCost: 0,
    cooldown: 4,
    effects: [
      { type: 'damage', value: 120, description: '120% magic ice damage' },
      { type: 'debuff', value: 30, stat: 'attackSpeed', duration: 3, description: 'Slow 30% for 3s' }
    ]
  },
  {
    id: 'mage_t2_arcane_shield',
    name: 'Arcane Shield',
    description: 'Create a shield absorbing damage equal to 30% max HP',
    icon: '🔮',
    tier: 2,
    type: 'active',
    unlockLevel: 4,
    manaCost: 40,
    staminaCost: 0,
    cooldown: 20,
    effects: [{ type: 'buff', value: 30, stat: 'shield', duration: 15, description: 'Shield 30% max HP' }]
  },
  {
    id: 'mage_t2_wisdom',
    name: 'Wisdom',
    description: 'Increases max mana by 20%',
    icon: '📖',
    tier: 2,
    type: 'passive',
    unlockLevel: 5,
    prerequisite: 'mage_t1_meditation',
    effects: [{ type: 'stat_boost', value: 20, stat: 'maxMana', description: '+20% Max Mana' }]
  },

  // Tier 3
  {
    id: 'mage_t3_chain_lightning',
    name: 'Chain Lightning',
    description: 'Lightning that jumps to 3 enemies, 100% damage each',
    icon: '⚡',
    tier: 3,
    type: 'active',
    unlockLevel: 7,
    prerequisite: 'mage_t2_ice_bolt',
    manaCost: 45,
    staminaCost: 0,
    cooldown: 8,
    effects: [{ type: 'damage', value: 100, description: 'Chain 100% damage to 3 enemies' }]
  },
  {
    id: 'mage_t3_greater_heal',
    name: 'Greater Heal',
    description: 'Restore 50% of max HP',
    icon: '💖',
    tier: 3,
    type: 'active',
    unlockLevel: 7,
    prerequisite: 'mage_t1_heal',
    manaCost: 60,
    staminaCost: 0,
    cooldown: 15,
    effects: [{ type: 'heal', value: 50, description: 'Heal 50% max HP' }]
  },

  // Tier 4
  {
    id: 'mage_t4_meteor',
    name: 'Meteor',
    description: 'Call down a meteor dealing 250% AoE damage',
    icon: '☄️',
    tier: 4,
    type: 'active',
    unlockLevel: 10,
    prerequisite: 'mage_t3_chain_lightning',
    manaCost: 80,
    staminaCost: 0,
    cooldown: 20,
    effects: [{ type: 'damage', value: 250, description: 'AoE 250% fire damage' }]
  },
  {
    id: 'mage_t4_spell_mastery',
    name: 'Spell Mastery',
    description: 'All spell damage increased by 25%',
    icon: '✨',
    tier: 4,
    type: 'passive',
    unlockLevel: 10,
    effects: [{ type: 'stat_boost', value: 25, stat: 'magicalDamage', description: '+25% spell damage' }]
  },

  // Tier 5
  {
    id: 'mage_t5_time_warp',
    name: 'Time Warp',
    description: 'Reset all cooldowns and gain 50% cast speed for 10s',
    icon: '⏰',
    tier: 5,
    type: 'active',
    unlockLevel: 13,
    manaCost: 100,
    staminaCost: 0,
    cooldown: 60,
    effects: [
      { type: 'special', value: 0, description: 'Reset all cooldowns' },
      { type: 'buff', value: 50, stat: 'castSpeed', duration: 10, description: '+50% cast speed' }
    ]
  },

  // Tier 6 - Ultimate
  {
    id: 'mage_t6_arcane_affinity',
    name: 'Arcane Affinity',
    description: 'Echo cast: Next spell casts twice at 50% power, no mana cost',
    icon: '🌟',
    tier: 6,
    type: 'ultimate',
    unlockLevel: 17,
    prerequisite: 'mage_t5_time_warp',
    manaCost: 150,
    staminaCost: 0,
    cooldown: 90,
    effects: [
      { type: 'special', value: 50, description: 'Echo cast at 50% damage' },
      { type: 'special', value: 0, description: 'Next spell free' }
    ]
  }
];

// RANGER SCOUT SKILL TREE
export const RANGER_SKILLS: Skill[] = [
  // Tier 1
  {
    id: 'ranger_t1_aimed_shot',
    name: 'Aimed Shot',
    description: 'Careful aim dealing 160% damage with +20% crit',
    icon: '🎯',
    tier: 1,
    type: 'active',
    unlockLevel: 1,
    manaCost: 0,
    staminaCost: 15,
    cooldown: 5,
    effects: [
      { type: 'damage', value: 160, description: '160% weapon damage' },
      { type: 'buff', value: 20, stat: 'critChance', duration: 0, description: '+20% crit chance' }
    ]
  },
  {
    id: 'ranger_t1_quick_feet',
    name: 'Quick Feet',
    description: 'Increases evasion by 15%',
    icon: '👟',
    tier: 1,
    type: 'passive',
    unlockLevel: 1,
    effects: [{ type: 'stat_boost', value: 15, stat: 'evasion', description: '+15% Evasion' }]
  },
  {
    id: 'ranger_t1_rapid_fire',
    name: 'Rapid Fire',
    description: 'Fire 3 quick shots at 60% damage each',
    icon: '🏹',
    tier: 1,
    type: 'active',
    unlockLevel: 2,
    manaCost: 0,
    staminaCost: 20,
    cooldown: 6,
    effects: [{ type: 'damage', value: 180, description: '3x60% damage shots' }]
  },

  // Tier 2
  {
    id: 'ranger_t2_poison_arrow',
    name: 'Poison Arrow',
    description: 'Poison target dealing 20% damage over 8 seconds',
    icon: '☠️',
    tier: 2,
    type: 'active',
    unlockLevel: 4,
    prerequisite: 'ranger_t1_aimed_shot',
    manaCost: 10,
    staminaCost: 15,
    cooldown: 8,
    effects: [{ type: 'debuff', value: 20, stat: 'poison', duration: 8, description: 'Poison 20% over 8s' }]
  },
  {
    id: 'ranger_t2_stealth',
    name: 'Stealth',
    description: 'Become invisible for 5 seconds, next attack crits',
    icon: '👤',
    tier: 2,
    type: 'active',
    unlockLevel: 4,
    manaCost: 20,
    staminaCost: 20,
    cooldown: 25,
    effects: [
      { type: 'buff', value: 100, stat: 'invisible', duration: 5, description: 'Invisible 5s' },
      { type: 'buff', value: 100, stat: 'critChance', duration: 0, description: 'Guaranteed crit' }
    ]
  },
  {
    id: 'ranger_t2_eagle_eye',
    name: 'Eagle Eye',
    description: 'Increases accuracy and crit damage by 15%',
    icon: '🦅',
    tier: 2,
    type: 'passive',
    unlockLevel: 5,
    prerequisite: 'ranger_t1_quick_feet',
    effects: [
      { type: 'stat_boost', value: 15, stat: 'accuracy', description: '+15% Accuracy' },
      { type: 'stat_boost', value: 15, stat: 'critDamage', description: '+15% Crit Damage' }
    ]
  },

  // Tier 3
  {
    id: 'ranger_t3_multishot',
    name: 'Multishot',
    description: 'Fire arrows at all enemies for 70% damage',
    icon: '🎆',
    tier: 3,
    type: 'active',
    unlockLevel: 7,
    prerequisite: 'ranger_t1_rapid_fire',
    manaCost: 0,
    staminaCost: 35,
    cooldown: 10,
    effects: [{ type: 'damage', value: 70, description: 'AoE 70% damage' }]
  },
  {
    id: 'ranger_t3_trap',
    name: 'Bear Trap',
    description: 'Place trap that roots enemy for 3 seconds',
    icon: '🪤',
    tier: 3,
    type: 'active',
    unlockLevel: 7,
    manaCost: 15,
    staminaCost: 20,
    cooldown: 15,
    effects: [{ type: 'debuff', value: 3, stat: 'root', duration: 3, description: 'Root 3s' }]
  },

  // Tier 4
  {
    id: 'ranger_t4_assassinate',
    name: 'Assassinate',
    description: 'Strike from stealth for 350% damage',
    icon: '🗡️',
    tier: 4,
    type: 'active',
    unlockLevel: 10,
    prerequisite: 'ranger_t2_stealth',
    manaCost: 0,
    staminaCost: 50,
    cooldown: 20,
    effects: [{ type: 'damage', value: 350, description: '350% damage from stealth' }]
  },
  {
    id: 'ranger_t4_predator',
    name: 'Predator',
    description: '+50% damage against enemies below 50% HP',
    icon: '🐺',
    tier: 4,
    type: 'passive',
    unlockLevel: 10,
    effects: [{ type: 'special', value: 50, description: '+50% damage vs low HP' }]
  },

  // Tier 5
  {
    id: 'ranger_t5_rain_of_arrows',
    name: 'Rain of Arrows',
    description: 'Barrage of arrows dealing 200% AoE damage over 5s',
    icon: '🌧️',
    tier: 5,
    type: 'active',
    unlockLevel: 13,
    prerequisite: 'ranger_t3_multishot',
    manaCost: 30,
    staminaCost: 60,
    cooldown: 25,
    effects: [{ type: 'damage', value: 200, description: 'AoE 200% over 5s' }]
  },

  // Tier 6 - Ultimate
  {
    id: 'ranger_t6_hunters_instinct',
    name: "Hunter's Instinct",
    description: 'Mark target: +50% damage, +100% turn speed, attacks reveal',
    icon: '🎯',
    tier: 6,
    type: 'ultimate',
    unlockLevel: 17,
    prerequisite: 'ranger_t5_rain_of_arrows',
    manaCost: 50,
    staminaCost: 50,
    cooldown: 60,
    effects: [
      { type: 'debuff', value: 50, stat: 'vulnerability', duration: 15, description: 'Target +50% damage taken' },
      { type: 'buff', value: 100, stat: 'turnSpeed', duration: 15, description: '+100% turn speed' }
    ]
  }
];

// WORG SHAPESHIFTER SKILL TREE
export const WORG_SKILLS: Skill[] = [
  // Tier 1
  {
    id: 'worg_t1_savage_bite',
    name: 'Savage Bite',
    description: 'Ferocious bite dealing 140% damage',
    icon: '🦷',
    tier: 1,
    type: 'active',
    unlockLevel: 1,
    manaCost: 0,
    staminaCost: 15,
    cooldown: 4,
    effects: [{ type: 'damage', value: 140, description: '140% damage bite' }]
  },
  {
    id: 'worg_t1_thick_hide',
    name: 'Thick Hide',
    description: 'Increases physical resistance by 10%',
    icon: '🐺',
    tier: 1,
    type: 'passive',
    unlockLevel: 1,
    effects: [{ type: 'stat_boost', value: 10, stat: 'physicalResist', description: '+10% Physical Resist' }]
  },
  {
    id: 'worg_t1_howl',
    name: 'Howl',
    description: 'Fear nearby enemies, reducing their attack by 20%',
    icon: '🌙',
    tier: 1,
    type: 'active',
    unlockLevel: 2,
    manaCost: 15,
    staminaCost: 10,
    cooldown: 15,
    effects: [{ type: 'debuff', value: 20, stat: 'physicalDamage', duration: 8, description: '-20% enemy damage 8s' }]
  },

  // Tier 2
  {
    id: 'worg_t2_rend',
    name: 'Rend',
    description: 'Tear into enemy causing bleed for 30% over 6s',
    icon: '🩸',
    tier: 2,
    type: 'active',
    unlockLevel: 4,
    prerequisite: 'worg_t1_savage_bite',
    manaCost: 0,
    staminaCost: 20,
    cooldown: 8,
    effects: [{ type: 'debuff', value: 30, stat: 'bleed', duration: 6, description: 'Bleed 30% over 6s' }]
  },
  {
    id: 'worg_t2_pack_tactics',
    name: 'Pack Tactics',
    description: 'Gain +15% damage for each nearby ally',
    icon: '🐕',
    tier: 2,
    type: 'passive',
    unlockLevel: 4,
    effects: [{ type: 'special', value: 15, description: '+15% damage per ally' }]
  },
  {
    id: 'worg_t2_primal_vigor',
    name: 'Primal Vigor',
    description: 'Regenerate 3% HP per second for 10s',
    icon: '💪',
    tier: 2,
    type: 'active',
    unlockLevel: 5,
    prerequisite: 'worg_t1_thick_hide',
    manaCost: 25,
    staminaCost: 15,
    cooldown: 25,
    effects: [{ type: 'heal', value: 30, description: 'Regen 30% HP over 10s' }]
  },

  // Tier 3
  {
    id: 'worg_t3_feral_charge',
    name: 'Feral Charge',
    description: 'Leap to enemy dealing 180% damage and stunning',
    icon: '🏃',
    tier: 3,
    type: 'active',
    unlockLevel: 7,
    prerequisite: 'worg_t2_rend',
    manaCost: 0,
    staminaCost: 30,
    cooldown: 12,
    effects: [
      { type: 'damage', value: 180, description: '180% damage leap' },
      { type: 'debuff', value: 1, stat: 'stun', duration: 1, description: 'Stun 1s' }
    ]
  },
  {
    id: 'worg_t3_alpha',
    name: 'Alpha Dominance',
    description: 'Intimidate enemies, reducing their crit chance by 25%',
    icon: '👁️',
    tier: 3,
    type: 'passive',
    unlockLevel: 7,
    effects: [{ type: 'debuff', value: 25, stat: 'critChance', duration: 0, description: '-25% enemy crit' }]
  },

  // Tier 4
  {
    id: 'worg_t4_rampage',
    name: 'Rampage',
    description: 'Go berserk, attacking rapidly for 250% total damage',
    icon: '💢',
    tier: 4,
    type: 'active',
    unlockLevel: 10,
    prerequisite: 'worg_t3_feral_charge',
    manaCost: 0,
    staminaCost: 50,
    cooldown: 18,
    effects: [{ type: 'damage', value: 250, description: '5x50% rapid attacks' }]
  },
  {
    id: 'worg_t4_counter_strike',
    name: 'Counter Strike',
    description: '+50% chance to counter when attacked',
    icon: '↩️',
    tier: 4,
    type: 'passive',
    unlockLevel: 10,
    effects: [{ type: 'special', value: 50, description: '50% counter chance' }]
  },

  // Tier 5
  {
    id: 'worg_t5_savage_roar',
    name: 'Savage Roar',
    description: 'Terrifying roar increasing all damage by 40% for 12s',
    icon: '🦁',
    tier: 5,
    type: 'active',
    unlockLevel: 13,
    manaCost: 40,
    staminaCost: 40,
    cooldown: 30,
    effects: [{ type: 'buff', value: 40, stat: 'allDamage', duration: 12, description: '+40% all damage 12s' }]
  },

  // Tier 6 - Ultimate
  {
    id: 'worg_t6_primal_shift',
    name: 'Primal Shift',
    description: 'Transform into ultimate beast: +100% stats, lifesteal, counter attacks',
    icon: '🐺',
    tier: 6,
    type: 'ultimate',
    unlockLevel: 17,
    prerequisite: 'worg_t5_savage_roar',
    manaCost: 100,
    staminaCost: 100,
    cooldown: 120,
    effects: [
      { type: 'buff', value: 100, stat: 'allStats', duration: 15, description: '+100% all stats 15s' },
      { type: 'buff', value: 30, stat: 'lifesteal', duration: 15, description: '+30% lifesteal' },
      { type: 'special', value: 100, description: 'Counter all attacks' }
    ]
  }
];

// Combine all skill trees
export const SKILL_TREES: Record<ClassType, SkillTree> = {
  warrior: {
    classType: 'warrior',
    className: 'Warrior',
    description: 'Masters of combat, combining devastating attacks with unbreakable defense',
    skills: WARRIOR_SKILLS
  },
  mage: {
    classType: 'mage',
    className: 'Mage Priest',
    description: 'Wielders of arcane power and divine healing',
    skills: MAGE_SKILLS
  },
  ranger: {
    classType: 'ranger',
    className: 'Ranger Scout',
    description: 'Deadly marksmen and cunning assassins',
    skills: RANGER_SKILLS
  },
  worg: {
    classType: 'worg',
    className: 'Worg Shapeshifter',
    description: 'Primal warriors who embrace their bestial nature',
    skills: WORG_SKILLS
  }
};

// Get available skills for a character
export function getAvailableSkills(classType: ClassType, level: number, unlockedSkills: string[]): Skill[] {
  const tree = SKILL_TREES[classType];
  return tree.skills.filter(skill => {
    // Check level requirement
    if (skill.unlockLevel > level) return false;
    // Check prerequisite
    if (skill.prerequisite && !unlockedSkills.includes(skill.prerequisite)) return false;
    // Not already unlocked
    if (unlockedSkills.includes(skill.id)) return false;
    return true;
  });
}

// Get skill by ID
export function getSkillById(skillId: string): Skill | undefined {
  for (const tree of Object.values(SKILL_TREES)) {
    const skill = tree.skills.find(s => s.id === skillId);
    if (skill) return skill;
  }
  return undefined;
}
