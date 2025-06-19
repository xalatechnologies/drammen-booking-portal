
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, ArrowLeft, User, Mail, Phone, Building, Calendar, Clock, MapPin, Edit3, Trash2, Info } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'review' | 'details' | 'confirm'>('review');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    purpose: '',
    notes: '',
    customerType: 'private' as 'private' | 'business' | 'organization'
  });

  // Group cart items by facility for better display
  const groupedReservations = items.reduce((acc, item) => {
    const key = `${item.facilityId}-${item.purpose || 'general'}`;
    if (!acc[key]) {
      acc[key] = {
        facilityId: item.facilityId,
        facilityName: item.facilityName,
        purpose: item.purpose || 'Generell booking',
        customerType: 'private',
        items: [],
        totalPrice: 0
      };
    }
    acc[key].items.push(item);
    acc[key].totalPrice += item.pricePerHour * (item.duration || 2);
    return acc;
  }, {} as Record<string, any>);

  const reservations = Object.values(groupedReservations);

  const handleSubmit = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    clearCart();
    navigate('/booking/confirmation', {
      state: {
        bookingReference: `BK-${Date.now().toString(36).toUpperCase()}`,
        selectedSlots: items,
        formData: formData,
        totalPrice: getTotalPrice(),
        requiresApproval: formData.customerType === 'organization'
      }
    });
  };

  const getCustomerTypeDiscount = () => {
    switch (formData.customerType) {
      case 'business': return 0.1; // 10% discount
      case 'organization': return 0.2; // 20% discount
      default: return 0;
    }
  };

  const subtotal = getTotalPrice();
  const discount = subtotal * getCustomerTypeDiscount();
  const discountedTotal = subtotal - discount;
  const vat = Math.round(discountedTotal * 0.25);
  const totalWithVat = discountedTotal + vat;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <GlobalHeader />
        <div className="flex-grow flex items-center justify-center">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Handlekurven er tom</h2>
              <p className="text-gray-600 mb-6">Du har ingen reservasjoner i handlekurven din.</p>
              <Button onClick={() => navigate('/')}>
                Tilbake til forsiden
              </Button>
            </CardContent>
          </Card>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalHeader />
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbake
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fullfør reservasjon</h1>
              <p className="text-gray-600">Gjennomgå og bekreft dine reservasjoner</p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {['review', 'details', 'confirm'].map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepName ? 'bg-blue-600 text-white' : 
                    ['review', 'details', 'confirm'].indexOf(step) > index ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 2 && <div className="w-12 h-px bg-gray-300 mx-2" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 'review' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Dine reservasjoner ({reservations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {reservations.map((reservation, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-white">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-blue-600" />
                              {reservation.facilityName}
                            </h3>
                            <p className="text-gray-600 mt-1">{reservation.purpose}</p>
                            <Badge variant="outline" className="mt-2">
                              {reservation.items.length} tidspunkt
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">{reservation.totalPrice} kr</p>
                            <p className="text-sm text-gray-500">Totalt for denne reservasjonen</p>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Valgte tidspunkt:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {reservation.items.map((item: any, itemIndex: number) => (
                              <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <div>
                                    <p className="font-medium">{format(new Date(item.date), 'EEEE d. MMMM', { locale: nb })}</p>
                                    <p className="text-sm text-gray-600">{item.timeSlot}</p>
                                    <p className="text-xs text-gray-500">{item.zoneId === 'whole-facility' ? 'Hele lokalet' : item.zoneId}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{item.pricePerHour * (item.duration || 2)} kr</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button onClick={() => setStep('details')} className="w-full h-12 text-lg">
                      Fortsett til kontaktopplysninger
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 'details' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Kontaktopplysninger og kundeinfo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Kundetype</Label>
                      <Select 
                        value={formData.customerType} 
                        onValueChange={(value: 'private' | 'business' | 'organization') => 
                          setFormData(prev => ({ ...prev, customerType: value }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Privatperson</SelectItem>
                          <SelectItem value="business">Bedrift (10% rabatt)</SelectItem>
                          <SelectItem value="organization">Organisasjon/forening (20% rabatt)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-base font-medium">Kontaktperson *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Fullt navn"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-base font-medium">E-postadresse *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="din@email.no"
                          className="mt-2"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone" className="text-base font-medium">Telefonnummer *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+47 123 45 678"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="organization" className="text-base font-medium">
                          {formData.customerType === 'private' ? 'Organisasjon (valgfritt)' : 'Organisasjon/bedrift *'}
                        </Label>
                        <Input
                          id="organization"
                          value={formData.organization}
                          onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                          placeholder="Navn på organisasjon/bedrift"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="purpose" className="text-base font-medium">Formål med reservasjonen *</Label>
                      <Input
                        id="purpose"
                        value={formData.purpose}
                        onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                        placeholder="F.eks. fotballtrening, møte, arrangement, konsert"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-base font-medium">Tilleggsnotater (valgfritt)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Spesielle ønsker, utstyr som trengs, eller annen viktig informasjon..."
                        rows={4}
                        className="mt-2"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" onClick={() => setStep('review')} className="flex-1">
                        Tilbake
                      </Button>
                      <Button 
                        onClick={() => setStep('confirm')}
                        disabled={!formData.name || !formData.email || !formData.phone || !formData.purpose || 
                                 (formData.customerType !== 'private' && !formData.organization)}
                        className="flex-1"
                      >
                        Gå til bekreftelse
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 'confirm' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Bekreft reservasjon</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Viktig informasjon</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            {formData.customerType === 'organization' 
                              ? 'Din reservasjon krever godkjenning og vil bli behandlet innen 1-3 virkedager.'
                              : 'Din reservasjon vil bli bekreftet umiddelbart etter betaling.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Kontaktinformasjon</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{formData.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{formData.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{formData.phone}</span>
                        </div>
                        {formData.organization && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            <span>{formData.organization}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Formål</h3>
                      <p className="text-sm bg-gray-50 p-3 rounded">{formData.purpose}</p>
                    </div>

                    {formData.notes && (
                      <div>
                        <h3 className="font-semibold mb-2">Tilleggsnotater</h3>
                        <p className="text-sm bg-gray-50 p-3 rounded">{formData.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                        Tilbake
                      </Button>
                      <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-lg">
                        {formData.customerType === 'organization' ? 'Send til godkjenning' : 'Bekreft og send reservasjon'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Prissammendrag</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({items.length} tidspunkt)</span>
                      <span>{subtotal} kr</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>
                          {formData.customerType === 'business' ? 'Bedriftsrabatt (10%)' : 'Organisasjonsrabatt (20%)'}
                        </span>
                        <span>-{Math.round(discount)} kr</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span>MVA (25%)</span>
                      <span>{vat} kr</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">{totalWithVat} kr</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 space-y-2 pt-4 border-t">
                    <h4 className="font-medium text-gray-700">Inkludert i prisen:</h4>
                    <ul className="space-y-1">
                      <li>• Tilgang til fasiliteten i valgte tidsrom</li>
                      <li>• Grunnleggende utstyr og inventar</li>
                      <li>• Rengjøring etter bruk</li>
                      <li>• Teknisk support ved behov</li>
                    </ul>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1 pt-3 border-t">
                    <h4 className="font-medium text-gray-700">Viktige vilkår:</h4>
                    <ul className="space-y-1">
                      <li>• Gratis avbestilling frem til 48 timer før</li>
                      <li>• Bekreftelse sendes på e-post</li>
                      <li>• Faktura sendes etter arrangementet</li>
                      <li>• Møt opp 15 minutter før avtalt tid</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default CheckoutPage;
