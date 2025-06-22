import { MediaItem } from '@/types/facility';

/**
 * Service interface for facility media operations
 * Follows Single Responsibility Principle by focusing only on media concerns
 * Follows Interface Segregation Principle by providing focused methods
 */
export interface IFacilityMediaService {
  /**
   * Get all media items for a facility
   * @param facilityId The facility ID
   */
  getMediaByFacilityId(facilityId: string | number): Promise<MediaItem[]>;
  
  /**
   * Get all image media items for a facility
   * @param facilityId The facility ID
   */
  getImagesByFacilityId(facilityId: string | number): Promise<MediaItem[]>;
  
  /**
   * Get all video media items for a facility
   * @param facilityId The facility ID
   */
  getVideosByFacilityId(facilityId: string | number): Promise<MediaItem[]>;
  
  /**
   * Get featured media for a facility
   * @param facilityId The facility ID
   */
  getFeaturedMedia(facilityId: string | number): Promise<MediaItem | null>;
  
  /**
   * Add a new media item to a facility
   * @param facilityId The facility ID
   * @param mediaItem The media item to add
   */
  addMediaItem(facilityId: string | number, mediaItem: Omit<MediaItem, 'id'>): Promise<MediaItem>;
  
  /**
   * Update an existing media item
   * @param mediaId The media item ID
   * @param mediaItem The media item data to update
   */
  updateMediaItem(mediaId: string | number, mediaItem: Partial<MediaItem>): Promise<MediaItem>;
  
  /**
   * Delete a media item
   * @param mediaId The media item ID to delete
   */
  deleteMediaItem(mediaId: string | number): Promise<boolean>;
  
  /**
   * Set a media item as featured
   * @param facilityId The facility ID
   * @param mediaId The media item ID to set as featured
   */
  setFeaturedMedia(facilityId: string | number, mediaId: string | number): Promise<MediaItem>;
  
  /**
   * Reorder media items
   * @param facilityId The facility ID
   * @param mediaIds Ordered array of media IDs representing the desired order
   */
  reorderMediaItems(facilityId: string | number, mediaIds: (string | number)[]): Promise<MediaItem[]>;
  
  /**
   * Process and upload a new media file
   * @param facilityId The facility ID
   * @param file The file to upload
   * @param metadata Optional metadata for the file
   */
  uploadMediaFile(
    facilityId: string | number, 
    file: File, 
    metadata?: { type?: string; title?: string; description?: string }
  ): Promise<MediaItem>;
}
