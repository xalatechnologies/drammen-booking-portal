
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AccessibilityBadgesProps {
  accessibility: string[];
}

export function AccessibilityBadges({ accessibility }: AccessibilityBadgesProps) {
  const badges = {
    "wheelchair": { label: "Rullestol", color: "bg-blue-50 text-blue-700 border-blue-200" },
    "hearing-loop": { label: "Teleslynge", color: "bg-green-50 text-green-700 border-green-200" },
    "sign-language": { label: "Tegnspråk", color: "bg-purple-50 text-purple-700 border-purple-200" }
  };
  
  return (
    <div className="flex flex-wrap gap-1.5">
      {accessibility.map((feature) => {
        const badge = badges[feature as keyof typeof badges];
        if (!badge) return null;
        
        return (
          <Badge 
            key={feature} 
            variant="outline" 
            className={cn("text-xs font-medium py-1 px-2 rounded-md", badge.color)}
          >
            {badge.label}
          </Badge>
        );
      })}
    </div>
  );
}
