import { IFacilityMediaRepository } from '../interfaces/IFacilityMediaRepository';
import { RepositoryResponse } from '@/types/api';
import { FacilityImage, FacilityMedia } from '@/types/facility';
import { supabaseClient } from '@/supabase/client';

/**
 * Repository for managing facility media items (images, videos, etc.)
 * Following the Single Responsibility Principle by focusing only on media concerns
 */
export class FacilityMediaRepository implements IFacilityMediaRepository {
  private readonly tableName = 'facility_media';
  
  constructor(private readonly client = supabaseClient) {}

  /**
   * Get all media items for a facility
   */
  async getMediaByFacilityId(facilityId: string | number): Promise<RepositoryResponse<FacilityMedia[]>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('facility_id', facilityId)
        .order('display_order', { ascending: true });

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as FacilityMedia[]
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Add a new media item to a facility
   */
  async addMedia(facilityId: string | number, media: Omit<FacilityMedia, 'id'>): Promise<RepositoryResponse<FacilityMedia>> {
    try {
      // Get the current count of media items for ordering
      const { count, error: countError } = await this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })
        .eq('facility_id', facilityId);
      
      if (countError) {
        return {
          success: false,
          error: { message: countError.message }
        };
      }
      
      // Set display order to be after all existing items
      const displayOrder = (count || 0) + 1;
      
      // Insert the new media with facility ID
      const { data, error } = await this.client
        .from(this.tableName)
        .insert({
          ...media,
          facility_id: facilityId,
          display_order: displayOrder,
          created_at: new Date()
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      // If this is the first media item for the facility, set it as featured
      if (count === 0 && media.type === 'image') {
        await this.setFeaturedImage(facilityId, data.id);
      }

      return {
        success: true,
        data: data as FacilityMedia
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Update an existing media item
   */
  async updateMedia(mediaId: string | number, data: Partial<FacilityMedia>): Promise<RepositoryResponse<FacilityMedia>> {
    try {
      const { data: updatedMedia, error } = await this.client
        .from(this.tableName)
        .update({ ...data, updated_at: new Date() })
        .eq('id', mediaId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: updatedMedia as FacilityMedia
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Delete a media item
   */
  async deleteMedia(mediaId: string | number): Promise<RepositoryResponse<boolean>> {
    try {
      // First get the media item to check if it's featured
      const { data: mediaItem, error: fetchError } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', mediaId)
        .single();

      if (fetchError) {
        return {
          success: false,
          error: { message: fetchError.message }
        };
      }

      // Delete the media item
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', mediaId);

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      // If the deleted item was featured, set another image as featured if available
      if (mediaItem.is_featured) {
        const { data: remainingImages } = await this.client
          .from(this.tableName)
          .select('id')
          .eq('facility_id', mediaItem.facility_id)
          .eq('type', 'image')
          .limit(1);

        if (remainingImages && remainingImages.length > 0) {
          await this.setFeaturedImage(mediaItem.facility_id, remainingImages[0].id);
        }
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Reorder media items for a facility
   */
  async reorderMedia(facilityId: string | number, mediaIds: (string | number)[]): Promise<RepositoryResponse<boolean>> {
    try {
      // Start a transaction to update all items in order
      await this.client.rpc('begin');

      for (let i = 0; i < mediaIds.length; i++) {
        const { error } = await this.client
          .from(this.tableName)
          .update({ display_order: i + 1 })
          .eq('id', mediaIds[i])
          .eq('facility_id', facilityId);

        if (error) {
          await this.client.rpc('rollback');
          return {
            success: false,
            error: { message: error.message }
          };
        }
      }

      await this.client.rpc('commit');
      return {
        success: true,
        data: true
      };
    } catch (error) {
      await this.client.rpc('rollback');
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Set the featured image for a facility
   */
  async setFeaturedImage(facilityId: string | number, mediaId: string | number): Promise<RepositoryResponse<boolean>> {
    try {
      // First, unset any current featured images
      const { error: unsetError } = await this.client
        .from(this.tableName)
        .update({ is_featured: false })
        .eq('facility_id', facilityId)
        .eq('is_featured', true);

      if (unsetError) {
        return {
          success: false,
          error: { message: unsetError.message }
        };
      }

      // Then set the new featured image
      const { error: setError } = await this.client
        .from(this.tableName)
        .update({ is_featured: true })
        .eq('id', mediaId)
        .eq('facility_id', facilityId);

      if (setError) {
        return {
          success: false,
          error: { message: setError.message }
        };
      }

      // Also update the main facility image reference
      const { data: mediaItem } = await this.client
        .from(this.tableName)
        .select('url')
        .eq('id', mediaId)
        .single();

      if (mediaItem?.url) {
        await this.client
          .from('facilities')
          .update({ image: mediaItem.url })
          .eq('id', facilityId);
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Get images specifically (filtered media type)
   */
  async getImages(facilityId: string | number): Promise<RepositoryResponse<FacilityImage[]>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('facility_id', facilityId)
        .eq('type', 'image')
        .order('display_order', { ascending: true });

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as FacilityImage[]
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Get videos specifically (filtered media type)
   */
  async getVideos(facilityId: string | number): Promise<RepositoryResponse<FacilityMedia[]>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('facility_id', facilityId)
        .eq('type', 'video')
        .order('display_order', { ascending: true });

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as FacilityMedia[]
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }
}

// Export singleton instance
export const facilityMediaRepository = new FacilityMediaRepository();
