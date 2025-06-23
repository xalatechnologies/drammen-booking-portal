
import React, { useState, useEffect } from 'react';
import { useBlackouts, useBlackoutMutations } from '@/hooks/useBlackouts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface BlackoutPeriodsManagementProps {
  facilityId: string;
}

export function BlackoutPeriodsManagement({ facilityId }: BlackoutPeriodsManagementProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const { data: blackoutPeriods = [], isLoading, error } = useBlackouts(parseInt(facilityId));
  const { createBlackout, deleteBlackout, isCreating, isDeleting } = useBlackoutMutations();

  const handleAddBlackoutPeriod = async () => {
    if (!startDate || !endDate || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newPeriod = {
      facility_id: parseInt(facilityId),
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      reason: reason,
      type: 'maintenance' as const,
      created_by: 'admin', // This should come from auth context
    };

    createBlackout(newPeriod);
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const handleRemoveBlackoutPeriod = async (periodId: string) => {
    if (confirm('Are you sure you want to remove this blackout period?')) {
      deleteBlackout(periodId);
    }
  };

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading blackout periods...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-600">Error loading blackout periods</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Blackout Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Input
                type="text"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={handleAddBlackoutPeriod}
            disabled={isCreating}
            className="mt-4"
          >
            {isCreating ? 'Adding...' : 'Add Blackout Period'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Blackout Periods</CardTitle>
        </CardHeader>
        <CardContent>
          {blackoutPeriods.length === 0 ? (
            <p className="text-gray-500">No blackout periods configured.</p>
          ) : (
            <div className="space-y-2">
              {blackoutPeriods.map((period) => (
                <div key={period.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    {formatDate(period.start_date)} - {formatDate(period.end_date)}: {period.reason}
                  </div>
                  <Button
                    onClick={() => handleRemoveBlackoutPeriod(period.id)}
                    disabled={isDeleting}
                    variant="destructive"
                    size="sm"
                  >
                    {isDeleting ? 'Removing...' : 'Remove'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
