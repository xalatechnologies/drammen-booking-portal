import { IFacilityMediaService } from '@/services/interfaces/facility/IFacilityMediaService';
import { IFacilityMediaRepository } from '@/dal/interfaces/IFacilityMediaRepository';
import { MediaItem } from '@/types/facility';

/**
 * Implementation of the Facility Media Service
 * Follows the Single Responsibility Principle by focusing only on facility media operations
 * Follows Dependency Inversion by depending on abstractions (interfaces) rather than concrete implementations
 * Follows Interface Segregation by implementing only the media-specific interface
 */
export class FacilityMediaService implements IFacilityMediaService {
  /**
   * Repository instance injected via constructor (Dependency Injection)
   */
  private repository: IFacilityMediaRepository;

  /**
   * Constructor for FacilityMediaService
   * @param mediaRepository The repository implementation to use
   */
  constructor(mediaRepository: IFacilityMediaRepository) {
    this.repository = mediaRepository;
  }

  /**
   * Get all media items for a facility
   * @param facilityId The facility ID
   */
  async getMediaByFacilityId(facilityId: string | number): Promise<MediaItem[]> {
    const response = await this.repository.getMediaByFacilityId(facilityId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to fetch facility media');
    }
    
    return response.data || [];
  }

  /**
   * Get all image media items for a facility
   * @param facilityId The facility ID
   */
  async getImagesByFacilityId(facilityId: string | number): Promise<MediaItem[]> {
    const response = await this.repository.getImages(facilityId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to fetch facility images');
    }
    
    return response.data || [];
  }

  /**
   * Get all video media items for a facility
   * @param facilityId The facility ID
   */
  async getVideosByFacilityId(facilityId: string | number): Promise<MediaItem[]> {
    const response = await this.repository.getVideos(facilityId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to fetch facility videos');
    }
    
    return response.data || [];
  }

  /**
   * Get featured media for a facility
   * @param facilityId The facility ID
   */
  async getFeaturedMedia(facilityId: string | number): Promise<MediaItem | null> {
    const images = await this.getImagesByFacilityId(facilityId);
    // Find the featured image (typically would have a 'featured' flag)
    const featuredImage = images.find(image => image.featured);
    
    return featuredImage || (images.length > 0 ? images[0] : null);
  }

  /**
   * Add a new media item to a facility
   * @param facilityId The facility ID
   * @param mediaItem The media item to add
   */
  async addMediaItem(facilityId: string | number, mediaItem: Omit<MediaItem, 'id'>): Promise<MediaItem> {
    const response = await this.repository.addMedia(facilityId, mediaItem);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to add media item');
    }
    
    if (!response.data) {
      throw new Error('Failed to add media item: No data returned');
    }
    
    return response.data;
  }

  /**
   * Update an existing media item
   * @param mediaId The media item ID
   * @param mediaItem The media item data to update
   */
  async updateMediaItem(mediaId: string | number, mediaItem: Partial<MediaItem>): Promise<MediaItem> {
    const response = await this.repository.updateMedia(mediaId, mediaItem);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to update media item');
    }
    
    if (!response.data) {
      throw new Error('Failed to update media item: No data returned');
    }
    
    return response.data;
  }

  /**
   * Delete a media item
   * @param mediaId The media item ID to delete
   */
  async deleteMediaItem(mediaId: string | number): Promise<boolean> {
    const response = await this.repository.deleteMedia(mediaId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to delete media item');
    }
    
    return response.data || false;
  }

  /**
   * Set a media item as featured
   * @param facilityId The facility ID
   * @param mediaId The media item ID to set as featured
   */
  async setFeaturedMedia(facilityId: string | number, mediaId: string | number): Promise<MediaItem> {
    const response = await this.repository.setFeaturedImage(facilityId, mediaId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to set featured media');
    }
    
    // Fetch the updated media item
    const allMedia = await this.getMediaByFacilityId(facilityId);
    const featuredMedia = allMedia.find(item => item.id === mediaId);
    
    if (!featuredMedia) {
      throw new Error('Failed to find featured media after setting');
    }
    
    return featuredMedia;
  }

  /**
   * Reorder media items
   * @param facilityId The facility ID
   * @param mediaIds Ordered array of media IDs representing the desired order
   */
  async reorderMediaItems(facilityId: string | number, mediaIds: (string | number)[]): Promise<MediaItem[]> {
    const response = await this.repository.reorderMedia(facilityId, mediaIds);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to reorder media items');
    }
    
    // Fetch the updated media list with new order
    return this.getMediaByFacilityId(facilityId);
  }

  /**
   * Process and upload a new media file
   * @param facilityId The facility ID
   * @param file The file to upload
   * @param metadata Optional metadata for the file
   */
  async uploadMediaFile(
    facilityId: string | number, 
    file: File, 
    metadata: { type?: string; title?: string; description?: string } = {}
  ): Promise<MediaItem> {
    // In a real implementation, we would handle file upload to storage
    // and then register the media item in the database
    
    // For this example, we'll create a new media item with mock data
    const { type = 'image', title = file.name, description = '' } = metadata;
    
    // Mock file URL - in reality, this would be from a storage service
    const fileUrl = `https://storage.example.com/${facilityId}/${encodeURIComponent(file.name)}`;
    
    const newMedia: Omit<MediaItem, 'id'> = {
      facilityId: String(facilityId),
      url: fileUrl,
      type,
      title,
      description,
      featured: false,
      order: 0, // Would be calculated based on existing items
      mimeType: file.type,
      fileName: file.name,
      fileSize: file.size,
      width: 0, // Would be extracted from image metadata
      height: 0, // Would be extracted from image metadata
    };
    
    return this.addMediaItem(facilityId, newMedia);
  }
}
