
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Vilkår og betingelser</DialogTitle>
          <DialogDescription>
            Les gjennom vilkårene for bruk av kommunens lokaler
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">1. Generelle bestemmelser</h3>
              <p>
                Disse vilkårene gjelder for alle som leier lokaler hos Drammen kommune. 
                Ved å reservere lokaler aksepterer du disse betingelsene.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. Reservasjon og betaling</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Reservasjoner må bekreftes senest 48 timer før bruk</li>
                <li>Betaling forfaller 14 dager etter fakturadato</li>
                <li>Ved forsinket betaling påløper renter etter gjeldende satser</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. Avbestilling</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Gratis avbestilling inntil 24 timer før reservert tid</li>
                <li>Avbestilling mellom 24-12 timer: 50% av leiesum</li>
                <li>Avbestilling under 12 timer: Full leiesum</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. Bruk av lokaler</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Lokalene skal brukes i henhold til formålet oppgitt ved reservasjon</li>
                <li>Røyking er forbudt i alle lokaler</li>
                <li>Leietaker er ansvarlig for rydding og renhold etter bruk</li>
                <li>Skader på lokaler eller inventar erstattes av leietaker</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. Ansvar</h3>
              <p>
                Drammen kommune tar ikke ansvar for skader på leietakers eiendeler. 
                Leietaker har selv ansvar for forsikring av egne gjenstander.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. Personvern</h3>
              <p>
                Dine personopplysninger behandles i henhold til kommunens personvernregler 
                og brukes kun til administrasjon av lokautleie.
              </p>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={onAccept} className="bg-blue-600 hover:bg-blue-700">
            Aksepter vilkår
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
