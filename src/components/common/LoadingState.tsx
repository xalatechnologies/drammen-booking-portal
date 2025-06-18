
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  variant?: "card" | "list" | "table" | "form";
}

export function LoadingState({ className, variant = "card" }: LoadingStateProps) {
  const variants = {
    card: (
      <div className={cn("card-primary p-lg space-y-md", className)}>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    ),
    list: (
      <div className={cn("space-y-md", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-md">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    ),
    table: (
      <div className={cn("space-y-md", className)}>
        <div className="grid grid-cols-4 gap-md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-md">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4" />
            ))}
          </div>
        ))}
      </div>
    ),
    form: (
      <div className={cn("space-y-lg", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    )
  };

  return variants[variant];
}
