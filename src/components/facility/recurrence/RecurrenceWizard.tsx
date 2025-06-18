
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Repeat, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { RecurrencePattern } from '@/utils/recurrenceEngine';
import { FrequencyStep } from './wizard/FrequencyStep';
import { WeekdayStep } from './wizard/WeekdayStep';
import { TimeSlotStep } from './wizard/TimeSlotStep';
import { PreviewStep } from './wizard/PreviewStep';

interface RecurrenceWizardProps {
  pattern: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onClose: () => void;
  onApplyPattern?: (pattern: RecurrencePattern) => void;
}

type SupportedFrequency = 'weekly' | 'biweekly' | 'monthly';

const STEPS = ['Frekvens', 'Dager', 'Tider', 'Bekreft'];

export function RecurrenceWizard({ pattern, onPatternChange, onClose, onApplyPattern }: RecurrenceWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFrequency, setSelectedFrequency] = useState<SupportedFrequency>('weekly');

  const updatePattern = (updates: Partial<RecurrencePattern>) => {
    onPatternChange({ ...pattern, ...updates });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Frequency always has a default
      case 1: return pattern.weekdays.length > 0;
      case 2: return pattern.timeSlots.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleApplyPattern = () => {
    if (onApplyPattern) {
      onApplyPattern({ ...pattern, type: selectedFrequency });
    }
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <FrequencyStep
            selectedFrequency={selectedFrequency}
            onFrequencyChange={(freq) => {
              setSelectedFrequency(freq);
              updatePattern({ type: freq });
            }}
          />
        );
      case 1:
        return (
          <WeekdayStep
            selectedWeekdays={pattern.weekdays}
            onWeekdayToggle={(day) => {
              const newWeekdays = pattern.weekdays.includes(day)
                ? pattern.weekdays.filter(d => d !== day)
                : [...pattern.weekdays, day];
              updatePattern({ weekdays: newWeekdays });
            }}
          />
        );
      case 2:
        return (
          <TimeSlotStep
            selectedTimeSlots={pattern.timeSlots}
            onTimeSlotToggle={(slot) => {
              const newTimeSlots = pattern.timeSlots.includes(slot)
                ? pattern.timeSlots.filter(t => t !== slot)
                : [...pattern.timeSlots, slot];
              updatePattern({ timeSlots: newTimeSlots });
            }}
          />
        );
      case 3:
        return (
          <PreviewStep
            selectedFrequency={selectedFrequency}
            selectedWeekdays={pattern.weekdays}
            selectedTimeSlots={pattern.timeSlots}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white border border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
            <Repeat className="h-5 w-5 text-gray-600" />
            Gjentakende Reservasjon
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mt-4">
          {STEPS.map((step, index) => (
            <div key={index} className="flex items-center">
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {index + 1}
              </div>
              <span className={`ml-2 text-sm ${index === currentStep ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                {step}
              </span>
              {index < STEPS.length - 1 && <div className="w-8 h-px bg-gray-300 mx-4" />}
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 min-h-[400px]">
        {renderStep()}
      </CardContent>

      <div className="flex justify-between p-6 border-t border-gray-200 bg-gray-50">
        <Button 
          variant="outline" 
          onClick={currentStep === 0 ? onClose : handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentStep === 0 ? 'Avbryt' : 'Tilbake'}
        </Button>
        
        {currentStep === STEPS.length - 1 ? (
          <Button 
            onClick={handleApplyPattern}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Opprett Reservasjoner
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Neste
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
