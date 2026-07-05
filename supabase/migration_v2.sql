-- ============================================================
--  DALAN RESTAURANT APP — IDEMPOTENT FRESH INSTALL SCRIPT
--  Owner: sharmabro275@gmail.com
--
--  SAFE TO RUN MULTIPLE TIMES.
--  Every CREATE POLICY is preceded by DROP POLICY IF EXISTS.
--  Every CREATE TABLE uses IF NOT EXISTS.
--  Every storage bucket INSERT uses ON CONFLICT DO NOTHING.
--  Every function/trigger uses CREATE OR REPLACE.
--
--  Execution order:
--    STEP 1  →  Create Tables (dependency order)
--    STEP 2  →  Enable RLS
--    STEP 3  →  Create Storage Buckets
--    STEP 4  →  Drop + Recreate All Policies  ← idempotency fix
--    STEP 5  →  Create Functions & Triggers
--    STEP 6  →  Enable Realtime
--    STEP 7  →  Verification queries (commented out)
-- ============================================================


-- ============================================================
-- STEP 0: PREREQUISITES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- STEP 1: CREATE TABLES
-- Order: parent tables first, then child tables.
--   auth.users (Supabase built-in)
--     └─ profiles
--     └─ orders
--          └─ order_items ──► dalan_menu
-- ============================================================

-- ── 1a. PROFILES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id                UUID          PRIMARY KEY
                                    REFERENCES auth.users(id) ON DELETE CASCADE,
    name              TEXT          NOT NULL,
    phone             TEXT          UNIQUE,
    email             TEXT          UNIQUE,
    delivery_address  TEXT,
    latitude          DOUBLE PRECISION,
    longitude         DOUBLE PRECISION,
    profile_photo_url TEXT,
    updated_at        TIMESTAMPTZ   DEFAULT timezone('utc', now()),
    created_at        TIMESTAMPTZ   DEFAULT timezone('utc', now())
);

-- ── 1b. DALAN MENU ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.dalan_menu (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT          NOT NULL,
    description       TEXT,
    price             NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    category          TEXT          NOT NULL
                                    CHECK (category IN (
                                        'Momo',
                                        'Traditional Platters',
                                        'Beverages',
                                        'Desserts'
                                    )),
    image_url         TEXT,
    is_veg            BOOLEAN       DEFAULT TRUE,
    rating            NUMERIC(3,2)  DEFAULT 4.5
                                    CHECK (rating >= 1.0 AND rating <= 5.0),
    delivery_time_mins INTEGER      DEFAULT 20 CHECK (delivery_time_mins > 0),
    is_available      BOOLEAN       DEFAULT TRUE,
    created_at        TIMESTAMPTZ   DEFAULT timezone('utc', now())
);

-- ── 1c. ORDERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
    id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID          NOT NULL
                                   REFERENCES public.profiles(id) ON DELETE SET NULL,
    status           TEXT          NOT NULL DEFAULT 'pending'
                                   CHECK (status IN (
                                       'pending',
                                       'preparing',
                                       'out_for_delivery',
                                       'delivered',
                                       'cancelled'
                                   )),
    total_amount     NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_method   TEXT          NOT NULL DEFAULT 'cod'
                                   CHECK (payment_method IN ('cod', 'esewa')),
    delivery_address TEXT,
    latitude         DOUBLE PRECISION,
    longitude        DOUBLE PRECISION,
    notes            TEXT,
    customer_name    TEXT,
    phone            TEXT,
    created_at       TIMESTAMPTZ   DEFAULT timezone('utc', now()),
    updated_at       TIMESTAMPTZ   DEFAULT timezone('utc', now())
);

-- ── 1d. ORDER ITEMS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id     UUID          NOT NULL
                               REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID
                               REFERENCES public.dalan_menu(id) ON DELETE SET NULL,
    item_name    TEXT,
    quantity     INTEGER       NOT NULL CHECK (quantity > 0),
    price        NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    created_at   TIMESTAMPTZ   DEFAULT timezone('utc', now())
);


-- ============================================================
-- STEP 2: ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dalan_menu  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- STEP 3: CREATE STORAGE BUCKETS
-- ON CONFLICT DO NOTHING makes this safe to re-run.
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-photos', 'menu-photos', true)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- STEP 4: DROP THEN RECREATE ALL POLICIES  (IDEMPOTENCY FIX)
--
-- Every DROP is IF EXISTS so it silently skips on first run.
-- Every CREATE then runs fresh with no "already exists" error.
-- ============================================================


