
import React, { useEffect } from "react";
import { ShoppingCart, X, CreditCard, Calendar, CheckCircle2, User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const handleBookSlots = () => {
    if (hasSelectedSlots) {
      actions.setCurrentStep('booking');
    } else {
      actions.addBookingError('Velg minst ett tidspunkt før booking');
    }
  };

  const handleContinueBooking = () => {
    actions.setBookingInProgress(true);
    
    try {
      const success = actions.addToCartAndContinue(facilityId, facilityName);
      
      if (success) {
        // Clear external selected slots
        if (onClearSlots) {
          onClearSlots();
        }
        actions.saveToStorage(); // Ensure state is saved
      }
    } catch (error) {
      actions.addBookingError('Feil ved opprettelse av booking');
    } finally {
      actions.setBookingInProgress(false);
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

  const getFieldError = (field: keyof typeof state.validationErrors) => {
    return state.validationErrors[field];
  };

  return (
    <div className="space-y-4">
      {/* Auto-save indicator */}
      {state.isDirty && (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          Lagrer automatisk...
        </div>
      )}

      {/* Selected Time Slots Section */}
      {hasSelectedSlots && (
        <Collapsible open={state.currentStep === 'selection'} onOpenChange={(open) => 
          open ? actions.setCurrentStep('selection') : null
        }>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Valgte tidspunkt ({state.selectedSlots.length})
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Aktiv
                  </Badge>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                {state.selectedSlots.map((slot, index) => (
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
                        onClick={() => actions.removeSelectedSlot(slot.zoneId, slot.date, slot.timeSlot)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Price display */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">Estimert pris:</span>
                    <span className="font-bold text-green-800">{businessLogic.calculateTotalPrice()} kr</span>
                  </div>
                  {businessLogic.requiresApproval() && (
                    <p className="text-xs text-green-600 mt-1">Krever godkjenning</p>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleBookSlots}
                    className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
                    disabled={!businessLogic.canProceedToNextStep()}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Book valgte tidspunkt
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearSlots}
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
      <Collapsible open={state.currentStep === 'booking'} onOpenChange={(open) => 
        open ? actions.setCurrentStep('booking') : null
      }>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Booking detaljer
                {!businessLogic.isFormValid() && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                {/* General errors */}
                {state.bookingErrors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    {state.bookingErrors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">{error}</p>
                    ))}
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Kunde type
                  </Label>
                  <Select 
                    value={state.formData.customerType} 
                    onValueChange={(value: 'private' | 'business' | 'organization') => 
                      actions.updateFormData({ customerType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Privatperson</SelectItem>
                      <SelectItem value="business">Bedrift (-10%)</SelectItem>
                      <SelectItem value="organization">Organisasjon (-20%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Kontaktnavn *
                    </Label>
                    <Input
                      value={state.formData.contactName}
                      onChange={(e) => handleFormFieldChange('contactName', e.target.value)}
                      placeholder="Skriv inn fullt navn"
                      className={getFieldError('contactName') ? 'border-red-500' : ''}
                    />
                    {getFieldError('contactName') && (
                      <p className="text-xs text-red-600 mt-1">{getFieldError('contactName')}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      E-post *
                    </Label>
                    <Input
                      type="email"
                      value={state.formData.contactEmail}
                      onChange={(e) => handleFormFieldChange('contactEmail', e.target.value)}
                      placeholder="din@epost.no"
                      className={getFieldError('contactEmail') ? 'border-red-500' : ''}
                    />
                    {getFieldError('contactEmail') && (
                      <p className="text-xs text-red-600 mt-1">{getFieldError('contactEmail')}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Telefon *
                    </Label>
                    <Input
                      type="tel"
                      value={state.formData.contactPhone}
                      onChange={(e) => handleFormFieldChange('contactPhone', e.target.value)}
                      placeholder="+47 123 45 678"
                      className={getFieldError('contactPhone') ? 'border-red-500' : ''}
                    />
                    {getFieldError('contactPhone') && (
                      <p className="text-xs text-red-600 mt-1">{getFieldError('contactPhone')}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Organisasjon (valgfritt)
                    </Label>
                    <Input
                      value={state.formData.organization}
                      onChange={(e) => handleFormFieldChange('organization', e.target.value)}
                      placeholder="Organisasjonsnavn"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Formål (valgfritt)
                    </Label>
                    <Input
                      value={state.formData.purpose || ''}
                      onChange={(e) => handleFormFieldChange('purpose', e.target.value)}
                      placeholder="Beskriv formålet med bookingen"
                      className={getFieldError('purpose') ? 'border-red-500' : ''}
                    />
                    {getFieldError('purpose') && (
                      <p className="text-xs text-red-600 mt-1">{getFieldError('purpose')}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleContinueBooking}
                    className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af]"
                    disabled={!businessLogic.canProceedToNextStep() || state.isBookingInProgress}
                  >
                    {state.isBookingInProgress ? 'Behandler...' : 
                     businessLogic.requiresApproval() ? 'Send til godkjenning' : 'Fortsett med booking'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={actions.resetBookingState}
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

      {/* Cart Section - Enhanced with better integration */}
      <Collapsible open={state.currentStep === 'cart'} onOpenChange={(open) => 
        open ? actions.setCurrentStep('cart') : null
      }>
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
