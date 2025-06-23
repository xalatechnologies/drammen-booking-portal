import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, MapPin, Clock, Send } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// Mock data
let mockSubscriptions = [
    { id: 1, location: 'Drammenshallen', days: ['monday', 'wednesday'], allDay: true, startTime: '', endTime: '', delivery: ['email', 'inApp'] },
    { id: 2, location: 'Åssiden vgs - Gymsal', days: [], allDay: false, startTime: '17:00', endTime: '22:00', delivery: ['sms'] },
];
const mockLocations = [
    { value: 'Drammenshallen', label: 'Drammenshallen' },
    { value: 'Fjellhallen', label: 'Fjellhallen' },
    { value: 'Åssiden vgs - Gymsal', label: 'Åssiden vgs - Gymsal' },
    { value: 'Konnerudhallen', label: 'Konnerudhallen' },
    { value: 'Brandengen Skole - Gymsal', label: 'Brandengen Skole - Gymsal' },
];

const initialSubscriptionState = {
    id: null,
    location: '',
    days: [],
    allDay: true,
    startTime: '17:00',
    endTime: '22:00',
    delivery: ['email'],
};

const NotificationsPage = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentSubscription, setCurrentSubscription] = useState<any>(initialSubscriptionState);

    const { data: subscriptions, isLoading } = useQuery({
        queryKey: ['notification-subscriptions'],
        queryFn: async () => mockSubscriptions,
    });

    const mutation = useMutation({
        mutationFn: async (subscription: any) => {
            if (subscription.id) {
                // Update
                mockSubscriptions = mockSubscriptions.map(s => s.id === subscription.id ? subscription : s);
            } else {
                // Create
                mockSubscriptions.push({ ...subscription, id: Math.max(...mockSubscriptions.map(s => s.id), 0) + 1 });
            }
            return subscription;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notification-subscriptions'] });
            toast.success(t('user.notifications.subscriptionSaved'));
            setIsDialogOpen(false);
        },
        onError: () => toast.error(t('user.notifications.error'))
    });
    
    const removeMutation = useMutation({
        mutationFn: async (id: number) => {
            mockSubscriptions = mockSubscriptions.filter(s => s.id !== id);
        },
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['notification-subscriptions'] });
             toast.success(t('user.notifications.subscriptionRemoved'));
        }
    });

    const handleOpenDialog = (subscription?: any) => {
        setCurrentSubscription(subscription ? subscription : initialSubscriptionState);
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        mutation.mutate(currentSubscription);
    };

    const handleFieldChange = (field: string, value: any) => {
        setCurrentSubscription((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleDayToggle = (day: string) => {
        const newDays = currentSubscription.days.includes(day)
            ? currentSubscription.days.filter((d: string) => d !== day)
            : [...currentSubscription.days, day];
        handleFieldChange('days', newDays);
    };
    
    const handleDeliveryToggle = (method: string) => {
        const newDelivery = currentSubscription.delivery.includes(method)
            ? currentSubscription.delivery.filter((d: string) => d !== method)
            : [...currentSubscription.delivery, method];
        handleFieldChange('delivery', newDelivery);
    };

    // @ts-ignore
    const weekdays = t('user.notifications.weekdays', { returnObjects: true });
    // @ts-ignore
    const deliveryMethods = t('user.notifications.deliveryMethods', { returnObjects: true });

    return (
        <div className="space-y-8">
            <PageHeader
                title={t('user.notifications.title')}
                description={t('user.notifications.description')}
                actions={
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('user.notifications.newSubscription')}
                    </Button>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>{t('user.notifications.mySubscriptions')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? <p>Loading...</p> : subscriptions && subscriptions.length > 0 ? (
                        <div className="space-y-4">
                            {subscriptions.map((sub: any) => (
                                <div key={sub.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1 space-y-2 mb-4 sm:mb-0">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            <p><strong>{t('user.notifications.location')}:</strong> {sub.location}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-primary" />
                                            <p><strong>{t('user.notifications.time')}:</strong> 
                                                {sub.days.length > 0 ? sub.days.map((d: string) => weekdays[d]).join(', ') : t('user.notifications.anyDay')}, 
                                                {sub.allDay ? t('user.notifications.anyTime') : `${sub.startTime}-${sub.endTime}`}
                                            </p>
                                        </div>
                                         <div className="flex items-center gap-2">
                                            <Send className="h-5 w-5 text-primary" />
                                            <p><strong>{t('user.notifications.delivery')}:</strong> {sub.delivery.map((d: string) => deliveryMethods[d]).join(', ')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" onClick={() => handleOpenDialog(sub)}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="destructive" size="icon" onClick={() => removeMutation.mutate(sub.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">{t('user.notifications.noSubscriptions')}</p>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{currentSubscription.id ? t('user.notifications.editSubscription') : t('user.notifications.newSubscription')}</DialogTitle>
                        <DialogDescription>{t('user.notifications.dialog.description')}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div>
                            <Label>{t('user.notifications.dialog.locationLabel')}</Label>
                             <Select onValueChange={(value) => handleFieldChange('location', value)} value={currentSubscription.location}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('user.notifications.dialog.locationPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockLocations.map(loc => (
                                        <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>{t('user.notifications.dialog.daysLabel')}</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {Object.entries(weekdays).map(([key, value]) => (
                                    <Button key={key} variant={currentSubscription.days.includes(key) ? "default" : "outline"} onClick={() => handleDayToggle(key)}>
                                        {value as string}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label>{t('user.notifications.dialog.timeLabel')}</Label>
                             <div className="flex items-center space-x-2 mt-2">
                                <Switch id="allDay" checked={currentSubscription.allDay} onCheckedChange={(checked) => handleFieldChange('allDay', checked)} />
                                <Label htmlFor="allDay">{t('user.notifications.dialog.allDay')}</Label>
                            </div>
                            {!currentSubscription.allDay && (
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <Label htmlFor="startTime" className="text-sm text-muted-foreground">{t('user.notifications.dialog.startTime')}</Label>
                                        <Input id="startTime" type="time" value={currentSubscription.startTime} onChange={(e) => handleFieldChange('startTime', e.target.value)} />
                                    </div>
                                     <div>
                                        <Label htmlFor="endTime" className="text-sm text-muted-foreground">{t('user.notifications.dialog.endTime')}</Label>
                                        <Input id="endTime" type="time" value={currentSubscription.endTime} onChange={(e) => handleFieldChange('endTime', e.target.value)} />
                                    </div>
                                </div>
                            )}
                        </div>

                         <div>
                            <Label>{t('user.notifications.dialog.deliveryLabel')}</Label>
                             <div className="grid grid-cols-2 gap-4 mt-2">
                                {Object.entries(deliveryMethods).map(([key, value]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox id={`delivery-${key}`} checked={currentSubscription.delivery.includes(key)} onCheckedChange={() => handleDeliveryToggle(key)} />
                                        <Label htmlFor={`delivery-${key}`} className="font-normal">{value as string}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('user.notifications.dialog.cancel')}</Button>
                        <Button onClick={handleSave} disabled={mutation.isPending}>{t('user.notifications.dialog.save')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NotificationsPage;