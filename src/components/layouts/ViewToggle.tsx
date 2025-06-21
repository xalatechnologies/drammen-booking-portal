
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ViewToggleProps } from "./types";

export const ViewToggle: React.FC<ViewToggleProps> = ({
  views,
  activeView,
  onViewChange,
  className = ""
}) => {
  return (
    <div className={cn("flex items-center border rounded-md", className)}>
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = activeView === view.id;
        
        return (
          <Button
            key={view.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(view.id)}
            className={cn(
              "rounded-none first:rounded-l-md last:rounded-r-md border-0",
              isActive && "bg-primary text-primary-foreground"
            )}
          >
            <Icon className="w-4 h-4 mr-2" />
            {view.label}
          </Button>
        );
      })}
    </div>
  );
};
