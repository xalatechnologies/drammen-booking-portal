# Drammen Booking Portal Refactoring Plan

This document outlines the comprehensive refactoring plan for reorganizing the Drammen Booking Portal codebase according to SOLID principles and a feature-based architecture.

## Important Constraints

1. **Preserve Existing UI/UX**: This refactoring must not change any visual or interaction aspects of the application. All styling, layouts, and user flows must remain identical to the current implementation.

2. **Eliminate Static Data**: The current data folder contains hard-coded mock data which should be eliminated in favor of proper data services and APIs.

## Core Principles

1. **Single Responsibility Principle**: Each class should have one reason to change
2. **Open/Closed Principle**: Open for extension, closed for modification
3. **Liskov Substitution Principle**: Subtypes must be substitutable for their base types
4. **Interface Segregation Principle**: Create focused interfaces tailored to client needs
5. **Dependency Inversion Principle**: Depend on abstractions, not concretions

## Current Issues

1. **Inconsistent Structure**: Mix of feature-based and technical-based organization
2. **Direct Dependencies**: Hard dependencies between components rather than interfaces
3. **Mixed Concerns**: Business logic mixed with presentation and data access
4. **Poor Type Safety**: Excessive use of `any` types throughout the codebase
5. **Inheritance Over Composition**: Overuse of inheritance in repositories and services
6. **Static Mock Data**: Hard-coded data in `/data` folder for facilities, services, etc.

## Target Architecture

We will adopt a feature-based architecture with clear separation between the public user interface and the administrative dashboard. Each feature will follow a consistent internal structure adhering to SOLID principles.

```
/src
  /features            # Feature-based organization
  /core                # Core shared functionality
    /data              # Data access and configuration
      /interfaces      # Data service interfaces
      /implementations # Data service implementations
      /seeds           # Database seed files (NOT for runtime use)
  /types               # Shared types
  /ui                  # Shared UI components
  /app                 # Application entry points
```

## Detailed Refactoring Plan

### 1. Repository Pattern & Data Access Layer (DAL)

#### Current Structure
```
/dal
  /interfaces
    /base
    /booking
    /facility
    /user
  /repositories
    /base
    /booking
    /facility
    /services
    /user
```

#### Target Structure
```
/features
  /{feature}
    /data
      /interfaces
        I{Feature}Repository.ts
      /repositories
        {Feature}Repository.ts
      /dtos
        {Feature}DTO.ts
      /mappers
        {Feature}Mapper.ts
```

#### Action Items
- Create feature-based repository interfaces that follow Interface Segregation Principle
- Replace base repositories with composition patterns
- Implement mapping layers for all domain objects
- Use dependency injection for database clients

### 2. Types & Interfaces

#### Current Structure
```
/types
  /booking
  /db
  api.ts
  booking.ts
  facility.ts
  ... (many individual type files)
```

#### Target Structure
```
/features
  /{feature}
    /types
      /domain              # Domain models
      /dtos                # Data transfer objects
      /requests            # Request types
      /responses           # Response types
      /enums               # Feature-specific enums
      /interfaces          # Other interfaces
      index.ts             # Export all types
/types                     # Shared types
  /api
    ServiceResponse.ts
    RepositoryResponse.ts
  /common
    PaginationParams.ts
    SortOptions.ts
```

#### Action Items
- Move domain-specific types into their feature folders
- Create proper separation between domain models and DTOs
- Implement consistent naming conventions
- Ensure type safety by eliminating `any` types

### 3. Services

#### Current Structure
```
/services
  /implementation
    /base
    /booking
    /facility
    /user
  /interfaces
    /base
    /booking
    /facility
    /user
  /booking (legacy)
```

#### Target Structure
```
/features
  /{feature}
    /services
      /interfaces
        I{Feature}Service.ts
      /implementations
        {Feature}Service.ts
      index.ts            # Exports interfaces and default implementation
```

#### Action Items
- Create feature-based service interfaces
- Implement services that depend on repository interfaces
- Use dependency injection for all dependencies
- Eliminate base service classes in favor of composition
- Remove legacy service structures

### 4. Localization

#### Current Structure
```
/i18n
  /hooks
  /translations
/components/localization
/components/translation
/types/localization.ts
/types/translation.ts
```

#### Target Structure
```
/features
  /localization
    /interfaces
      ILocalizationService.ts
    /implementations
      LocalizationService.ts
    /hooks
      useTranslation.ts
      useLocale.ts
    /context
      LocalizationProvider.tsx
    /types
      TranslationKeys.ts
      LocaleConfig.ts
/core
  /localization
    /translations
      en.ts
      no.ts
```

