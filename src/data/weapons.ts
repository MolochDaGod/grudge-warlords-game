// Grudge Warlords - Weapons Database
// 126 weapons across 8 tiers from Grudge Studio data exports

export interface Weapon {
  id: string;
  name: string;
  tier: number;
  category: string;
  subCategory: string;
  profession: string;
  description: string;
  icon: string;
  baseStats: { ATK?: number; MAG?: number };
  ingredients: { itemId: string; amount: number }[];
}

// Helper to calculate weapon damage from baseStats
export function getWeaponDamage(weapon: Weapon): { min: number; max: number } {
  const atk = weapon.baseStats.ATK || 0;
  const mag = weapon.baseStats.MAG || 0;
  const base = atk + mag;
  return { min: Math.floor(base * 0.8), max: Math.ceil(base * 1.2) };
}

export const WEAPONS: Weapon[] = [
  // Tier 0 - Starter Weapons
  { id: 'wooden-club', name: 'Wooden Club', tier: 0, category: 'weapon', subCategory: 'blunt-1h', profession: 'Universal', description: 'Crude bludgeon', icon: '🪵', baseStats: { ATK: 5 }, ingredients: [{ itemId: 'pine-log', amount: 2 }] },
  { id: 'rusty-shortsword', name: 'Rusty Shortsword', tier: 0, category: 'weapon', subCategory: 'sword-1h', profession: 'Universal', description: 'Dull blade', icon: '⚔️', baseStats: { ATK: 8 }, ingredients: [{ itemId: 'stone', amount: 2 }, { itemId: 'string', amount: 1 }] },
  { id: 'training-bow', name: 'Training Bow', tier: 0, category: 'weapon', subCategory: 'bow', profession: 'Universal', description: 'Basic practice bow', icon: '🏹', baseStats: { ATK: 6 }, ingredients: [{ itemId: 'pine-log', amount: 2 }, { itemId: 'string', amount: 1 }] },
  { id: 'apprentice-wand', name: 'Apprentice Wand', tier: 0, category: 'weapon', subCategory: 'wand', profession: 'Universal', description: 'Novice focus', icon: '🪄', baseStats: { MAG: 5 }, ingredients: [{ itemId: 'pine-log', amount: 1 }, { itemId: 'minor-essence', amount: 1 }] },
  { id: 'stone-knife', name: 'Stone Knife', tier: 0, category: 'weapon', subCategory: 'dagger', profession: 'Universal', description: 'Primitive blade', icon: '🗡️', baseStats: { ATK: 4 }, ingredients: [{ itemId: 'stone', amount: 2 }] },

  // Tier 1 - 1H Swords
  { id: 'gladius', name: 'Gladius', tier: 1, category: 'weapon', subCategory: 'sword-1h', profession: 'Miner', description: 'Short Roman blade', icon: '⚔️', baseStats: { ATK: 15 }, ingredients: [{ itemId: 'copper-ingot', amount: 2 }, { itemId: 'rawhide', amount: 1 }] },
  { id: 'falchion', name: 'Falchion', tier: 2, category: 'weapon', subCategory: 'sword-1h', profession: 'Miner', description: 'Curved single-edge blade', icon: '⚔️', baseStats: { ATK: 28 }, ingredients: [{ itemId: 'iron-ingot', amount: 3 }, { itemId: 'thick-hide', amount: 1 }] },
  { id: 'scimitar', name: 'Scimitar', tier: 3, category: 'weapon', subCategory: 'sword-1h', profession: 'Miner', description: 'Crescent moon blade', icon: '⚔️', baseStats: { ATK: 45 }, ingredients: [{ itemId: 'steel-ingot', amount: 3 }, { itemId: 'rugged-leather', amount: 1 }] },
  { id: 'rapier', name: 'Rapier', tier: 4, category: 'weapon', subCategory: 'sword-1h', profession: 'Miner', description: 'Elegant thrusting sword', icon: '⚔️', baseStats: { ATK: 68 }, ingredients: [{ itemId: 'mithril-ingot', amount: 3 }, { itemId: 'hardened-leather', amount: 1 }] },
  { id: 'katana', name: 'Katana', tier: 5, category: 'weapon', subCategory: 'sword-1h', profession: 'Miner', description: 'Eastern folded steel', icon: '⚔️', baseStats: { ATK: 95 }, ingredients: [{ itemId: 'adamantine-ingot', amount: 4 }, { itemId: 'wyrm-leather', amount: 1 }] },
  { id: 'soulblade', name: 'Soulblade', tier: 6, category: 'weapon', subCategory: 'sword-1h', profession: 'Miner', description: 'Spirit-bound edge', icon: '⚔️', baseStats: { ATK: 130 }, ingredients: [{ itemId: 'orichalcum-ingot', amount: 4 }, { itemId: 'infernal-leather', amount: 1 }, { itemId: 'flawless-gem', amount: 1 }] },
  { id: 'starfall-edge', name: 'Starfall Edge', tier: 7, category: 'weapon', subCategory: 'sword-1h', profession: 'Miner', description: 'Celestial meteor blade', icon: '⚔️', baseStats: { ATK: 175 }, ingredients: [{ itemId: 'starmetal-ingot', amount: 5 }, { itemId: 'titan-leather', amount: 1 }, { itemId: 'radiant-gem', amount: 1 }] },
  { id: 'excalibur', name: 'Excalibur', tier: 8, category: 'weapon', subCategory: 'sword-1h', profession: 'Miner', description: 'Legendary holy sword', icon: '⚔️', baseStats: { ATK: 250 }, ingredients: [{ itemId: 'divine-ingot', amount: 5 }, { itemId: 'divine-leather', amount: 2 }, { itemId: 'divine-gem', amount: 1 }] },

  // Tier 1-8 - 2H Swords
  { id: 'bronze-claymore', name: 'Bronze Claymore', tier: 1, category: 'weapon', subCategory: 'sword-2h', profession: 'Miner', description: 'Heavy two-hand blade', icon: '🗡️', baseStats: { ATK: 22 }, ingredients: [{ itemId: 'copper-ingot', amount: 4 }, { itemId: 'oak-plank', amount: 1 }] },
  { id: 'bastard-sword', name: 'Bastard Sword', tier: 2, category: 'weapon', subCategory: 'sword-2h', profession: 'Miner', description: 'Hand-and-a-half sword', icon: '🗡️', baseStats: { ATK: 40 }, ingredients: [{ itemId: 'iron-ingot', amount: 5 }, { itemId: 'oak-plank', amount: 2 }] },
  { id: 'zweihander', name: 'Zweihander', tier: 3, category: 'weapon', subCategory: 'sword-2h', profession: 'Miner', description: 'German great sword', icon: '🗡️', baseStats: { ATK: 65 }, ingredients: [{ itemId: 'steel-ingot', amount: 5 }, { itemId: 'maple-plank', amount: 2 }] },
  { id: 'nodachi', name: 'Nodachi', tier: 4, category: 'weapon', subCategory: 'sword-2h', profession: 'Miner', description: 'Japanese field sword', icon: '🗡️', baseStats: { ATK: 95 }, ingredients: [{ itemId: 'mithril-ingot', amount: 5 }, { itemId: 'ash-plank', amount: 2 }] },
  { id: 'flamberge', name: 'Flamberge', tier: 5, category: 'weapon', subCategory: 'sword-2h', profession: 'Miner', description: 'Wavy flame blade', icon: '🗡️', baseStats: { ATK: 135 }, ingredients: [{ itemId: 'adamantine-ingot', amount: 6 }, { itemId: 'ironwood-plank', amount: 2 }] },
  { id: 'soul-reaver', name: 'Soul Reaver', tier: 6, category: 'weapon', subCategory: 'sword-2h', profession: 'Miner', description: 'Life-draining blade', icon: '🗡️', baseStats: { ATK: 185 }, ingredients: [{ itemId: 'orichalcum-ingot', amount: 6 }, { itemId: 'ebony-plank', amount: 2 }, { itemId: 'flawless-gem', amount: 1 }] },
  { id: 'cosmos-cleaver', name: 'Cosmos Cleaver', tier: 7, category: 'weapon', subCategory: 'sword-2h', profession: 'Miner', description: 'Reality-splitting blade', icon: '🗡️', baseStats: { ATK: 250 }, ingredients: [{ itemId: 'starmetal-ingot', amount: 7 }, { itemId: 'wyrmwood-plank', amount: 2 }, { itemId: 'radiant-gem', amount: 1 }] },
  { id: 'worldender', name: 'Worldender', tier: 8, category: 'weapon', subCategory: 'sword-2h', profession: 'Miner', description: 'Apocalyptic blade', icon: '🗡️', baseStats: { ATK: 350 }, ingredients: [{ itemId: 'divine-ingot', amount: 8 }, { itemId: 'worldtree-plank', amount: 2 }, { itemId: 'divine-gem', amount: 2 }] },

  // Axes 1H
  { id: 'hatchet', name: 'Hatchet', tier: 1, category: 'weapon', subCategory: 'axe-1h', profession: 'Miner', description: 'Light throwing axe', icon: '🪓', baseStats: { ATK: 18 }, ingredients: [{ itemId: 'copper-ingot', amount: 2 }, { itemId: 'pine-plank', amount: 1 }] },
  { id: 'tomahawk', name: 'Tomahawk', tier: 2, category: 'weapon', subCategory: 'axe-1h', profession: 'Miner', description: 'Balanced throwing axe', icon: '🪓', baseStats: { ATK: 32 }, ingredients: [{ itemId: 'iron-ingot', amount: 3 }, { itemId: 'oak-plank', amount: 1 }] },
  { id: 'cleaver', name: 'Cleaver', tier: 3, category: 'weapon', subCategory: 'axe-1h', profession: 'Miner', description: "Butcher's heavy blade", icon: '🪓', baseStats: { ATK: 52 }, ingredients: [{ itemId: 'steel-ingot', amount: 3 }, { itemId: 'maple-plank', amount: 1 }] },
  { id: 'francisca', name: 'Francisca', tier: 4, category: 'weapon', subCategory: 'axe-1h', profession: 'Miner', description: 'Frankish war axe', icon: '🪓', baseStats: { ATK: 75 }, ingredients: [{ itemId: 'mithril-ingot', amount: 4 }, { itemId: 'ash-plank', amount: 1 }] },
  { id: 'berserker-axe', name: 'Berserker Axe', tier: 5, category: 'weapon', subCategory: 'axe-1h', profession: 'Miner', description: 'Rage-infused axe', icon: '🪓', baseStats: { ATK: 105 }, ingredients: [{ itemId: 'adamantine-ingot', amount: 4 }, { itemId: 'ironwood-plank', amount: 1 }, { itemId: 'refined-essence', amount: 1 }] },
  { id: 'soul-cleaver', name: 'Soul Cleaver', tier: 6, category: 'weapon', subCategory: 'axe-1h', profession: 'Miner', description: 'Spirit-rending axe', icon: '🪓', baseStats: { ATK: 145 }, ingredients: [{ itemId: 'orichalcum-ingot', amount: 5 }, { itemId: 'ebony-plank', amount: 1 }, { itemId: 'flawless-gem', amount: 1 }] },
  { id: 'astral-hatchet', name: 'Astral Hatchet', tier: 7, category: 'weapon', subCategory: 'axe-1h', profession: 'Miner', description: 'Dimensional throwing axe', icon: '🪓', baseStats: { ATK: 195 }, ingredients: [{ itemId: 'starmetal-ingot', amount: 5 }, { itemId: 'wyrmwood-plank', amount: 1 }, { itemId: 'radiant-gem', amount: 1 }] },
  { id: 'godslayer', name: 'Godslayer', tier: 8, category: 'weapon', subCategory: 'axe-1h', profession: 'Miner', description: 'Divine executioner', icon: '🪓', baseStats: { ATK: 275 }, ingredients: [{ itemId: 'divine-ingot', amount: 6 }, { itemId: 'worldtree-plank', amount: 1 }, { itemId: 'divine-gem', amount: 1 }] },

  // Daggers
  { id: 'stiletto', name: 'Stiletto', tier: 1, category: 'weapon', subCategory: 'dagger', profession: 'Miner', description: 'Thin stabbing blade', icon: '🗡️', baseStats: { ATK: 12 }, ingredients: [{ itemId: 'copper-ingot', amount: 1 }, { itemId: 'rawhide', amount: 1 }] },
  { id: 'dirk', name: 'Dirk', tier: 2, category: 'weapon', subCategory: 'dagger', profession: 'Miner', description: 'Scottish fighting knife', icon: '🗡️', baseStats: { ATK: 22 }, ingredients: [{ itemId: 'iron-ingot', amount: 2 }, { itemId: 'thick-hide', amount: 1 }] },
  { id: 'kris', name: 'Kris', tier: 3, category: 'weapon', subCategory: 'dagger', profession: 'Miner', description: 'Wavy ritual dagger', icon: '🗡️', baseStats: { ATK: 36 }, ingredients: [{ itemId: 'steel-ingot', amount: 2 }, { itemId: 'rugged-leather', amount: 1 }] },
  { id: 'tanto', name: 'Tanto', tier: 4, category: 'weapon', subCategory: 'dagger', profession: 'Miner', description: 'Japanese short blade', icon: '🗡️', baseStats: { ATK: 52 }, ingredients: [{ itemId: 'mithril-ingot', amount: 2 }, { itemId: 'hardened-leather', amount: 1 }] },
  { id: 'assassins-fang', name: "Assassin's Fang", tier: 5, category: 'weapon', subCategory: 'dagger', profession: 'Miner', description: 'Poison-grooved blade', icon: '🗡️', baseStats: { ATK: 75 }, ingredients: [{ itemId: 'adamantine-ingot', amount: 3 }, { itemId: 'wyrm-leather', amount: 1 }] },
  { id: 'shadow-kiss', name: 'Shadow Kiss', tier: 6, category: 'weapon', subCategory: 'dagger', profession: 'Miner', description: 'Darkness-touched blade', icon: '🗡️', baseStats: { ATK: 105 }, ingredients: [{ itemId: 'orichalcum-ingot', amount: 3 }, { itemId: 'infernal-leather', amount: 1 }, { itemId: 'void-rune', amount: 1 }] },
  { id: 'starlight-piercer', name: 'Starlight Piercer', tier: 7, category: 'weapon', subCategory: 'dagger', profession: 'Miner', description: 'Light-bending blade', icon: '🗡️', baseStats: { ATK: 145 }, ingredients: [{ itemId: 'starmetal-ingot', amount: 4 }, { itemId: 'titan-leather', amount: 1 }, { itemId: 'radiant-gem', amount: 1 }] },
  { id: 'deaths-whisper', name: "Death's Whisper", tier: 8, category: 'weapon', subCategory: 'dagger', profession: 'Miner', description: 'Silent killing edge', icon: '🗡️', baseStats: { ATK: 200 }, ingredients: [{ itemId: 'divine-ingot', amount: 4 }, { itemId: 'divine-leather', amount: 1 }, { itemId: 'divine-gem', amount: 1 }] },

  // Bows
  { id: 'hunting-bow', name: 'Hunting Bow', tier: 1, category: 'weapon', subCategory: 'bow', profession: 'Forester', description: 'Simple hunting weapon', icon: '🏹', baseStats: { ATK: 14 }, ingredients: [{ itemId: 'pine-plank', amount: 2 }, { itemId: 'string', amount: 2 }] },
  { id: 'shortbow', name: 'Shortbow', tier: 2, category: 'weapon', subCategory: 'bow', profession: 'Forester', description: 'Compact ranged weapon', icon: '🏹', baseStats: { ATK: 26 }, ingredients: [{ itemId: 'oak-plank', amount: 3 }, { itemId: 'bowstring', amount: 1 }] },
  { id: 'composite-bow', name: 'Composite Bow', tier: 3, category: 'weapon', subCategory: 'bow', profession: 'Forester', description: 'Layered material bow', icon: '🏹', baseStats: { ATK: 42 }, ingredients: [{ itemId: 'maple-plank', amount: 3 }, { itemId: 'bowstring', amount: 1 }, { itemId: 'rugged-leather', amount: 1 }] },
  { id: 'recurve-bow', name: 'Recurve Bow', tier: 4, category: 'weapon', subCategory: 'bow', profession: 'Forester', description: 'Curved power bow', icon: '🏹', baseStats: { ATK: 62 }, ingredients: [{ itemId: 'ash-plank', amount: 4 }, { itemId: 'silk-string', amount: 1 }, { itemId: 'hardened-leather', amount: 1 }] },
  { id: 'elven-longbow', name: 'Elven Longbow', tier: 5, category: 'weapon', subCategory: 'bow', profession: 'Forester', description: 'Ancient elven design', icon: '🏹', baseStats: { ATK: 88 }, ingredients: [{ itemId: 'ironwood-plank', amount: 4 }, { itemId: 'silk-string', amount: 2 }, { itemId: 'wyrm-leather', amount: 1 }] },
  { id: 'dragonbone-bow', name: 'Dragonbone Bow', tier: 6, category: 'weapon', subCategory: 'bow', profession: 'Forester', description: 'Wyrm skeleton bow', icon: '🏹', baseStats: { ATK: 120 }, ingredients: [{ itemId: 'ebony-plank', amount: 5 }, { itemId: 'dragon-sinew', amount: 2 }, { itemId: 'infernal-leather', amount: 1 }] },
  { id: 'phoenix-bow', name: 'Phoenix Bow', tier: 7, category: 'weapon', subCategory: 'bow', profession: 'Forester', description: 'Fire-reborn weapon', icon: '🏹', baseStats: { ATK: 165 }, ingredients: [{ itemId: 'wyrmwood-plank', amount: 5 }, { itemId: 'dragon-sinew', amount: 2 }, { itemId: 'phoenix-feathers', amount: 3 }] },
  { id: 'yggdrasil-bow', name: 'Yggdrasil Bow', tier: 8, category: 'weapon', subCategory: 'bow', profession: 'Forester', description: 'World tree weapon', icon: '🏹', baseStats: { ATK: 230 }, ingredients: [{ itemId: 'worldtree-plank', amount: 6 }, { itemId: 'dragon-sinew', amount: 3 }, { itemId: 'divine-leather', amount: 1 }] },

  // Staves
  { id: 'quarterstaff', name: 'Quarterstaff', tier: 1, category: 'weapon', subCategory: 'staff', profession: 'Forester', description: 'Wooden fighting staff', icon: '🪄', baseStats: { ATK: 12, MAG: 8 }, ingredients: [{ itemId: 'pine-plank', amount: 3 }, { itemId: 'string', amount: 1 }] },
  { id: 'bo-staff', name: 'Bo Staff', tier: 2, category: 'weapon', subCategory: 'staff', profession: 'Forester', description: 'Japanese long staff', icon: '🪄', baseStats: { ATK: 22, MAG: 15 }, ingredients: [{ itemId: 'oak-plank', amount: 4 }, { itemId: 'bowstring', amount: 1 }] },
  { id: 'druid-staff', name: 'Druid Staff', tier: 3, category: 'weapon', subCategory: 'staff', profession: 'Forester', description: 'Nature-touched staff', icon: '🪄', baseStats: { ATK: 35, MAG: 25 }, ingredients: [{ itemId: 'maple-plank', amount: 4 }, { itemId: 'greater-essence', amount: 1 }] },
  { id: 'spirit-staff', name: 'Spirit Staff', tier: 4, category: 'weapon', subCategory: 'staff', profession: 'Forester', description: 'Ghost-bound weapon', icon: '🪄', baseStats: { ATK: 50, MAG: 38 }, ingredients: [{ itemId: 'ash-plank', amount: 5 }, { itemId: 'superior-essence', amount: 1 }] },
  { id: 'treant-staff', name: 'Treant Staff', tier: 5, category: 'weapon', subCategory: 'staff', profession: 'Forester', description: 'Living wood staff', icon: '🪄', baseStats: { ATK: 72, MAG: 55 }, ingredients: [{ itemId: 'ironwood-plank', amount: 5 }, { itemId: 'refined-essence', amount: 2 }] },
  { id: 'worldroot-staff', name: 'Worldroot Staff', tier: 6, category: 'weapon', subCategory: 'staff', profession: 'Forester', description: 'Ancient root staff', icon: '🪄', baseStats: { ATK: 100, MAG: 78 }, ingredients: [{ itemId: 'ebony-plank', amount: 6 }, { itemId: 'perfect-essence', amount: 2 }] },
  { id: 'wyrmwood-staff', name: 'Wyrmwood Staff', tier: 7, category: 'weapon', subCategory: 'staff', profession: 'Forester', description: 'Dragon-touched staff', icon: '🪄', baseStats: { ATK: 138, MAG: 108 }, ingredients: [{ itemId: 'wyrmwood-plank', amount: 6 }, { itemId: 'ancient-essence', amount: 2 }] },
  { id: 'yggdrasil-staff', name: 'Yggdrasil Staff', tier: 8, category: 'weapon', subCategory: 'staff', profession: 'Forester', description: 'World tree staff', icon: '🪄', baseStats: { ATK: 190, MAG: 150 }, ingredients: [{ itemId: 'worldtree-plank', amount: 7 }, { itemId: 'divine-essence', amount: 2 }] },

  // Wands
  { id: 'pine-wand', name: 'Pine Wand', tier: 1, category: 'weapon', subCategory: 'wand', profession: 'Mystic', description: 'Basic channeling wand', icon: '🪄', baseStats: { MAG: 15 }, ingredients: [{ itemId: 'pine-plank', amount: 1 }, { itemId: 'minor-essence', amount: 2 }] },
  { id: 'oak-wand', name: 'Oak Wand', tier: 2, category: 'weapon', subCategory: 'wand', profession: 'Mystic', description: 'Sturdy focus wand', icon: '🪄', baseStats: { MAG: 28 }, ingredients: [{ itemId: 'oak-plank', amount: 2 }, { itemId: 'lesser-essence', amount: 2 }] },
  { id: 'willow-wand', name: 'Willow Wand', tier: 3, category: 'weapon', subCategory: 'wand', profession: 'Mystic', description: 'Flexible magic focus', icon: '🪄', baseStats: { MAG: 45 }, ingredients: [{ itemId: 'maple-plank', amount: 2 }, { itemId: 'greater-essence', amount: 2 }] },
  { id: 'elder-wand', name: 'Elder Wand', tier: 4, category: 'weapon', subCategory: 'wand', profession: 'Mystic', description: 'Ancient power focus', icon: '🪄', baseStats: { MAG: 68 }, ingredients: [{ itemId: 'ash-plank', amount: 3 }, { itemId: 'superior-essence', amount: 2 }] },
  { id: 'moon-wand', name: 'Moon Wand', tier: 5, category: 'weapon', subCategory: 'wand', profession: 'Mystic', description: 'Lunar-infused focus', icon: '🪄', baseStats: { MAG: 95 }, ingredients: [{ itemId: 'ironwood-plank', amount: 3 }, { itemId: 'refined-essence', amount: 2 }, { itemId: 'moonweave-cloth', amount: 1 }] },
  { id: 'star-wand', name: 'Star Wand', tier: 6, category: 'weapon', subCategory: 'wand', profession: 'Mystic', description: 'Celestial focus', icon: '🪄', baseStats: { MAG: 130 }, ingredients: [{ itemId: 'ebony-plank', amount: 3 }, { itemId: 'perfect-essence', amount: 2 }, { itemId: 'starweave-cloth', amount: 1 }] },
  { id: 'void-wand', name: 'Void Wand', tier: 7, category: 'weapon', subCategory: 'wand', profession: 'Mystic', description: 'Dimension-bending focus', icon: '🪄', baseStats: { MAG: 175 }, ingredients: [{ itemId: 'wyrmwood-plank', amount: 4 }, { itemId: 'ancient-essence', amount: 2 }, { itemId: 'voidweave-cloth', amount: 1 }] },
  { id: 'divine-wand', name: 'Divine Wand', tier: 8, category: 'weapon', subCategory: 'wand', profession: 'Mystic', description: 'Holy power focus', icon: '🪄', baseStats: { MAG: 245 }, ingredients: [{ itemId: 'worldtree-plank', amount: 4 }, { itemId: 'divine-essence', amount: 3 }, { itemId: 'divine-cloth', amount: 1 }] },

  // Orbs
  { id: 'glass-orb', name: 'Glass Orb', tier: 1, category: 'weapon', subCategory: 'orb', profession: 'Mystic', description: 'Clear focus sphere', icon: '🔮', baseStats: { MAG: 12 }, ingredients: [{ itemId: 'rough-gem', amount: 1 }, { itemId: 'linen-cloth', amount: 1 }] },
  { id: 'crystal-ball', name: 'Crystal Ball', tier: 2, category: 'weapon', subCategory: 'orb', profession: 'Mystic', description: 'Scrying sphere', icon: '🔮', baseStats: { MAG: 24 }, ingredients: [{ itemId: 'flawed-gem', amount: 2 }, { itemId: 'wool-cloth', amount: 1 }] },
  { id: 'amethyst-focus', name: 'Amethyst Focus', tier: 3, category: 'weapon', subCategory: 'orb', profession: 'Mystic', description: 'Purple power orb', icon: '🔮', baseStats: { MAG: 40 }, ingredients: [{ itemId: 'standard-gem', amount: 2 }, { itemId: 'cotton-cloth', amount: 1 }] },
  { id: 'moonstone-orb', name: 'Moonstone Orb', tier: 4, category: 'weapon', subCategory: 'orb', profession: 'Mystic', description: 'Lunar focus orb', icon: '🔮', baseStats: { MAG: 60 }, ingredients: [{ itemId: 'fine-gem', amount: 2 }, { itemId: 'silk-cloth', amount: 1 }] },
  { id: 'starlight-sphere', name: 'Starlight Sphere', tier: 5, category: 'weapon', subCategory: 'orb', profession: 'Mystic', description: 'Celestial orb', icon: '🔮', baseStats: { MAG: 85 }, ingredients: [{ itemId: 'pristine-gem', amount: 2 }, { itemId: 'moonweave-cloth', amount: 1 }] },
  { id: 'void-sphere', name: 'Void Sphere', tier: 6, category: 'weapon', subCategory: 'orb', profession: 'Mystic', description: 'Dark dimension orb', icon: '🔮', baseStats: { MAG: 120 }, ingredients: [{ itemId: 'flawless-gem', amount: 2 }, { itemId: 'starweave-cloth', amount: 1 }] },
  { id: 'cosmos-orb', name: 'Cosmos Orb', tier: 7, category: 'weapon', subCategory: 'orb', profession: 'Mystic', description: 'Universe-reflecting orb', icon: '🔮', baseStats: { MAG: 165 }, ingredients: [{ itemId: 'radiant-gem', amount: 2 }, { itemId: 'voidweave-cloth', amount: 1 }] },
  { id: 'divine-sphere', name: 'Divine Sphere', tier: 8, category: 'weapon', subCategory: 'orb', profession: 'Mystic', description: 'Holy power sphere', icon: '🔮', baseStats: { MAG: 230 }, ingredients: [{ itemId: 'divine-gem', amount: 2 }, { itemId: 'divine-cloth', amount: 1 }] },

  // Hammers 1H
  { id: 'mallet', name: 'Mallet', tier: 1, category: 'weapon', subCategory: 'hammer-1h', profession: 'Engineer', description: 'Light work hammer', icon: '🔨', baseStats: { ATK: 14 }, ingredients: [{ itemId: 'copper-ingot', amount: 2 }, { itemId: 'pine-plank', amount: 1 }] },
  { id: 'claw-hammer', name: 'Claw Hammer', tier: 2, category: 'weapon', subCategory: 'hammer-1h', profession: 'Engineer', description: 'Dual-purpose hammer', icon: '🔨', baseStats: { ATK: 26 }, ingredients: [{ itemId: 'iron-ingot', amount: 2 }, { itemId: 'oak-plank', amount: 1 }] },
  { id: 'ball-peen', name: 'Ball Peen Hammer', tier: 3, category: 'weapon', subCategory: 'hammer-1h', profession: 'Engineer', description: 'Metalworking hammer', icon: '🔨', baseStats: { ATK: 42 }, ingredients: [{ itemId: 'steel-ingot', amount: 3 }, { itemId: 'maple-plank', amount: 1 }] },
  { id: 'engineers-hammer', name: "Engineer's Hammer", tier: 4, category: 'weapon', subCategory: 'hammer-1h', profession: 'Engineer', description: 'Precision tool', icon: '🔨', baseStats: { ATK: 62 }, ingredients: [{ itemId: 'mithril-ingot', amount: 3 }, { itemId: 'ash-plank', amount: 1 }, { itemId: 'precision-gear', amount: 1 }] },
  { id: 'steamhammer', name: 'Steam Hammer', tier: 5, category: 'weapon', subCategory: 'hammer-1h', profession: 'Engineer', description: 'Power-assisted hammer', icon: '🔨', baseStats: { ATK: 88 }, ingredients: [{ itemId: 'adamantine-ingot', amount: 4 }, { itemId: 'ironwood-plank', amount: 1 }, { itemId: 'clockwork-core', amount: 1 }] },
  { id: 'thunder-mallet', name: 'Thunder Mallet', tier: 6, category: 'weapon', subCategory: 'hammer-1h', profession: 'Engineer', description: 'Lightning-charged hammer', icon: '🔨', baseStats: { ATK: 120 }, ingredients: [{ itemId: 'orichalcum-ingot', amount: 4 }, { itemId: 'ebony-plank', amount: 1 }, { itemId: 'arcane-gear', amount: 1 }] },
  { id: 'void-hammer', name: 'Void Hammer', tier: 7, category: 'weapon', subCategory: 'hammer-1h', profession: 'Engineer', description: 'Reality-bending hammer', icon: '🔨', baseStats: { ATK: 165 }, ingredients: [{ itemId: 'starmetal-ingot', amount: 5 }, { itemId: 'wyrmwood-plank', amount: 1 }, { itemId: 'void-gear', amount: 1 }] },
  { id: 'mjolnir', name: 'Mjolnir', tier: 8, category: 'weapon', subCategory: 'hammer-1h', profession: 'Engineer', description: "Thor's divine hammer", icon: '🔨', baseStats: { ATK: 230 }, ingredients: [{ itemId: 'divine-ingot', amount: 5 }, { itemId: 'worldtree-plank', amount: 1 }, { itemId: 'divine-gear', amount: 1 }] },

  // Hammers 2H
  { id: 'sledgehammer', name: 'Sledgehammer', tier: 1, category: 'weapon', subCategory: 'hammer-2h', profession: 'Engineer', description: 'Heavy demolition hammer', icon: '⚒️', baseStats: { ATK: 20 }, ingredients: [{ itemId: 'copper-ingot', amount: 4 }, { itemId: 'pine-plank', amount: 2 }] },
  { id: 'maul', name: 'Maul', tier: 2, category: 'weapon', subCategory: 'hammer-2h', profession: 'Engineer', description: 'Crushing war hammer', icon: '⚒️', baseStats: { ATK: 38 }, ingredients: [{ itemId: 'iron-ingot', amount: 5 }, { itemId: 'oak-plank', amount: 2 }] },
  { id: 'great-maul', name: 'Great Maul', tier: 3, category: 'weapon', subCategory: 'hammer-2h', profession: 'Engineer', description: 'Massive war hammer', icon: '⚒️', baseStats: { ATK: 62 }, ingredients: [{ itemId: 'steel-ingot', amount: 6 }, { itemId: 'maple-plank', amount: 2 }] },
  { id: 'earthshaker', name: 'Earthshaker', tier: 4, category: 'weapon', subCategory: 'hammer-2h', profession: 'Engineer', description: 'Ground-pounding hammer', icon: '⚒️', baseStats: { ATK: 92 }, ingredients: [{ itemId: 'mithril-ingot', amount: 6 }, { itemId: 'ash-plank', amount: 2 }, { itemId: 'precision-gear', amount: 2 }] },
  { id: 'titan-hammer', name: 'Titan Hammer', tier: 5, category: 'weapon', subCategory: 'hammer-2h', profession: 'Engineer', description: "Giant's weapon", icon: '⚒️', baseStats: { ATK: 130 }, ingredients: [{ itemId: 'adamantine-ingot', amount: 7 }, { itemId: 'ironwood-plank', amount: 2 }, { itemId: 'clockwork-core', amount: 1 }] },
  { id: 'worldbreaker', name: 'Worldbreaker', tier: 6, category: 'weapon', subCategory: 'hammer-2h', profession: 'Engineer', description: 'Reality-cracking hammer', icon: '⚒️', baseStats: { ATK: 180 }, ingredients: [{ itemId: 'orichalcum-ingot', amount: 7 }, { itemId: 'ebony-plank', amount: 2 }, { itemId: 'arcane-gear', amount: 2 }] },
  { id: 'starcrusher', name: 'Starcrusher', tier: 7, category: 'weapon', subCategory: 'hammer-2h', profession: 'Engineer', description: 'Celestial demolisher', icon: '⚒️', baseStats: { ATK: 248 }, ingredients: [{ itemId: 'starmetal-ingot', amount: 8 }, { itemId: 'wyrmwood-plank', amount: 2 }, { itemId: 'void-gear', amount: 2 }] },
  { id: 'godforge-hammer', name: 'Godforge Hammer', tier: 8, category: 'weapon', subCategory: 'hammer-2h', profession: 'Engineer', description: "Divine smith's hammer", icon: '⚒️', baseStats: { ATK: 345 }, ingredients: [{ itemId: 'divine-ingot', amount: 9 }, { itemId: 'worldtree-plank', amount: 2 }, { itemId: 'divine-gear', amount: 2 }] },

  // Pistols
  { id: 'flintlock-pistol', name: 'Flintlock Pistol', tier: 1, category: 'weapon', subCategory: 'gun-pistol', profession: 'Engineer', description: 'Single-shot firearm', icon: '🔫', baseStats: { ATK: 18 }, ingredients: [{ itemId: 'copper-ingot', amount: 2 }, { itemId: 'gunpowder', amount: 2 }, { itemId: 'lens', amount: 1 }] },
  { id: 'dueling-pistol', name: 'Dueling Pistol', tier: 2, category: 'weapon', subCategory: 'gun-pistol', profession: 'Engineer', description: 'Accurate handgun', icon: '🔫', baseStats: { ATK: 34 }, ingredients: [{ itemId: 'iron-ingot', amount: 3 }, { itemId: 'refined-gunpowder', amount: 2 }, { itemId: 'lens', amount: 1 }] },
  { id: 'revolver', name: 'Revolver', tier: 3, category: 'weapon', subCategory: 'gun-pistol', profession: 'Engineer', description: 'Six-shooter pistol', icon: '🔫', baseStats: { ATK: 55 }, ingredients: [{ itemId: 'steel-ingot', amount: 4 }, { itemId: 'black-powder', amount: 3 }, { itemId: 'spring', amount: 2 }] },
  { id: 'repeater-pistol', name: 'Repeater Pistol', tier: 4, category: 'weapon', subCategory: 'gun-pistol', profession: 'Engineer', description: 'Semi-auto handgun', icon: '🔫', baseStats: { ATK: 82 }, ingredients: [{ itemId: 'mithril-ingot', amount: 4 }, { itemId: 'flash-powder', amount: 3 }, { itemId: 'precision-gear', amount: 1 }] },
  { id: 'clockwork-pistol', name: 'Clockwork Pistol', tier: 5, category: 'weapon', subCategory: 'gun-pistol', profession: 'Engineer', description: 'Mechanical marvel', icon: '🔫', baseStats: { ATK: 115 }, ingredients: [{ itemId: 'adamantine-ingot', amount: 5 }, { itemId: 'thunder-powder', amount: 3 }, { itemId: 'clockwork-core', amount: 1 }] },
  { id: 'plasma-pistol', name: 'Plasma Pistol', tier: 6, category: 'weapon', subCategory: 'gun-pistol', profession: 'Engineer', description: 'Energy handgun', icon: '🔫', baseStats: { ATK: 160 }, ingredients: [{ itemId: 'orichalcum-ingot', amount: 5 }, { itemId: 'arcane-powder', amount: 4 }, { itemId: 'circuit', amount: 2 }] },
  { id: 'void-pistol', name: 'Void Pistol', tier: 7, category: 'weapon', subCategory: 'gun-pistol', profession: 'Engineer', description: 'Dimension-piercing gun', icon: '🔫', baseStats: { ATK: 220 }, ingredients: [{ itemId: 'starmetal-ingot', amount: 6 }, { itemId: 'void-powder', amount: 4 }, { itemId: 'quantum-circuit', amount: 1 }] },
  { id: 'divine-pistol', name: 'Divine Pistol', tier: 8, category: 'weapon', subCategory: 'gun-pistol', profession: 'Engineer', description: 'Holy handcannon', icon: '🔫', baseStats: { ATK: 305 }, ingredients: [{ itemId: 'divine-ingot', amount: 6 }, { itemId: 'divine-powder', amount: 5 }, { itemId: 'quantum-circuit', amount: 2 }] },
];

export function getWeaponById(id: string): Weapon | undefined {
  return WEAPONS.find(w => w.id === id);
}

export function getWeaponsByTier(tier: number): Weapon[] {
  return WEAPONS.filter(w => w.tier === tier);
}

export function getWeaponsByCategory(subCategory: string): Weapon[] {
  return WEAPONS.filter(w => w.subCategory === subCategory);
}
