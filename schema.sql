-- AFFIMATE SUPER APPS DATABASE SCHEMA
-- Designed for Supabase (PostgreSQL)
-- Version: 1.0.0
-- Author: Antigravity AI (Axiamasi Team)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 0. CLEANUP (RESET DATABASE)
-- Run this section if you want to start fresh
-- ==========================================
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.veo_videos CASCADE;
DROP TABLE IF EXISTS public.generated_scripts CASCADE;
DROP TABLE IF EXISTS public.product_generations CASCADE;
DROP TABLE IF EXISTS public.generated_characters CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop Functions & Triggers to avoid conflicts
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.claim_free_trial(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.generate_unique_referral_code() CASCADE;
DROP FUNCTION IF EXISTS public.redeem_referral_code(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.process_referral_bonus(UUID, NUMERIC) CASCADE;

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
  credits NUMERIC(15, 2) DEFAULT 0.35, -- Default Free Trial Balance (~Rp 5000)
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

-- Update profiles table
-- NOTE: Please run this migration in your Supabase SQL Editor

-- 1. Modify credits to default to 0 (we will grant it via RPC if secure)
ALTER TABLE profiles ALTER COLUMN credits SET DEFAULT 0.00;

-- 2. Add security tracking columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_ip TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS device_hash TEXT;

-- 3. Create Secure RPC Function for Trial Claiming
CREATE OR REPLACE FUNCTION claim_free_trial(p_ip_address TEXT, p_device_hash TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_abuse_count INTEGER;
    v_current_credits NUMERIC;
BEGIN
    v_user_id := auth.uid();
    
    -- Get current credits to ensure we don't double grant
    SELECT credits INTO v_current_credits FROM profiles WHERE id = v_user_id;
    
    -- If user already has credits (e.g. from previous topup or claim), do nothing
    IF v_current_credits > 0.05 THEN
        RETURN 'ALREADY_CLAIMED';
    END IF;

    -- Check for abuse: Look for ANY other user with same IP or Device Hash (ignoring 'unknown' values)
    SELECT COUNT(*) INTO v_abuse_count
    FROM profiles
    WHERE id != v_user_id
    AND (
        (signup_ip = p_ip_address AND p_ip_address != 'unknown-ip')
        OR
        (device_hash = p_device_hash AND p_device_hash != 'unknown-hash')
    );

    IF v_abuse_count > 0 THEN
        -- Abuse detected! Log it but DO NOT grant credits.
        UPDATE profiles 
        SET signup_ip = p_ip_address, device_hash = p_device_hash 
        WHERE id = v_user_id;
        
        RETURN 'ABUSE_DETECTED'; -- Frontend will handle this (show 0 balance)
    ELSE
        -- Clean user! Grant Free Trial
        UPDATE profiles 
        SET credits = 0.35, -- Grant the $0.35
            signup_ip = p_ip_address, 
            device_hash = p_device_hash 
        WHERE id = v_user_id;
        
        RETURN 'SUCCESS';
    END IF;
END;
$$;

-- 4. Affiliate System Schema
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_earnings NUMERIC(15, 2) DEFAULT 0.00;

-- Function to generate random unique referral code
CREATE OR REPLACE FUNCTION generate_unique_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    key TEXT;
    qry TEXT;
    found TEXT;
BEGIN
    key := upper(substring(md5(random()::text) from 0 for 7));
    qry := 'SELECT referral_code FROM profiles WHERE referral_code = ' || quote_literal(key);
    EXECUTE qry INTO found;
    IF found IS NOT NULL THEN
        RETURN generate_unique_referral_code();
    END IF;
    RETURN key;
END;
$$;

-- Function to Redeem Referral Code (Set Referrer)
CREATE OR REPLACE FUNCTION redeem_referral_code(p_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_referrer_id UUID;
BEGIN
    v_user_id := auth.uid();
    
    -- Check if already referred
    IF EXISTS (SELECT 1 FROM profiles WHERE id = v_user_id AND referred_by IS NOT NULL) THEN
        RETURN 'ALREADY_REFERRED';
    END IF;

    -- Find referrer
    SELECT id INTO v_referrer_id FROM profiles WHERE referral_code = upper(p_code);
    
    IF v_referrer_id IS NULL THEN
        RETURN 'INVALID_CODE';
    END IF;

    IF v_referrer_id = v_user_id THEN
        RETURN 'SELF_REFERRAL';
    END IF;

    -- Update profile
    UPDATE profiles SET referred_by = v_referrer_id WHERE id = v_user_id;
    RETURN 'SUCCESS';
END;
$$;

-- Function to Process Top-Up Bonus (10%)
-- This should be called by your server-side payment webhook after successful payment
CREATE OR REPLACE FUNCTION process_referral_bonus(p_user_id UUID, p_amount NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_referrer_id UUID;
    v_bonus NUMERIC;
BEGIN
    -- Find referrer
    SELECT referred_by INTO v_referrer_id FROM profiles WHERE id = p_user_id;

    IF v_referrer_id IS NOT NULL THEN
        -- Calculate 10% bonus
        v_bonus := p_amount * 0.10;

        -- Update referrer's balance and earnings
        UPDATE profiles 
        SET credits = credits + v_bonus,
            referral_earnings = referral_earnings + v_bonus
        WHERE id = v_referrer_id;
    END IF;
END;
$$;

-- Function to handle new user signup (Auto-create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, credits, referral_code)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    0.00, -- Default credits (security logic applies later)
    generate_unique_referral_code()
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

-- MANUAL RESET & FIX TOOLS
-- 1. Fix stuck "LOADING..." for users who existed before affiliate system
UPDATE profiles 
SET referral_code = generate_unique_referral_code() 
WHERE referral_code IS NULL;

-- 2. Reset Security Flags for SPECIFIC USER
-- (Use this if you accidentally blocked your own account during testing)
/*
UPDATE profiles
SET 
  signup_ip = NULL,
  device_hash = NULL,
  credits = 0.35
WHERE id = (SELECT id FROM auth.users WHERE email = 'agusahmad1997@gmail.com');
*/

-- ==========================================
-- 9. EMERGENCY REPAIR (RUN THIS IF STUCK)
-- ==========================================
-- Masalah: "Nyangkut" karena Table Profiles dihapus, tapi User di Auth masih ada.
-- Solusi: Script ini akan membuatkan Profile baru untuk semua User yang ada di Auth.

INSERT INTO public.profiles (id, email, full_name, avatar_url, credits, referral_code)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'User'), 
    raw_user_meta_data->>'avatar_url',
    0.35, -- Kasih saldo trial buat user yang di-recover
    generate_unique_referral_code()
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
    referral_code = COALESCE(profiles.referral_code, generate_unique_referral_code()),
    credits = CASE WHEN profiles.credits < 0.05 THEN 0.35 ELSE profiles.credits END;

-- ==========================================
-- 10. FINAL FIX FOR LOGIN ERROR (ROBUST TRIGGER)
-- ==========================================
-- This fixes "Database error saving new user" by handling duplicate emails (Orphaned Profiles)

-- 1. Remove orphaned profiles (Profiles with no matching Auth User)
-- This cleans up data if you deleted the Auth User but Profile stuck around
DELETE FROM public.profiles 
WHERE id NOT IN (SELECT id FROM auth.users);

-- 2. Make the Trigger ROBUST against conflicts
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, credits, referral_code)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'), 
    new.raw_user_meta_data->>'avatar_url',
    0.35,
    generate_unique_referral_code()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
EXCEPTION WHEN unique_violation THEN
  -- If Email already exists (stale profile), allow login to succeed anyway.
  -- The profile will be missing, but user can login.
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Run Emergency Repair again to fill gaps
INSERT INTO public.profiles (id, email, full_name, avatar_url, credits, referral_code)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'User'), 
    raw_user_meta_data->>'avatar_url',
    0.35,
    generate_unique_referral_code()
FROM auth.users
ON CONFLICT (id) DO NOTHING;

