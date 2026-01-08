# GEMINI.md – Gemini CLI Configuration for Clueless AI Closet

## 🎯 Project Context
**App:** Clueless AI Closet  

**Locked MVP Stack:**
- Next.js 16.1.1 (App Router)
- Tailwind CSS
- Supabase (Postgres + Storage)
- Clerk Authentication
- Gemini NanoBanana 2.5 (primary image generation)
- Hugging Face BRIA RMBG-1.4 (background removal ONLY)

**Stage:** MVP Development  
**User Level:** C – Learning while building

---

## 📋 Directives
1. **Always read `AGENTS.md` first** before planning or coding
2. **Follow `agent_docs/product_requirements.md` strictly**
3. **Build ONE feature at a time**
4. **Explain the approach before writing code**
5. **Choose the simplest working solution**
6. **Do NOT introduce new AI models or services**
7. **All AI calls must go through `/app/api/*` routes**

---

## ⛔ Explicit Restrictions
- Do NOT use Stable Diffusion
- Do NOT use BLIP or image captioning
- Do NOT create multi-step AI pipelines
- Do NOT add paid APIs
- Do NOT refactor unless something is broken

---

## 🛠 Commands
- `npm run dev` — start development server
- `npm run build` — production build

<!-- # GEMINI.md – Gemini CLI Configuration for Clueless AI Closet

## 🎯 Project Context
**App:** Clueless AI Closet  
**Stack:** Next.js 16.1.1, Supabase, Clerk, Tailwind, Hugging Face  
**Stage:** MVP Development  
**User Level:** C – Learning while building

## 📋 Directives
1. Always read AGENTS.md first
2. Follow product_requirements.md strictly
3. Build ONE feature at a time
4. Explain before coding
5. No unnecessary abstractions

## 🛠 Commands
- npm run dev
- npm run build -->
