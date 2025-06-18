
import React from "react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export function FaqTab() {
  return (
    <div className="p-6">
      <Card className="p-6 border-2 border-blue-200 bg-blue-50">
        <h3 className="font-bold text-2xl mb-6 flex items-center gap-3 text-blue-800">
          <HelpCircle className="h-7 w-7 text-blue-600" />
          Ofte stilte spørsmål
        </h3>
        <p className="text-base text-blue-700 mb-6 leading-relaxed">
          Her finner du svar på de mest vanlige spørsmålene om reservasjon og bruk av lokalet.
        </p>
        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem value="booking-hours" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              Når kan jeg reservere lokalet?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                Lokalet er tilgjengelig for reservasjon fra kl. 06:00 til 23:00, mandag til søndag. 
                Du kan reservere opptil 90 dager i forveien.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cancellation" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              Kan jeg avbestille reservasjonen min?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                Ja, du kan avbestille gratis opptil 24 timer før reservert tid. 
                Avbestilling etter dette vil medføre full betaling av reservasjonen.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="equipment" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              Hvilke utstyr er inkludert?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                Alle reservasjoner inkluderer standard sportsutstyr som basketkurver, volleyballnett, 
                håndballmål, lydanlegg og projektor. Spesialutstyr kan reserveres separat.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="payment" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              Hvordan betaler jeg for reservasjonen?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                Du kan betale med kort, Vipps eller faktura. Betaling må være fullført før reservasjonen bekreftes. 
                Vi aksepterer alle norske bankkort og internasjonale kredittkort.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="access" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              Hvordan får jeg tilgang til lokalet?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                Du vil motta en tilgangskode per SMS 30 minutter før reservert tid. 
                Denne koden gir deg tilgang til lokalet og deaktiveres automatisk når reservasjonstiden utløper.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="group-size" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              Hvor mange personer kan være i lokalet samtidig?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                Hele lokalet har plass til maksimalt 30 personer. Hvis du reserverer kun en sone, 
                er kapasiteten 15 personer per sone. Dette er sikkerhetsbegrensninger som må overholdes.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cleaning" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              Må jeg rydde etter meg selv?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                Ja, lokalet må være i samme stand som da du kom. Dette inkluderer å sette tilbake utstyr, 
                kaste søppel og tørke opp eventuelle søl. Rengjøringsutstyr finnes i utstyrsrommet.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
