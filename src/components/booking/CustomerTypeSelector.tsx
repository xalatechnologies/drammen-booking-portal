
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CustomerType } from '@/types/pricing';

interface CustomerTypeSelectorProps {
  value: CustomerType;
  onChange: (value: CustomerType) => void;
}

export function CustomerTypeSelector({ value, onChange }: CustomerTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-slate-600" />
        Prisgruppe
      </Label>
      <p className="text-sm text-gray-600 mb-3">
        Utleier tilbyr egne priser til enkelte kundegrupper. Valg av prisgruppe medfører en godkjenningsprosess.
      </p>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="private" id="private" className="border-gray-400 text-slate-700" />
          <Label htmlFor="private" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Ikke-kommersielle aktører</div>
              <div className="text-xs text-gray-500">Standard pris</div>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="nonprofit" id="nonprofit" className="border-gray-400 text-slate-700" />
          <Label htmlFor="nonprofit" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Kommersielle aktører og private arrangement</div>
              <div className="text-xs text-blue-600 font-medium">Denne kategorien omfatter aktører som drifter med mål om økonomisk gevinst, og private arrangementer som for eksempel konfirmasjon, bryllup og sosiale sammenkomster. Disse aktørene må betale for leie.</div>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="business" id="business" className="border-gray-400 text-slate-700" />
          <Label htmlFor="business" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Kommunale virksomheter</div>
              <div className="text-xs text-gray-500">Spesialpris for kommunale aktører</div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
