# Zustand-Only Architecture

This directory contains a refactored architecture that uses Zustand as the primary state management solution, eliminating the need for separate repository and DAL layers. All database interactions happen via Zustand stores, making the codebase more maintainable and reducing the number of abstractions.

## Core Principles

1. **Single Source of Truth**: All state is managed by Zustand stores
2. **Separation of Concerns**: 
   - Stores handle data fetching and state management
   - Hooks add business logic and derived state
   - Components are purely presentational
3. **Type Safety**: Comprehensive TypeScript types for all entities
4. **Localization Support**: Built-in translation system
5. **Consistent API**: Generic interfaces for all entity operations

## Directory Structure

```
src/zustand-only/
├── components/       # UI components
│   ├── ui/           # Reusable UI components
│   ├── location/     # Location-specific components
│   └── ...           # Other domain-specific components
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── stores/           # Zustand stores
│   ├── api/          # API adapters for stores
│   └── ...           # Store implementations
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Key Components

### Generic Store Creator

The `createGenericStore.ts` file provides a factory function to create Zustand stores for any entity type. It accepts an API adapter that implements a standard interface for CRUD operations.

```typescript
// Example usage
const bookingApi = new BookingApi();
export const useBookingStore = createGenericStore<
  Booking, 
  BookingFilter, 
  BookingCreateInput, 
  BookingUpdateInput
>(bookingApi);
```

### Repository Bridge

The `createRepositoryStore.ts` file provides a bridge between the existing repository pattern and Zustand, allowing for a gradual migration.

```typescript
// Example usage
const facilityRepository = new FacilityRepository();
export const useFacilityStore = createRepositoryStore(facilityRepository);
```

### Direct Store

The `createDirectStore.ts` file provides a direct connection to Supabase, bypassing the repository layer entirely.

```typescript
// Example usage
export const useLocationStore = createDirectStore('locations', {
  related: ['zones'],
  statusField: 'status'
});
```

### Generic Entity Hook

The `useEntity.ts` hook provides a consistent interface for working with any entity type, regardless of the underlying store implementation.

```typescript
// Example usage
const {
  entities: locations,
  isLoading,
  error,
  loadEntities,
  createEntity,
  updateEntity,
  removeEntity
} = useEntity<Location>(useLocationStore);
```

### Domain-Specific Hooks

Domain-specific hooks like `useLocation.ts` and `useBooking.ts` add business logic and derived state on top of the generic entity hook.

```typescript
// Example usage
const {
  locations,
  isLoading,
  getLocalizedName,
  searchLocations,
  locationsByAddress
} = useLocation();
```

## Models and Types

The `models.ts` file contains comprehensive TypeScript types for all entities in the system, based on the backend models. This ensures type safety throughout the application.

## Localization

The `useTranslationStore.ts` and `useTranslation.ts` files provide a Zustand-based translation system that supports multiple languages.

```typescript
// Example usage
const { t, currentLanguage, changeLanguage } = useTranslation();
console.log(t('common.loading')); // "Loading..." or "Laster..." depending on language
```

## Migration Guide

See the [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) file for detailed instructions on how to migrate from the current architecture to the Zustand-only approach.

## Best Practices

1. **Always use hooks**: Access stores through hooks rather than direct imports for better React integration.
2. **Keep state normalized**: Avoid duplicating data across different stores.
3. **Use selectors for derived state**: When you need computed values based on store state, use selectors.
4. **Separate UI state from data state**: Consider having separate stores for UI state and data state.
5. **Use middleware for side effects**: For complex operations, consider using middleware like `immer` for immutable updates.
6. **Always include localization**: All user-facing text should use the translation system.

## Example Components

The `components/` directory contains example components that demonstrate how to use the Zustand-only architecture in practice.

## API Adapters

The `stores/api/` directory contains API adapters that implement the generic API interface for different entity types. These adapters handle the actual data fetching and manipulation.

## Authentication and User Management

The `useUserStore.ts` file provides a comprehensive solution for authentication and user management, integrating with Supabase Auth.

```typescript
// Example usage
const { 
  currentUser, 
  isAuthenticated, 
  login, 
  logout, 
  hasRole 
} = useUser();
```

## Cart Management

The `useCartStore.ts` file provides a complete solution for shopping cart management, including adding items, updating quantities, and checkout.

```typescript
// Example usage
const { 
  items, 
  addToCart, 
  updateQuantity, 
  checkout 
} = useCart();
```
