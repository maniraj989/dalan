/**
 * Dalan Food Delivery â€” app.js (v2)
 * Modules: Auth, Profile, Menu, Cart, Checkout, Order History (Realtime), Owner Dashboard
 */

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 1. SUPABASE CLIENT & CONFIGURATION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const SUPABASE_URL = "https://iobpvspmmjrrvixnmjth.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Uzeynpiw4AQQVnHSP_15Xw_awXtAciE";
const OWNER_EMAIL = "sharmabro275@gmail.com";  // Hardcoded owner gate

let supabaseClient = null;
const urlParams = new URLSearchParams(window.location.search);
const isMockMode = urlParams.get('mock') === 'true';

if (typeof window.supabase !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY && !isMockMode) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        realtime: { params: { eventsPerSecond: 10 } }
    });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 2. MOCK MENU DATA (fallback for demo mode)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const mockDalanMenu = [
    { id: 'm1-buff-momo', name: 'Special Steamed Buff Momo (10 pcs)', description: 'Dalan\'s signature dumplings stuffed with spiced minced buffalo meat, onion, and fresh herbs, served with traditional spicy tomato chutney.', price: 150.00, category: 'Momo', image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60', is_veg: false, rating: 4.85, delivery_time_mins: 15 },
    { id: 'm2-chilli-momo', name: 'Chicken Chilli Momo (C-Momo)', description: 'Fried dumplings tossed in a delicious sweet, spicy, and tangy bell pepper and onion chili sauce.', price: 220.00, category: 'Momo', image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60', is_veg: false, rating: 4.78, delivery_time_mins: 20 },
    { id: 'm3-kothey-momo', name: 'Buff Kothey Momo (10 pcs)', description: 'Classic half-moon pan-fried dumplings filled with rich spiced buffalo meat, served with hot sesame-tomato dipping soup.', price: 180.00, category: 'Momo', image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60', is_veg: false, rating: 4.72, delivery_time_mins: 18 },
    { id: 'm4-paneer-momo', name: 'Paneer Veg Kothey Momo (10 pcs)', description: 'Pan-fried dumplings stuffed with seasoned cottage cheese, fresh cabbage, and select Nepalese herbs.', price: 210.00, category: 'Momo', image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60', is_veg: true, rating: 4.65, delivery_time_mins: 18 },
    { id: 't1-chicken-thali', name: 'Chicken Thakali Thali Set', description: 'Authentic Thakali platter with long-grain rice, black lentil soup (Kalo Daal), local chicken curry, gundruk sandheko, mustard greens, and radish pickle.', price: 380.00, category: 'Traditional Platters', image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60', is_veg: false, rating: 4.88, delivery_time_mins: 25 },
    { id: 't2-veg-thali', name: 'Vegetarian Thakali Thali Set', description: 'Traditional Nepalese platter featuring local organic rice, ghee, daal, seasonal vegetables, gundruk pickle, and salad.', price: 320.00, category: 'Traditional Platters', image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60', is_veg: true, rating: 4.70, delivery_time_mins: 22 },
    { id: 't3-mutton-thali', name: 'Deluxe Mutton Curry Thali', description: 'Premium Thakali feast served with tender mountain goat meat curry, rice, greens, black lentils, ghee, and home-style condiments.', price: 460.00, category: 'Traditional Platters', image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60', is_veg: false, rating: 4.90, delivery_time_mins: 25 },
    { id: 't4-dhido-platter', name: 'Gundruk & Dhido Platter', description: 'Traditional Nepalese meal featuring thick buckwheat/millet porridge (Dhido) served with fermented mustard leaf soup (Gundruk), local ghee, and pickles.', price: 290.00, category: 'Traditional Platters', image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60', is_veg: true, rating: 4.60, delivery_time_mins: 20 },
    { id: 'b1-masala-chai', name: 'Special Masala Chai', description: 'Dalan\'s organic milk tea brewed with cardamom, fresh ginger, cloves, and premium orthodox leaves from Ilam.', price: 55.00, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60', is_veg: true, rating: 4.95, delivery_time_mins: 8 },
    { id: 'b2-black-tea', name: 'Organic Ilam Black Tea', description: 'Rich, aromatic orthodox black tea leaves from the scenic hills of Ilam.', price: 40.00, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60', is_veg: true, rating: 4.75, delivery_time_mins: 8 },
    { id: 'b3-iced-latte', name: 'Iced Caramel Latte', description: 'Double shot of organic espresso served over chilled milk, sweet caramel syrup, and whipped cream.', price: 160.00, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60', is_veg: true, rating: 4.80, delivery_time_mins: 10 },
    { id: 'd1-selroti', name: 'Selroti with Rabri (2 pcs)', description: 'Crispy ring-shaped Nepalese sweet rice bread served with slow-cooked condensed sweet milk (Rabri).', price: 140.00, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60', is_veg: true, rating: 4.85, delivery_time_mins: 10 },
    { id: 'd2-halwa', name: 'Warm Carrot Halwa', description: 'Grated carrot pudding slow-cooked in milk, clarified butter (ghee), sugar, and garnished with almonds and cashews.', price: 110.00, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60', is_veg: true, rating: 4.68, delivery_time_mins: 12 }
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 3. APPLICATION STATE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let appState = {
    currentUser: null,
    currentUserProfile: null,
    isOwner: false,
    cart: [],
    selectedCategory: 'All',
    searchQuery: '',
    currentAddress: '',
    userLatitude: null,
    userLongitude: null,
    selectedPaymentMethod: 'cod',
    activeOrderRealtimeSub: null,  // Supabase realtime channel for customer orders
    ownerOrderRealtimeSub: null,  // Supabase realtime channel for owner dashboard
    ownerNewOrderCount: 0,
    ownerCurrentFilter: 'all',
    ownerAllOrders: [],
};

// Audio context for notification sound (lazily initialized after user gesture)
let _audioCtx = null;
function getAudioCtx() {
    if (!_audioCtx) {
        try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { }
    }
    return _audioCtx;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 4. ROUTER & SCREEN SWITCHER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 5. APPLICATION INITIALIZATION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
document.addEventListener('DOMContentLoaded', async () => {
    if (supabaseClient) {
        await checkProfileAndNavigate();
    }

    setTimeout(() => {
        const active = document.querySelector('.screen.active');
        const onSplash = active && active.id === 'splash-screen';
        if (onSplash) {
            if (appState.currentUser) {
                if (appState.isOwner) {
                    navigateTo('owner-dashboard');
                } else {
                    navigateTo('dashboard-screen');
                }
            } else {
                navigateTo('auth-screen');
            }
        }
    }, 2500);

    setupAuthEvents();
    setupProfileEvents();
    setupDashboardEvents();
    setupCartEvents();
    setupCheckoutEvents();
    setupOrderHistoryEvents();
    setupOwnerDashboardEvents();
    setupProfileDropdown();
    setupEditProfileForm();
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 6. GOOGLE OAUTH LOGIN
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function setupAuthEvents() {
    const googleLoginBtn = document.getElementById('google-login-btn');

    googleLoginBtn.addEventListener('click', async () => {
        // Unlock audio on user gesture
        getAudioCtx();
        googleLoginBtn.disabled = true;
        googleLoginBtn.innerHTML = 'Connecting to Google...';

        if (supabaseClient) {
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin + window.location.pathname }
            });
            if (error) {
                showToast(error.message, 'error');
                googleLoginBtn.disabled = false;
                googleLoginBtn.innerHTML = '<span>Continue with Gmail</span>';
            }
        } else {
            // Simulator mode
            setTimeout(() => {
                appState.currentUser = {
                    id: 'google-mock-uuid-123',
                    email: 'sagar@gmail.com',
                    name: 'Sagar Devkota',
                    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60'
                };
                appState.currentUserProfile = {
                    name: 'Sagar Devkota',
                    phone: '+9779801234567',
                    delivery_address: 'Jawalakhel, Lalitpur, Nepal'
                };
                showToast('Gmail Sign-in Successful!', 'success');
                document.getElementById('profile-name').value = appState.currentUser.name;
                document.getElementById('profile-email').value = appState.currentUser.email;
                document.getElementById('avatar-preview').src = appState.currentUser.photo;
                setTimeout(() => navigateTo('profile-screen'), 850);
            }, 1200);
        }
    });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 7. CHECK PROFILE & NAVIGATE (Auth Gate)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
async function checkProfileAndNavigate() {
    if (!supabaseClient) return;

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session || !session.user) return;

    appState.currentUser = session.user;

    // Detect owner by email before anything else
    if (session.user.email === OWNER_EMAIL) {
        appState.isOwner = true;
        navigateTo('owner-dashboard');
        initOwnerDashboard();
        return;
    }

    // Regular customer â€” fetch profile
    const { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (error || !profile || !profile.phone || !profile.delivery_address) {
        // Incomplete profile â€” go to onboarding
        const meta = session.user.user_metadata;
        document.getElementById('profile-name').value = meta.full_name || meta.name || '';
        document.getElementById('profile-email').value = session.user.email || '';
        if (meta.avatar_url) document.getElementById('avatar-preview').src = meta.avatar_url;
        navigateTo('profile-screen');
    } else {
        appState.currentUserProfile = profile;
        appState.currentUser.name = profile.name;
        appState.currentAddress = profile.delivery_address;
        const topAvatar = document.getElementById('profile-avatar-trigger');
        if (topAvatar && profile.profile_photo_url) topAvatar.src = profile.profile_photo_url;
        navigateTo('dashboard-screen');
        renderDalanMenu();
    }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 8. PROFILE COMPLETION SCREEN
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function fetchUserLocation(onSuccess) {
    const latInput = document.getElementById('latitude');
    const lngInput = document.getElementById('longitude');
    const addressInput = document.getElementById('delivery-address');
    const gpsBtn = document.getElementById('gps-simulate-btn');
    const banner = document.getElementById('location-permission-banner');

    if (!navigator.geolocation) { showToast('Geolocation not supported.', 'error'); return; }
    if (gpsBtn) gpsBtn.innerText = 'Locatingâ€¦';

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lng = pos.coords.longitude.toFixed(6);
            latInput.value = lat;
            lngInput.value = lng;
            appState.userLatitude = parseFloat(lat);
            appState.userLongitude = parseFloat(lng);
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                .then(r => r.json())
                .then(d => { if (!addressInput.value) addressInput.value = d.display_name || `Lat:${lat}, Lng:${lng}`; appState.currentAddress = addressInput.value; })
                .catch(() => { if (!addressInput.value) addressInput.value = `Lat:${lat}, Lng:${lng}`; });
            if (gpsBtn) gpsBtn.innerText = 'âœ… GPS Located';
            if (banner) banner.classList.add('banner-granted');
            showToast('Real-time location obtained!', 'success');
            if (onSuccess) onSuccess(lat, lng);
        },
        (err) => {
            if (gpsBtn) gpsBtn.innerText = 'ðŸ“ Fetch GPS Coords';
            if (banner) banner.classList.remove('banner-granted');
            const msgs = { 1: 'Location permission denied. Allow it in browser settings.', 2: 'Location unavailable.', 3: 'Location request timed out.' };
            showToast(msgs[err.code] || 'Location error.', 'error');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function setupProfileEvents() {
    const profileForm = document.getElementById('profile-form');
    const photoFileInput = document.getElementById('profile-photo-file');
    const photoUploader = document.querySelector('.photo-uploader');
    const avatarImg = document.getElementById('avatar-preview');
    const gpsBtn = document.getElementById('gps-simulate-btn');
    const addressInput = document.getElementById('delivery-address');
    const latInput = document.getElementById('latitude');
    const lngInput = document.getElementById('longitude');
    const profileCloseBtn = document.getElementById('profile-close-btn');
    const locationAllowBtn = document.getElementById('location-allow-btn');
    const locationBanner = document.getElementById('location-permission-banner');
    const profileScreen = document.getElementById('profile-screen');

    profileCloseBtn.addEventListener('click', () => { showToast('Returning to menu'); navigateTo('dashboard-screen'); });
    photoUploader.addEventListener('click', () => photoFileInput.click());
    photoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) { const r = new FileReader(); r.onload = ev => { avatarImg.src = ev.target.result; }; r.readAsDataURL(file); }
    });
    if (locationAllowBtn) {
        locationAllowBtn.addEventListener('click', () => {
            locationAllowBtn.disabled = true; locationAllowBtn.innerText = 'Locatingâ€¦';
            fetchUserLocation(() => { locationAllowBtn.innerText = 'Granted âœ…'; });
        });
    }
    gpsBtn.addEventListener('click', () => fetchUserLocation());

    // Auto-request GPS when profile screen becomes active
    const obs = new MutationObserver(() => {
        if (profileScreen.classList.contains('active') && !latInput.value) {
            setTimeout(() => fetchUserLocation(), 600);
        }
    });
    obs.observe(profileScreen, { attributes: true });

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('profile-name').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        const phone = document.getElementById('profile-phone').value.trim();
        const address = addressInput.value.trim();
        const lat = parseFloat(latInput.value);
        const lng = parseFloat(lngInput.value);

        if (!/^[9][78]\d{8}$/.test(phone)) { showToast('Enter a valid 10-digit Nepal mobile number.', 'error'); return; }
        if (!name || !email || !address) { showToast('Please fill in all mandatory fields.', 'error'); return; }

        const submitBtn = profileForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true; submitBtn.innerText = 'Saving profile...';

        let profilePhotoUrl = avatarImg.src;

        if (supabaseClient) {
            const file = photoFileInput.files[0];
            if (file) {
                const ext = file.name.split('.').pop();
                const filePath = `${appState.currentUser.id}/avatar.${ext}`;
                const { error: uploadErr } = await supabaseClient.storage.from('profile-photos').upload(filePath, file, { upsert: true });
                if (!uploadErr) {
                    const { data: pub } = supabaseClient.storage.from('profile-photos').getPublicUrl(filePath);
                    profilePhotoUrl = pub.publicUrl;
                }
            }
            const { error: upsertErr } = await supabaseClient.from('profiles').upsert({
                id: appState.currentUser.id, name, email,
                phone: '+977' + phone, delivery_address: address,
                latitude: lat || appState.userLatitude || null,
                longitude: lng || appState.userLongitude || null,
                profile_photo_url: profilePhotoUrl, updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

            if (upsertErr) { showToast('Save failed: ' + upsertErr.message, 'error'); submitBtn.disabled = false; submitBtn.innerText = 'Complete Registration'; return; }

            appState.currentUserProfile = { name, email, phone: '+977' + phone, delivery_address: address, profile_photo_url: profilePhotoUrl };
        } else {
            appState.currentUser.name = name;
            appState.currentAddress = address;
            appState.currentUserProfile = { name, email, phone: '+977' + phone, delivery_address: address };
        }

        showToast('Profile configured successfully!', 'success');
        appState.currentAddress = address;
        const topAvatar = document.getElementById('profile-avatar-trigger');
        if (topAvatar) topAvatar.src = profilePhotoUrl;

        setTimeout(() => { renderDalanMenu(); navigateTo('dashboard-screen'); }, 1000);
    });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 9. DASHBOARD & MENU FEED
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function setupDashboardEvents() {
    const searchInput = document.getElementById('dashboard-search');
    const categoryItems = document.querySelectorAll('.category-item');
    const topAvatar = document.getElementById('profile-avatar-trigger');
    const quickOrderBtn = document.getElementById('quick-order-btn');

    searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.toLowerCase().trim();
        renderDalanMenu();
    });

    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            appState.selectedCategory = item.dataset.category;
            categoryItems.forEach(c => {
                c.querySelector('.category-circle').style.borderColor = 'var(--border-color)';
                c.querySelector('.category-name').style.color = 'var(--text-dark)';
            });
            item.querySelector('.category-circle').style.borderColor = 'var(--primary)';
            item.querySelector('.category-name').style.color = 'var(--primary)';
            renderDalanMenu();
        });
    });

    if (quickOrderBtn) {
        quickOrderBtn.addEventListener('click', () => {
            if (appState.cart.length > 0) {
                openCartDrawer();
            } else {
                quickOrderBtn.classList.add('btn-pulse');
                setTimeout(() => quickOrderBtn.classList.remove('btn-pulse'), 600);
                const feedSection = document.querySelector('#dashboard-screen .feed-section');
                if (feedSection) feedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                showToast('ðŸ½ï¸ Add items to your cart first!');
            }
        });
    }

    // Profile avatar â†’ opens dropdown
    topAvatar.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!appState.isOwner) {
            toggleProfileDropdown();
        }
    });

    renderDalanMenu();
}

function updateUIAddress() { /* Kept for legacy compatibility */ }

async function renderDalanMenu() {
    const listContainer = document.getElementById('dalan-menu-list');
    listContainer.innerHTML = '';

    // Prefer live Supabase data; fallback to mock
    let menu = mockDalanMenu;
    if (supabaseClient) {
        const { data, error } = await supabaseClient.from('dalan_menu').select('*').eq('is_available', true).order('category');
        if (!error && data && data.length > 0) menu = data;
    }

    let filtered = menu;
    if (appState.selectedCategory !== 'All') filtered = filtered.filter(i => i.category === appState.selectedCategory);
    if (appState.searchQuery) filtered = filtered.filter(i => i.name.toLowerCase().includes(appState.searchQuery) || (i.description || '').toLowerCase().includes(appState.searchQuery));

    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-muted);"><p style="font-size:2.5rem;margin-bottom:1rem;">ðŸ³</p><p style="font-weight:600;">No items found.</p><p style="font-size:0.8rem;margin-top:0.25rem;">Try other filters or keywords.</p></div>`;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item-card';
        card.dataset.itemId = item.id;
        const cartEntry = appState.cart.find(c => c.item.id === item.id);
        const qty = cartEntry ? cartEntry.quantity : 0;
        const encoded = encodeURIComponent(JSON.stringify(item));
        const addBtnHtml = qty > 0
            ? `<div class="item-qty-stepper" id="stepper-${item.id}"><button class="qty-btn-mini" onclick="addToCart('${encoded}',-1)">-</button><span class="qty-val-mini">${qty}</span><button class="qty-btn-mini" onclick="addToCart('${encoded}',1)">+</button></div>`
            : `<button class="btn-item-add" id="add-btn-${item.id}" onclick="addToCart('${encoded}')">Add +</button>`;

        card.innerHTML = `
            <div class="item-image-wrapper">
                <img src="${item.image_url}" class="item-image" alt="${item.name}">
                <div class="item-meta-badges">
                    <span class="badge-item ${item.is_veg ? 'badge-veg-green' : 'badge-veg-red'}">${item.is_veg ? 'ðŸŸ¢ Veg' : 'ðŸ”´ Non-Veg'}</span>
                </div>
            </div>
            <div class="item-info">
                <div class="item-title-row">
                    <h3 class="item-name">${item.name}</h3>
                    <div class="item-rating-badge"><span>${item.rating}</span><span style="font-size:.6rem;">â˜…</span></div>
                </div>
                <p class="item-desc">${item.description}</p>
                <div class="item-footer-row">
                    <div class="item-price-wrapper">
                        <span class="item-price">Rs. ${item.price}</span>
                        <span class="item-time">ðŸ•’ ${item.delivery_time_mins} mins</span>
                    </div>
                    ${addBtnHtml}
                </div>
            </div>`;
        listContainer.appendChild(card);
    });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 10. SHOPPING CART ENGINE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function openCartDrawer() {
    renderCartDrawer();
    document.getElementById('cart-drawer-overlay').classList.add('active');
    document.getElementById('cart-drawer').classList.add('active');
}

function closeCartDrawer() {
    document.getElementById('cart-drawer-overlay').classList.remove('active');
    document.getElementById('cart-drawer').classList.remove('active');
}

function setupCartEvents() {
    const floatingBar = document.getElementById('floating-cart-bar');
    const overlay = document.getElementById('cart-drawer-overlay');
    const closeBtn = document.getElementById('drawer-close');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartBrowseBtn = document.getElementById('cart-browse-btn');

    floatingBar.addEventListener('click', () => openCartDrawer());
    closeBtn.addEventListener('click', () => closeCartDrawer());
    overlay.addEventListener('click', () => closeCartDrawer());

    if (cartBrowseBtn) {
        cartBrowseBtn.addEventListener('click', () => {
            closeCartDrawer();
            const feedSection = document.querySelector('#dashboard-screen .feed-section');
            if (feedSection) feedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Checkout button â†’ open checkout screen
    checkoutBtn.addEventListener('click', () => {
        if (appState.cart.length === 0) { showToast('Your cart is empty!', 'error'); return; }
        closeCartDrawer();
        openCheckoutScreen();
    });
}

window.addToCart = (itemJsonString, delta = 1) => {
    const item = JSON.parse(decodeURIComponent(itemJsonString));
    const idx = appState.cart.findIndex(c => c.item.id === item.id);
    if (idx > -1) {
        appState.cart[idx].quantity += delta;
        if (appState.cart[idx].quantity <= 0) appState.cart.splice(idx, 1);
    } else {
        if (delta > 0) appState.cart.push({ item, quantity: 1 });
    }
    if (delta > 0) showToast(`${item.name.split(' ').slice(0, 3).join(' ')}... added! ðŸ›’`);
    updateFloatingCartBar();
    refreshMenuCardButton(item);
};

window.modifyQty = (index, delta) => {
    if (!appState.cart[index]) return;
    appState.cart[index].quantity += delta;
    if (appState.cart[index].quantity <= 0) appState.cart.splice(index, 1);
    updateFloatingCartBar();
    renderCartDrawer();
    renderDalanMenu();
};

function refreshMenuCardButton(item) {
    const card = document.querySelector(`.menu-item-card[data-item-id="${item.id}"]`);
    if (!card) return;
    const footerRow = card.querySelector('.item-footer-row');
    if (!footerRow) return;
    const entry = appState.cart.find(c => c.item.id === item.id);
    const qty = entry ? entry.quantity : 0;
    const encoded = encodeURIComponent(JSON.stringify(item));
    const old = footerRow.querySelector('.btn-item-add, .item-qty-stepper');
    if (old) old.remove();
    if (qty > 0) {
        const stepper = document.createElement('div');
        stepper.className = 'item-qty-stepper';
        stepper.id = `stepper-${item.id}`;
        stepper.innerHTML = `<button class="qty-btn-mini" onclick="addToCart('${encoded}',-1)">-</button><span class="qty-val-mini">${qty}</span><button class="qty-btn-mini" onclick="addToCart('${encoded}',1)">+</button>`;
        footerRow.appendChild(stepper);
    } else {
        const btn = document.createElement('button');
        btn.className = 'btn-item-add'; btn.id = `add-btn-${item.id}`;
        btn.setAttribute('onclick', `addToCart('${encoded}')`);
        btn.innerText = 'Add +';
        footerRow.appendChild(btn);
    }
}

function updateFloatingCartBar() {
    const floatingBar = document.getElementById('floating-cart-bar');
    const barQty = document.getElementById('cart-bar-qty');
    const barTotal = document.getElementById('cart-bar-total');
    const badge = document.getElementById('header-cart-badge');

    if (appState.cart.length === 0) {
        floatingBar.classList.remove('active');
        if (badge) { badge.style.display = 'none'; badge.innerText = '0'; }
        return;
    }
    const totalQty = appState.cart.reduce((s, c) => s + c.quantity, 0);
    const subtotal = appState.cart.reduce((s, c) => s + c.item.price * c.quantity, 0);
    const deliveryFee = subtotal > 500 ? 0 : 50;
    const grandTotal = subtotal + deliveryFee + 15;

    if (barQty) barQty.innerText = totalQty;
    if (barTotal) barTotal.innerText = `Rs. ${grandTotal.toFixed(2)}`;
    if (badge) { badge.style.display = 'flex'; badge.innerText = totalQty; }
    floatingBar.classList.add('active');
}

function renderCartDrawer() {
    const listContainer = document.getElementById('cart-items-list');
    const emptyState = document.getElementById('cart-empty-state');
    const checkoutBlock = document.getElementById('cart-checkout-block');
    const drawerItemCount = document.getElementById('drawer-item-count');

    listContainer.innerHTML = '';
    if (appState.cart.length === 0) {
        emptyState.style.display = 'flex';
        checkoutBlock.style.display = 'none';
        listContainer.style.display = 'none';
        if (drawerItemCount) drawerItemCount.innerText = '0 items';
        return;
    }
    emptyState.style.display = 'none';
    checkoutBlock.style.display = 'block';
    listContainer.style.display = 'flex';

    const totalQty = appState.cart.reduce((s, c) => s + c.quantity, 0);
    if (drawerItemCount) drawerItemCount.innerText = `${totalQty} item${totalQty > 1 ? 's' : ''}`;

    let subtotal = 0;
    appState.cart.forEach((cartItem, index) => {
        const cost = cartItem.item.price * cartItem.quantity;
        subtotal += cost;
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <img src="${cartItem.item.image_url}" class="cart-item-img" alt="${cartItem.item.name}">
            <div class="cart-item-details">
                <div class="cart-item-name">${cartItem.item.name}</div>
                <div class="cart-item-unit-price">Rs. ${cartItem.item.price} each</div>
                <div class="cart-item-controls-row">
                    <div class="cart-item-qty-controls">
                        <button class="qty-btn" onclick="modifyQty(${index},-1)">-</button>
                        <span class="qty-val">${cartItem.quantity}</span>
                        <button class="qty-btn" onclick="modifyQty(${index},1)">+</button>
                    </div>
                    <div class="cart-item-price">Rs. ${cost.toFixed(2)}</div>
                </div>
            </div>`;
        listContainer.appendChild(row);
    });

    const deliveryFee = subtotal > 500 ? 0 : 50;
    const total = subtotal + deliveryFee + 15;
    const freeNote = document.getElementById('free-delivery-note');
    if (freeNote) freeNote.style.display = deliveryFee === 0 ? 'block' : 'none';

    document.getElementById('summary-delivery').innerText = deliveryFee === 0 ? 'FREE ðŸŽ‰' : `Rs. ${deliveryFee}.00`;
    document.getElementById('summary-subtotal').innerText = `Rs. ${subtotal.toFixed(2)}`;
    document.getElementById('summary-total').innerText = `Rs. ${total.toFixed(2)}`;
    const totalLabel = document.getElementById('checkout-total-label');
    if (totalLabel) totalLabel.innerText = `Rs. ${total.toFixed(2)}`;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 11. MODULE 1: CHECKOUT SCREEN
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function calcCartTotals() {
    const subtotal = appState.cart.reduce((s, c) => s + c.item.price * c.quantity, 0);
    const deliveryFee = subtotal > 500 ? 0 : 50;
    const grand = subtotal + deliveryFee + 15;
    return { subtotal, deliveryFee, grand };
}

function openCheckoutScreen() {
    // Populate items list
    const itemsList = document.getElementById('checkout-items-list');
    itemsList.innerHTML = '';
    appState.cart.forEach(cartItem => {
        const cost = cartItem.item.price * cartItem.quantity;
        const row = document.createElement('div');
        row.className = 'checkout-item-row';
        row.innerHTML = `
            <img src="${cartItem.item.image_url}" class="checkout-item-img" alt="${cartItem.item.name}">
            <div class="checkout-item-info">
                <div class="checkout-item-name">${cartItem.item.name}</div>
                <div class="checkout-item-qty">Ã— ${cartItem.quantity}</div>
            </div>
            <div class="checkout-item-price">Rs. ${cost.toFixed(2)}</div>`;
        itemsList.appendChild(row);
    });

    // Populate delivery info from cached profile
    const profile = appState.currentUserProfile;
    document.getElementById('checkout-address-display').innerText = profile ? (profile.delivery_address || 'â€”') : 'â€”';
    document.getElementById('checkout-phone-display').innerText = profile ? (profile.phone || 'â€”') : 'â€”';

    // Price breakdown
    const { subtotal, deliveryFee, grand } = calcCartTotals();
    document.getElementById('co-subtotal').innerText = `Rs. ${subtotal.toFixed(2)}`;
    document.getElementById('co-delivery').innerText = deliveryFee === 0 ? 'FREE ðŸŽ‰' : `Rs. ${deliveryFee.toFixed(2)}`;
    document.getElementById('co-grand-total').innerText = `Rs. ${grand.toFixed(2)}`;
    document.getElementById('place-order-amount').innerText = `Rs. ${grand.toFixed(2)}`;

    // Reset payment selection to COD
    selectPaymentMethod('cod');

    navigateTo('checkout-screen');
}

function selectPaymentMethod(method) {
    appState.selectedPaymentMethod = method;
    document.querySelectorAll('.payment-option-card').forEach(card => {
        card.classList.toggle('active', card.dataset.method === method);
    });
}

function setupCheckoutEvents() {
    // Back button
    document.getElementById('checkout-back-btn').addEventListener('click', () => {
        navigateTo('dashboard-screen');
    });

    // Payment method card click
    document.querySelectorAll('.payment-option-card').forEach(card => {
        card.addEventListener('click', () => selectPaymentMethod(card.dataset.method));
    });

    // Place Order
    document.getElementById('place-order-btn').addEventListener('click', async () => {
        if (appState.cart.length === 0) { showToast('Cart is empty!', 'error'); return; }
        if (appState.selectedPaymentMethod === 'esewa') {
            await handleEsewaFlow();
        } else {
            await placeOrder();
        }
    });
}

async function handleEsewaFlow() {
    const overlay = document.getElementById('esewa-overlay');
    overlay.style.display = 'flex';
    // Simulate eSewa payment gateway redirect (2.5 seconds) then confirm
    await new Promise(resolve => setTimeout(resolve, 2500));
    overlay.style.display = 'none';
    await placeOrder();
}

async function placeOrder() {
    const placeBtn = document.getElementById('place-order-btn');
    placeBtn.disabled = true;
    document.getElementById('place-order-label').innerText = 'Placing Orderâ€¦';

    const { subtotal, deliveryFee, grand } = calcCartTotals();
    const profile = appState.currentUserProfile;
    const notes = document.getElementById('checkout-notes').value.trim();

    let orderId = 'DLN-' + Math.floor(1000 + Math.random() * 9000);

    if (supabaseClient) {
        // Insert order row
        const { data: orderData, error: orderErr } = await supabaseClient.from('orders').insert({
            user_id: appState.currentUser.id,
            status: 'pending',
            total_amount: grand,
            delivery_address: profile ? profile.delivery_address : '',
            latitude: appState.userLatitude,
            longitude: appState.userLongitude,
            payment_method: appState.selectedPaymentMethod,
            customer_name: profile ? profile.name : (appState.currentUser.name || ''),
            phone: profile ? profile.phone : '',
            notes: notes || null
        }).select().single();

        if (orderErr) {
            showToast('Order failed: ' + orderErr.message, 'error');
            placeBtn.disabled = false;
            document.getElementById('place-order-label').innerText = 'Place Order';
            return;
        }

        orderId = 'DLN-' + orderData.id.slice(-4).toUpperCase();

        // Insert order items
        const orderItems = appState.cart.map(cartItem => ({
            order_id: orderData.id,
            menu_item_id: cartItem.item.id,
            quantity: cartItem.quantity,
            price: cartItem.item.price,
            item_name: cartItem.item.name
        }));
        await supabaseClient.from('order_items').insert(orderItems);
    }

    // Clear cart
    appState.cart = [];
    updateFloatingCartBar();
    renderDalanMenu();

    // Show success overlay
    showOrderSuccessOverlay(orderId);
}

function showOrderSuccessOverlay(orderId) {
    const checkoutScreen = document.getElementById('checkout-screen');
    const successDiv = document.createElement('div');
    successDiv.className = 'order-success-overlay';
    successDiv.innerHTML = `
        <div class="order-success-icon">ðŸŽ‰</div>
        <div class="order-success-title">Order Placed!</div>
        <div class="order-success-sub">Your food is being prepared at Dalan's kitchen. We'll deliver it soon!</div>
        <div class="order-success-id">${orderId}</div>
    `;
    checkoutScreen.appendChild(successDiv);
    playSuccessSound();

    setTimeout(() => {
        successDiv.remove();
        const placeBtn = document.getElementById('place-order-btn');
        placeBtn.disabled = false;
        document.getElementById('place-order-label').innerText = 'Place Order';
        document.getElementById('checkout-notes').value = '';
        openOrderHistoryScreen();
    }, 3000);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 12. MODULE 2: ORDER HISTORY & LIVE STATUS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function setupOrderHistoryEvents() {
    document.getElementById('order-history-back-btn').addEventListener('click', () => {
        navigateTo('dashboard-screen');
    });

    // Tab switching
    document.querySelectorAll('.oh-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.oh-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            document.getElementById('oh-active-pane').style.display = tabName === 'active' ? 'flex' : 'none';
            document.getElementById('oh-past-pane').style.display = tabName === 'past' ? 'flex' : 'none';
        });
    });
}

async function openOrderHistoryScreen() {
    navigateTo('order-history-screen');
    await loadOrderHistory();
    setupOrderHistoryRealtime();
}

async function loadOrderHistory() {
    const activeList = document.getElementById('oh-active-list');
    const pastList = document.getElementById('oh-past-list');
    const activeEmpty = document.getElementById('oh-active-empty');
    const pastEmpty = document.getElementById('oh-past-empty');
    const activeBadge = document.getElementById('oh-active-badge');

    activeList.innerHTML = '<div style="padding:1rem; text-align:center; color:var(--text-muted); font-size:0.82rem;">Loadingâ€¦</div>';
    pastList.innerHTML = '';

    if (!supabaseClient) {
        // Mock demo orders
        const mockOrders = [
            { id: 'mock-1', created_at: new Date(Date.now() - 5 * 60000).toISOString(), status: 'pending', total_amount: 385, payment_method: 'cod', order_items: [{ item_name: 'Special Steamed Buff Momo', quantity: 2, price: 150 }, { item_name: 'Special Masala Chai', quantity: 1, price: 55 }] },
            { id: 'mock-2', created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), status: 'delivered', total_amount: 545, payment_method: 'phonepe', order_items: [{ item_name: 'Chicken Thakali Thali Set', quantity: 1, price: 380 }, { item_name: 'Special Masala Chai', quantity: 2, price: 55 }] }
        ];
        renderOrderHistory(mockOrders);
        return;
    }

    const { data, error } = await supabaseClient
        .from('orders')
        .select('*, order_items(menu_item_id, quantity, price, item_name)')
        .eq('user_id', appState.currentUser.id)
        .order('created_at', { ascending: false });

    if (error) { activeList.innerHTML = '<div style="padding:1rem; color:var(--primary); font-size:0.82rem; text-align:center;">Failed to load orders.</div>'; return; }
    renderOrderHistory(data || []);
}

function renderOrderHistory(orders) {
    const activeList = document.getElementById('oh-active-list');
    const pastList = document.getElementById('oh-past-list');
    const activeEmpty = document.getElementById('oh-active-empty');
    const pastEmpty = document.getElementById('oh-past-empty');
    const activeBadge = document.getElementById('oh-active-badge');

    activeList.innerHTML = '';
    pastList.innerHTML = '';

    const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
    const pastOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

    // Active badge
    if (activeOrders.length > 0) {
        activeBadge.style.display = 'flex';
        activeBadge.innerText = activeOrders.length;
    } else {
        activeBadge.style.display = 'none';
    }

    // Active orders
    if (activeOrders.length === 0) {
        activeEmpty.style.display = 'flex';
    } else {
        activeEmpty.style.display = 'none';
        activeOrders.forEach(order => activeList.appendChild(buildOrderCard(order, true)));
    }

    // Past orders
    if (pastOrders.length === 0) {
        pastEmpty.style.display = 'flex';
    } else {
        pastEmpty.style.display = 'none';
        pastOrders.forEach(order => pastList.appendChild(buildOrderCard(order, false)));
    }
}

function buildOrderCard(order, showTracker) {
    const card = document.createElement('div');
    card.className = 'oh-order-card';
    card.id = `oh-card-${order.id}`;

    const dateStr = new Date(order.created_at).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const items = order.order_items || [];

    const statusLabels = {
        'pending': { label: 'Order Received', cls: 'pending' },
        'preparing': { label: 'Preparing', cls: 'pending' },
        'out_for_delivery': { label: 'Out for Delivery', cls: 'out_for_delivery' },
        'delivered': { label: 'Delivered âœ“', cls: 'completed' },
        'cancelled': { label: 'Cancelled', cls: 'pending' }
    };
    const statusInfo = statusLabels[order.status] || { label: order.status, cls: 'pending' };

    const itemsHtml = items.map(it => `
        <div class="oh-order-item-row">
            <span>${it.item_name || 'Item'} Ã— ${it.quantity}</span>
            <span>Rs. ${(it.price * it.quantity).toFixed(2)}</span>
        </div>`).join('');

    const trackerHtml = showTracker ? buildTrackerHtml(order.status, order.id) : '';

    card.innerHTML = `
        <div class="oh-order-card-header">
            <span class="oh-order-id">Order #${order.id.slice(-6).toUpperCase()}</span>
            <span class="oh-order-date">${dateStr}</span>
        </div>
        <div class="oh-order-items-list">${itemsHtml}</div>
        <div class="oh-order-total-row">
            <span>Total Paid</span>
            <span>Rs. ${parseFloat(order.total_amount).toFixed(2)}</span>
        </div>
        <span class="oh-status-badge ${statusInfo.cls}">${statusInfo.label}</span>
        ${trackerHtml}`;
    return card;
}

function buildTrackerHtml(status, orderId) {
    const step = statusToStep(status);
    const s0 = step >= 0 ? (step === 0 ? 'active' : 'done') : '';
    const s1 = step >= 1 ? (step === 1 ? 'active' : 'done') : '';
    const s2 = step >= 2 ? (step === 2 ? 'active' : 'done') : '';
    const c0 = step >= 1 ? 'filled' : '';
    const c1 = step >= 2 ? 'filled' : '';

    return `
        <div class="oh-tracker">
            <div class="oh-tracker-title">Live Order Status</div>
            <div class="oh-tracker-bar" id="tracker-bar-${orderId}">
                <div class="oh-tracker-step ${s0}">
                    <div class="oh-tracker-step-circle">ðŸ“¥</div>
                    <div class="oh-tracker-step-label">Order<br>Received</div>
                </div>
                <div class="oh-tracker-connector ${c0}"><div class="oh-tracker-connector-fill"></div></div>
                <div class="oh-tracker-step ${s1}">
                    <div class="oh-tracker-step-circle">ðŸ›µ</div>
                    <div class="oh-tracker-step-label">Out for<br>Delivery</div>
                </div>
                <div class="oh-tracker-connector ${c1}"><div class="oh-tracker-connector-fill"></div></div>
                <div class="oh-tracker-step ${s2}">
                    <div class="oh-tracker-step-circle">âœ…</div>
                    <div class="oh-tracker-step-label">Order<br>Delivered</div>
                </div>
            </div>
        </div>`;
}

function statusToStep(status) {
    const map = { pending: 0, preparing: 0, out_for_delivery: 1, delivered: 2 };
    return map[status] ?? 0;
}

function updateOrderStatusUI(updatedOrder) {
    const card = document.getElementById(`oh-card-${updatedOrder.id}`);
    if (!card) return;
    const step = statusToStep(updatedOrder.status);
    const bar = card.querySelector('.oh-tracker-bar');
    if (!bar) return;

    const steps = bar.querySelectorAll('.oh-tracker-step');
    const connectors = bar.querySelectorAll('.oh-tracker-connector');

    steps.forEach((s, i) => {
        s.classList.remove('active', 'done');
        if (i < step) s.classList.add('done');
        else if (i === step) s.classList.add('active');
    });
    connectors.forEach((c, i) => {
        c.classList.toggle('filled', i < step);
    });

    // Update status badge text
    const badge = card.querySelector('.oh-status-badge');
    const statusLabels = { pending: 'Order Received', preparing: 'Preparing', out_for_delivery: 'Out for Delivery', delivered: 'Delivered âœ“' };
    if (badge) badge.innerText = statusLabels[updatedOrder.status] || updatedOrder.status;

    // If delivered, show a toast
    if (updatedOrder.status === 'delivered') {
        showToast('ðŸŽ‰ Your order has been delivered!', 'success');
        // Reload history to move card to past tab
        setTimeout(() => loadOrderHistory(), 1500);
    }
}

function setupOrderHistoryRealtime() {
    if (!supabaseClient || !appState.currentUser) return;
    if (appState.activeOrderRealtimeSub) {
        supabaseClient.removeChannel(appState.activeOrderRealtimeSub);
    }

    const uid = appState.currentUser.id;
    appState.activeOrderRealtimeSub = supabaseClient
        .channel(`customer-orders-${uid}`)
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${uid}`
        }, payload => {
            updateOrderStatusUI(payload.new);
        })
        .subscribe();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 13. MODULE 3: OWNER DASHBOARD
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function setupOwnerDashboardEvents() {
    // Tab switching
    document.querySelectorAll('.owner-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.owner-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            document.getElementById('owner-orders-pane').style.display = tabName === 'orders' ? 'flex' : 'none';
            document.getElementById('owner-menu-pane').style.display = tabName === 'menu' ? 'flex' : 'none';
        });
    });

    // Logout
    document.getElementById('owner-logout-btn').addEventListener('click', async () => {
        if (supabaseClient) await supabaseClient.auth.signOut();
        appState.currentUser = null;
        appState.currentUserProfile = null;
        appState.isOwner = false;
        if (appState.ownerOrderRealtimeSub) supabaseClient.removeChannel(appState.ownerOrderRealtimeSub);
        navigateTo('auth-screen');
        showToast('Logged out successfully.');
    });

    // Menu form toggle (collapsible)
    document.getElementById('menu-form-toggle-btn').addEventListener('click', () => {
        const form = document.getElementById('menu-crud-form');
        const chevron = document.getElementById('menu-form-chevron');
        const isHidden = form.style.display === 'none';
        form.style.display = isHidden ? 'block' : 'none';
        chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        if (isHidden) resetMenuForm();
    });

    // Cancel button
    document.getElementById('menu-form-cancel-btn').addEventListener('click', () => {
        document.getElementById('menu-crud-form').style.display = 'none';
        document.getElementById('menu-form-chevron').style.transform = 'rotate(0deg)';
        resetMenuForm();
    });

    // Veg toggle label update
    document.getElementById('menu-item-isveg').addEventListener('change', function () {
        document.getElementById('veg-toggle-label').innerText = this.checked ? 'ðŸŸ¢ Veg' : 'ðŸ”´ Non-Veg';
    });

    // Photo uploader click
    document.getElementById('menu-photo-drop-area').addEventListener('click', () => {
        document.getElementById('menu-item-photo').click();
    });

    document.getElementById('menu-item-photo').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const preview = document.getElementById('menu-photo-preview');
            const placeholder = document.getElementById('menu-photo-placeholder');
            preview.src = ev.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    // Menu CRUD form submit
    document.getElementById('menu-crud-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleMenuFormSubmit();
    });
}

async function initOwnerDashboard() {
    await loadOwnerOrders();
    setupOwnerOrdersRealtime();
    await loadOwnerMenu();
}

// â”€â”€ Owner Orders â”€â”€
async function loadOwnerOrders(filter) {
    const activeFilter = filter ?? appState.ownerCurrentFilter;
    const listEl = document.getElementById('owner-orders-list');
    const emptyEl = document.getElementById('owner-orders-empty');
    listEl.innerHTML = '<div style="padding:1rem; text-align:center; color:var(--text-muted); font-size:0.82rem;">Loading ordersâ€¦</div>';

    let orders = [];

    if (supabaseClient) {
        let query = supabaseClient
            .from('orders')
            .select('*, profiles(name, phone), order_items(menu_item_id, quantity, price, item_name)')
            .order('created_at', { ascending: false });

        if (activeFilter !== 'all') query = query.eq('status', activeFilter);

        const { data, error } = await query;
        if (error) { listEl.innerHTML = '<div style="padding:1rem;color:var(--primary);font-size:0.82rem;text-align:center;">Failed to load orders.</div>'; return; }
        orders = data || [];
    } else {
        // Demo mock orders for owner
        orders = [
            { id: 'demo-order-1', created_at: new Date(Date.now() - 3 * 60000).toISOString(), status: 'pending', total_amount: 535, payment_method: 'cod', customer_name: 'Sagar Devkota', phone: '+9779801234567', delivery_address: 'Jawalakhel, Lalitpur, Nepal', notes: 'Extra chutney please', order_items: [{ item_name: 'Special Steamed Buff Momo', quantity: 2, price: 150 }, { item_name: 'Iced Caramel Latte', quantity: 1, price: 160 }] },
            { id: 'demo-order-2', created_at: new Date(Date.now() - 18 * 60000).toISOString(), status: 'out_for_delivery', total_amount: 380, payment_method: 'phonepe', customer_name: 'Priya Sharma', phone: '+9779841234567', delivery_address: 'Thamel, Kathmandu', notes: '', order_items: [{ item_name: 'Chicken Thakali Thali Set', quantity: 1, price: 380 }] }
        ];
    }

    appState.ownerAllOrders = orders;
    renderOwnerOrders(orders);
}

function renderOwnerOrders(orders) {
    const listEl = document.getElementById('owner-orders-list');
    const emptyEl = document.getElementById('owner-orders-empty');
    const liveCountEl = document.getElementById('owner-live-count');
    listEl.innerHTML = '';

    const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

    // Update live count badge
    if (activeOrders.length > 0) {
        liveCountEl.style.display = 'flex';
        liveCountEl.innerText = activeOrders.length;
    } else {
        liveCountEl.style.display = 'none';
    }

    if (orders.length === 0) {
        emptyEl.style.display = 'flex';
        return;
    }
    emptyEl.style.display = 'none';

    orders.forEach(order => {
        listEl.appendChild(buildOwnerOrderCard(order));
    });
}

function buildOwnerOrderCard(order, isNew = false) {
    const card = document.createElement('div');
    card.className = `owner-order-card${isNew ? ' new-order-flash' : ''}`;
    card.id = `owner-card-${order.id}`;

    const dateStr = new Date(order.created_at).toLocaleString('en-NP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const items = order.order_items || [];
    const profile = order.profiles;
    const name = order.customer_name || (profile && profile.name) || 'Customer';
    const phone = order.phone || (profile && profile.phone) || 'N/A';

    const itemsHtml = items.map(it => `
        <div class="owner-order-item-row">
            <span>${it.item_name || 'Item'}</span>
            <span>Ã— ${it.quantity} â€” Rs. ${(it.price * it.quantity).toFixed(2)}</span>
        </div>`).join('');

    const statusStates = {
        pending: { received: 'is-active', delivery: '', completed: '' },
        preparing: { received: 'is-active', delivery: '', completed: '' },
        out_for_delivery: { received: 'is-done', delivery: 'is-delivery', completed: '' },
        delivered: { received: 'is-done', delivery: 'is-done', completed: 'is-done' }
    };
    const btnState = statusStates[order.status] || statusStates['pending'];

    const payBadge = order.payment_method === 'esewa'
        ? '<span class="owner-payment-badge esewa">ðŸŸ¢ eSewa</span>'
        : '<span class="owner-payment-badge cod">ðŸ’µ COD</span>';

    const notesHtml = order.notes
        ? `<div style="margin-top:0.5rem; padding:0.5rem 0.75rem; background:var(--bg-app); border-radius:var(--radius-sm); font-size:0.78rem; color:var(--text-muted);">ðŸ“ ${order.notes}</div>`
        : '';

    card.innerHTML = `
        <div class="owner-order-card-header">
            <span class="owner-order-id">Order #${order.id.slice(-6).toUpperCase()}</span>
            <span class="owner-order-time">${dateStr}</span>
        </div>
        <div class="owner-order-card-body">
            <div class="owner-customer-info">
                <div class="owner-info-row">
                    <span class="owner-info-label">Customer</span>
                    <span class="owner-info-value">${name}</span>
                </div>
                <div class="owner-info-row">
                    <span class="owner-info-label">Phone</span>
                    <span class="owner-info-value">${phone}</span>
                </div>
                <div class="owner-info-row owner-order-address">
                    <span class="owner-info-label">Deliver to</span>
                    <span class="owner-info-value">${order.delivery_address || 'N/A'}</span>
                </div>
            </div>
            <div class="owner-order-items-title">Items Ordered</div>
            <div class="owner-order-items-list">${itemsHtml}</div>
            <div class="owner-order-total">
                <span>Grand Total</span>
                <span>Rs. ${parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
            ${payBadge}
            ${notesHtml}
            <div class="owner-status-controls">
                <button class="owner-status-btn ${btnState.received}" onclick="updateOrderStatus('${order.id}','pending', this)" data-status="pending">âœ… Received</button>
                <button class="owner-status-btn ${btnState.delivery}" onclick="updateOrderStatus('${order.id}','out_for_delivery', this)" data-status="out_for_delivery">ðŸ›µ Delivery</button>
                <button class="owner-status-btn ${btnState.completed}" onclick="updateOrderStatus('${order.id}','delivered', this)" data-status="delivered">ðŸ  Completed</button>
            </div>
        </div>`;
    return card;
}

window.updateOrderStatus = async (orderId, newStatus, clickedBtn) => {
    if (clickedBtn.classList.contains('is-active') || clickedBtn.classList.contains('is-done') || clickedBtn.classList.contains('is-delivery')) return;

    clickedBtn.disabled = true;
    clickedBtn.innerText = 'Updatingâ€¦';

    if (supabaseClient) {
        const { error } = await supabaseClient.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (error) { showToast('Update failed: ' + error.message, 'error'); clickedBtn.disabled = false; return; }
    }

    showToast(`Status updated: ${newStatus.replace('_', ' ')}`, 'success');
    // Reload orders to reflect change
    await loadOwnerOrders();
};

window.filterOwnerOrders = (filter, btn) => {
    appState.ownerCurrentFilter = filter;
    document.querySelectorAll('.owner-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const filtered = filter === 'all'
        ? appState.ownerAllOrders
        : appState.ownerAllOrders.filter(o => o.status === filter);
    renderOwnerOrders(filtered);
};

function setupOwnerOrdersRealtime() {
    if (!supabaseClient) return;
    if (appState.ownerOrderRealtimeSub) supabaseClient.removeChannel(appState.ownerOrderRealtimeSub);

    appState.ownerOrderRealtimeSub = supabaseClient
        .channel('owner-live-orders')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, async (payload) => {
            playNotificationSound();
            appState.ownerNewOrderCount++;
            const badge = document.getElementById('owner-new-order-badge');
            if (badge) { badge.style.display = 'flex'; badge.innerText = `${appState.ownerNewOrderCount} New`; }
            // Reload full order list
            await loadOwnerOrders();
            // Flash the newest card
            const newCard = document.getElementById(`owner-card-${payload.new.id}`);
            if (newCard) { newCard.classList.add('new-order-flash'); }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, async () => {
            await loadOwnerOrders();
        })
        .subscribe();
}

// â”€â”€ Owner Menu CRUD â”€â”€
async function loadOwnerMenu() {
    const menuList = document.getElementById('owner-menu-list');
    const countBadge = document.getElementById('owner-menu-count');
    menuList.innerHTML = '<div style="padding:1rem;text-align:center;color:var(--text-muted);font-size:0.82rem;">Loading menuâ€¦</div>';

    let items = mockDalanMenu;
    if (supabaseClient) {
        const { data, error } = await supabaseClient.from('dalan_menu').select('*').order('category');
        if (!error && data) items = data;
    }

    menuList.innerHTML = '';
    if (countBadge) countBadge.innerText = `${items.length} items`;

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'owner-menu-item-card';
        card.innerHTML = `
            <img src="${item.image_url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120'}" class="owner-menu-item-img" alt="${item.name}">
            <div class="owner-menu-item-info">
                <div class="owner-menu-item-name">${item.name}</div>
                <div class="owner-menu-item-meta">${item.category} Â· ${item.is_veg ? 'ðŸŸ¢ Veg' : 'ðŸ”´ Non-Veg'}</div>
                <div class="owner-menu-item-price">Rs. ${parseFloat(item.price).toFixed(2)}</div>
            </div>
            <div class="owner-menu-item-actions">
                <button class="owner-menu-edit-btn" onclick="openEditMenuItem('${item.id}')">âœï¸ Edit</button>
                <button class="owner-menu-delete-btn" onclick="deleteMenuItem('${item.id}')">ðŸ—‘ï¸ Del</button>
            </div>`;
        menuList.appendChild(card);
    });
}

function resetMenuForm() {
    document.getElementById('menu-edit-id').value = '';
    document.getElementById('menu-item-name').value = '';
    document.getElementById('menu-item-category').value = '';
    document.getElementById('menu-item-price').value = '';
    document.getElementById('menu-item-delivery-time').value = '20';
    document.getElementById('menu-item-desc').value = '';
    document.getElementById('menu-item-isveg').checked = true;
    document.getElementById('veg-toggle-label').innerText = 'ðŸŸ¢ Veg';
    document.getElementById('menu-item-photo').value = '';
    document.getElementById('menu-photo-preview').src = '';
    document.getElementById('menu-photo-preview').style.display = 'none';
    document.getElementById('menu-photo-placeholder').style.display = 'flex';
    document.getElementById('menu-submit-label').innerText = 'Add to Menu';
}

window.openEditMenuItem = async (itemId) => {
    let item = null;
    if (supabaseClient) {
        const { data } = await supabaseClient.from('dalan_menu').select('*').eq('id', itemId).single();
        item = data;
    } else {
        item = mockDalanMenu.find(m => m.id === itemId);
    }
    if (!item) { showToast('Item not found.', 'error'); return; }

    // Open form
    const form = document.getElementById('menu-crud-form');
    const chevron = document.getElementById('menu-form-chevron');
    form.style.display = 'block';
    chevron.style.transform = 'rotate(180deg)';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.getElementById('menu-edit-id').value = item.id;
    document.getElementById('menu-item-name').value = item.name;
    document.getElementById('menu-item-category').value = item.category;
    document.getElementById('menu-item-price').value = item.price;
    document.getElementById('menu-item-delivery-time').value = item.delivery_time_mins || 20;
    document.getElementById('menu-item-desc').value = item.description || '';
    document.getElementById('menu-item-isveg').checked = item.is_veg;
    document.getElementById('veg-toggle-label').innerText = item.is_veg ? 'ðŸŸ¢ Veg' : 'ðŸ”´ Non-Veg';
    document.getElementById('menu-submit-label').innerText = 'Update Item';

    if (item.image_url) {
        const preview = document.getElementById('menu-photo-preview');
        const placeholder = document.getElementById('menu-photo-placeholder');
        preview.src = item.image_url;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    }
};

window.deleteMenuItem = async (itemId) => {
    if (!confirm('Delete this item from the menu?')) return;
    if (supabaseClient) {
        const { error } = await supabaseClient.from('dalan_menu').delete().eq('id', itemId);
        if (error) { showToast('Delete failed: ' + error.message, 'error'); return; }
    }
    showToast('Item removed from menu.', 'success');
    await loadOwnerMenu();
    await renderDalanMenu();
};

async function handleMenuFormSubmit() {
    const submitBtn = document.getElementById('menu-form-submit-btn');
    const editId = document.getElementById('menu-edit-id').value;
    const name = document.getElementById('menu-item-name').value.trim();
    const category = document.getElementById('menu-item-category').value;
    const price = parseFloat(document.getElementById('menu-item-price').value);
    const deliveryTime = parseInt(document.getElementById('menu-item-delivery-time').value) || 20;
    const description = document.getElementById('menu-item-desc').value.trim();
    const isVeg = document.getElementById('menu-item-isveg').checked;
    const photoFile = document.getElementById('menu-item-photo').files[0];

    if (!name || !category || isNaN(price)) { showToast('Please fill in Name, Category, and Price.', 'error'); return; }

    submitBtn.disabled = true;
    submitBtn.querySelector('#menu-submit-label').innerText = editId ? 'Updatingâ€¦' : 'Addingâ€¦';

    let imageUrl = document.getElementById('menu-photo-preview').src || null;

    if (supabaseClient && photoFile) {
        const ext = photoFile.name.split('.').pop();
        const filePath = `menu/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabaseClient.storage.from('menu-photos').upload(filePath, photoFile, { upsert: true });
        if (!uploadErr) {
            const { data: pub } = supabaseClient.storage.from('menu-photos').getPublicUrl(filePath);
            imageUrl = pub.publicUrl;
        }
    }

    const payload = { name, category, price, description, is_veg: isVeg, delivery_time_mins: deliveryTime, image_url: imageUrl, is_available: true };

    if (supabaseClient) {
        if (editId) {
            const { error } = await supabaseClient.from('dalan_menu').update(payload).eq('id', editId);
            if (error) { showToast('Update failed: ' + error.message, 'error'); submitBtn.disabled = false; return; }
        } else {
            const { error } = await supabaseClient.from('dalan_menu').insert(payload);
            if (error) { showToast('Failed to add item: ' + error.message, 'error'); submitBtn.disabled = false; return; }
        }
    }

    showToast(editId ? 'Menu item updated!' : 'New item added to menu!', 'success');
    resetMenuForm();
    document.getElementById('menu-crud-form').style.display = 'none';
    document.getElementById('menu-form-chevron').style.transform = 'rotate(0deg)';
    submitBtn.disabled = false;
    await loadOwnerMenu();
    await renderDalanMenu();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 14. AUDIO NOTIFICATIONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function playNotificationSound() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
        // Two-tone notification beep
        [0, 0.15].forEach((delay, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = i === 0 ? 880 : 1100;
            gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.35);
        });
    } catch (e) { }
}

function playSuccessSound() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
        [0, 0.12, 0.24].forEach((delay, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = [523, 659, 784][i];
            gain.gain.setValueAtTime(0.25, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.4);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.45);
        });
    } catch (e) { }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 15. SYSTEM NOTIFICATION UTILITIES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position:absolute; bottom:85px; left:50%; transform:translateX(-50%) translateY(10px);
        background:${type === 'success' ? '#2E221E' : '#B43E26'};
        color:#FFFFFF; padding:0.6rem 1.2rem; border-radius:20px;
        font-size:0.85rem; font-weight:600; box-shadow:0 4px 12px rgba(0,0,0,0.15);
        transition:all 0.3s ease; z-index:9999; opacity:0; white-space:nowrap;
        max-width:90%; text-overflow:ellipsis; overflow:hidden;
    `;
    toast.innerText = message;
    const activeScreen = document.querySelector('.screen.active') || document.body;
    activeScreen.appendChild(toast);
    setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(0)'; toast.style.opacity = '1'; }, 50);
    setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(-10px)'; toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2800);
}

function showSystemAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position:absolute; top:15px; left:15px; right:15px;
        background:#FFFFFF; border-left:4px solid #B43E26;
        border-radius:8px; padding:1rem; box-shadow:0 10px 30px rgba(0,0,0,0.15);
        z-index:9999; animation:slideDown 0.3s cubic-bezier(0.1,0.9,0.2,1) forwards;
    `;
    alertDiv.innerHTML = `
        <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#B43E26;margin-bottom:0.25rem;">System Dispatcher</div>
        <div style="font-size:0.85rem;font-weight:600;color:#2E221E;white-space:pre-wrap;">${message}</div>`;
    if (!document.getElementById('sys-alert-animation')) {
        const style = document.createElement('style');
        style.id = 'sys-alert-animation';
        style.innerHTML = `@keyframes slideDown { from{transform:translateY(-50px);opacity:0} to{transform:translateY(0);opacity:1} }`;
        document.head.appendChild(style);
    }
    const container = document.querySelector('.app-container');
    container.appendChild(alertDiv);
    setTimeout(() => { alertDiv.style.transition = 'opacity 0.5s'; alertDiv.style.opacity = '0'; setTimeout(() => alertDiv.remove(), 500); }, 6000);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 16. PROFILE DROPDOWN SYSTEM
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function setupProfileDropdown() {
    // Close dropdown when clicking anywhere outside it
    document.addEventListener('click', (e) => {
        const wrapper = document.getElementById('profile-dropdown-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            closeProfileDropdown();
        }
    });

    // Dropdown menu item actions
    document.getElementById('dropdown-edit-profile').addEventListener('click', () => {
        closeProfileDropdown();
        openEditProfileModal();
    });

    document.getElementById('dropdown-my-orders').addEventListener('click', () => {
        closeProfileDropdown();
        openOrderHistoryScreen();
    });

    document.getElementById('dropdown-terms').addEventListener('click', () => {
        closeProfileDropdown();
        openTermsModal();
    });

    document.getElementById('dropdown-sign-out').addEventListener('click', async () => {
        closeProfileDropdown();
        if (supabaseClient) {
            await supabaseClient.auth.signOut();
        }
        // Reset state
        appState.currentUser        = null;
        appState.currentUserProfile = null;
        appState.isOwner            = false;
        appState.cart               = [];
        if (appState.activeOrderRealtimeSub && supabaseClient) {
            supabaseClient.removeChannel(appState.activeOrderRealtimeSub);
            appState.activeOrderRealtimeSub = null;
        }
        updateFloatingCartBar();
        showToast('You have been signed out.', 'success');
        setTimeout(() => navigateTo('auth-screen'), 600);
    });
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (!dropdown) return;
    const isOpen = dropdown.classList.contains('open');
    if (isOpen) {
        closeProfileDropdown();
    } else {
        openProfileDropdown();
    }
}

function openProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (!dropdown) return;

    // Populate user info from state
    const profile = appState.currentUserProfile;
    const user    = appState.currentUser;

    const name    = (profile && profile.name) || (user && (user.name || user.user_metadata?.full_name)) || 'Dalan Customer';
    const email   = (user && user.email) || 'â€”';
    const photoSrc = (profile && profile.profile_photo_url) ||
                     (user && user.user_metadata?.avatar_url) ||
                     document.getElementById('profile-avatar-trigger').src;

    document.getElementById('dropdown-user-name').innerText  = name;
    document.getElementById('dropdown-user-email').innerText = email;
    document.getElementById('dropdown-avatar').src           = photoSrc;

    dropdown.classList.add('open');
    dropdown.setAttribute('aria-hidden', 'false');
}

function closeProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (!dropdown) return;
    dropdown.classList.remove('open');
    dropdown.setAttribute('aria-hidden', 'true');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 17. EDIT PROFILE MODAL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function openEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (!modal) return;

    // Pre-fill with current profile data
    const profile = appState.currentUserProfile;
    if (profile) {
        document.getElementById('edit-name').value    = profile.name || '';
        // Strip +977 prefix for the input field
        const rawPhone = (profile.phone || '').replace('+977', '');
        document.getElementById('edit-phone').value   = rawPhone;
        document.getElementById('edit-address').value = profile.delivery_address || '';
    }

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    // Focus first field
    setTimeout(() => document.getElementById('edit-name').focus(), 200);
}

function closeEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

function setupEditProfileForm() {
    // Close button
    document.getElementById('edit-profile-modal-close').addEventListener('click', closeEditProfileModal);
    document.getElementById('edit-profile-cancel-btn').addEventListener('click', closeEditProfileModal);

    // Click outside modal box to close
    document.getElementById('edit-profile-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeEditProfileModal();
    });

    // Form submit â†’ save to Supabase
    document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const saveBtn = document.getElementById('edit-profile-save-btn');
        const name    = document.getElementById('edit-name').value.trim();
        const rawPhone = document.getElementById('edit-phone').value.trim();
        const address = document.getElementById('edit-address').value.trim();

        // Validate phone
        if (!/^[9][78]\d{8}$/.test(rawPhone)) {
            showToast('Enter a valid 10-digit Nepal number (e.g. 98XXXXXXXX)', 'error');
            return;
        }
        if (!name || !address) {
            showToast('Name and address are required.', 'error');
            return;
        }

        const phone = '+977' + rawPhone;
        saveBtn.disabled    = true;
        saveBtn.innerText   = 'Savingâ€¦';

        if (supabaseClient && appState.currentUser) {
            const { error } = await supabaseClient
                .from('profiles')
                .update({ name, phone, delivery_address: address, updated_at: new Date().toISOString() })
                .eq('id', appState.currentUser.id);

            if (error) {
                showToast('Save failed: ' + error.message, 'error');
                saveBtn.disabled  = false;
                saveBtn.innerText = 'Save Changes';
                return;
            }
        }

        // Update local state immediately (no re-fetch needed)
        if (appState.currentUserProfile) {
            appState.currentUserProfile.name             = name;
            appState.currentUserProfile.phone            = phone;
            appState.currentUserProfile.delivery_address = address;
        }
        appState.currentAddress = address;

        showToast('Profile updated successfully! âœ…', 'success');
        saveBtn.disabled  = false;
        saveBtn.innerText = 'Save Changes';
        closeEditProfileModal();
    });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 18. TERMS & PRIVACY MODAL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function openTermsModal() {
    const modal = document.getElementById('terms-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    // Wire close button (idempotent)
    document.getElementById('terms-modal-close').onclick = closeTermsModal;
    modal.addEventListener('click', (e) => { if (e.target === modal) closeTermsModal(); });
}

function closeTermsModal() {
    const modal = document.getElementById('terms-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 19. OWNER / ADMIN VERIFICATION â€” HOW IT WORKS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
/*
 * â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 * â”‚  OWNER VERIFICATION SYSTEM â€” DALAN APP                         â”‚
 * â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”‚
 * â”‚                                                                 â”‚
 * â”‚  STEP 1: Define owner email address(es) at the top of app.js   â”‚
 * â”‚                                                                 â”‚
 * â”‚    const OWNER_EMAIL = "sharmabro275@gmail.com";                       â”‚
 * â”‚                                                                 â”‚
 * â”‚  To support MULTIPLE owners:                                    â”‚
 * â”‚    const OWNER_EMAILS = [                                       â”‚
 * â”‚        "sharmabro275@gmail.com",                                       â”‚
 * â”‚        "admin@dalan.com",                                       â”‚
 * â”‚        "yourpersonalgmail@gmail.com"                            â”‚
 * â”‚    ];                                                           â”‚
 * â”‚                                                                 â”‚
 * â”‚  STEP 2: The check happens in checkProfileAndNavigate()         â”‚
 * â”‚                                                                 â”‚
 * â”‚    // Single owner:                                             â”‚
 * â”‚    if (session.user.email === OWNER_EMAIL) { ... }              â”‚
 * â”‚                                                                 â”‚
 * â”‚    // Multiple owners:                                          â”‚
 * â”‚    if (OWNER_EMAILS.includes(session.user.email)) { ... }       â”‚
 * â”‚                                                                 â”‚
 * â”‚  STEP 3: When the check passes:                                 â”‚
 * â”‚    appState.isOwner = true;          // gates all owner logic   â”‚
 * â”‚    navigateTo('owner-dashboard');    // skips customer UI       â”‚
 * â”‚    initOwnerDashboard();             // loads live orders + menuâ”‚
 * â”‚                                                                 â”‚
 * â”‚  SECURITY NOTE: This client-side gate controls the UI only.    â”‚
 * â”‚  The real security is in Supabase RLS policies (migration SQL): â”‚
 * â”‚    auth.email() = 'sharmabro275@gmail.com'                            â”‚
 * â”‚  This ensures even if a customer bypasses the JS, they cannot   â”‚
 * â”‚  read other orders or modify the menu via the DB API.           â”‚
 * â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
 */

// Helper: update OWNER_EMAIL to an array for multi-owner support
// Replace line 11 with:  const OWNER_EMAILS = ["sharmabro275@gmail.com", "yourpersonal@gmail.com"];
// Then replace: if (session.user.email === OWNER_EMAIL)
// With:         if (OWNER_EMAILS.includes(session.user.email))
