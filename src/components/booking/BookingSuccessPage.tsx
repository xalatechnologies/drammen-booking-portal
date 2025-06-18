@@ .. @@
 import { useNavigate } from "react-router-dom";
 import { CheckCircle } from "lucide-react";
 import { Button } from "@/components/ui/button";
-import { Card, CardContent } from "@/components/ui/card";
+import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
+import { RecurrencePattern } from "@/utils/recurrenceEngine";
 
 interface BookingSuccessPageProps {
   bookingReference: string;
   facilityId: string | undefined;
+  isRecurring?: boolean;
+  recurrencePattern?: RecurrencePattern | null;
 }
 
-export function BookingSuccessPage({ bookingReference, facilityId }: BookingSuccessPageProps) {
+export function BookingSuccessPage({ 
+  bookingReference, 
+  facilityId, 
+  isRecurring = false,
+  recurrencePattern
+}: BookingSuccessPageProps) {
   const navigate = useNavigate();
 
   return (
@@ .. @@
           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
             <h3 className="font-semibold text-blue-900 mb-2">Hva skjer nå?</h3>
             <ul className="text-blue-800 space-y-1 text-sm">
-              <li>• En bekreftelse er sendt til din e-post</li>
-              <li>• Du vil motta SMS når reservasjonen er godkjent</li>
-              <li>• Behandlingstid er vanligvis 1-2 virkedager</li>
+              <li>• En bekreftelse er sendt til din e-post med alle detaljer</li>
+              <li>• Du vil motta SMS når {isRecurring ? 'reservasjonene er' : 'reservasjonen er'} godkjent</li>
+              <li>• Behandlingstid er vanligvis 1-2 virkedager</li>
             </ul>
           </div>
           
+          {isRecurring && recurrencePattern && (
+            <Card className="mb-8 border-green-200 bg-green-50">
+              <CardHeader className="pb-2">
+                <CardTitle className="text-lg text-green-800 flex items-center gap-2">
+                  <CheckCircle className="h-5 w-5" />
+                  Gjentakende reservasjon opprettet
+                </CardTitle>
+              </CardHeader>
+              <CardContent>
+                <p className="text-green-700">
+                  Du har opprettet en gjentakende reservasjon med følgende mønster:
+                </p>
+                <ul className="mt-2 space-y-1 text-green-800">
+                  <li>• Frekvens: {recurrencePattern.type === 'weekly' ? 'Ukentlig' : 
+                                  recurrencePattern.type === 'biweekly' ? 'Annenhver uke' : 
+                                  recurrencePattern.type === 'monthly' ? 'Månedlig' : 'Gjentakende'}</li>
+                  <li>• Dager: {recurrencePattern.weekdays.map(day => 
+                      ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'][day]).join(', ')}</li>
+                  <li>• Tidspunkt: {recurrencePattern.timeSlots.join(', ')}</li>
+                  {recurrencePattern.endDate && (
+                    <li>• Til: {recurrencePattern.endDate.toLocaleDateString('nb-NO')}</li>
+                  )}
+                </ul>
+              </CardContent>
+            </Card>
+          )}
+          
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button 
               onClick={() => navigate("/bookings")}