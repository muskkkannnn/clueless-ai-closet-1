# Technical Design Document: Clueless AI Closet MVP

## Overview

This document explains how we'll build **Clueless AI Closet** using an approach that balances simplicity with learning opportunities. You'll use VS Code with Gemini CLI as your AI assistant, building a Next.js 16.1.1 app with React built-ins for state management.

## Executive Summary

**System:** Clueless AI Closet  
**Version:** MVP 1.0  
**Architecture Pattern:** Monolithic Next.js App with API Routes  
**Estimated Effort:** 3-day sprint (28-34 hours)  
**Cost:** $0/month (free tiers only)

## Recommended Approach

### 🎯 Your Path: Low-Code with AI Assistance

**Primary Approach: Next.js 16.1.1 + AI-Guided Development**
- **Why this works:** Balances modern web development with AI assistance
- **Time to MVP:** 3 days intensive work
- **Learning curve:** Moderate - you'll understand what's built
- **Cost:** $0/month initially

### Tech Stack (Optimized for Learning + Speed)

#### Frontend
- **Framework:** Next.js 16.1.1 (App Router)
  - *Why:* Server Components, built-in optimizations, huge community
  - *Learning time:* 1 week basics, but AI handles complexity
  
- **Styling:** Tailwind CSS (core utility classes)
  - *Why:* Fast styling, no custom CSS needed
  - *Learning time:* 2-3 days for basics

- **State Management:** React built-ins (useState, useContext)
  - *Why:* No extra libraries, sufficient for MVP scope
  - *Learning time:* Already know if you know React basics

#### Backend  
- **Service:** Supabase (Postgres + Storage + Auth integration)
  - *Why:* Handles database, file storage, and integrates with Clerk
  - *Free tier:* 500MB DB, 1GB storage, 50K MAU
  - *Learning time:* 1 week basics

- **Authentication:** Clerk
  - *Why:* Fastest setup (30 minutes), pre-built UI
  - *Free tier:* 10K MAU
  - *Learning time:* 1 hour

#### AI Services
- **Background Removal:** BRIA RMBG-1.4 (Hugging Face)
<!-- - **Image Captioning:** BLIP (Salesforce) -->
- - **Outfit Visualization:** Gemini NanoBanana 2.5 (single-step)
<!-- - **Image Generation:** Stable Diffusion 1.5 -->
<!-- - *All via Hugging Face Inference API (free, rate-limited)* -->

#### Deployment
- **Platform:** Vercel
  - *Why:* Native Next.js support, git push = deployed
  - *Free tier:* 100GB bandwidth, unlimited hobby projects
  - *Learning time:* 30 minutes

#### AI Assistance
- **Primary:** VS Code + Gemini CLI
  - *Why:* Your chosen setup
  - *Cost:* Free (Gemini)

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│              Next.js 16.1.1 APP ROUTER                  │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │   Client     │  │    Server    │  │   API     │  │
│  │ Components   │→ │  Components  │→ │  Routes   │  │ 
│  │ (Interactive)│  │  (SSR/SSG)   │  │ (AI calls)│  │
│  └──────────────┘  └──────────────┘  └───────────┘  │
│                                           ↓         │
│                    ┌─────────────────┐    ↓         │
│                    │     Clerk       │  (Protected) │
│                    │     Auth        │              │
│                    └─────────────────┘              │
└────────────────────────┬────────────────┬────────── ┘
                         ↓                ↓
            ┌──────────────────┐  ┌───────────────── ┐
            │    SUPABASE      │  │  HUGGING FACE +  │
            │  Postgres + RLS  │  │  NANO BANANA 2.5 │
            │  Storage Bucket  │  │  API (AI Models) │
            └──────────────────┘  └───────────────── ┘
```

### Data Flow: Upload & Process Clothing

```
User uploads image
  ↓
Next.js API Route (/api/upload)
  ↓
Call BRIA RMBG-1.4 API (background removal)
  ↓
Upload to Supabase Storage
  ↓
Insert metadata in Postgres (user_id, item_type, url)
  ↓
Return success to UI
```

### Data Flow: Generate Outfit Visualization

```
User selects 3 items (top, bottom, shoes)
  ↓
Next.js API Route (/api/visualize)
  ↓
Fetch item images from Supabase Storage
  ↓
<!-- Call BLIP API 3x (generate description for each item) -->
<!-- Build combined prompt from descriptions
  ↓
Call Stable Diffusion API (generate visualization) -->

Call Gemini NanoBanana 2.5
  - Reference images: selected clothing
  - Prompt: simple instruction
  ↓
NanoBanana generates model wearing outfit
  ↓
Save visualization to Supabase Storage
  ↓
Insert record in visualizations table
  ↓
Return visualization URL to UI
```

## Project Structure

```
clueless-ai-closet/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with Clerk provider
│   │   ├── page.tsx            # Landing page
│   │   ├── dashboard/
│   │   │   ├── page.tsx        # Digital closet grid view
│   │   │   └── outfit/
│   │   │       └── page.tsx    # Outfit builder canvas
│   │   ├── gallery/
│   │   │   └── page.tsx        # Saved visualizations
│   │   └── api/
│   │       ├── upload/
│   │       │   └── route.ts    # Upload + background removal
│   │       ├── visualize/
│   │       │   └── route.ts    # AI visualization pipeline
│   │       ├── items/
│   │       │   └── route.ts    # CRUD for closet items
│   │       └── visualizations/
│   │           └── route.ts    # Save/fetch visualizations
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Loading.tsx
│   │   ├── ClosetGrid.tsx      # Display clothing items
│   │   ├── OutfitBuilder.tsx   # Item selection interface
│   │   ├── VisualizationView.tsx  # Display generated image
│   │   └── UploadButton.tsx    # Image upload component
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client setup
│   │   ├── ai/
│   │   │   ├── backgroundRemoval.ts
│   │   │   ├── imageCaption.ts
│   │   │   └── textToImage.ts
│   │   └── utils.ts            # Helper functions
│   └── types/
│       └── database.types.ts   # TypeScript types
├── public/                     # Static assets
│   ├── images/
│   └── fonts/
├── .env.local                  # Environment variables (gitignored)
├── .env.example                # Template for env vars
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

**Why this structure:**
- Standard Next.js 16.1.1 App Router pattern
- Clear separation: UI (components) vs Logic (lib) vs Routes (app)
- AI assistants understand this convention
- Easy to navigate as you learn

## Database Schema

### Supabase Tables

