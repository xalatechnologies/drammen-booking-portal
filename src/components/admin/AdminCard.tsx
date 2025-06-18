
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "glass";
}

export function AdminCard({ 
  title, 
  description, 
  children, 
  className, 
  variant = "primary" 
}: AdminCardProps) {
  const variantClasses = {
    primary: "surface-primary border border-primary shadow-md hover:shadow-lg transition-all duration-200",
    secondary: "surface-secondary border border-secondary shadow-sm hover:shadow-md transition-all duration-200", 
    glass: "glass-effect shadow-glass border border-white/20 backdrop-blur-lg"
  };

  return (
    <Card className={cn(variantClasses[variant], "rounded-xl", className)}>
      <CardHeader className="pb-spacing-lg p-spacing-xl">
        <CardTitle className="heading-primary text-xl font-bold text-text-primary tracking-tight">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="body-secondary text-base text-text-secondary leading-relaxed">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0 p-spacing-xl">
        {children}
      </CardContent>
    </Card>
  );
}
