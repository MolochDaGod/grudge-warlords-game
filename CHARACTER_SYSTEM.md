# Character Creation & CNFT System

## Overview
The Grudge Warlords game implements a dual-storage character system that supports both guest players and wallet-connected players. Characters can be stored in a database for guest users or minted as Cardano NFTs (CNFTs) for users with connected wallets.

## Architecture

### Player Profile System
- **Grudge ID**: Unique identifier generated when player first enters the game
- **Wallet Status**: Tracks whether player is guest or has connected wallet
- **Storage Type**: Database, CNFT, or both

### Character Creation Flow

```
Player Enters Game
    ↓
Initialize Player Profile (Generate Grudge ID)
    ↓
Player Creates Character
    ↓
Check Wallet Status
    ├─→ Has Wallet → Create CNFT on Cardano + Save to DB
    └─→ No Wallet/Guest → Save to Database Only
```

## Frontend Implementation

### Key Files
- **`src/types/player.ts`**: Type definitions for player profiles and character metadata
- **`src/services/api.ts`**: Backend API integration service
- **`src/store/gameStore.ts`**: Zustand state management with player tracking
- **`src/components/CharacterCreation.tsx`**: Character creation UI
- **`src/components/MainMenu.tsx`**: Main menu with wallet connection

### Key Features
1. **Auto-initialization**: Player profile created on first game load
2. **Guest Mode**: Full gameplay without wallet connection
3. **Wallet Integration**: Connect wallet anytime to enable CNFT minting
4. **Progress Saving**: Automatic sync to backend (configurable interval)
5. **Fallback Handling**: Local-only play if backend unavailable

## Backend API Requirements

### Environment Variables
```env
VITE_API_URL=http://localhost:3000/api
```

### Expected Endpoints

#### 1. Initialize Player
**POST** `/api/player/init`

Request:
```json
{
  "walletAddress": "addr1...", // optional
  "timestamp": 1234567890
}
```

Response:
```json
{
  "player": {
    "grudgeId": "grudge_uuid",
    "walletAddress": "addr1..." | null,
    "isGuest": true | false,
    "createdAt": 1234567890,
    "lastLogin": 1234567890
  }
}
```

#### 2. Create Character (Database)
**POST** `/api/character/create`

Request:
```json
{
  "name": "Character Name",
  "race": "human",
  "classType": "warrior",
  "grudgeId": "grudge_uuid",
  "createAsNFT": false
}
```

Response:
```json
{
  "success": true,
  "characterId": "char_uuid",
  "metadata": {
    "characterId": "char_uuid",
    "grudgeId": "grudge_uuid",
    "isNFT": false,
    "storageType": "database",
    "syncStatus": "synced",
    "lastSyncedAt": 1234567890
  }
}
```

#### 3. Create Character as CNFT
**POST** `/api/character/create-cnft`

Request:
```json
{
  "name": "Character Name",
  "race": "human",
  "classType": "warrior",
  "grudgeId": "grudge_uuid",
  "walletAddress": "addr1...",
  "createAsNFT": true
}
```

Response:
```json
{
  "success": true,
  "characterId": "char_uuid",
  "metadata": {
    "characterId": "char_uuid",
    "grudgeId": "grudge_uuid",
    "isNFT": true,
    "nftPolicyId": "policy_id",
    "nftAssetName": "asset_name",
    "storageType": "both",
    "syncStatus": "synced",
    "lastSyncedAt": 1234567890
  },
  "nftData": {
    "policyId": "policy_id",
    "assetName": "asset_name",
    "name": "Character Name",
    "image": "ipfs://...",
    "description": "Level 1 Human Warrior",
    "attributes": {
      "race": "Human",
      "class": "Warrior",
      "level": 1
    }
  }
}
```

#### 4. Save Character Progress
**POST** `/api/character/save`

Request:
```json
{
  "character": { /* full character object */ },
  "grudgeId": "grudge_uuid",
  "timestamp": 1234567890
}
```

