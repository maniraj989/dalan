/**
 * Dalan Food Delivery - Single-Vendor Google Auth application (app.js)
 * Implements interactive frontend storefront & actual Supabase OAuth/profiles.
 */

// 1. SUPABASE CLIENT CONFIGURATION
const SUPABASE_URL = "https://iobpvspmmjrrvixnmjth.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_Uzeynpiw4AQQVnHSP_15Xw_awXtAciE";
let supabaseClient = null;

const urlParams = new URLSearchParams(window.location.search);
const isMockMode = urlParams.get('mock') === 'true';

if (typeof window.supabase !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY && !isMockMode) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// 2. EXCLUSIVE DALAN CULINARY MENU DATABASE (Single-Vendor mock DB)
const mockDalanMenu = [
    {
        id: 'm1-buff-momo',
        name: 'Special Steamed Buff Momo (10 pcs)',
        description: 'Dalan\'s signature dumplings stuffed with spiced minced buffalo meat, onion, and fresh herbs, served with traditional spicy tomato chutney.',
        price: 150.00,
        category: 'Momo',
        image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60',
        is_veg: false,
        rating: 4.85,
        delivery_time_mins: 15
    },
    {
        id: 'm2-chilli-momo',
        name: 'Chicken Chilli Momo (C-Momo)',
        description: 'Fried dumplings tossed in a delicious sweet, spicy, and tangy bell pepper and onion chili sauce.',
        price: 220.00,
        category: 'Momo',
        image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60',
        is_veg: false,
        rating: 4.78,
        delivery_time_mins: 20
    },
    {
        id: 'm3-kothey-momo',
        name: 'Buff Kothey Momo (10 pcs)',
        description: 'Classic half-moon pan-fried dumplings filled with rich spiced buffalo meat, served with hot sesame-tomato dipping soup.',
        price: 180.00,
        category: 'Momo',
        image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60',
        is_veg: false,
        rating: 4.72,
        delivery_time_mins: 18
    },
    {
        id: 'm4-paneer-momo',
        name: 'Paneer Veg Kothey Momo (10 pcs)',
        description: 'Pan-fried dumplings stuffed with seasoned cottage cheese, fresh cabbage, and select Nepalese herbs.',
        price: 210.00,
        category: 'Momo',
        image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60',
        is_veg: true,
        rating: 4.65,
        delivery_time_mins: 18
    },
    {
        id: 't1-chicken-thali',
        name: 'Chicken Thakali Thali Set',
        description: 'Authentic Thakali platter with long-grain rice, black lentil soup (Kalo Daal), local chicken curry, gundruk sandheko, mustard greens, and radish pickle.',
        price: 380.00,
        category: 'Traditional Platters',
        image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60',
        is_veg: false,
        rating: 4.88,
        delivery_time_mins: 25
    },
    {
        id: 't2-veg-thali',
        name: 'Vegetarian Thakali Thali Set',
        description: 'Traditional Nepalese platter featuring local organic rice, ghee, daal, seasonal vegetables, gundruk pickle, and salad.',
        price: 320.00,
        category: 'Traditional Platters',
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60',
        is_veg: true,
        rating: 4.70,
        delivery_time_mins: 22
    },
    {
        id: 't3-mutton-thali',
        name: 'Deluxe Mutton Curry Thali',
        description: 'Premium Thakali feast served with tender mountain goat meat curry, rice, greens, black lentils, ghee, and home-style condiments.',
        price: 460.00,
        category: 'Traditional Platters',
        image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60',
        is_veg: false,
        rating: 4.90,
        delivery_time_mins: 25
    },
    {
        id: 't4-dhido-platter',
        name: 'Gundruk & Dhido Platter',
        description: 'Traditional Nepalese meal featuring thick buckwheat/millet porridge (Dhido) served with fermented mustard leaf soup (Gundruk), local ghee, and pickles.',
        price: 290.00,
        category: 'Traditional Platters',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60',
        is_veg: true,
        rating: 4.60,
        delivery_time_mins: 20
    },
    {
        id: 'b1-masala-chai',
        name: 'Special Masala Chai',
        description: 'Dalan\'s organic milk tea brewed with cardamom, fresh ginger, cloves, and premium orthodox leaves from Ilam.',
        price: 55.00,
        category: 'Beverages',
        image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60',
        is_veg: true,
        rating: 4.95,
        delivery_time_mins: 8
    },
    {
        id: 'b2-black-tea',
        name: 'Organic Ilam Black Tea',
        description: 'Rich, aromatic orthodox black tea leaves from the scenic hills of Ilam.',
        price: 40.00,
        category: 'Beverages',
        image_url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60',
        is_veg: true,
        rating: 4.75,
        delivery_time_mins: 8
    },
    {
        id: 'b3-iced-latte',
        name: 'Iced Caramel Latte',
        description: 'Double shot of organic espresso served over chilled milk, sweet caramel syrup, and whipped cream.',
        price: 160.00,
        category: 'Beverages',
        image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
        is_veg: true,
        rating: 4.80,
        delivery_time_mins: 10
    },
    {
        id: 'd1-selroti',
        name: 'Selroti with Rabri (2 pcs)',
        description: 'Crispy ring-shaped Nepalese sweet rice bread served with slow-cooked condensed sweet milk (Rabri).',
        price: 140.00,
        category: 'Desserts',
        image_url: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60',
        is_veg: true,
        rating: 4.85,
        delivery_time_mins: 10
    },
    {
        id: 'd2-halwa',
        name: 'Warm Carrot Halwa',
        description: 'Grated carrot pudding slow-cooked in milk, clarified butter (ghee), sugar, and garnished with almonds and cashews.',
        price: 110.00,
        category: 'Desserts',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60',
        is_veg: true,
        rating: 4.68,
        delivery_time_mins: 12
    }
];

