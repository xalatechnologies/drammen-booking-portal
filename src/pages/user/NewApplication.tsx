import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import PageHeader from '@/components/admin/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

const facilities = [
    { id: 'facility1', name: 'Drammenshallen - Bane A' },
    { id: 'facility2', name: 'Brandengen Skole - Gymsal' },
    { id: 'facility3', name: 'Fjell Skole - Aktivitetshall' },
    { id: 'facility4', name: 'Åssiden Fotballhall' },
];

const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
});

const applicationSchema = z.object({
    facilityId: z.string().min(1, "Du må velge et lokale."),
    date: z.date({ required_error: "Du må velge en dato." }),
    startTime: z.string().min(1, "Du må velge starttid."),
    endTime: z.string().min(1, "Du må velge sluttid."),
    purpose: z.string().min(5, "Formålet må være på minst 5 tegn."),
    participants: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive("Antall deltakere må være et positivt tall.")
    ),
}).refine(data => data.startTime < data.endTime, {
    message: "Sluttid må være etter starttid.",
    path: ["endTime"],
});


const NewApplicationPage = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(applicationSchema)
    });

    const onSubmit = (data: any) => {
        console.log(data);
        toast.success("Søknaden din er sendt!", {
            description: `Din forespørsel for ${facilities.find(f => f.id === data.facilityId)?.name} er mottatt og vil bli behandlet.`,
        });
    };

    return (
        <div className="space-y-8">
            <PageHeader 
                title="Ny søknad om tid"
                description="Søk om faste eller sporadiske tider i kommunens lokaler og anlegg."
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Søknadsskjema</CardTitle>
                        <CardDescription>Fyll ut detaljene under for å sende en ny bookingforespørsel.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Facility */}
                        <div className="space-y-2">
                            <Label htmlFor="facilityId">Lokale/Anlegg</Label>
                            <Controller
                                name="facilityId"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Velg et lokale..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {facilities.map(facility => (
                                                <SelectItem key={facility.id} value={facility.id}>{facility.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.facilityId && <p className="text-sm text-red-600">{errors.facilityId.message as string}</p>}
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <Label htmlFor="date">Dato</Label>
                             <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, "PPP", { locale: nb }) : <span>Velg en dato</span>}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                                locale={nb}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.date && <p className="text-sm text-red-600">{errors.date.message as string}</p>}
                        </div>

                        {/* Start Time */}
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Starttid</Label>
                             <Controller
                                name="startTime"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Velg starttid..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlots.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                             {errors.startTime && <p className="text-sm text-red-600">{errors.startTime.message as string}</p>}
                        </div>

                        {/* End Time */}
                        <div className="space-y-2">
                            <Label htmlFor="endTime">Sluttid</Label>
                            <Controller
                                name="endTime"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Velg sluttid..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlots.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                             {errors.endTime && <p className="text-sm text-red-600">{errors.endTime.message as string}</p>}
                        </div>
                        
                        {/* Purpose */}
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label htmlFor="purpose">Formål med bookingen</Label>
                            <Textarea id="purpose" {...register("purpose")} placeholder="F.eks. Håndballtrening for G16..." />
                             {errors.purpose && <p className="text-sm text-red-600">{errors.purpose.message as string}</p>}
                        </div>

                         {/* Participants */}
                         <div className="space-y-2">
                            <Label htmlFor="participants">Antall deltakere</Label>
                            <Input id="participants" type="number" {...register("participants")} placeholder="f.eks. 20" />
                            {errors.participants && <p className="text-sm text-red-600">{errors.participants.message as string}</p>}
                        </div>

                        {/* Submit */}
                        <div className="col-span-1 md:col-span-2 flex justify-end">
                            <Button type="submit">
                                <Send className="mr-2 h-4 w-4" />
                                Send søknad
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default NewApplicationPage; 