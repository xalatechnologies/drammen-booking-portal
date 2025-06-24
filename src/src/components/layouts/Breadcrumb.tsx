
import React from "react";
import { Button } from "@/components/ui/button";
import { Breadcrumb as UIBreadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Home } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { BreadcrumbProps } from "./types";

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  onBack,
  homePath = "/admin",
  homeLabel,
  className = ""
}) => {
  const { tSync } = useTranslation();
  const defaultHomeLabel = homeLabel || tSync("admin.breadcrumb.home", "Admin");

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
      )}
      
      <UIBreadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={homePath} className="flex items-center">
              <Home className="w-4 h-4 mr-1" />
              {defaultHomeLabel}
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink href={item.href} className="flex items-center">
                    {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="flex items-center">
                    {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </UIBreadcrumb>
    </div>
  );
};
