
-- First, let's see what images exist in the database
SELECT facility_id, image_url, is_featured, display_order 
FROM facility_images 
ORDER BY facility_id, display_order;

-- Add images for any facilities that might be missing them
-- Facility 4 - Marienlyst Stadion - Møtesal (meeting room)
INSERT INTO facility_images (facility_id, image_url, alt_text, display_order, is_featured, file_size) VALUES
(4, '/Bilder/free-photo-of-kontor-design-rom-stoler.jpeg', 'Marienlyst Stadion - møtesal', 1, true, 750000),
(4, '/Bilder/Rheinauhafen_-_Kontor_19_(1834-36).jpg', 'Marienlyst Stadion - møtefasiliteter', 2, false, 720000)
ON CONFLICT DO NOTHING;

-- Facility 8 - Papirbredden Kultursenter (cultural center)
INSERT INTO facility_images (facility_id, image_url, alt_text, display_order, is_featured, file_size) VALUES
(8, '/Bilder/standard_compressed_Kulturhuset_1200px.jpg', 'Papirbredden Kultursenter - hovedscene', 1, true, 1150000),
(8, '/Bilder/standard_compressed_Helsingborgs_konserthus_1000px.jpg', 'Papirbredden Kultursenter - konsertsal', 2, false, 980000)
ON CONFLICT DO NOTHING;

-- Facility 10 - Tangen Skole - Klasserom (classroom)
INSERT INTO facility_images (facility_id, image_url, alt_text, display_order, is_featured, file_size) VALUES
(10, '/Bilder/free-photo-of-kontor-design-rom-stoler.jpeg', 'Tangen Skole - klasserom', 1, true, 750000),
(10, '/Bilder/Internetstiftelsens_kontor_Hammarby_kaj.png', 'Tangen Skole - undervisningsrom', 2, false, 680000)
ON CONFLICT DO NOTHING;
