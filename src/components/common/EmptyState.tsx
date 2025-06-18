
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heading3, BodyMedium } from "./Typography";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("text-center py-3xl", className)}>
      {icon && (
        <div className="mx-auto mb-lg w-16 h-16 text-text-tertiary">
          {icon}
        </div>
      )}
      <Heading3 className="mb-md">{title}</Heading3>
      {description && (
        <BodyMedium className="text-text-secondary mb-lg max-w-md mx-auto">
          {description}
        </BodyMedium>
      )}
      {action && (
        <Button onClick={action.onClick} className="btn-primary">
          {action.label}
        </Button>
      )}
    </div>
  );
}
