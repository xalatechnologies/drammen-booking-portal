
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AccessibilityBadgesProps {
  accessibility: string[];
  language?: 'NO' | 'EN';
}

export function AccessibilityBadges({ accessibility, language = 'NO' }: AccessibilityBadgesProps) {
  const translations = {
    NO: {
      wheelchair: "Rullestol",
      "hearing-loop": "Teleslynge",
      "sign-language": "Tegnspråk"
    },
    EN: {
      wheelchair: "Wheelchair",
      "hearing-loop": "Hearing loop",
      "sign-language": "Sign language"
    }
  };

  const t = translations[language];

  const badges = {
    "wheelchair": { label: t.wheelchair, color: "bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a]" },
    "hearing-loop": { label: t["hearing-loop"], color: "bg-green-50 text-green-700 border-green-200" },
    "sign-language": { label: t["sign-language"], color: "bg-purple-50 text-purple-700 border-purple-200" }
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
