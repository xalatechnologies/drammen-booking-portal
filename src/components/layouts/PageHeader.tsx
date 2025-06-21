
import React from "react";
import { cn } from "@/lib/utils";
import { PageHeaderProps } from "./types";
import { LAYOUT_CONSTANTS } from "./constants";

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumb,
  className = ""
}) => {
  return (
    <div className={cn("mb-4", className)}>
      {breadcrumb && (
        <div className="mb-3">
          {breadcrumb}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