Response:
```json
{
  "success": true
}
```

#### 5. Load Player Characters
**GET** `/api/character/list/:grudgeId`

Response:
```json
{
  "characters": [
    { /* character object 1 */ },
    { /* character object 2 */ }
  ]
}
```

#### 6. Connect Wallet
**POST** `/api/player/connect-wallet`

Request:
```json
{
  "grudgeId": "grudge_uuid",
  "walletAddress": "addr1...",
  "timestamp": 1234567890
}
```

Response:
```json
{
  "success": true
}
```

#### 7. Sync CNFT with Database
**POST** `/api/character/sync-cnft`

Request:
```json
{
  "characterId": "char_uuid",
  "grudgeId": "grudge_uuid",
  "timestamp": 1234567890
}
```

Response:
```json
{
  "success": true
}
```

## Database Schema

### Players Table
```sql
CREATE TABLE players (
  grudge_id VARCHAR(255) PRIMARY KEY,
  wallet_address VARCHAR(255),
  is_guest BOOLEAN,
  created_at TIMESTAMP,
  last_login TIMESTAMP
);
```

### Characters Table
```sql
CREATE TABLE characters (
  character_id VARCHAR(255) PRIMARY KEY,
  grudge_id VARCHAR(255) REFERENCES players(grudge_id),
  name VARCHAR(255),
  race VARCHAR(50),
  class_type VARCHAR(50),
  level INT,
  data JSONB, -- Full character state
  is_nft BOOLEAN,
  nft_policy_id VARCHAR(255),
  nft_asset_name VARCHAR(255),
  storage_type VARCHAR(50),
  sync_status VARCHAR(50),
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## CNFT Metadata Standard

Characters minted as CNFTs should follow the CIP-25 standard:

```json
{
  "721": {
    "<policy_id>": {
      "<asset_name>": {
        "name": "Character Name",
        "image": "ipfs://...",
        "description": "Level X Race Class",
        "attributes": {
          "Race": "Human",
          "Class": "Warrior",
          "Level": 1,
          "HP": 150,
          "Mana": 50,
          "STR": 10,
          "DEX": 5,
          "INT": 3
        }
      }
    }
  }
}
```

## Usage Examples

### Initialize Player Profile
```typescript
import { useGameStore } from './store/gameStore';

function MyComponent() {
  const initializePlayerProfile = useGameStore(state => state.initializePlayerProfile);
  
  useEffect(() => {
    initializePlayerProfile(); // No wallet
    // or
    initializePlayerProfile('addr1...'); // With wallet
  }, []);
}
```

### Create Character
```typescript
const createNewCharacter = useGameStore(state => state.createNewCharacter);

await createNewCharacter('Aragorn', 'human', 'warrior');
```

### Connect Wallet Later
```typescript
const connectWalletToProfile = useGameStore(state => state.connectWalletToProfile);

const success = await connectWalletToProfile('addr1...');
if (success) {
  console.log('Wallet connected! Future characters will be CNFTs.');
}
```

### Save Progress
```typescript
const saveGameToBackend = useGameStore(state => state.saveGameToBackend);

// Manual save
await saveGameToBackend();

// Auto-save every 5 minutes
setInterval(async () => {
  await saveGameToBackend();
}, 5 * 60 * 1000);
```

## Security Considerations

1. **Wallet Verification**: Backend should verify wallet ownership before minting CNFTs
2. **Rate Limiting**: Implement rate limits on character creation
3. **Input Validation**: Sanitize all character names and data
4. **IPFS Pinning**: Ensure CNFT metadata is permanently pinned
5. **Transaction Signing**: Use proper Cardano signing standards

## Future Enhancements

- [ ] Wallet integration UI (Nami, Eternl, etc.)
- [ ] Character transfer between wallets
- [ ] CNFT marketplace integration
- [ ] Character evolution tracking on-chain
- [ ] Multi-character support per wallet
- [ ] Character trading/selling
- [ ] Staking for in-game benefits
