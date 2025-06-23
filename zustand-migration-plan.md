# Zustand Architecture Migration Plan

## Directory Structure
```
src/
├── stores/              # All Zustand stores
│   ├── api/             # API adapters for each entity
│   └── createGenericStore.ts
├── hooks/               # Custom hooks that use stores
├── middleware/          # Zustand middleware (logger, analytics, performance)
├── dal/                 # Data Access Layer
│   └── BaseRepository.ts
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Migration Steps

1. **Create Directory Structure**
   - Create all necessary directories in the main src folder

2. **Move Core Files**
   - Move middleware implementations
   - Move type definitions
   - Move DAL implementation

3. **Move Store Implementation**
   - Move API adapters
   - Move store creators and implementations
   - Update imports to reflect new paths

4. **Move Custom Hooks**
   - Move hooks that wrap stores
   - Update imports to reflect new paths

5. **Update tsconfig.json**
   - Add path aliases for the new structure

6. **Update Component Imports**
   - Gradually update components to use the new architecture
   - Test each component after migration

## Import Path Updates

Old paths like:
```typescript
import { useActorStore } from '@/zustand-only/stores/useActorStore';
```

Will become:
```typescript
import { useActorStore } from '@/stores/useActorStore';
```

## Aliases to Add to tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@/stores/*": ["src/stores/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/middleware/*": ["src/middleware/*"],
      "@/dal/*": ["src/dal/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"],
      "@/legacy/*": ["src/legacy/*"]
    }
  }
}
```

## Testing Strategy

1. Migrate core infrastructure first
2. Test store functionality independently
3. Migrate and test one component at a time
4. Run comprehensive tests after migration
