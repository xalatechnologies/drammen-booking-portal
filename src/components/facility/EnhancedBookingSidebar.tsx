
import React, { useEffect } from "react";
import { ShoppingCart, X, CreditCard, Calendar, CheckCircle2, User, AlertTriangle, UserCheck, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useBookingState } from "@/contexts/BookingStateContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { format } from "date-fns";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";

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
  const { state, actions, businessLogic } = useBookingState();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Sync external selectedSlots with internal state
  useEffect(() => {
    if (selectedSlots.length > 0) {
      actions.setSelectedSlots(selectedSlots);
    }
  }, [selectedSlots, actions]);

  const facilityCartItems = cartItems.filter(item => item.facilityId === facilityId);
  const hasSelectedSlots = state.selectedSlots.length > 0;
  const hasCartItems = facilityCartItems.length > 0;

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueBooking = () => {
    if (hasSelectedSlots && businessLogic.isFormValid()) {
      actions.setBookingInProgress(true);
      
      try {
        const success = actions.addToCartAndContinue(facilityId, facilityName);
        
        if (success) {
          // Clear external selected slots
          if (onClearSlots) {
            onClearSlots();
          }
          actions.saveToStorage();
          actions.setCurrentStep('cart');
        }
      } catch (error) {
        actions.addBookingError('Feil ved opprettelse av booking');
      } finally {
        actions.setBookingInProgress(false);
      }
    }
  };

  const handleClearSlots = () => {
    actions.clearSelectedSlots();
    if (onClearSlots) {
      onClearSlots();
    }
  };

  const handleFormFieldChange = (field: string, value: string) => {
    actions.updateFormData({ [field]: value });
  };

  const handleSaveBookingDetails = () => {
    actions.saveToStorage();
    // Show success feedback
    console.log('Booking details saved successfully');
  };

  const getFieldError = (field: keyof typeof state.validationErrors) => {
    return state.validationErrors[field];
  };

  return (
    <div className="space-y-4 text-lg">
      {/* Auto-save indicator */}
      {state.isDirty && (
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          Lagrer automatisk...
        </div>
      )}

      {/* Booking Details Section - First */}
      <Collapsible open={state.currentStep === 'booking'} onOpenChange={(open) => 
        open ? actions.setCurrentStep('booking') : null
      }>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-6 w-6" />
                Booking detaljer
                {!businessLogic.isFormValid() && (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-5">
                {/* General errors */}
                {state.bookingErrors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    {state.bookingErrors.map((error, index) => (
                      <p key={index} className="text-base text-red-600">{error}</p>
                    ))}
                  </div>
                )}

                <div>
                  <Label className="text-lg font-medium text-gray-700 mb-3 block">
                    Kunde type *
                  </Label>
                  <Select 
                    value={state.formData.customerType} 
                    onValueChange={(value: 'private' | 'business' | 'organization') => 
                      actions.updateFormData({ customerType: value })
                    }
                  >
                    <SelectTrigger className="text-lg h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Privatperson</SelectItem>
                      <SelectItem value="business">Bedrift (-10%)</SelectItem>
                      <SelectItem value="organization">Organisasjon (-20%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-lg font-medium text-gray-700 mb-3 block">
                    Organisasjon (valgfritt)
                  </Label>
                  <Input
                    value={state.formData.organization}
                    onChange={(e) => handleFormFieldChange('organization', e.target.value)}
                    placeholder="Organisasjonsnavn"
                    className="text-lg h-12"
                  />
                </div>

                <div>
                  <Label className="text-lg font-medium text-gray-700 mb-3 block">
                    Formål *
                  </Label>
                  <Input
                    value={state.formData.purpose || ''}
                    onChange={(e) => handleFormFieldChange('purpose', e.target.value)}
                    placeholder="Beskriv formålet med bookingen"
                    className={getFieldError('purpose') ? 'border-red-500 text-lg h-12' : 'text-lg h-12'}
                  />
                  {getFieldError('purpose') && (
                    <p className="text-base text-red-600 mt-1">{getFieldError('purpose')}</p>
                  )}
                </div>

                <div>
                  <Label className="text-lg font-medium text-gray-700 mb-3 block">
                    Eventtype
                  </Label>
                  <Select 
                    value={state.formData.eventType || ''} 
                    onValueChange={(value) => actions.updateFormData({ eventType: value })}
                  >
                    <SelectTrigger className="text-lg h-12">
                      <SelectValue placeholder="Velg eventtype" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sports">Sport/trening</SelectItem>
                      <SelectItem value="meeting">Møte/konferanse</SelectItem>
                      <SelectItem value="cultural">Kulturelt arrangement</SelectItem>
                      <SelectItem value="educational">Undervisning</SelectItem>
                      <SelectItem value="other">Annet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-lg font-medium text-gray-700 mb-3 block">
                    Aldersgruppe
                  </Label>
                  <Select 
                    value={state.formData.ageGroup || ''} 
                    onValueChange={(value) => actions.updateFormData({ ageGroup: value })}
                  >
                    <SelectTrigger className="text-lg h-12">
                      <SelectValue placeholder="Velg aldersgruppe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="children">Barn (0-12 år)</SelectItem>
                      <SelectItem value="youth">Ungdom (13-18 år)</SelectItem>
                      <SelectItem value="adult">Voksne (19-64 år)</SelectItem>
                      <SelectItem value="senior">Seniorer (65+ år)</SelectItem>
                      <SelectItem value="mixed">Blandet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-lg font-medium text-gray-700 mb-3 block">
                    Antall deltakere
                  </Label>
                  <Input
                    type="number"
                    value={state.formData.participants || ''}
                    onChange={(e) => handleFormFieldChange('participants', e.target.value)}
                    placeholder="Angi antall deltakere"
                    className="text-lg h-12"
                    min="1"
                  />
                </div>

                <div>
                  <Label className="text-lg font-medium text-gray-700 mb-3 block">
                    Spesielle behov (valgfritt)
                  </Label>
                  <Textarea
                    value={state.formData.specialRequirements || ''}
                    onChange={(e) => handleFormFieldChange('specialRequirements', e.target.value)}
                    placeholder="Beskriv eventuelle spesielle behov eller ønsker"
                    className="text-lg"
                    rows={3}
                  />
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleSaveBookingDetails}
                  variant="outline"
                  className="w-full flex items-center gap-2 text-lg h-12"
                >
                  <Save className="h-5 w-5" />
                  Lagre booking detaljer
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Selected Time Slots Section - Second */}
      {hasSelectedSlots && (
        <Collapsible open={state.currentStep === 'selection'} onOpenChange={(open) => 
          open ? actions.setCurrentStep('selection') : null
        }>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    Valgte tidspunkt ({state.selectedSlots.length})
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-base">
                    Aktiv
                  </Badge>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {state.selectedSlots.map((slot, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900 text-lg">
                          {format(new Date(slot.date), 'dd.MM.yyyy')}
                        </p>
                        <p className="text-base text-blue-700">{slot.timeSlot}</p>
                        <p className="text-sm text-blue-600">{slot.zoneId}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => actions.removeSelectedSlot(slot.zoneId, slot.date, slot.timeSlot)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleContinueBooking}
                    className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-lg h-12"
                    disabled={!businessLogic.isFormValid()}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Legg til i handlekurv
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearSlots}
                    className="px-4"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Cart Section - Third */}
      <Collapsible open={state.currentStep === 'cart'} onOpenChange={(open) => 
        open ? actions.setCurrentStep('cart') : null
      }>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ShoppingCart className="h-6 w-6" />
                {t('booking.cart.title')} ({getItemCount()})
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {!hasCartItems ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">{t('booking.cart.empty')}</p>
                  <p className="text-base mt-1 text-gray-400">Fullfør booking for å legge til i handlekurv</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {facilityCartItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-base font-medium">
                              {item.zoneId === 'whole-facility' ? 'Hele lokalet' : item.zoneId}
                            </Badge>
                          </div>
                          <p className="text-lg font-medium text-gray-900">
                            {format(new Date(item.date), 'dd.MM.yyyy')}
                          </p>
                          <p className="text-base text-gray-600">{item.timeSlot}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 h-auto text-gray-400 hover:text-red-500"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base text-gray-500">1t</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 font-medium text-lg">
                          {item.pricePerHour} kr
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-gray-600">Subtotal</span>
                      <span className="font-medium text-lg">{getTotalPrice()} kr</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-gray-600">MVA (25%)</span>
                      <span className="font-medium text-lg">{Math.round(getTotalPrice() * 0.25)} kr</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span>{getTotalPrice() + Math.round(getTotalPrice() * 0.25)} kr</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] font-medium text-lg h-14 mt-4"
                    disabled={getItemCount() === 0}
                  >
                    <UserCheck className="h-6 w-6 mr-2" />
                    Logg inn og fullfør booking
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
