
import { format, addDays, startOfDay, endOfDay } from 'date-fns';

export interface BatchAvailabilityRequest {
  zoneId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  timeSlots: string[];
}

export interface AvailabilityResult {
  zoneId: string;
  date: string;
  timeSlot: string;
  status: 'available' | 'busy' | 'unavailable';
  conflict?: {
    type: string;
    details: string;
    bookingId?: string;
  };
}

class AvailabilityService {
  private cache = new Map<string, { result: AvailabilityResult; timestamp: number }>();
  private readonly CACHE_DURATION = 30 * 1000; // 30 seconds for availability data

  private getCacheKey(zoneId: string, date: string, timeSlot: string): string {
    return `${zoneId}-${date}-${timeSlot}`;
  }

  async checkBatchAvailability(requests: BatchAvailabilityRequest[]): Promise<AvailabilityResult[]> {
    const results: AvailabilityResult[] = [];
    const uncachedRequests: { zoneId: string; date: Date; timeSlot: string }[] = [];

    // Check cache first
    for (const request of requests) {
      const startDate = startOfDay(request.dateRange.start);
      const endDate = endOfDay(request.dateRange.end);
      
      for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
        const dateString = format(date, 'yyyy-MM-dd');
        
        for (const timeSlot of request.timeSlots) {
          const cacheKey = this.getCacheKey(request.zoneId, dateString, timeSlot);
          const cached = this.cache.get(cacheKey);
          
          if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            results.push(cached.result);
          } else {
            uncachedRequests.push({
              zoneId: request.zoneId,
              date,
              timeSlot
            });
          }
        }
      }
    }

    // Fetch uncached data
    if (uncachedRequests.length > 0) {
      const uncachedResults = await this.fetchAvailabilityData(uncachedRequests);
      
      // Cache the results
      uncachedResults.forEach(result => {
        const cacheKey = this.getCacheKey(result.zoneId, result.date, result.timeSlot);
        this.cache.set(cacheKey, {
          result,
          timestamp: Date.now()
        });
      });

      results.push(...uncachedResults);
    }

    return results;
  }

  private async fetchAvailabilityData(requests: { zoneId: string; date: Date; timeSlot: string }[]): Promise<AvailabilityResult[]> {
    // Mock implementation - replace with actual API call
    return requests.map(({ zoneId, date, timeSlot }) => {
      const now = new Date();
      const slotDateTime = new Date(date);
      const [hours] = timeSlot.split(':').map(Number);
      slotDateTime.setHours(hours, 0, 0, 0);

      if (slotDateTime < now) {
        return {
          zoneId,
          date: format(date, 'yyyy-MM-dd'),
          timeSlot,
          status: 'unavailable' as const
        };
      }

      // Mock availability logic
      const isBooked = Math.random() > 0.8;
      return {
        zoneId,
        date: format(date, 'yyyy-MM-dd'),
        timeSlot,
        status: isBooked ? 'busy' : 'available' as const,
        ...(isBooked && {
          conflict: {
            type: 'existing-booking',
            details: 'Allerede booket'
          }
        })
      };
    });
  }

  async getZoneAvailability(
    zoneId: string, 
    startDate: Date, 
    endDate: Date, 
    timeSlots: string[]
  ): Promise<AvailabilityResult[]> {
    return this.checkBatchAvailability([{
      zoneId,
      dateRange: { start: startDate, end: endDate },
      timeSlots
    }]);
  }

  invalidateAvailability(zoneId: string, date?: Date, timeSlot?: string) {
    if (date && timeSlot) {
      const cacheKey = this.getCacheKey(zoneId, format(date, 'yyyy-MM-dd'), timeSlot);
      this.cache.delete(cacheKey);
    } else if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      const keysToDelete = Array.from(this.cache.keys()).filter(key => 
        key.startsWith(`${zoneId}-${dateString}-`)
      );
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      const keysToDelete = Array.from(this.cache.keys()).filter(key => 
        key.startsWith(`${zoneId}-`)
      );
      keysToDelete.forEach(key => this.cache.delete(key));
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const availabilityService = new AvailabilityService();
