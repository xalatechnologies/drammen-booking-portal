
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ErrorStateProps } from "./types";
import { LAYOUT_CONSTANTS } from "./constants";
import { useTranslation } from "@/hooks/useTranslation";

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  retry,
  className = ""
}) => {
  const { tSync } = useTranslation();

  return (
    <div className={cn(LAYOUT_CONSTANTS.ERROR_STATE, className)}>
      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-4">{description}</p>
      )}
      {retry && (
        <Button onClick={retry} variant="outline">
          {tSync("common.retry", "Try Again")}
        </Button>
      )}
    </div>
  );
};
