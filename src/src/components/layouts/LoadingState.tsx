
import React from "react";
import { cn } from "@/lib/utils";
import { LoadingStateProps } from "./types";
import { LAYOUT_CONSTANTS } from "./constants";

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  message,
  className = ""
}) => {
  if (variant === 'spinner') {
    return (
      <div className={cn(LAYOUT_CONSTANTS.LOADING_STATE, className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        {message && <p className="mt-4 text-gray-500">{message}</p>}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)}>
      {message && <span className="sr-only">{message}</span>}
    </div>
  );
};
