
-- Insert facilities from mock data into the database (corrected enum values)
INSERT INTO facilities (
  id, name, address_street, address_city, address_postal_code, address_country,
  type, area, description, capacity, accessibility_features, equipment,
  price_per_hour, has_auto_approval, amenities, time_slot_duration,
  latitude, longitude, allowed_booking_types, season_from, season_to,
  status, contact_name, contact_email, contact_phone, rating, review_count,
  image_url
) VALUES 
-- Sports Facilities
(1, 'Brandengen Skole - Gymsal', 'Iver Holters gate 48', 'Drammen', '3041', 'Norway',
 'Gymsal', 'Bragernes', 'En moderne gymsal med høy standard og god ventilasjon. Ideell for ballsport og større arrangementer.',
 120, ARRAY['wheelchair', 'hearing-loop'], ARRAY['Basketkurver', 'Volleyballnett', 'Lydsystem', 'Projektor'],
 500.00, false, ARRAY['Basketkurver', 'Volleyballnett', 'Lydsystem', 'Projektor'], 1,
 59.7464, 10.2045, ARRAY['engangs', 'fastlan', 'rammetid', 'strotimer']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Lars Hansen', 'lars.hansen@drammen.kommune.no', '+47 32 04 70 00', 4.2, 15,
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop'),

(2, 'Fjell Skole - Aktivitetshall', 'Lauritz Hervigs vei 20', 'Drammen', '3035', 'Norway',
 'Aktivitetshall', 'Konnerud', 'Stor aktivitetshall med mulighet for både sport og kulturarrangementer. God akustikk og moderne fasiliteter.',
 200, ARRAY['wheelchair'], ARRAY['Fotballmål', 'Lydanlegg', 'Scene', 'Garderober'],
 650.00, false, ARRAY['Fotballmål', 'Lydanlegg', 'Scene', 'Garderober'], 1,
 59.7298, 10.1845, ARRAY['engangs', 'fastlan', 'rammetid', 'strotimer']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Kari Johansen', 'kari.johansen@drammen.kommune.no', '+47 32 04 70 01', 4.5, 23,
 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop'),

(6, 'Åssiden Fotballhall', 'Buskerudveien 54', 'Drammen', '3024', 'Norway',
 'Fotballhall', 'Åssiden', 'Stor fotballhall med kunstgress av høy kvalitet. Egnet for både trening, kamper og turneringer.',
 300, ARRAY['wheelchair'], ARRAY['Kunstgress', 'Fotballmål', 'Tilskuerplasser', 'Garderober', 'Kafeteria'],
 900.00, true, ARRAY['Kunstgress', 'Fotballmål', 'Tilskuerplasser', 'Garderober', 'Kafeteria'], 1,
 59.7634, 10.1456, ARRAY['engangs', 'fastlan', 'rammetid', 'strotimer']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Per Nielsen', 'per.nielsen@drammen.kommune.no', '+47 32 04 70 02', 4.4, 52,
 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop'),

(11, 'Ytterkollen Idrettshall', 'Ytterkollveien 78', 'Drammen', '3037', 'Norway',
 'Idrettshall', 'Konnerud', 'Stor idrettshall med tribuner og moderne fasiliteter. Ideell for store idrettsarrangementer.',
 350, ARRAY['wheelchair', 'hearing-loop'], ARRAY['Kunstgress', 'Tribuner', 'Lydanlegg', 'Garderober', 'Kantine'],
 850.00, false, ARRAY['Kunstgress', 'Tribuner', 'Lydanlegg', 'Garderober', 'Kantine'], 1,
 59.7234, 10.1678, ARRAY['engangs', 'fastlan', 'rammetid', 'strotimer']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Anne Olsen', 'anne.olsen@drammen.kommune.no', '+47 32 04 70 03', 4.8, 76,
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop'),

(998, 'Idrettshall Mjøndalen - Fleksibel', 'Idrettsveien 22', 'Mjøndalen', '3370', 'Norway',
 'Idrettshall', 'Mjøndalen', 'Moderne idrettshall med tre separate soner som kan kombineres. Ideell for håndball, basketball, volleyball og badminton.',
 150, ARRAY['wheelchair'], ARRAY['Basketkurver', 'Håndballmål', 'Nettstolper', 'Tribuner'],
 600.00, true, ARRAY['Moderne utstyr', 'God ventilasjon', 'Garderober'], 2,
 59.7234, 10.1934, ARRAY['engangs', 'fastlan', 'rammetid', 'strotimer']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Erik Andersen', 'erik.andersen@drammen.kommune.no', '+47 32 04 70 04', 4.6, 32,
 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop'),

-- Swimming Facilities
(5, 'Drammensbadet - Svømmehall', 'Danvikgata 40', 'Drammen', '3045', 'Norway',
 'Svømmehall', 'Åssiden', 'Moderne svømmeanlegg med både konkurransebasseng og barneområde. Høy standard på fasiliteter og sikkerhet.',
 250, ARRAY['wheelchair', 'hearing-loop'], ARRAY['25m basseng', 'Barnebassseng', 'Garderober', 'Dusjer', 'Livredningsutstyr'],
 700.00, false, ARRAY['25m basseng', 'Barnebassseng', 'Garderober', 'Dusjer', 'Livredningsutstyr'], 1,
 59.7545, 10.1798, ARRAY['engangs', 'fastlan', 'rammetid', 'strotimer']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Svein Larsen', 'svein.larsen@drammen.kommune.no', '+47 32 04 70 05', 4.7, 89,
 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop'),

(16, 'Holmestrand Svømmehall', 'Storgata 25', 'Holmestrand', '3080', 'Norway',
 'Svømmehall', 'Holmestrand', 'Moderne svømmeanlegg med varmebasseng og badstue. Familievennlig med gode fasiliteter.',
 180, ARRAY['wheelchair', 'hearing-loop'], ARRAY['25m basseng', 'Varmbasseng', 'Badstue', 'Garderober', 'Kafeteria'],
 550.00, true, ARRAY['25m basseng', 'Varmbasseng', 'Badstue', 'Garderober', 'Kafeteria'], 1,
 59.4894, 10.3123, ARRAY['engangs', 'fastlan', 'rammetid', 'strotimer']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Marte Kristiansen', 'marte.kristiansen@holmestrand.kommune.no', '+47 33 07 90 00', 4.2, 41,
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop'),

-- Meeting Facilities
(4, 'Marienlyst Stadion - Møtesal', 'Schwartz gate 2', 'Drammen', '3043', 'Norway',
 'Møtesal', 'Strømsø', 'Romslig møtesal med naturlig lys og moderne konferanseutstyr. Ideell for bedriftsmøter og kursvirksomhet.',
 80, ARRAY['wheelchair'], ARRAY['Whiteboard', 'Projektor', 'WiFi', 'Kaffe/te', 'Flipchart'],
 450.00, true, ARRAY['Whiteboard', 'Projektor', 'WiFi', 'Kaffe/te', 'Flipchart'], 1,
 59.7389, 10.2167, ARRAY['engangs', 'fastlan', 'rammetid', 'strotimer']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Tone Bakken', 'tone.bakken@drammen.kommune.no', '+47 32 04 70 06', 4.1, 18,
 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop'),

(7, 'Drammen Bibliotek - Møterom', 'Grønland 32', 'Drammen', '3045', 'Norway',
 'Møterom', 'Bragernes', 'Rolig møterom i biblioteket med tilgang til forskningsressurser og stille arbeidsmiljø.',
 25, ARRAY['wheelchair', 'hearing-loop', 'visual-guidance'], ARRAY['Whiteboard', 'Projektor', 'WiFi', 'Bøker', 'Stilleområde'],
 200.00, true, ARRAY['Whiteboard', 'Projektor', 'WiFi', 'Bøker', 'Stilleområde'], 1,
 59.7423, 10.2056, ARRAY['engangs', 'fastlan', 'rammetid', 'strotimer']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Liv Haugen', 'liv.haugen@drammen.kommune.no', '+47 32 04 70 07', 4.3, 27,
 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop'),

(10, 'Tangen Skole - Klasserom', 'Tangenvegen 45', 'Drammen', '3047', 'Norway',
 'Klasserom', 'Tangen', 'Praktisk klasserom med god belysning og moderne undervisningsutstyr.',
 30, ARRAY['wheelchair'], ARRAY['Tavle', 'Projektor', 'WiFi', 'Stoler', 'Bord'],
 250.00, true, ARRAY['Tavle', 'Projektor', 'WiFi', 'Stoler', 'Bord'], 1,
 59.7512, 10.2234, ARRAY['engangs', 'fastlan', 'rammetid', 'strotimer']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Hans Pettersen', 'hans.pettersen@drammen.kommune.no', '+47 32 04 70 08', 4.0, 12,
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop'),

(12, 'Buskerud Rådhus - Forsamlingssal', 'Gamle Kirkeplass 3', 'Drammen', '3012', 'Norway',
 'Forsamlingssal', 'Bragernes', 'Representativ forsamlingssal i rådhuset med full teknisk utrustning for offentlige arrangementer.',
 100, ARRAY['wheelchair', 'hearing-loop', 'visual-guidance'], ARRAY['Mikrofoner', 'Projektor', 'Lyd-/videoutstyr', 'Wifi', 'Tolketjenester'],
 600.00, false, ARRAY['Mikrofoner', 'Projektor', 'Lyd-/videoutstyr', 'Wifi', 'Tolketjenester'], 1,
 59.7445, 10.2089, ARRAY['engangs', 'fastlan', 'rammetid', 'strotimer']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Astrid Haugen', 'astrid.haugen@buskerud.kommune.no', '+47 32 80 80 00', 4.4, 22,
 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop'),

-- Cultural Facilities
(3, 'Drammens Teater - Hovedscene', 'Bragernes Torg 2', 'Drammen', '3017', 'Norway',
 'Teater', 'Bragernes', 'Historisk teatersal med utmerket akustikk og profesjonell lys- og lydteknologi.',
 350, ARRAY['wheelchair', 'hearing-loop'], ARRAY['Profesjonell lyd', 'Scenelys', 'Garderober', 'Orkestergraven'],
 1200.00, false, ARRAY['Profesjonell lyd', 'Scenelys', 'Garderober', 'Orkestergraven'], 1,
 59.7434, 10.2045, ARRAY['engangs', 'fastlan', 'rammetid']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Maria Svendsen', 'maria.svendsen@drammens-teater.no', '+47 32 90 90 90', 4.9, 156,
 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop'),

(8, 'Papirbredden Kultursenter', 'Papirbredden 2', 'Drammen', '3045', 'Norway',
 'Kultursenter', 'Bragernes', 'Moderne kultursenter med fleksible rom for utstillinger, konserter og kulturarrangementer.',
 400, ARRAY['wheelchair', 'hearing-loop'], ARRAY['Utstillingsvegger', 'Lydanlegg', 'Kaffe-bar', 'Verksteder'],
 800.00, true, ARRAY['Utstillingsvegger', 'Lydanlegg', 'Kaffe-bar', 'Verksteder'], 1,
 59.7445, 10.2034, ARRAY['engangs', 'fastlan', 'rammetid', 'strotimer']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Kristin Berg', 'kristin.berg@papirbredden.no', '+47 32 21 30 30', 4.6, 83,
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop'),

(9, 'Drammens Museum - Utstillingssal', 'Konnerudgata 7', 'Drammen', '3045', 'Norway',
 'Museum', 'Strømsø', 'Elegant utstillingssal i historiske omgivelser, perfekt for kulturelle arrangementer og private sammenkomster.',
 120, ARRAY['wheelchair'], ARRAY['Utstillingsutstyr', 'Sikkerhetssystem', 'Klimakontroll', 'Auditorium'],
 750.00, false, ARRAY['Utstillingsutstyr', 'Sikkerhetssystem', 'Klimakontroll', 'Auditorium'], 1,
 59.7423, 10.2123, ARRAY['engangs', 'fastlan', 'rammetid']::booking_type[], '2024-01-01', '2024-12-31',
 'active', 'Ola Nordahl', 'ola.nordahl@drammens-museum.no', '+47 32 80 56 00', 4.4, 67,
 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop')
ON CONFLICT (id) DO UPDATE SET
  image_url = EXCLUDED.image_url;

-- Insert facility opening hours for all facilities
INSERT INTO facility_opening_hours (facility_id, day_of_week, open_time, close_time, is_open) VALUES
-- Sports facilities standard hours
(1, 1, '08:00', '22:00', true), (1, 2, '08:00', '22:00', true), (1, 3, '08:00', '22:00', true), 
(1, 4, '08:00', '22:00', true), (1, 5, '08:00', '22:00', true), (1, 6, '10:00', '20:00', true), (1, 0, '10:00', '20:00', true),

(2, 1, '07:00', '23:00', true), (2, 2, '07:00', '23:00', true), (2, 3, '07:00', '23:00', true),
(2, 4, '07:00', '23:00', true), (2, 5, '07:00', '24:00', true), (2, 6, '09:00', '22:00', true), (2, 0, '09:00', '22:00', true),

(6, 1, '07:00', '23:00', true), (6, 2, '07:00', '23:00', true), (6, 3, '07:00', '23:00', true),
(6, 4, '07:00', '23:00', true), (6, 5, '07:00', '23:00', true), (6, 6, '07:00', '23:00', true),

(11, 1, '06:00', '23:30', true), (11, 2, '06:00', '23:30', true), (11, 3, '06:00', '23:30', true),
(11, 4, '06:00', '23:30', true), (11, 5, '06:00', '23:30', true), (11, 6, '06:00', '23:30', true),

(998, 1, '07:00', '23:00', true), (998, 2, '07:00', '23:00', true), (998, 3, '07:00', '23:00', true),
(998, 4, '07:00', '23:00', true), (998, 5, '07:00', '23:00', true), (998, 6, '09:00', '21:00', true), (998, 0, '09:00', '21:00', true),

-- Swimming facilities
(5, 1, '06:00', '22:00', true), (5, 2, '06:00', '22:00', true), (5, 3, '06:00', '22:00', true),
(5, 4, '06:00', '22:00', true), (5, 5, '06:00', '22:00', true), (5, 6, '08:00', '20:00', true),

(16, 1, '06:00', '21:00', true), (16, 2, '06:00', '21:00', true), (16, 3, '06:00', '21:00', true),
(16, 4, '06:00', '21:00', true), (16, 5, '06:00', '21:00', true), (16, 6, '09:00', '18:00', true),

-- Meeting facilities
(4, 1, '07:00', '20:00', true), (4, 2, '07:00', '20:00', true), (4, 3, '07:00', '20:00', true),
(4, 4, '07:00', '20:00', true), (4, 5, '07:00', '20:00', true), (4, 6, '09:00', '16:00', true),

(7, 1, '09:00', '20:00', true), (7, 2, '09:00', '20:00', true), (7, 3, '09:00', '20:00', true),
(7, 4, '09:00', '20:00', true), (7, 5, '09:00', '20:00', true), (7, 6, '10:00', '16:00', true),

(10, 1, '16:00', '21:00', true), (10, 2, '16:00', '21:00', true), (10, 3, '16:00', '21:00', true),
(10, 4, '16:00', '21:00', true), (10, 5, '16:00', '21:00', true), (10, 6, '10:00', '16:00', true),

(12, 1, '08:00', '16:00', true), (12, 2, '08:00', '16:00', true), (12, 3, '08:00', '16:00', true),
(12, 4, '08:00', '16:00', true), (12, 5, '08:00', '16:00', true), (12, 6, '08:00', '16:00', true),

-- Cultural facilities
(3, 1, '10:00', '22:00', true), (3, 2, '10:00', '22:00', true), (3, 3, '10:00', '22:00', true),
(3, 4, '10:00', '22:00', true), (3, 5, '10:00', '24:00', true), (3, 6, '10:00', '24:00', true), (3, 0, '12:00', '22:00', true),

(8, 1, '09:00', '21:00', true), (8, 2, '09:00', '21:00', true), (8, 3, '09:00', '21:00', true),
(8, 4, '09:00', '21:00', true), (8, 5, '09:00', '22:00', true), (8, 6, '10:00', '20:00', true), (8, 0, '12:00', '18:00', true),

(9, 1, '10:00', '17:00', true), (9, 2, '10:00', '17:00', true), (9, 3, '10:00', '17:00', true),
(9, 4, '10:00', '17:00', true), (9, 5, '10:00', '19:00', true), (9, 6, '11:00', '16:00', true), (9, 0, '12:00', '16:00', true)
ON CONFLICT DO NOTHING;
