# SOLID Principles Implementation Strategy for Admin Facility Features

This document outlines specific strategies and examples for applying SOLID principles throughout the implementation of admin facility features in the Drammen Booking Portal.

## Single Responsibility Principle (SRP)

### Core Strategy
Each class, component, or module should have only one reason to change.

### Implementation Tasks

#### Repository Layer
- [x] Separate repositories by entity type:
  ```typescript
  // Each repository focuses on one entity type
  interface IFacilityRepository { /* facility-specific methods */ }
  interface IZoneRepository { /* zone-specific methods */ }
  interface IMediaRepository { /* media-specific methods */ }
  ```

#### Service Layer
- [x] Create specialized services for distinct business concerns:
  ```typescript
  // Each service focuses on one business domain
  class FacilityService { /* facility management logic */ }
  class AvailabilityService { /* availability calculation logic */ }
  class PricingService { /* pricing calculation logic */ }
  ```

#### Component Layer
- [x] Decompose UI into focused components:
  ```tsx
  // Each component has a single responsibility
  const FacilityForm: React.FC = () => {
    // Coordinates form sections but delegates actual rendering
    return (
      <Form>
        <BasicInfoSection /> // Only handles basic info
        <LocationSection />  // Only handles location
        <MediaSection />     // Only handles media
      </Form>
    );
  };
  ```

#### Hook Layer
- [x] Create focused custom hooks:
  ```typescript
  // Each hook has a single purpose
  function useFacilityData(id: string) { /* Data fetching logic */ }
  function useFacilityForm(facility?: Facility) { /* Form state management */ }
  function useFacilityValidation(formData: any) { /* Validation logic */ }
  ```

## Open/Closed Principle (OCP)

### Core Strategy
Software entities should be open for extension but closed for modification.

### Implementation Tasks

#### Component Extension
- [x] Use composition for extensibility:
  ```tsx
  // Base component closed for modification
  const BaseDataTable: React.FC<BaseTableProps> = (props) => {
    // Core table functionality
  };
  
  // Extended via composition without modifying base
  const FacilityTable: React.FC<FacilityTableProps> = (props) => {
    return (
      <BaseDataTable
        columns={facilityColumns}
        renderRow={(facility) => (/* facility-specific row rendering */)}
        renderActions={(facility) => (/* facility-specific actions */)}
        {...props}
      />
    );
  };
  ```

#### Service Extension
- [x] Use strategy pattern for extensible behavior:
  ```typescript
  // Base service with extension points
  class FacilityAvailabilityService {
    constructor(private availabilityStrategy: IAvailabilityStrategy) {}
    
    checkAvailability(facility: Facility, date: Date): boolean {
      // Delegates to the strategy
      return this.availabilityStrategy.isAvailable(facility, date);
    }
  }
  
  // Different strategies can be injected
  class StandardAvailabilityStrategy implements IAvailabilityStrategy {
    isAvailable(facility: Facility, date: Date): boolean {
      // Standard logic
    }
  }
  
  class SeasonalAvailabilityStrategy implements IAvailabilityStrategy {
    isAvailable(facility: Facility, date: Date): boolean {
      // Season-specific logic
    }
  }
  ```

#### Repository Extension
- [x] Use decorator pattern for extending repository behavior:
  ```typescript
  // Base repository implementation
  class BaseFacilityRepository implements IFacilityRepository {
    // Implementation
  }
  
  // Extended via decorator without modification
  class CachingFacilityRepository implements IFacilityRepository {
    constructor(private repository: IFacilityRepository) {}
    
    async getFacilityById(id: string): Promise<Facility | null> {
      // Add caching behavior
      const cached = this.checkCache(id);
      if (cached) return cached;
      
      const result = await this.repository.getFacilityById(id);
      this.addToCache(id, result);
      return result;
    }
    
    // Other methods delegate to wrapped repository
  }
  ```

## Liskov Substitution Principle (LSP)

### Core Strategy
Subtypes must be substitutable for their base types without altering program correctness.

### Implementation Tasks

#### Repository Implementations
- [x] Ensure all repository implementations maintain the contract:
  ```typescript
  // Base repository interface
  interface IBaseRepository<T> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    create(entity: Partial<T>): Promise<T>;
    update(id: string, entity: Partial<T>): Promise<T>;
    delete(id: string): Promise<boolean>;
  }
  
  // All implementations must fulfill the contract correctly
  class SupabaseFacilityRepository implements IBaseRepository<Facility> {
    // Implementation must match the expected behavior
    async getAll(): Promise<Facility[]> {
      // Correct implementation matching the contract
    }
    // Other methods...
  }
  
  class MockFacilityRepository implements IBaseRepository<Facility> {
    // Should be interchangeable with real implementation
    // for testing purposes
    async getAll(): Promise<Facility[]> {
      // Mock implementation with same behavior
    }
    // Other methods...
  }
  ```

