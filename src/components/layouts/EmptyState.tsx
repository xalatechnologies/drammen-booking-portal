
import React from "react";
import { cn } from "@/lib/utils";
import { EmptyStateProps } from "./types";
import { LAYOUT_CONSTANTS } from "./constants";

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = ""
}) => {
  return (
    <div className={cn(LAYOUT_CONSTANTS.EMPTY_STATE, className)}>
      {Icon && <Icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />}
      <p className="font-medium text-gray-900">{title}</p>
      {description && (
        <p className="text-sm mt-2 text-gray-500">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};
