
import React from 'react';
import { Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookingType } from '@/types/pricing';

interface BookingTypeSelectorProps {
  value: BookingType;
  onChange: (value: BookingType) => void;
}

export function BookingTypeSelector({ value, onChange }: BookingTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-slate-600" />
        Type booking
      </Label>
      <p className="text-sm text-gray-600 mb-3">
        Velg om dette er en engangsbooking eller et fastlån (gjentakende booking).
      </p>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="engangs" id="engangs" className="border-gray-400 text-slate-700" />
          <Label htmlFor="engangs" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Engangslån</div>
              <div className="text-xs text-gray-500">Engangsreservasjon for spesifikke datoer</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="fastlan" id="fastlan" className="border-gray-400 text-slate-700" />
          <Label htmlFor="fastlan" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Fastlån</div>
              <div className="text-xs text-green-600 font-medium">Gjentakende booking - kan gi rabatt for frivillige</div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