```sql
-- Users table (managed by Clerk, referenced here)
-- Clerk user_id is stored as TEXT

-- Items table (clothing pieces)
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,  -- Clerk user ID
    type TEXT NOT NULL CHECK (type IN ('top', 'bottom', 'shoes', 'outerwear')),
    image_url TEXT NOT NULL,  -- Supabase Storage URL
    processed_url TEXT,       -- Background-removed version
    description TEXT,         -- AI-generated caption
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Visualizations table (AI-generated outfit images)
CREATE TABLE visualizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    item_ids UUID[] NOT NULL,     -- Array of item IDs in outfit
    image_url TEXT NOT NULL,       -- Generated image URL
    prompt TEXT,                   -- Prompt used for generation
    model_used TEXT DEFAULT 'stable-diffusion-v1-5',
    liked BOOLEAN DEFAULT FALSE,   -- For future ML training
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_visualizations_user_id ON visualizations(user_id);
CREATE INDEX idx_visualizations_created_at ON visualizations(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualizations ENABLE ROW LEVEL SECURITY;

-- Users can only view/edit their own items
CREATE POLICY "Users can view own items"
    ON items FOR SELECT
    USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own items"
    ON items FOR INSERT
    WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own items"
    ON items FOR UPDATE
    USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own items"
    ON items FOR DELETE
    USING (auth.jwt() ->> 'sub' = user_id);

-- Same for visualizations
CREATE POLICY "Users can view own visualizations"
    ON visualizations FOR SELECT
    USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own visualizations"
    ON visualizations FOR INSERT
    WITH CHECK (auth.jwt() ->> 'sub' = user_id);
```

### Supabase Storage Buckets

```
Buckets:
├── clothing-items/        # Original + processed clothing images
│   └── {user_id}/
│       └── {item_id}.png
└── visualizations/        # AI-generated outfit images
    └── {user_id}/
        └── {visualization_id}.png
```

**Storage Policies:**
- Users can upload to their own folders
- Users can read their own files
- Public read access for visualizations (for sharing)

## Feature Implementation Guide

### Feature 1: Authentication (Clerk)

**Complexity:** ⭐☆☆☆☆ (Very Easy)

#### Setup Steps

1. **Create Clerk Account**
   - Go to clerk.com
   - Create new application
   - Select "Next.js" as framework

2. **Install Clerk**
   ```bash
   npm install @clerk/nextjs
   ```

3. **Configure Environment Variables**
   ```bash
   # .env.local
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

4. **Wrap App with ClerkProvider**
   ```typescript
   // src/app/layout.tsx
   import { ClerkProvider } from '@clerk/nextjs'
   
   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <ClerkProvider>
         <html lang="en">
           <body>{children}</body>
         </html>
       </ClerkProvider>
     )
   }
   ```

5. **Protect Routes**
   ```typescript
   // src/app/dashboard/page.tsx
   import { auth } from '@clerk/nextjs/server'
   import { redirect } from 'next/navigation'
   
   export default async function DashboardPage() {
     const { userId } = await auth()
     if (!userId) redirect('/sign-in')
     
     return <div>Dashboard Content</div>
   }
   ```

**Learning Points:**
- Clerk handles all auth complexity (password hashing, sessions, etc.)
- You just check `userId` to protect routes
- Pre-built UI components for sign-in/sign-up

---

### Feature 2: Image Upload + Background Removal

**Complexity:** ⭐⭐⭐☆☆ (Medium)

#### Implementation

1. **Create Upload Component**
   ```typescript
   // src/components/UploadButton.tsx
   'use client'
   
   import { useState } from 'react'
   
   export function UploadButton() {
     const [uploading, setUploading] = useState(false)
     
     async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
       const file = e.target.files?.[0]
       if (!file) return
       
       setUploading(true)
       const formData = new FormData()
       formData.append('file', file)
       formData.append('type', 'top') // or let user select
       
       try {
         const res = await fetch('/api/upload', {
           method: 'POST',
           body: formData,
         })
         const data = await res.json()
         // Handle success - refresh closet
       } catch (error) {
         console.error('Upload failed:', error)
       } finally {
         setUploading(false)
       }
     }
     
     return (
       <div>
         <input
           type="file"
           accept="image/*"
           onChange={handleUpload}
           disabled={uploading}
         />
         {uploading && <p>Uploading...</p>}
       </div>
     )
   }
   ```

2. **Create Upload API Route**
   ```typescript
   // src/app/api/upload/route.ts
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
       
       // 1. Remove background using BRIA RMBG-1.4
       const processedImage = await removeBackground(file)
       
       // 2. Upload to Supabase Storage
       const supabase = await createServerSupabaseClient()
       const fileName = `${userId}/${Date.now()}.png`
       
       const { data: uploadData, error: uploadError } = await supabase
         .storage
         .from('clothing-items')
         .upload(fileName, processedImage, {
           contentType: 'image/png',
         })
       
       if (uploadError) throw uploadError
       
       // 3. Get public URL
       const { data: urlData } = supabase
         .storage
         .from('clothing-items')
         .getPublicUrl(fileName)
       
       // 4. Save metadata to database
       const { data: item, error: dbError } = await supabase
         .from('items')
         .insert({
           user_id: userId,
           type: type,
           image_url: urlData.publicUrl,
           processed_url: urlData.publicUrl,
         })
         .select()
         .single()
       
       if (dbError) throw dbError
       
       return NextResponse.json({ item })
     } catch (error) {
       console.error('Upload error:', error)
       return NextResponse.json(
         { error: 'Upload failed' },
         { status: 500 }
       )
     }
   }
   ```

3. **Implement Background Removal**
   ```typescript
   // src/lib/ai/backgroundRemoval.ts
   export async function removeBackground(file: File): Promise<Blob> {
     const arrayBuffer = await file.arrayBuffer()
     
     const response = await fetch(
       'https://api-inference.huggingface.co/models/briaai/RMBG-1.4',
       {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
           'Content-Type': 'application/octet-stream',
         },
         body: arrayBuffer,
       }
     )
     
     if (!response.ok) {
       throw new Error('Background removal failed')
     }
     
     return await response.blob()
   }
   ```

**Learning Points:**
- File upload uses FormData (standard web API)
- API routes keep server-side logic separate
- Background removal is just an HTTP call to Hugging Face
- Supabase handles storage complexity

---

### Feature 3: Digital Closet Display

**Complexity:** ⭐⭐☆☆☆ (Easy)

#### Implementation

```typescript
// src/app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import { ClosetGrid } from '@/components/ClosetGrid'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  
  // Fetch user's items (Server Component - no loading state needed)
  const supabase = await createServerSupabaseClient()
  const { data: items, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Failed to fetch items:', error)
    return <div>Error loading closet</div>
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Digital Closet</h1>
      <ClosetGrid items={items || []} />
    </div>
  )
}
```

```typescript
// src/components/ClosetGrid.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Item {
  id: string
  type: string
  image_url: string
  description?: string
}

