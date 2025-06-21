import React, { useState, useEffect } from 'react';
import { FacilityBlackoutService } from '@/services/FacilityBlackoutService';
import { FacilityBlackoutPeriod } from '@/types/facility';

interface BlackoutPeriodsManagementProps {
  facilityId: string;
}

export function BlackoutPeriodsManagement({ facilityId }: BlackoutPeriodsManagementProps) {
  const [blackoutPeriods, setBlackoutPeriods] = useState<FacilityBlackoutPeriod[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlackoutPeriods();
  }, [facilityId]);

  const fetchBlackoutPeriods = async () => {
    setLoading(true);
    try {
      const response = await FacilityBlackoutService.getBlackoutPeriods(facilityId);
      
      if (response.success) {
        setBlackoutPeriods(response.data || []);
      } else {
        setError('Failed to fetch blackout periods');
      }
    } catch (err) {
      setError('An error occurred while fetching blackout periods');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlackoutPeriod = async () => {
    setLoading(true);
    setError(null);
    try {
      const newPeriod = {
        facility_id: parseInt(facilityId),
        start_date: startDate,
        end_date: endDate,
        reason: reason,
      };
      const response = await FacilityBlackoutService.createBlackoutPeriod(newPeriod);
      if (response.success) {
        setBlackoutPeriods([...blackoutPeriods, response.data!]);
        setStartDate('');
        setEndDate('');
        setReason('');
        await fetchBlackoutPeriods();
      } else {
        setError(response.error?.message || 'Failed to add blackout period');
      }
    } catch (err) {
      setError('An error occurred while adding the blackout period');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBlackoutPeriod = async (periodId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await FacilityBlackoutService.deleteBlackoutPeriod(periodId);
      if (response.success) {
        setBlackoutPeriods(blackoutPeriods.filter(period => period.id !== periodId));
        await fetchBlackoutPeriods();
      } else {
        setError(response.error?.message || 'Failed to remove blackout period');
      }
    } catch (err) {
      setError('An error occurred while removing the blackout period');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading blackout periods...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Add New Blackout Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="endDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
            <input
              type="text"
              id="reason"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleAddBlackoutPeriod}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Blackout Period
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Current Blackout Periods</h3>
        {blackoutPeriods.length === 0 ? (
          <p className="text-gray-500">No blackout periods configured.</p>
        ) : (
          <div className="space-y-2">
            {blackoutPeriods.map((period) => (
              <div key={period.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  {period.start_date} - {period.end_date}: {period.reason}
                </div>
                <button
                  onClick={() => handleRemoveBlackoutPeriod(period.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
