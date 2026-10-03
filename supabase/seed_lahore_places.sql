-- ============================================================================
-- OLATO PLATFORM: 80 AUTHENTIC LAHORE PLACES & DISCOUNTS SEED (NO MANUAL IDs)
-- Categories: Continental / International, Café / Coffee Shop, Desi / Pakistani
-- ============================================================================

-- 1. CATEGORIES (Auto-generated IDs, Unique by slug)
INSERT INTO public.categories (name, slug, description, status)
VALUES
  ('Continental & International', 'continental-international', 'Steakhouses, Italian, Mediterranean, French, and Pan-Asian fine dining', 'active'),
  ('Café / Coffee Shop', 'cafe', 'Specialty coffee roasters, study hubs, bakeries, and breakfast bistros', 'active'),
  ('Desi / Pakistani', 'desi-pakistani', 'Authentic Karahi, handi, BBQ, biryani, nihari, and traditional feasts', 'active')
ON CONFLICT (slug) DO NOTHING;

-- 2. TAGS (Auto-generated IDs)
INSERT INTO public.tags (name, slug, status)
VALUES
  ('Steaks & Grills', 'steaks-and-grills', 'active'),
  ('Italian & Pasta', 'italian-and-pasta', 'active'),
  ('Pan-Asian & Sushi', 'pan-asian-and-sushi', 'active'),
  ('Fine Dining', 'fine-dining', 'active'),
  ('Date Night', 'date-night', 'active'),
  ('Family Dining', 'family-dining', 'active'),
  ('Outdoor & Rooftop', 'outdoor-and-rooftop', 'active'),
  ('Quiet & Study', 'quiet-and-study', 'active'),
  ('Artisanal Coffee', 'artisanal-coffee', 'active'),
  ('Breakfast & Brunch', 'breakfast-and-brunch', 'active'),
  ('Authentic Karahi & BBQ', 'authentic-karahi-and-bbq', 'active'),
  ('Traditional Nihari', 'traditional-nihari', 'active'),
  ('Late Night Cravings', 'late-night-cravings', 'active'),
  ('Student Friendly', 'student-friendly', 'active'),
  ('BOGO Deals', 'bogo-deals', 'active')
ON CONFLICT (slug) DO NOTHING;

-- 3. DISCOUNT PROVIDERS (Banks & Card Networks)
INSERT INTO public.discount_providers (name, slug, provider_type, status)
VALUES
  ('All Cards & Cash', 'all-cards', 'platform', 'active'),
  ('HBL', 'hbl', 'bank', 'active'),
  ('Meezan Bank', 'meezan-bank', 'bank', 'active'),
  ('Bank Alfalah', 'bank-alfalah', 'bank', 'active'),
  ('Faysal Bank', 'faysal-bank', 'bank', 'active'),
  ('Standard Chartered', 'standard-chartered', 'bank', 'active'),
  ('UBL', 'ubl', 'bank', 'active')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 4. PLACES INSERTION (CONTINENTAL / INTERNATIONAL - 40 PLACES)
