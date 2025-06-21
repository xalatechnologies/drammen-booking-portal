
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";

interface FacilityFiltersBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  children?: React.ReactNode;
}

export const FacilityFiltersBar: React.FC<FacilityFiltersBarProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  children
}) => {
  const { tSync } = useTranslation();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex-1 lg:flex-[3]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={tSync("admin.facilities.search.placeholder", "Search facilities...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] h-12 text-base">
                <SelectValue placeholder={tSync("admin.facilities.search.filterByType", "Filter by type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-base">
                  {tSync("admin.facilities.search.allTypes", "All Types")}
                </SelectItem>
                <SelectItem value="fotballhall" className="text-base">
                  {tSync("admin.facilities.types.fotballhall", "Football Hall")}
                </SelectItem>
                <SelectItem value="idrettshall" className="text-base">
                  {tSync("admin.facilities.types.idrettshall", "Sports Hall")}
                </SelectItem>
                <SelectItem value="gymsal" className="text-base">
                  {tSync("admin.facilities.types.gymsal", "Gymnasium")}
                </SelectItem>
                <SelectItem value="svømmehall" className="text-base">
                  {tSync("admin.facilities.types.svømmehall", "Swimming Pool")}
                </SelectItem>
                <SelectItem value="møterom" className="text-base">
                  {tSync("admin.facilities.types.møterom", "Meeting Room")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[120px] h-12 text-base">
                <SelectValue placeholder={tSync("admin.facilities.search.filterByStatus", "Filter by status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-base">
                  {tSync("admin.facilities.search.allStatus", "All Status")}
                </SelectItem>
                <SelectItem value="active" className="text-base">
                  {tSync("admin.facilities.status.active", "Active")}
                </SelectItem>
                <SelectItem value="maintenance" className="text-base">
                  {tSync("admin.facilities.status.maintenance", "Maintenance")}
                </SelectItem>
                <SelectItem value="inactive" className="text-base">
                  {tSync("admin.facilities.status.inactive", "Inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
