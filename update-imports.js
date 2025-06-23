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
  const newContent = content.replace(importPattern, '@/');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated imports in ${file}`);
  }
});

console.log('Import paths updated successfully');
