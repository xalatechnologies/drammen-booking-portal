
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FacilityFormData, FACILITY_TYPES } from "../FacilityFormSchema";
import { useTranslation } from "@/hooks/useTranslation";
import { Info, Star } from "lucide-react";

interface EnhancedFacilityBasicSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

export const EnhancedFacilityBasicSection: React.FC<EnhancedFacilityBasicSectionProps> = ({ form }) => {
  const { tSync } = useTranslation();
  const watchedAreaSqm = form.watch("area_sqm");
  const watchedCapacity = form.watch("capacity");

  return (
    <Card>
      <CardHeader className="pb-5 pt-5 bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl flex items-center gap-1.5">
          <Info className="w-4 h-4" />
          {tSync("admin.facilities.form.basic.title", "Basic Information")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 py-6">
        {/* Name and Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder={tSync("admin.facilities.form.basic.namePlaceholder", "Facility Name*")}
                    className="h-9" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={tSync("admin.facilities.form.basic.typePlaceholder", "Facility Type*")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FACILITY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {tSync(`admin.facilities.types.${type}`, type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Area and Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={tSync("admin.facilities.form.basic.areaPlaceholder", "Area/District*")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="drammen-sentrum">{tSync("admin.facilities.areas.drammenSentrum", "Drammen Sentrum")}</SelectItem>
                    <SelectItem value="stromso">{tSync("admin.facilities.areas.stromso", "Strømsø")}</SelectItem>
                    <SelectItem value="bragernes">{tSync("admin.facilities.areas.bragernes", "Bragernes")}</SelectItem>
                    <SelectItem value="tanganvik">{tSync("admin.facilities.areas.tanganvik", "Tangen/Åsvik")}</SelectItem>
                    <SelectItem value="other">{tSync("admin.facilities.areas.other", "Other")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={tSync("admin.facilities.form.basic.statusPlaceholder", "Status")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {tSync("admin.facilities.statuses.active", "Active")}
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="maintenance">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          {tSync("admin.facilities.statuses.maintenance", "Maintenance")}
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          {tSync("admin.facilities.statuses.inactive", "Inactive")}
                        </Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Capacity and Area Size Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    className="h-9"
                    placeholder={tSync("admin.facilities.form.basic.capacityPlaceholder", "Capacity (people)*")}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription className="text-xs pt-1">
                  {tSync("admin.facilities.form.basic.capacityHint", "Max number of people this facility can accommodate")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="area_sqm"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    className="h-9"
                    placeholder={tSync("admin.facilities.form.basic.areaSqmPlaceholder", "Area (m²)")}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription className="text-xs pt-1">
                  {watchedAreaSqm && watchedCapacity ? 
                    `${(watchedAreaSqm / watchedCapacity).toFixed(1)} m² ${tSync("admin.facilities.form.basic.perPerson", "per person")}` : 
                    tSync("admin.facilities.form.basic.totalAreaHint", "Total area in square meters")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder={tSync("admin.facilities.form.basic.descriptionPlaceholder", "Description (brief overview of the facility)")} 
                  {...field} 
                  className="min-h-[70px] text-sm"
                />
              </FormControl>
              <FormDescription className="flex justify-end text-xs pt-1">
                {field.value?.length || 0}/500 {tSync("admin.facilities.form.basic.characters", "characters")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Feature Flags section moved to Config tab */}
      </CardContent>
    </Card>
  );
};
