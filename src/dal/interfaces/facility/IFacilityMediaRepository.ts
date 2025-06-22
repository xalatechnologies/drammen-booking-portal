import { RepositoryResponse } from '@/types/api';
import { FacilityImage, FacilityMedia } from '@/types/facility';

/**
 * Specialized repository interface for facility media management
 * Follows Single Responsibility Principle by focusing only on media concerns
 */
export interface IFacilityMediaRepository {
  /**
   * Get all media items for a facility
   */
  getMediaByFacilityId(facilityId: string | number): Promise<RepositoryResponse<FacilityMedia[]>>;
  
  /**
   * Add a new media item to a facility
   */
  addMedia(facilityId: string | number, media: Omit<FacilityMedia, 'id'>): Promise<RepositoryResponse<FacilityMedia>>;
  
  /**
   * Update an existing media item
   */
  updateMedia(mediaId: string | number, data: Partial<FacilityMedia>): Promise<RepositoryResponse<FacilityMedia>>;
  
  /**
   * Delete a media item
   */
  deleteMedia(mediaId: string | number): Promise<RepositoryResponse<boolean>>;
  
  /**
   * Reorder media items for a facility
   */
  reorderMedia(facilityId: string | number, mediaIds: (string | number)[]): Promise<RepositoryResponse<boolean>>;
  
  /**
   * Set the featured image for a facility
   */
  setFeaturedImage(facilityId: string | number, mediaId: string | number): Promise<RepositoryResponse<boolean>>;
  
  /**
   * Get images specifically (filtered media type)
   */
  getImages(facilityId: string | number): Promise<RepositoryResponse<FacilityImage[]>>;
  
  /**
   * Get videos specifically (filtered media type)
   */
  getVideos(facilityId: string | number): Promise<RepositoryResponse<FacilityMedia[]>>;
}
