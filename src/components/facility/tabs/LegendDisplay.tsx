
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function LegendDisplay() {
  return (
    <Card className="bg-gray-50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600">Ledig</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
            <span className="text-gray-600">Valgt</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span className="text-gray-600">Opptatt</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-gray-600">Utilgjengelig</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