-- ── 4a. PROFILES ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Profiles: public read"    ON public.profiles;
DROP POLICY IF EXISTS "Profiles: owner insert"   ON public.profiles;
DROP POLICY IF EXISTS "Profiles: owner update"   ON public.profiles;

-- Carry-over names from schema.sql (drop those too for clean slate)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile."       ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile."       ON public.profiles;

CREATE POLICY "Profiles: public read"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Profiles: owner insert"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: owner update"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);


-- ── 4b. DALAN MENU ────────────────────────────────────────────
DROP POLICY IF EXISTS "Menu: public read"   ON public.dalan_menu;
DROP POLICY IF EXISTS "Menu: owner insert"  ON public.dalan_menu;
DROP POLICY IF EXISTS "Menu: owner update"  ON public.dalan_menu;
DROP POLICY IF EXISTS "Menu: owner delete"  ON public.dalan_menu;

-- Carry-over names from schema.sql
DROP POLICY IF EXISTS "Allow public read access to Dalan menu" ON public.dalan_menu;
-- Carry-over names from migration_v2 (old naming)
DROP POLICY IF EXISTS "Owner can insert menu items"            ON public.dalan_menu;
DROP POLICY IF EXISTS "Owner can update menu items"            ON public.dalan_menu;
DROP POLICY IF EXISTS "Owner can delete menu items"            ON public.dalan_menu;

CREATE POLICY "Menu: public read"
    ON public.dalan_menu FOR SELECT
    USING (true);

CREATE POLICY "Menu: owner insert"
    ON public.dalan_menu FOR INSERT
    WITH CHECK (auth.email() = 'sharmabro275@gmail.com');

CREATE POLICY "Menu: owner update"
    ON public.dalan_menu FOR UPDATE
    USING (auth.email() = 'sharmabro275@gmail.com');

CREATE POLICY "Menu: owner delete"
    ON public.dalan_menu FOR DELETE
    USING (auth.email() = 'sharmabro275@gmail.com');


-- ── 4c. ORDERS ────────────────────────────────────────────────
DROP POLICY IF EXISTS "Orders: customer read own"    ON public.orders;
DROP POLICY IF EXISTS "Orders: customer insert own"  ON public.orders;
DROP POLICY IF EXISTS "Orders: owner read all"       ON public.orders;
DROP POLICY IF EXISTS "Orders: owner update status"  ON public.orders;

-- Carry-over names from schema.sql
DROP POLICY IF EXISTS "Users can view their own orders."   ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders." ON public.orders;
-- Carry-over names from migration_v2 (old naming)
DROP POLICY IF EXISTS "Owner can view all orders"          ON public.orders;
DROP POLICY IF EXISTS "Owner can update order status"      ON public.orders;

CREATE POLICY "Orders: customer read own"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Orders: customer insert own"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Orders: owner read all"
    ON public.orders FOR SELECT
    USING (auth.email() = 'sharmabro275@gmail.com');

CREATE POLICY "Orders: owner update status"
    ON public.orders FOR UPDATE
    USING (auth.email() = 'sharmabro275@gmail.com');


-- ── 4d. ORDER ITEMS ───────────────────────────────────────────
DROP POLICY IF EXISTS "Order items: customer read own"    ON public.order_items;
DROP POLICY IF EXISTS "Order items: customer insert own"  ON public.order_items;
DROP POLICY IF EXISTS "Order items: owner read all"       ON public.order_items;

-- Carry-over names from schema.sql
DROP POLICY IF EXISTS "Users can view order items for their own orders."   ON public.order_items;
DROP POLICY IF EXISTS "Users can insert order items for their own orders." ON public.order_items;
-- Carry-over names from migration_v2 (old naming)
DROP POLICY IF EXISTS "Owner can view all order items"                     ON public.order_items;

CREATE POLICY "Order items: customer read own"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE public.orders.id      = public.order_items.order_id
              AND public.orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Order items: customer insert own"
    ON public.order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE public.orders.id      = public.order_items.order_id
              AND public.orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Order items: owner read all"
    ON public.order_items FOR SELECT
    USING (auth.email() = 'sharmabro275@gmail.com');


