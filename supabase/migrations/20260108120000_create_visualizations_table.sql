-- Create the 'visualizations' table
CREATE TABLE visualizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    item_ids UUID[] NOT NULL,     -- Array of item IDs in outfit
    image_url TEXT NOT NULL,       -- Generated image URL
    prompt TEXT,                   -- Prompt used for generation (optional)
    model_used TEXT DEFAULT 'gemini-nanobanana-2.5', -- Track which AI model
    liked BOOLEAN DEFAULT FALSE,   -- For future ML training/gallery
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_visualizations_user_id ON visualizations(user_id);
CREATE INDEX idx_visualizations_created_at ON visualizations(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE visualizations ENABLE ROW LEVEL SECURITY;

-- Users can only view their own visualizations
CREATE POLICY "Users can view own visualizations"
    ON visualizations FOR SELECT
    USING (auth.jwt() ->> 'sub' = user_id);

-- Users can insert their own visualizations
CREATE POLICY "Users can insert own visualizations"
    ON visualizations FOR INSERT
    WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Users can update their own visualizations (e.g., 'liked' status)
CREATE POLICY "Users can update own visualizations"
    ON visualizations FOR UPDATE
    USING (auth.jwt() ->> 'sub' = user_id);

-- Users can delete their own visualizations
CREATE POLICY "Users can delete own visualizations"
    ON visualizations FOR DELETE
    USING (auth.jwt() ->> 'sub' = user_id);
