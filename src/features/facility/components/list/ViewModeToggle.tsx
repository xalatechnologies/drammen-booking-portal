import React from "react";

/**
 * ViewModeToggle Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface ViewModeToggleProps {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  label: string;
}

/**
 * ViewModeToggle Component
 * 
 * Responsible for a single view mode toggle button
 * Following Single Responsibility Principle by focusing only on toggle button functionality
 */
export function ViewModeToggle({ icon, isActive, onClick, label }: ViewModeToggleProps) {
  return (
    <button
      className={`p-2 rounded transition-colors flex items-center justify-center ${
        isActive
          ? "bg-white shadow-sm text-blue-700"
          : "text-gray-600 hover:bg-gray-200"
      }`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