export function ClosetGrid({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<string>('all')
  
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter)
  
  return (
    <div>
      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('top')}
          className={`px-4 py-2 rounded ${filter === 'top' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Tops
        </button>
        <button
          onClick={() => setFilter('bottom')}
          className={`px-4 py-2 rounded ${filter === 'bottom' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Bottoms
        </button>
        <button
          onClick={() => setFilter('shoes')}
          className={`px-4 py-2 rounded ${filter === 'shoes' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Shoes
        </button>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="border rounded-lg p-2 hover:shadow-lg transition">
            <Image
              src={item.image_url}
              alt={item.description || item.type}
              width={200}
              height={200}
              className="w-full h-48 object-contain"
            />
            <p className="text-sm text-gray-600 mt-2 capitalize">{item.type}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Learning Points:**
- Server Components fetch data without client-side loading
- Client Components handle interactivity (filtering)
- Tailwind classes for responsive grid
- Next.js Image component optimizes images

---

### Feature 4: Outfit Builder Canvas

**Complexity:** ⭐⭐⭐☆☆ (Medium)

#### Implementation

```typescript
// src/app/dashboard/outfit/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import { OutfitBuilder } from '@/components/OutfitBuilder'

export default async function OutfitPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  
  const supabase = await createServerSupabaseClient()
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', userId)
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create Outfit</h1>
      <OutfitBuilder items={items || []} />
    </div>
  )
}
```

```typescript
// src/components/OutfitBuilder.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Item {
  id: string
  type: string
  image_url: string
}

export function OutfitBuilder({ items }: { items: Item[] }) {
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [generating, setGenerating] = useState(false)
  const [visualization, setVisualization] = useState<string | null>(null)
  
  function handleSelectItem(item: Item) {
    // Don't add duplicates or more than 3 items
    if (selectedItems.find(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id))
    } else if (selectedItems.length < 3) {
      setSelectedItems([...selectedItems, item])
    }
  }
  
  async function handleGenerate() {
    if (selectedItems.length < 2) {
      alert('Select at least 2 items')
      return
    }
    
    setGenerating(true)
    try {
      const res = await fetch('/api/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemIds: selectedItems.map(i => i.id),
        }),
      })
      
      const data = await res.json()
      setVisualization(data.imageUrl)
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Failed to generate visualization')
    } finally {
      setGenerating(false)
    }
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Item selection */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Select Items</h2>
        <div className="grid grid-cols-3 gap-4">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className={`border-2 rounded-lg p-2 transition ${
                selectedItems.find(i => i.id === item.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <Image
                src={item.image_url}
                alt={item.type}
                width={100}
                height={100}
                className="w-full h-32 object-contain"
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Right: Canvas & result */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Selected Outfit</h2>
        
        {/* Show selected items */}
        <div className="flex gap-4 mb-6">
          {selectedItems.map(item => (
            <div key={item.id} className="relative">
              <Image
                src={item.image_url}
                alt={item.type}
                width={80}
                height={80}
                className="w-20 h-20 object-contain border rounded"
              />
              <button
                onClick={() => handleSelectItem(item)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={selectedItems.length < 2 || generating}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {generating ? 'Generating... (10-15s)' : 'Generate Visualization'}
        </button>
        
        {/* Visualization result */}
        {visualization && (
          <div className="mt-6">
            <Image
              src={visualization}
              alt="Generated outfit"
              width={400}
              height={600}
              className="w-full rounded-lg border"
            />
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-green-500 text-white py-2 rounded">
                Save
              </button>
              <button className="flex-1 bg-gray-500 text-white py-2 rounded">
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Learning Points:**
- useState manages selected items (array)
- Conditional rendering for selected state
- Async fetch for API call
- Loading states during generation

---

<!-- ### Feature 5: AI Visualization Pipeline

**Complexity:** ⭐⭐⭐⭐☆ (Complex - but AI handles it)

#### Implementation

```typescript
// src/app/api/visualize/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { generateCaption } from '@/lib/ai/imageCaption'
import { generateImage } from '@/lib/ai/textToImage'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { itemIds } = await req.json()
    
    if (!itemIds || itemIds.length < 2) {
      return NextResponse.json({ error: 'Select at least 2 items' }, { status: 400 })
    }
    
    // 1. Fetch items from database
    const supabase = await createServerSupabaseClient()
    const { data: items, error: fetchError } = await supabase
      .from('items')
      .select('*')
      .in('id', itemIds)
      .eq('user_id', userId)
    
    if (fetchError || !items) throw new Error('Failed to fetch items')
    
    // 2. Generate captions for each item using BLIP
    const captions = await Promise.all(
      items.map(async (item) => {
        const caption = await generateCaption(item.image_url)
        
        // Update item with description (optional, for future use)
        await supabase
          .from('items')
          .update({ description: caption })
          .eq('id', item.id)
        
        return caption
      })
    )
    
    // 3. Build prompt from captions
    const prompt = `A fashion model wearing ${captions.join(', ')}. Full body photo, professional fashion photography, studio lighting, white background, high quality.`
    
    // 4. Generate image with Stable Diffusion
    const generatedImageBlob = await generateImage(prompt)
    
    // 5. Upload to Supabase Storage
    const fileName = `${userId}/${Date.now()}.png`
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('visualizations')
      .upload(fileName, generatedImageBlob, {
        contentType: 'image/png',
      })
    
    if (uploadError) throw uploadError
    
    // 6. Get public URL
    const { data: urlData } = supabase
      .storage
      .from('visualizations')
      .getPublicUrl(fileName)
    
    // 7. Save visualization record
    const { data: visualization, error: dbError } = await supabase
      .from('visualizations')
      .insert({
        user_id: userId,
        item_ids: itemIds,
        image_url: urlData.publicUrl,
        prompt: prompt,
      })
      .select()
      .single()
    
    if (dbError) throw dbError
    
    return NextResponse.json({ 
      imageUrl: urlData.publicUrl,
      visualizationId: visualization.id 
    })
    
  } catch (error) {
    console.error('Visualization error:', error)
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    )
  }
}

