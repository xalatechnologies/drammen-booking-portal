
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import { CheckCircle, Calendar, Clock, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const bookingReference = state?.bookingReference || `BK-${Date.now().toString(36).toUpperCase()}`;
  const selectedSlots = state?.selectedSlots || [];
  const formData = state?.formData || {};
  const requiresApproval = state?.requiresApproval || false;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalHeader />
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {requiresApproval ? 'Søknad sendt!' : 'Reservasjon bekreftet!'}
            </h1>
            <p className="text-gray-600">
              {requiresApproval 
                ? 'Din reservasjonsforespørsel er sendt til behandling' 
                : 'Din reservasjon er bekreftet og registrert'
              }
            </p>
            <Badge variant="outline" className="mt-2 text-lg px-4 py-2">
              Referanse: {bookingReference}
            </Badge>
          </div>

          {/* Booking Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reservasjonsdetaljer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSlots.map((slot: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{slot.facilityName || 'Lokale'}</span>
                    </div>
                    <Badge variant="outline">
                      {slot.zoneId === 'whole-facility' ? 'Hele lokalet' : slot.zoneId}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(slot.date), 'dd.MM.yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {slot.timeSlot}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Information */}
          {formData && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Kontaktinformasjon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Navn:</strong> {formData.name}</p>
                  <p><strong>E-post:</strong> {formData.email}</p>
                  <p><strong>Telefon:</strong> {formData.phone}</p>
                  {formData.organization && (
                    <p><strong>Organisasjon:</strong> {formData.organization}</p>
                  )}
                  {formData.purpose && (
                    <p><strong>Formål:</strong> {formData.purpose}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Neste steg</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {requiresApproval ? (
                  <>
                    <p>• Du vil motta e-post når søknaden er behandlet</p>
                    <p>• Behandlingstid er vanligvis 1-3 virkedager</p>
                    <p>• Ved godkjenning sendes faktura etter arrangementet</p>
                  </>
                ) : (
                  <>
                    <p>• Du vil motta bekreftelse på e-post</p>
                    <p>• Faktura sendes etter arrangementet</p>
                    <p>• Husk å møte opp til avtalt tid</p>
                  </>
                )}
                <p>• Avbestilling må skje minst 48 timer før</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Tilbake til forsiden
            </Button>
            <Button 
              onClick={() => navigate('/bookings')}
              className="flex-1"
            >
              Mine reservasjoner
            </Button>
          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default BookingConfirmationPage;
