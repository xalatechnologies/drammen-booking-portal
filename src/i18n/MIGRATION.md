# Translation System Migration Guide

This document outlines how to migrate from the database-driven translation system to the new JSON-based translation system.

## Overview

The new translation system uses JSON files stored in the codebase instead of database entries. This approach offers several advantages:

- Better version control for translations
- Easier to manage and review changes
- No database queries needed for translations
- Improved performance
- Support for nested translation structures

## Directory Structure

```
src/i18n/
├── locales/
│   ├── no/
│   │   ├── admin.json
│   │   └── public.json (to be added)
│   └── en/
│       ├── admin.json
│       └── public.json (to be added)
├── JsonTranslationService.ts
└── types.ts
```

## How to Migrate a Component

1. Import the new translation hook:

```tsx
// Old import
import { useTranslation } from '@/hooks/useTranslation';

// New import
import { useJsonTranslation } from '@/hooks/useJsonTranslation';
```

2. Use the hook in your component:

```tsx
// Old usage
const { tSync } = useTranslation();

// New usage
const { tSync } = useJsonTranslation();
```

3. The translation keys follow a namespace.path.to.key pattern:

```tsx
// Example
tSync('admin.sidebar.overview', 'Overview')
```

## Adding New Translations

1. Identify which namespace the translation belongs to (e.g., 'admin', 'public')
2. Add the translation to the appropriate JSON file in both language folders
3. Use nested objects to organize translations logically

Example:

```json
// src/i18n/locales/no/admin.json
{
  "facilities": {
    "management": "Administrasjon av lokaler",
    "addNew": "Legg til ny Lokal"
  }
}
```

## Gradual Migration Strategy

1. Start with the admin section
2. Migrate one component at a time
3. Test each component after migration
4. Once all components are migrated, remove the old translation service

## Benefits of JSON-based Translations

- **Maintainability**: Easier to manage translations in version control
- **Performance**: No database queries needed for translations
- **Developer Experience**: Better IDE support for finding and updating translations
- **Flexibility**: Support for nested translation structures
- **Offline Support**: Translations available without database connection
