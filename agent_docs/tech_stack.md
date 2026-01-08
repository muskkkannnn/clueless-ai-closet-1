# Tech Stack & Tools – Clueless AI Closet MVP

---

## Frontend
- **Next.js 16.1.1** (App Router)
- **React**
  - Server Components for data fetching
  - Client Components for interactivity only
- **Tailwind CSS**
  - Utility-only
  - No custom design system in MVP

---

## Backend
- **Next.js API Routes**
  - No separate backend
  - All AI calls handled server-side
- **Supabase**
  - Postgres (metadata)
  - Storage (clothing images + visualizations)
- **Clerk Authentication**
  - Login / Signup
  - User session handling

---

## AI Services (FREE ONLY – LOCKED)

### Primary Image Generation
- **Gemini NanoBanana 2.5**
  - Generates a model/person wearing the selected outfit
  - Prompt-based generation
  - No image captioning
  - No image-to-image pipelines

### Background Removal
- **BRIA RMBG-1.4** (Hugging Face)
  - Used ONLY during clothing upload
  - Removes background and isolates clothing item

⛔ **Explicitly NOT USED**
- Stable Diffusion
- BLIP
- Image-to-image pipelines
- Multi-step AI chains

---

## Deployment
- **Vercel (Free tier)**
  - Web-only MVP
  - Environment variables via Vercel dashboard

---

## Architecture Rules (Strict)

- Server Components:
  - Fetch Supabase data
  - Read user session
- Client Components:
  - Upload images
  - Select outfits
  - Trigger visualization
- API Routes:
  - Handle **ALL** AI calls
  - Never expose API keys
- No AI logic in client
- No paid services
- No mobile app logic

---

## API Route Pattern (Example)

```ts
import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // AI or database logic here
}


// # Tech Stack & Tools

// ## Frontend
// - Next.js 16.1.1 (App Router)
// - React (useState, Server Components)
// - Tailwind CSS (utility-only)

// ## Backend
// - Next.js API Routes (no separate backend)
// - Supabase (Postgres + Storage)
// - Clerk Authentication

// ## AI Models (Hugging Face – Free Tier)
// - Background Removal: BRIA RMBG-1.4
// - Image Captioning: Salesforce BLIP
// - Image Generation: Stable Diffusion v1.5

// ## Deployment
// - Vercel (Free tier)

// ## Architecture Rules
// - Server Components for data fetching
// - Client Components for interaction only
// - API routes handle ALL AI calls
// - No client-side API keys

// ## Example Pattern (API Route)
// ```ts
// export async function POST(req: Request) {
//   const { userId } = await auth()
//   if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

//   // logic here
// } -->