-- ── 4e. STORAGE — PROFILE PHOTOS ─────────────────────────────
DROP POLICY IF EXISTS "Profile photos: public read"           ON storage.objects;
DROP POLICY IF EXISTS "Profile photos: authenticated upload"  ON storage.objects;
DROP POLICY IF EXISTS "Profile photos: owner update"          ON storage.objects;
DROP POLICY IF EXISTS "Profile photos: owner delete"          ON storage.objects;

-- Carry-over names from schema.sql
DROP POLICY IF EXISTS "Allow public access to read profile photos"         ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own profile photo"      ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own profile photo"      ON storage.objects;

CREATE POLICY "Profile photos: public read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-photos');

CREATE POLICY "Profile photos: authenticated upload"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'profile-photos'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Profile photos: owner update"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'profile-photos'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Profile photos: owner delete"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'profile-photos'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );


-- ── 4f. STORAGE — MENU PHOTOS ────────────────────────────────
DROP POLICY IF EXISTS "Menu photos: public read"    ON storage.objects;
DROP POLICY IF EXISTS "Menu photos: owner upload"   ON storage.objects;
DROP POLICY IF EXISTS "Menu photos: owner update"   ON storage.objects;
DROP POLICY IF EXISTS "Menu photos: owner delete"   ON storage.objects;

-- Carry-over names from migration_v2 (old naming)
DROP POLICY IF EXISTS "Allow public read access to menu photos" ON storage.objects;
DROP POLICY IF EXISTS "Owner can upload menu photos"            ON storage.objects;
DROP POLICY IF EXISTS "Owner can update menu photos"            ON storage.objects;
DROP POLICY IF EXISTS "Owner can delete menu photos"            ON storage.objects;

CREATE POLICY "Menu photos: public read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'menu-photos');

CREATE POLICY "Menu photos: owner upload"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'menu-photos'
        AND auth.email() = 'sharmabro275@gmail.com'
    );

CREATE POLICY "Menu photos: owner update"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'menu-photos'
        AND auth.email() = 'sharmabro275@gmail.com'
    );

CREATE POLICY "Menu photos: owner delete"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'menu-photos'
        AND auth.email() = 'sharmabro275@gmail.com'
    );


-- ============================================================
-- STEP 5: FUNCTIONS & TRIGGERS
-- CREATE OR REPLACE makes these idempotent automatically.
-- ============================================================

-- ── 5a. Auto-create profile on Google Sign-Up ─────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, name, phone, email, profile_photo_url)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            'Dalan Guest'
        ),
        NULL,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 5b. Auto-update orders.updated_at on row change ───────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ============================================================
-- STEP 6: ENABLE REALTIME
-- The DO block suppresses the error if orders is already
-- added to the publication (making this step idempotent too).
-- ============================================================
DO $$
BEGIN
    -- Add orders table to realtime publication if not already present
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname   = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename  = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;
END;
$$;


-- ============================================================
-- STEP 7: VERIFICATION QUERIES
-- Uncomment any block and run separately to verify setup.
-- ============================================================

-- 7a. Check all tables exist:
-- SELECT tablename
--   FROM pg_tables
--   WHERE schemaname = 'public'
--   ORDER BY tablename;

-- 7b. Check orders table has all required columns:
-- SELECT column_name, data_type, column_default, is_nullable
--   FROM information_schema.columns
--   WHERE table_schema = 'public'
--     AND table_name   = 'orders'
--   ORDER BY ordinal_position;

-- 7c. Check all RLS policies (should show 11 rows on public tables):
-- SELECT schemaname, tablename, policyname, cmd, qual
--   FROM pg_policies
--   WHERE schemaname IN ('public', 'storage')
--   ORDER BY tablename, policyname;

-- 7d. Check storage buckets exist:
-- SELECT id, name, public FROM storage.buckets;

-- 7e. Check realtime publication includes orders:
-- SELECT pubname, schemaname, tablename
--   FROM pg_publication_tables
--   WHERE pubname = 'supabase_realtime';

-- 7f. Count policies per table (quick sanity check):
-- SELECT tablename, COUNT(*) AS policy_count
--   FROM pg_policies
--   WHERE schemaname IN ('public', 'storage')
--   GROUP BY tablename
--   ORDER BY tablename;
