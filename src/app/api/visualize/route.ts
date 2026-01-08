import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { generateOutfitImage } from '@/lib/ai/nanobanana'

// Vercel runtimes: https://vercel.com/docs/functions/runtimes
export const maxDuration = 60; // Allow up to 60s for this serverless function

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { itemIds } = await req.json()

    if (!Array.isArray(itemIds) || itemIds.length < 2) {
      return NextResponse.json(
        { error: 'Please select at least 2 clothing items to visualize.' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // 1. Fetch the image URLs for the selected items from the database
    const { data: items, error: fetchError } = await supabase
      .from('items')
      .select('id, image_url')
      .in('id', itemIds)
      .eq('user_id', userId)

    if (fetchError || !items || items.length !== itemIds.length) {
      console.error("Error fetching items or item mismatch:", fetchError);
      throw new Error('Could not find the selected clothing items.')
    }

    const imageUrls = items.map(item => item.image_url)

    // 2. Call the Gemini AI to generate the outfit image
    const generatedImageBlob = await generateOutfitImage(imageUrls)

    // 3. Upload the generated image to Supabase Storage
    const filePath = `${userId}/${Date.now()}-visualization.png`
    const { error: uploadError } = await supabase
      .storage
      .from('visualizations')
      .upload(filePath, generatedImageBlob, {
        contentType: 'image/png',
      })

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      throw new Error('Failed to upload the generated visualization.')
    }

    // 4. Get the public URL of the uploaded visualization
    const { data: urlData } = supabase
      .storage
      .from('visualizations')
      .getPublicUrl(filePath)
    
    if (!urlData || !urlData.publicUrl) {
      throw new Error("Could not get public URL for the visualization.")
    }
    const imageUrl = urlData.publicUrl;

    // 5. Save a record of the visualization in the database
    const { data: visualization, error: dbError } = await supabase
      .from('visualizations')
      .insert({
        user_id: userId,
        item_ids: itemIds,
        image_url: imageUrl,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Supabase DB insert error:", dbError);
      throw new Error('Failed to save the visualization record.')
    }

    // 6. Return the URL of the generated image
    return NextResponse.json({
      imageUrl: imageUrl,
      visualizationId: visualization.id,
    })

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('--- Visualization API Error ---', errorMessage)
    return NextResponse.json(
      { error: 'Failed to generate outfit visualization.', details: errorMessage },
      { status: 500 }
    )
  }
}
