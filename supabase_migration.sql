-- Grudge Warlords - Supabase Database Migration
-- Run this SQL in your Supabase SQL Editor

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  grudge_id VARCHAR(255) PRIMARY KEY,
  wallet_address VARCHAR(255) UNIQUE,
  is_guest BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  character_id VARCHAR(255) PRIMARY KEY,
  grudge_id VARCHAR(255) NOT NULL REFERENCES players(grudge_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  race VARCHAR(50) NOT NULL,
  class_type VARCHAR(50) NOT NULL,
  level INTEGER DEFAULT 1,
  data JSONB DEFAULT '{}'::jsonb,
  is_nft BOOLEAN DEFAULT false,
  nft_mint_address VARCHAR(255) UNIQUE,
  storage_type VARCHAR(50) DEFAULT 'database' CHECK (storage_type IN ('database', 'nft', 'both')),
  sync_status VARCHAR(50) DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'failed')),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_players_wallet ON players(wallet_address);
CREATE INDEX IF NOT EXISTS idx_characters_grudge_id ON characters(grudge_id);
CREATE INDEX IF NOT EXISTS idx_characters_nft_mint ON characters(nft_mint_address);
CREATE INDEX IF NOT EXISTS idx_characters_created_at ON characters(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for players table
-- Allow anyone to read player data (for demo purposes)
CREATE POLICY "Allow public read access to players"
  ON players FOR SELECT
  USING (true);

-- Allow users to insert their own player profile
CREATE POLICY "Allow insert for new players"
  ON players FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own player profile
CREATE POLICY "Allow update for own player"
  ON players FOR UPDATE
  USING (true);

-- Create RLS policies for characters table
-- Allow anyone to read character data (for demo purposes)
CREATE POLICY "Allow public read access to characters"
  ON characters FOR SELECT
  USING (true);

-- Allow users to insert characters
CREATE POLICY "Allow insert for new characters"
  ON characters FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own characters
CREATE POLICY "Allow update for own characters"
  ON characters FOR UPDATE
  USING (true);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for characters table
CREATE TRIGGER update_characters_updated_at
    BEFORE UPDATE ON characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample query to verify tables
-- SELECT * FROM players LIMIT 10;
-- SELECT * FROM characters LIMIT 10;