// 3. STATE MANAGEMENT
let appState = {
    currentUser: null,      // Stores logged in user metadata
    cart: [],               // { item: menuitem, quantity: N }
    selectedCategory: 'All',
    searchQuery: '',
    currentAddress: 'Kumari Pati Road, Lalitpur',
    userLatitude: null,
    userLongitude: null,
};

// 4. ROUTER & SCREEN SWITCHER
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// 5. APPLICATION INITIALIZATION
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check existing Supabase session before starting
    if (supabaseClient) {
        await checkProfileAndNavigate();
    }

    // 2. Auto-transition from Splash Screen after 2.5 seconds
    setTimeout(() => {
        if (appState.currentUser) {
            navigateTo('dashboard-screen');
        } else {
            navigateTo('auth-screen');
        }
    }, 2500);

    // 3. Setup Events
    setupAuthEvents();
    setupProfileEvents();
    setupDashboardEvents();
    setupCartEvents();
});

// ==========================================
// 6. PHASE 1: GOOGLE GMAIL OAUTH LOGIN
// ==========================================
function setupAuthEvents() {
    const googleLoginBtn = document.getElementById('google-login-btn');
    
    googleLoginBtn.addEventListener('click', async () => {
        googleLoginBtn.disabled = true;
        googleLoginBtn.innerHTML = 'Connecting to Google...';

        if (supabaseClient) {
            // Actual Supabase Google OAuth Provider call
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + window.location.pathname
                }
            });

            if (error) {
                showToast(error.message, 'error');
                googleLoginBtn.disabled = false;
                googleLoginBtn.innerHTML = 'Continue with Gmail';
            }
        } else {
            // Simulator Mode (Runs instantly)
            setTimeout(() => {
                appState.currentUser = {
                    id: 'google-mock-uuid-123',
                    name: 'Sagar Devkota',
                    email: 'sagar@gmail.com',
                    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60'
                };
                
                showToast('Gmail Sign-in Successful!', 'success');
                
                // Pre-populate profile completion screen
                document.getElementById('profile-name').value = appState.currentUser.name;
                document.getElementById('profile-email').value = appState.currentUser.email;
                document.getElementById('avatar-preview').src = appState.currentUser.photo;
                
                setTimeout(() => {
                    navigateTo('profile-screen');
                }, 850);
            }, 1200);
        }
    });
}