#### Component Hierarchy
- [x] Create substitutable component variants:
  ```tsx
  // Base form section component
  interface FormSectionProps {
    control: Control;
    onValueChange: (field: string, value: any) => void;
    isReadOnly?: boolean;
  }
  
  const BaseFormSection: React.FC<FormSectionProps> = ({
    control,
    onValueChange,
    isReadOnly = false
  }) => {
    // Base implementation
  };
  
  // Extended form section should maintain the same contract
  const AdvancedFormSection: React.FC<FormSectionProps> = (props) => {
    // Can be used anywhere BaseFormSection is used
    return (
      <div className="advanced-section">
        <BaseFormSection {...props} />
        {/* Additional functionality */}
      </div>
    );
  };
  ```

## Interface Segregation Principle (ISP)

### Core Strategy
No client should be forced to depend on methods it does not use.

### Implementation Tasks

#### Focused Interfaces
- [x] Create granular interfaces instead of monolithic ones:
  ```typescript
  // Instead of one large interface:
  interface IFacilityManager {
    // Too many responsibilities
    getFacility(id: string): Promise<Facility>;
    updateFacility(facility: Facility): Promise<void>;
    uploadImage(facilityId: string, image: File): Promise<void>;
    deleteImage(imageId: string): Promise<void>;
    checkAvailability(facilityId: string, date: Date): Promise<boolean>;
    calculatePrice(facilityId: string, duration: number): Promise<number>;
  }
  
  // Create focused interfaces:
  interface IFacilityReader {
    getFacility(id: string): Promise<Facility>;
  }
  
  interface IFacilityWriter {
    updateFacility(facility: Facility): Promise<void>;
  }
  
  interface IFacilityMediaManager {
    uploadImage(facilityId: string, image: File): Promise<void>;
    deleteImage(imageId: string): Promise<void>;
  }
  
  interface IFacilityAvailabilityChecker {
    checkAvailability(facilityId: string, date: Date): Promise<boolean>;
  }
  
  interface IFacilityPriceCalculator {
    calculatePrice(facilityId: string, duration: number): Promise<number>;
  }
  ```

#### Component Props
- [x] Use focused prop interfaces:
  ```tsx
  // Instead of large prop sets:
  interface LargeFacilityFormProps {
    facility: Facility;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isLoading: boolean;
    isReadOnly: boolean;
    availableZones: Zone[];
    pricingRules: PricingRule[];
    openingHours: OpeningHours[];
    // Too many props!
  }
  
  // Use composition with focused props:
  interface FacilityFormProps {
    facility: Facility;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
  }
  
  interface ZoneSectionProps {
    availableZones: Zone[];
    onChange: (zones: Zone[]) => void;
    isReadOnly?: boolean;
  }
  
  interface PricingSectionProps {
    pricingRules: PricingRule[];
    onChange: (rules: PricingRule[]) => void;
    isReadOnly?: boolean;
  }
  ```

## Dependency Inversion Principle (DIP)

### Core Strategy
High-level modules should not depend on low-level modules. Both should depend on abstractions.

### Implementation Tasks

#### Service Dependencies
- [x] Inject dependencies via interfaces:
  ```typescript
  // Depend on abstractions, not concrete implementations
  class FacilityService {
    constructor(
      private facilityRepository: IFacilityRepository, // Interface, not concrete class
      private notificationService: INotificationService
    ) {}
    
    async updateFacility(id: string, data: Partial<Facility>): Promise<Facility> {
      const updatedFacility = await this.facilityRepository.update(id, data);
      await this.notificationService.notify('facility-updated', updatedFacility);
      return updatedFacility;
    }
  }
  ```

#### Component Dependencies
- [x] Use dependency injection for component dependencies:
  ```tsx
  // Component factory with dependency injection
  interface FacilityListDependencies {
    facilityService: IFacilityService;
    notificationService: INotificationService;
    analyticsService: IAnalyticsService;
  }
  
  const createFacilityList = ({
    facilityService,
    notificationService,
    analyticsService
  }: FacilityListDependencies) => {
    // Create and return component with injected dependencies
    return (props: FacilityListProps) => {
      // Component implementation using injected services
    };
  };
  ```

#### Repository Configuration
- [x] Configure repositories through dependency injection:
  ```typescript
  // Factory function for creating repository with dependencies
  function createFacilityRepository({
    dbClient,
    logger,
    cacheService
  }: RepositoryDependencies): IFacilityRepository {
    // Create and return repository implementation
    return new CachedFacilityRepository(
      new LoggingFacilityRepository(
        new SupabaseFacilityRepository(dbClient),
        logger
      ),
      cacheService
    );
  }
  ```

## Integration of SOLID Principles

### Complete Example: Media Management Implementation

