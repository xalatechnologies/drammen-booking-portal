
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BookingFormValues } from '@/components/booking/formSchema';
import { ServiceCategoryGrid } from '../services/ServiceCategoryGrid';
import { ServiceSelectionCard } from '../services/ServiceSelectionCard';
import { ServiceSummary } from '../services/ServiceSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceCategory, AdditionalService } from '@/types/additionalServices';
import { useAdditionalServices, useServicePricing } from '@/hooks/useAdditionalServices';
import { useTranslation } from '@/i18n';

interface BookingServicesStepProps {
  form: UseFormReturn<BookingFormValues>;
  facilityId: string;
  actorType?: string;
  attendees?: number;
}

interface SelectedService {
  service: AdditionalService;
  quantity: number;
  totalPrice: number;
}

export function BookingServicesStep({
  form,
  facilityId,
  actorType = 'private-person',
  attendees
}: BookingServicesStepProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>();
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});
  const [calculatedServices, setCalculatedServices] = useState<SelectedService[]>([]);
  const [totalServicesCost, setTotalServicesCost] = useState(0);

  const { services, isLoading } = useAdditionalServices(facilityId, selectedCategory);
  const { calculateServicePrice } = useServicePricing();

  // Update calculated services when selections change
  useEffect(() => {
    const updateCalculatedServices = async () => {
      const newCalculatedServices: SelectedService[] = [];
      let total = 0;

      for (const [serviceId, quantity] of Object.entries(selectedServices)) {
        if (quantity > 0) {
          const service = services.find(s => s.id === serviceId);
          if (service) {
            const result = await calculateServicePrice(
              serviceId,
              quantity,
              actorType as any,
              attendees
            );

            if (result.success && result.data) {
              const serviceData: SelectedService = {
                service,
                quantity,
                totalPrice: result.data.totalPrice
              };
              newCalculatedServices.push(serviceData);
              total += result.data.totalPrice;
            }
          }
        }
      }

      setCalculatedServices(newCalculatedServices);
      setTotalServicesCost(total);
    };

    updateCalculatedServices();
  }, [selectedServices, services, actorType, attendees]);

  // Update form with selected services
  useEffect(() => {
    const serviceIds = Object.entries(selectedServices)
      .filter(([_, quantity]) => quantity > 0)
      .map(([serviceId]) => serviceId);
    
    form.setValue('specialServices', serviceIds);
  }, [selectedServices, form]);

  const handleQuantityChange = (serviceId: string, quantity: number) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: quantity
    }));
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(prev => {
      const updated = { ...prev };
      delete updated[serviceId];
      return updated;
    });
  };

  const clearAllServices = () => {
    setSelectedServices({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('booking.steps.services', {}, 'Ekstra tjenester')}
        </h2>
        <p className="text-gray-600">
          {t('booking.steps.servicesDescription', {}, 'Velg tilleggstjenester for ditt arrangement')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={selectedCategory || 'categories'} onValueChange={(value) => 
            setSelectedCategory(value === 'categories' ? undefined : value as ServiceCategory)
          }>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="categories">
                {t('services.categories', {}, 'Kategorier')}
              </TabsTrigger>
              <TabsTrigger value="cleaning">
                {t('services.cleaning', {}, 'Rengjøring')}
              </TabsTrigger>
              <TabsTrigger value="equipment">
                {t('services.equipment', {}, 'Utstyr')}
              </TabsTrigger>
              <TabsTrigger value="catering">
                {t('services.catering', {}, 'Servering')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-4">
              <ServiceCategoryGrid
                onCategorySelect={setSelectedCategory}
                selectedCategory={selectedCategory}
                showPopularOnly={true}
              />
            </TabsContent>

            {(['cleaning', 'equipment', 'catering', 'personnel', 'parking'] as ServiceCategory[]).map(category => (
              <TabsContent key={category} value={category} className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">
                      {t('common.loading', {}, 'Laster...')}
                    </p>
                  </div>
                ) : services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map(service => (
                      <ServiceSelectionCard
                        key={service.id}
                        service={service}
                        actorType={actorType as any}
                        attendees={attendees}
                        selectedQuantity={selectedServices[service.id] || 0}
                        onQuantityChange={handleQuantityChange}
                        isSelected={(selectedServices[service.id] || 0) > 0}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">
                        {t('services.noServicesAvailable', {}, 'Ingen tjenester tilgjengelig i denne kategorien')}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Service Summary Sidebar */}
        <div className="space-y-4">
          <ServiceSummary
            selectedServices={calculatedServices}
            onRemoveService={handleRemoveService}
            totalServicesCost={totalServicesCost}
          />

          {calculatedServices.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAllServices}
              className="w-full"
            >
              {t('services.clearAll', {}, 'Fjern alle tjenester')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
