import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

function readEnv(): { url: string; anonKey: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  if (!url || !anonKey) return null
  return { url, anonKey }
}

/**
 * Returns true when Supabase env vars are set. PRs that wire data layer
 * should branch on this so guest mode keeps working without configuration.
 */
export function isSupabaseConfigured(): boolean {
  return readEnv() !== null
}

/**
 * Lazy singleton. Returns null if URL or anon key are missing (no throw).
 */
export function getSupabaseClient(): SupabaseClient | null {
  const env = readEnv()
  if (!env) return null
  if (!client) {
    client = createClient(env.url, env.anonKey)
  }
  return client
}
