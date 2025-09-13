// Shim: preserving original import paths while migrating to Supabase.
// Re-export server client as if it were the legacy admin entry.
export { createSupabaseServer as createAdminLike } from "./supabase-server";
