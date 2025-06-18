
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
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="private" id="private" className="border-gray-400 text-slate-700" />
          <Label htmlFor="private" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Privatperson</div>
              <div className="text-xs text-gray-500">Ordinær pris</div>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="nonprofit" id="nonprofit" className="border-gray-400 text-slate-700" />
          <Label htmlFor="nonprofit" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Frivillig organisasjon</div>
              <div className="text-xs text-green-600 font-medium">Gratis!</div>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="business" id="business" className="border-gray-400 text-slate-700" />
          <Label htmlFor="business" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Bedrift/Næringsdrivende</div>
              <div className="text-xs text-gray-500">Høyere pris</div>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="youth" id="youth" className="border-gray-400 text-slate-700" />
          <Label htmlFor="youth" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Ungdom (under 20 år)</div>
              <div className="text-xs text-blue-600 font-medium">30% rabatt</div>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="senior" id="senior" className="border-gray-400 text-slate-700" />
          <Label htmlFor="senior" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Senior (over 67 år)</div>
              <div className="text-xs text-blue-600 font-medium">15% rabatt</div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
