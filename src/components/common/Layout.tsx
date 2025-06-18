
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "accent";
}

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "sm" | "md" | "lg" | "xl";
}

interface FlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: "sm" | "md" | "lg" | "xl";
}

export function Container({ children, className, size = "lg" }: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-screen-2xl",
    full: "max-w-full"
  };

  return (
    <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", sizeClasses[size], className)}>
      {children}
    </div>
  );
}

export function Section({ children, className, variant = "default" }: SectionProps) {
  const variantClasses = {
    default: "surface-primary",
    secondary: "surface-secondary",
    accent: "gradient-primary text-text-inverse"
  };

  return (
    <section className={cn("py-xl", variantClasses[variant], className)}>
      {children}
    </section>
  );
}

export function Grid({ children, className, cols = 1, gap = "md" }: GridProps) {
  const colsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
    12: "grid-cols-12"
  };

  const gapClasses = {
    sm: "gap-sm",
    md: "gap-md",
    lg: "gap-lg",
    xl: "gap-xl"
  };

  return (
    <div className={cn("grid", colsClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

export function Flex({ children, className, direction = "row", align = "start", justify = "start", gap = "md" }: FlexProps) {
  const directionClasses = {
    row: "flex-row",
    col: "flex-col"
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch"
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly"
  };

  const gapClasses = {
    sm: "gap-sm",
    md: "gap-md",
    lg: "gap-lg",
    xl: "gap-xl"
  };

  return (
    <div className={cn(
      "flex",
      directionClasses[direction],
      alignClasses[align],
      justifyClasses[justify],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}
