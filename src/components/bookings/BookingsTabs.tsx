
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingStatus } from '@/components/booking/types';

interface BookingsTabsProps {
  selectedTab?: string;
  onTabChange?: (tab: string) => void;
}

export function BookingsTabs({ selectedTab = 'all', onTabChange }: BookingsTabsProps) {
  const tabs = [
    { id: 'all', label: 'Alle' },
    { id: 'pending', label: 'Ventende' },
    { id: 'confirmed', label: 'Bekreftet' },
    { id: 'cancelled', label: 'Kansellert' }
  ];

  return (
    <Tabs value={selectedTab} onValueChange={onTabChange}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
