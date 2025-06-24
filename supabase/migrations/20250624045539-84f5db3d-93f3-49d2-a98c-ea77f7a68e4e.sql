
-- Insert seed data for app_locations (facilities)
INSERT INTO app_locations (
  id, name, code, address, address_street, address_city, address_postal_code, address_country,
  location_type, capacity, price_per_hour, has_auto_approval, time_slot_duration,
  latitude, longitude, rating, review_count, accessibility_features, equipment, amenities,
  allowed_booking_types, season_from, season_to, booking_lead_time_hours, 
  max_advance_booking_days, cancellation_deadline_hours, is_featured, is_published,
  status, next_available, contact_name, contact_email, contact_phone, area_sqm
) VALUES
-- Swimming Facilities
(gen_random_uuid(), '{"NO": "Drammensbadet - Svømmehall", "EN": "Drammensbadet - Swimming Pool"}', 'DRAM_SWIM_001', 
 'Danvikgata 40, 3045 Drammen', 'Danvikgata 40', 'Drammen', '3045', 'Norway',
 'Svømmehall', 250, 700, false, 60, 59.7545, 10.1798, 4.7, 89,
 ARRAY['wheelchair', 'hearing-loop'], ARRAY['25m basseng', 'Barnebassseng', 'Garderober', 'Dusjer'], 
 ARRAY['25m basseng', 'Barnebassseng', 'Garderober', 'Dusjer'], ARRAY['engangs', 'fastlan', 'rammetid'],
 '2024-01-01', '2024-12-31', 2, 365, 24, false, true, 'active', 'Søndag, 12:00',
 null, null, null, 500),

(gen_random_uuid(), '{"NO": "Holmestrand Svømmehall", "EN": "Holmestrand Swimming Pool"}', 'HOLM_SWIM_001',
 'Storgata 25, 3080 Holmestrand', 'Storgata 25', 'Holmestrand', '3080', 'Norway',
 'Svømmehall', 180, 550, true, 60, 59.4894, 10.3123, 4.2, 41,
 ARRAY['wheelchair', 'hearing-loop'], ARRAY['25m basseng', 'Varmbasseng', 'Badstue'], 
 ARRAY['25m basseng', 'Varmbasseng', 'Badstue'], ARRAY['engangs', 'fastlan'],
 '2024-01-01', '2024-12-31', 2, 365, 24, false, true, 'active', 'Tirsdag, 07:00',
 null, null, null, 400),

-- Sports Facilities
(gen_random_uuid(), '{"NO": "Konnerud Idrettshall", "EN": "Konnerud Sports Hall"}', 'KONN_SPORTS_001',
 'Konnerudgata 15, 3049 Drammen', 'Konnerudgata 15', 'Drammen', '3049', 'Norway',
 'Idrettshall', 400, 800, false, 60, 59.7423, 10.1956, 4.5, 67,
 ARRAY['wheelchair'], ARRAY['Håndball', 'Basketball', 'Volleyball', 'Garderober'], 
 ARRAY['Håndball', 'Basketball', 'Volleyball'], ARRAY['engangs', 'fastlan', 'rammetid'],
 '2024-01-01', '2024-12-31', 2, 365, 24, true, true, 'active', 'Mandag, 18:00',
 'Lars Hansen', 'lars@konnerud.no', '+47 32 83 45 67', 1200),

(gen_random_uuid(), '{"NO": "Åssiden Idrettshall", "EN": "Åssiden Sports Hall"}', 'ASSI_SPORTS_001',
 'Åssiden Allé 10, 3043 Drammen', 'Åssiden Allé 10', 'Drammen', '3043', 'Norway',
 'Idrettshall', 350, 750, true, 60, 59.7389, 10.2167, 4.3, 45,
 ARRAY['wheelchair'], ARRAY['Fotball', 'Håndball', 'Innebandy'], 
 ARRAY['Fotball', 'Håndball', 'Innebandy'], ARRAY['engangs', 'fastlan'],
 '2024-01-01', '2024-12-31', 2, 365, 24, false, true, 'active', 'Onsdag, 16:00',
 null, null, null, 1000),

-- Meeting Facilities
(gen_random_uuid(), '{"NO": "Marienlyst Stadion - Møtesal", "EN": "Marienlyst Stadium - Meeting Room"}', 'MARI_MEET_001',
 'Schwartz gate 2, 3043 Drammen', 'Schwartz gate 2', 'Drammen', '3043', 'Norway',
 'Møtesal', 80, 450, true, 60, 59.7389, 10.2167, 4.1, 18,
 ARRAY['wheelchair'], ARRAY['Whiteboard', 'Projektor', 'WiFi', 'Kaffe/te'], 
 ARRAY['Whiteboard', 'Projektor', 'WiFi'], ARRAY['engangs', 'fastlan'],
 '2024-01-01', '2024-12-31', 2, 365, 24, false, true, 'active', 'Lørdag, 10:00',
 null, null, null, 120),

