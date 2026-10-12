import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

const hasCredentials = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasCredentials) {
  console.warn(
    '⚠️ Supabase URL or Anon Key is missing. The app will use cached / seed data. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to enable live data.'
  );
}

/**
 * Real Supabase client when credentials are present, otherwise a no-op proxy
 * that returns empty result sets so the rest of the app can fall back gracefully
 * to seed / localStorage-cached data.
 */
export const supabase: SupabaseClient = hasCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new Proxy(
      {},
      {
        get(_target, prop) {
          // Support chained calls: supabase.from('x').select().order()
          const noopQuery = {
            select: () => noopQuery,
            insert: () => noopQuery,
            update: () => noopQuery,
            delete: () => noopQuery,
            upsert: () => noopQuery,
            order: () => noopQuery,
            limit: () => noopQuery,
            eq: () => noopQuery,
            neq: () => noopQuery,
            gt: () => noopQuery,
            gte: () => noopQuery,
            lt: () => noopQuery,
            lte: () => noopQuery,
            in: () => noopQuery,
            filter: () => noopQuery,
            match: () => noopQuery,
            single: () => Promise.resolve({ data: null, error: null }),
            then: (resolve: (v: { data: null; error: null }) => void) =>
              Promise.resolve({ data: null, error: null }).then(resolve),
          };
          if (prop === 'from') return () => noopQuery;
          if (prop === 'auth') return { getUser: () => Promise.resolve({ data: { user: null }, error: null }) };
          return () => noopQuery;
        },
      }
    ) as unknown as SupabaseClient);