```typescript
// 1. Single Responsibility: Separate interfaces for different media types
interface IImageRepository {
  getImages(facilityId: string): Promise<FacilityImage[]>;
  addImage(facilityId: string, image: NewImage): Promise<FacilityImage>;
  updateImage(imageId: string, image: Partial<FacilityImage>): Promise<FacilityImage>;
  deleteImage(imageId: string): Promise<boolean>;
}

interface IVideoRepository {
  getVideos(facilityId: string): Promise<FacilityVideo[]>;
  addVideo(facilityId: string, video: NewVideo): Promise<FacilityVideo>;
  updateVideo(videoId: string, video: Partial<FacilityVideo>): Promise<FacilityVideo>;
  deleteVideo(videoId: string): Promise<boolean>;
}

// 2. Open/Closed: Base media service with extension points
abstract class BaseMediaService<T> {
  constructor(protected repository: IBaseRepository<T>) {}
  
  async getAll(facilityId: string): Promise<T[]> {
    return this.repository.getAll(facilityId);
  }
  
  // Extension point for pre-processing
  protected abstract prepareForStorage(media: any): any;
  
  // Extension point for post-processing
  protected abstract processAfterRetrieval(media: T): any;
}

// 3. Liskov Substitution: Derived services maintain the contract
class ImageMediaService extends BaseMediaService<FacilityImage> {
  protected prepareForStorage(image: any): any {
    // Image-specific processing
    return {
      ...image,
      processed_at: new Date().toISOString()
    };
  }
  
  protected processAfterRetrieval(image: FacilityImage): any {
    // Generate thumbnail URLs
    return {
      ...image,
      thumbnail_url: `${image.url}?width=200&height=200`
    };
  }
}

class VideoMediaService extends BaseMediaService<FacilityVideo> {
  protected prepareForStorage(video: any): any {
    // Video-specific processing
    return {
      ...video,
      processed_at: new Date().toISOString()
    };
  }
  
  protected processAfterRetrieval(video: FacilityVideo): any {
    // Extract video provider info
    const provider = this.detectVideoProvider(video.url);
    return {
      ...video,
      provider,
      embed_url: this.generateEmbedUrl(video.url, provider)
    };
  }
  
  private detectVideoProvider(url: string): string {
    // Detect if YouTube, Vimeo, etc.
    return url.includes('youtube') ? 'youtube' : url.includes('vimeo') ? 'vimeo' : 'unknown';
  }
  
  private generateEmbedUrl(url: string, provider: string): string {
    // Generate proper embed URL based on provider
    if (provider === 'youtube') {
      // Extract YouTube ID and format embed URL
    }
    return url;
  }
}

// 4. Interface Segregation: Specific component props
interface MediaManagerProps {
  facilityId: string;
}

interface ImageManagerProps extends MediaManagerProps {
  onImageUpdate: (images: FacilityImage[]) => void;
  maxImages?: number;
  allowReordering?: boolean;
}

interface VideoManagerProps extends MediaManagerProps {
  onVideoUpdate: (videos: FacilityVideo[]) => void;
  supportedProviders?: string[];
}

// 5. Dependency Inversion: Components depend on abstract services
// Factory function for MediaSection
const createMediaSection = ({
  imageService,
  videoService,
  documentService,
  analyticsService
}: {
  imageService: BaseMediaService<FacilityImage>;
  videoService: BaseMediaService<FacilityVideo>;
  documentService: BaseMediaService<FacilityDocument>;
  analyticsService: IAnalyticsService;
}) => {
  // Return the MediaSection component with dependencies injected
  return ({ facilityId }: { facilityId: string }) => {
    // Component implementation using injected services
    const handleImageUpload = async (file: File) => {
      try {
        const result = await imageService.add(facilityId, { file });
        analyticsService.track('facility-image-uploaded', { facilityId });
        return result;
      } catch (error) {
        // Error handling
      }
    };
    
    // Rest of component implementation
    return (
      // JSX implementation
    );
  };
};

// Usage with dependency injection
const MediaSection = createMediaSection({
  imageService: new ImageMediaService(new SupabaseImageRepository()),
  videoService: new VideoMediaService(new SupabaseVideoRepository()),
  documentService: new DocumentMediaService(new SupabaseDocumentRepository()),
  analyticsService: new AnalyticsService()
});
```

## Implementation Checklist with SOLID Focus

- [ ] Review existing code for SOLID violations
- [ ] Refactor large components following SRP
- [ ] Create interface hierarchy following ISP
- [ ] Implement dependency injection pattern for services
- [ ] Create abstract base classes for common functionality
- [ ] Use composition over inheritance for component reuse
- [ ] Document extension points in components and services
- [ ] Write unit tests that verify SOLID principles are followed
- [ ] Create code review guidelines focusing on SOLID application
