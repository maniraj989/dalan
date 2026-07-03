-- ==========================================
-- DALAN SINGLE-VENDOR STOREFRONT - SCHEMA
-- ==========================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
-- Links directly to Supabase's auth.users table.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT UNIQUE, -- Nullable initially (collected in onboarding)
    email TEXT UNIQUE,
    delivery_address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    profile_photo_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Public profiles are viewable by everyone." 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own profile." 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- 2. DALAN MENU TABLE (Exclusive to Dalan's kitchen items)
CREATE TABLE IF NOT EXISTS public.dalan_menu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0.0), -- Price in NPR
    category TEXT NOT NULL CHECK (category IN ('Momo', 'Traditional Platters', 'Beverages', 'Desserts')),
    image_url TEXT,
    is_veg BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3,2) DEFAULT 4.5 CHECK (rating >= 1.0 AND rating <= 5.0),
    delivery_time_mins INTEGER DEFAULT 20 CHECK (delivery_time_mins > 0),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on Dalan Menu
ALTER TABLE public.dalan_menu ENABLE ROW LEVEL SECURITY;

-- Dalan Menu Policies
CREATE POLICY "Allow public read access to Dalan menu" 
    ON public.dalan_menu FOR SELECT 
    USING (true);

-- 3. ORDERS TABLE (Simplified, single-vendor)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0.0),
    delivery_address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order Policies
CREATE POLICY "Users can view their own orders." 
    ON public.orders FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders." 
    ON public.orders FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 4. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    menu_item_id UUID REFERENCES public.dalan_menu(id) ON DELETE SET NULL NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0.0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Order Item Policies
CREATE POLICY "Users can view order items for their own orders." 
    ON public.order_items FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.orders 
        WHERE public.orders.id = public.order_items.order_id 
        AND public.orders.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert order items for their own orders." 
    ON public.order_items FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.orders 
        WHERE public.orders.id = public.order_items.order_id 
        AND public.orders.user_id = auth.uid()
    ));

-- ==========================================
-- TRIGGERS FOR USER PROFILE AUTO-CREATION
-- ==========================================

-- Function to handle creating a profile when a new user signs up via Google Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, phone, email, profile_photo_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Dalan Guest'),
        NULL, -- Phone number collected during profile completion
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution link
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- STORAGE BUCKET CONFIGURATION
-- ==========================================

-- Create Bucket for Profile Photos in storage.buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies on storage.objects for profile photos
CREATE POLICY "Allow public access to read profile photos" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'profile-photos');

CREATE POLICY "Allow authenticated users to upload profile photos" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'profile-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own profile photo" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own profile photo" 
    ON storage.objects FOR DELETE 
    USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
