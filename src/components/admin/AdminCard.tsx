
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
    primary: "card-primary border border-primary",
    secondary: "card-secondary border border-secondary", 
    glass: "card-glass border border-white/20"
  };

  return (
    <Card className={cn(variantClasses[variant], "shadow-md hover:shadow-lg transition-all duration-200", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="heading-primary text-xl">{title}</CardTitle>
        {description && (
          <CardDescription className="body-secondary text-base">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