-- ============================================================================
INSERT INTO public.places (name, slug, description, why_this_spot_is_good, address, area, city, location, phone, opening_hours, status)
VALUES
  (
    'Café Aylanto',
    'cafe-aylanto-gulberg',
    'Premier Mediterranean fine dining featuring grilled fish, aged steaks, and brick-oven thin crust pizzas.',
    'Exquisite courtyard ambiance under fairy-lit trees with signature grilled red snapper and Moroccan chicken.',
    '12 C-1 MM Alam Road, Gulberg III',
    'MM Alam Road, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3524, 31.5128), 4326)::geography,
    '+92 42 35751886',
    '12:30 PM - 12:00 AM',
    'active'
  ),
  (
    'Paola’s Cosa Nostra',
    'paolas-cosa-nostra',
    'Authentic Italian culinary institution serving handmade pasta, antipasti, and classic gelato.',
    'Rustic Italian trattoria setting famous for handcrafted ravioli, burrata salads, and wood-fired focaccia.',
    '23-A Dr Mateen Fatima Road, Gulberg II',
    'Dr Mateen Fatima Road, Gulberg',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3541, 31.5192), 4326)::geography,
    '+92 42 35757041',
    '01:00 PM - 11:30 PM',
    'active'
  ),
  (
    'The Mad Italian',
    'the-mad-italian-gulberg',
    'Vibrant Italian kitchen known for artisanal Neapolitan pizza and decadent pasta plates.',
    'Casual energetic bistro with blistered sourdough Neapolitan crusts and creamy truffle pastas.',
    'Hali Road, Gulberg III',
    'Hali Road, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3488, 31.5271), 4326)::geography,
    '+92 300 0700888',
    '01:00 PM - 12:00 AM',
    'active'
  ),
  (
    'The Mad Italian DHA',
    'the-mad-italian-dha',
    'DHA outpost of The Mad Italian offering artisanal pizzas and Italian street delicacies.',
    'Modern cozy dining room serving hot stone-baked pizzas and fresh garlic knots in the heart of DHA Phase 3.',
    'Z Block, Commercial Area, DHA Phase 3',
    'Z Block, DHA Phase 3',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3942, 31.4795), 4326)::geography,
    '+92 300 0700889',
    '01:00 PM - 12:00 AM',
    'active'
  ),
  (
    'La Cornucopia Ristorante',
    'la-cornucopia-cantt',
    'Upscale Cantt dining destination offering refined European continental courses and desserts.',
    'Serene military cantonment ambiance with prime tenderloins and delicate European desserts.',
    'Khursheed Alam Road, Cantt',
    'Khursheed Alam Road, Cantt',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3821, 31.5492), 4326)::geography,
    '+92 42 36683888',
    '12:00 PM - 11:30 PM',
    'active'
  ),
  (
    'Ox & Grill Steak House Lahore',
    'ox-and-grill-gulberg',
    'Sizzling steakhouse serving prime beef tenderloins, cowboy steaks, and chicken platters.',
    'Lively steakhouse experience famous for sizzling cast-iron skillet steaks with black pepper mushroom sauce.',
    'Tariq Road, Gulberg III',
    'Tariq Road, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3498, 31.5175), 4326)::geography,
    '+92 42 35759900',
    '12:30 PM - 12:00 AM',
    'active'
  ),
  (
    'Carné Steakhouse',
    'carne-steakhouse-gulberg',
    'Gourmet butcher steakhouse specializing in dry-aged beef, wagyu cuts, and artisan sides.',
    'Dimly lit masculine steakhouse luxury with imported prime cuts, bone marrow sides, and rich sauces.',
    'Block T, Gulberg II',
    'Gulberg II',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3512, 31.5235), 4326)::geography,
    '+92 301 8444455',
    '06:00 PM - 12:30 AM',
    'active'
  ),
  (
    'Butcher’s Steakhouse',
    'butchers-steakhouse-gulberg',
    'Specialist meat house serving charcoal-grilled steaks, gourmet burgers, and smoked cuts.',
    'Rustic wood and brick venue with perfectly seared ribeyes and creamy parmesan mashed potatoes.',
    'Block P, Gulberg II',
    'Block P, Gulberg II',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3538, 31.5210), 4326)::geography,
    '+92 42 35778899',
    '01:00 PM - 12:00 AM',
    'active'
  ),
  (
    'Steak Studio - Canal Branch',
    'steak-studio-canal',
    'Canal road dining spot offering generous skillet steaks, loaded burgers, and pasta bowls.',
    'Casual family-friendly steakhouse with friendly portions and great value combos along Canal Bank Road.',
    'Canal Bank Road / Iqbal Avenue',
    'Canal Bank Road / Iqbal Avenue',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.2485, 31.4421), 4326)::geography,
    '+92 321 4455667',
    '01:00 PM - 01:00 AM',
    'active'
  ),
  (
    'El Momento',
    'el-momento-dha',
    'High-end modern steakhouse with theatrical table-side carving and live cooking displays.',
    'Glamorous interior with dry-aged tomahawk cuts, flame-torched presentations, and premium dining vibes.',
    'Sector Z, Commercial Area, DHA Phase 3',
    'DHA Phase 3',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3955, 31.4782), 4326)::geography,
    '+92 311 1100333',
    '01:00 PM - 01:00 AM',
    'active'
  ),
  (
    'The Carnivore',
    'the-carnivore-dha6',
    'Dedicated meat boutique serving slow-smoked brisket, beef ribs, and prime tenderloins.',
    'Authentic oak-wood Texas-style smoked barbecue and tender steaks for true meat purists in DHA Phase 6.',
    'Sector C, Commercial Area, DHA Phase 6',
    'DHA Phase 6',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.4382, 31.4621), 4326)::geography,
    '+92 320 9999888',
    '05:00 PM - 01:00 AM',
    'active'
  ),
  (
    'Rare Steakhouse',
    'rare-steakhouse-dha5',
    'Boutique upscale steak lounge featuring bespoke cuts of imported Angus beef and sea bass.',
    'Intimate romantic lighting, velvet booths, and melt-in-your-mouth fillets paired with herb butters.',
    'Sector CCA, DHA Phase 5',
    'DHA Phase 5',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.4095, 31.4705), 4326)::geography,
    '+92 42 37180022',
    '06:30 PM - 12:30 AM',
    'active'
  ),
  (
    'The Brasserie',
    'the-brasserie-gulberg',
    'French-inspired modern bistro serving gourmet sandwiches, steaks, and decadent brunch.',
    'Sophisticated Paris-meets-Lahore brasserie featuring duck confit, eggs benedict, and artisan coffee.',
    'Main Boulevard, Gulberg III',
    'Main Boulevard, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3475, 31.5160), 4326)::geography,
    '+92 42 35789888',
    '08:30 AM - 12:00 AM',
    'active'
  ),
  (
    'Fuschia Kitchen',
    'fuschia-kitchen-gulberg',
    'Contemporary Pan-Asian bistro celebrated for modern Thai and dim sum courses.',
    'Sleek modern red-accented dining room with crispy prawn wasabi, fiery Tom Yum, and Thai red curries.',
    'Hali Road, Gulberg III',
    'Hali Road, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3482, 31.5285), 4326)::geography,
    '+92 42 35755344',
    '12:30 PM - 11:30 PM',
    'active'
  ),
  (
    'Alchemy',
    'alchemy-gulberg',
    'Avant-garde gastronomy kitchen fusing international flavors with molecular presentation.',
    'Cutting-edge culinary artistry with surprising textures, smoke-infused dishes, and signature mocktails.',
    'Main Boulevard, Gulberg III',
    'Main Boulevard, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3468, 31.5182), 4326)::geography,
    '+92 300 1234567',
    '07:00 PM - 12:30 AM',
    'active'
  ),
  (
    'Bon Vivant Palais',
    'bon-vivant-palais',
    'Majestic multi-level international dining destination with lavish chandeliers and world buffets.',
    'Palatial architecture with royal international buffet spreads spanning continental, Chinese, and BBQ.',
    'Sir Syed Road, Gulberg III',
    'Sir Syed Road, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3510, 31.5152), 4326)::geography,
    '+92 42 35759911',
    '12:00 PM - 12:00 AM',
    'active'
  ),
  (
    'Urban Kitchen',
    'urban-kitchen-gulberg',
    'Trendsetting casual bistro serving loaded burgers, pasta bowls, and artisan milkshakes.',
    'Vibrant urban industrial vibe with mouthwatering comfort food favorites and outdoor patio seating.',
    'Block L, Gulberg III',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3520, 31.5165), 4326)::geography,
    '+92 42 35752233',
    '01:00 PM - 01:00 AM',
    'active'
  ),
  (
    'Veranda Bistro',
    'veranda-bistro-dha5',
    'Acclaimed open-air courtyard restaurant celebrated for live barbecue and continental buffets.',
    'Lush candlelit courtyard dining under night skies with live international carving stations.',
    'Sector J, Phase 5, DHA',
    'DHA Phase 5',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.4112, 31.4680), 4326)::geography,
    '+92 42 37180055',
    '12:30 PM - 12:00 AM',
    'active'
  ),
  (
    'Rina’s Kitchenette',
    'rinas-kitchenette-dha',
    'Charming homegrown bakery and bistro known for caramel cakes, buttermilk chicken, and aglio olio.',
    'Cozy pastel-hued neighborhood sanctuary famous for fresh artisan sourdough, savory pies, and caramel cake.',
    'Sector Y, DHA Phase 3',
    'Y Block, DHA Phase 3',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3912, 31.4820), 4326)::geography,
    '+92 42 35742200',
    '12:00 PM - 11:30 PM',
    'active'
  ),
  (
    'For the Table by Terra',
    'for-the-table-terra',
    'Seasonal farm-to-table culinary project highlighting artisanal sharing plates and sourdough.',
    'Minimalist warm aesthetic with communal sharing platters, handcrafted burrata, and botanical drinks.',
    'Y Block, DHA Phase 3',
    'Y Block, DHA Phase 3',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3925, 31.4815), 4326)::geography,
    '+92 300 8477788',
    '01:00 PM - 11:00 PM',
    'active'
  ),
  (
    'Garden Of Eve',
    'garden-of-eve-dha',
    'Botanical garden café and restaurant serving fusion bowls, specialty coffees, and artisan desserts.',
    'Dreamy floral greenhouse setting with light-drenched glass panels, ideal for brunch and coffee dates.',
    'Commercial Area, DHA Phase 4',
    'DHA Phase 4',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3855, 31.4721), 4326)::geography,
    '+92 301 9998877',
    '11:00 AM - 12:00 AM',
    'active'
  ),
  (
    'The Continental – Global Gastronomy',
    'the-continental-raya',
    'Luxury golf-resort dining destination overlooking the Fairways at DHA Raya.',
    'Panoramic golf course views paired with lobster ravioli, tenderloin steaks, and imported mocktails.',
    'Fairways Commercial, DHA Raya, Phase 6',
    'Raya Fairways, DHA Phase 6',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.4510, 31.4420), 4326)::geography,
    '+92 42 37340011',
    '01:00 PM - 12:00 AM',
    'active'
  ),
  (
    'Crosta',
    'crosta-cantt',
    'Artisanal pizzeria and Italian deli in Cantonment serving fermented sourdough pizzas.',
    'Crispy wood-fired sourdough crusts with fresh San Marzano tomato sauce and fresh fior di latte cheese.',
    'CSD / Aziz Bhatti Road, Cantt',
    'CSD / Aziz Bhatti Road, Cantt',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3888, 31.5515), 4326)::geography,
    '+92 302 4455888',
    '01:00 PM - 11:30 PM',
    'active'
  ),
  (
    'Café Delice',
    'cafe-delice-model-town',
    'Cozy Model Town bistro serving European brunch, crepes, and specialty hot chocolates.',
    'Quiet leafy neighborhood café with French crepes, artisan breakfast spreads, and tranquil vibes.',
    'Central Commercial Market, Model Town',
    'Model Town',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3225, 31.4880), 4326)::geography,
    '+92 42 35882211',
    '09:00 AM - 11:30 PM',
    'active'
  ),
  (
    'Arcadian Café - DHA Raya',
    'arcadian-cafe-raya',
    'Famous upscale eatery featuring signature stuffed chicken breast, fiery dragon chicken, and steaks.',
    'Stunning modern lakeside architecture with Arcadian iconic red dragon chicken and basil chicken.',
    'DHA Raya Commercial, Phase 6',
    'DHA Raya',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.4525, 31.4410), 4326)::geography,
    '+92 42 37340055',
    '12:30 PM - 12:00 AM',
    'active'
  ),
  (
    'Arcadian Café - Packages Mall',
    'arcadian-cafe-packages',
    'Mall destination for Arcadian favorites with family-sized booths and fast attentive service.',
    'Convenient upscale retreat inside Packages Mall serving signature continental mains and molten lava cake.',
    'Ground Floor, Packages Mall, Walton Road',
    'Packages Mall',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3582, 31.4735), 4326)::geography,
    '+92 42 38302211',
    '12:00 PM - 11:30 PM',
    'active'
  ),
  (
    'Café Zouk',
    'cafe-zouk-gulberg',
    'Lahore legendary nightlife-style dining cafe established over two decades ago.',
    'Iconic nostalgic mood lighting, finger-licking chicken cordon bleu, and signature spicy thai noodles.',
    '7-D MM Alam Road, Gulberg III',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3508, 31.5140), 4326)::geography,
    '+92 42 35756475',
    '01:00 PM - 01:00 AM',
    'active'
  ),
  (
    'English Tea House',
    'english-tea-house-gulberg',
    'Vintage Victorian tea house known for traditional British high tea, scones, and shepherd’s pie.',
    'Quaint Victorian brick fireplace setting with tiered afternoon tea platters, clotted cream, and jams.',
    '24 K, Sir Syed Road, Gulberg II',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3528, 31.5178), 4326)::geography,
    '+92 42 35715535',
    '08:30 AM - 12:00 AM',
    'active'
  ),
  (
    'Bistro 201',
    'bistro-201-dha6',
    'Rooftop and indoor continental dining offering skyline views and multi-cuisine mains.',
    'Spectacular rooftop sunset vistas paired with grilled steaks, wood-fired chicken, and mocktails.',
    'Main Boulevard, DHA Phase 6',
    'DHA Phase 6',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.4370, 31.4645), 4326)::geography,
    '+92 42 37180201',
    '06:00 PM - 01:00 AM',
    'active'
  ),
  (
    'The Patio',
    'the-patio-gulberg',
    'Boutique outdoor dining courtyard offering fresh seasonal seafood and continental mains.',
    'Relaxing al-fresco terrace with sea bass skewers, balsamic beef medallions, and warm apple tarts.',
    'Near Mini Market, Gulberg II',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3550, 31.5220), 4326)::geography,
    '+92 300 4455112',
    '01:00 PM - 11:30 PM',
    'active'
  ),
  (
    'Novu',
    'novu-gulberg',
    'Pan-Asian wok house known for quick, explosive bowls of Kung Pao and Singaporean noodles.',
    'Casual wok bar with sizzling noodles, crispy beef bowls, and addictive dynamite prawns.',
    'Shop 3, Block C-3, Gulberg III',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3545, 31.5150), 4326)::geography,
    '+92 42 35785500',
    '12:30 PM - 12:00 AM',
    'active'
  ),
  (
    'Caspian Sea',
    'caspian-sea-johar-town',
    'Johar Town continental and seafood specialist serving fish and chips, prawns, and steaks.',
    'Comfortable dining lounge in Johar Town known for crispy battered fish and sizzling pepper steaks.',
    'Commercial Area, Block G, Johar Town',
    'Johar Town',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.2715, 31.4670), 4326)::geography,
    '+92 42 35312244',
    '01:00 PM - 12:00 AM',
    'active'
  ),
  (
    'P.F. Chang’s',
    'pf-changs-lahore',
    'World-renowned American Asian dining giant known for Chang’s Lettuce Wraps and dynamite shrimp.',
    'High-energy modern Asian dining with iconic horse statues, wok-fired chicken, and hand-folded dumplings.',
    '17-C1 MM Alam Road, Gulberg III',
    'MM Alam Road, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3515, 31.5132), 4326)::geography,
    '+92 42 35759977',
    '12:00 PM - 12:00 AM',
    'active'
  ),
  (
    'Yum Chinese & Thai',
    'yum-chinese-and-thai-gulberg',
    'Premier traditional Chinese and Thai dining offering peking duck, dim sum, and red curry.',
    'Elegant Chinese oriental setting with private dining rooms, steamed dim sum, and sizzling beef platters.',
    '24 K, Sir Syed Road, Gulberg II',
    'Sir Syed Road, Gulberg II',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3525, 31.5180), 4326)::geography,
    '+92 42 35715533',
    '12:30 PM - 12:00 AM',
    'active'
  ),
  (
    'Sumo',
    'sumo-japanese-gulberg',
    'Authentic Japanese restaurant celebrated for teppanyaki live cooking, fresh sashimi, and sushi rolls.',
    'Intimate Japanese teppanyaki counter theatre with fresh salmon rolls, wagyu beef, and prawn tempura.',
    'Gulberg II / DHA',
    'Gulberg / DHA',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3540, 31.5200), 4326)::geography,
    '+92 42 35754422',
    '01:00 PM - 11:30 PM',
    'active'
  ),
  (
    'Wasabi',
    'wasabi-gulberg',
    'Contemporary Japanese and sushi destination serving creative maki rolls and bento sets.',
    'Modern Japanese minimalist aesthetic with crispy California rolls, spicy salmon, and teriyaki bowls.',
    'MM Alam Road, Gulberg III',
    'Gulberg / DHA',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3518, 31.5145), 4326)::geography,
    '+92 300 8435566',
    '01:00 PM - 12:00 AM',
    'active'
  ),
  (
    'Taipei Cuisine',
    'taipei-cuisine-gulberg',
    'Authentic Taiwanese and oriental cooking known for dumplings, beef hot pots, and scallion pancakes.',
    'Understated authentic haven for Taiwanese foodies craving handmade dumplings and savory broths.',
    'Block P, Gulberg II',
    'MM Alam Road, Gulberg II',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3532, 31.5215), 4326)::geography,
    '+92 42 35773322',
    '12:30 PM - 11:30 PM',
    'active'
  ),
  (
    'Opium Thai',
    'opium-thai-gulberg',
    'Sensory Thai dining journey with fresh lemongrass broths, pad thai, and spicy basil chicken.',
    'Atmospheric Thai retreat with delicate fragrant curries, coconut soups, and sweet mango sticky rice.',
    'Near Mini Market, Gulberg II',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3538, 31.5230), 4326)::geography,
    '+92 301 8443322',
    '01:00 PM - 12:00 AM',
    'active'
  ),
  (
    'Bamboo Union',
    'bamboo-union-gulberg',
    'Casual high-speed Pan-Asian kitchen with crowd-favorite crispy beef, dynamite sushi, and pad thai.',
    'Buzzing energetic Asian street kitchen with generous portions and fast, mouthwatering flavors.',
    'Main Boulevard, Gulberg III',
    'Main Boulevard, Gulberg',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3485, 31.5170), 4326)::geography,
    '+92 301 8485566',
    '12:30 PM - 12:30 AM',
    'active'
  ),
  (
    'Monal Lahore',
    'monal-lahore-liberty',
    'Rooftop restaurant perched high over Liberty Chowk offering panoramic city vistas and continental grill.',
    'Breathtaking 360-degree city views from the top of Park Avenue, famous for evening skyline dinners.',
    'Park Avenue Building, Liberty Chowk, Gulberg III',
    'Liberty Chowk, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3450, 31.5115), 4326)::geography,
    '+92 42 35789988',
    '01:00 PM - 01:00 AM',
    'active'
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 5. PLACES INSERTION (CAFÉ / COFFEE SHOP - 20 PLACES)
-- ============================================================================
INSERT INTO public.places (name, slug, description, why_this_spot_is_good, address, area, city, location, phone, opening_hours, status)
VALUES
  (
    'Contra Coffee Shop',
    'contra-coffee-gulberg',
    'Modernist specialty coffee boutique roasting single-origin Ethiopian and Colombian beans.',
    'Sleek industrial chic aesthetics, pour-over masterclasses, and ultra-quiet booths for focused work.',
    'Sir Syed Road, Gulberg II',
    'Sir Syed Road, Gulberg II',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3530, 31.5190), 4326)::geography,
    '+92 300 0022334',
    '08:00 AM - 11:30 PM',
    'active'
  ),
  (
    'Pulse Coffee Lahore',
    'pulse-coffee-gulberg',
    'Community-driven coffee collective serving cold brews, matcha lattes, and artisan toasties.',
    'Vibrant creative crowd with high-speed internet, specialty espresso drinks, and warm banana bread.',
    'Block P, Gulberg III',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3542, 31.5165), 4326)::geography,
    '+92 302 8887766',
    '08:30 AM - 12:00 AM',
    'active'
  ),
  (
    'HOUSE Coffee & Desserts',
    'house-coffee-and-desserts',
    'Aesthetic minimalist coffee lounge specializing in Basque burnt cheesecakes and Spanish cortados.',
    'Warm sun-dappled interior with the best Basque burnt cheesecake in Lahore and velvety flat whites.',
    'Block C1, Gulberg III',
    'C1, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3510, 31.5148), 4326)::geography,
    '+92 321 4455888',
    '09:00 AM - 12:00 AM',
    'active'
  ),
  (
    'Coffee Tea & Company',
    'coffee-tea-and-company',
    'Lahore pioneer café offering vintage armchairs, herbal teas, and hot chocolate.',
    'Nostalgic cozy sanctuary with plush couches, warm apple cider, and comforting chicken club sandwiches.',
    'Mian Mehmood Ali Kasoori Road, Gulberg III',
    'Mian Mehmood Ali Kasoori Road, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3560, 31.5110), 4326)::geography,
    '+92 42 35759144',
    '08:00 AM - 01:00 AM',
    'active'
  ),
  (
    'Baraza Coffee',
    'baraza-coffee-mall-1',
    'Upscale espresso bar inside Mall 1 serving handcrafted cold brews and French pastries.',
    'Chic outdoor patio inside Mall 1 with artisan coffee roasts and French butter croissants.',
    'Mall 1, Main Boulevard, Gulberg III',
    'Mall 1, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3490, 31.5170), 4326)::geography,
    '+92 300 8477112',
    '08:00 AM - 12:00 AM',
    'active'
  ),
  (
    '6.3coffee',
    '6-3-coffee-dha8',
    'Modernist cube-architecture coffee lab serving scientific pour-overs in DHA Phase 8.',
    'Architectural eye-candy with futuristic glass facades, quiet corners, and exceptional Colombian brews.',
    'Sector C, Commercial Area, DHA Phase 8',
    'DHA Phase 8',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.4680, 31.4350), 4326)::geography,
    '+92 300 6363630',
    '09:00 AM - 11:30 PM',
    'active'
  ),
  (
    'Green Door Coffee Cafe & Patisserie',
    'green-door-coffee-johar',
    'Johar Town patisserie retreat known for pastel green decor, macarons, and iced coffees.',
    'Peaceful sanctuary in Johar Town featuring French eclairs, macarons, and study-friendly seating.',
    'Block G, Phase 1, Johar Town',
    'Johar Town',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.2730, 31.4685), 4326)::geography,
    '+92 300 4488221',
    '09:00 AM - 11:30 PM',
    'active'
  ),
  (
    'Third Culture Coffee - Model Town',
    'third-culture-coffee-model-town',
    'Specialty coffee roastery in Model Town championing direct-trade beans and manual brews.',
    'Lush garden view seating with precision espresso machines and single-origin aeropress flights.',
    'Block C, Model Town',
    'Model Town',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3215, 31.4910), 4326)::geography,
    '+92 300 3334445',
    '08:00 AM - 11:00 PM',
    'active'
  ),
  (
    'Chai & Coffee',
    'chai-and-coffee-cantt',
    'Cantt neighborhood meeting point serving traditional Karak chai alongside specialty flat whites.',
    'Casual open-air verandah in Cantt combining clay-cup Karak chai with modern espresso and parathas.',
    'Tufail Road, Cantt',
    'Tufail Road, Cantt',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3790, 31.5450), 4326)::geography,
    '+92 42 36671122',
    '07:00 AM - 01:00 AM',
    'active'
  ),
  (
    'Mocca Coffee',
    'mocca-coffee-gulberg',
    'Scandinavian-style coffee sanctuary celebrated for clean aesthetics, macaroons, and paninis.',
    'Bright Nordic minimalism with healthy smoothie bowls, smoked chicken panini, and iced lattes.',
    'Mall 94, Gulberg III',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3512, 31.5130), 4326)::geography,
    '+92 42 35754488',
    '08:00 AM - 12:30 AM',
    'active'
  ),
  (
    'Gloria Jean’s Coffees',
    'gloria-jeans-gulberg',
    'Worldwide Australian coffee franchise known for signature Irish nut cream and iced chillers.',
    'Dependable co-working hub with fast internet, plenty of wall outlets, and rich caramel chillers.',
    'Kasuri Road, Gulberg III',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3555, 31.5120), 4326)::geography,
    '+92 42 35759922',
    '08:00 AM - 01:00 AM',
    'active'
  ),
  (
    'Tim Hortons',
    'tim-hortons-mall-one',
    'Canadian coffee and donut icon famous for Double-Doubles, French Vanilla, and Timbits.',
    'Bustling Canadian gathering spot with warm maple dip donuts and signature French Vanilla lattes.',
    'Mall One, Main Boulevard, Gulberg III',
    'Mall One, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3488, 31.5168), 4326)::geography,
    '+92 42 35780001',
    '07:00 AM - 02:00 AM',
    'active'
  ),
  (
    'Butler’s Chocolate Café',
    'butlers-chocolate-cafe-gulberg',
    'Irish luxury chocolatier café offering gourmet truffles, decadent sundaes, and hot chocolate.',
    'Lavish chocolate bliss where every hot coffee arrives with a complimentary artisan chocolate truffle.',
    'Fortune Mall, MM Alam Road, Gulberg III',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3520, 31.5135), 4326)::geography,
    '+92 42 35772522',
    '09:00 AM - 01:00 AM',
    'active'
  ),
  (
    'Freddy’s Café',
    'freddys-cafe-gulberg',
    'Iconic MM Alam landmark known for giant beef burgers, continental platters, and desserts.',
    'Historic Lahori culinary staple with deep mahogany booths, hot skillet brownies, and club steaks.',
    '12-C MM Alam Road, Gulberg III',
    'MM Alam Road, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3522, 31.5125), 4326)::geography,
    '+92 42 35754416',
    '12:00 PM - 12:00 AM',
    'active'
  ),
  (
    'Tandoori Tea & Co.',
    'tandoori-tea-and-co',
    'Street-luxe tea spot serving clay-baked tandoori chai, paratha rolls, and bun kebabs.',
    'Sensational smoking hot clay pot tea infused with cardamom and served alongside spicy parathas.',
    'Mian Mehmood Ali Kasoori Road, Gulberg III',
    'Mian Mehmood Ali Kasoori Road',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3570, 31.5115), 4326)::geography,
    '+92 321 8877665',
    '04:00 PM - 03:00 AM',
    'active'
  ),
  (
    'Chaye Gossip',
    'chaye-gossip-gulberg',
    'Late-night tea lounge with indoor and outdoor beanbag seating, serving savory snacks and chai.',
    'Relaxed late-night youth hangout with Doodh Patti chai, Nutella parathas, and board games.',
    'Block C-2, Gulberg III',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3535, 31.5175), 4326)::geography,
    '+92 300 4455880',
    '05:00 PM - 04:00 AM',
    'active'
  ),
  (
    'FiLLi Cafe',
    'filli-cafe-johar',
    'Dubai-originated tea chain famous for signature Zafran (Saffron) tea and burgers.',
    'Addictive aromatic saffron-infused hot tea served in Johar Town alongside gourmet wraps.',
    'Commercial Area, Phase 1, Johar Town',
    'Johar Town',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.2745, 31.4678), 4326)::geography,
    '+92 42 35310088',
    '10:00 AM - 02:00 AM',
    'active'
  ),
  (
    'Terrace Café',
    'terrace-cafe-johar',
    'Rooftop open-air terrace in Johar Town with cozy lighting, cold frappes, and pizzas.',
    'Gentle outdoor breezes with rooftop string lighting, cold mocha frappes, and student discount combos.',
    'Near Shaukat Khanum, Johar Town',
    'Johar Town',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.2705, 31.4655), 4326)::geography,
    '+92 322 8889900',
    '04:00 PM - 02:00 AM',
    'active'
  ),
  (
    'Loafology',
    'loafology-dha4',
    'European artisan bakery and café famed for pure sourdough breads and clean organic brunches.',
    'Heaven for sourdough lovers with Polish-style baked pastries, avocado poached eggs, and pour-overs.',
    'Sector FF, Commercial Area, DHA Phase 4',
    'DHA Phase 4',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3860, 31.4715), 4326)::geography,
    '+92 300 0770001',
    '08:00 AM - 11:00 PM',
    'active'
  ),
  (
    'MYSA Specialty Coffee',
    'mysa-specialty-coffee-dha',
    'Scandinavian hygge-inspired coffee lounge prioritizing mindful sips and single-origin roasts.',
    'Hygge-styled tranquil living room ambiance with artisan pour-overs and zero-noise study zones.',
    'Sector CCA, DHA Phase 5',
    'DHA',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.4085, 31.4708), 4326)::geography,
    '+92 300 0009988',
    '08:00 AM - 11:30 PM',
    'active'
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 6. PLACES INSERTION (DESI / PAKISTANI - 20 PLACES)
-- ============================================================================
INSERT INTO public.places (name, slug, description, why_this_spot_is_good, address, area, city, location, phone, opening_hours, status)
VALUES
  (
    'Haveli Restaurant',
    'haveli-restaurant-walled-city',
    'Historic multi-level rooftop heritage restaurant facing the majestic Badshahi Mosque.',
    'Unbeatable illuminated views of Badshahi Mosque at night while dining on charcoal mutton chops and seekh kebabs.',
    'Badshahi Mosque View, Fort Road Food Street, Walled City',
    'Fort Road Food Street, Walled City',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3135, 31.5898), 4326)::geography,
    '+92 300 8414899',
    '01:00 PM - 01:00 AM',
    'active'
  ),
  (
    'Butt Karahi',
    'butt-karahi-lakshmi',
    'The undisputed temple of Desi Ghee mutton karahi at the historic Lakshmi Chowk.',
    'World-famous sizzling Desi Ghee mutton karahi cooked fresh in heavy black woks with ginger and green chilies.',
    'Lakshmi Chowk, McLeod Road',
    'Lakshmi Chowk',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3218, 31.5645), 4326)::geography,
    '+92 42 37233888',
    '12:00 PM - 03:00 AM',
    'active'
  ),
  (
    'Waris Nihari',
    'waris-nihari-anarkali',
    'Legendary breakfast and late-night nihari institution simmering beef shank for over 50 years.',
    'Rich slow-simmered beef marrow nihari finished with hot spiced tarka and fresh oven-baked khameeri rotis.',
    'Paisa Akhbar, Anarkali / Circular Road',
    'Anarkali / Circular Road',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3140, 31.5650), 4326)::geography,
    '+92 42 37320099',
    '06:00 AM - 12:00 AM',
    'active'
  ),
  (
    'Salt’n Pepper Village',
    'salt-n-pepper-village-gulberg',
    'Iconic Pakistani cultural buffet village serving open-air live tandoor and karahi specialties.',
    'Immersive traditional village scenery with live puppet shows, piping hot tandoori naans, and 50+ desi dishes.',
    '103 B-2 MM Alam Road, Gulberg III',
    'MM Alam Road, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3510, 31.5120), 4326)::geography,
    '+92 42 35750735',
    '12:30 PM - 12:00 AM',
    'active'
  ),
  (
    'Dera Restaurant',
    'dera-restaurant-gaddafi',
    'Open-air traditional charpai dining offering charcoal BBQ and handi beside Gaddafi Stadium.',
    'Authentic Punjabi folk vibe with open-air charpai seating, live ghazal music, and tender reshmi kebabs.',
    'Near Gaddafi Stadium, Ferozepur Road, Gulberg III',
    'Near Gaddafi Stadium, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3380, 31.5125), 4326)::geography,
    '+92 42 35785566',
    '06:00 PM - 02:00 AM',
    'active'
  ),
  (
    'Chandni Chowk Restaurant',
    'chandni-chowk-gulberg',
    'Extensive Pakistani and Mughlai buffet restaurant offering live barbecue and seafood.',
    'Famous for massive buffet selections, fresh mutton ribs, live chaat counters, and family gatherings.',
    'Gurumangat Road, Gulberg III',
    'Gurumangat Road, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3580, 31.5200), 4326)::geography,
    '+92 42 35750000',
    '12:30 PM - 12:00 AM',
    'active'
  ),
  (
    'Golden Shinwari Restaurant',
    'golden-shinwari-gulberg',
    'Traditional Pashtun Shinwari kitchen cooking meat using only animal fat and rock salt.',
    'Pure authentic Shinwari lamb karahi and dumpukht cooked with zero artificial spices to let meat flavors shine.',
    'Main Market, Gulberg II',
    'Gulberg II',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3480, 31.5250), 4326)::geography,
    '+92 300 4488990',
    '12:00 PM - 02:00 AM',
    'active'
  ),
  (
    'Ziafat',
    'ziafat-gulberg',
    'Famous traditional lunch and dinner buffet serving classic Lahori curries and BBQ.',
    'Hearty authentic Lahori buffet with endless mutton biryani, chicken ginger, and warm gulab jamuns.',
    'College Road, Gulberg II',
    'College Road, Gulberg II',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3520, 31.5240), 4326)::geography,
    '+92 42 35753377',
    '12:30 PM - 11:30 PM',
    'active'
  ),
  (
    'Muhammadi Nahari House',
    'muhammadi-nahari-johar',
    'Celebrated Johar Town branch of Lahore famous beef and mutton nihari specialists.',
    'Golden glistening bone marrow nihari with fiery red oil, slivered ginger, and lemon wedges.',
    'Commercial Area, Block G, Johar Town',
    'Johar Town',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.2725, 31.4680), 4326)::geography,
    '+92 42 35311222',
    '07:00 AM - 01:00 AM',
    'active'
  ),
  (
    'Masalawala by Qasar-e-Noor',
    'masalawala-gulberg',
    'High-end traditional street food and desi luxury kitchen with live counter experience.',
    'Lavish heritage food festival atmosphere serving live kat-a-kat, crispy puris, and butter handis.',
    'Sir Syed Road, Gulberg III',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3518, 31.5155), 4326)::geography,
    '+92 42 35759900',
    '12:30 PM - 12:00 AM',
    'active'
  ),
  (
    'Bagh – The Desi Experience',
    'bagh-the-desi-experience-gulberg',
    'Royal outdoor botanical garden serving gourmet Pakistani delicacies and clay pot handis.',
    'Lush enchanting outdoor garden with charcoal-roasted kebabs and royal mutton dum biryani.',
    'Block B-1, Gulberg III',
    'Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3530, 31.5160), 4326)::geography,
    '+92 300 1112244',
    '06:00 PM - 01:00 AM',
    'active'
  ),
  (
    'Desi Table - Lahore',
    'desi-table-gulberg',
    'Modern Punjabi dining destination focusing on regional thalis and copper-pot gravies.',
    'Artisanal copper-ware service with rich butter chicken, garlic naans, and creamy dal makhani.',
    'Main Gulberg Road',
    'Main Gulberg Road',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3495, 31.5185), 4326)::geography,
    '+92 42 35758833',
    '01:00 PM - 12:00 AM',
    'active'
  ),
  (
    'Desi Oven Gulberg',
    'desi-oven-gulberg',
    'Clay-oven specialist known for stuffed kulchas, tandoori boti, and slow-roasted meats.',
    'Warm aroma of tandoori spice with stuffed cheese kulchas and smoky chicken boti skewers.',
    'College Road, Gulberg II',
    'College Road, Gulberg II',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3515, 31.5238), 4326)::geography,
    '+92 42 35754400',
    '12:00 PM - 12:30 AM',
    'active'
  ),
  (
    'Desi Oven - DHA Phase 1',
    'desi-oven-dha1',
    'DHA outpost of Desi Oven serving fresh clay-tandoor flatbreads and grilled chicken.',
    'Convenient DHA takeaway and dine-in for fresh bubbling naans and melt-in-mouth malai boti.',
    'Sector G, Commercial Area, DHA Phase 1',
    'DHA Phase 1',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3750, 31.4880), 4326)::geography,
    '+92 42 35748899',
    '12:00 PM - 01:00 AM',
    'active'
  ),
  (
    'Desi Pardesi Restaurant',
    'desi-pardesi-shadman',
    'Family dining venue on Jail Road offering hearty portions of karahi, BBQ, and biryani.',
    'Warm family hospitality on Jail Road with spicy mutton chops, chicken achari, and roghni naans.',
    'Jail Road, Shadman',
    'Jail Road, Shadman',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3310, 31.5380), 4326)::geography,
    '+92 42 37421100',
    '12:30 PM - 12:00 AM',
    'active'
  ),
  (
    'Pakistan Restaurant',
    'pakistan-restaurant-johar',
    'Student and family staple near UMT serving traditional dal, chicken karahi, and fresh tandoor.',
    'Unbeatable budget-friendly desi comfort food with piping hot roti and spicy chicken karahi near UMT.',
    'UMT Road, Johar Town',
    'UMT Road, Johar Town',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.2690, 31.4640), 4326)::geography,
    '+92 42 35314488',
    '10:00 AM - 01:00 AM',
    'active'
  ),
  (
    'Zaiqa Restaurant & Biryani House',
    'zaiqa-biryani-model-town',
    'Model Town classic serving fragrant Karachi-style beef biryani, haleem, and chicken tikka.',
    'Famous for aromatic spiced dum biryani with tender potatoes and fiery seekh kebabs.',
    'Link Road, Model Town',
    'Model Town',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3220, 31.4915), 4326)::geography,
    '+92 42 35843322',
    '11:00 AM - 12:00 AM',
    'active'
  ),
  (
    'Bundu Khan Restaurant - Gulberg',
    'bundu-khan-gulberg',
    'Legendary national barbecue brand famous for Bihari boti, chicken tikka, and puri paratha.',
    'The gold standard of Pakistani barbecue featuring tender beef bihari boti and golden crispy puri parathas.',
    'Liberty Market, Gulberg III',
    'Gulberg / Johar Town / DHA',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3465, 31.5122), 4326)::geography,
    '+92 42 111444666',
    '12:00 PM - 01:00 AM',
    'active'
  ),
  (
    'Bar-B-Q Tonight',
    'bar-b-q-tonight-gulberg',
    'Renowned nationwide barbecue house serving succulent afghani boti, mutton ribs, and seafood.',
    'Vast family dining rooms with charcoal-smoked Afghani boti, juicy jumbo prawns, and fresh tandoor naans.',
    'Mian Mehmood Ali Kasoori Road, Gulberg III',
    'Mian Mehmood Ali Kasoori Road, Gulberg III',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3565, 31.5118), 4326)::geography,
    '+92 42 35759900',
    '12:30 PM - 01:00 AM',
    'active'
  ),
  (
    'Buqayvia Restaurant',
    'buqayvia-restaurant-johar',
    'Canal Road dining venue offering open lawns, charcoal grilled mutton, and chicken handi.',
    'Relaxed canal-side lawns for peaceful evening dinners featuring buttery chicken handi and grilled fish.',
    'Main Canal Road, Johar Town',
    'Main Canal Road, Johar Town',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.2650, 31.4590), 4326)::geography,
    '+92 300 4455778',
    '01:00 PM - 01:00 AM',
    'active'
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 7. ASSOCIATE PLACES WITH CATEGORIES (BY SLUG - ZERO MANUAL IDs)
-- ============================================================================
-- Continental & International places
INSERT INTO public.place_categories (place_id, category_id, is_primary)
SELECT p.id, c.id, true
FROM public.places p, public.categories c
WHERE c.slug = 'continental-international'
  AND p.slug IN (
    'cafe-aylanto-gulberg', 'paolas-cosa-nostra', 'the-mad-italian-gulberg', 'the-mad-italian-dha',
    'la-cornucopia-cantt', 'ox-and-grill-gulberg', 'carne-steakhouse-gulberg', 'butchers-steakhouse-gulberg',
    'steak-studio-canal', 'el-momento-dha', 'the-carnivore-dha6', 'rare-steakhouse-dha5',
    'the-brasserie-gulberg', 'fuschia-kitchen-gulberg', 'alchemy-gulberg', 'bon-vivant-palais',
    'urban-kitchen-gulberg', 'veranda-bistro-dha5', 'rinas-kitchenette-dha', 'for-the-table-terra',
    'garden-of-eve-dha', 'the-continental-raya', 'crosta-cantt', 'cafe-delice-model-town',
    'arcadian-cafe-raya', 'arcadian-cafe-packages', 'cafe-zouk-gulberg', 'english-tea-house-gulberg',
    'bistro-201-dha6', 'the-patio-gulberg', 'novu-gulberg', 'caspian-sea-johar-town',
    'pf-changs-lahore', 'yum-chinese-and-thai-gulberg', 'sumo-japanese-gulberg', 'wasabi-gulberg',
    'taipei-cuisine-gulberg', 'opium-thai-gulberg', 'bamboo-union-gulberg', 'monal-lahore-liberty'
  )
