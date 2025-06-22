import React from "react";

/**
 * Spinner Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Spinner Component
 * 
 * A simple loading spinner with size variants
 * Following Single Responsibility Principle by focusing only on loading indication
 */
export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  return (
    <div
      className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