(gen_random_uuid(), '{"NO": "Drammen Bibliotek - Møterom", "EN": "Drammen Library - Meeting Room"}', 'DRAM_LIB_001',
 'Grønland 32, 3045 Drammen', 'Grønland 32', 'Drammen', '3045', 'Norway',
 'Møterom', 25, 200, true, 60, 59.7423, 10.2056, 4.3, 27,
 ARRAY['wheelchair', 'hearing-loop'], ARRAY['Whiteboard', 'Projektor', 'WiFi', 'Bøker'], 
 ARRAY['Whiteboard', 'Projektor', 'WiFi'], ARRAY['engangs', 'fastlan'],
 '2024-01-01', '2024-12-31', 2, 365, 24, false, true, 'active', 'Mandag, 09:00',
 null, null, null, 50),

-- Cultural Facilities  
(gen_random_uuid(), '{"NO": "Union Scene", "EN": "Union Scene"}', 'UNION_CULT_001',
 'Bragernes Torg 2, 3017 Drammen', 'Bragernes Torg 2', 'Drammen', '3017', 'Norway',
 'Kulturhus', 500, 1200, false, 120, 59.7445, 10.2089, 4.6, 134,
 ARRAY['wheelchair', 'hearing-loop'], ARRAY['Scene', 'Lyd', 'Lys', 'Garderober'], 
 ARRAY['Scene', 'Lyd', 'Lys'], ARRAY['engangs', 'fastlan'],
 '2024-01-01', '2024-12-31', 24, 180, 72, true, true, 'active', 'Fredag, 19:00',
 'Anna Nilsen', 'booking@union-scene.no', '+47 32 04 65 50', 800),

(gen_random_uuid(), '{"NO": "Drammens Teater", "EN": "Drammen Theatre"}', 'DRAM_THEA_001',
 'Bragernes Torg 7, 3017 Drammen', 'Bragernes Torg 7', 'Drammen', '3017', 'Norway',
 'Teater', 300, 1500, false, 120, 59.7445, 10.2089, 4.8, 89,
 ARRAY['wheelchair', 'hearing-loop'], ARRAY['Scene', 'Orkesterplass', 'Garderober'], 
 ARRAY['Scene', 'Orkesterplass'], ARRAY['engangs', 'fastlan'],
 '2024-01-01', '2024-12-31', 48, 90, 96, true, true, 'active', 'Lørdag, 20:00',
 'Erik Johansen', 'admin@drammensteater.no', '+47 32 04 70 00', 600);

-- Insert some sample images for these facilities
INSERT INTO app_location_images (location_id, image_url, alt_text, display_order, is_featured, file_size)
SELECT 
  al.id,
  CASE 
    WHEN al.location_type = 'Svømmehall' THEN '/Bilder/drammensbadet_71.jpg'
    WHEN al.location_type = 'Idrettshall' THEN '/Bilder/Nesøya_skole_og_idrettshall_Asker.jpg'
    WHEN al.location_type IN ('Møtesal', 'Møterom') THEN '/Bilder/free-photo-of-kontor-design-rom-stoler.jpeg'
    WHEN al.location_type IN ('Kulturhus', 'Teater') THEN '/Bilder/standard_compressed_Kulturhuset_1200px.jpg'
    ELSE '/Bilder/standard_compressed_drammensbadet_71.jpg'
  END,
  CONCAT((al.name->>'NO'), ' - hovedbilde'),
  1,
  true,
  850000
FROM app_locations al
WHERE al.is_published = true;

-- Insert some sample zones for the facilities (fixed JSONB format for name field)
INSERT INTO app_zones (
  location_id, name, code, type, capacity, description, is_main_zone, 
  bookable_independently, area_sqm, floor, coordinates_x, coordinates_y, 
  coordinates_width, coordinates_height, equipment, accessibility_features, 
  status, interval
)
SELECT 
  al.id,
  (CASE 
    WHEN al.location_type = 'Svømmehall' THEN '{"NO": "Hovedbasseng", "EN": "Main Pool"}'
    WHEN al.location_type = 'Idrettshall' THEN '{"NO": "Hovedhall", "EN": "Main Hall"}'
    WHEN al.location_type IN ('Møtesal', 'Møterom') THEN '{"NO": "Hovedrom", "EN": "Main Room"}'
    WHEN al.location_type IN ('Kulturhus', 'Teater') THEN '{"NO": "Hovedscene", "EN": "Main Stage"}'
    ELSE '{"NO": "Hovedområde", "EN": "Main Area"}'
  END)::jsonb,
  CONCAT(al.code, '_MAIN'),
  CASE 
    WHEN al.location_type = 'Svømmehall' THEN 'court'
    WHEN al.location_type = 'Idrettshall' THEN 'court'  
    WHEN al.location_type IN ('Møtesal', 'Møterom') THEN 'room'
    WHEN al.location_type IN ('Kulturhus', 'Teater') THEN 'area'
    ELSE 'area'
  END,
  al.capacity,
  CASE 
    WHEN al.location_type = 'Svømmehall' THEN 'Hovedbasseng for svømming og aktiviteter'
    WHEN al.location_type = 'Idrettshall' THEN 'Hovedhall for idrettsaktiviteter'
    WHEN al.location_type IN ('Møtesal', 'Møterom') THEN 'Hovedrom for møter og arrangementer'
    WHEN al.location_type IN ('Kulturhus', 'Teater') THEN 'Hovedscene for kulturarrangementer'
    ELSE 'Hovedområde'
  END,
  true,
  true,
  al.area_sqm,
  '1',
  0,
  0,
  100,
  100,
  al.equipment,
  al.accessibility_features,
  'active',
  '60min'
FROM app_locations al
WHERE al.is_published = true;
