import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

// For server components and API routes
export async function createServerSupabaseClient() {
  const { getToken } = await auth()
  const token = await getToken({ template: 'supabase' })
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  )
}

// For client components (no auth token needed for public data initially, but can be extended)
export function createBrowserSupabaseClient() {
  return createClient(
    process.NEXT_PUBLIC_SUPABASE_URL!,
    process.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
