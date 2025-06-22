import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Facility, facilitySchema } from "@/types/facility";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useFacilityZoneStore } from '@/stores/useFacilityZoneStore';
import React from 'react';

import { OverviewSection } from "./sections/OverviewSection";
import { ManagementSection } from "./sections/ManagementSection";
import { ConfigurationSection } from "./sections/ConfigurationSection";
import { BookingAvailabilitySection } from "./sections/BookingAvailabilitySection";
import { BlackoutPeriodsManager } from './sections/BlackoutPeriodsManager';
import { OpeningHoursEditor } from './sections/OpeningHoursEditor';
import { ZoneEditor } from './sections/zones/ZoneEditor';


interface SimplifiedFacilityFormProps {
    facility?: Facility;
}

export const SimplifiedFacilityForm: React.FC<SimplifiedFacilityFormProps> = ({ facility }) => {
    const { t } = useTranslation();
    const isEditing = !!facility;
    const facilityId = facility?.id || 'new';

    const queryClient = useQueryClient();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof facilitySchema>>({
        resolver: zodResolver(facilitySchema),
        defaultValues: facility || {
            name: "",
            description: "",
            category: "sports",
            type: "football_field",
            status: "active",
            booking_confirmation_required: false,
            zones: [],
        },
    });

    // Connect the zone store to the form state
    const zones = useFacilityZoneStore((state) => state.zones);
    const initializeZones = useFacilityZoneStore((state) => state.actions.initialize);
    
    React.useEffect(() => {
        form.setValue('zones', zones);
    }, [zones, form]);

    React.useEffect(() => {
        if(facility?.zones) {
            initializeZones(facility.zones);
        }
    }, [facility, initializeZones])

    const mutation = useMutation({
        mutationFn: async (data: z.infer<typeof facilitySchema>) => {
            console.log("Submitting data:", data);
            if (isEditing) {
                console.log("Facility updated");
            } else {
                console.log("Facility created");
            }
        },
        onSuccess: () => {
            toast({
                title: isEditing ? t('admin:facility.toast.updateSuccess.title') : t('admin:facility.toast.createSuccess.title'),
                description: isEditing ? t('admin:facility.toast.updateSuccess.description') : t('admin:facility.toast.createSuccess.description'),
            });
            queryClient.invalidateQueries({ queryKey: ["facilities"] });
        },
        onError: (error) => {
            toast({
                title: t('common:error.title'),
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: z.infer<typeof facilitySchema>) => {
        console.log("Form data submitted", data);
        mutation.mutate(data);
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        {isEditing ? t('admin:facility.editTitle') : t('admin:facility.addTitle')}
                    </h1>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            {t('common:cancel')}
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? t('common:saving') : t('common:saveChanges')}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview">{t('admin:facility.tabs.overview')}</TabsTrigger>
                                <TabsTrigger value="booking">{t('admin:facility.tabs.booking')}</TabsTrigger>
                                <TabsTrigger value="zones">{t('admin:facility.tabs.zones')}</TabsTrigger>
                                <TabsTrigger value="media">{t('admin:facility.tabs.media')}</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="mt-6">
                                <OverviewSection control={form.control} />
                            </TabsContent>
                            <TabsContent value="booking" className="mt-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <BookingAvailabilitySection />
                                    </div>
                                    <div className="space-y-6">
                                        <OpeningHoursEditor facilityId={facilityId} />
                                        <BlackoutPeriodsManager />
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="zones" className="mt-6">
                                <ZoneEditor facilityId={facilityId} />
                            </TabsContent>
                            <TabsContent value="media" className="mt-6">
                                <p>Media and features management will be here.</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div className="w-full md:w-1/3 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('admin:facility.sections.management.title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ManagementSection control={form.control} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('admin:facility.sections.configuration.title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ConfigurationSection control={form.control} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
};
