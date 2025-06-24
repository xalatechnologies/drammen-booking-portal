
import React from "react";
import { Grid3X3, List, Table, Map } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "@/hooks/useTranslation";

type DisplayMode = 'table' | 'grid' | 'list' | 'map';

interface FacilityViewToggleProps {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

export const FacilityViewToggle: React.FC<FacilityViewToggleProps> = ({
  displayMode,
  setDisplayMode
}) => {
  const { tSync } = useTranslation();

  return (
    <TooltipProvider>
      <ToggleGroup 
        type="single" 
        value={displayMode} 
        onValueChange={(value) => value && setDisplayMode(value as DisplayMode)}
        className="border border-gray-300 rounded-lg h-12"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="table" aria-label="Table view" className="h-12 px-4 text-base">
              <Table className="h-5 w-5" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tSync('admin.facilities.views.table', 'Table view')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="grid" aria-label="Grid view" className="h-12 px-4 text-base">
              <Grid3X3 className="h-5 w-5" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tSync('admin.facilities.views.grid', 'Grid view')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="list" aria-label="List view" className="h-12 px-4 text-base">
              <List className="h-5 w-5" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tSync('admin.facilities.views.list', 'List view')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="map" aria-label="Map view" className="h-12 px-4 text-base">
              <Map className="h-5 w-5" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tSync('admin.facilities.views.map', 'Map view')}</p>
          </TooltipContent>
        </Tooltip>
      </ToggleGroup>
    </TooltipProvider>
  );
};
