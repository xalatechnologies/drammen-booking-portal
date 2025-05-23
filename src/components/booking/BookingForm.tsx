
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays } from "date-fns";
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
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Clock, Users, Info, CheckCircle, CalendarRange, Repeat } from "lucide-react";
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
      if (detailsResult) setCurrentStep('contact');
    } else if (currentStep === 'contact') {
      // Validate only the contact fields
      const contactResult = await form.trigger(['contactName', 'contactEmail', 'contactPhone', 'organization']);
      if (contactResult) setCurrentStep('confirm');
    } else if (currentStep === 'confirm') {
      form.handleSubmit(onSubmit)();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 'contact') setCurrentStep('details');
    else if (currentStep === 'confirm') setCurrentStep('contact');
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

  return (
    <div className="space-y-6">
      {/* Stepper UI */}
      <div className="flex justify-between mb-6">
        <div className="flex flex-col items-center">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === 'details' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
            1
          </div>
          <span className="text-xs mt-1">Detaljer</span>
        </div>
        <div className="flex-1 border-t border-gray-200 mt-4 mx-2"></div>
        <div className="flex flex-col items-center">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === 'contact' ? 'bg-blue-600 text-white' : currentStep === 'confirm' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
            2
          </div>
          <span className="text-xs mt-1">Kontakt</span>
        </div>
        <div className="flex-1 border-t border-gray-200 mt-4 mx-2"></div>
        <div className="flex flex-col items-center">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === 'confirm' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            3
          </div>
          <span className="text-xs mt-1">Bekreft</span>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {/* Step 1: Details */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Reservasjonsdetaljer</h3>
              </div>
              
              {/* Booking Mode Selection */}
              <FormField
                control={form.control}
                name="bookingMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type reservasjon</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="one-time" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1 text-blue-600" />
                            Enkelt dag
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="date-range" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer flex items-center">
                            <CalendarRange className="h-4 w-4 mr-1 text-blue-600" />
                            Datointervall
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="recurring" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer flex items-center">
                            <Repeat className="h-4 w-4 mr-1 text-blue-600" />
                            Gjentakende
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      {bookingMode === 'one-time' && "Velg en enkelt dag og tidsintervall."}
                      {bookingMode === 'date-range' && "Reserver for flere påfølgende dager."}
                      {bookingMode === 'recurring' && "Gjenta reservasjonen på valgt intervall."}
                    </FormDescription>
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
                        <FormLabel className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 text-blue-600" />
                          {bookingMode === 'date-range' ? 'Startdato' : bookingMode === 'recurring' ? 'Første dato' : 'Dato'}
                        </FormLabel>
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
                        />
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
                          <FormLabel className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4 text-blue-600" />
                            Sluttdato
                          </FormLabel>
                          <Calendar
                            mode="single"
                            selected={field.value || addDays(selectedDate, 1)}
                            onSelect={(date) => date && field.onChange(date)}
                            className="rounded border shadow-sm p-3 pointer-events-auto"
                            disabled={(date) => {
                              // Disable dates before selected start date
                              return date < selectedDate;
                            }}
                          />
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
                        <FormLabel className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-blue-600" />
                          Tidsintervall
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                          Kun ledige tider vises.
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
                        <FormLabel className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-blue-600" />
                          Antall deltakere
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min={1} max={maxCapacity} />
                        </FormControl>
                        <FormDescription>
                          Maksimal kapasitet: {maxCapacity} personer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Recurring booking options */}
                  {bookingMode === 'recurring' && (
                    <>
                      <FormField
                        control={form.control}
                        name="recurrenceFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frekvens</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
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
                            <FormLabel>Intervall</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                min={1} 
                                max={30} 
                              />
                            </FormControl>
                            <FormDescription>
                              {recurrenceFrequency === 'daily' && 'Antall dager mellom hver forekomst'}
                              {recurrenceFrequency === 'weekly' && 'Antall uker mellom hver forekomst'}
                              {recurrenceFrequency === 'monthly' && 'Antall måneder mellom hver forekomst'}
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="recurrenceCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Antall ganger</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  min={1} 
                                  max={100}
                                  disabled={!!recurrenceEndDate}
                                  placeholder="F.eks. 10"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="recurrenceEndDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sluttdato</FormLabel>
                              <FormControl>
                                <input 
                                  type="date" 
                                  className="w-full px-3 py-2 border rounded-md"
                                  value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                  onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : undefined;
                                    field.onChange(date);
                                    // Clear count if end date is set
                                    if (date) {
                                      form.setValue('recurrenceCount', undefined);
                                    }
                                  }}
                                  min={format(addDays(selectedDate, 1), 'yyyy-MM-dd')}
                                />
                              </FormControl>
                              <FormDescription>
                                Velg enten antall ganger eller sluttdato
                              </FormDescription>
                            </FormItem>
                          )}
                        />
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
                    <FormLabel>Formål med reservasjonen</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Beskriv aktiviteten eller arrangementet som skal gjennomføres" 
                        className="min-h-[100px]" 
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
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Kontaktinformasjon</h3>
              </div>
              
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Navn</FormLabel>
                    <FormControl>
                      <Input placeholder="Ditt navn" {...field} />
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
                      <FormLabel>E-post</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="din.epost@eksempel.no" {...field} />
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
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="99999999" {...field} />
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
                    <FormLabel>Organisasjon (valgfritt)</FormLabel>
                    <FormControl>
                      <Input placeholder="Navn på organisasjon, lag eller forening" {...field} />
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
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium">Bekreft reservasjon</h3>
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
              <Button type="button" variant="outline" onClick={goToPreviousStep} disabled={isSubmitting}>
                Tilbake
              </Button>
            ) : (
              <div></div> // Empty div to maintain layout with flex justify-between
            )}
            
            <Button 
              type="button" 
              onClick={goToNextStep}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sender...' : currentStep === 'confirm' ? 'Send inn reservasjon' : 'Neste'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
