
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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="w-5 h-5" />
          {tSync("admin.facilities.form.basic.title", "Basic Information")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name and Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSync("admin.facilities.form.basic.name", "Facility Name")} *</FormLabel>
                <FormControl>
                  <Input placeholder={tSync("admin.facilities.form.basic.namePlaceholder", "Enter facility name")} {...field} />
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
                <FormLabel>{tSync("admin.facilities.form.basic.type", "Facility Type")} *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={tSync("admin.facilities.form.basic.typePlaceholder", "Select type")} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSync("admin.facilities.form.basic.area", "Area/District")} *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={tSync("admin.facilities.form.basic.areaPlaceholder", "Select area")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="drammen-sentrum">Drammen Sentrum</SelectItem>
                    <SelectItem value="stromso">Strømsø</SelectItem>
                    <SelectItem value="bragernes">Bragernes</SelectItem>
                    <SelectItem value="tanganvik">Tangen/Åsvik</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                <FormLabel>{tSync("admin.facilities.form.basic.status", "Status")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="maintenance">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Maintenance</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSync("admin.facilities.form.basic.capacity", "Capacity (people)")} *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="30"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription>
                  {tSync("admin.facilities.form.basic.capacityHint", "Maximum number of people this facility can accommodate")}
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
                <FormLabel>{tSync("admin.facilities.form.basic.areaSqm", "Area (m²)")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="200"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  {watchedAreaSqm && watchedCapacity ? 
                    `${(watchedAreaSqm / watchedCapacity).toFixed(1)} m² per person` : 
                    tSync("admin.facilities.form.basic.areaSqmHint", "Total floor area in square meters")
                  }
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSync("admin.facilities.form.basic.description", "Description")}</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder={tSync("admin.facilities.form.basic.descriptionPlaceholder", "Describe the facility, its features, and what makes it special...")}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {field.value?.length || 0}/500 {tSync("admin.common.characters", "characters")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Feature Flags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    {tSync("admin.facilities.form.basic.featured", "Featured Facility")}
                  </FormLabel>
                  <FormDescription>
                    {tSync("admin.facilities.form.basic.featuredHint", "Show this facility prominently on the homepage")}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_auto_approval"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>{tSync("admin.facilities.form.basic.autoApproval", "Auto-approve Bookings")}</FormLabel>
                  <FormDescription>
                    {tSync("admin.facilities.form.basic.autoApprovalHint", "Automatically approve booking requests")}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
