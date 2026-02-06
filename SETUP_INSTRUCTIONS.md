# Grudge Warlords - Setup Instructions

## 🚀 Quick Start with Supabase + Crossmint

Your game is now configured to use:
- **Supabase** - For player/character database storage
- **Crossmint** - For Solana NFT minting (server-side collection)

---

## 📦 Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
```

---

## 🗄️ Step 2: Setup Supabase Database

1. **Go to your Supabase Dashboard**
   - URL: https://wfbcuyaiwtfxincdiihc.supabase.co

2. **Open SQL Editor**
   - Navigate to: Database → SQL Editor → New Query

3. **Run the Migration**
   - Copy all content from `supabase_migration.sql`
   - Paste into SQL Editor
   - Click "Run"

4. **Verify Tables Created**
   ```sql
   SELECT * FROM players;
   SELECT * FROM characters;
   ```

---

## ✅ Step 3: Verify Environment Variables

Your `.env` should have these variables set:

```env
# Supabase (Frontend)
VITE_SUPABASE_URL=https://wfbcuyaiwtfxincdiihc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Crossmint (Solana NFT Minting)
VITE_CROSSMINT_CLIENT_KEY=ck_production_...
VITE_CROSSMINT_SERVER_KEY=sk_production_...
VITE_CROSSMINT_COLLECTION_ID=5061318d-ff65-4893-ac4b-9b28efb18ace

# Optional: Backend API (if you want separate backend)
VITE_API_URL=http://localhost:3000/api
```

---

## 🎮 Step 4: Run the Game

```bash
npm run dev
```

The game will be available at: `http://localhost:5173`

---

## 🧪 Testing the System

### Test Guest User Flow
1. Open the game
2. **Grudge ID** will be auto-generated
3. Main menu shows: `Status: 👤 Guest`
4. Click "New Game" → Create Character
5. Character saved to **Supabase database**
6. Main menu shows: `Storage: 💾 Database`

### Test Wallet User Flow
1. In main menu, click **"Connect Wallet for NFT Minting"**
2. Enter a Solana wallet address (e.g., `EiENMsEXUYjYWNaVLsHr3jX3XZBY6gDKmz1FtbVfARt9`)
3. Click "Connect"
4. Status changes to: `Status: ✨ Wallet Connected`
5. Click "New Game" → Create Character
6. Character will be:
   - ✅ Minted as **Solana NFT** via Crossmint
   - ✅ Saved to **Supabase database**
7. Main menu shows: `Storage: ✨ Solana NFT`

---

## 🔍 Verify in Supabase

### Check Players Table
```sql
SELECT * FROM players ORDER BY created_at DESC;
```

Should show:
- `grudge_id`: Auto-generated unique ID
- `wallet_address`: Solana wallet (if connected)
- `is_guest`: false if wallet connected

### Check Characters Table
```sql
SELECT 
  character_id,
  name,
  race,
  class_type,
  level,
  is_nft,
  nft_mint_address,
  storage_type
FROM characters 
ORDER BY created_at DESC;
```

Should show:
- Characters with `is_nft=true` if wallet was connected
- `nft_mint_address` will have the Solana mint address
- `storage_type='both'` for NFT characters

---

## 🎨 Check Crossmint Dashboard

1. Go to: https://crossmint.com/console
2. Navigate to your collection: `5061318d-ff65-4893-ac4b-9b28efb18ace`
3. You should see minted character NFTs with:
   - Name: `CharacterName - Race Class`
   - Attributes: Race, Class, Level, Name
   - Blockchain: Solana

---

## 🔧 How It Works

### Player Initialization
```
User opens game
    ↓
Check localStorage for grudge_id
    ↓
If exists → Load from Supabase
If not → Create new player in Supabase
    ↓
Store grudge_id in localStorage
```

### Character Creation
```
User creates character
    ↓
Check if wallet connected
    ├─ YES → Mint Solana NFT via Crossmint
    │         Save to Supabase with mint address
    │
    └─ NO  → Save to Supabase only
```

### Auto-Save (Future Enhancement)
Add this to your game loop:
```typescript
// Auto-save every 5 minutes
setInterval(async () => {
  await saveGameToBackend();
}, 5 * 60 * 1000);
```

---

## 🔐 Security Notes

### Current Setup (Development)
- RLS policies allow public read/write
- Good for testing and development

### Production Recommendations
1. **Enable Supabase Auth**
   - Require authentication before character creation
   - Update RLS policies to check `auth.uid()`

2. **Secure Crossmint Keys**
   - Move `VITE_CROSSMINT_SERVER_KEY` to a backend service
   - Never expose server keys in frontend

3. **Rate Limiting**
   - Implement rate limits on character creation
   - Prevent abuse of NFT minting

4. **Wallet Verification**
   - Verify wallet ownership before minting
   - Use Solana wallet adapter for proper signing

---

## 📊 Database Schema

### Players Table
```
grudge_id (PK)     | VARCHAR(255)
wallet_address     | VARCHAR(255) UNIQUE
is_guest           | BOOLEAN
created_at         | TIMESTAMP
last_login         | TIMESTAMP
```

### Characters Table
```
character_id (PK)  | VARCHAR(255)
grudge_id (FK)     | VARCHAR(255) → players.grudge_id
name               | VARCHAR(255)
race               | VARCHAR(50)
class_type         | VARCHAR(50)
level              | INTEGER
data               | JSONB (full character state)
is_nft             | BOOLEAN
nft_mint_address   | VARCHAR(255) UNIQUE
storage_type       | ENUM('database', 'nft', 'both')
sync_status        | ENUM('synced', 'pending', 'failed')
last_synced_at     | TIMESTAMP
created_at         | TIMESTAMP
updated_at         | TIMESTAMP
```

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution:** Make sure `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Issue: Character not saving to Supabase
**Solution:** 
1. Check Supabase SQL Editor for errors
2. Verify tables were created: `SELECT * FROM players;`
3. Check browser console for errors

### Issue: NFT not minting
**Solution:**
1. Verify `VITE_CROSSMINT_SERVER_KEY` is set correctly
2. Check `VITE_CROSSMINT_COLLECTION_ID` matches your collection
3. Look in browser console for Crossmint API errors

### Issue: "Grudge ID already exists"
**Solution:** This is normal! It means player already exists in database

---

## 🚀 Next Steps

1. **Add Wallet Integration UI**
   - Integrate Phantom or Solflare wallet adapter
   - Proper wallet connection flow

2. **Character Loading**
   - Add "Load Character" feature in main menu
   - Display list of player's characters from database

3. **NFT Metadata Enhancement**
   - Upload character images to IPFS
   - Add more attributes (stats, equipment)

4. **Backend Service (Optional)**
   - Create Node.js backend for sensitive operations
   - Move Crossmint server key to backend
   - Add webhook handlers for NFT minting status

---

## 📚 Resources

- **Supabase Docs:** https://supabase.com/docs
- **Crossmint Docs:** https://docs.crossmint.com/
- **Solana Web3.js:** https://solana-labs.github.io/solana-web3.js/
- **Phantom Wallet:** https://phantom.app/

---

## ✅ Current Architecture

```
Frontend (Vite + React + Three.js)
    ↓
Supabase Client (Direct Connection)
    ↓
[Supabase Database]
    - players table
    - characters table

    +
    
Crossmint API (Server-side NFT Minting)
    ↓
[Solana Blockchain]
    - Character NFTs
```

---

You're all set! 🎉 Run `npm install @supabase/supabase-js` and then `npm run dev` to start playing!
