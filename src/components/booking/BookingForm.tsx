
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays, addMonths } from "date-fns";
import { nb } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  CalendarDays, 
  Clock, 
  Users, 
  Info, 
  CheckCircle, 
  CalendarRange, 
  Repeat, 
  HelpCircle, 
  PlusCircle 
} from "lucide-react";
import { BookingSummary, BookingData } from "./BookingSummary";
import { generateRecurrenceRule, getRecurrenceDescription, checkBookingConflict } from "@/utils/bookingConflict";

// Updated booking form schema to include different modes
const bookingFormSchema = z.object({
  bookingMode: z.enum(['one-time', 'date-range', 'recurring']),
  date: z.date({
    required_error: "Velg en dato for reservasjonen.",
  }),
  endDate: z.date().optional(),
  timeSlot: z.string({
    required_error: "Velg et tidsintervall.",
  }),
  purpose: z.string().min(10, {
    message: "Formålet må være minst 10 tegn.",
  }).max(500, {
    message: "Formålet kan ikke være mer enn 500 tegn."
  }),
  attendees: z.coerce.number().min(1, {
    message: "Antall deltakere må være minst 1.",
  }).max(1000, {
    message: "Antall deltakere kan ikke være mer enn 1000.",
  }),
  contactName: z.string().min(2, {
    message: "Navnet må være minst 2 tegn.",
  }),
  contactEmail: z.string().email({
    message: "Skriv inn en gyldig e-postadresse.",
  }),
  contactPhone: z.string().min(8, {
    message: "Telefonnummeret må være minst 8 tall.",
  }).regex(/^[0-9+\s]+$/, {
    message: "Telefonnummeret kan bare inneholde tall, '+' og mellomrom.",
  }),
  organization: z.string().optional(),
  
  // Recurring booking fields
  recurrenceFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  recurrenceInterval: z.coerce.number().min(1).max(30).optional(),
  recurrenceCount: z.coerce.number().min(1).max(100).optional(),
  recurrenceEndDate: z.date().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  facilityId: string;
  facilityName: string;
  maxCapacity: number;
  availableTimeSlots: {
    date: Date;
    slots: { start: string; end: string; available: boolean }[];
  }[];
  onCompleteBooking: () => void;
}

export function BookingForm({
  facilityId,
  facilityName,
  maxCapacity,
  availableTimeSlots,
  onCompleteBooking,
}: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState<'details' | 'contact' | 'confirm'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(1);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      bookingMode: 'one-time',
      date: new Date(),
      timeSlot: "",
      purpose: "",
      attendees: 1,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      organization: "",
      recurrenceFrequency: 'weekly',
      recurrenceInterval: 1,
    },
  });

  // Get current selected date from form
  const selectedDate = form.watch("date");
  const bookingMode = form.watch("bookingMode");
  const recurrenceFrequency = form.watch("recurrenceFrequency");
  const recurrenceInterval = form.watch("recurrenceInterval");
  const recurrenceEndDate = form.watch("recurrenceEndDate");
  const recurrenceCount = form.watch("recurrenceCount");
  
  // Get available time slots for the selected date
  const availableSlotsForDate = availableTimeSlots.find(
    (dateSlots) => 
      dateSlots.date.toDateString() === selectedDate.toDateString()
  )?.slots || [];

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    try {
      let recurrenceRule;
      
      // Generate recurrence rule for recurring bookings
      if (data.bookingMode === 'recurring' && data.recurrenceFrequency) {
        recurrenceRule = generateRecurrenceRule(
          data.recurrenceFrequency,
          data.recurrenceInterval || 1,
          data.recurrenceCount,
          data.recurrenceEndDate
        );
      }
      
      // Check for booking conflicts
      // Note: In a real app, you'd fetch existing bookings from your database
      const mockExistingBookings = []; // This would come from your API
      
      const conflictCheck = await checkBookingConflict(
        facilityId,
        data.date,
        data.timeSlot,
        data.bookingMode,
        data.bookingMode === 'one-time' ? undefined : (data.endDate || data.recurrenceEndDate),
        recurrenceRule,
        mockExistingBookings
      );
      
      if (conflictCheck.hasConflict) {
        toast({
          title: "Konflikt med eksisterende reservasjon",
          description: "Den valgte tiden overlapper med en eksisterende reservasjon. Vennligst velg en annen tid.",
          variant: "destructive",
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }
      
      // In a real app, this would send the data to a backend API
      console.log("Booking data:", {
        ...data,
        recurrenceRule,
        facilityId
      });
      
      toast({
        title: "Reservasjon sendt",
        description: `Din reservasjon av ${facilityName} ${format(data.date, "EEEE d. MMMM", { locale: nb })} kl. ${data.timeSlot} er mottatt.`,
        duration: 5000,
      });
      
      onCompleteBooking();
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Feil",
        description: "Det oppstod en feil under innsending av reservasjonen. Vennligst prøv igjen.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToNextStep = async () => {
    if (currentStep === 'details') {
      // Validate only the details fields
      const detailsFields = ['bookingMode', 'date', 'timeSlot', 'purpose', 'attendees'];
      
      // Add conditional fields based on booking mode
      if (bookingMode === 'date-range') {
        detailsFields.push('endDate');
      } else if (bookingMode === 'recurring') {
        detailsFields.push('recurrenceFrequency', 'recurrenceInterval');
        
        // Either end date or count must be provided
        if (form.getValues('recurrenceEndDate')) {
          detailsFields.push('recurrenceEndDate');
        } else {
          detailsFields.push('recurrenceCount');
        }
      }
      
      const detailsResult = await form.trigger(detailsFields as any);
      if (detailsResult) {
        setCurrentStep('contact');
        setFormProgress(2);
      }
    } else if (currentStep === 'contact') {
      // Validate only the contact fields
      const contactResult = await form.trigger(['contactName', 'contactEmail', 'contactPhone', 'organization']);
      if (contactResult) {
        setCurrentStep('confirm');
        setFormProgress(3);
      }
    } else if (currentStep === 'confirm') {
      form.handleSubmit(onSubmit)();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 'contact') {
      setCurrentStep('details');
      setFormProgress(1);
    } else if (currentStep === 'confirm') {
      setCurrentStep('contact');
      setFormProgress(2);
    }
  };

  // Now we ensure we're passing a complete BookingData object with all required properties
  const getBookingDataForSummary = (): BookingData => {
    const values = form.getValues();
    
    // Construct a recurrence description based on frequency and interval
    let recurrenceDescription = '';
    if (values.bookingMode === 'recurring' && values.recurrenceFrequency) {
      recurrenceDescription = getRecurrenceDescription(
        values.recurrenceFrequency,
        values.recurrenceInterval || 1
      );
    }
    
    return {
      bookingMode: values.bookingMode,
      date: values.date,
      timeSlot: values.timeSlot || "",
      purpose: values.purpose || "",
      attendees: values.attendees || 0,
      contactName: values.contactName || "",
      contactEmail: values.contactEmail || "",
      contactPhone: values.contactPhone || "",
      organization: values.organization,
      endDate: values.bookingMode === 'date-range' ? values.endDate : 
               values.bookingMode === 'recurring' ? values.recurrenceEndDate : 
               undefined,
      recurrenceRule: values.bookingMode === 'recurring' && values.recurrenceFrequency ? 
        generateRecurrenceRule(
          values.recurrenceFrequency,
          values.recurrenceInterval || 1,
          values.recurrenceCount,
          values.recurrenceEndDate
        ) : undefined,
      recurrenceDescription
    };
  };

  const getBookingModeDescription = (mode: 'one-time' | 'date-range' | 'recurring') => {
    switch (mode) {
      case 'one-time':
        return 'Reserver for en enkelt dag og tidsintervall.';
      case 'date-range':
        return 'Reserver for flere påfølgende dager i samme tidsintervall.';
      case 'recurring':
        return 'Opprett en gjentagende reservasjon med fast mønster.';
      default:
        return '';
    }
  };

  // Calculate default end date suggestion (1 week from start)
  const suggestedEndDate = addDays(selectedDate, 7);

  return (
    <div className="space-y-6">
      {/* Stepper UI - Enhanced with progress bar */}
      <div className="mb-8">
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-300" 
            style={{ width: `${(formProgress / 3) * 100}%` }}
          ></div>
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between">
          <div className="flex flex-col items-center">
            <div 
              className={`rounded-full w-10 h-10 flex items-center justify-center border-2 transition-colors
                ${currentStep === 'details' 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-white border-blue-600 text-blue-600'}`}
            >
              1
            </div>
            <span className="text-xs mt-1 font-medium">Detaljer</span>
          </div>
          <div className="flex-1 border-t-2 border-blue-200 mt-5 mx-2"></div>
          <div className="flex flex-col items-center">
            <div 
              className={`rounded-full w-10 h-10 flex items-center justify-center border-2 transition-colors
                ${currentStep === 'contact' 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : formProgress > 1 
                    ? 'bg-white border-blue-600 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-400'}`}
            >
              2
            </div>
            <span className="text-xs mt-1 font-medium">Kontakt</span>
          </div>
          <div className="flex-1 border-t-2 border-blue-200 mt-5 mx-2"></div>
          <div className="flex flex-col items-center">
            <div 
              className={`rounded-full w-10 h-10 flex items-center justify-center border-2 transition-colors
                ${currentStep === 'confirm' 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : formProgress > 2 
                    ? 'bg-white border-blue-600 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-400'}`}
            >
              3
            </div>
            <span className="text-xs mt-1 font-medium">Bekreft</span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {/* Step 1: Details */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-medium">Reservasjonsdetaljer</h3>
              </div>
              
              {/* Booking Mode Selection - Enhanced with icons and cards */}
              <FormField
                control={form.control}
                name="bookingMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Velg type reservasjon</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2"
                      >
                        <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all
                          ${field.value === 'one-time' 
                            ? 'border-blue-600 bg-blue-50/50' 
                            : 'border-gray-200 hover:border-blue-200'}`}
                        >
                          <FormItem className="flex flex-col items-center space-y-2 space-x-0">
                            <FormControl>
                              <RadioGroupItem value="one-time" className="sr-only" />
                            </FormControl>
                            <CalendarDays className="h-8 w-8 text-blue-600" />
                            <FormLabel className="font-medium text-center cursor-pointer">
                              Enkelt dag
                            </FormLabel>
                            <p className="text-xs text-center text-gray-500">
                              {getBookingModeDescription('one-time')}
                            </p>
                          </FormItem>
                        </div>
                        
                        <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all
                          ${field.value === 'date-range' 
                            ? 'border-blue-600 bg-blue-50/50' 
                            : 'border-gray-200 hover:border-blue-200'}`}
                        >
                          <FormItem className="flex flex-col items-center space-y-2 space-x-0">
                            <FormControl>
                              <RadioGroupItem value="date-range" className="sr-only" />
                            </FormControl>
                            <CalendarRange className="h-8 w-8 text-blue-600" />
                            <FormLabel className="font-medium text-center cursor-pointer">
                              Datointervall
                            </FormLabel>
                            <p className="text-xs text-center text-gray-500">
                              {getBookingModeDescription('date-range')}
                            </p>
                          </FormItem>
                        </div>
                        
                        <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all
                          ${field.value === 'recurring' 
                            ? 'border-blue-600 bg-blue-50/50' 
                            : 'border-gray-200 hover:border-blue-200'}`}
                        >
                          <FormItem className="flex flex-col items-center space-y-2 space-x-0">
                            <FormControl>
                              <RadioGroupItem value="recurring" className="sr-only" />
                            </FormControl>
                            <Repeat className="h-8 w-8 text-blue-600" />
                            <FormLabel className="font-medium text-center cursor-pointer">
                              Gjentakende
                            </FormLabel>
                            <p className="text-xs text-center text-gray-500">
                              {getBookingModeDescription('recurring')}
                            </p>
                          </FormItem>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-1.5 mb-2">
                          <CalendarDays className="h-4 w-4 text-blue-600" />
                          {bookingMode === 'date-range' ? 'Startdato' : bookingMode === 'recurring' ? 'Første dato' : 'Dato'}
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal flex justify-between items-center h-10"
                              >
                                {format(field.value, "EEEE d. MMMM yyyy", { locale: nb })}
                                <CalendarDays className="h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => date && field.onChange(date)}
                              className="rounded border shadow-sm p-3 pointer-events-auto"
                              disabled={(date) => {
                                // Disable dates without available slots and past dates
                                const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                                const hasNoSlots = !availableTimeSlots.some(
                                  (dateSlots) => dateSlots.date.toDateString() === date.toDateString()
                                );
                                return isPastDate || hasNoSlots;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Kun datoer med ledige tider vises.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* End date for date range mode */}
                  {bookingMode === 'date-range' && (
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col mt-4">
                          <FormLabel className="flex items-center gap-1.5 mb-2">
                            <CalendarDays className="h-4 w-4 text-blue-600" />
                            Sluttdato
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full pl-3 text-left font-normal flex justify-between items-center h-10"
                                >
                                  {field.value ? format(field.value, "EEEE d. MMMM yyyy", { locale: nb }) : format(suggestedEndDate, "EEEE d. MMMM yyyy", { locale: nb })}
                                  <CalendarDays className="h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value || suggestedEndDate}
                                onSelect={(date) => date && field.onChange(date)}
                                className="rounded border shadow-sm p-3 pointer-events-auto"
                                disabled={(date) => {
                                  return date < selectedDate;
                                }}
                                defaultMonth={selectedDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Må være etter startdatoen.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="flex flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 mb-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          Tidsintervall
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Velg tidspunkt" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSlotsForDate.filter(slot => slot.available).length > 0 ? (
                              availableSlotsForDate
                                .filter(slot => slot.available)
                                .map((slot, i) => (
                                  <SelectItem key={i} value={`${slot.start}-${slot.end}`}>
                                    {slot.start} - {slot.end}
                                  </SelectItem>
                                ))
                            ) : (
                              <SelectItem disabled value="no-slots">
                                Ingen ledige tidspunkter denne dagen
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {bookingMode === 'date-range' 
                            ? 'Samme tidsintervall brukes for alle dager i perioden.' 
                            : bookingMode === 'recurring' 
                              ? 'Samme tidsintervall brukes for alle gjentagelser.' 
                              : 'Kun ledige tider vises.'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="attendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          Antall deltakere
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            min={1} 
                            max={maxCapacity} 
                            className="h-10"
                          />
                        </FormControl>
                        <FormDescription className="flex items-center">
                          <span>Maksimal kapasitet: {maxCapacity} personer</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <HelpCircle className="h-4 w-4 text-blue-600 ml-1 inline cursor-help" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Antall deltakere hjelper oss å sørge for at lokalet er riktig klargjort.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Recurring booking options - Enhanced UI */}
                  {bookingMode === 'recurring' && (
                    <>
                      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-2">
                        <h4 className="font-medium text-blue-700 flex items-center mb-2">
                          <Repeat className="h-4 w-4 mr-1" />
                          Gjentagelsesinnstillinger
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="recurrenceFrequency"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Frekvens</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Velg frekvens" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="daily">Daglig</SelectItem>
                                      <SelectItem value="weekly">Ukentlig</SelectItem>
                                      <SelectItem value="monthly">Månedlig</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="recurrenceInterval"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Intervall</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      min={1} 
                                      max={30}
                                      className="h-9"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    {recurrenceFrequency === 'daily' && 'Hver X dag'}
                                    {recurrenceFrequency === 'weekly' && 'Hver X uke'}
                                    {recurrenceFrequency === 'monthly' && 'Hver X måned'}
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="pt-2 border-t border-blue-100">
                            <FormLabel className="text-sm mb-2 block">Gjentagelsen avsluttes:</FormLabel>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="recurrenceCount"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="flex items-center gap-2">
                                      <FormLabel className="text-sm whitespace-nowrap mb-0">Etter</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          {...field} 
                                          min={1} 
                                          max={100}
                                          disabled={!!recurrenceEndDate}
                                          placeholder="10"
                                          className="h-9"
                                        />
                                      </FormControl>
                                      <span className="text-sm">ganger</span>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="recurrenceEndDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="flex items-center gap-2">
                                      <FormLabel className="text-sm whitespace-nowrap mb-0">På dato</FormLabel>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <FormControl>
                                            <Button
                                              variant={field.value ? "outline" : "secondary"}
                                              className="h-9 px-3"
                                              onClick={() => {
                                                if (!field.value) {
                                                  // Default to 3 months in the future if not set
                                                  field.onChange(addMonths(new Date(), 3));
                                                  form.setValue('recurrenceCount', undefined);
                                                }
                                              }}
                                            >
                                              {field.value 
                                                ? format(field.value, "dd.MM.yy") 
                                                : <PlusCircle className="h-4 w-4 mr-1" />
                                              }
                                            </Button>
                                          </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={(date) => {
                                              field.onChange(date);
                                              if (date) {
                                                form.setValue('recurrenceCount', undefined);
                                              }
                                            }}
                                            disabled={(date) => date <= selectedDate}
                                            initialFocus
                                            className="rounded p-3 pointer-events-auto"
                                          />
                                        </PopoverContent>
                                      </Popover>
                                      {field.value && (
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="h-6 w-6 p-0 rounded-full"
                                          onClick={() => field.onChange(undefined)}
                                        >
                                          ×
                                        </Button>
                                      )}
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <p className="text-xs text-blue-700 mt-2">
                              Velg enten antall ganger eller sluttdato for gjentagelsen.
                            </p>
                          </div>
                          
                          {/* Preview of recurrence pattern */}
                          {(recurrenceFrequency && recurrenceInterval) && (
                            <div className="text-sm mt-2 bg-blue-100 p-2 rounded text-blue-800">
                              <span className="font-medium">Mønster:</span> {getRecurrenceDescription(
                                recurrenceFrequency,
                                recurrenceInterval
                              )}
                              {recurrenceEndDate && (
                                <span> til {format(recurrenceEndDate, "d. MMMM yyyy", { locale: nb })}</span>
                              )}
                              {recurrenceCount && (
                                <span> for {recurrenceCount} ganger</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 mb-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      Formål med reservasjonen
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Beskriv aktiviteten eller arrangementet som skal gjennomføres" 
                        className="min-h-[100px] resize-y" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Gi en kort beskrivelse av hva lokalet skal brukes til. Dette hjelper administrasjonen å vurdere reservasjonen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 2: Contact */}
          {currentStep === 'contact' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-medium">Kontaktinformasjon</h3>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
                <p className="text-blue-700 text-sm">
                  Kontaktinformasjonen brukes for å sende bekreftelser og viktige oppdateringer om reservasjonen din.
                </p>
              </div>
              
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 mb-2">
                      <User className="h-4 w-4 text-blue-600" />
                      Navn
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ditt navn" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 mb-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        E-post
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="din.epost@eksempel.no" 
                          {...field} 
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 mb-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        Telefon
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="99999999" {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 mb-2">
                      <Building className="h-4 w-4 text-blue-600" />
                      Organisasjon (valgfritt)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Navn på organisasjon, lag eller forening" 
                        {...field} 
                        className="h-10"
                      />
                    </FormControl>
                    <FormDescription>
                      Fyll ut hvis du representerer en organisasjon.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 'confirm' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="text-xl font-medium">Bekreft reservasjon</h3>
              </div>
              
              <BookingSummary
                facilityName={facilityName}
                bookingData={getBookingDataForSummary()}
              />
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  Ved å sende inn denne reservasjonen bekrefter du at informasjonen er korrekt og at du aksepterer våre vilkår og betingelser for bruk av kommunale lokaler.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t border-gray-200">
            {currentStep !== 'details' ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={goToPreviousStep} 
                disabled={isSubmitting}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Tilbake
              </Button>
            ) : (
              <div></div> // Empty div to maintain layout with flex justify-between
            )}
            
            <Button 
              type="button" 
              onClick={goToNextStep}
              className="bg-blue-600 hover:bg-blue-700 gap-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                  Sender...
                </>
              ) : currentStep === 'confirm' ? (
                <>
                  Send inn reservasjon
                  <CheckCircle className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Neste
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

import { User, Mail, Phone, Building, ChevronLeft, ChevronRight } from "lucide-react";
