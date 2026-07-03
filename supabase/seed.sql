-- ==========================================
-- DALAN SINGLE-VENDOR STOREFRONT - SEED DATA
-- ==========================================

-- Seed Dalan's exclusive menu items

INSERT INTO public.dalan_menu (name, description, price, category, image_url, is_veg, rating, delivery_time_mins, is_available)
VALUES
-- MOMO CATEGORY
(
    'Special Steamed Buff Momo (10 pcs)',
    'Dalan''s signature dumplings stuffed with spiced minced buffalo meat, onion, and fresh herbs, served with traditional spicy tomato chutney.',
    150.00,
    'Momo',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60',
    FALSE,
    4.85,
    15,
    TRUE
),
(
    'Chicken Chilli Momo (C-Momo)',
    'Fried momos tossed in a delicious, hot, and tangy bell pepper and onion chili sauce.',
    220.00,
    'Momo',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60',
    FALSE,
    4.78,
    20,
    TRUE
),
(
    'Buff Kothey Momo (10 pcs)',
    'Classic half-moon pan-fried dumplings filled with rich spiced buffalo meat, served with hot sesame-tomato dipping soup.',
    180.00,
    'Momo',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60',
    FALSE,
    4.72,
    18,
    TRUE
),
(
    'Paneer Veg Kothey Momo (10 pcs)',
    'Pan-fried momo stuffed with seasoned cottage cheese, cabbage, and select Nepalese herbs.',
    210.00,
    'Momo',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60',
    TRUE,
    4.65,
    18,
    TRUE
),

-- TRADITIONAL PLATTERS CATEGORY
(
    'Chicken Thakali Thali Set',
    'Authentic Thakali platter with long-grain rice, black lentil soup (Kalo Daal), local chicken curry, gundruk sandheko, mustard greens, and radish pickle.',
    380.00,
    'Traditional Platters',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60',
    FALSE,
    4.88,
    25,
    TRUE
),
(
    'Vegetarian Thakali Thali Set',
    'Traditional platter featuring local rice, organic ghee, daal, seasonal curries, local pickles, and salad.',
    320.00,
    'Traditional Platters',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60',
    TRUE,
    4.70,
    22,
    TRUE
),
(
    'Deluxe Mutton Curry Thali',
    'Premium Thakali set served with tender spiced mountain goat meat curry, rice, greens, black lentils, and home-style condiments.',
    460.00,
    'Traditional Platters',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60',
    FALSE,
    4.90,
    25,
    TRUE
),
(
    'Gundruk & Dhido Platter',
    'Traditional Nepalese meal featuring thick buckwheat/millet porridge (Dhido) served with fermented mustard leaf soup (Gundruk), local ghee, and pickles.',
    290.00,
    'Traditional Platters',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60',
    TRUE,
    4.60,
    20,
    TRUE
),

-- BEVERAGES CATEGORY
(
    'Special Masala Chai',
    'Dalan''s organic milk tea brewed with cardamom, green ginger, cloves, and premium orthodox leaves from Ilam.',
    55.00,
    'Beverages',
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60',
    TRUE,
    4.95,
    8,
    TRUE
),
(
    'Organic Ilam Black Tea',
    'Rich, aromatic orthodox black tea leaves from the scenic hills of Ilam.',
    40.00,
    'Beverages',
    'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60',
    TRUE,
    4.75,
    8,
    TRUE
),
(
    'Iced Caramel Latte',
    'Double shot of organic espresso served over chilled milk, sweet caramel syrup, and whipped cream.',
    160.00,
    'Beverages',
    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
    TRUE,
    4.80,
    10,
    TRUE
),

-- DESSERTS CATEGORY
(
    'Selroti with Rabri (2 pcs)',
    'Crispy ring-shaped Nepalese sweet rice bread served with slow-cooked condensed sweet milk (Rabri).',
    140.00,
    'Desserts',
    'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60',
    TRUE,
    4.85,
    10,
    TRUE
),
(
    'Warm Carrot Halwa',
    'Grated carrot pudding slow-cooked in milk, clarified butter (ghee), sugar, and garnished with almonds and cashews.',
    110.00,
    'Desserts',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60',
    TRUE,
    4.68,
    12,
    TRUE
);
