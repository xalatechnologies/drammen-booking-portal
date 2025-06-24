
import React from 'react';
import { PageLayout } from '@/components/layouts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BookingsOverview() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Bookings Overview</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No bookings to display</p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
