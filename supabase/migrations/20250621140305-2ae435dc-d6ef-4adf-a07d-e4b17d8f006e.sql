
-- Insert suitable activities data for existing facilities
INSERT INTO facility_translations (facility_id, language_code, name, description, created_at, updated_at) VALUES
-- Norwegian translations
(1, 'NO', 'Brandengen Skole - Gymsal', 'En moderne gymsal med høy standard og god ventilasjon. Ideell for ballsport og større arrangementer.', now(), now()),
(2, 'NO', 'Fjell Skole - Aktivitetshall', 'Stor aktivitetshall med mulighet for både sport og kulturarrangementer. God akustikk og moderne fasiliteter.', now(), now()),
(6, 'NO', 'Åssiden Fotballhall', 'Stor fotballhall med kunstgress av høy kvalitet. Egnet for både trening, kamper og turneringer.', now(), now()),
(11, 'NO', 'Ytterkollen Idrettshall', 'Stor idrettshall med tribuner og moderne fasiliteter. Ideell for store idrettsarrangementer.', now(), now()),
(998, 'NO', 'Idrettshall Mjøndalen - Fleksibel', 'Moderne idrettshall med tre separate soner som kan kombineres. Ideell for håndball, basketball, volleyball og badminton.', now(), now()),
(5, 'NO', 'Drammensbadet - Svømmehall', 'Moderne svømmeanlegg med både konkurransebasseng og barneområde. Høy standard på fasiliteter og sikkerhet.', now(), now()),
(16, 'NO', 'Holmestrand Svømmehall', 'Moderne svømmeanlegg med varmebasseng og badstue. Familievennlig med gode fasiliteter.', now(), now()),
(4, 'NO', 'Marienlyst Stadion - Møtesal', 'Romslig møtesal med naturlig lys og moderne konferanseutstyr. Ideell for bedriftsmøter og kursvirksomhet.', now(), now()),
(7, 'NO', 'Drammen Bibliotek - Møterom', 'Rolig møterom i biblioteket med tilgang til forskningsressurser og stille arbeidsmiljø.', now(), now()),
(10, 'NO', 'Tangen Skole - Klasserom', 'Praktisk klasserom med god belysning og moderne undervisningsutstyr.', now(), now()),
(12, 'NO', 'Buskerud Rådhus - Forsamlingssal', 'Representativ forsamlingssal i rådhuset med full teknisk utrustning for offentlige arrangementer.', now(), now()),
(3, 'NO', 'Drammens Teater - Hovedscene', 'Historisk teatersal med utmerket akustikk og profesjonell lys- og lydteknologi.', now(), now()),
(8, 'NO', 'Papirbredden Kultursenter', 'Moderne kultursenter med fleksible rom for utstillinger, konserter og kulturarrangementer.', now(), now()),
(9, 'NO', 'Drammens Museum - Utstillingssal', 'Elegant utstillingssal i historiske omgivelser, perfekt for kulturelle arrangementer og private sammenkomster.', now(), now()),

-- English translations
(1, 'EN', 'Brandengen School - Gymnasium', 'A modern gymnasium with high standards and good ventilation. Ideal for ball sports and larger events.', now(), now()),
(2, 'EN', 'Fjell School - Activity Hall', 'Large activity hall suitable for both sports and cultural events. Good acoustics and modern facilities.', now(), now()),
(6, 'EN', 'Åssiden Football Hall', 'Large football hall with high-quality artificial grass. Suitable for training, matches and tournaments.', now(), now()),
(11, 'EN', 'Ytterkollen Sports Hall', 'Large sports hall with grandstands and modern facilities. Ideal for large sporting events.', now(), now()),
(998, 'EN', 'Mjøndalen Sports Hall - Flexible', 'Modern sports hall with three separate zones that can be combined. Ideal for handball, basketball, volleyball and badminton.', now(), now()),
(5, 'EN', 'Drammensbadet - Swimming Pool', 'Modern swimming facility with both competition pool and children area. High standard facilities and safety.', now(), now()),
(16, 'EN', 'Holmestrand Swimming Pool', 'Modern swimming facility with heated pool and sauna. Family-friendly with good facilities.', now(), now()),
(4, 'EN', 'Marienlyst Stadium - Meeting Room', 'Spacious meeting room with natural light and modern conference equipment. Ideal for business meetings and courses.', now(), now()),
(7, 'EN', 'Drammen Library - Meeting Room', 'Quiet meeting room in the library with access to research resources and quiet work environment.', now(), now()),
(10, 'EN', 'Tangen School - Classroom', 'Practical classroom with good lighting and modern teaching equipment.', now(), now()),
(12, 'EN', 'Buskerud City Hall - Assembly Hall', 'Representative assembly hall in the city hall with full technical equipment for public events.', now(), now()),
(3, 'EN', 'Drammen Theatre - Main Stage', 'Historic theatre hall with excellent acoustics and professional lighting and sound technology.', now(), now()),
(8, 'EN', 'Papirbredden Cultural Center', 'Modern cultural center with flexible rooms for exhibitions, concerts and cultural events.', now(), now()),
(9, 'EN', 'Drammen Museum - Exhibition Hall', 'Elegant exhibition hall in historic surroundings, perfect for cultural events and private gatherings.', now(), now())

