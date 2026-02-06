// Grudge Warlords - Game State Management (Zustand)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, ClassType, RaceType } from '../data/characters';
import { createCharacter, levelUp, allocateAttributePoint } from '../data/characters';
import type { Weapon } from '../data/weapons';
import { WEAPONS } from '../data/weapons';
import type { EnemyInstance } from '../systems/enemies';
import { generateEncounter, ZONES } from '../systems/enemies';
import type { Combatant, CombatResult } from '../systems/combat';
import { processCombatRound, createCombatantFromCharacter } from '../systems/combat';
import { getSkillById } from '../data/skillTrees';
import type { PlayerProfile, CharacterMetadata } from '../types/player';
import { initializePlayer, createCharacterOnBackend, saveCharacterProgress } from '../services/api';

export type GameScreen = 'main_menu' | 'character_creation' | 'game' | 'combat' | 'inventory' | 'skills' | 'world_map' | 'boat';

export interface InventoryItem {
  id: string;
  itemId: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'material';
  quantity: number;
  equipped?: boolean;
}

export interface QuestProgress {
  questId: string;
  objectives: Record<string, number>;
  completed: boolean;
}

export interface GameState {
  // Player profile
  playerProfile: PlayerProfile | null;
  characterMetadata: CharacterMetadata | null;
  
  // Core state
  screen: GameScreen;
  character: Character | null;
  gold: number;
  experience: number;
  experienceToLevel: number;
  
  // Inventory
  inventory: InventoryItem[];
  equippedWeapon: Weapon | null;
  equippedArmor: Record<string, InventoryItem>;
  
  // Combat
  inCombat: boolean;
  enemies: EnemyInstance[];
  combatLog: string[];
  playerCombatant: Combatant | null;
  skillCooldowns: Record<string, number>; // skillId -> turns remaining
  
  // World
  currentZone: string;
  unlockedZones: string[];
  boatUnlocked: boolean;
  
  // Skills
  skillPoints: number;
  unlockedSkills: string[];
  
  // Quests
  activeQuests: QuestProgress[];
  completedQuests: string[];
  
  // Game time
  gameTime: number; // In-game minutes
  playTime: number; // Real seconds played
  
  // Actions
  setScreen: (screen: GameScreen) => void;
  initializePlayerProfile: (walletAddress?: string) => Promise<void>;
  createNewCharacter: (name: string, race: RaceType, classType: ClassType) => Promise<void>;
  saveGameToBackend: () => Promise<boolean>;
  connectWalletToProfile: (walletAddress: string) => Promise<boolean>;
  gainExperience: (amount: number) => void;
  gainGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  
  // Inventory actions
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  equipWeapon: (weaponId: string) => void;
  unequipWeapon: () => void;
  
  // Combat actions
  startCombat: (zoneId?: string) => void;
  endCombat: (victory: boolean) => void;
  playerAttack: (abilityId?: string) => CombatResult | null;
  useSkill: (skillId: string) => CombatResult | null;
  enemyTurn: () => void;
  addCombatLog: (message: string) => void;
  tickCooldowns: () => void;
  
  // World actions
  travelToZone: (zoneId: string) => void;
  unlockZone: (zoneId: string) => void;
  unlockBoat: () => void;
  
  // Skill actions
  unlockSkill: (skillId: string) => boolean;
  useSkillPoint: () => boolean;
  
  // Character actions
  allocateAttribute: (attribute: 'STR' | 'DEX' | 'INT' | 'VIT' | 'WIS' | 'AGI' | 'END' | 'LCK') => void;
  healCharacter: (amount: number) => void;
  restoreMana: (amount: number) => void;
  
  // Game actions
  tickGameTime: (minutes: number) => void;
  tickPlayTime: (seconds: number) => void;
  resetGame: () => void;
  saveGame: () => void;
}