// Check Profile from database to decide redirection (actual Supabase config)
async function checkProfileAndNavigate() {
    if (!supabaseClient) return;

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user) {
        appState.currentUser = session.user;
        
        const { data: profile, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        // If no profile details yet, require onboarding
        if (error || !profile || !profile.phone || !profile.delivery_address) {
            document.getElementById('profile-name').value = session.user.user_metadata.full_name || session.user.user_metadata.name || '';
            document.getElementById('profile-email').value = session.user.email || '';
            if (session.user.user_metadata.avatar_url) {
                document.getElementById('avatar-preview').src = session.user.user_metadata.avatar_url;
            }
            navigateTo('profile-screen');
        } else {
            // Dashboard setup
            appState.currentUser.name = profile.name;
            appState.currentAddress = profile.delivery_address;
            updateUIAddress();
            
            const topAvatar = document.getElementById('profile-avatar-trigger');
            if (topAvatar && profile.profile_photo_url) {
                topAvatar.src = profile.profile_photo_url;
            }
            navigateTo('dashboard-screen');
        }
    }
}

// ==========================================
// 7. PHASE 2: PROFILE COMPLETION & CLOSE INTERACTION
// ==========================================

// Utility: Fetch real GPS location and fill form fields
function fetchUserLocation(onSuccess) {
    const latInput = document.getElementById('latitude');
    const lngInput = document.getElementById('longitude');
    const addressInput = document.getElementById('delivery-address');
    const gpsBtn = document.getElementById('gps-simulate-btn');
    const banner = document.getElementById('location-permission-banner');

    if (!navigator.geolocation) {
        showToast('Geolocation not supported by your browser.', 'error');
        return;
    }

    if (gpsBtn) { gpsBtn.innerText = 'Locating…'; }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);

            latInput.value = lat;
            lngInput.value = lng;
            appState.userLatitude = parseFloat(lat);
            appState.userLongitude = parseFloat(lng);

            // Reverse-geocode via nominatim (free, no key required)
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                .then(r => r.json())
                .then(data => {
                    const addr = data.display_name || `Lat: ${lat}, Lng: ${lng}`;
                    if (!addressInput.value) addressInput.value = addr;
                    appState.currentAddress = addressInput.value;
                })
                .catch(() => {
                    if (!addressInput.value) addressInput.value = `Lat: ${lat}, Lng: ${lng}`;
                });

            if (gpsBtn) { gpsBtn.innerText = '\u2705 GPS Located'; }
            // Hide banner since location was granted
            if (banner) { banner.classList.add('banner-granted'); }
            showToast('Real-time location obtained!', 'success');
            if (onSuccess) onSuccess(lat, lng);
        },
        (err) => {
            if (gpsBtn) { gpsBtn.innerText = '\ud83d\udccd Fetch GPS Coords'; }
            // Show banner when denied
            if (banner) { banner.classList.remove('banner-granted'); }
            let msg = 'Location access denied.';
            if (err.code === 1) msg = 'Location permission denied. Please allow it in browser settings.';
            else if (err.code === 2) msg = 'Location unavailable. Check your device GPS.';
            else if (err.code === 3) msg = 'Location request timed out.';
            showToast(msg, 'error');
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

    // 1. Close overlay button handler (dynamic modal behavior)
    profileCloseBtn.addEventListener('click', () => {
        showToast('Returning to menu');
        navigateTo('dashboard-screen');
    });

    // Trigger file chooser
    photoUploader.addEventListener('click', () => {
        photoFileInput.click();
    });

    // Preview photo
    photoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                avatarImg.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Location Allow banner button
    if (locationAllowBtn) {
        locationAllowBtn.addEventListener('click', () => {
            locationAllowBtn.disabled = true;
            locationAllowBtn.innerText = 'Locating…';
            fetchUserLocation(() => {
                locationAllowBtn.innerText = 'Granted ✅';
            });
        });
    }

    // Real GPS button click
    gpsBtn.addEventListener('click', () => {
        fetchUserLocation();
    });

    // Auto-request location when profile screen is navigated to
    const profileScreen = document.getElementById('profile-screen');
    const profileObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (profileScreen.classList.contains('active')) {
                    // Check if location already set
                    if (!latInput.value) {
                        // Small delay so the screen animation completes first
                        setTimeout(() => {
                            fetchUserLocation();
                        }, 600);
                    }
                }
            }
        });
    });
    profileObserver.observe(profileScreen, { attributes: true });

    // Form submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('profile-name').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        const phone = document.getElementById('profile-phone').value.trim();
        const address = addressInput.value.trim();
        const lat = parseFloat(latInput.value);
        const lng = parseFloat(lngInput.value);

        // Nepal Mobile Number simple regex validator (Starts with 98 or 97, 10 digits)
        const phoneRegex = /^[9][78]\d{8}$/;
        if (!phoneRegex.test(phone)) {
            showToast('Please enter a valid 10-digit Nepal mobile number.', 'error');
            return;
        }

        if (!name || !email || !address) {
            showToast('Please fill in all mandatory fields.', 'error');
            return;
        }

        const submitBtn = profileForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerText = 'Saving profile...';

        let profilePhotoUrl = null;

        if (supabaseClient) {
            // Upload profile picture to storage bucket if custom file selected
            const file = photoFileInput.files[0];
            if (file) {
                const fileExt = file.name.split('.').pop();
                const filePath = `${appState.currentUser.id}/avatar.${fileExt}`;

                const { error: uploadError } = await supabaseClient.storage
                    .from('profile-photos')
                    .upload(filePath, file, { upsert: true });

                if (uploadError) {
                    showToast('Photo upload failed: ' + uploadError.message, 'error');
                } else {
                    const { data: publicUrlData } = supabaseClient.storage
                        .from('profile-photos')
                        .getPublicUrl(filePath);
                    profilePhotoUrl = publicUrlData.publicUrl;
                }
            } else {
                // If no custom photo, keep current avatar picture from Google
                profilePhotoUrl = avatarImg.src;
            }

            // Save user profile metadata to PostgreSQL Database via UPSERT
            // upsert handles both first-time insert and subsequent updates
            const { error: updateError } = await supabaseClient
                .from('profiles')
                .upsert({
                    id: appState.currentUser.id,
                    name: name,
                    email: email,
                    phone: '+977' + phone,
                    delivery_address: address,
                    latitude: lat || appState.userLatitude || null,
                    longitude: lng || appState.userLongitude || null,
                    profile_photo_url: profilePhotoUrl,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'id' });

            if (updateError) {
                showToast('Save failed: ' + updateError.message, 'error');
                submitBtn.disabled = false;
                submitBtn.innerText = 'Complete Registration';
                return;
            }
        } else {
            // Simulator save state
            appState.currentUser.name = name;
            appState.currentUser.email = email;
            appState.currentUser.phone = '+977' + phone;
            appState.currentAddress = address;
            appState.currentUser.photo = avatarImg.src;
        }

        showToast('Profile configured successfully!', 'success');
        appState.currentAddress = address;
        updateUIAddress();
        
        // Sync profile photos
        const topAvatar = document.getElementById('profile-avatar-trigger');
        if (topAvatar) {
            topAvatar.src = avatarImg.src;
        }

        setTimeout(() => {
            renderDalanMenu();
            navigateTo('dashboard-screen');
        }, 1000);
    });
}

