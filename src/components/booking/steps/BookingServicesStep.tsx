
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BookingFormValues } from '@/components/booking/formSchema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ServiceCategory, AdditionalService } from '@/types/additionalServices';
import { useAdditionalServices, useServicePricing } from '@/hooks/useAdditionalServices';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useModelTranslation } from '@/hooks/useModelTranslation';
import { AlertTriangle } from 'lucide-react';
import { ServiceCategorySection } from './sections/ServiceCategorySection';
import { ServiceSelectionGridSection } from './sections/ServiceSelectionGridSection';
import { ServiceSummarySection } from './sections/ServiceSummarySection';

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
  const { getSectionTitle } = useModelTranslation();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>();
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});
  const [calculatedServices, setCalculatedServices] = useState<SelectedService[]>([]);
  const [totalServicesCost, setTotalServicesCost] = useState(0);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  const { services, isLoading, error } = useAdditionalServices(facilityId, selectedCategory);
  const { calculateServicePrice } = useServicePricing();

  // Update calculated services when selections change
  useEffect(() => {
    const updateCalculatedServices = async () => {
      try {
        setCalculationError(null);
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
              } else {
                setCalculationError(t('services.errors.calculationFailed', { serviceName: service.name }, `Kunne ikke beregne pris for ${service.name}`));
              }
            }
          }
        }

        setCalculatedServices(newCalculatedServices);
        setTotalServicesCost(total);
      } catch (error) {
        console.error('Error calculating service prices:', error);
        setCalculationError(t('services.errors.calculationError', {}, 'En feil oppstod ved beregning av priser'));
      }
    };

    updateCalculatedServices();
  }, [selectedServices, services, actorType, attendees, calculateServicePrice, t]);

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
    setCalculationError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {getSectionTitle('booking', 'services')}
        </h2>
        <p className="text-gray-600">
          {t('booking.steps.servicesDescription', {}, 'Velg tilleggstjenester for ditt arrangement')}
        </p>
      </div>

      {/* Error Display */}
      {(error || calculationError) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {calculationError || (error as any)?.message || t('common.messages.error', {}, 'En feil oppstod')}
          </AlertDescription>
        </Alert>
      )}

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
              <ServiceCategorySection
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </TabsContent>

            {(['cleaning', 'equipment', 'catering', 'personnel', 'parking'] as ServiceCategory[]).map(category => (
              <TabsContent key={category} value={category} className="space-y-4">
                <ServiceSelectionGridSection
                  services={services}
                  isLoading={isLoading}
                  actorType={actorType}
                  attendees={attendees}
                  selectedServices={selectedServices}
                  onQuantityChange={handleQuantityChange}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Service Summary Sidebar */}
        <div className="space-y-4">
          <ServiceSummarySection
            calculatedServices={calculatedServices}
            totalServicesCost={totalServicesCost}
            onRemoveService={handleRemoveService}
            onClearAll={clearAllServices}
          />
        </div>
      </div>
    </div>
  );
}
