
import React from "react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield } from "lucide-react";

export function RulesTab() {
  return (
    <div className="p-6">
      <Card className="p-6 border-2 border-orange-200 bg-orange-50">
        <h3 className="font-bold text-2xl mb-6 flex items-center gap-3 text-orange-800">
          <Shield className="h-7 w-7 text-orange-600" />
          Regler og retningslinjer
        </h3>
        <p className="text-base text-orange-700 mb-6 leading-relaxed">
          For å sikre en trygg og hyggelig opplevelse for alle, vennligst les gjennom følgende regler før du bruker lokalet.
        </p>
        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem value="safety-rules" className="border border-orange-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-orange-800 hover:text-orange-900 py-4">
              Sikkerhetsregler
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-3 text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Innendørssko påkrevd i gymsalen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Skader på utstyr må rapporteres umiddelbart</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Førstehjelpsutstyr er tilgjengelig ved hovedinngangen</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="capacity-rules" className="border border-orange-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-orange-800 hover:text-orange-900 py-4">
              Kapasitet og bruk
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-3 text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Maks antall deltakere må respekteres</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Lokalet må ryddes etter bruk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Musikk må holdes på akseptabelt nivå</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="prohibited" className="border border-orange-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-orange-800 hover:text-orange-900 py-4">
              Forbudte aktiviteter
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-3 text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Røyking og alkohol er forbudt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Ingen mat eller drikke på treningsgulvet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Kjæledyr er ikke tillatt</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