// ==========================================
// 8. DALAN MENU FEED
// ==========================================
function setupDashboardEvents() {
    const searchInput = document.getElementById('dashboard-search');
    const categoryItems = document.querySelectorAll('.category-item');
    const topAvatar = document.getElementById('profile-avatar-trigger');
    const quickOrderBtn = document.getElementById('quick-order-btn');

    // 1. Search Box input listener
    searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.toLowerCase().trim();
        renderDalanMenu();
    });

    // 2. Category selection logic
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const cat = item.dataset.category;
            appState.selectedCategory = cat;

            // Highlight selected category circle border
            categoryItems.forEach(c => {
                c.querySelector('.category-circle').style.borderColor = 'var(--border-color)';
                c.querySelector('.category-name').style.color = 'var(--text-dark)';
            });
            item.querySelector('.category-circle').style.borderColor = 'var(--primary)';
            item.querySelector('.category-name').style.color = 'var(--primary)';

            renderDalanMenu();
        });
    });

    // 3. Order Now button - opens cart if has items, else nudges to browse
    if (quickOrderBtn) {
        quickOrderBtn.addEventListener('click', () => {
            if (appState.cart.length > 0) {
                openCartDrawer();
            } else {
                quickOrderBtn.classList.add('btn-pulse');
                setTimeout(() => quickOrderBtn.classList.remove('btn-pulse'), 600);
                const feedSection = document.querySelector('#dashboard-screen .feed-section');
                if (feedSection) feedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                showToast('\ud83c\udf7d\ufe0f Add items to your cart first!');
            }
        });
    }

    // 4. Return to Profile page via header icon click
    topAvatar.addEventListener('click', () => {
        navigateTo('profile-screen');
    });

    // Render initially
    renderDalanMenu();
}