#### Action Items
- Consolidate localization under a single feature
- Create proper interfaces for localization services
- Implement dependency injection for localization
- Standardize naming conventions

### 5. Authentication & Authorization

#### Current Structure
```
/integrations/supabase
/components/auth
```

#### Target Structure
```
/features
  /auth
    /interfaces
      IAuthService.ts
      IAuthRepository.ts
    /implementations
      AuthService.ts
      AuthRepository.ts
    /hooks
      useAuth.ts
      usePermissions.ts
    /context
      AuthProvider.tsx
    /components
      /public        # Login/signup components
      /admin         # Admin-specific auth components
    /guards
      RouteGuard.tsx
      PermissionGuard.tsx
```

#### Action Items
- Separate auth from specific providers (Supabase)
- Create proper interfaces for auth services
- Implement dependency injection for auth services
- Create permission models and role-based access controls

### 6. Integrations

#### Current Structure
```
/integrations
  /supabase
```

#### Target Structure
```
/core
  /integrations
    /database
      /interfaces
        IDatabaseClient.ts
      /implementations
        SupabaseClient.ts
    /storage
      /interfaces
        IStorageClient.ts
      /implementations
        SupabaseStorageClient.ts
    /external-apis
      /interfaces
        IExternalApiClient.ts
      /implementations
        ExampleApiClient.ts
```

#### Action Items
- Create provider-agnostic interfaces for all integrations
- Implement adapter pattern for third-party services
- Use dependency injection for all integration clients
- Create proper error handling for external services

### 7. Hooks & Contexts

#### Current Structure
```
/hooks
/contexts
  /booking
```

#### Target Structure
```
/features
  /{feature}
    /hooks
      use{Feature}Data.ts
      use{Feature}Actions.ts
    /context
      {Feature}Provider.tsx
      {Feature}Context.ts
/core
  /hooks        # Shared utility hooks
    useAsync.ts
    usePrevious.ts
```

#### Action Items
- Move feature-specific hooks into feature folders
- Create shared utility hooks for cross-feature concerns
- Implement context providers that follow dependency injection patterns
- Ensure proper type safety for all hooks and contexts

### 8. Data Management (Current /data folder)

#### Current Structure
```
/data
  /additionalServices
    serviceBundles.ts
    serviceCategories.ts
  /bookings
    bookingHelpers.ts
  /facilities
    culturalFacilities.ts
    meetingFacilities.ts
    sportsFacilities.ts
    swimmingFacilities.ts
  coreFacilities.ts
```

#### Target Structure
```
/database
  /migrations
    20250622000001_create_facilities_table.ts
    20250622000002_create_services_table.ts
    20250622000003_seed_facilities.ts
    20250622000004_seed_services.ts
  /seeds
    facilities.ts
    services.ts
    additionalServices.ts
/features
  /facility
    /services
      /interfaces
        IFacilityDataService.ts
      /implementations
        FacilityDataService.ts
  /additionalService
    /services
      /interfaces
        IServiceDataService.ts
      /implementations
        ServiceDataService.ts
```

#### Action Items
- Convert all static data to database migrations and seed files
- Create proper database schema for facilities, services, and other entities
- Implement Supabase migrations to create tables and seed data
- Create service interfaces and implementations to access data from the database
- Remove all static data files after successful migration
- Add utility scripts for database initialization and seeding
- Document the seeding process for development environments

### 9. Utilities

#### Current Structure
```
/utils (various utility files)
```

#### Target Structure
```
/core
  /utils
    /date
      dateUtils.ts
    /string
      stringUtils.ts
    /validation
      validationUtils.ts
/features
  /{feature}
    /utils          # Feature-specific utilities
```

#### Action Items
- Organize utilities by domain and function
- Create proper interfaces for complex utilities
- Implement proper error handling and type safety
- Move feature-specific utilities into feature folders

### 9. Config

#### Current Structure
```
/config
```

#### Target Structure
```
/core
  /config
    /interfaces
      IConfig.ts
      IEnvironmentConfig.ts
    /implementations
      Config.ts
      DevelopmentConfig.ts
      ProductionConfig.ts
    /providers
      ConfigProvider.tsx
```

#### Action Items
- Implement strategy pattern for environment-based configuration
- Create proper interfaces for configuration
- Use dependency injection for configuration
- Implement proper validation for configuration values

### 10. Components

#### Current Structure
```
/components
  /admin
  /auth
  /booking
  /common
  ... (many component folders)
```

