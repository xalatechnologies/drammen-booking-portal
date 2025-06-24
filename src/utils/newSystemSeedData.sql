
-- Comprehensive seed data for new system
-- This file contains all the seed data for testing the new localized system

-- Sample users
INSERT INTO app_users (id, email, name, locale) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'admin@example.com', 'System Administrator', 'NO'),
  ('770e8400-e29b-41d4-a716-446655440002', 'manager@example.com', 'Facility Manager', 'NO'),
  ('770e8400-e29b-41d4-a716-446655440003', 'caseworker@example.com', 'Case Worker', 'NO'),
  ('770e8400-e29b-41d4-a716-446655440004', 'user@example.com', 'John Doe', 'EN'),
  ('770e8400-e29b-41d4-a716-446655440005', 'bruker@example.com', 'Ola Nordmann', 'NO');

-- Assign roles to users
INSERT INTO app_user_roles (user_id, role_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'), -- admin role
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002'), -- facility-manager role
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003'), -- caseworker role
  ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004'), -- regular-user role
  ('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004'); -- regular-user role

-- Sample actors (organizations)
INSERT INTO app_actors (id, type, name) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', 'lag-foreninger', '{"NO": "Drammen Fotballklubb", "EN": "Drammen Football Club"}'),
  ('880e8400-e29b-41d4-a716-446655440002', 'private-firma', '{"NO": "Tech Solutions AS", "EN": "Tech Solutions Ltd"}'),
  ('880e8400-e29b-41d4-a716-446655440003', 'kommunale-enheter', '{"NO": "Drammen Kommune", "EN": "Drammen Municipality"}'),
  ('880e8400-e29b-41d4-a716-446655440004', 'utdanning', '{"NO": "Drammen Videregående Skole", "EN": "Drammen High School"}'),
  ('880e8400-e29b-41d4-a716-446655440005', 'paraply', '{"NO": "Buskerud Idrettskrets", "EN": "Buskerud Sports Association"}');

-- Assign users to actors (memberships)
INSERT INTO app_actor_memberships (actor_id, user_id, role) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440004', 'admin'),
  ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440005', 'member'),
  ('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004', 'admin'),
  ('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', 'admin');

-- Sample locations (facilities)
INSERT INTO app_locations (id, code, name, description, address, latitude, longitude) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', 'DRM-SPORTS-01', 
   '{"NO": "Drammen Idrettshall", "EN": "Drammen Sports Hall"}',
   '{"NO": "Moderne idrettshall med full utrustning for fotball, håndball og volleyball", "EN": "Modern sports hall with full equipment for football, handball and volleyball"}',
   'Idrettsveien 1, 3012 Drammen', 59.7445, 10.2089),
  ('990e8400-e29b-41d4-a716-446655440002', 'DRM-MEET-01',
   '{"NO": "Drammen Møtesenter", "EN": "Drammen Meeting Center"}',
   '{"NO": "Fleksibelt møtesenter med moderne AV-utstyr", "EN": "Flexible meeting center with modern AV equipment"}',
   'Møteveien 5, 3012 Drammen', 59.7440, 10.2085),
  ('990e8400-e29b-41d4-a716-446655440003', 'DRM-POOL-01',
   '{"NO": "Drammen Svømmehall", "EN": "Drammen Swimming Pool"}',
   '{"NO": "25m basseng med separate områder for trening og rekreasjon", "EN": "25m pool with separate areas for training and recreation"}',
   'Svømmeveien 10, 3012 Drammen', 59.7450, 10.2080);

