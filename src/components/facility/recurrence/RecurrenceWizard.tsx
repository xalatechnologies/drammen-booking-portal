
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Repeat, ArrowLeft, ArrowRight, X, CheckCircle, Calendar, Clock, Users } from 'lucide-react';
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

const STEPS = [
  { id: 'frequency', label: 'Frekvens', icon: Repeat },
  { id: 'weekdays', label: 'Dager', icon: Calendar },
  { id: 'timeslots', label: 'Tider', icon: Clock },
  { id: 'preview', label: 'Bekreft', icon: CheckCircle }
];

export function RecurrenceWizard({ pattern, onPatternChange, onClose, onApplyPattern }: RecurrenceWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFrequency, setSelectedFrequency] = useState<SupportedFrequency>(
    pattern.type === 'weekly' || pattern.type === 'biweekly' || pattern.type === 'monthly' 
      ? pattern.type 
      : 'weekly'
  );

  const updatePattern = (updates: Partial<RecurrencePattern>) => {
    const newPattern = { ...pattern, ...updates };
    onPatternChange(newPattern);
  };

  const isStepCompleted = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return true; // Frequency always has a default
      case 1: return pattern.weekdays && pattern.weekdays.length > 0;
      case 2: return pattern.timeSlots && pattern.timeSlots.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const canNavigateToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep) return true;
    
    // Can only navigate to next step if current step is completed
    for (let i = 0; i < stepIndex; i++) {
      if (!isStepCompleted(i)) return false;
    }
    return true;
  };

  const handleStepClick = (stepIndex: number) => {
    if (canNavigateToStep(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && isStepCompleted(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleApplyPattern = () => {
    const finalPattern = { ...pattern, type: selectedFrequency };
    if (onApplyPattern) {
      onApplyPattern(finalPattern);
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
            selectedWeekdays={pattern.weekdays || []}
            onWeekdayToggle={(day) => {
              const currentWeekdays = pattern.weekdays || [];
              const newWeekdays = currentWeekdays.includes(day)
                ? currentWeekdays.filter(d => d !== day)
                : [...currentWeekdays, day];
              updatePattern({ weekdays: newWeekdays });
            }}
          />
        );
      case 2:
        return (
          <TimeSlotStep
            selectedTimeSlots={pattern.timeSlots || []}
            onTimeSlotToggle={(slot) => {
              const currentTimeSlots = pattern.timeSlots || [];
              const newTimeSlots = currentTimeSlots.includes(slot)
                ? currentTimeSlots.filter(t => t !== slot)
                : [...currentTimeSlots, slot];
              updatePattern({ timeSlots: newTimeSlots });
            }}
          />
        );
      case 3:
        return (
          <PreviewStep
            selectedFrequency={selectedFrequency}
            selectedWeekdays={pattern.weekdays || []}
            selectedTimeSlots={pattern.timeSlots || []}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white border border-gray-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <Repeat className="h-6 w-6 text-blue-600" />
            Gjentakende Reservasjon
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-white/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <div className="p-6">
        {/* Enhanced Tab Navigation */}
        <Tabs value={STEPS[currentStep].id} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 p-1 h-auto">
            {STEPS.map((step, index) => {
              const isCompleted = isStepCompleted(index);
              const isCurrent = currentStep === index;
              const canNavigate = canNavigateToStep(index);
              const IconComponent = step.icon;
              
              return (
                <TabsTrigger
                  key={step.id}
                  value={step.id}
                  onClick={() => handleStepClick(index)}
                  disabled={!canNavigate}
                  className={`
                    flex flex-col items-center gap-2 p-4 h-auto text-sm font-medium transition-all duration-200
                    ${isCurrent 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : isCompleted 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : canNavigate
                          ? 'hover:bg-gray-200 text-gray-600'
                          : 'text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
                    ${isCurrent 
                      ? 'bg-white border-white text-blue-600' 
                      : isCompleted 
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-300 text-gray-400'
                    }
                  `}>
                    {isCompleted && !isCurrent ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <IconComponent className="h-4 w-4" />
                    )}
                  </div>
                  <span className="font-semibold">{step.label}</span>
                  {isCompleted && !isCurrent && (
                    <div className="w-full h-1 bg-green-600 rounded-full mt-1" />
                  )}
                  {isCurrent && (
                    <div className="w-full h-1 bg-white rounded-full mt-1" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          {STEPS.map((step, index) => (
            <TabsContent 
              key={step.id} 
              value={step.id} 
              className="min-h-[400px] flex items-center justify-center"
            >
              <div className="w-full">
                {currentStep === index && renderStep()}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Enhanced Navigation */}
      <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
        <Button 
          variant="outline" 
          onClick={currentStep === 0 ? onClose : handleBack}
          className="flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentStep === 0 ? 'Avbryt' : 'Tilbake'}
        </Button>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">
            Steg {currentStep + 1} av {STEPS.length}
          </span>
          
          {currentStep === STEPS.length - 1 ? (
            <Button 
              onClick={handleApplyPattern}
              disabled={!isStepCompleted(currentStep)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
            >
              <CheckCircle className="h-4 w-4" />
              Opprett Reservasjoner
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={!isStepCompleted(currentStep)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
            >
              Neste
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
