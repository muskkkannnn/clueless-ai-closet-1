import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UploadButton } from '@/components/UploadButton'
import { ClosetGrid } from '@/components/ClosetGrid'
import { createServerSupabaseClient } from '@/lib/supabase'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createServerSupabaseClient()
  const { data: items, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching items:', error)
    // Optionally, render an error state
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Digital Closet</h1>
        <UploadButton />
      </div>
      <ClosetGrid items={items || []} />
    </main>
  )
}
