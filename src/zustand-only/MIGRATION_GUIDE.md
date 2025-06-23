# Migration Guide: Moving to Zustand-Only Architecture

This guide explains how to migrate from the current repository/DAL/Zustand pattern to a Zustand-only architecture where all interactions with the database happen via Zustand stores.

## Overview

The new architecture eliminates the need for separate repository and DAL layers by integrating database operations directly into Zustand stores. This simplifies the codebase and reduces the number of abstractions.

## Migration Approaches

We provide two migration approaches:

1. **Gradual Migration**: Using `createRepositoryStore.ts` as a bridge between existing repositories and Zustand
2. **Direct Migration**: Using `createDirectStore.ts` for a pure Zustand approach with direct Supabase access

## Migration Steps

### Step 1: Choose a Migration Approach

#### Approach 1: Gradual Migration (Repository Bridge)

This approach allows you to keep using existing repositories while transitioning to a Zustand-only architecture:

1. Create a Zustand store that wraps an existing repository:

```typescript
import { createRepositoryStore } from '@/zustand-only/stores/createRepositoryStore';
import { FacilityRepository } from '@/repositories/FacilityRepository';

// Create repository instance
const facilityRepository = new FacilityRepository();

// Create and export the store
export const useFacilityStore = createRepositoryStore(facilityRepository);
```

2. Update components to use the store instead of repositories:

```typescript
// Before
const facilityRepository = new FacilityRepository();
const [facilities, setFacilities] = useState([]);

useEffect(() => {
  const loadFacilities = async () => {
    const response = await facilityRepository.findAll();
    if (response.data) {
      setFacilities(response.data);
    }
  };
  loadFacilities();
}, []);

// After
const { items: facilities, isLoading, error } = useFacilityStore();

useEffect(() => {
  useFacilityStore.getState().fetchList();
}, []);
```

#### Approach 2: Direct Migration (Pure Zustand)

This approach bypasses repositories entirely and interacts directly with Supabase:

1. Create a direct Zustand store:

```typescript
import { createDirectStore } from '@/zustand-only/stores/createDirectStore';

// Create and export the store
export const useFacilityStore = createDirectStore('facilities', {
  related: ['zones', 'opening_hours'],
  statusField: 'status',
  activeValue: 'active'
});
```

2. Update components to use the store:

```typescript
// Before
const facilityRepository = new FacilityRepository();
const [facilities, setFacilities] = useState([]);

useEffect(() => {
  const loadFacilities = async () => {
    const response = await facilityRepository.findAll();
    if (response.data) {
      setFacilities(response.data);
    }
  };
  loadFacilities();
}, []);

// After
const { items: facilities, isLoading, error } = useFacilityStore();

useEffect(() => {
  useFacilityStore.getState().fetchList();
}, []);
```

### Step 2: Use the Generic Entity Hook

For a more consistent interface across components, use the `useEntity` hook:

```typescript
import { useEntity } from '@/zustand-only/hooks/useEntity';
import { useFacilityStore } from '@/zustand-only/stores/useFacilityStore';
import { Facility } from '@/types/facility';

function FacilityList() {
  const {
    entities: facilities,
    isLoading,
    error,
    loadEntities,
    changePage
  } = useEntity<Facility>(useFacilityStore);
  
  // Now you can use these methods consistently across components
}
```

### Step 3: Update Component Imports

Update your component imports to reference the new stores and hooks:

```typescript
// Before
import { useBookingStore } from '@/stores/useBookingStore';

// After
import { useBookingStore } from '@/zustand-only/stores/useBookingStore';
```

### Step 4: Maintain Localization

Continue using the translation system with the new Zustand-based translation hook:

```typescript
import { useTranslation } from '@/zustand-only/hooks/useTranslation';

function MyComponent() {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('facilities.title')}</h1>
      <p>{t('facilities.description')}</p>
    </div>
  );
}
```

## Best Practices

1. **Always use the store through hooks**: Access stores through hooks rather than direct imports for better React integration.

2. **Keep state normalized**: Avoid duplicating data across different stores.

3. **Use selectors for derived state**: When you need computed values based on store state, use selectors.

4. **Separate UI state from data state**: Consider having separate stores for UI state and data state.

5. **Use middleware for side effects**: For complex operations, consider using middleware like `immer` for immutable updates.

## Example: Converting a Component

### Before (Repository + DAL + Zustand)

```typescript
import React, { useEffect, useState } from 'react';
import { FacilityRepository } from '@/repositories/FacilityRepository';
import { useTranslation } from '@/hooks/useTranslation';

export function FacilityList() {
  const { t } = useTranslation();
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadFacilities = async () => {
      setIsLoading(true);
      setError(null);
      
      const repository = new FacilityRepository();
      const response = await repository.findAll();
      
      if (response.data) {
        setFacilities(response.data);
      } else {
        setError(response.error || 'Failed to load facilities');
      }
      
      setIsLoading(false);
    };
    
    loadFacilities();
  }, []);
  
  return (
    <div>
      <h1>{t('facilities.title')}</h1>
      
      {isLoading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{error}</p>}
      
      <ul>
        {facilities.map(facility => (
          <li key={facility.id}>{facility.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### After (Zustand-Only)

```typescript
import React, { useEffect } from 'react';
import { useEntity } from '@/zustand-only/hooks/useEntity';
import { useFacilityStore } from '@/zustand-only/stores/useFacilityStore';
import { useTranslation } from '@/zustand-only/hooks/useTranslation';
import { Facility } from '@/types/facility';

export function FacilityList() {
  const { t } = useTranslation();
  const {
    entities: facilities,
    isLoading,
    error,
    loadEntities
  } = useEntity<Facility>(useFacilityStore);
  
  useEffect(() => {
    loadEntities();
  }, [loadEntities]);
  
  return (
    <div>
      <h1>{t('facilities.title')}</h1>
      
      {isLoading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{error}</p>}
      
      <ul>
        {facilities.map(facility => (
          <li key={facility.id}>{facility.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Conclusion

This migration simplifies the architecture by eliminating the repository and DAL layers, making all database interactions happen via Zustand stores. This approach reduces boilerplate code and makes the codebase more maintainable while still adhering to the principle that all DB interactions should happen via stores.
