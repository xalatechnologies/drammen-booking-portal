import React, { useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useOpeningHoursStore } from "@/stores/useOpeningHoursStore";
import { Clock, Copy, Grid3X3, Plus, Layers, Calendar, Check, X, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZoneManagementModal, Zone } from "../zones/ZoneManagementModal"; // Fix import statement
import { Badge } from "@/components/ui/badge";
import { ZoneService } from '@/services/ZoneService';
import { ZoneEditor } from "./zones/ZoneEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FacilityOpeningHoursSectionProps {
  facilityId?: number;
}

interface FacilityOpeningHoursSectionRef {
  saveData: () => Promise<boolean>;
}

export const FacilityOpeningHoursSection = forwardRef<FacilityOpeningHoursSectionRef, FacilityOpeningHoursSectionProps>(({ facilityId }, ref) => {
  const { tSync } = useTranslation();
  const {
    openingHours,
    isLoading,
    error,
    setOpeningHours,
    updateOpeningHour,
    fetchOpeningHours,
    saveOpeningHours,
    reset
  } = useOpeningHoursStore();
  
  // Zone state management
  const [zones, setZones] = useState<Zone[]>([]);
  const [activeZone, setActiveZone] = useState<string>('facility');
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [zoneError, setZoneError] = useState<string | null>(null);
  const [zoneLoading, setZoneLoading] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);

  // Load zones from Supabase
  useEffect(() => {
    if (!facilityId) return;
    
    setZoneLoading(true);
    setZoneError(null);
    
    ZoneService.getZonesByFacilityId(facilityId)
      .then(res => {
        if (res.success && res.data) {
          setZones(res.data.map(dbZoneToUIZone));
          // Set active zone to first zone if it exists
          if (res.data.length > 0) {
            setActiveZone(res.data[0].id);
          }
        } else {
          console.error('Failed to load zones:', res.error);
        }
      })
      .catch(error => {
        console.error('Error loading zones:', error);
      })
      .finally(() => {
        setZoneLoading(false);
      });
  }, [facilityId]);

  useEffect(() => {
    initializeOpeningHours();
  }, [facilityId]);

  // Initialize default opening hours if none exist
  const initializeOpeningHours = async () => {
    // Default hours that will be used for new facilities or as fallback
    const defaultHours = [
      { day_of_week: 1, is_open: true, open_time: "08:00", close_time: "22:00", facility_id: facilityId || 0 },
      { day_of_week: 2, is_open: true, open_time: "08:00", close_time: "22:00", facility_id: facilityId || 0 },
      { day_of_week: 3, is_open: true, open_time: "08:00", close_time: "22:00", facility_id: facilityId || 0 },
      { day_of_week: 4, is_open: true, open_time: "08:00", close_time: "22:00", facility_id: facilityId || 0 },
      { day_of_week: 5, is_open: true, open_time: "08:00", close_time: "22:00", facility_id: facilityId || 0 },
      { day_of_week: 6, is_open: true, open_time: "09:00", close_time: "20:00", facility_id: facilityId || 0 },
      { day_of_week: 0, is_open: false, open_time: "10:00", close_time: "18:00", facility_id: facilityId || 0 },
    ];
    
    if (facilityId) {
      try {
        // Try to fetch from API
        await fetchOpeningHours(facilityId);
        
        // If no hours were loaded or there was an error, use defaults
        const currentHours = useOpeningHoursStore.getState().openingHours;
        const currentError = useOpeningHoursStore.getState().error;
        
        if (currentError || currentHours.length === 0) {
          console.log('Using default opening hours due to API error or no data');
          setOpeningHours(defaultHours);
          
          if (currentError) {
            // Just log the error, don't show it to the user
            console.error('Original error:', currentError);
            // Clear the error so the UI doesn't show the error message
            useOpeningHoursStore.getState().setError(null);
          }
        }
      } catch (e) {
        console.error('Failed to fetch opening hours:', e);
        setOpeningHours(defaultHours);
        // Don't show error to user, just use defaults silently
        useOpeningHoursStore.getState().setError(null);
      }
    } else {
      // For new facilities, use the defaults
      setOpeningHours(defaultHours);
    }
  };

  // Helper function to convert DB zone format to UI format
  const dbZoneToUIZone = (db: any): Zone => {
    return {
      id: db.id,
      name: db.name,
      type: db.type,
      capacity: db.capacity,
      notes: db.description || db.notes,
      isMainZone: db.is_main_zone || false,
      bookableIndependently: db.bookable_independently,
      areaSqm: db.area_sqm,
      status: db.status,
      isActive: db.status === 'active'
    };
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Handle adding a new zone
  const handleAddZone = () => {
    setIsZoneModalOpen(true);
  };

  // Handle zone modal close
  const handleZoneModalClose = () => {
    setIsZoneModalOpen(false);
  };

  // Handle zone save from modal - works with our new ZoneManagementModal component
  const handleSaveZone = async (zoneData: Partial<Zone>) => {
    // Add zone via ZoneService API and then refresh zones list
    setZoneLoading(true);
    
    try {
      if (!facilityId) {
        throw new Error("Facility ID is required");
      }

      // Determine if we're editing or creating a new zone
      const isEditing = !!zoneData.id;
      let response;

      if (isEditing) {
        // Update existing zone
        response = await ZoneService.updateZone(zoneData.id as string, zoneData);
      } else {
        // Create new zone
        response = await ZoneService.createZone({ ...zoneData, facility_id: facilityId });
      }

      if (response.success) {
        toast({
          title: isEditing
            ? tSync("admin.facilities.form.zones.zoneUpdated", "Zone Updated")
            : tSync("admin.facilities.form.zones.zoneAdded", "Zone Added"),
          description: isEditing
            ? tSync("admin.facilities.form.zones.zoneUpdatedDesc", "The zone has been successfully updated.")
            : tSync("admin.facilities.form.zones.zoneAddedDesc", "The zone has been successfully added.")
        });
        
        // Refresh zones list
        const zonesResponse = await ZoneService.getZonesByFacilityId(facilityId);
        if (zonesResponse.success && zonesResponse.data) {
          const mappedZones = zonesResponse.data.map(dbZoneToUIZone);
          setZones(mappedZones);
          
          // If there's at least one zone, set active zone
          if (mappedZones.length > 0 && !activeZone) {
            setActiveZone(mappedZones[0].id);
          }
        }
        
        setIsZoneModalOpen(false);
        setEditingZone(null);
      } else {
        toast({
          variant: "destructive",
          title: tSync("admin.facilities.form.zones.failedToSave", "Failed to save zone"),
          description: response.error?.message || tSync("admin.facilities.form.zones.problemSavingZone", "There was a problem saving the zone.")
        });
      }
    } catch (error) {
      console.error('Error saving zone:', error);
      toast({
        variant: "destructive",
        title: tSync("admin.facilities.form.zones.error", "Error"),
        description: tSync("admin.facilities.form.zones.unexpectedError", "An unexpected error occurred while saving the zone.")
      });
    } finally {
      setZoneLoading(false);
    }
  };

  // Expose save function to parent via ref
  useImperativeHandle(ref, () => ({
    saveData: async () => {
      console.log('Saving opening hours for facility:', facilityId);
      
      if (!facilityId) {
        console.log('No facility ID, skipping opening hours save');
        return true;
      }

      try {
        // Ensure we have valid opening hours data
        const currentHours = useOpeningHoursStore.getState().openingHours;
        console.log('Current opening hours before save:', currentHours);
        
        if (!currentHours || currentHours.length === 0) {
          console.warn('No opening hours to save, initializing default hours');
          // Initialize with default hours if none exist
          await initializeOpeningHours();
        }
        
        // Ensure all hours have the correct facility ID
        const updatedHours = useOpeningHoursStore.getState().openingHours.map(hour => ({
          ...hour,
          facility_id: facilityId
        }));
        
        // Update the store with the corrected hours
        setOpeningHours(updatedHours);
        console.log('Sanitized opening hours before save:', updatedHours);
        
        const success = await saveOpeningHours(facilityId);
        console.log('Opening hours save result:', success);
        
        if (success) {
          toast({
            title: "Opening hours saved",
            description: "Opening hours have been successfully saved.",
          });
          return true;
        } else {
          const currentError = useOpeningHoursStore.getState().error;
          console.error('Failed to save opening hours:', currentError);
          toast({
            variant: "destructive",
            title: "Failed to save",
            description: `There was a problem saving the opening hours: ${currentError || 'Unknown error'}`,
          });
          return false;
        }
      } catch (error: any) {
        console.error('Error saving opening hours:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to save opening hours: ${error?.message || 'Unknown error'}`,
        });
        return false;
      }
    }
  }), [facilityId, saveOpeningHours, error, setOpeningHours, initializeOpeningHours]);

  const getDayName = (dayOfWeek: number) => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayNames[dayOfWeek];
  };

  const copyToAllDays = (sourceDayOfWeek: number) => {
    const sourceDay = openingHours.find(d => d.day_of_week === sourceDayOfWeek);
    if (sourceDay) {
      openingHours.forEach(day => {
        if (day.day_of_week !== sourceDayOfWeek) {
          updateOpeningHour(day.day_of_week, {
            is_open: sourceDay.is_open,
            open_time: sourceDay.open_time,
            close_time: sourceDay.close_time
          });
        }
      });
      toast({
        title: "Success",
        description: `Copied ${getDayName(sourceDayOfWeek)} hours to all days`,
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading opening hours...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Function to navigate to blackouts tab in a more reliable way
  const navigateToBlackoutsTab = () => {
    // Using event dispatch to be more reliable
    const blackoutsTabTrigger = document.querySelector('[value="blackouts"]');
    if (blackoutsTabTrigger && blackoutsTabTrigger instanceof HTMLElement) {
      // Use click() for simple elements or dispatch event for more complex cases
      blackoutsTabTrigger.click();
      
      toast({
        title: tSync("admin.facilities.form.hours.navigatingToBlackouts", "Navigating to Blackouts"),
        description: tSync("admin.facilities.form.hours.blackoutsDescription", "Manage facility blackout periods")
      });
    } else {
      // Use URL-based navigation as a fallback if DOM element isn't found
      toast({
        title: tSync("admin.facilities.form.hours.blackoutTab", "Blackout Tab"),
        description: tSync("admin.facilities.form.hours.pleaseSelectBlackouts", "Please select the Blackouts tab to manage blackout periods.")
      });
    }
  };
  
  // Handle editing a zone
  const handleEditZone = (zone: Zone) => {
    setEditingZone(zone);
    setIsZoneModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3">
            <CardTitle className="text-base flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {tSync("admin.facilities.form.hours.title", "Opening Hours")}
            </CardTitle>
            
            <div className="flex items-center gap-2 self-end sm:self-center">
              {zones.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddZone}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {tSync("admin.facilities.form.zones.addZone", "Add Zone")}
                </Button>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5"
                      onClick={navigateToBlackoutsTab}
                    >
                      <Calendar className="w-4 h-4" />
                      {tSync("admin.facilities.form.hours.manageBlackouts", "Manage Blackouts")}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tSync("admin.facilities.form.hours.blackoutsTooltip", "Set periods when the facility is unavailable")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4 text-xs">
              <div className="flex items-start gap-1.5">
                <Clock className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800">{tSync("admin.facilities.form.hours.unavailable", "Opening Hours Unavailable")}</h3>
                  <p className="text-red-700 mt-0.5">{tSync("admin.facilities.form.hours.usingDefault", "Using default opening hours. You can modify them below.")}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Zone tabs if multiple zones exist */}
          {zones.length > 1 ? (
            <Tabs defaultValue={activeZone} className="w-full" onValueChange={(value) => setActiveZone(value)}>
              <TabsList className="mb-4 w-full sm:w-auto flex overflow-x-auto">
                {zones.map((zone) => (
                  <TabsTrigger 
                    key={zone.id} 
                    value={zone.id}
                    className="flex items-center gap-1.5"
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                    {zone.name}
                    {zone.isMainZone && (
                      <Badge variant="outline" className="ml-1 text-[10px] py-0 h-4">
                        {tSync("admin.facilities.zones.main", "Main")}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {zones.map((zone) => (
                <TabsContent key={zone.id} value={zone.id}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm font-medium flex items-center gap-1.5">
                      {zone.type && (
                        <Badge className={`${getStatusColor(zone.status)} text-xs px-2 py-0`}>
                          {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}
                        </Badge>
                      )}
                      <span>{zone.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditZone(zone)}
                      className="h-7 px-2"
                    >
                      <div className="sr-only">{tSync("admin.facilities.zones.edit", "Edit Zone")}</div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-1.5 mb-1">
                    {openingHours.map((day) => (
                      <div key={day.day_of_week} className="flex items-center gap-16 py-1.5 px-6 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                        <div className="w-[65px] font-medium text-base text-gray-700">
                          {tSync(`admin.facilities.form.hours.${getDayName(day.day_of_week).toLowerCase()}`, getDayName(day.day_of_week))}
                        </div>
                        
                        <div className="flex flex-1 flex-col sm:flex-row gap-3 items-end sm:items-center">
                          <Switch 
                            id={`day-${day.day_of_week}-${zone.id}`}
                            checked={day.is_open}
                            onCheckedChange={(isOpen) => updateOpeningHour(day.day_of_week, { is_open: isOpen })}
                            className="data-[state=checked]:bg-green-500"
                          />
                          <FormLabel htmlFor={`day-${day.day_of_week}-${zone.id}`} className="text-xs font-medium cursor-pointer">
                            {day.is_open ? tSync("admin.facilities.form.hours.open", "Open") : tSync("admin.facilities.form.hours.closed", "Closed")}
                          </FormLabel>
                        </div>

                        {day.is_open && (
                          <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 ml-auto">
                            <div className="flex items-center gap-1.5">
                              <FormLabel className="text-xs w-16 text-gray-500">{tSync("admin.facilities.form.hours.fromTime", "From")}</FormLabel>
                              <Input
                                type="time"
                                value={day.open_time || ""}
                                onChange={(e) => updateOpeningHour(day.day_of_week, { open_time: e.target.value })}
                                className="w-20 sm:w-24 text-xs"
                              />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FormLabel className="text-xs w-16 text-gray-500">{tSync("admin.facilities.form.hours.toTime", "To")}</FormLabel>
                              <Input
                                type="time"
                                value={day.close_time || ""}
                                onChange={(e) => updateOpeningHour(day.day_of_week, { close_time: e.target.value })}
                                className="w-20 sm:w-24 text-xs"
                              />
                            </div>
                          </div>
                        )}
                        
                        <Button
                          type="button"
                          variant="ghost"
                          className="ml-auto h-7 w-7 p-0"
                          onClick={() => copyToAllDays(day.day_of_week)}
                          title={tSync("admin.facilities.form.hours.copyToAll", "Copy to all days")}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span className="sr-only">{tSync("admin.facilities.form.hours.copyToAll", "Copy to all days")}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="grid grid-cols-1 gap-1.5 mb-1">
              {openingHours.map((day) => (
                <div key={day.day_of_week} className="flex items-center gap-16 py-1.5 px-6 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                  <div className="w-[65px] font-medium text-base text-gray-700">
                    {tSync(`admin.facilities.form.hours.${getDayName(day.day_of_week).toLowerCase()}`, getDayName(day.day_of_week))}
                  </div>
                
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={day.is_open}
                    onCheckedChange={(checked) => updateOpeningHour(day.day_of_week, { is_open: checked })}
                    className="data-[state=checked]:bg-blue-600 scale-75"
                  />
                  <span className="text-xs text-gray-600 w-9">
                    {day.is_open ? tSync('admin.facilities.form.hours.open', 'Open') : tSync('admin.facilities.form.hours.closed', 'Closed')}
                  </span>
                </div>
                
                {day.is_open ? (
                  <>
                    <div className="flex items-center">
                      <Input
                        type="time"
                        value={day.open_time}
                        onChange={(e) => updateOpeningHour(day.day_of_week, { open_time: e.target.value })}
                        className="w-[85px] h-7 text-base"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <Input
                        type="time"
                        value={day.close_time}
                        onChange={(e) => updateOpeningHour(day.day_of_week, { close_time: e.target.value })}
                        className="w-[85px] h-7 text-base"
                      />
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToAllDays(day.day_of_week)}
                      className="ml-auto hover:bg-blue-50 h-6 px-1.5 text-xs"
                      title={tSync("admin.facilities.form.hours.copyToAll", "Copy to all days")}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">{tSync("admin.facilities.form.hours.copy", "Copy")}</span>
                    </Button>
                  </>
                ) : (
                  <span className="text-xs text-gray-500 ml-auto italic">
                    {tSync("admin.facilities.form.hours.closedAll", "Closed all day")}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        </CardContent>
      </Card>
      
      {/* Use the reusable ZoneManagementModal component */}
      <ZoneManagementModal
        isOpen={isZoneModalOpen}
        onOpenChange={setIsZoneModalOpen}
        zone={editingZone}
        onSave={handleSaveZone}
        facilityId={facilityId?.toString()}
      />
    </>
  );
});

FacilityOpeningHoursSection.displayName = "FacilityOpeningHoursSection";
