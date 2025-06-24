
import React from "react";
import { cn } from "@/lib/utils";
import { PageLayoutProps } from "./types";
import { LAYOUT_CONSTANTS } from "./constants";

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  maxWidth = "max-w-7xl",
  padding = "py-8",
  className = ""
}) => {
  return (
    <div className={cn("w-full min-h-screen", LAYOUT_CONSTANTS.PAGE_BACKGROUND)}>
      <div className={cn(maxWidth, "mx-auto px-4 sm:px-6 lg:px-8", padding, className)}>
        {children}
      </div>
    </div>
  );
};
