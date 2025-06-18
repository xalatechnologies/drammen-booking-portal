
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AccessibilityBadgesProps {
  accessibility: string[];
}

export function AccessibilityBadges({ accessibility }: AccessibilityBadgesProps) {
  const badges = {
    "wheelchair": { label: "Rullestol", className: "badge-primary" },
    "hearing-loop": { label: "Teleslynge", className: "badge-success" },
    "sign-language": { label: "Tegnspråk", className: "badge-secondary" }
  };
  
  return (
    <div className="flex flex-wrap gap-xs">
      {accessibility.map((feature) => {
        const badge = badges[feature as keyof typeof badges];
        if (!badge) return null;
        
        return (
          <Badge 
            key={feature} 
            variant="outline" 
            className={cn("text-xs font-medium py-xs px-sm rounded-md", badge.className)}
          >
            {badge.label}
          </Badge>
        );
      })}
    </div>
  );
}
