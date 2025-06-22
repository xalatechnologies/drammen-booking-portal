#!/bin/bash
# Script to clean up redundant repository and service files while preserving React components

# Define color codes for better visibility
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting targeted cleanup of redundant repository and service files...${NC}"
echo -e "${GREEN}NOTE: All React components will be preserved${NC}"

# Base directory
BASE_DIR="$(pwd)/src"

# Function to rename a file (move to .bak extension)
backup_file() {
    local file="$1"
    
    if [ -f "$file" ]; then
        echo -e "${YELLOW}Backing up $file to $file.bak${NC}"
        mv "$file" "$file.bak"
        echo -e "${GREEN}✓ Backed up: $file${NC}"
    else
        echo -e "${RED}× File not found: $file${NC}"
    fi
}

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

echo -e "${BLUE}Cleaning up duplicate FacilityRepository files...${NC}"

# We will keep dal/repositories/implementations/FacilityRepositoryImpl.ts as the main implementation
# and back up the duplicate in case we need to reference it later

# Back up duplicate facility repository implementation
if [ -f "$BASE_DIR/dal/repositories/implementations/FacilityRepository.ts" ]; then
    backup_file "$BASE_DIR/dal/repositories/implementations/FacilityRepository.ts"
fi

# Clean up any duplicated repository service files in services directory that have been moved to DAL
echo -e "${BLUE}Checking for duplicated service files in services directory...${NC}"

# We'll back these up rather than delete them outright
if [ -f "$BASE_DIR/services/FacilityService.ts" ]; then
    backup_file "$BASE_DIR/services/FacilityService.ts"
fi

if [ -f "$BASE_DIR/services/implementation/facility/FacilityService.ts" ]; then
    backup_file "$BASE_DIR/services/implementation/facility/FacilityService.ts"
fi

# Check for duplicate interface files
if [ -f "$BASE_DIR/services/interfaces/IFacilityService.ts" ] && [ -f "$BASE_DIR/dal/services/interfaces/IFacilityService.ts" ]; then
    echo -e "${YELLOW}Duplicate IFacilityService interfaces found - backing up the one in services directory${NC}"
    backup_file "$BASE_DIR/services/interfaces/IFacilityService.ts"
fi

echo -e "${GREEN}Cleanup complete!${NC}"
echo -e "${YELLOW}Note: Files have been backed up with .bak extension rather than deleted.${NC}"
echo -e "${YELLOW}This allows you to review them before permanent removal if needed.${NC}"
echo -e "${GREEN}All React components in feature directories have been preserved.${NC}"