ON CONFLICT (facility_id, language_code) DO UPDATE SET
name = EXCLUDED.name,
description = EXCLUDED.description,
updated_at = now();

-- Create a table for facility suitable activities if it doesn't exist
CREATE TABLE IF NOT EXISTS facility_suitable_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id INTEGER NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  activity_name TEXT NOT NULL,
  language_code language_code NOT NULL DEFAULT 'NO',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(facility_id, activity_name, language_code)
);

-- Insert suitable activities for each facility
INSERT INTO facility_suitable_activities (facility_id, activity_name, language_code) VALUES
-- Sports facilities
(1, 'Basketball', 'NO'), (1, 'Volleyball', 'NO'), (1, 'Håndball', 'NO'), (1, 'Badminton', 'NO'),
(1, 'Basketball', 'EN'), (1, 'Volleyball', 'EN'), (1, 'Handball', 'EN'), (1, 'Badminton', 'EN'),

(2, 'Fotball', 'NO'), (2, 'Innebandy', 'NO'), (2, 'Dans', 'NO'), (2, 'Konsert', 'NO'),
(2, 'Football', 'EN'), (2, 'Floorball', 'EN'), (2, 'Dance', 'EN'), (2, 'Concert', 'EN'),

(6, 'Fotball', 'NO'), (6, 'Trening', 'NO'), (6, 'Kamper', 'NO'), (6, 'Turneringer', 'NO'),
(6, 'Football', 'EN'), (6, 'Training', 'EN'), (6, 'Matches', 'EN'), (6, 'Tournaments', 'EN'),

(11, 'Idrett', 'NO'), (11, 'Store arrangementer', 'NO'), (11, 'Konkurranser', 'NO'),
(11, 'Sports', 'EN'), (11, 'Large events', 'EN'), (11, 'Competitions', 'EN'),

(998, 'Håndball', 'NO'), (998, 'Basketball', 'NO'), (998, 'Volleyball', 'NO'), (998, 'Badminton', 'NO'),
(998, 'Handball', 'EN'), (998, 'Basketball', 'EN'), (998, 'Volleyball', 'EN'), (998, 'Badminton', 'EN'),

-- Swimming facilities
(5, 'Svømming', 'NO'), (5, 'Vannaktiviteter', 'NO'), (5, 'Konkurranser', 'NO'),
(5, 'Swimming', 'EN'), (5, 'Water activities', 'EN'), (5, 'Competitions', 'EN'),

(16, 'Svømming', 'NO'), (16, 'Avslapning', 'NO'), (16, 'Familie', 'NO'),
(16, 'Swimming', 'EN'), (16, 'Relaxation', 'EN'), (16, 'Family', 'EN'),

-- Meeting facilities
(4, 'Møter', 'NO'), (4, 'Kurs', 'NO'), (4, 'Presentasjoner', 'NO'),
(4, 'Meetings', 'EN'), (4, 'Courses', 'EN'), (4, 'Presentations', 'EN'),

(7, 'Møter', 'NO'), (7, 'Studier', 'NO'), (7, 'Arbeid', 'NO'),
(7, 'Meetings', 'EN'), (7, 'Studies', 'EN'), (7, 'Work', 'EN'),

(10, 'Undervisning', 'NO'), (10, 'Kurs', 'NO'), (10, 'Workshops', 'NO'),
(10, 'Teaching', 'EN'), (10, 'Courses', 'EN'), (10, 'Workshops', 'EN'),

(12, 'Offentlige møter', 'NO'), (12, 'Arrangementer', 'NO'), (12, 'Forsamlinger', 'NO'),
(12, 'Public meetings', 'EN'), (12, 'Events', 'EN'), (12, 'Assemblies', 'EN'),

-- Cultural facilities
(3, 'Teater', 'NO'), (3, 'Konserter', 'NO'), (3, 'Forestillinger', 'NO'),
(3, 'Theatre', 'EN'), (3, 'Concerts', 'EN'), (3, 'Performances', 'EN'),

(8, 'Utstillinger', 'NO'), (8, 'Konserter', 'NO'), (8, 'Kulturarrangementer', 'NO'),
(8, 'Exhibitions', 'EN'), (8, 'Concerts', 'EN'), (8, 'Cultural events', 'EN'),

(9, 'Utstillinger', 'NO'), (9, 'Kulturarrangementer', 'NO'), (9, 'Private arrangementer', 'NO'),
(9, 'Exhibitions', 'EN'), (9, 'Cultural events', 'EN'), (9, 'Private events', 'EN')

ON CONFLICT (facility_id, activity_name, language_code) DO NOTHING;
