
-- First, remove any existing featured status to avoid constraint violations
UPDATE facility_images SET is_featured = false WHERE is_featured = true;

-- Now insert seed data for facility images using images from public/Bilder folder
INSERT INTO facility_images (facility_id, image_url, alt_text, display_order, is_featured, file_size) VALUES
-- Facility 1 - Drammen Svømmehall
(1, '/Bilder/drammensbadet_71.jpg', 'Drammen Svømmehall - hovedbasseng', 1, true, 850000),
(1, '/Bilder/Ankerskogen_svoemmehall1.jpg', 'Drammen Svømmehall - bassengområde', 2, false, 720000),
(1, '/Bilder/Elverum_svømmehall.jpg', 'Drammen Svømmehall - fasiliteter', 3, false, 680000),

-- Facility 2 - Marienlyst Svømmehall
(2, '/Bilder/standard_compressed_drammensbadet_71.jpg', 'Marienlyst Svømmehall - hovedinngang', 1, true, 920000),
(2, '/Bilder/Ankerskogen_svoemmehall1.jpg', 'Marienlyst Svømmehall - bassengområde', 2, false, 750000),

-- Facility 3 - Konnerud Idrettshall
(3, '/Bilder/Nesøya_skole_og_idrettshall_Asker.jpg', 'Konnerud Idrettshall - hovedhall', 1, true, 1100000),
(3, '/Bilder/askollen-bss.jpg', 'Konnerud Idrettshall - innendørs anlegg', 2, false, 890000),
(3, '/Bilder/TVS-sommerbilde.jpg', 'Konnerud Idrettshall - uteområde', 3, false, 650000),

-- Facility 4 - Åssiden Idrettshall
(4, '/Bilder/Nesøya_skole_og_idrettshall_Asker.jpg', 'Åssiden Idrettshall - hovedhall', 1, true, 980000),
(4, '/Bilder/TD-Akersbakken12-web-08.jpg', 'Åssiden Idrettshall - fasiliteter', 2, false, 780000),

-- Facility 5 - Gulskogen Stadion
(5, '/Bilder/standard_compressed_29499777186_556d450e6b_5k.jpg', 'Gulskogen Stadion - hovedarena', 1, true, 1250000),
(5, '/Bilder/TVS-sommerbilde.jpg', 'Gulskogen Stadion - oversikt', 2, false, 900000),
(5, '/Bilder/78251xfq.jpg', 'Gulskogen Stadion - tribuner', 3, false, 850000),

-- Facility 6 - Drammen Kunstisbane
(6, '/Bilder/images (1).jpg', 'Drammen Kunstisbane - hovedbane', 1, true, 820000),
(6, '/Bilder/images (2).jpg', 'Drammen Kunstisbane - publikumsområde', 2, false, 750000),

-- Facility 7 - Union Scene
(7, '/Bilder/standard_compressed_Kulturhuset_1200px.jpg', 'Union Scene - hovedscene', 1, true, 1150000),
(7, '/Bilder/standard_compressed_Helsingborgs_konserthus_1000px.jpg', 'Union Scene - konsertsal', 2, false, 980000),
(7, '/Bilder/Orgue_Auditorium_de_Lyon_11.jpg', 'Union Scene - auditorium', 3, false, 1050000),

-- Facility 8 - Drammens Teater
(8, '/Bilder/GoldenStateBuilding1949-Auditorium.jpg', 'Drammens Teater - hovedscene', 1, true, 1200000),
(8, '/Bilder/standard_compressed_Kulturhuset_1200px.jpg', 'Drammens Teater - foajé', 2, false, 900000),

-- Facility 9 - Bragernes Torg
(9, '/Bilder/standard_compressed_Bryggen__Bergen3.jpg', 'Bragernes Torg - torgområde', 1, true, 1300000),
(9, '/Bilder/standard_compressed_Portalbygget.jpg', 'Bragernes Torg - historiske bygninger', 2, false, 1100000),

-- Facility 10 - Papirbredden Datatorg
(10, '/Bilder/free-photo-of-kontor-design-rom-stoler.jpeg', 'Papirbredden Datatorg - arbeidsområde', 1, true, 750000),
(10, '/Bilder/Internetstiftelsens_kontor_Hammarby_kaj.png', 'Papirbredden Datatorg - kontorlokaler', 2, false, 680000),
(10, '/Bilder/Rheinauhafen_-_Kontor_19_(1834-36).jpg', 'Papirbredden Datatorg - møterom', 3, false, 720000);
