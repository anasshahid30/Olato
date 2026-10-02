-- ============================================================================
-- OLATO PLATFORM: INITIAL SEED DATA (Valid Hex UUIDs: 0-9, a-f)
-- ============================================================================

-- 1. CATEGORIES (Prefix: 11111111)
INSERT INTO public.categories (id, name, slug, description, status)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'Café', 'cafe', 'Specialty coffee roasters, artisanal bakeries, and study spaces', 'active'),
  ('11111111-0000-0000-0000-000000000002', 'Restaurant', 'restaurant', 'Casual dining, bistros, fine dining, and family dinner spots', 'active'),
  ('11111111-0000-0000-0000-000000000003', 'Selected Place', 'selected-place', 'Handpicked iconic landmarks, rooftop spots, and signature destinations', 'active')
ON CONFLICT (slug) DO NOTHING;

-- 2. TAGS (Prefix: 22222222)
INSERT INTO public.tags (id, name, slug, status)
VALUES
  ('22222222-0000-0000-0000-000000000001', 'Quiet', 'quiet', 'active'),
  ('22222222-0000-0000-0000-000000000002', 'Work & Study', 'work-and-study', 'active'),
  ('22222222-0000-0000-0000-000000000003', 'Wi-Fi & Outlets', 'wifi-and-outlets', 'active'),
  ('22222222-0000-0000-0000-000000000004', 'Artisanal Coffee', 'artisanal-coffee', 'active'),
  ('22222222-0000-0000-0000-000000000005', 'Outdoor Courtyard', 'outdoor-courtyard', 'active'),
  ('22222222-0000-0000-0000-000000000006', 'Date Night', 'date-night', 'active'),
  ('22222222-0000-0000-0000-000000000007', 'Family Friendly', 'family-friendly', 'active'),
  ('22222222-0000-0000-0000-000000000008', 'Fine Dining', 'fine-dining', 'active'),
  ('22222222-0000-0000-0000-000000000009', 'Breakfast & Brunch', 'breakfast-and-brunch', 'active'),
  ('22222222-0000-0000-0000-000000000010', 'BOGO Deals', 'bogo-deals', 'active')
ON CONFLICT (slug) DO NOTHING;

-- 3. DISCOUNT PROVIDERS (Prefix: 33333333)
INSERT INTO public.discount_providers (id, name, slug, provider_type, status)
VALUES
  ('33333333-0000-0000-0000-000000000001', 'All Cards & Cash', 'all-cards', 'platform', 'active'),
  ('33333333-0000-0000-0000-000000000002', 'ABC Bank Visa', 'abc-bank-visa', 'bank', 'active'),
  ('33333333-0000-0000-0000-000000000003', 'XYZ Bank Mastercard', 'xyz-bank-mastercard', 'bank', 'active'),
  ('33333333-0000-0000-0000-000000000004', 'HBL', 'hbl', 'bank', 'active'),
  ('33333333-0000-0000-0000-000000000005', 'Meezan Bank', 'meezan-bank', 'bank', 'active')
ON CONFLICT (slug) DO NOTHING;

