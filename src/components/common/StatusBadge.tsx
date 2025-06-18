
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, AlertTriangle, Info } from "lucide-react";

interface StatusBadgeProps {
  status: "success" | "pending" | "error" | "warning" | "info";
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

const statusConfig = {
  success: {
    className: "bg-success text-success-foreground border-success",
    icon: CheckCircle
  },
  pending: {
    className: "bg-warning text-warning-foreground border-warning",
    icon: Clock
  },
  error: {
    className: "bg-error text-error-foreground border-error",
    icon: XCircle
  },
  warning: {
    className: "bg-warning text-warning-foreground border-warning",
    icon: AlertTriangle
  },
  info: {
    className: "bg-info text-info-foreground border-info",
    icon: Info
  }
};

export function StatusBadge({ status, children, className, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={cn(config.className, "font-medium", className)}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {children}
    </Badge>
  );
}