function updateUIAddress() {
    // Address display removed (replaced with Order Now button)
    // Keep function for legacy calls that may reference it
}

// Render Dalan Menu Feed dynamically based on categories & search filters
function renderDalanMenu() {
    const listContainer = document.getElementById('dalan-menu-list');
    listContainer.innerHTML = '';

    // Fetch and filter
    let filteredList = mockDalanMenu;

    // Filter by category selection
    if (appState.selectedCategory !== 'All') {
        filteredList = mockDalanMenu.filter(item => item.category === appState.selectedCategory);
    }

    // Filter by search text query matching name or description
    if (appState.searchQuery) {
        filteredList = filteredList.filter(item => 
            item.name.toLowerCase().includes(appState.searchQuery) ||
            item.description.toLowerCase().includes(appState.searchQuery)
        );
    }

    if (filteredList.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <p style="font-size: 2.5rem; margin-bottom: 1rem;">🍳</p>
                <p style="font-weight: 600;">No items found in Dalan's kitchen.</p>
                <p style="font-size: 0.8rem; margin-top: 0.25rem;">Try choosing other filters or keywords.</p>
            </div>
        `;
        return;
    }

    filteredList.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item-card';
        card.dataset.itemId = item.id;

        const cartEntry = appState.cart.find(c => c.item.id === item.id);
        const qtyInCart = cartEntry ? cartEntry.quantity : 0;

        const addBtnHtml = qtyInCart > 0
            ? `<div class="item-qty-stepper" id="stepper-${item.id}">
                   <button class="qty-btn-mini" onclick="addToCart('${encodeURIComponent(JSON.stringify(item))}', -1)">-</button>
                   <span class="qty-val-mini">${qtyInCart}</span>
                   <button class="qty-btn-mini" onclick="addToCart('${encodeURIComponent(JSON.stringify(item))}', 1)">+</button>
               </div>`
            : `<button class="btn-item-add" id="add-btn-${item.id}" onclick="addToCart('${encodeURIComponent(JSON.stringify(item))}')">Add +</button>`;

        card.innerHTML = `
            <div class="item-image-wrapper">
                <img src="${item.image_url}" class="item-image" alt="${item.name}">
                <div class="item-meta-badges">
                    <span class="badge-item ${item.is_veg ? 'badge-veg-green' : 'badge-veg-red'}">${item.is_veg ? '\ud83d\udfe2 Veg' : '\ud83d\udd34 Non-Veg'}</span>
                </div>
            </div>
            <div class="item-info">
                <div class="item-title-row">
                    <h3 class="item-name">${item.name}</h3>
                    <div class="item-rating-badge">
                        <span>${item.rating}</span>
                        <span style="font-size: 0.6rem;">\u2605</span>
                    </div>
                </div>
                <p class="item-desc">${item.description}</p>
                <div class="item-footer-row">
                    <div class="item-price-wrapper">
                        <span class="item-price">Rs. ${item.price}</span>
                        <span class="item-time">\ud83d\udd52 ${item.delivery_time_mins} mins</span>
                    </div>
                    ${addBtnHtml}
                </div>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

// ==========================================
// 9. SHOPPING CART ENGINE
// ==========================================

function openCartDrawer() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    renderCartDrawer();
    overlay.classList.add('active');
    drawer.classList.add('active');
}

function closeCartDrawer() {
    document.getElementById('cart-drawer-overlay').classList.remove('active');
    document.getElementById('cart-drawer').classList.remove('active');
}

function setupCartEvents() {
    const floatingBar = document.getElementById('floating-cart-bar');
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    const closeBtn = document.getElementById('drawer-close');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartBrowseBtn = document.getElementById('cart-browse-btn');

    // Floating snackbar opens cart
    floatingBar.addEventListener('click', () => openCartDrawer());

    // Close methods
    closeBtn.addEventListener('click', () => closeCartDrawer());
    overlay.addEventListener('click', () => closeCartDrawer());

    // Empty state browse button
    if (cartBrowseBtn) {
        cartBrowseBtn.addEventListener('click', () => {
            closeCartDrawer();
            const feedSection = document.querySelector('#dashboard-screen .feed-section');
            if (feedSection) feedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Checkout click
    checkoutBtn.addEventListener('click', () => {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<span>Processing…</span>';
        showToast('Processing your order...', 'success');

        setTimeout(() => {
            showSystemAlert(`\ud83c\udf89 Order Confirmed!\nYour order from Dalan's Kitchen has been dispatched. Order ID: DLN-${Math.floor(1000 + Math.random() * 9000)}`);
            appState.cart = [];
            updateFloatingCartBar();
            renderDalanMenu(); // refresh Add buttons
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = '<span>Confirm &amp; Place Order</span><span id="checkout-total-label" class="checkout-total-label">Rs. 0.00</span>';
            closeCartDrawer();
        }, 1800);
    });
}

// Global scope: Add to cart (delta = +1 default, or -1 for decrement from card stepper)
window.addToCart = (itemJsonString, delta = 1) => {
    const item = JSON.parse(decodeURIComponent(itemJsonString));
    
    const existingIndex = appState.cart.findIndex(c => c.item.id === item.id);
    if (existingIndex > -1) {
        appState.cart[existingIndex].quantity += delta;
        if (appState.cart[existingIndex].quantity <= 0) {
            appState.cart.splice(existingIndex, 1);
        }
    } else {
        if (delta > 0) {
            appState.cart.push({ item: item, quantity: 1 });
        }
    }

    if (delta > 0) showToast(`${item.name.split(' ').slice(0,3).join(' ')}... added! \ud83d\uded2`);
    updateFloatingCartBar();
    // Refresh the menu card button state in-place
    refreshMenuCardButton(item);
};

window.modifyQty = (index, delta) => {
    if (!appState.cart[index]) return;
    appState.cart[index].quantity += delta;
    if (appState.cart[index].quantity <= 0) {
        appState.cart.splice(index, 1);
    }
    updateFloatingCartBar();
    renderCartDrawer();
    // Refresh menu card buttons too
    renderDalanMenu();
};

// Refresh just the Add button / stepper on a single menu card without full re-render
function refreshMenuCardButton(item) {
    const card = document.querySelector(`.menu-item-card[data-item-id="${item.id}"]`);
    if (!card) return;

    const footerRow = card.querySelector('.item-footer-row');
    if (!footerRow) return;

    const cartEntry = appState.cart.find(c => c.item.id === item.id);
    const qty = cartEntry ? cartEntry.quantity : 0;
    const encodedItem = encodeURIComponent(JSON.stringify(item));

    // Remove old button / stepper
    const oldBtn = footerRow.querySelector('.btn-item-add, .item-qty-stepper');
    if (oldBtn) oldBtn.remove();

    if (qty > 0) {
        const stepper = document.createElement('div');
        stepper.className = 'item-qty-stepper';
        stepper.id = `stepper-${item.id}`;
        stepper.innerHTML = `
            <button class="qty-btn-mini" onclick="addToCart('${encodedItem}', -1)">-</button>
            <span class="qty-val-mini">${qty}</span>
            <button class="qty-btn-mini" onclick="addToCart('${encodedItem}', 1)">+</button>
        `;
        footerRow.appendChild(stepper);
    } else {
        const btn = document.createElement('button');
        btn.className = 'btn-item-add';
        btn.id = `add-btn-${item.id}`;
        btn.setAttribute('onclick', `addToCart('${encodedItem}')`);
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

    const totalQty = appState.cart.reduce((sum, c) => sum + c.quantity, 0);
    const subtotal = appState.cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
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

    const totalQty = appState.cart.reduce((sum, c) => sum + c.quantity, 0);
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
                        <button class="qty-btn" onclick="modifyQty(${index}, -1)">-</button>
                        <span class="qty-val">${cartItem.quantity}</span>
                        <button class="qty-btn" onclick="modifyQty(${index}, 1)">+</button>
                    </div>
                    <div class="cart-item-price">Rs. ${cost.toFixed(2)}</div>
                </div>
            </div>
        `;
        listContainer.appendChild(row);
    });

    const deliveryFee = subtotal > 500 ? 0 : 50;
    const total = subtotal + deliveryFee + 15;

    // Free delivery note
    const freeNote = document.getElementById('free-delivery-note');
    if (freeNote) freeNote.style.display = deliveryFee === 0 ? 'block' : 'none';

    document.getElementById('summary-delivery').innerText = deliveryFee === 0 ? 'FREE \ud83c�' : `Rs. ${deliveryFee}.00`;
    document.getElementById('summary-subtotal').innerText = `Rs. ${subtotal.toFixed(2)}`;
    document.getElementById('summary-total').innerText = `Rs. ${total.toFixed(2)}`;

    const totalLabel = document.getElementById('checkout-total-label');
    if (totalLabel) totalLabel.innerText = `Rs. ${total.toFixed(2)}`;
}

// ==========================================
// 10. SYSTEM NOTIFICATION UTILITIES
// ==========================================
function showToast(message, type = 'success') {
    // Elegant temporary bubble alerts
    const toast = document.createElement('div');
    toast.style.position = 'absolute';
    toast.style.bottom = '85px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    toast.style.backgroundColor = type === 'success' ? '#2E221E' : '#B43E26';
    toast.style.color = '#FFFFFF';
    toast.style.padding = '0.6rem 1.2rem';
    toast.style.borderRadius = '20px';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.transition = 'all 0.3s ease';
    toast.style.zIndex = '1000';
    toast.style.opacity = '0';
    toast.innerText = message;

    const activeScreen = document.querySelector('.screen.active') || document.body;
    activeScreen.appendChild(toast);

    // Fade-in trigger
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
    }, 50);

    // Fade-out decay
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(-10px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function showSystemAlert(message) {
    // Pushes floating modal notification mirroring device popups
    const alertDiv = document.createElement('div');
    alertDiv.style.position = 'absolute';
    alertDiv.style.top = '15px';
    alertDiv.style.left = '15px';
    alertDiv.style.right = '15px';
    alertDiv.style.backgroundColor = '#FFFFFF';
    alertDiv.style.borderLeft = '4px solid #B43E26';
    alertDiv.style.borderRadius = '8px';
    alertDiv.style.padding = '1rem';
    alertDiv.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.animation = 'slideDown 0.3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards';
    
    alertDiv.innerHTML = `
        <div style="font-size: 0.75rem; font-weight:700; text-transform:uppercase; color:#B43E26; margin-bottom: 0.25rem;">System Dispatcher</div>
        <div style="font-size: 0.85rem; font-weight:600; color:#2E221E; white-space:pre-wrap;">${message}</div>
    `;

    // Inject custom animation styles if not exists
    if (!document.getElementById('sys-alert-animation')) {
        const style = document.createElement('style');
        style.id = 'sys-alert-animation';
        style.innerHTML = `
            @keyframes slideDown {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    const container = document.querySelector('.app-container');
    container.appendChild(alertDiv);

    // Auto delete after 6 seconds
    setTimeout(() => {
        alertDiv.style.transition = 'opacity 0.5s';
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 500);
    }, 6000);
}
