
import React from 'react';

export function LegendDisplay({ showLegend = true }: { showLegend?: boolean } = {}) {
  if (!showLegend) return null;

  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-inter">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-400"></div>
          <span>Ledig</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-400"></div>
          <span>Opptatt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500 border-2 border-blue-600"></div>
          <span>Valgt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-400"></div>
          <span>Ikke tilgjengelig</span>
        </div>
      </div>
    </div>
  );
}
