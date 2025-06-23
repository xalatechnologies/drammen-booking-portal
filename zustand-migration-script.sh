#!/bin/bash

# Create directory structure
echo "Creating directory structure..."
mkdir -p src/stores/api src/hooks src/middleware src/dal src/types src/utils

# Move middleware
echo "Moving middleware..."
cp -r src/zustand-only/middleware/* src/middleware/

# Move types
echo "Moving types..."
cp -r src/zustand-only/types/* src/types/

# Move DAL if it exists
if [ -d "src/zustand-only/dal" ]; then
  echo "Moving DAL..."
  cp -r src/zustand-only/dal/* src/dal/
fi

# Move store implementations
echo "Moving store implementations..."
cp -r src/zustand-only/stores/* src/stores/

# Move hooks
echo "Moving hooks..."
cp -r src/zustand-only/hooks/* src/hooks/

# Move utils if they exist
if [ -d "src/zustand-only/utils" ]; then
  echo "Moving utils..."
  cp -r src/zustand-only/utils/* src/utils/
fi

# Create BaseRepository.ts if it doesn't exist
if [ ! -f "src/dal/BaseRepository.ts" ]; then
  echo "Creating BaseRepository.ts..."
  cat > src/dal/BaseRepository.ts << EOL
import { supabase } from '@/lib/supabaseClient';
import { BaseEntity } from '@/types/entity';

/**
 * BaseRepository provides a generic data access layer for Supabase tables
 * @template T The entity type
 */
export class BaseRepository<T extends BaseEntity> {
  private tableName: string;

  /**
   * Create a new repository for a specific table
   * @param tableName The name of the table in Supabase
   */
  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Get all records from the table
   * @returns Promise with array of records
   */
  async getAll(): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*');

    if (error) {
      throw error;
    }

    return data as T[];
  }

  /**
   * Get a record by ID
   * @param id The ID of the record
   * @returns Promise with the record
   */
  async getById(id: string): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as T;
  }

  /**
   * Create a new record
   * @param entity The entity to create
   * @returns Promise with the created entity
   */
  async create(entity: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([entity])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as T;
  }

  /**
   * Update a record
   * @param id The ID of the record to update
   * @param entity The updated entity data
   * @returns Promise with the updated entity
   */
  async update(id: string, entity: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(entity)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as T;
  }

  /**
   * Delete a record
   * @param id The ID of the record to delete
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  /**
   * Query records with filters
   * @param filters Object with column-value pairs to filter by
   * @returns Promise with array of matching records
   */
  async query(filters: Record<string, any>): Promise<T[]> {
    let query = supabase
      .from(this.tableName)
      .select('*');

    // Apply all filters
    Object.entries(filters).forEach(([column, value]) => {
      query = query.eq(column, value);
    });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data as T[];
  }
}
EOL
fi

# Update tsconfig.json to add path aliases
echo "Updating tsconfig.json..."
node -e "
const fs = require('fs');
const path = require('path');
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

// Add or update paths
if (!tsconfig.compilerOptions.paths) {
  tsconfig.compilerOptions.paths = {};
}

// Add new paths
const pathsToAdd = {
  '@/stores/*': ['src/stores/*'],
  '@/hooks/*': ['src/hooks/*'],
  '@/middleware/*': ['src/middleware/*'],
  '@/dal/*': ['src/dal/*'],
  '@/types/*': ['src/types/*'],
  '@/utils/*': ['src/utils/*'],
  '@/legacy/*': ['src/legacy/*']
};

// Merge with existing paths
tsconfig.compilerOptions.paths = { ...tsconfig.compilerOptions.paths, ...pathsToAdd };

// Write back to file
fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
console.log('Updated tsconfig.json with new path aliases');
"

# Create a script to update imports
echo "Creating import update script..."
cat > update-imports.js << EOL
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}', { ignore: ['src/zustand-only/**', 'src/legacy/**'] });

// Pattern to match imports from zustand-only
const importPattern = /@\/zustand-only\/([^'"]*)(['"])/g;

// Process each file
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const newContent = content.replace(importPattern, '@/$1$2');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(\`Updated imports in \${file}\`);
  }
});

console.log('Import paths updated successfully');
EOL

echo "Migration complete. You may need to install glob package and run 'node update-imports.js' to update import paths."
echo "Remember to update any component imports manually as you migrate them."
