# AGENTS.md – Master Plan for Clueless AI Closet

## 🎯 Project Overview
**App:** Clueless AI Closet  
**Goal:** Help people who struggle with styling visualize outfits on a person before wearing them  

**Stack (MVP LOCKED):**
- Next.js 16.1.1 (App Router)
- Tailwind CSS
- Supabase (Postgres + Storage)
- Clerk Authentication
- Gemini NanoBanana 2.5 (AI outfit visualization)
- Hugging Face BRIA RMBG-1.4 (background removal ONLY)

**Current Phase:** Phase 1 – MVP Build (3-day sprint)

---

## 🧠 How I Should Think
1. **Understand intent before coding**
2. **Ask ONE clarifying question if something critical is missing**
3. **Plan → confirm → implement**
4. **Test after every feature**
5. **Explain trade-offs briefly when suggesting approaches**

---

## 📁 Context Files (load only when needed)
- `agent_docs/tech_stack.md`
- `agent_docs/product_requirements.md`
- `agent_docs/testing.md`

---

## 🔄 Current State (UPDATE THIS DAILY)
**Last Updated:** 2026-01-05  
**Working On:** MVP foundation  
**Recently Completed:** PRD + Technical Design  
**Blocked By:** None

---

## 🚀 Roadmap

### Phase 1 – Foundation
- [x] Initialize Next.js 16.1.1 project
- [x] Setup Clerk authentication
- [x] Setup Supabase (DB + Storage)

### Phase 2 – Core MVP Features
- [x] Image upload + background removal
- [x] Digital closet grid
- [x] Outfit canvas (manual selection only)
- [x] AI visualization (Gemini NanoBanana – single step)
- [x] Save / download visualization
- [x] Delete closet items

---

## 🔒 AI Architecture Lock (VERY IMPORTANT)
- Use **Gemini NanoBanana 2.5** for ALL outfit visualization
- Use **BRIA RMBG-1.4** only for background removal
- **DO NOT** use BLIP or Stable Diffusion in MVP
- **DO NOT** implement multi-step AI pipelines
- Captioning, tagging, and advanced try-on realism are **V2 features**

---

## 🔐 Environment Rules
- Server-only keys must NEVER be used in client components
- All AI calls must go through `/app/api/*`
- Do NOT add new environment variables without updating `.env.example`

---

## ⚠️ What NOT To Do
- Do NOT add features outside MVP
- Do NOT introduce paid services
- Do NOT delete files without confirmation
- Do NOT skip error handling
- Do NOT optimize prematurely

<!-- # AGENTS.md – Master Plan for Clueless AI Closet

## 🎯 Project Overview
**App:** Clueless AI Closet  
**Goal:** Help people who struggle with styling visualize outfits on a person before wearing them  
**Stack:** Next.js 16.1.1 (App Router), Tailwind CSS, Supabase, Clerk, Hugging Face (BLIP + Stable Diffusion + BRIA RMBG)  
**Current Phase:** Phase 1 – MVP Build (3-day sprint)

## 🧠 How I Should Think
1. Understand intent before coding
2. Ask ONE clarifying question if something critical is missing
3. Plan → confirm → implement
4. Test after every feature
5. Explain trade-offs briefly when suggesting approaches

## 📁 Context Files (load only when needed)
- `agent_docs/tech_stack.md`
- `agent_docs/product_requirements.md`
- `agent_docs/testing.md`

## 🔄 Current State (UPDATE THIS DAILY)
**Last Updated:** 2026-01-05  
**Working On:** MVP foundation  
**Recently Completed:** PRD + Technical Design  
**Blocked By:** None

## 🚀 Roadmap

### Phase 1 – Foundation
- [ ] Initialize Next.js 16.1.1 project
- [ ] Setup Clerk authentication
- [ ] Setup Supabase (DB + Storage)

### Phase 2 – Core MVP Features
- [ ] Image upload + background removal
- [ ] Digital closet grid
- [ ] Outfit canvas
- [ ] AI visualization pipeline
- [ ] Save / download visualization
- [ ] Delete closet items

## ⚠️ What NOT To Do
- Do NOT add features outside MVP
- Do NOT introduce paid services
- Do NOT delete files without confirmation
- Do NOT skip error handling
- Do NOT optimize prematurely -->
