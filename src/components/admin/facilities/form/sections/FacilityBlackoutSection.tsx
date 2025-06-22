
import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { useBlackoutStore } from "@/stores/useBlackoutStore";
import { Calendar, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FacilityBlackoutSectionProps {
  facilityId?: number;
}

interface FacilityBlackoutSectionRef {
  saveData: () => Promise<boolean>;
}

export const FacilityBlackoutSection = forwardRef<FacilityBlackoutSectionRef, FacilityBlackoutSectionProps>(({ facilityId }, ref) => {
  const { tSync } = useTranslation();
  const {
    blackoutPeriods,
    isLoading,
    error,
    fetchBlackoutPeriods,
    deleteBlackoutPeriod,
    reset
  } = useBlackoutStore();

  useEffect(() => {
    if (facilityId) {
      fetchBlackoutPeriods(facilityId);
    }

    return () => {
      reset();
    };
  }, [facilityId, fetchBlackoutPeriods, reset]);

  // Expose save function to parent via ref
  useImperativeHandle(ref, () => ({
    saveData: async () => {
      console.log('Blackout periods are automatically synced through store');
      return true;
    }
  }), []);

  const getTypeIcon = (type: string) => {
    const icons = {
      maintenance: "🔧",
      renovation: "🏗️",
      event: "🎉",
      weather: "⛈️",
      other: "📋"
    };
    return icons[type as keyof typeof icons] || "📋";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'renovation': return 'bg-purple-100 text-purple-800';
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'weather': return 'bg-gray-100 text-gray-800';
      case 'other': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteBlackout = async (id: string) => {
    if (!id) return;
    
    try {
      const success = await deleteBlackoutPeriod(id);
      if (success) {
        toast({
          title: "Success",
          description: "Blackout period deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete blackout period",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blackout period",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading blackout periods...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {tSync("admin.facilities.form.blackouts.title", "Blackout Periods")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-red-600 text-sm p-3 bg-red-50 rounded">
            {error}
          </div>
        )}

        {/* Blackout Periods List */}
        {blackoutPeriods.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="font-medium mb-1">{tSync("admin.facilities.form.blackouts.noBlackouts", "No blackout periods configured")}</h3>
            <p className="text-sm mb-4">{tSync("admin.facilities.form.blackouts.noBlackoutsHint", "Add blackout periods to block bookings during maintenance or special events")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blackoutPeriods.map((blackout) => (
              <div key={blackout.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                <div className="text-2xl">{getTypeIcon(blackout.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{blackout.reason}</h4>
                    <Badge className={getTypeColor(blackout.type)}>{blackout.type}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Start:</span> {blackout.start_date}
                    </div>
                    <div>
                      <span className="font-medium">End:</span> {blackout.end_date}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {blackout.type}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => blackout.id && handleDeleteBlackout(blackout.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Blackout Button */}
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          {tSync("admin.facilities.form.blackouts.addBlackout", "Add Blackout Period")}
        </Button>

        {/* Summary */}
        {blackoutPeriods.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t text-sm">
            <div>
              <div className="font-medium text-muted-foreground">Total Blackouts</div>
              <div className="text-lg font-bold">{blackoutPeriods.length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Maintenance</div>
              <div className="text-lg font-bold text-orange-600">{blackoutPeriods.filter(b => b.type === 'maintenance').length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Events</div>
              <div className="text-lg font-bold text-blue-600">{blackoutPeriods.filter(b => b.type === 'event').length}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Other</div>
              <div className="text-lg font-bold text-purple-600">{blackoutPeriods.filter(b => b.type === 'other').length}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

FacilityBlackoutSection.displayName = "FacilityBlackoutSection";