-- Sample zones within locations
INSERT INTO app_zones (id, location_id, code, name, interval, capacity) VALUES
  -- Drammen Idrettshall zones
  ('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'HALL-A', 
   '{"NO": "Hovedhall", "EN": "Main Hall"}', '120min', 100),
  ('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', 'HALL-B',
   '{"NO": "Sidehall", "EN": "Side Hall"}', '60min', 50),
  -- Drammen Møtesenter zones  
  ('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440002', 'CONF-A',
   '{"NO": "Konferanserom A", "EN": "Conference Room A"}', '60min', 20),
  ('aa0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440002', 'CONF-B',
   '{"NO": "Konferanserom B", "EN": "Conference Room B"}', '60min', 10),
  -- Drammen Svømmehall zones
  ('aa0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440003', 'POOL-MAIN',
   '{"NO": "Hovedbasseng", "EN": "Main Pool"}', '60min', 30);

-- Sample availability rules
INSERT INTO app_availability_rules (id, location_id, type, config, start_date_time, end_date_time, created_by_id) VALUES
  ('bb0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'availability',
   '{"days": [1,2,3,4,5], "start_time": "08:00", "end_time": "22:00"}',
   '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', '770e8400-e29b-41d4-a716-446655440001'),
  ('bb0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'availability',
   '{"days": [1,2,3,4,5,6,7], "start_time": "06:00", "end_time": "23:00"}',
   '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', '770e8400-e29b-41d4-a716-446655440001');

-- Sample price rules
INSERT INTO app_price_rules (id, location_id, actor_type, type, priority, config, price) VALUES
  ('cc0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'lag-foreninger', 'base', 1, '{}', 300.00),
  ('cc0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', 'private-firma', 'base', 1, '{}', 800.00),
  ('cc0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440002', 'private-firma', 'base', 1, '{}', 500.00),
  ('cc0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440003', 'lag-foreninger', 'base', 1, '{}', 200.00);

-- Sample bookings
INSERT INTO app_bookings (id, user_id, actor_id, location_id, zone_id, type, status, start_date_time, end_date_time, price, metadata) VALUES
  ('dd0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440001',
   '990e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'engangs', 'confirmed',
   '2024-07-01 18:00:00+00', '2024-07-01 20:00:00+00', 600.00, '{"purpose": "Football training", "attendees": 25}'),
  ('dd0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440002',
   '990e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440003', 'engangs', 'confirmed',
   '2024-07-02 14:00:00+00', '2024-07-02 16:00:00+00', 1000.00, '{"purpose": "Business meeting", "attendees": 15}');

-- Sample carts (for testing cart functionality)
INSERT INTO app_carts (id, user_id) VALUES
  ('ee0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440005');

INSERT INTO app_cart_items (id, cart_id, location_id, zone_id, actor_id, type, start_date_time, end_date_time, price, metadata) VALUES
  ('ff0e8400-e29b-41d4-a716-446655440001', 'ee0e8400-e29b-41d4-a716-446655440001',
   '990e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001',
   'engangs', '2024-07-05 16:00:00+00', '2024-07-05 18:00:00+00', 300.00, '{"purpose": "Training session"}');

-- Sample notifications
INSERT INTO app_notifications (id, user_id, type, booking_id, message) VALUES
  ('gg0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440004', 'booking-confirmation',
   'dd0e8400-e29b-41d4-a716-446655440001', 'Your booking for Drammen Idrettshall has been confirmed'),
  ('gg0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004', 'booking-reminder',
   'dd0e8400-e29b-41d4-a716-446655440001', 'Reminder: Your booking is tomorrow at 18:00');

-- Sample templates
INSERT INTO app_templates (id, name, slug, type, content, visibility, created_by_id) VALUES
  ('hh0e8400-e29b-41d4-a716-446655440001', 'Booking Confirmation Email', 'booking-confirmation-email', 'email',
   '{"subject": {"NO": "Booking bekreftet", "EN": "Booking confirmed"}, "body": {"NO": "Din booking er bekreftet.", "EN": "Your booking is confirmed."}}',
   'system', '770e8400-e29b-41d4-a716-446655440001');

-- Sample feedback
INSERT INTO app_feedbacks (id, location_id, user_id, rating, comment) VALUES
  ('ii0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440004',
   5, 'Excellent facilities and very clean!'),
  ('ii0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440005',
   4, 'Good meeting rooms, could use better audio equipment.');
