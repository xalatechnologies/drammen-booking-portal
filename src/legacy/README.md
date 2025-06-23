# Legacy Implementation

This directory contains the original implementation of the Drammen Booking Portal before migrating to the Zustand-only architecture.

The code is preserved here for reference and backward compatibility during the transition period.

## Structure

- `services/`: Original service implementations
- `stores/`: Original store implementations
- `hooks/`: Original custom hooks
- `types/`: Original type definitions
- `components/`: Components that are specifically tied to the legacy implementation

## Migration

When migrating components from the legacy implementation to the new architecture:

1. Check if there's an equivalent in the new architecture
2. Update imports to use the new paths
3. Adapt component to use the new stores and hooks
4. Test thoroughly before removing the legacy component

## Deprecation

This code is considered deprecated and will be removed once the migration is complete.
