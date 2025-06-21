
-- Add area_sqm field to facilities table
ALTER TABLE facilities ADD COLUMN area_sqm numeric;

-- Add comment for clarity
COMMENT ON COLUMN facilities.area_sqm IS 'Area in square meters of the facility';

-- Update existing facilities with some default values if needed
-- (You can adjust these or leave them NULL)
UPDATE facilities SET area_sqm = 100 WHERE area_sqm IS NULL AND type = 'meeting_room';
UPDATE facilities SET area_sqm = 500 WHERE area_sqm IS NULL AND type = 'sports_hall';
UPDATE facilities SET area_sqm = 200 WHERE area_sqm IS NULL AND type = 'classroom';
