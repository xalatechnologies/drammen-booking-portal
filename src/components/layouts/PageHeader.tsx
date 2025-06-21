
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
    <div className={cn("mb-8", className)}>
      {breadcrumb && (
        <div className="mb-6">
          {breadcrumb}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className={LAYOUT_CONSTANTS.PAGE_TITLE}>
            {title}
          </h1>
          {description && (
            <p className={LAYOUT_CONSTANTS.PAGE_DESCRIPTION}>
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
