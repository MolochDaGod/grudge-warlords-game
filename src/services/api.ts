// Grudge Warlords - Supabase + Crossmint API Service

import { supabase } from './supabase';
import type { DbPlayer, DbCharacter } from './supabase';
import type { 
  CharacterCreationRequest, 
  CharacterCreationResponse,
  PlayerProfile,
  SolanaNFTMetadata
} from '../types/player';
import type { Character } from '../data/characters';

// Crossmint Configuration
const CROSSMINT_API_URL = 'https://www.crossmint.com/api/2022-06-09';
const CROSSMINT_SERVER_KEY = import.meta.env.VITE_CROSSMINT_SERVER_KEY;
const CROSSMINT_COLLECTION_ID = import.meta.env.VITE_CROSSMINT_COLLECTION_ID;

/**
 * Initialize or retrieve player Grudge ID
 * Creates a new player profile on first game entry
 */
export async function initializePlayer(walletAddress?: string): Promise<PlayerProfile> {
  try {
    const grudgeId = `grudge_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    // Check if player exists (by localStorage grudge_id or wallet)
    let existingPlayer: DbPlayer | null = null;
    const storedGrudgeId = localStorage.getItem('grudge_id');

    if (storedGrudgeId) {
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('grudge_id', storedGrudgeId)
        .single();
      existingPlayer = data;
    } else if (walletAddress) {
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();
      existingPlayer = data;
    }

    if (existingPlayer) {
      // Update last login
      await supabase
        .from('players')
        .update({ last_login: now })
        .eq('grudge_id', existingPlayer.grudge_id);

      localStorage.setItem('grudge_id', existingPlayer.grudge_id);

      return {
        grudgeId: existingPlayer.grudge_id,
        walletAddress: existingPlayer.wallet_address,
        isGuest: existingPlayer.is_guest,
        createdAt: new Date(existingPlayer.created_at).getTime(),
        lastLogin: Date.now()
      };
    }

    // Create new player
    const newPlayer: DbPlayer = {
      grudge_id: grudgeId,
      wallet_address: walletAddress || null,
      is_guest: !walletAddress,
      created_at: now,
      last_login: now
    };

    const { error } = await supabase.from('players').insert([newPlayer]);

    if (error) {
      console.error('Error creating player in Supabase:', error);
      // Fallback to local storage
      localStorage.setItem('grudge_id', grudgeId);
      return {
        grudgeId,
        walletAddress: walletAddress || null,
        isGuest: !walletAddress,
        createdAt: Date.now(),
        lastLogin: Date.now()
      };
    }

    localStorage.setItem('grudge_id', grudgeId);

    return {
      grudgeId,
      walletAddress: walletAddress || null,
      isGuest: !walletAddress,
      createdAt: Date.now(),
      lastLogin: Date.now()
    };
  } catch (error) {
    console.error('Error initializing player:', error);
    // Fallback: create local Grudge ID
    const grudgeId = `grudge_${crypto.randomUUID()}`;
    localStorage.setItem('grudge_id', grudgeId);
    return {
      grudgeId,
      walletAddress: walletAddress || null,
      isGuest: !walletAddress,
      createdAt: Date.now(),
      lastLogin: Date.now()
    };
  }
}

/**
 * Mint Solana NFT via Crossmint
 */
async function mintSolanaNFT(
  name: string,
  race: string,
  classType: string,
  level: number,
  recipientWallet?: string
): Promise<SolanaNFTMetadata | null> {
  try {
    if (!CROSSMINT_SERVER_KEY || !CROSSMINT_COLLECTION_ID) {
      console.error('Crossmint configuration missing');
      return null;
    }

    // For server-side minting without wallet
    const response = await fetch(`${CROSSMINT_API_URL}/collections/${CROSSMINT_COLLECTION_ID}/nfts`, {
      method: 'POST',
      headers: {
        'X-API-KEY': CROSSMINT_SERVER_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metadata: {
          name: `${name} - ${race} ${classType}`,
          image: `https://grudge-warlords.com/characters/${race}-${classType}.png`, // Update with your image URL
          description: `Level ${level} ${race} ${classType} from Grudge Warlords`,
          attributes: [
            { trait_type: 'Race', value: race },
            { trait_type: 'Class', value: classType },
            { trait_type: 'Level', value: level },
            { trait_type: 'Name', value: name }
          ]
        },
        recipient: recipientWallet ? `solana:${recipientWallet}` : undefined
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Crossmint NFT minting failed:', error);
      return null;
    }

    const data = await response.json();
    
    return {
      mintAddress: data.onChain?.mintHash || data.id,
      name: `${name} - ${race} ${classType}`,
      image: `https://grudge-warlords.com/characters/${race}-${classType}.png`,
      description: `Level ${level} ${race} ${classType} from Grudge Warlords`,
      attributes: {
        race,
        class: classType,
        level
      }
    };
  } catch (error) {
    console.error('Error minting Solana NFT:', error);
    return null;
  }
}

