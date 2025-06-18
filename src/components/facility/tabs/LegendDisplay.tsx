
import React from 'react';

interface LegendDisplayProps {
  showLegend: boolean;
}

export function LegendDisplay({ showLegend }: LegendDisplayProps) {
  if (!showLegend) return null;

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-3 gap-6 text-base font-inter">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-400"></div>
          <span>Ledig</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-red-100 border-2 border-red-400"></div>
          <span>Opptatt</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-blue-500 border-2 border-blue-600"></div>
          <span>Valgt</span>
        </div>
      </div>
    </div>
  );
}
