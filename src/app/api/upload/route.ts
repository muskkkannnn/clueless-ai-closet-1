import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { removeBackground } from '@/lib/ai/backgroundRemoval'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 1. Remove background using BRIA RMBG-1.4
    const processedImageBlob = await removeBackground(file)

    // 2. Upload to Supabase Storage
    const supabase = await createServerSupabaseClient()
    const fileName = `${userId}/${Date.now()}.png`

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('clothing-items')
      .upload(fileName, processedImageBlob, {
        contentType: 'image/png',
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      throw new Error('Failed to upload processed image to Supabase.')
    }
      

    // 3. Get public URL
    const { data: urlData } = supabase
      .storage
      .from('clothing-items')
      .getPublicUrl(fileName)

    if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to get public URL for the uploaded image.')
    }

    // 4. Save metadata to database
    const { data: item, error: dbError } = await supabase
      .from('items')
      .insert({
        user_id: userId,
        type: type,
        image_url: urlData.publicUrl,
        processed_url: urlData.publicUrl, // In this case, original and processed are the same after this step
      })
      .select()
      .single()

    if (dbError) {
        console.error('Supabase db error:', dbError)
        throw new Error('Failed to save item metadata to the database.')
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error('Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json(
      { error: 'Upload failed', details: errorMessage },
      { status: 500 }
    )
  }
}
