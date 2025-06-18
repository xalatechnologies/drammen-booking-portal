
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
    className: "bg-semantic-success text-white border-semantic-success",
    icon: CheckCircle
  },
  pending: {
    className: "bg-semantic-warning text-white border-semantic-warning",
    icon: Clock
  },
  error: {
    className: "bg-semantic-error text-white border-semantic-error",
    icon: XCircle
  },
  warning: {
    className: "bg-semantic-warning text-white border-semantic-warning",
    icon: AlertTriangle
  },
  info: {
    className: "bg-semantic-info text-white border-semantic-info",
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
