
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface AlertMessageProps {
  variant?: "success" | "warning" | "error" | "info";
  title?: string;
  description: string;
  className?: string;
  onClose?: () => void;
}

const alertConfig = {
  success: {
    className: "border-semantic-success/50 bg-semantic-success/10 text-semantic-success-dark",
    icon: CheckCircle,
    iconColor: "text-semantic-success"
  },
  warning: {
    className: "border-semantic-warning/50 bg-semantic-warning/10 text-semantic-warning-dark",
    icon: AlertTriangle,
    iconColor: "text-semantic-warning"
  },
  error: {
    className: "border-semantic-error/50 bg-semantic-error/10 text-semantic-error-dark",
    icon: XCircle,
    iconColor: "text-semantic-error"
  },
  info: {
    className: "border-semantic-info/50 bg-semantic-info/10 text-semantic-info-dark",
    icon: Info,
    iconColor: "text-semantic-info"
  }
};

export function AlertMessage({ 
  variant = "info", 
  title, 
  description, 
  className,
  onClose 
}: AlertMessageProps) {
  const config = alertConfig[variant];
  const Icon = config.icon;

  return (
    <Alert className={cn(config.className, className)}>
      <Icon className={cn("h-4 w-4", config.iconColor)} />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="flex justify-between items-start">
        <span>{description}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-current hover:opacity-70 transition-opacity"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
