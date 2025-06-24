
import React, { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FacilityFormData } from "../FacilityFormSchema";
import { useTranslation } from "@/hooks/useTranslation";
import { MapPin, Search } from "lucide-react";

interface EnhancedFacilityAddressSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

// Simple address lookup function (you can replace with actual Google Places API)
const lookupAddress = async (query: string) => {
  // Placeholder for Google Places API integration
  // For now, return mock data
  return {
    formatted_address: query,
    latitude: 59.7428 + (Math.random() - 0.5) * 0.1,
    longitude: 10.2045 + (Math.random() - 0.5) * 0.1,
    city: "Drammen",
    postal_code: "3019",
    country: "Norway"
  };
};

export const EnhancedFacilityAddressSection: React.FC<EnhancedFacilityAddressSectionProps> = ({ form }) => {
  const { tSync } = useTranslation();
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");

  const handleAddressLookup = useCallback(async () => {
    if (!addressQuery.trim()) return;
    
    setIsLookingUp(true);
    try {
      const result = await lookupAddress(addressQuery);
      
      // Auto-fill form fields
      form.setValue("address_street", result.formatted_address);
      form.setValue("address_city", result.city);
      form.setValue("address_postal_code", result.postal_code);
      form.setValue("address_country", result.country);
      form.setValue("latitude", result.latitude);
      form.setValue("longitude", result.longitude);
    } catch (error) {
      console.error("Address lookup failed:", error);
    } finally {
      setIsLookingUp(false);
    }
  }, [addressQuery, form]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {tSync("admin.facilities.form.address.title", "Address & Location")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Address Lookup */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {tSync("admin.facilities.form.address.quickLookup", "Quick Address Lookup")}
          </label>
          <div className="flex gap-2">
            <Input
              placeholder={tSync("admin.facilities.form.address.searchPlaceholder", "Search address or place...")}
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddressLookup()}
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={handleAddressLookup}
              disabled={isLookingUp || !addressQuery.trim()}
              className="px-3"
            >
              <Search className="w-4 h-4" />
              {isLookingUp ? tSync("admin.common.searching", "Searching...") : tSync("admin.common.search", "Search")}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            {tSync("admin.facilities.form.address.hint", "Type an address and click search to auto-fill the fields below")}
          </p>
        </div>

        {/* Manual Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address_street"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{tSync("admin.facilities.form.address.street", "Street Address")} *</FormLabel>
                <FormControl>
                  <Input placeholder={tSync("admin.facilities.form.address.streetPlaceholder", "Street name and number")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSync("admin.facilities.form.address.city", "City")} *</FormLabel>
                <FormControl>
                  <Input placeholder={tSync("admin.facilities.form.address.cityPlaceholder", "City name")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address_postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSync("admin.facilities.form.address.postal", "Postal Code")} *</FormLabel>
                <FormControl>
                  <Input placeholder="3019" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address_country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSync("admin.facilities.form.address.country", "Country")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSync("admin.facilities.form.address.latitude", "Latitude")}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="any"
                    placeholder="59.7428"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSync("admin.facilities.form.address.longitude", "Longitude")}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="any"
                    placeholder="10.2045"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
