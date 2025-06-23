
-- Add missing facility images for facility 11 - Ytterkollen Idrettshall
INSERT INTO facility_images (facility_id, image_url, alt_text, display_order, is_featured, file_size) VALUES
(11, '/Bilder/Nesøya_skole_og_idrettshall_Asker.jpg', 'Ytterkollen Idrettshall - hovedhall', 1, true, 980000),
(11, '/Bilder/askollen-bss.jpg', 'Ytterkollen Idrettshall - innendørs anlegg', 2, false, 890000),
(11, '/Bilder/TVS-sommerbilde.jpg', 'Ytterkollen Idrettshall - uteområde', 3, false, 650000);

-- Also add images for facility 12 which seems to be missing
INSERT INTO facility_images (facility_id, image_url, alt_text, display_order, is_featured, file_size) VALUES
(12, '/Bilder/TD-Akersbakken12-web-08.jpg', 'Anlegg 12 - hovedfasiliteter', 1, true, 780000),
(12, '/Bilder/Ankerskogen_svoemmehall1.jpg', 'Anlegg 12 - bassengområde', 2, false, 720000);

-- Let's also check if there are any issues with existing data by verifying facility 1 has images
-- This query will help us see what's in the database
