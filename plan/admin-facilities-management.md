# Admin Facilities Management - Implementation Plan

## Overview
Restructure and enhance the admin facilities management feature to ensure proper UI structure, remove all mock data, and fully integrate with Supabase via repository, state, and service layers.

## Phase 1: Architecture Assessment & Planning ✅

### Current State Analysis
- [x] Repository pattern is implemented with `BaseRepository` and `SupabaseRepository`
- [x] Service layer exists with `FacilityService` and `SupabaseFacilityService`
- [x] Supabase edge functions are operational (`supabase/functions/facilities/`)
- [x] Basic UI components exist in `src/components/admin/facilities/`
- [x] Form validation with Zod schemas
- [x] React Query for data fetching
- [x] Role-based access control

### Identified Issues
- [ ] Mock data exists in `src/data/coreFacilities.ts`
- [ ] Zustand state management not fully integrated
- [ ] UI components need better structure and reusability
- [ ] Inconsistent error handling across components
- [ ] Missing loading states and optimistic updates

## Phase 2: Mock Data Removal

### Files to Clean
- [ ] Remove `src/data/coreFacilities.ts`
- [ ] Remove `src/data/facilities/` directory and all mock files
- [ ] Audit components for hardcoded facility data
- [ ] Remove any seed data or development-only mock implementations

### Data Transition
- [ ] Ensure all facility data comes from Supabase
- [ ] Verify edge functions return proper data structure
- [ ] Test facility CRUD operations with real database
- [ ] Validate data transformation in `SupabaseFacilityService`

## Phase 3: State Management Integration

### Zustand Store Enhancement
- [ ] Create or enhance `useFacilityAdminStore.ts`
  - [ ] Facility list state with pagination
  - [ ] Current facility selection
  - [ ] Form state management
  - [ ] Filter and search state
  - [ ] Loading and error states
  - [ ] CRUD operation states

### Store Structure
```typescript
interface FacilityAdminState {
  // Data state
  facilities: Facility[];
  currentFacility: Facility | null;
  totalCount: number;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  filters: FacilityFilters;
  pagination: PaginationParams;
  viewMode: 'table' | 'grid' | 'list' | 'map';
  
  // Form state
  isFormOpen: boolean;
  formMode: 'create' | 'edit' | 'view';
  
  // Actions
  loadFacilities: (filters?: FacilityFilters) => Promise<void>;
  createFacility: (data: Partial<Facility>) => Promise<void>;
  updateFacility: (id: string, data: Partial<Facility>) => Promise<void>;
  deleteFacility: (id: string) => Promise<void>;
  setCurrentFacility: (facility: Facility | null) => void;
  setFilters: (filters: Partial<FacilityFilters>) => void;
  setPagination: (pagination: Partial<PaginationParams>) => void;
  setViewMode: (mode: ViewMode) => void;
  openForm: (mode: FormMode, facility?: Facility) => void;
  closeForm: () => void;
  clearError: () => void;
}
```

### Integration Tasks
- [ ] Connect `FacilityListView` to Zustand store
- [ ] Replace React Query with Zustand where appropriate
- [ ] Implement optimistic updates for better UX
- [ ] Add proper error state management
- [ ] Implement auto-refresh and cache invalidation

## Phase 4: UI Structure Enhancement

### Component Refactoring
- [ ] **FacilityListView.tsx**
  - [ ] Simplify component by extracting logic to Zustand
  - [ ] Improve loading and error states
  - [ ] Better responsive design
  - [ ] Add skeleton loading states

- [ ] **Enhanced Facility Form**
  - [ ] Break down large form into smaller components
  - [ ] Improve validation feedback
  - [ ] Add auto-save functionality
  - [ ] Better step navigation
  - [ ] Optimize performance with form chunks

### New Shared Components
- [ ] **FacilityCard** - Reusable facility card component
- [ ] **FacilityTable** - Enhanced table with sorting/filtering
- [ ] **FacilityFilters** - Comprehensive filter component
- [ ] **FacilitySearch** - Advanced search with autocomplete
- [ ] **FacilityActions** - Consistent action buttons
- [ ] **FacilityStatus** - Status indicator component

