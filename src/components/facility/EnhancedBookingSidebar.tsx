
import React, { useState, useEffect } from "react";
import { ShoppingCart, X, CreditCard, User, Settings, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { format } from "date-fns";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { Zone } from "@/components/booking/types";
import { ActorType } from "@/types/pricing";
import { BookingSessionService } from "@/services/BookingSessionService";

interface EnhancedBookingSidebarProps {
  facilityName: string;
  facilityId: string;
  selectedSlots: SelectedTimeSlot[];
  zones: Zone[];
  onSlotsChange: (slots: SelectedTimeSlot[]) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  purpose: string;
  notes: string;
}

export function EnhancedBookingSidebar({
  facilityName,
  facilityId,
  selectedSlots,
  zones,
  onSlotsChange
}: EnhancedBookingSidebarProps) {
  const { cartItems, addToCart, removeFromCart, getTotalPrice, getItemCount } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Session and form state
  const [sessionData, setSessionData] = useState(BookingSessionService.getSessionData());
  const [actorType, setActorType] = useState<ActorType>(sessionData.actorType as ActorType);
  const [purpose, setPurpose] = useState(sessionData.preferences.lastUsedPurpose);
  const [activityType, setActivityType] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: sessionData.customerInfo.name,
    email: sessionData.customerInfo.email,
    phone: sessionData.customerInfo.phone,
    organization: sessionData.customerInfo.organization,
    purpose: sessionData.preferences.lastUsedPurpose,
    notes: ''
  });

  // Collapsible sections state
  const [slotsOpen, setSlotsOpen] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(selectedSlots.length > 0);
  const [cartOpen, setCartOpen] = useState(false);

  const facilityCartItems = cartItems.filter(item => item.facilityId === facilityId);

  // Update session data when form changes
  useEffect(() => {
    const newSessionData = {
      actorType,
      customerInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization
      },
      preferences: {
        lastUsedPurpose: purpose,
        commonActivityTypes: activityType ? [activityType] : []
      }
    };
    BookingSessionService.saveSessionData(newSessionData);
  }, [actorType, formData, purpose, activityType]);

  // Auto-expand booking section when slots are selected
  useEffect(() => {
    if (selectedSlots.length > 0 && !bookingOpen) {
      setBookingOpen(true);
    }
  }, [selectedSlots.length]);

  const handleCompleteBooking = () => {
    // Add selected slots to cart
    selectedSlots.forEach(slot => {
      const zone = zones.find(z => z.id === slot.zoneId);
      addToCart({
        facilityId,
        facilityName,
        zoneId: slot.zoneId,
        date: slot.date,
        timeSlot: slot.timeSlot,
        duration: slot.duration || 2,
        pricePerHour: zone?.pricePerHour || 450
      });
    });

    // Clear selected slots and switch to cart view
    onSlotsChange([]);
    setBookingOpen(false);
    setCartOpen(true);
  };

  const handleClearSlots = () => {
    onSlotsChange([]);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const isBookingValid = purpose.trim().length > 0 && activityType.length > 0 && 
                        formData.name && formData.email && formData.phone;

  return (
    <div className="space-y-4">
      {/* Selected Time Slots Section */}
      <Collapsible open={slotsOpen} onOpenChange={setSlotsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Valgte tidspunkt ({selectedSlots.length})
                </div>
                {slotsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {selectedSlots.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Ingen tidspunkt valgt enda</p>
                  <p className="text-xs mt-1 text-gray-400">Velg tidspunkt i kalenderen over</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedSlots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{format(slot.date, 'dd.MM.yyyy')}</p>
                        <p className="text-sm text-gray-600">{slot.timeSlot}</p>
                      </div>
                      <Badge variant="outline">{slot.zoneId}</Badge>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearSlots}
                    className="w-full"
                  >
                    Tøm valg
                  </Button>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Booking Details Section */}
      {selectedSlots.length > 0 && (
        <Collapsible open={bookingOpen} onOpenChange={setBookingOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Booking detaljer
                  </div>
                  {bookingOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {/* Customer Type */}
                <div className="space-y-2">
                  <Label>Kundetype</Label>
                  <Select value={actorType} onValueChange={(value: ActorType) => setActorType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private-person">Privatperson</SelectItem>
                      <SelectItem value="business">Bedrift</SelectItem>
                      <SelectItem value="organization">Organisasjon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Activity Type */}
                <div className="space-y-2">
                  <Label>Aktivitetstype</Label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg aktivitet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sport">Sport</SelectItem>
                      <SelectItem value="meeting">Møte</SelectItem>
                      <SelectItem value="event">Arrangement</SelectItem>
                      <SelectItem value="training">Trening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Purpose */}
                <div className="space-y-2">
                  <Label>Formål</Label>
                  <Textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Beskriv formålet med bookingen..."
                    rows={3}
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Navn</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ditt navn"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>E-post</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="din@epost.no"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Telefonnummer"
                    />
                  </div>

                  {actorType !== 'private-person' && (
                    <div className="space-y-2">
                      <Label>Organisasjon</Label>
                      <Input
                        value={formData.organization}
                        onChange={(e) => setFormData({...formData, organization: e.target.value})}
                        placeholder="Organisasjonsnavn"
                      />
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleCompleteBooking}
                  disabled={!isBookingValid}
                  className="w-full bg-[#1e3a8a] hover:bg-[#1e40af]"
                >
                  Legg til i handlekurv
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Cart Section */}
      <Collapsible open={cartOpen} onOpenChange={setCartOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Handlekurv ({getItemCount()})
                </div>
                {cartOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {facilityCartItems.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Handlekurven er tom</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {facilityCartItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium">{format(new Date(item.date), 'dd.MM.yyyy')}</p>
                          <p className="text-sm text-gray-600">{item.timeSlot}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 h-auto text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {item.pricePerHour * item.duration} kr
                      </Badge>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>{getTotalPrice()} kr</span>
                  </div>
                  
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-[#1e3a8a] hover:bg-[#1e40af]"
                    disabled={getItemCount() === 0}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Gå til kasse
                  </Button>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Session Management */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-gray-600">
            <Settings className="h-4 w-4" />
            Lagret informasjon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Kundetype: {actorType}</p>
            {sessionData.customerInfo.name && (
              <p>Navn: {sessionData.customerInfo.name}</p>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => BookingSessionService.clearSessionData()}
              className="text-xs p-1 h-auto text-red-600 hover:text-red-700"
            >
              Tøm lagret data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