-- 4. PLACES (Prefix: 44444444)
INSERT INTO public.places (
  id, name, slug, description, why_this_spot_is_good, address, area, city, location, phone, opening_hours, status
)
VALUES
  (
    '44444444-0000-0000-0000-000000000001',
    'Brew House',
    'brew-house',
    'Artisanal specialty coffee roaster featuring single-origin beans, hand-poured brews, and fresh French pastries in a minimalist space.',
    'Quiet, sunlit aesthetic space with single-origin pour-overs, high-speed fiber internet, and ergonomic seating that makes it the premier spot for deep work and laptop sessions.',
    'Block C-2, Gulberg III',
    'Gulberg',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3572, 31.5218), 4326)::geography,
    '+92 42 35789123',
    '08:00 AM - 11:30 PM',
    'active'
  ),
  (
    '44444444-0000-0000-0000-000000000002',
    'Saffron Kitchen',
    'saffron-kitchen',
    'Contemporary Mughlai & Pakistani fine dining serving charcoal-grilled kebabs, rich handis, and saffron infused biryanis.',
    'Authentic slow-cooked saffron biryani and charcoal-grilled Mughlai cuts served in a lavish heritage atmosphere with royal hospitality.',
    '14-C1, MM Alam Road, Gulberg II',
    'MM Alam Road',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3519, 31.5135), 4326)::geography,
    '+92 42 35754321',
    '12:00 PM - 01:00 AM',
    'active'
  ),
  (
    '44444444-0000-0000-0000-000000000003',
    'Piccolo Bakery & Café',
    'piccolo-bakery-cafe',
    'European-style bakery specializing in sourdough breads, buttery croissants, macaroons, and velvety flat whites.',
    'Aroma of warm flaky butter croissants, European sourdough loaves, and smooth flat whites in an intimate neighborhood setting.',
    'Sector CCA, Phase 5, DHA',
    'DHA Phase 5',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.4081, 31.4712), 4326)::geography,
    '+92 42 37182900',
    '07:30 AM - 11:00 PM',
    'active'
  ),
  (
    '44444444-0000-0000-0000-000000000004',
    'Café Beaumont',
    'cafe-beaumont',
    'A botanical glasshouse dining destination offering pan-Asian bistro favorites, wood-fired pizzas, and signature mocktails.',
    'Historic botanical glasshouse dining under soaring vintage archways, celebrated for afternoon high tea and wood-fired pizzas.',
    '22 Shahrah-e-Quaid-e-Azam, Mall Road',
    'Mall Road',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3175, 31.5625), 4326)::geography,
    '+92 42 36301122',
    '11:00 AM - 12:00 AM',
    'active'
  ),
  (
    '44444444-0000-0000-0000-000000000005',
    'The Roast & Grind',
    'the-roast-and-grind',
    'Cozy study coffee lounge with high-speed fiber internet, specialty pour-overs, cold brews, and avocado toasts.',
    'Cozy student haven with dedicated power outlets at every booth, robust cold brews, and budget-friendly study combo passes.',
    'Phase 1, Commercial Area, Johar Town',
    'Johar Town',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.2741, 31.4688), 4326)::geography,
    '+92 42 35319988',
    '09:00 AM - 01:00 AM',
    'active'
  ),
  (
    '44444444-0000-0000-0000-000000000006',
    'Artisan Table',
    'artisan-table',
    'Seasonal farm-to-table bistro crafted around rustic Mediterranean small plates, fresh pasta, and stone-baked flatbreads.',
    'Farm-to-table Mediterranean kitchen famous for handmade pasta, rustic stone flatbreads, and intimate candlelit dinners.',
    'Block H, Gulberg II',
    'Gulberg',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3495, 31.5245), 4326)::geography,
    '+92 42 35712233',
    '01:00 PM - 11:30 PM',
    'active'
  ),
  (
    '44444444-0000-0000-0000-000000000007',
    'Veranda Bistro',
    'veranda-bistro',
    'Iconic open-air courtyard restaurant celebrated for live international buffet counters, wood-fired grills, and artisanal gelatos.',
    'Iconic open-air courtyard known for live international barbecue grills, lush garden seating, and premier weekend buffets.',
    'Sector J, Phase 6, DHA',
    'DHA Phase 6',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.4320, 31.4615), 4326)::geography,
    '+92 42 37180055',
    '12:30 PM - 12:00 AM',
    'active'
  ),
  (
    '44444444-0000-0000-0000-000000000008',
    'Espresso Lounge',
    'espresso-lounge',
    'Contemporary Italian espresso bar featuring signature Spanish lattes, breakfast paninis, and iced teas.',
    'Fast, consistent Italian roast espresso bar with signature iced Spanish lattes and warm toasted paninis for on-the-go mornings.',
    'Link Road, Model Town',
    'Model Town',
    'Lahore',
    ST_SetSRID(ST_MakePoint(74.3210, 31.4920), 4326)::geography,
    '+92 42 35841100',
    '08:00 AM - 12:00 AM',
    'active'
  )
ON CONFLICT (slug) DO NOTHING;

-- 5. PLACE CATEGORIES MAPPINGS
INSERT INTO public.place_categories (place_id, category_id, is_primary)
VALUES
  ('44444444-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', true),
  ('44444444-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', true),
  ('44444444-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', true),
  ('44444444-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003', true),
  ('44444444-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001', true),
  ('44444444-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000002', true),
  ('44444444-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000003', true),
  ('44444444-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000001', true)
ON CONFLICT DO NOTHING;

