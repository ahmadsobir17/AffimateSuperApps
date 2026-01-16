-- AFFIMATE SUPER APPS DATABASE SCHEMA
-- Designed for Supabase (PostgreSQL)
-- Version: 1.0.0
-- Author: Antigravity AI (Axiamasi Team)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USERS & PROFILES
-- ==========================================

-- Create a table for public profiles (links to auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  credits INTEGER DEFAULT 5, -- Default Free Trial Credits
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'business')),
  is_verified BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Function to handle new user signup (Auto-create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- 2. AI CHARACTER GENERATOR
-- ==========================================

CREATE TABLE public.generated_characters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  prompt TEXT NOT NULL,
  
  -- Settings used for generation
  gender TEXT,
  style TEXT,
  age TEXT,
  ethnicity TEXT,
  hair_style TEXT,
  hair_color TEXT,
  body_type TEXT,
  outfit TEXT,
  
  image_url TEXT NOT NULL, -- URL to Storage Bucket
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.generated_characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own characters" 
  ON public.generated_characters FOR ALL 
  USING (auth.uid() = user_id);


-- ==========================================
-- 3. PRODUCT STUDIO (AI PHOTOSHOOT)
-- ==========================================

CREATE TABLE public.product_generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  
  -- Input Details
  product_name TEXT,
  input_image_url TEXT, -- Original user upload
  
  -- Settings
  model_type TEXT, -- e.g., 'no_human', 'hand_model', 'local_face'
  theme TEXT,
  lighting TEXT,
  camera_angle TEXT,
  custom_prompt TEXT,
  
  -- Result
  output_image_url TEXT NOT NULL,
  
  status TEXT DEFAULT 'completed', -- 'processing', 'completed', 'failed'
  cost_credits INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.product_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own product images" 
  ON public.product_generations FOR ALL 
  USING (auth.uid() = user_id);


-- ==========================================
-- 4. VIRAL SCRIPT ENGINE
-- ==========================================

CREATE TABLE public.generated_scripts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  
  title TEXT,
  content TEXT NOT NULL,
  
  -- Metadata
  platform TEXT, -- TikTok, Reels, Shorts
  category TEXT, -- Education, Comedy, Promo
  tone TEXT,
  language TEXT,
  duration_estimate TEXT,
  
  is_saved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.generated_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own scripts" 
  ON public.generated_scripts FOR ALL 
  USING (auth.uid() = user_id);


-- ==========================================
-- 5. VEO VISION (AI VIDEO)
-- ==========================================

CREATE TABLE public.veo_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  
  prompt TEXT NOT NULL,
  video_url TEXT, -- Result URL (can be null if processing)
  thumbnail_url TEXT,
  
  -- Settings
  style TEXT,
  aspect_ratio TEXT DEFAULT '9:16',
  duration_seconds INTEGER,
  
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.veo_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own videos" 
  ON public.veo_videos FOR ALL 
  USING (auth.uid() = user_id);


-- ==========================================
-- 6. TRANSACTIONS & CREDITS
-- ==========================================

CREATE TABLE public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  
  amount NUMERIC(15, 2) NOT NULL, -- Money amount (IDR/USD)
  credits_purchased INTEGER NOT NULL,
  currency TEXT DEFAULT 'IDR',
  
  payment_provider TEXT, -- 'midtrans', 'stripe', 'xendit'
  payment_id TEXT, -- External Transaction ID
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'expired'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" 
  ON public.transactions FOR SELECT 
  USING (auth.uid() = user_id);

-- Only service role (server-side) can insert/update transactions for security
-- You might want to create a policy for inserts if handling client-side (not recommended for payments)


-- ==========================================
-- 7. STORAGE BUCKETS (Documentation Only)
-- ==========================================
-- You need to create these buckets in Supabase Storage UI:
-- 1. 'avatars' (Public) - For user profile pictures
-- 2. 'input-images' (Private) - For product photos uploaded by users
-- 3. 'generated-outputs' (Public) - For AI generated results

-- Storage Policies Example (Run in SQL Editor if needed):
-- CREATE POLICY "Give users access to own folder 1we00a_0" ON storage.objects FOR SELECT TO public USING (bucket_id = 'input-images' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Give users upload access to own folder 1we00a_1" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'input-images' AND auth.uid()::text = (storage.foldername(name))[1]);


-- ==========================================
-- 8. INDEXES FOR PERFORMANCE
-- ==========================================

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_chars_user ON public.generated_characters(user_id);
CREATE INDEX idx_products_user ON public.product_generations(user_id);
CREATE INDEX idx_scripts_user ON public.generated_scripts(user_id);
CREATE INDEX idx_veo_user ON public.veo_videos(user_id);