/**
 * Create character (database or Solana NFT)
 */
export async function createCharacterOnBackend(
  request: CharacterCreationRequest
): Promise<CharacterCreationResponse> {
  try {
    const characterId = `char_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    let nftData: SolanaNFTMetadata | null = null;
    let nftMintAddress: string | null = null;

    // Mint NFT if wallet connected and requested
    if (request.createAsNFT && request.walletAddress) {
      nftData = await mintSolanaNFT(
        request.name,
        request.race,
        request.classType,
        1,
        request.walletAddress
      );
      nftMintAddress = nftData?.mintAddress || null;
    }

    // Save to Supabase
    const dbCharacter: DbCharacter = {
      character_id: characterId,
      grudge_id: request.grudgeId,
      name: request.name,
      race: request.race,
      class_type: request.classType,
      level: 1,
      data: {}, // Full character data will be saved later
      is_nft: !!nftData,
      nft_mint_address: nftMintAddress,
      storage_type: nftData ? 'both' : 'database',
      sync_status: 'synced',
      last_synced_at: now,
      created_at: now,
      updated_at: now
    };

    const { error } = await supabase.from('characters').insert([dbCharacter]);

    if (error) {
      console.error('Error saving character to Supabase:', error);
      throw new Error('Failed to save character');
    }

    return {
      success: true,
      characterId,
      metadata: {
        characterId,
        grudgeId: request.grudgeId,
        isNFT: !!nftData,
        nftMintAddress: nftMintAddress || undefined,
        storageType: nftData ? 'both' : 'database',
        syncStatus: 'synced',
        lastSyncedAt: Date.now()
      },
      nftData: nftData || undefined
    };
  } catch (error) {
    console.error('Error creating character:', error);
    return {
      success: false,
      characterId: '',
      metadata: {
        characterId: '',
        grudgeId: request.grudgeId,
        isNFT: false,
        storageType: 'database',
        syncStatus: 'failed'
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Save character progress to Supabase
 */
export async function saveCharacterProgress(
  character: Character,
  grudgeId: string
): Promise<boolean> {
  try {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('characters')
      .update({
        level: character.level,
        data: character,
        updated_at: now,
        last_synced_at: now
      })
      .eq('character_id', character.id)
      .eq('grudge_id', grudgeId);

    if (error) {
      console.error('Error saving character to Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving character progress:', error);
    return false;
  }
}

/**
 * Load player's characters from Supabase
 */
export async function loadPlayerCharacters(grudgeId: string): Promise<Character[]> {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('grudge_id', grudgeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading characters from Supabase:', error);
      return [];
    }

    return data?.map((char: DbCharacter) => char.data) || [];
  } catch (error) {
    console.error('Error loading characters:', error);
    return [];
  }
}

/**
 * Sync NFT metadata with database
 */
export async function syncNFTWithDatabase(
  characterId: string,
  grudgeId: string
): Promise<boolean> {
  try {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('characters')
      .update({
        sync_status: 'synced',
        last_synced_at: now,
        updated_at: now
      })
      .eq('character_id', characterId)
      .eq('grudge_id', grudgeId);

    if (error) {
      console.error('Error syncing NFT with Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error syncing NFT:', error);
    return false;
  }
}

/**
 * Connect wallet and update player profile in Supabase
 */
export async function connectWallet(
  grudgeId: string,
  walletAddress: string
): Promise<boolean> {
  try {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('players')
      .update({
        wallet_address: walletAddress,
        is_guest: false,
        last_login: now
      })
      .eq('grudge_id', grudgeId);

    if (error) {
      console.error('Error connecting wallet in Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return false;
  }
}
