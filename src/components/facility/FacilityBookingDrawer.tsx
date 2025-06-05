
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { BookingForm } from "@/components/booking/BookingForm";
import { Zone } from "@/components/booking/types";

interface FacilityBookingDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility: {
    id: string | undefined;
    name: string;
    availableTimes: {
      date: Date;
      slots: { start: string; end: string; available: boolean }[];
    }[];
    capacity: number;
    zones: Zone[];
  };
}

export function FacilityBookingDrawer({ open, onOpenChange, facility }: FacilityBookingDrawerProps) {
  const navigate = useNavigate();
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const handleBookingComplete = () => {
    setIsBookingComplete(true);
    
    // Reset booking state after viewing the success state
    setTimeout(() => {
      document.getElementById("close-booking-drawer")?.click();
      
      // Reset the state after the drawer closes
      setTimeout(() => {
        setIsBookingComplete(false);
        setTermsAccepted(false);
      }, 300);
    }, 3000);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] overflow-auto">
        <DrawerClose id="close-booking-drawer" className="hidden" />
        <DrawerHeader className="text-center pb-2 border-b">
          <DrawerTitle className="text-2xl">
            {isBookingComplete 
              ? "Reservasjon fullført!" 
              : `Reserver ${facility.name}`
            }
          </DrawerTitle>
          <DrawerDescription className="max-w-md mx-auto">
            {isBookingComplete 
              ? "Din reservasjon er mottatt og vil bli behandlet." 
              : "Fyll ut skjemaet under for å reservere lokalet. Reservasjonen blir bekreftet når du sender inn skjemaet."
            }
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-4">
          {isBookingComplete ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-medium">Takk for din reservasjon!</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                En bekreftelse er sendt til din e-post. Du vil også motta en SMS når reservasjonen er godkjent.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button 
                  onClick={() => navigate("/bookings")}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Se dine reservasjoner
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById("close-booking-drawer")?.click()}
                >
                  Lukk
                </Button>
              </div>
            </div>
          ) : (
            <BookingForm 
              facilityId={facility.id || ""}
              facilityName={facility.name}
              maxCapacity={facility.capacity}
              zones={facility.zones}
              availableTimeSlots={facility.availableTimes}
              onCompleteBooking={handleBookingComplete}
              termsAccepted={termsAccepted}
              onTermsAcceptedChange={setTermsAccepted}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
