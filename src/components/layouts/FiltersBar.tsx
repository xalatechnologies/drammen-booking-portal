
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { FiltersBarProps } from "./types";

export const FiltersBar: React.FC<FiltersBarProps> = ({
  searchTerm = "",
  onSearchChange,
  searchPlaceholder,
  selectFilters = [],
  children,
  className = ""
}) => {
  const { tSync } = useTranslation();
  const defaultSearchPlaceholder = searchPlaceholder || tSync("common.search.placeholder", "Search...");

  return (
    <div className={cn("flex flex-col md:flex-row gap-2 items-start md:items-center justify-between", className)}>
      <div className="flex flex-1 gap-2 items-center">
        {onSearchChange && (
          <div className="relative flex-1 lg:flex-[2] max-w-md lg:max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={defaultSearchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
        )}
        
        {selectFilters.map((filter) => (
          <Select key={filter.id} value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
      
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
};