ON CONFLICT DO NOTHING;

-- Café / Coffee Shop places
INSERT INTO public.place_categories (place_id, category_id, is_primary)
SELECT p.id, c.id, true
FROM public.places p, public.categories c
WHERE c.slug = 'cafe'
  AND p.slug IN (
    'contra-coffee-gulberg', 'pulse-coffee-gulberg', 'house-coffee-and-desserts', 'coffee-tea-and-company',
    'baraza-coffee-mall-1', '6-3-coffee-dha8', 'green-door-coffee-johar', 'third-culture-coffee-model-town',
    'chai-and-coffee-cantt', 'mocca-coffee-gulberg', 'gloria-jeans-gulberg', 'tim-hortons-mall-one',
    'butlers-chocolate-cafe-gulberg', 'freddys-cafe-gulberg', 'tandoori-tea-and-co', 'chaye-gossip-gulberg',
    'filli-cafe-johar', 'terrace-cafe-johar', 'loafology-dha4', 'mysa-specialty-coffee-dha'
  )
ON CONFLICT DO NOTHING;

-- Desi / Pakistani places
INSERT INTO public.place_categories (place_id, category_id, is_primary)
SELECT p.id, c.id, true
FROM public.places p, public.categories c
WHERE c.slug = 'desi-pakistani'
  AND p.slug IN (
    'haveli-restaurant-walled-city', 'butt-karahi-lakshmi', 'waris-nihari-anarkali', 'salt-n-pepper-village-gulberg',
    'dera-restaurant-gaddafi', 'chandni-chowk-gulberg', 'golden-shinwari-gulberg', 'ziafat-gulberg',
    'muhammadi-nahari-johar', 'masalawala-gulberg', 'bagh-the-desi-experience-gulberg', 'desi-table-gulberg',
    'desi-oven-gulberg', 'desi-oven-dha1', 'desi-pardesi-shadman', 'pakistan-restaurant-johar',
    'zaiqa-biryani-model-town', 'bundu-khan-gulberg', 'bar-b-q-tonight-gulberg', 'buqayvia-restaurant-johar'
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. ASSOCIATE PLACES WITH TAGS (BY SLUG - ZERO MANUAL IDs)
-- ============================================================================
-- Steaks & Grills tag
INSERT INTO public.place_tags (place_id, tag_id)
SELECT p.id, t.id FROM public.places p, public.tags t
WHERE t.slug = 'steaks-and-grills'
  AND p.slug IN ('ox-and-grill-gulberg', 'carne-steakhouse-gulberg', 'butchers-steakhouse-gulberg', 'steak-studio-canal', 'el-momento-dha', 'the-carnivore-dha6', 'rare-steakhouse-dha5')
ON CONFLICT DO NOTHING;

-- Italian & Pasta tag
INSERT INTO public.place_tags (place_id, tag_id)
SELECT p.id, t.id FROM public.places p, public.tags t
WHERE t.slug = 'italian-and-pasta'
  AND p.slug IN ('paolas-cosa-nostra', 'the-mad-italian-gulberg', 'the-mad-italian-dha', 'crosta-cantt')
ON CONFLICT DO NOTHING;

-- Pan-Asian & Sushi tag
INSERT INTO public.place_tags (place_id, tag_id)
SELECT p.id, t.id FROM public.places p, public.tags t
WHERE t.slug = 'pan-asian-and-sushi'
  AND p.slug IN ('fuschia-kitchen-gulberg', 'pf-changs-lahore', 'yum-chinese-and-thai-gulberg', 'sumo-japanese-gulberg', 'wasabi-gulberg', 'taipei-cuisine-gulberg', 'opium-thai-gulberg', 'bamboo-union-gulberg', 'novu-gulberg')
ON CONFLICT DO NOTHING;

-- Quiet & Study tag
INSERT INTO public.place_tags (place_id, tag_id)
SELECT p.id, t.id FROM public.places p, public.tags t
WHERE t.slug = 'quiet-and-study'
  AND p.slug IN ('contra-coffee-gulberg', 'pulse-coffee-gulberg', 'house-coffee-and-desserts', '6-3-coffee-dha8', 'third-culture-coffee-model-town', 'mocca-coffee-gulberg', 'gloria-jeans-gulberg', 'mysa-specialty-coffee-dha')
ON CONFLICT DO NOTHING;

-- Authentic Karahi & BBQ tag
INSERT INTO public.place_tags (place_id, tag_id)
SELECT p.id, t.id FROM public.places p, public.tags t
WHERE t.slug = 'authentic-karahi-and-bbq'
  AND p.slug IN ('butt-karahi-lakshmi', 'haveli-restaurant-walled-city', 'salt-n-pepper-village-gulberg', 'dera-restaurant-gaddafi', 'golden-shinwari-gulberg', 'bundu-khan-gulberg', 'bar-b-q-tonight-gulberg')
ON CONFLICT DO NOTHING;

-- Traditional Nihari tag
INSERT INTO public.place_tags (place_id, tag_id)
SELECT p.id, t.id FROM public.places p, public.tags t
WHERE t.slug = 'traditional-nihari'
  AND p.slug IN ('waris-nihari-anarkali', 'muhammadi-nahari-johar')
ON CONFLICT DO NOTHING;

-- Outdoor & Rooftop tag
INSERT INTO public.place_tags (place_id, tag_id)
SELECT p.id, t.id FROM public.places p, public.tags t
WHERE t.slug = 'outdoor-and-rooftop'
  AND p.slug IN ('haveli-restaurant-walled-city', 'monal-lahore-liberty', 'bistro-201-dha6', 'veranda-bistro-dha5', 'cafe-aylanto-gulberg', 'garden-of-eve-dha', 'terrace-cafe-johar', 'bagh-the-desi-experience-gulberg', 'buqayvia-restaurant-johar')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 9. POPULAR ACTIVE DISCOUNTS (LINKED TO PLACES VIA SLUGS - NO MANUAL IDs)
-- ============================================================================
INSERT INTO public.discounts (
  place_id, provider_id, title, discount_type, discount_value, eligibility_type, is_student_eligible,
  details, terms, redemption_instructions, start_date, end_date, is_active, last_verified_at
)
SELECT 
  p.id,
  (SELECT id FROM public.discount_providers WHERE slug = 'hbl'),
  '20% off total bill with HBL cards',
  'percentage',
  20.00,
  'bank_card',
  false,
  'Enjoy 20% discount on all main course steaks and beverages when paying with your HBL Credit or Debit card.',
  ARRAY['Valid Monday through Sunday', 'Maximum discount PKR 3,500 per bill', 'Dine-in only'],
  ARRAY['Inform waiter before requesting bill', 'Pay using valid HBL card'],
  '2026-09-01',
  '2027-12-31',
  true,
  now()
FROM public.places p
WHERE p.slug IN ('cafe-aylanto-gulberg', 'ox-and-grill-gulberg', 'el-momento-dha', 'the-carnivore-dha6', 'pf-changs-lahore', 'monal-lahore-liberty')
ON CONFLICT DO NOTHING;

INSERT INTO public.discounts (
  place_id, provider_id, title, discount_type, discount_value, eligibility_type, is_student_eligible,
  details, terms, redemption_instructions, start_date, end_date, is_active, last_verified_at
)
SELECT 
  p.id,
  (SELECT id FROM public.discount_providers WHERE slug = 'meezan-bank'),
  '15% off with Meezan Bank Islamic cards',
  'percentage',
  15.00,
  'bank_card',
  false,
  'Get 15% discount on total food bill when paying with any Meezan Bank debit or credit card.',
  ARRAY['Valid 7 days a week', 'Cannot be combined with other deals'],
  ARRAY['Present Meezan card prior to checkout'],
  '2026-08-01',
  '2027-12-31',
  true,
  now()
FROM public.places p
WHERE p.slug IN ('paolas-cosa-nostra', 'the-mad-italian-gulberg', 'haveli-restaurant-walled-city', 'salt-n-pepper-village-gulberg', 'bundu-khan-gulberg', 'bar-b-q-tonight-gulberg')
ON CONFLICT DO NOTHING;

INSERT INTO public.discounts (
  place_id, provider_id, title, discount_type, discount_value, eligibility_type, is_student_eligible,
  details, terms, redemption_instructions, start_date, end_date, is_active, last_verified_at
)
SELECT 
  p.id,
  (SELECT id FROM public.discount_providers WHERE slug = 'all-cards'),
  '15% Student Discount on all coffees & desserts',
  'percentage',
  15.00,
  'student',
  true,
  'Students get an exclusive 15% discount on all hot espresso, cold brews, and baked goods with valid student ID.',
  ARRAY['Must show original university or college student ID', 'Valid 7 days a week'],
  ARRAY['Show student ID to cashier before billing'],
  '2026-08-15',
  '2027-12-31',
  true,
  now()
FROM public.places p
WHERE p.slug IN ('contra-coffee-gulberg', 'pulse-coffee-gulberg', 'house-coffee-and-desserts', 'mocca-coffee-gulberg', 'gloria-jeans-gulberg', 'tim-hortons-mall-one', 'butlers-chocolate-cafe-gulberg', 'green-door-coffee-johar', 'terrace-cafe-johar', 'pakistan-restaurant-johar')
ON CONFLICT DO NOTHING;

INSERT INTO public.discounts (
  place_id, provider_id, title, discount_type, discount_value, eligibility_type, is_student_eligible,
  details, terms, redemption_instructions, start_date, end_date, is_active, last_verified_at
)
SELECT 
  p.id,
  (SELECT id FROM public.discount_providers WHERE slug = 'bank-alfalah'),
  '20% off with Bank Alfalah cards',
  'percentage',
  20.00,
  'bank_card',
  false,
  'Save 20% across all authentic desi karahi, BBQ platters, and specialty dishes with Bank Alfalah cards.',
  ARRAY['Valid on dine-in transactions', 'Max discount cap PKR 4,000'],
  ARRAY['Present Bank Alfalah card at the time of payment'],
  '2026-09-01',
  '2027-12-31',
  true,
  now()
FROM public.places p
WHERE p.slug IN ('butt-karahi-lakshmi', 'waris-nihari-anarkali', 'chandni-chowk-gulberg', 'golden-shinwari-gulberg', 'muhammadi-nahari-johar', 'bagh-the-desi-experience-gulberg', 'rinas-kitchenette-dha', 'arcadian-cafe-raya')
ON CONFLICT DO NOTHING;
