
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Clock, Users, Info, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingSummary } from "./BookingSummary";

const bookingFormSchema = z.object({
  date: z.date({
    required_error: "Velg en dato for reservasjonen.",
  }),
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
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      date: new Date(),
      timeSlot: "",
      purpose: "",
      attendees: 1,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      organization: "",
    },
  });

  // Get current selected date from form
  const selectedDate = form.watch("date");
  
  // Get available time slots for the selected date
  const availableSlotsForDate = availableTimeSlots.find(
    (dateSlots) => 
      dateSlots.date.toDateString() === selectedDate.toDateString()
  )?.slots || [];

  const onSubmit = (data: BookingFormValues) => {
    // In a real app, this would send the data to a backend API
    console.log("Booking data:", data);
    
    toast({
      title: "Reservasjon sendt",
      description: `Din reservasjon av ${facilityName} ${format(data.date, "EEEE d. MMMM", { locale: nb })} kl. ${data.timeSlot} er mottatt.`,
      duration: 5000,
    });
    
    onCompleteBooking();
  };

  const goToNextStep = async () => {
    if (currentStep === 'details') {
      // Validate only the details fields
      const detailsResult = await form.trigger(['date', 'timeSlot', 'purpose', 'attendees']);
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
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 text-blue-600" />
                          Dato
                        </FormLabel>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => date && field.onChange(date)}
                          className="rounded border shadow-sm p-3 pointer-events-auto"
                          disabled={(date) => {
                            // Disable dates without available slots
                            return !availableTimeSlots.some(
                              (dateSlots) => dateSlots.date.toDateString() === date.toDateString()
                            );
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col justify-between">
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
                bookingData={form.getValues()}
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
              <Button type="button" variant="outline" onClick={goToPreviousStep}>
                Tilbake
              </Button>
            ) : (
              <div></div> // Empty div to maintain layout with flex justify-between
            )}
            
            <Button 
              type="button" 
              onClick={goToNextStep}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {currentStep === 'confirm' ? 'Send inn reservasjon' : 'Neste'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
