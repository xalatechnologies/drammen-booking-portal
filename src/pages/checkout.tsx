
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
import { ShoppingCart, ArrowLeft, User, Mail, Phone, Building } from 'lucide-react';
import { format } from 'date-fns';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'review' | 'details' | 'confirm'>('review');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    purpose: '',
    notes: ''
  });

  const handleSubmit = async () => {
    // Simulate booking submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear cart and navigate to confirmation
    clearCart();
    navigate('/confirmation', {
      state: {
        bookingReference: `BK-${Date.now().toString(36).toUpperCase()}`,
        items: items,
        contactInfo: formData,
        totalPrice: getTotalPrice()
      }
    });
  };

  const totalWithTax = getTotalPrice() + Math.round(getTotalPrice() * 0.25);

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
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbake
            </Button>
            <h1 className="text-3xl font-bold">Fullfør reservasjon</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 'review' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Gjennomgå reservasjoner ({items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{item.facilityName}</h3>
                            <Badge variant="outline" className="mt-1">
                              {item.zoneId === 'whole-facility' ? 'Hele lokalet' : item.zoneId}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{item.pricePerHour * (item.duration || 2)} kr</p>
                            <p className="text-sm text-gray-500">{item.duration || 2} timer</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{format(new Date(item.date), 'dd.MM.yyyy')}</p>
                          <p>{item.timeSlot}</p>
                        </div>
                      </div>
                    ))}
                    <Button onClick={() => setStep('details')} className="w-full mt-6">
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
                      Kontaktopplysninger
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Navn *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ditt fulle navn"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-post *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="din@email.no"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Telefon *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+47 123 45 678"
                        />
                      </div>
                      <div>
                        <Label htmlFor="organization">Organisasjon (valgfritt)</Label>
                        <Input
                          id="organization"
                          value={formData.organization}
                          onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                          placeholder="Navn på organisasjon/lag"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="purpose">Formål med reservasjonen *</Label>
                      <Input
                        id="purpose"
                        value={formData.purpose}
                        onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                        placeholder="F.eks. fotballtrening, møte, arrangement"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Tilleggsnotater (valgfritt)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Spesielle ønsker eller informasjon..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" onClick={() => setStep('review')}>
                        Tilbake
                      </Button>
                      <Button 
                        onClick={() => setStep('confirm')}
                        disabled={!formData.name || !formData.email || !formData.phone || !formData.purpose}
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
                    <div>
                      <h3 className="font-semibold mb-2">Kontaktinformasjon</h3>
                      <div className="text-sm space-y-1">
                        <p><User className="inline h-4 w-4 mr-2" />{formData.name}</p>
                        <p><Mail className="inline h-4 w-4 mr-2" />{formData.email}</p>
                        <p><Phone className="inline h-4 w-4 mr-2" />{formData.phone}</p>
                        {formData.organization && (
                          <p><Building className="inline h-4 w-4 mr-2" />{formData.organization}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Formål</h3>
                      <p className="text-sm">{formData.purpose}</p>
                    </div>

                    {formData.notes && (
                      <div>
                        <h3 className="font-semibold mb-2">Tilleggsnotater</h3>
                        <p className="text-sm">{formData.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" onClick={() => setStep('details')}>
                        Tilbake
                      </Button>
                      <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
                        Bekreft og send reservasjon
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
                  <CardTitle>Sammendrag</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{getTotalPrice()} kr</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>MVA (25%)</span>
                      <span>{Math.round(getTotalPrice() * 0.25)} kr</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{totalWithTax} kr</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Gratis avbestilling frem til 24 timer før</p>
                    <p>• Du vil motta bekreftelse på e-post</p>
                    <p>• Faktura sendes etter arrangementet</p>
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