-- 6. PLACE TAGS MAPPINGS
INSERT INTO public.place_tags (place_id, tag_id)
VALUES
  ('44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
  ('44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002'),
  ('44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003'),
  ('44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000004'),
  ('44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000007'),
  ('44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000008'),
  ('44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000009'),
  ('44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000010'),
  ('44444444-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000002'),
  ('44444444-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- 7. DISCOUNTS (Prefix: 55555555)
INSERT INTO public.discounts (
  id, place_id, provider_id, title, discount_type, discount_value, eligibility_type, is_student_eligible,
  details, terms, redemption_instructions, start_date, end_date, is_active, last_verified_at
)
VALUES
  (
    '55555555-0000-0000-0000-000000000001',
    '44444444-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    '25% off selected coffee & handcrafted desserts',
    'percentage',
    25.00,
    'student',
    true,
    'Enjoy 25% discount on all espresso-based beverages, pour-over specialty coffee, and fresh pastries.',
    ARRAY['Valid Monday through Friday from 8:00 AM to 6:00 PM', 'Student ID or Olato verification required at order'],
    ARRAY['Show this verified Olato offer screen to the barista prior to billing', 'Staff applies 25% discount to your final receipt'],
    '2026-09-01',
    '2027-12-31',
    true,
    now()
  ),
  (
    '55555555-0000-0000-0000-000000000002',
    '44444444-0000-0000-0000-000000000002',
    '33333333-0000-0000-0000-000000000002',
    '30% off total food bill with ABC Bank Visa',
    'percentage',
    30.00,
    'bank_card',
    false,
    'Exclusive 30% savings across the entire main course food menu when paying with any valid ABC Bank Visa card.',
    ARRAY['Valid 7 days a week for lunch & dinner', 'Exclusive to payment via ABC Bank Visa cards', 'Maximum cap PKR 4,000 per bill'],
    ARRAY['Inform your server before requesting the bill', 'Payment must be processed on ABC Bank Visa card'],
    '2026-08-15',
    '2027-12-31',
    true,
    now()
  ),
  (
    '55555555-0000-0000-0000-000000000003',
    '44444444-0000-0000-0000-000000000003',
    '33333333-0000-0000-0000-000000000001',
    'Buy 1 Get 1 FREE on all specialty coffees & croissants',
    'bogo',
    0.00,
    'all',
    true,
    'Buy any large handcrafted coffee or cold brew and receive a complimentary fresh butter croissant or danish.',
    ARRAY['Valid daily between 7:30 AM and 12:00 PM', 'Complimentary item of equal or lesser value'],
    ARRAY['Present the Olato deal screen at the cashier counter when ordering'],
    '2026-09-05',
    '2027-12-31',
    true,
    now()
  ),
  (
    '55555555-0000-0000-0000-000000000004',
    '44444444-0000-0000-0000-000000000004',
    '33333333-0000-0000-0000-000000000003',
    '20% off high tea & gourmet sandwich platters',
    'percentage',
    20.00,
    'bank_card',
    false,
    'Experience 20% off all afternoon high tea packages, artisanal wood-fired flatbreads, and signature botanical drinks.',
    ARRAY['Valid 7 days a week from 3:00 PM to 7:00 PM', 'Valid with XYZ Bank Mastercard payments'],
    ARRAY['Mention your Olato offer when reserving or presenting card for bill payment'],
    '2026-09-01',
    '2027-12-31',
    true,
    now()
  ),
  (
    '55555555-0000-0000-0000-000000000005',
    '44444444-0000-0000-0000-000000000005',
    '33333333-0000-0000-0000-000000000001',
    '15% student discount on brews & co-working passes',
    'percentage',
    15.00,
    'student',
    true,
    'Students get 15% off all hot espresso, cold brews, and daily co-working pass bundles upon presenting student ID.',
    ARRAY['Must present valid student ID card', 'Valid 7 days a week'],
    ARRAY['Show valid student ID alongside this Olato app voucher at the counter'],
    '2026-08-01',
    '2027-12-31',
    true,
    now()
  ),
  (
    '55555555-0000-0000-0000-000000000006',
    '44444444-0000-0000-0000-000000000006',
    '33333333-0000-0000-0000-000000000002',
    '35% off weekday dinner menu',
    'percentage',
    35.00,
    'bank_card',
    false,
    'Save 35% on fresh handcrafted pasta, wood-fired flatbreads, and Mediterranean small plates on Monday-Thursday evenings.',
    ARRAY['Valid Monday to Thursday after 6:00 PM', 'Dine-in only', 'Requires payment with ABC Bank Visa card'],
    ARRAY['Present Olato app deal badge to your waiter before receiving bill'],
    '2026-09-10',
    '2027-12-31',
    true,
    now()
  ),
  (
    '55555555-0000-0000-0000-000000000007',
    '44444444-0000-0000-0000-000000000007',
    '33333333-0000-0000-0000-000000000001',
    '25% off weekend courtyard buffet & live BBQ',
    'percentage',
    25.00,
    'all',
    false,
    'Enjoy 25% off Veranda Bistro open-air weekend lunch and dinner buffet featuring international grills and dessert bar.',
    ARRAY['Valid Saturday & Sunday for lunch and dinner slots', 'Prior reservation required'],
    ARRAY['Mention your Olato reservation discount when checking in at reception'],
    '2026-09-01',
    '2027-12-31',
    true,
    now()
  ),
  (
    '55555555-0000-0000-0000-000000000008',
    '44444444-0000-0000-0000-000000000008',
    '33333333-0000-0000-0000-000000000001',
    '20% off cold brews & breakfast paninis',
    'percentage',
    20.00,
    'student',
    true,
    'Kickstart your morning with 20% off all artisan cold brews, Spanish lattes, and toasted breakfast paninis.',
    ARRAY['Valid daily from 8:00 AM to 12:00 PM', 'Dine-in and takeaway'],
    ARRAY['Show verified deal voucher to counter staff upon order'],
    '2026-08-20',
    '2027-12-31',
    true,
    now()
  )
ON CONFLICT (id) DO NOTHING;
