import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Zone } from "@/components/booking/types";

const bookingFormSchema = z.object({
  name: z.string().min(2, {
    message: "Navn må være minst 2 bokstaver.",
  }),
  email: z.string().email({
    message: "Ugyldig e-postadresse.",
  }),
  phone: z.string().min(8, {
    message: "Telefonnummer må være minst 8 siffer.",
  }),
  date: z.date({
    required_error: "En dato må velges.",
  }),
  time: z.string().min(1, {
    message: "En tid må velges.",
  }),
  message: z.string().optional(),
  terms: z.boolean().refine((value) => value === true, {
    message: 'Du må godta vilkårene for å fortsette',
  }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  facility: any; // Replace 'any' with the actual type of 'facility'
  selectedZoneId: string;
  onClose: () => void;
}

interface BookingData extends BookingFormValues {
  selectedZone: Zone;
}

export function BookingForm({ facility, selectedZoneId, onClose }: BookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedZone = facility.zones.find((zone: Zone) => zone.id === selectedZoneId);

  if (!selectedZone) {
    return <div>Selected zone not found.</div>;
  }

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: date || new Date(),
      time: "",
      message: "",
      terms: false,
    },
  });

  const handleSubmit = (data: BookingData) => {
    console.log('Booking submitted:', { ...data, selectedZone });
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Navn</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn ditt navn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-post</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn din e-post" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn ditt telefonnummer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Dato</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Velg en dato</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tid</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg en tid" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="08:00-10:00">08:00-10:00</SelectItem>
                  <SelectItem value="10:00-12:00">10:00-12:00</SelectItem>
                  <SelectItem value="12:00-14:00">12:00-14:00</SelectItem>
                  <SelectItem value="14:00-16:00">14:00-16:00</SelectItem>
                  <SelectItem value="16:00-18:00">16:00-18:00</SelectItem>
                  <SelectItem value="18:00-20:00">18:00-20:00</SelectItem>
                  <SelectItem value="20:00-22:00">20:00-22:00</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Melding</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Skriv inn din melding"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Input type="checkbox" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Bekreft at du har lest og godtar våre{" "}
                  <a href="#" className="underline underline-offset-2">
                    vilkår og betingelser
                  </a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Send inn</Button>
      </form>
    </Form>
  );
}
