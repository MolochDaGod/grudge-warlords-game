// Grudge Warlords - Player & Authentication Types

export interface PlayerProfile {
  grudgeId: string; // Always generated when player first enters game
  walletAddress: string | null; // Solana wallet address
  isGuest: boolean;
  createdAt: number; // Timestamp
  lastLogin: number; // Timestamp
}

export interface CharacterMetadata {
  characterId: string;
  grudgeId: string; // Links character to player
  isNFT: boolean; // True if minted as Solana NFT
  nftMintAddress?: string; // Solana mint address if NFT
  storageType: 'database' | 'nft' | 'both'; // Where character data is stored
  syncStatus: 'synced' | 'pending' | 'failed';
  lastSyncedAt?: number;
}

export interface SolanaNFTMetadata {
  mintAddress: string;
  name: string;
  image: string;
  description: string;
  attributes: {
    race: string;
    class: string;
    level: number;
    [key: string]: string | number;
  };
}

export interface CharacterCreationRequest {
  name: string;
  race: string;
  classType: string;
  grudgeId: string;
  walletAddress?: string;
  createAsNFT: boolean;
}

export interface CharacterCreationResponse {
  success: boolean;
  characterId: string;
  metadata: CharacterMetadata;
  nftData?: SolanaNFTMetadata;
  error?: string;
}