### Layout Improvements
- [ ] Consistent spacing and typography
- [ ] Better mobile responsiveness
- [ ] Improved accessibility (ARIA labels, keyboard navigation)
- [ ] Dark mode support
- [ ] Print-friendly layouts

## Phase 5: Repository & Service Integration

### Repository Layer
- [ ] Ensure all operations go through `FacilityRepository`
- [ ] Implement proper error handling in repositories
- [ ] Add logging for debugging
- [ ] Optimize database queries
- [ ] Add caching strategies

### Service Layer
- [ ] Enhance `SupabaseFacilityService` with better error handling
- [ ] Add retry logic for failed requests
- [ ] Implement request deduplication
- [ ] Add performance monitoring
- [ ] Optimize data transformation

### Edge Functions
- [ ] Add request validation
- [ ] Implement rate limiting
- [ ] Add comprehensive logging
- [ ] Optimize query performance
- [ ] Add response caching headers

## Phase 6: Advanced Features

### Search & Filtering
- [ ] Advanced text search across all facility fields
- [ ] Geolocation-based filtering
- [ ] Multi-select filters for amenities/equipment
- [ ] Saved filter presets
- [ ] Export filtered results

### Batch Operations
- [ ] Bulk edit facilities
- [ ] Bulk status changes
- [ ] Import facilities from CSV
- [ ] Export facilities to various formats

### Analytics Integration
- [ ] Facility utilization metrics
- [ ] Revenue tracking
- [ ] Popular facilities dashboard
- [ ] Capacity planning tools

## Phase 7: Testing & Quality Assurance

### Unit Tests
- [ ] Repository layer tests
- [ ] Service layer tests
- [ ] Zustand store tests
- [ ] Component unit tests

### Integration Tests
- [ ] End-to-end facility CRUD operations
- [ ] Filter and search functionality
- [ ] Form validation and submission
- [ ] Error handling scenarios

### Performance Testing
- [ ] Large dataset rendering
- [ ] Search performance
- [ ] Form submission speed
- [ ] Mobile performance

## Phase 8: Documentation & Deployment

### Documentation
- [ ] Component documentation with Storybook
- [ ] API documentation for services
- [ ] User guide for facility management
- [ ] Developer guide for extending functionality

### Deployment Checklist
- [ ] Environment configuration
- [ ] Database migrations
- [ ] Edge function deployment
- [ ] Performance monitoring setup
- [ ] Error tracking configuration

## Success Criteria

### Technical Requirements
- [ ] Zero mock data in production code
- [ ] All operations use repository/service pattern
- [ ] Zustand state management fully integrated
- [ ] Sub-200ms response times for common operations
- [ ] 100% TypeScript coverage
- [ ] 90%+ test coverage

### User Experience Requirements
- [ ] Intuitive and responsive UI
- [ ] Fast loading times with skeleton states
- [ ] Comprehensive error handling
- [ ] Offline-friendly where possible
- [ ] Accessible to users with disabilities

### Business Requirements
- [ ] Support for 10,000+ facilities
- [ ] Role-based access control
- [ ] Audit trail for all changes
- [ ] Data export capabilities
- [ ] Integration with booking system

## Timeline Estimate
- **Phase 1-2**: 2-3 days (Assessment & Mock data removal)
- **Phase 3**: 3-4 days (State management integration)
- **Phase 4**: 5-7 days (UI enhancement)
- **Phase 5**: 2-3 days (Repository/Service optimization)
- **Phase 6**: 4-5 days (Advanced features)
- **Phase 7**: 3-4 days (Testing)
- **Phase 8**: 1-2 days (Documentation & deployment)

**Total Estimated Time**: 20-28 days

## Risk Mitigation
- Incremental development with regular testing
- Backup current functionality before major changes
- Comprehensive error handling and logging
- Progressive rollout with feature flags
- Regular code reviews and pair programming 