const INITIAL_STATE = {
  playerProfile: null,
  characterMetadata: null,
  screen: 'main_menu' as GameScreen,
  character: null,
  gold: 100,
  experience: 0,
  experienceToLevel: 100,
  inventory: [],
  equippedWeapon: null,
  equippedArmor: {},
  inCombat: false,
  enemies: [],
  combatLog: [],
  playerCombatant: null,
  skillCooldowns: {},
  currentZone: 'bandit_camp',
  unlockedZones: ['bandit_camp', 'goblin_cave'],
  boatUnlocked: false,
  skillPoints: 0,
  unlockedSkills: [],
  activeQuests: [],
  completedQuests: [],
  gameTime: 0,
  playTime: 0,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setScreen: (screen) => set({ screen }),

      initializePlayerProfile: async (walletAddress) => {
        try {
          const profile = await initializePlayer(walletAddress);
          set({ playerProfile: profile });
        } catch (error) {
          console.error('Failed to initialize player profile:', error);
        }
      },

      createNewCharacter: async (name, race, classType) => {
        const state = get();
        
        // Ensure player profile exists
        if (!state.playerProfile) {
          await get().initializePlayerProfile();
        }
        
        const profile = get().playerProfile;
        if (!profile) {
          console.error('Failed to initialize player profile');
          return;
        }

        // Create character locally first
        const character = createCharacter(name, race, classType);
        
        // Give starter weapon based on class
        let starterWeapon: Weapon | undefined;
        switch (classType) {
          case 'warrior':
            starterWeapon = WEAPONS.find(w => w.id === 'copper-sword-1h');
            break;
          case 'mage':
            starterWeapon = WEAPONS.find(w => w.id === 'copper-staff');
            break;
          case 'ranger':
            starterWeapon = WEAPONS.find(w => w.id === 'copper-bow');
            break;
          case 'worg':
            starterWeapon = WEAPONS.find(w => w.id === 'copper-axe-1h');
            break;
        }
        
        // Determine if we should create CNFT or save to database
        const shouldCreateNFT = !profile.isGuest && profile.walletAddress !== null;
        
        try {
          // Send creation request to backend
          const response = await createCharacterOnBackend({
            name,
            race,
            classType,
            grudgeId: profile.grudgeId,
            walletAddress: profile.walletAddress || undefined,
            createAsNFT: shouldCreateNFT
          });

          if (response.success) {
            // Update character metadata
            set({
              character,
              characterMetadata: response.metadata,
              screen: 'game',
              equippedWeapon: starterWeapon || null,
              gold: 100,
              experience: 0,
              experienceToLevel: 100,
              inventory: [],
              skillPoints: 1,
              unlockedSkills: [],
            });

            if (shouldCreateNFT) {
              console.log('✨ Character minted as CNFT!', response.nftData);
            } else {
              console.log('💾 Character saved to database!');
            }
          } else {
            console.error('Failed to create character on backend:', response.error);
            // Still allow local play
            set({
              character,
              screen: 'game',
              equippedWeapon: starterWeapon || null,
              gold: 100,
              experience: 0,
              experienceToLevel: 100,
              inventory: [],
              skillPoints: 1,
              unlockedSkills: [],
            });
          }
        } catch (error) {
          console.error('Error creating character:', error);
          // Fallback to local-only character
          set({
            character,
            screen: 'game',
            equippedWeapon: starterWeapon || null,
            gold: 100,
            experience: 0,
            experienceToLevel: 100,
            inventory: [],
            skillPoints: 1,
            unlockedSkills: [],
          });
        }
      },

      saveGameToBackend: async () => {
        const state = get();
        if (!state.character || !state.playerProfile) {
          return false;
        }

        try {
          const success = await saveCharacterProgress(
            state.character,
            state.playerProfile.grudgeId
          );
          
          if (success) {
            console.log('Game progress saved to backend!');
          }
          return success;
        } catch (error) {
          console.error('Failed to save game to backend:', error);
          return false;
        }
      },

      connectWalletToProfile: async (walletAddress: string) => {
        const state = get();
        if (!state.playerProfile) {
          return false;
        }

        try {
          const { connectWallet } = await import('../services/api');
          const success = await connectWallet(state.playerProfile.grudgeId, walletAddress);
          
          if (success) {
            set({
              playerProfile: {
                ...state.playerProfile,
                walletAddress,
                isGuest: false
              }
            });
          }
          return success;
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          return false;
        }
      },

      gainExperience: (amount) => {
        const state = get();
        if (!state.character) return;
        
        let newExp = state.experience + amount;
        let newExpToLevel = state.experienceToLevel;
        let character = { ...state.character };
        let skillPoints = state.skillPoints;
        
        // Level up loop
        while (newExp >= newExpToLevel && character.level < 20) {
          newExp -= newExpToLevel;
          character = levelUp(character);
          newExpToLevel = Math.floor(newExpToLevel * 1.5);
          skillPoints += 1;
        }
        
        set({
          experience: newExp,
          experienceToLevel: newExpToLevel,
          character,
          skillPoints,
        });
      },

      gainGold: (amount) => set((state) => ({ gold: state.gold + amount })),

      spendGold: (amount) => {
        const state = get();
        if (state.gold >= amount) {
          set({ gold: state.gold - amount });
          return true;
        }
        return false;
      },

      addItem: (item) => set((state) => {
        const existing = state.inventory.find(i => i.itemId === item.itemId);
        if (existing && item.type !== 'weapon' && item.type !== 'armor') {
          return {
            inventory: state.inventory.map(i =>
              i.itemId === item.itemId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          };
        }
        return {
          inventory: [...state.inventory, { ...item, id: `${item.itemId}_${Date.now()}` }],
        };
      }),

      removeItem: (itemId, quantity = 1) => set((state) => {
        const item = state.inventory.find(i => i.id === itemId);
        if (!item) return state;
        
        if (item.quantity <= quantity) {
          return { inventory: state.inventory.filter(i => i.id !== itemId) };
        }
        return {
          inventory: state.inventory.map(i =>
            i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i
          ),
        };
      }),

      equipWeapon: (weaponId) => {
        const weapon = WEAPONS.find(w => w.id === weaponId);
        if (weapon) {
          set({ equippedWeapon: weapon });
        }
      },

      unequipWeapon: () => set({ equippedWeapon: null }),

      startCombat: (zoneId) => {
        const state = get();
        if (!state.character) return;
        
        const zone = zoneId || state.currentZone;
        const enemies = generateEncounter(zone, state.character.level);
        const weaponStats = state.equippedWeapon ? {
          minDamage: Math.floor((state.equippedWeapon.baseStats.ATK || 0) * 0.8 + (state.equippedWeapon.baseStats.MAG || 0) * 0.8),
          maxDamage: Math.ceil((state.equippedWeapon.baseStats.ATK || 0) * 1.2 + (state.equippedWeapon.baseStats.MAG || 0) * 1.2)
        } : null;
        const playerCombatant = createCombatantFromCharacter(state.character, weaponStats);
        
        set({
          inCombat: true,
          enemies,
          playerCombatant,
          combatLog: [`Combat started in ${ZONES.find(z => z.id === zone)?.name || zone}!`],
          screen: 'combat',
        });
      },

      endCombat: (victory) => {
        const state = get();
        if (!state.character) return;
        
        if (victory) {
          // Calculate rewards
          const expGain = state.enemies.reduce((sum, e) => sum + e.level * 15, 0);
          const goldGain = state.enemies.reduce((sum, e) => {
            const goldDrop = e.lootTable.find(l => l.itemId === 'gold');
            if (goldDrop) {
              return sum + Math.floor(Math.random() * (goldDrop.maxQuantity - goldDrop.minQuantity + 1)) + goldDrop.minQuantity;
            }
            return sum;
          }, 0);
          
          get().gainExperience(expGain);
          get().gainGold(goldGain);
          get().addCombatLog(`Victory! Gained ${expGain} XP and ${goldGain} gold.`);
        } else {
          get().addCombatLog('Defeated! You retreat to safety...');
        }
        
        // Restore some HP/Mana on combat end
        if (state.character) {
          const healAmount = Math.floor(state.character.maxHp * 0.2);
          const manaAmount = Math.floor(state.character.maxMana * 0.2);
          get().healCharacter(healAmount);
          get().restoreMana(manaAmount);
        }
        
        set({
          inCombat: false,
          enemies: [],
          playerCombatant: null,
          screen: 'game',
        });
      },

      playerAttack: (_abilityId) => {
        const state = get();
        if (!state.playerCombatant || state.enemies.length === 0) return null;
        
        const target = state.enemies[0]; // Target first enemy
        const result = processCombatRound(state.playerCombatant, target);
        
        // Update combat log
        get().addCombatLog(`You deal ${result.damage} damage to ${target.name}!`);
        if (result.isCritical) get().addCombatLog('Critical hit!');
        
        // Update enemy HP
        const updatedEnemies = state.enemies.map((e, i) => {
          if (i === 0) {
            return { ...e, hp: Math.max(0, e.hp - result.damage) };
          }
          return e;
        }).filter(e => e.hp > 0);
        
        // Check for victory
        if (updatedEnemies.length === 0) {
          set({ enemies: updatedEnemies });
          get().endCombat(true);
          return result;
        }
        
        set({ enemies: updatedEnemies });
        
        // Enemy turn
        get().enemyTurn();
        
        return result;
      },

      enemyTurn: () => {
        const state = get();
        if (!state.playerCombatant || state.enemies.length === 0) return;
        
        let totalDamage = 0;
        const newCombatLogs: string[] = [];
        
        for (const enemy of state.enemies) {
          const result = processCombatRound(enemy, state.playerCombatant);
          totalDamage += result.damage;
          newCombatLogs.push(`${enemy.name} deals ${result.damage} damage to you!`);
          if (result.isCritical) newCombatLogs.push(`${enemy.name} lands a critical hit!`);
        }
        
        // Update player HP
        const newPlayerHp = Math.max(0, state.playerCombatant.hp - totalDamage);
        const updatedPlayer = { ...state.playerCombatant, hp: newPlayerHp };
        
        // Update character HP too
        if (state.character) {
          set({
            character: { ...state.character, hp: newPlayerHp },
            playerCombatant: updatedPlayer,
            combatLog: [...state.combatLog, ...newCombatLogs],
          });
        }
        
        // Check for defeat
        if (newPlayerHp <= 0) {
          get().endCombat(false);
        }
      },

      addCombatLog: (message) => set((state) => ({
        combatLog: [...state.combatLog.slice(-20), message], // Keep last 20 messages
      })),

      useSkill: (skillId) => {
        const state = get();
        if (!state.playerCombatant || !state.character || state.enemies.length === 0) return null;
        
        // Check if skill is unlocked
        if (!state.unlockedSkills.includes(skillId)) {
          get().addCombatLog('Skill not learned!');
          return null;
        }
        
        // Get skill data
        const skill = getSkillById(skillId);
        if (!skill) {
          get().addCombatLog('Invalid skill!');
          return null;
        }
        
        // Check cooldown
        const cooldownRemaining = state.skillCooldowns[skillId] || 0;
        if (cooldownRemaining > 0) {
          get().addCombatLog(`${skill.name} on cooldown (${cooldownRemaining} turns)!`);
          return null;
        }
        
        // Check mana cost
        if (skill.manaCost && state.character.mana < skill.manaCost) {
          get().addCombatLog(`Not enough mana for ${skill.name}!`);
          return null;
        }
        
        // Check stamina cost
        if (skill.staminaCost && state.character.stamina < skill.staminaCost) {
          get().addCombatLog(`Not enough stamina for ${skill.name}!`);
          return null;
        }
        
        // Consume resources
        const newMana = state.character.mana - (skill.manaCost || 0);
        const newStamina = state.character.stamina - (skill.staminaCost || 0);
        
        // Calculate skill damage
        const target = state.enemies[0];
        const baseResult = processCombatRound(state.playerCombatant, target);
        
        // Apply skill multiplier from effects
        let damageMultiplier = 1;
        let healAmount = 0;
        const effectMessages: string[] = [];
        
        for (const effect of skill.effects) {
          if (effect.type === 'damage') {
            damageMultiplier = effect.value / 100;
          } else if (effect.type === 'heal') {
            healAmount = Math.floor(state.character.maxHp * (effect.value / 100));
            effectMessages.push(`Healed for ${healAmount} HP!`);
          } else if (effect.type === 'buff') {
            effectMessages.push(`Applied ${effect.description}`);
          } else if (effect.type === 'debuff') {
            effectMessages.push(`Enemy ${effect.description}`);
          }
        }
        
        const skillDamage = Math.floor(baseResult.damage * damageMultiplier);
        
        // Set cooldown (convert seconds to turns, ~3 sec per turn)
        const cooldownTurns = skill.cooldown ? Math.ceil(skill.cooldown / 3) : 0;
        
        // Log the skill use
        get().addCombatLog(`⚡ ${skill.name}! Dealt ${skillDamage} damage!`);
        effectMessages.forEach(msg => get().addCombatLog(msg));
        
        // Update enemy HP
        const updatedEnemies = state.enemies.map((e, i) => {
          if (i === 0) {
            return { ...e, hp: Math.max(0, e.hp - skillDamage) };
          }
          return e;
        }).filter(e => e.hp > 0);
        
        // Apply healing if any
        const healedHp = healAmount > 0 
          ? Math.min(state.character.maxHp, state.character.hp + healAmount)
          : state.character.hp;
        
        // Update state
        set({
          character: { 
            ...state.character, 
            mana: newMana, 
            stamina: newStamina,
            hp: healedHp
          },
          playerCombatant: {
            ...state.playerCombatant,
            mana: newMana,
            stamina: newStamina,
            hp: healedHp
          },
          enemies: updatedEnemies,
          skillCooldowns: {
            ...state.skillCooldowns,
            [skillId]: cooldownTurns
          }
        });
        
        // Check for victory
        if (updatedEnemies.length === 0) {
          get().endCombat(true);
          return { damage: skillDamage, isCritical: baseResult.isCritical, isBlocked: false, isMiss: false, effects: [] };
        }
        
        // Enemy turn
        get().enemyTurn();
        get().tickCooldowns();
        
        return { damage: skillDamage, isCritical: baseResult.isCritical, isBlocked: false, isMiss: false, effects: [] };
      },

      tickCooldowns: () => set((state) => {
        const newCooldowns: Record<string, number> = {};
        for (const [skillId, turns] of Object.entries(state.skillCooldowns)) {
          if (turns > 1) {
            newCooldowns[skillId] = turns - 1;
          }
        }
        return { skillCooldowns: newCooldowns };
      }),

      travelToZone: (zoneId) => {
        const state = get();
        if (state.unlockedZones.includes(zoneId)) {
          set({ currentZone: zoneId });
        }
      },

      unlockZone: (zoneId) => set((state) => ({
        unlockedZones: state.unlockedZones.includes(zoneId)
          ? state.unlockedZones
          : [...state.unlockedZones, zoneId],
      })),

      unlockBoat: () => set({ boatUnlocked: true }),

      unlockSkill: (skillId) => {
        const state = get();
        if (state.skillPoints > 0 && !state.unlockedSkills.includes(skillId)) {
          set({
            skillPoints: state.skillPoints - 1,
            unlockedSkills: [...state.unlockedSkills, skillId],
          });
          return true;
        }
        return false;
      },

      useSkillPoint: () => {
        const state = get();
        if (state.skillPoints > 0) {
          set({ skillPoints: state.skillPoints - 1 });
          return true;
        }
        return false;
      },

      allocateAttribute: (attribute) => {
        const state = get();
        if (!state.character || state.character.attributePoints <= 0) return;
        
        const updatedCharacter = allocateAttributePoint(state.character, attribute);
        set({ character: updatedCharacter });
      },

      healCharacter: (amount) => set((state) => {
        if (!state.character) return state;
        return {
          character: {
            ...state.character,
            hp: Math.min(state.character.maxHp, state.character.hp + amount),
          },
        };
      }),

      restoreMana: (amount) => set((state) => {
        if (!state.character) return state;
        return {
          character: {
            ...state.character,
            mana: Math.min(state.character.maxMana, state.character.mana + amount),
          },
        };
      }),

      tickGameTime: (minutes) => set((state) => ({ gameTime: state.gameTime + minutes })),

      tickPlayTime: (seconds) => set((state) => ({ playTime: state.playTime + seconds })),

      resetGame: () => set(INITIAL_STATE),

      saveGame: () => {
        // Persisted automatically by zustand/persist
        console.log('Game saved!');
      },
    }),
    {
      name: 'grudge-warlords-save',
      partialize: (state) => ({
        playerProfile: state.playerProfile,
        characterMetadata: state.characterMetadata,
        character: state.character,
        gold: state.gold,
        experience: state.experience,
        experienceToLevel: state.experienceToLevel,
        inventory: state.inventory,
        equippedWeapon: state.equippedWeapon,
        equippedArmor: state.equippedArmor,
        currentZone: state.currentZone,
        unlockedZones: state.unlockedZones,
        boatUnlocked: state.boatUnlocked,
        skillPoints: state.skillPoints,
        unlockedSkills: state.unlockedSkills,
        activeQuests: state.activeQuests,
        completedQuests: state.completedQuests,
        gameTime: state.gameTime,
        playTime: state.playTime,
      }),
    }
  )
);
