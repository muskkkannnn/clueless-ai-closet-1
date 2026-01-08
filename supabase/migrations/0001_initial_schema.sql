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