// Set timeout for long-running AI operations
export const maxDuration = 60 // 60 seconds
```

```typescript
// src/lib/ai/imageCaption.ts
export async function generateCaption(imageUrl: string): Promise<string> {
  try {
    // Fetch image as blob
    const imageResponse = await fetch(imageUrl)
    const imageBlob = await imageResponse.blob()
    
    // Call BLIP API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
        body: imageBlob,
      }
    )
    
    if (!response.ok) {
      throw new Error('BLIP API failed')
    }
    
    const result = await response.json()
    // BLIP returns: [{ generated_text: "a blue denim jacket" }]
    return result[0]?.generated_text || 'clothing item'
  } catch (error) {
    console.error('Caption generation failed:', error)
    return 'clothing item' // Fallback
  }
}
```

```typescript
// src/lib/ai/textToImage.ts
export async function generateImage(prompt: string): Promise<Blob> {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: 'blurry, low quality, distorted, ugly, bad anatomy',
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }),
      }
    )
    
    if (!response.ok) {
      throw new Error('Stable Diffusion API failed')
    }
    
    return await response.blob()
  } catch (error) {
    console.error('Image generation failed:', error)
    throw error
  }
}
```

**Learning Points:**
- API routes can call multiple external APIs sequentially
- Promise.all runs multiple async operations in parallel
- Blob handling for binary image data
- Environment variables keep API keys secure
- Error handling at each step prevents silent failures -->

✅ Feature 5: AI Visualization Pipeline (MVP)

Complexity: ⭐⭐☆☆☆ (Simple – single AI call)

```typescript
// src/app/api/visualize/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { generateOutfitImage } from '@/lib/ai/nanobanana'

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { itemIds } = await req.json()

    if (!Array.isArray(itemIds) || itemIds.length < 2) {
      return NextResponse.json(
        { error: 'Select at least 2 clothing items' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // 1. Fetch clothing images
    const { data: items, error } = await supabase
      .from('items')
      .select('id, image_url')
      .in('id', itemIds)
      .eq('user_id', userId)

    if (error || !items || items.length === 0) {
      throw new Error('Failed to fetch items')
    }

    const imageUrls = items.map(item => item.image_url)

    // 2. Call Gemini NanoBanana (single step)
    const generatedImage = await generateOutfitImage(imageUrls)

    // 3. Upload result to Supabase Storage
    const filePath = `${userId}/${Date.now()}-visualization.png`

    const { error: uploadError } = await supabase
      .storage
      .from('visualizations')
      .upload(filePath, generatedImage, {
        contentType: 'image/png',
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase
      .storage
      .from('visualizations')
      .getPublicUrl(filePath)

    // 4. Save DB record
    const { data: visualization, error: dbError } = await supabase
      .from('visualizations')
      .insert({
        user_id: userId,
        item_ids: itemIds,
        image_url: urlData.publicUrl,
      })
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json({
      imageUrl: urlData.publicUrl,
      visualizationId: visualization.id,
    })

  } catch (err) {
    console.error('Visualization error:', err)
    return NextResponse.json(
      { error: 'Failed to generate visualization' },
      { status: 500 }
    )
  }
}

export const maxDuration = 60
```
---

### Feature 6: Save & Download Visualizations

**Complexity:** ⭐⭐☆☆☆ (Easy)

#### Implementation

```typescript
// src/components/VisualizationView.tsx
'use client'

import Image from 'next/image'

interface VisualizationViewProps {
  imageUrl: string
  visualizationId: string
}

export function VisualizationView({ imageUrl, visualizationId }: VisualizationViewProps) {
  async function handleDownload() {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `outfit-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }
  
  async function handleSave() {
    try {
      const res = await fetch('/api/visualizations/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visualizationId }),
      })
      
      if (res.ok) {
        alert('Saved to your gallery!')
      }
    } catch (error) {
      console.error('Save failed:', error)
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt="Generated outfit visualization"
          fill
          className="object-contain"
        />
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
        >
          💾 Save to Gallery
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
        >
          ⬇️ Download
        </button>
      </div>
      
      <p className="text-sm text-gray-500 text-center">
        ⚠️ AI visualization - colors and styles are approximate
      </p>
    </div>
  )
}
```

```typescript
// src/app/api/visualizations/like/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { visualizationId } = await req.json()
    
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('visualizations')
      .update({ liked: true })
      .eq('id', visualizationId)
      .eq('user_id', userId)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
```

**Learning Points:**
- Browser APIs for downloading files (createObjectURL, createElement)
- Simple flag (liked: true) for saving to gallery
- User feedback with alerts (upgrade to toasts later)

---

### Feature 7: Delete Closet Items

**Complexity:** ⭐⭐☆☆☆ (Easy)

#### Implementation

```typescript
// src/components/ClosetGrid.tsx (add delete functionality)
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Item {
  id: string
  type: string
  image_url: string
  description?: string
}

export function ClosetGrid({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<string>('all')
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter)
  
  async function handleDelete(itemId: string) {
    if (!confirm('Delete this item?')) return
    
    setDeleting(itemId)
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        router.refresh() // Refresh server component data
      } else {
        alert('Failed to delete item')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete item')
    } finally {
      setDeleting(null)
    }
  }
  
  return (
    <div>
      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        {/* ... filter buttons ... */}
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="relative border rounded-lg p-2 hover:shadow-lg transition group">
            <Image
              src={item.image_url}
              alt={item.description || item.type}
              width={200}
              height={200}
              className="w-full h-48 object-contain"
            />
            <p className="text-sm text-gray-600 mt-2 capitalize">{item.type}</p>
            
            {/* Delete button (appears on hover) */}
            <button
              onClick={() => handleDelete(item.id)}
              disabled={deleting === item.id}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition disabled:bg-gray-400"
            >
              {deleting === item.id ? '...' : '×'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

```typescript
// src/app/api/items/[id]/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get item to delete from storage
    const { data: item } = await supabase
      .from('items')
      .select('image_url')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single()
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    // Delete from storage
    const fileName = item.image_url.split('/').pop()
    if (fileName) {
      await supabase
        .storage
        .from('clothing-items')
        .remove([`${userId}/${fileName}`])
    }
    
    // Delete from database (RLS ensures user owns it)
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
```

**Learning Points:**
- Dynamic routes with [id] in Next.js
- router.refresh() to update server component data
- Confirmation dialog before destructive actions
- Clean up both storage and database

---

## Supabase Client Setup

```typescript
// src/lib/supabase.ts
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

// For client components (no auth token needed for public data)
export function createBrowserSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Why Two Clients:**
- Server client passes Clerk JWT for RLS authentication
- Browser client for public read operations (if needed)

---

## Development Workflow

### Git Strategy

```bash
# Branch naming convention
main                    # Production-ready code
├── feature/upload      # Upload + background removal
├── feature/closet      # Digital closet display
├── feature/canvas      # Outfit builder
├── feature/ai-viz      # AI visualization pipeline
└── feature/gallery     # Saved visualizations
```

**Workflow:**
```bash
# Start new feature
git checkout -b feature/upload

# Make changes, commit frequently
git add .
git commit -m "feat: add image upload with validation"

# Push to remote
git push origin feature/upload

# Merge to main when feature complete
git checkout main
git merge feature/upload
git push origin main
```

---

## AI Assistance Strategy with Gemini CLI

### Effective Prompting for Your Features

#### Architecture Questions
```bash
# Use for high-level decisions
gemini "I need to implement image upload with background removal.
Current stack: Next.js 16.1.1, Supabase Storage.
Should I:
1. Handle upload client-side then call API for bg removal
2. Upload to API route directly and process server-side
3. Direct upload to Supabase with post-processing
Explain trade-offs of each approach."
```

#### Code Generation
```bash
# Use for implementing specific features
gemini "Create a Next.js API route that:
- Accepts file upload via FormData
- Validates file is image (PNG/JPG) under 5MB
- Calls Hugging Face BRIA RMBG-1.4 for background removal
- Uploads result to Supabase Storage
- Returns public URL
Include error handling and TypeScript types."
```

#### Debugging
```bash
# Use when stuck on errors
gemini "I'm getting this error when uploading:
[paste error]

My code:
[paste relevant code snippet]

What's wrong and how do I fix it?"
```

#### Learning
```bash
# Use to understand concepts
gemini "Explain how Next.js Server Components differ from Client Components.
Give examples of when to use each in my Clueless AI Closet app."
```

### Gemini CLI Tips

1. **Context is key:** Always mention your stack (Next.js 16.1.1, Supabase, Clerk)
2. **Be specific:** "Create X that does Y with Z constraints"
3. **Ask for explanations:** "Explain why this approach is better"
4. **Iterative refinement:** Start simple, then ask for improvements

---

## Environment Variables Setup

### Required API Keys

```bash
# .env.local (NEVER commit this file)

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # For admin operations

# Hugging Face
HUGGINGFACE_API_KEY=hf_...  # Get from huggingface.co/settings/tokens

# GEMINI NANOBANANA
GEMINI_API_KEY=hf_...  

# Optional: Sentry for error tracking
SENTRY_DSN=https://...
```

### .env.example (commit this)
```bash
# .env.example - Template for environment variables

# Clerk Authentication (get from clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase (get from supabase.com)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Hugging Face (get from huggingface.co/settings/tokens)
HUGGINGFACE_API_KEY=

# GEMINI NANOBANANA
GEMINI_API_KEY=

# Optional: Sentry for error tracking
SENTRY_DSN=
```
---

## Deployment Guide

### Deploy to Vercel (Recommended)

#### Step 1: Prepare Repository
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/clueless-ai-closet.git
git push -u origin main
```

#### Step 2: Connect to Vercel
1. Go to vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js configuration

#### Step 3: Configure Environment Variables
In Vercel dashboard:
- Settings → Environment Variables
- Add all variables from .env.local
- Select "Production", "Preview", "Development" for each

#### Step 4: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Your app is live at `https://your-project.vercel.app`

### Custom Domain (Optional)

1. Buy domain from Namecheap/Google Domains (~$10-15/year)
2. In Vercel: Settings → Domains → Add Domain
3. Add DNS records (Vercel provides instructions)
4. Wait 24-48 hours for DNS propagation

---

## Testing Strategy

### Manual Testing Checklist

#### Day 1: Upload & Auth
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Upload image (PNG)
- [ ] Upload image (JPG)
- [ ] Upload image > 5MB (should fail)
- [ ] Background removal completes
- [ ] Image appears in closet

#### Day 2: Closet & Canvas
- [ ] View uploaded items in grid
- [ ] Filter by type (tops, bottoms, shoes)
- [ ] Navigate to outfit builder
- [ ] Select 2 items
- [ ] Select 3 items
- [ ] Remove selected item
- [ ] Cannot select more than 3 items

#### Day 3: AI Visualization
- [ ] Generate visualization with 2 items
- [ ] Generate visualization with 3 items
- [ ] Loading indicator shows during generation
- [ ] Result displays correctly
- [ ] Save to gallery
- [ ] Download as PNG
- [ ] Delete item from closet
- [ ] View saved visualizations gallery

### Browser Testing
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox (desktop)
- [ ] Chrome (mobile - iOS)
- [ ] Safari (mobile - iOS)
- [ ] Chrome (mobile - Android)

### Performance Testing
- [ ] Image upload < 5 seconds
- [ ] Background removal < 5 seconds
- [ ] Visualization generation < 20 seconds
- [ ] Page load < 3 seconds
- [ ] Images lazy-load properly

---

## Cost Breakdown

### Development Phase (Building)
| Service | Free Tier | Paid Tier | You Need |
|---------|-----------|-----------|----------|
| VS Code | Free | N/A | Free ✓ |
| Gemini CLI | Free | $20/mo (Pro) | Free sufficient |
| Clerk | 10K MAU | $25/mo | Free sufficient |
| Supabase | 500MB DB, 1GB storage | $25/mo | Free sufficient |
| Vercel | 100GB bandwidth | $20/mo | Free sufficient |
| Hugging Face | Rate-limited | Pay-per-use | Free sufficient |
| **Total** | **$0/mo** | **$90/mo** | **$0/mo** ✓ |

### Production Phase (After Launch)

| Users | Estimated Cost | What You'll Need to Upgrade |
|-------|----------------|----------------------------|
| 0-100 | $0/mo | Nothing - free tiers handle it |
| 100-500 | $0-20/mo | Possibly Hugging Face for more API calls |
| 500-2000 | $20-50/mo | Supabase Pro ($25), maybe Vercel Pro |
| 2000-10000 | $50-150/mo | All paid tiers + CDN for images |
| 10000+ | $150-500/mo | Custom infrastructure, caching layer |

### When to Upgrade Each Service

**Clerk ($25/mo):**
- When you hit 10,000 monthly active users
- Need: Advanced features, remove branding

**Supabase ($25/mo):**
- When you exceed 500MB database
- When you exceed 1GB storage
- When you need more than 50K MAU
- When you need 8GB RAM (vs 500MB free)

**Vercel ($20/mo):**
- When you exceed 100GB bandwidth/month
- When you need preview deployments for teams
- When you need priority support

**Hugging Face:**
- Free tier is rate-limited (~100 requests/hour)
- If users generate many visualizations, consider:
  - Replicate ($0.0005 per second of compute)
  - Self-hosting models (requires GPU)
  - Caching popular combinations

---

## Performance Optimization

### Image Optimization

```typescript
// Use Next.js Image component everywhere
import Image from 'next/image'

<Image
  src={item.image_url}
  alt={item.type}
  width={200}
  height={200}
  quality={75}  // Balance quality vs file size
  placeholder="blur"  // Show blur while loading
  blurDataURL="data:image/..." // Low-res preview
/>
```

### API Response Caching

```typescript
// Cache frequently accessed data
import { unstable_cache } from 'next/cache'

const getCachedItems = unstable_cache(
  async (userId: string) => {
    const supabase = await createServerSupabaseClient()
    return await supabase.from('items').select('*').eq('user_id', userId)
  },
  ['user-items'],
  { revalidate: 60 } // Cache for 60 seconds
)
```

### Database Query Optimization

```sql
-- Create indexes (already in schema above)
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_type ON items(type);

-- Limit columns in SELECT
SELECT id, type, image_url FROM items  -- Not SELECT *

-- Use pagination
SELECT * FROM items LIMIT 20 OFFSET 0;
```

---

## Security Best Practices

### API Route Protection

```typescript
// Every API route should check auth
import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... rest of logic
}
```

### Input Validation

```typescript
// Validate file uploads
function validateImageFile(file: File): boolean {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Use PNG or JPG.')
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large. Max 5MB.')
  }
  
  return true
}
```

### Environment Variables

```typescript
// Never expose secrets in client-side code
// ✅ Good - server-side only
const apiKey = process.env.HUGGINGFACE_API_KEY

// ❌ Bad - exposed to client
const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY
```

### Row Level Security (RLS)

Supabase RLS ensures users can only access their own data:
```sql
-- Already in schema - enforces data isolation
CREATE POLICY "Users can view own items"
    ON items FOR SELECT
    USING (auth.jwt() ->> 'sub' = user_id);
```

---

## Common Challenges & Solutions

### Challenge 1: "Hugging Face API is slow/timing out"

**Symptoms:**
- Visualizations take > 30 seconds
- API returns 503 errors
- Rate limit errors

**Solutions:**
1. **Add retry logic:**
   ```typescript
   async function fetchWithRetry(url: string, options: RequestInit, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         const response = await fetch(url, options)
         if (response.ok) return response
         if (i < retries - 1) await new Promise(r => setTimeout(r, 2000))
       } catch (error) {
         if (i === retries - 1) throw error
       }
     }
   }
   ```

2. **Show better loading states:**
   ```typescript
   {generating && (
     <div>
       <p>Generating visualization...</p>
       <p className="text-sm">This may take 10-20 seconds</p>
       <progress value={progress} max={100} />
     </div>
   )}
   ```

3. **Consider alternatives:**
   - Replicate API (faster, paid)
   - Queue system (process in background)
   - Cache popular combinations

### Challenge 2: "Background removal doesn't work well"

**Symptoms:**
- Clothing edges cut off
- Background not fully removed
- Quality degradation

**Solutions:**
1. **Guide users to take better photos:**
   ```typescript
   <div className="bg-blue-50 p-4 rounded mb-4">
     <h3>📸 Photo Tips:</h3>
     <ul>
       <li>Use plain white or light background</li>
       <li>Lay item flat or hang it</li>
       <li>Good lighting, no shadows</li>
       <li>Fill the frame with the item</li>
     </ul>
   </div>
   ```

2. **Add manual fallback:**
   ```typescript
   {backgroundRemovalFailed && (
     <button onClick={handleManualUpload}>
       Skip background removal (upload as-is)
     </button>
   )}
   ```

3. **Try alternative model:**
   - RMBG-2.0 (newer version)
   - U2-Net (alternative approach)

### Challenge 3: "Next.js deployment fails"

**Symptoms:**
- Build errors on Vercel
- Environment variables not working
- API routes 404

**Solutions:**
1. **Check build locally first:**
   ```bash
   npm run build
   npm run start  # Test production build locally
   ```

2. **Verify environment variables:**
   - All variables in Vercel dashboard
   - Correct names (typos common)
   - Include NEXT_PUBLIC_ prefix for client vars

3. **Check Next.js config:**
   ```javascript
   // next.config.js
   module.exports = {
     images: {
       domains: ['your-supabase-url.supabase.co'],
     },
   }
   ```

### Challenge 4: "Can't understand the code AI generated"

**Approach:**
1. **Ask Gemini to explain:**
   ```bash
   gemini "Explain this code line-by-line for a beginner:
   [paste code]"
   ```

2. **Add detailed comments:**
   ```bash
   gemini "Add detailed comments explaining every step:
   [paste code]"
   ```

3. **Rebuild it yourself:**
   ```bash
   gemini "I want to rebuild this step-by-step.
   Start with the simplest version, then we'll add features."
   ```

### Challenge 5: "App is too slow"

**Diagnosis:**
```bash
# Use Next.js built-in analyzer
npm run build
# Check output for large bundles
```

**Solutions:**
1. **Lazy load components:**
   ```typescript
   import dynamic from 'next/dynamic'
   
   const OutfitBuilder = dynamic(() => import('@/components/OutfitBuilder'), {
     loading: () => <p>Loading...</p>,
     ssr: false  // Don't render on server
   })
   ```

2. **Optimize images:**
   - Use WebP format
   - Compress before upload
   - Use Next.js Image with quality={75}

3. **Add caching:**
   - Cache API responses
   - Use SWR for client data fetching
   - Leverage Vercel Edge caching

---

## Learning Resources

### Essential for Your Stack

#### Next.js 16.1.1 & App Router
- **Official Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Video:** [Next.js 16.1.1 Crash Course](https://www.youtube.com/results?search_query=nextjs+15+crash+course) (YouTube)
- **Interactive:** [Next.js Learn](https://nextjs.org/learn)

#### Clerk Authentication
- **Quick Start:** [clerk.com/docs/quickstarts/nextjs](https://clerk.com/docs/quickstarts/nextjs)
- **Video:** [Clerk Auth in 100 Seconds](https://www.youtube.com/results?search_query=clerk+auth+nextjs) (YouTube)

#### Supabase
- **Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Video:** [Supabase Tutorial](https://www.youtube.com/watch?v=7uKQBl9uZ00) (YouTube)
- **Integration:** [Supabase + Clerk](https://supabase.com/partners/integrations/clerk)

#### Tailwind CSS
- **Docs:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Cheat Sheet:** [nerdcave.com/tailwind-cheat-sheet](https://nerdcave.com/tailwind-cheat-sheet)

### When Stuck

1. **AI Assistants (Best):**
   - Gemini CLI for architecture questions
   - ChatGPT for quick debugging
   - Claude for complex reasoning

2. **Communities:**
   - **Next.js Discord:** discord.gg/nextjs
   - **Supabase Discord:** discord.supabase.com
   - **Clerk Discord:** discord.gg/clerk
   - **Stack Overflow:** Tag questions with `next.js`, `supabase`, `clerk`

3. **Documentation:**
   - Read error messages carefully
   - Search docs for specific APIs
   - Check GitHub issues for known problems

---

## 3-Day Implementation Roadmap

### Day 1: Foundation (8-10 hours)

**Morning (4 hours):**
- [ ] Create Next.js 16.1.1 project: `npx create-next-app@latest clueless-ai-closet`
- [ ] Install dependencies: Clerk, Supabase, Hugging Face
- [ ] Set up Clerk authentication
- [ ] Create Supabase project
- [ ] Configure database schema (items, visualizations tables)
- [ ] Set up storage buckets
- [ ] Configure Clerk JWT template for Supabase
- [ ] Test authentication flow

**Afternoon (4-6 hours):**
- [ ] Create basic layouts (landing, dashboard)
- [ ] Implement upload component UI
- [ ] Build upload API route with background removal
- [ ] Test image upload + background removal
- [ ] Display uploaded items in closet grid
- [ ] Deploy to Vercel for first time
- [ ] Verify production environment variables work

**Evening Tasks:**
- [ ] Git commit: "Day 1 complete: Auth + Upload working"
- [ ] Test end-to-end: Sign up → Upload → View in closet

---

### Day 2: Core Features (10-12 hours)

**Morning (4-5 hours):**
- [ ] Build closet grid component with filtering
- [ ] Add delete functionality for items
- [ ] Create outfit builder page/route
- [ ] Implement item selection UI
- [ ] Add selected items state management
- [ ] Test selection/deselection flow

**Afternoon (4-5 hours):**
- [ ] Start AI visualization pipeline
- [ ] Implement BLIP image captioning integration
- [ ] Test caption generation for single items
- [ ] Build prompt engineering logic
- [ ] Test different prompt formats

**Evening (2-3 hours):**
- [ ] Implement Stable Diffusion integration
- [ ] Create visualize API route
- [ ] Connect frontend to API
- [ ] Test complete visualization flow
- [ ] Add loading states and error handling

**Evening Tasks:**
- [ ] Git commit: "Day 2 complete: Outfit builder + AI integration"
- [ ] Test: Select items → Generate → See result

---

### Day 3: Polish & Launch (10-12 hours)

**Morning (4-5 hours):**
- [ ] Implement save visualization functionality
- [ ] Add download button
- [ ] Create gallery page for saved visualizations
- [ ] Add basic styling and polish
- [ ] Improve loading indicators
- [ ] Add user feedback messages

**Afternoon (3-4 hours):**
- [ ] Comprehensive testing:
  - [ ] Full user journey (sign up through visualization)
  - [ ] Mobile responsiveness
  - [ ] Error cases (network failures, invalid files)
  - [ ] Edge cases (empty closet, large files)
- [ ] Fix any critical bugs
- [ ] Optimize performance (image loading, API timeouts)

**Evening (3-4 hours):**
- [ ] Final deployment to Vercel
- [ ] Update environment variables
- [ ] Test production deployment
- [ ] Create README documentation
- [ ] Share with 3-5 beta testers
- [ ] Set up basic analytics (Vercel Analytics)

**Evening Tasks:**
- [ ] Git commit: "MVP complete - ready for beta"
- [ ] Celebrate! ðŸŽ‰

---

## Post-MVP: What's Next?

### Week 2-4: Iteration Based on Feedback

**Priority 1: Fix Critical Issues**
- Any bugs that block core functionality
- Performance issues (slow loading, timeouts)
- UX confusion (unclear UI, missing instructions)

**Priority 2: Quick Wins**
- Better onboarding (tutorial, example)
- Improved AI disclaimers
- More clothing categories
- Better mobile experience

**Priority 3: Data Collection**
- Track which features users actually use
- Monitor AI success rate
- Gather feedback on accuracy

### Month 2-3: Growth Features

**If Users Love It:**
1. **Better AI Models:**
   - Upgrade to Stable Diffusion XL
   - Fine-tune on fashion data
   - Add ControlNet for pose control

2. **Social Features:**
   - Share visualizations with friends
   - Community outfit inspiration
   - Like/comment system

3. **Smart Recommendations:**
   - "Complete this outfit" suggestions
   - Weather-based recommendations
   - Occasion-based styling

4. **Premium Features:**
   - Unlimited generations ($5/mo)
   - Custom model training
   - Priority processing
   - Advanced editing tools

### Month 4-6: Scale

**Technical Improvements:**
- Add Redis caching layer
- Implement CDN for images
- Optimize database queries
- Add monitoring/alerting

**Business Development:**
- Launch public Product Hunt campaign
- Start freemium model
- Partner with fashion brands
- Explore affiliate opportunities

---

## Success Metrics & KPIs

### MVP Success (First 30 Days)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Technical Completion** | 100% | All features work end-to-end |
| **Visualization Success Rate** | 70%+ | Generations that complete without errors |
| **User Retention** | 30%+ | Users who return within 7 days |
| **Avg Items per User** | 5+ | Indicates users find value |
| **Visualizations Generated** | 50+ | Core feature usage |

### Growth Metrics (Month 2-3)

| Metric | Target | How to Track |
|--------|--------|--------------|
| **Active Users** | 100+ | Clerk dashboard |
| **Total Visualizations** | 500+ | Database query |
| **User Satisfaction** | 4/5 stars | Feedback survey |
| **Weekly Active Users** | 50+ | Login frequency |
| **Feature Adoption** | 60%+ | % users who visualize |

### Tools for Tracking

```typescript
// Basic analytics with Vercel
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

```typescript
// Track custom events
import { track } from '@vercel/analytics'

track('visualization_generated', {
  itemCount: selectedItems.length,
  processingTime: endTime - startTime,
})
```

---

## Scaling Path & Architecture Evolution

### Phase 1: MVP (Current)
```
Next.js Monolith
    ↓
Supabase (DB + Storage)
    ↓
Hugging Face APIs
```
- **Handles:** 0-1K users
- **Cost:** $0-20/mo
- **Complexity:** Low

### Phase 2: Optimization (Month 2-3)
```
Next.js + Redis Cache
    ↓
Supabase + CDN (Cloudflare)
    ↓
Hugging Face + Replicate (backup)
```
- **Handles:** 1K-10K users
- **Cost:** $50-150/mo
- **Complexity:** Medium

### Phase 3: Scale (Month 4-6)
```
Next.js (Edge Functions)
    ↓
Load Balancer
    ↓
[API 1] [API 2] [API 3]  # Microservices
    ↓
PostgreSQL Cluster + Redis + S3/CDN
    ↓
Self-hosted Stable Diffusion (GPU servers)
```
- **Handles:** 10K+ users
- **Cost:** $500-2K/mo
- **Complexity:** High

### When to Scale Each Component

**Database (Supabase → Managed PostgreSQL):**
- When you exceed 500MB
- When you need > 50K MAU
- When you need advanced features

**Storage (Supabase Storage → S3 + CloudFront):**
- When you exceed 1GB
- When global latency matters
- When you need fine-grained control

**AI (Hugging Face → Replicate → Self-hosted):**
- **Replicate:** When free tier rate limits hit
- **Self-hosted:** When doing > 10K generations/month

---

## Risk Mitigation & Contingency Plans

### Risk 1: AI Quality Disappoints Users

**Probability:** High  
**Impact:** High  

**Mitigation:**
1. **Set Expectations:**
   - Prominent disclaimer on every page
   - Show "before/after" examples
   - Label as "experimental visualization"

2. **Provide Alternatives:**
   - "Generate Again" button (different seed)
   - Manual prompt editing (advanced)
   - Save "good" examples as inspiration

3. **Upgrade Path:**
   - Budget for Replicate API ($50/mo)
   - Plan for Stable Diffusion XL migration
   - Research ControlNet integration

### Risk 2: Free Tier Limits Hit

**Probability:** Medium  
**Impact:** Medium  

**Mitigation:**
1. **Monitor Usage:**
   ```typescript
   // Track API calls
   const apiCallCount = await supabase
     .from('visualizations')
     .select('count')
     .gte('created_at', startOfDay)
   ```

2. **Implement Queueing:**
   - Users see "High demand - 5 min wait"
   - Process requests in order
   - Upgrade to paid tier when consistent

3. **Freemium Model:**
   - Free: 5 visualizations/day
   - Paid: Unlimited ($5/mo)

### Risk 3: 3-Day Timeline Too Ambitious

**Probability:** Medium  
**Impact:** High  

**Mitigation:**
1. **Cut Features Ruthlessly:**
   - MVP = Upload + Visualize + Save
   - Skip: Gallery, advanced filters, social

2. **Extend Timeline:**
   - 5-day sprint if needed
   - Focus on ONE perfect flow

3. **Get Help:**
   - Ask in Discord communities
   - Hire developer for 1-2 days ($200-400)

### Risk 4: Security Breach

**Probability:** Low  
**Impact:** Critical  

**Mitigation:**
1. **Prevention:**
   - Use Clerk (handles auth security)
   - Enable Supabase RLS (row-level security)
   - Never expose API keys client-side
   - Validate all user inputs

2. **Detection:**
   - Monitor error logs
   - Set up Sentry alerts
   - Regular security audits

3. **Response Plan:**
   - Rotate all API keys immediately
   - Force password resets (Clerk handles)
   - Notify affected users
   - Document incident

---

## Technical Debt Management

### Acceptable for MVP
- ✅ Hardcoded strings (no i18n)
- ✅ Basic error messages
- ✅ Simple UI without animations
- ✅ No automated tests
- ✅ Comments instead of documentation
- ✅ Single environment (no staging)

### Fix Before Scale
- ⚠️ Add input validation everywhere
- ⚠️ Implement proper error handling
- ⚠️ Add logging for debugging
- ⚠️ Write basic unit tests for critical paths
- ⚠️ Set up staging environment
- ⚠️ Document API endpoints

### Fix Eventually
- 📋 Add E2E tests (Playwright)
- 📋 Internationalization (i18n)
- 📋 Advanced caching strategies
- 📋 Performance monitoring
- 📋 A/B testing framework

---

## Documentation Requirements

### Must Have for MVP

1. **README.md**
   ```markdown
   # Clueless AI Closet
   
   ## Setup
   1. Clone repo
   2. Copy .env.example to .env.local
   3. Add your API keys
   4. Run `npm install`
   5. Run `npm run dev`
   
   ## Tech Stack
   - Next.js 16.1.1
   - Clerk (auth)
   - Supabase (database + storage)
   - Hugging Face (AI models)
   ```

2. **.env.example** (already shown above)

3. **API Documentation** (simple comments)
   ```typescript
   /**
    * POST /api/visualize
    * 
    * Generates outfit visualization from selected items
    * 
    * @body {itemIds: string[]} - Array of item IDs (2-3 items)
    * @returns {imageUrl: string, visualizationId: string}
    * @throws {401} If not authenticated
    * @throws {400} If < 2 items selected
    * @throws {500} If generation fails
    */
   ```

### Nice to Have Post-MVP

- Architecture diagrams
- Database ER diagrams
- API reference (Swagger/OpenAPI)
- Contributing guidelines
- Changelog

---

## Final Checklist: Ready to Build?

### Prerequisites
- [ ] VS Code installed
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] GitHub account created
- [ ] Gemini CLI ready

### Accounts Created
- [ ] Clerk account (clerk.com)
- [ ] Supabase account (supabase.com)
- [ ] Hugging Face account (huggingface.co)
- [ ] Vercel account (vercel.com)
- [ ] GitHub repository created

### API Keys Obtained
- [ ] Clerk publishable + secret key
- [ ] Supabase URL + anon key
- [ ] Hugging Face API token
- [ ] All keys added to .env.local

### Knowledge Check
- [ ] Understand what Server Components do
- [ ] Know difference between API routes and pages
- [ ] Comfortable with async/await
- [ ] Basic Git commands (add, commit, push)
- [ ] How to ask Gemini effective questions

### Ready to Start?
- [ ] Documents saved and organized
- [ ] 3 full days (28-34 hours) available
- [ ] Backup plan if stuck (communities, docs)
- [ ] Realistic expectations set (MVP, not perfect)

---

## Your Next Step

**You're ready to build!** Here's what to do next:

1. **Day 0 (Right Now):**
   - Create all accounts listed above
   - Set up your GitHub repository
   - Install all prerequisites
   - Save this document for reference

2. **Day 1 Morning:**
   - Start with: `npx create-next-app@latest clueless-ai-closet`
   - Follow Day 1 roadmap step-by-step
   - Use Gemini CLI when stuck

3. **Throughout Development:**
   - Commit code frequently
   - Test after each feature
   - Don't be afraid to ask AI for help
   - Reference this document for architecture decisions

4. **After MVP:**
   - Get feedback from 3-5 beta testers
   - Return to this document for scaling guidance
   - Iterate based on user needs

---

## Support & Resources

### When You Need Help

**Technical Questions:**
```bash
# Use Gemini CLI with context
gemini "I'm building Clueless AI Closet with Next.js 16.1.1, Supabase, and Clerk.
[Your specific question with code snippet]"
```

**Community Support:**
- Next.js Discord: Most responsive for framework questions
- Supabase Discord: Database and storage issues
- Clerk Discord: Authentication problems
- This document: Architecture and design decisions

**Emergency Contacts:**
- Vercel Status: status.vercel.com
- Supabase Status: status.supabase.com
- Hugging Face Status: status.huggingface.co

---

## Conclusion

You now have a complete technical blueprint for building **Clueless AI Closet MVP** in 3 days.

### Key Takeaways

✅ **Tech Stack is Validated:** Next.js 16.1.1 + Clerk + Supabase + Hugging Face  
✅ **Architecture is Clear:** Monolithic app with API routes  
✅ **Features are Scoped:** 7 core features, nothing more  
✅ **Costs are Minimal:** $0/mo for MVP  
✅ **Timeline is Realistic:** 3 intensive days  
✅ **AI Assistance Planned:** Gemini CLI for development  
✅ **Scaling Path Defined:** Clear upgrade path when needed  

### Your Success Criteria

**You'll know this MVP succeeds when:**
- A user can sign up, upload 3 clothes, create an outfit, and see a visualization
- The end-to-end flow works without crashing
- You understand 70% of what was built
- You can modify and improve it yourself
- Users say "this is cool, I'd use it again"

### Remember

- **MVP = Minimum Viable Product**, not perfect product
- **Done is better than perfect** for validation
- **AI is your partner**, not your replacement
- **Users will teach you** what to build next
- **Have fun!** Building is supposed to be exciting

---

**Now go build something amazing! 🚀**

*Technical Design Document v1.0*  
*Created for: Clueless AI Closet MVP*  
*Approach: Balanced Learning with AI Assistance*  
*Timeline: 3-day sprint*  
*Total Estimated Cost: $0/month*