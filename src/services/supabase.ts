// Grudge Warlords - Supabase Client Configuration

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface DbPlayer {
  grudge_id: string;
  wallet_address: string | null;
  is_guest: boolean;
  created_at: string;
  last_login: string;
}

export interface DbCharacter {
  character_id: string;
  grudge_id: string;
  name: string;
  race: string;
  class_type: string;
  level: number;
  data: any; // JSONB - full character state
  is_nft: boolean;
  nft_mint_address: string | null; // Solana mint address
  storage_type: 'database' | 'nft' | 'both';
  sync_status: 'synced' | 'pending' | 'failed';
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}
