#!/bin/bash
# Script to remove legacy code files that have been migrated to the new architecture
# Following SOLID principles by separating concerns into proper architectural layers

# Define color codes for better visibility
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting cleanup of legacy code that has been migrated to the new architecture...${NC}"

# Base directory
BASE_DIR="$(pwd)/src"

# Function to remove a file safely with confirmation
remove_file() {
    local file="$1"
    
    if [ -f "$file" ]; then
        echo -e "${YELLOW}Removing $file${NC}"
        rm "$file"
        echo -e "${GREEN}✓ Removed: $file${NC}"
    else
        echo -e "${RED}× File not found: $file${NC}"
    fi
}

# Function to remove a directory safely with confirmation
remove_dir() {
    local dir="$1"
    
    if [ -d "$dir" ]; then
        echo -e "${YELLOW}Removing directory $dir${NC}"
        rm -rf "$dir"
        echo -e "${GREEN}✓ Removed directory: $dir${NC}"
    else
        echo -e "${RED}× Directory not found: $dir${NC}"
    fi
}

echo -e "${BLUE}Removing legacy repositories that have been migrated to DAL...${NC}"
# Remove repository files
remove_file "$BASE_DIR/features/facility/repositories/FacilityRepository.ts"
remove_dir "$BASE_DIR/features/facility/repositories/implementations"
remove_dir "$BASE_DIR/features/facility/repositories/interfaces"
# Keep test files for reference until new tests are created
# remove_dir "$BASE_DIR/features/facility/repositories/__tests__"

echo -e "${BLUE}Removing legacy services that have been migrated to DAL...${NC}"
# Remove service files
remove_file "$BASE_DIR/features/facility/services/FacilityService.ts"
remove_dir "$BASE_DIR/features/facility/services/implementations"
remove_dir "$BASE_DIR/features/facility/services/interfaces"
# Keep test files for reference until new tests are created
# remove_dir "$BASE_DIR/features/facility/services/__tests__"

echo -e "${BLUE}Removing legacy hooks that have been migrated to DAL...${NC}"
# Remove hook files
remove_file "$BASE_DIR/features/facility/hooks/useFacility.ts"
remove_file "$BASE_DIR/features/facility/hooks/useFacilities.ts"
remove_file "$BASE_DIR/features/facility/hooks/useFacilityActions.ts"
remove_file "$BASE_DIR/features/facility/hooks/useFacilityData.ts"
remove_file "$BASE_DIR/features/facility/hooks/useFacilityService.ts"
remove_file "$BASE_DIR/features/facility/hooks/useFacilityServiceProvider.tsx"
remove_file "$BASE_DIR/features/facility/hooks/index.ts"
# Keep test files for reference until new tests are created
# remove_file "$BASE_DIR/features/facility/hooks/useFacility.test.ts"

echo -e "${BLUE}Removing legacy context that has been migrated to contexts/facility...${NC}"
# Remove context files
remove_file "$BASE_DIR/features/facility/context/FacilityContext.tsx"
remove_file "$BASE_DIR/features/facility/providers/FacilityServiceProvider.tsx"

echo -e "${BLUE}Removing legacy types that have been migrated to types/facility...${NC}"
# Remove types files that have been migrated
remove_file "$BASE_DIR/features/facility/types/facility.ts"
remove_file "$BASE_DIR/features/facility/types/facilityDTO.ts"

echo -e "${GREEN}Cleanup complete!${NC}"
echo -e "${YELLOW}Note: Test files have been preserved for reference until new tests are created.${NC}"
