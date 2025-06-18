
import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function Heading1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn("text-4xl font-bold text-text-primary tracking-tight", className)}>
      {children}
    </h1>
  );
}

export function Heading2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn("text-3xl font-semibold text-text-primary tracking-tight", className)}>
      {children}
    </h2>
  );
}

export function Heading3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn("text-2xl font-semibold text-text-primary tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function Heading4({ children, className }: TypographyProps) {
  return (
    <h4 className={cn("text-xl font-semibold text-text-primary tracking-tight", className)}>
      {children}
    </h4>
  );
}

export function Heading5({ children, className }: TypographyProps) {
  return (
    <h5 className={cn("text-lg font-medium text-text-primary", className)}>
      {children}
    </h5>
  );
}

export function BodyLarge({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-lg text-text-primary leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function BodyMedium({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-base text-text-primary leading-normal", className)}>
      {children}
    </p>
  );
}

export function BodySmall({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-sm text-text-secondary leading-normal", className)}>
      {children}
    </p>
  );
}

export function Caption({ children, className }: TypographyProps) {
  return (
    <span className={cn("text-xs text-text-tertiary font-medium", className)}>
      {children}
    </span>
  );
}
