
import React, { useState, useEffect } from "react";
import { ShoppingCart, X, CreditCard, Plus, Minus, User, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { format } from "date-fns";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { BookingSessionService, BookingSessionData } from "@/services/BookingSessionService";

interface EnhancedBookingSidebarProps {
  facilityName: string;
  facilityId: string;
  selectedSlots?: SelectedTimeSlot[];
  onClearSlots?: () => void;
}

export function EnhancedBookingSidebar({
  facilityName,
  facilityId,
  selectedSlots = [],
  onClearSlots
}: EnhancedBookingSidebarProps) {
  const { cartItems, removeFromCart, getTotalPrice, getItemCount } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // State for collapsible sections
  const [selectedSlotsOpen, setSelectedSlotsOpen] = useState(true);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(true);
  
  // Session-backed form state
  const [customerType, setCustomerType] = useState<string>('private');
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');

  // Load session data on component mount
  useEffect(() => {
    const sessionData = BookingSessionService.getSessionData();
    if (sessionData) {
      setCustomerType(sessionData.customerType || 'private');
      setContactName(sessionData.contactName || '');
      setContactEmail(sessionData.contactEmail || '');
      setContactPhone(sessionData.contactPhone || '');
      setOrganization(sessionData.organization || '');
    }
  }, []);

  // Save to session whenever form data changes
  useEffect(() => {
    if (contactName || contactEmail || contactPhone || organization) {
      BookingSessionService.saveSessionData({
        customerType,
        contactName,
        contactEmail,
        contactPhone,
        organization
      });
    }
  }, [customerType, contactName, contactEmail, contactPhone, organization]);

  const facilityCartItems = cartItems.filter(item => item.facilityId === facilityId);
  const hasSelectedSlots = selectedSlots.length > 0;
  const hasCartItems = facilityCartItems.length > 0;

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const handleBookSlots = () => {
    // For now, just expand the booking details section
    setBookingDetailsOpen(true);
    setSelectedSlotsOpen(false);
  };

  const handleContinueBooking = () => {
    // Basic validation
    if (!contactName || !contactEmail || !contactPhone) {
      alert('Vennligst fyll ut alle obligatoriske felt');
      return;
    }

    // Here we would normally create the booking
    console.log('Creating booking with:', {
      customerType,
      contactName,
      contactEmail,
      contactPhone,
      organization,
      selectedSlots
    });

    // For now, just show success message
    alert('Booking opprettet! Går til handlekurv...');
    
    // Reset form and close booking details
    setBookingDetailsOpen(false);
    setCartOpen(true);
  };

  const clearSession = () => {
    BookingSessionService.clearSessionData();
    setCustomerType('private');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setOrganization('');
  };

  return (
    <div className="space-y-4">
      {/* Selected Time Slots Section */}
      {hasSelectedSlots && (
        <Collapsible open={selectedSlotsOpen} onOpenChange={setSelectedSlotsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Valgte tidspunkt ({selectedSlots.length})
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Aktiv
                  </Badge>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                {selectedSlots.map((slot, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">
                          {format(new Date(slot.date), 'dd.MM.yyyy')}
                        </p>
                        <p className="text-sm text-blue-700">{slot.timeSlot}</p>
                        <p className="text-xs text-blue-600">{slot.zoneId}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearSlots}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleBookSlots}
                    className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Book valgte tidspunkt
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClearSlots}
                    className="px-3"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Booking Details Section */}
      <Collapsible open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Booking detaljer
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Kunde type
                  </Label>
                  <Select value={customerType} onValueChange={setCustomerType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Privatperson</SelectItem>
                      <SelectItem value="business">Bedrift</SelectItem>
                      <SelectItem value="organization">Organisasjon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Kontaktnavn *
                    </Label>
                    <Input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Skriv inn fullt navn"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      E-post *
                    </Label>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="din@epost.no"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Telefon *
                    </Label>
                    <Input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+47 123 45 678"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Organisasjon (valgfritt)
                    </Label>
                    <Input
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Organisasjonsnavn"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleContinueBooking}
                    className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af]"
                    disabled={!hasSelectedSlots || !contactName || !contactEmail || !contactPhone}
                  >
                    Fortsett med booking
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearSession}
                    size="sm"
                    className="px-3"
                  >
                    Nullstill
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Cart Section */}
      <Collapsible open={cartOpen} onOpenChange={setCartOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" />
                {t('booking.cart.title')} ({getItemCount()})
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {!hasCartItems ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm font-medium">{t('booking.cart.empty')}</p>
                  <p className="text-xs mt-1 text-gray-400">Fullfør booking for å legge til i handlekurv</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {facilityCartItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs font-medium">
                              {item.zoneId === 'whole-facility' ? 'Hele lokalet' : item.zoneId}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {format(new Date(item.date), 'dd.MM.yyyy')}
                          </p>
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
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">2t</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 font-medium">
                          {item.pricePerHour * 2} kr
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="font-medium">{getTotalPrice()} kr</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">MVA (25%)</span>
                      <span className="font-medium">{Math.round(getTotalPrice() * 0.25)} kr</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>{getTotalPrice() + Math.round(getTotalPrice() * 0.25)} kr</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] font-medium text-base h-12 mt-4"
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
    </div>
  );
}
