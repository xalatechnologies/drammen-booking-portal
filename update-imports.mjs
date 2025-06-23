import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find all TypeScript files
const files = await glob('src/**/*.{ts,tsx}', { ignore: ['src/zustand-only/**', 'src/legacy/**'] });

// Pattern to match imports from zustand-only
const importPattern = /@\/zustand-only\/([^'"]*)(['"])/g;

// Process each file
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const newContent = content.replace(importPattern, '@/$1$2');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated imports in ${file}`);
  }
}

console.log('Import paths updated successfully');
