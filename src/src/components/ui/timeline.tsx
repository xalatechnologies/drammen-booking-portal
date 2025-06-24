import React from "react";
import { cn } from "@/lib/utils";

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

interface TimelineItemProps {
  children: React.ReactNode;
  className?: string;
}

interface TimelineIconProps {
  children: React.ReactNode;
  className?: string;
}

interface TimelineConnectorProps {
  className?: string;
}

interface TimelineContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ children, className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
};

export const TimelineItem: React.FC<TimelineItemProps> = ({ children, className }) => {
  return (
    <div className={cn("flex gap-4", className)}>
      {children}
    </div>
  );
};

export const TimelineIcon: React.FC<TimelineIconProps> = ({ children, className }) => {
  return (
    <div className={cn("relative flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200", className)}>
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );
};

export const TimelineConnector: React.FC<TimelineConnectorProps> = ({ className }) => {
  return (
    <div className={cn("absolute h-full w-px bg-gray-200 left-4 top-8", className)} />
  );
};

export const TimelineContent: React.FC<TimelineContentProps> = ({ children, className }) => {
  return (
    <div className={cn("flex-1 pt-1", className)}>
      {children}
    </div>
  );
}; 