#### Target Structure
```
/ui                      # Shared UI library
  /components            # Base UI components
    /button
    /input
    /modal
  /layouts               # Layout components
    /public
    /admin
    /app
/features
  /{feature}
    /components
      /public            # User-facing components
        Component.tsx
        Component.module.css
      /admin             # Admin-specific components
        AdminComponent.tsx
        AdminComponent.module.css
      /shared            # Shared components
        SharedComponent.tsx
```

#### Action Items
- Create clear separation between UI library and feature-specific components
- Implement component interfaces for substitutability
- Use composition over inheritance for component hierarchies
- Ensure components only depend on abstractions

### 11. Pages

#### Current Structure
```
/pages
  /admin
  /booking
  /facilities
  ...
```

#### Target Structure
```
/app
  /routes              # Route configurations
    publicRoutes.ts
    adminRoutes.ts
    appRoutes.ts
/features
  /{feature}
    /pages
      /public          # Public-facing pages
        {Feature}Page.tsx
      /app             # Authenticated user pages
        {Feature}AppPage.tsx
      /admin           # Admin pages
        {Feature}AdminPage.tsx
```

#### Action Items
- Reorganize pages by feature and interface type
- Implement container/presenter pattern
- Use dependency injection for services and stores
- Create clear separation between data fetching and presentation

### 12. Stores

#### Current Structure
```
/stores
  useAuthStore.ts
  useBookingStore.ts
  ...
```

#### Target Structure
```
/features
  /{feature}
    /state
      /interfaces
        I{Feature}Store.ts
      /implementations
        {Feature}Store.ts
      /hooks
        use{Feature}Store.ts
```

#### Action Items
- Create interfaces for all stores
- Move stores into their respective feature folders
- Implement proper dependency injection
- Ensure stores follow single responsibility principle

## UI/UX Preservation Strategy

To ensure that the user interface and experience remain identical while restructuring the code:

1. **Snapshot Testing**: Implement snapshot tests for all components before refactoring
2. **Visual Regression Testing**: Set up tools to compare before/after screenshots
3. **Component Extraction**: Extract existing component logic without modifying rendered output
4. **Non-Breaking Changes**: Ensure refactored code paths produce identical props
5. **Parallel Implementation**: Build new structures alongside existing ones before switching
6. **Gradual Transition**: Replace implementations one at a time with thorough testing

This approach ensures that while the internal structure changes significantly, the external behavior and appearance remain identical.

## Implementation Approach

### Phase 1: Core Infrastructure
1. Create foundation for feature-based architecture
2. Implement shared types and utilities
3. Set up dependency injection system

### Phase 2: Feature Migration (One Feature at a Time)
1. Start with booking domain (already partially refactored)
2. Move all booking-related code into feature structure
3. Create interfaces and implementations
4. Update imports and dependencies

### Phase 3: Public/Admin Interface Separation
1. Create clear separation between interfaces
2. Implement interface-specific components
3. Set up proper routing and navigation

### Phase 4: Cross-Cutting Concerns
1. Implement authentication and authorization
2. Set up localization infrastructure
3. Create error handling and logging

### Phase 5: Testing and Documentation
1. Implement unit tests for all features
2. Create integration tests for key workflows
3. Document architecture and patterns

## SOLID Principles Review

### Single Responsibility Principle
- Each feature module handles one domain area
- Classes and functions have clear, focused responsibilities
- Separation between data access, business logic, and presentation

### Open/Closed Principle
- Interfaces enable extension without modification
- Feature modules can be extended independently
- Strategy pattern for configurable behaviors

### Liskov Substitution Principle
- Interface implementations are interchangeable
- Testing is possible with mock implementations
- No unexpected behaviors in derived classes

### Interface Segregation Principle
- Feature-specific interfaces tailored to needs
- No client depends on methods it doesn't use
- Smaller, focused interfaces over monolithic ones

### Dependency Inversion Principle
- High-level modules depend on abstractions
- Low-level modules implement abstractions
- External frameworks isolated behind interfaces

## Conclusion

This refactoring plan provides a clear path toward a maintainable, scalable application architecture based on SOLID principles and a feature-based organization. By implementing these changes incrementally, we can improve code quality while minimizing disruption to ongoing development.

The end result will be:
- Better separation of concerns
- Improved testability
- Enhanced maintainability
- Easier onboarding for new developers
- More consistent code organization
- Clear distinction between public user interface and administrative dashboard
- Elimination of hard-coded mock data in the application
- Identical UI/UX preserved throughout the refactoring
