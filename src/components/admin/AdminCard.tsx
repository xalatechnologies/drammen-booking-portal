
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent";
}

export function AdminCard({ 
  title, 
  description, 
  children, 
  className, 
  variant = "primary" 
}: AdminCardProps) {
  const variantClasses = {
    primary: "bg-card text-card-foreground border border-border shadow-sm hover:shadow-md",
    secondary: "bg-secondary text-secondary-foreground border border-border shadow-sm hover:shadow-md", 
    accent: "bg-accent text-accent-foreground border border-border shadow-sm hover:shadow-md"
  };

  return (
    <Card className={cn(variantClasses[variant], "rounded-xl transition-all duration-200", className)}>
      <CardHeader className="pb-lg p-xl">
        <CardTitle className="text-xl font-bold text-foreground tracking-tight">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-base text-muted-foreground leading-relaxed">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0 p-xl">
        {children}
      </CardContent>
    </Card>
  );
}
