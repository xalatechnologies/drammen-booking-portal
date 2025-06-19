
import React from "react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";

export function FaqTab() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <Card className="p-6 border-2 border-blue-200 bg-blue-50">
        <h3 className="font-bold text-2xl mb-6 flex items-center gap-3 text-blue-800">
          <HelpCircle className="h-7 w-7 text-blue-600" />
          {t('facility.tabs.faq.title')}
        </h3>
        <p className="text-base text-blue-700 mb-6 leading-relaxed">
          {t('facility.tabs.faq.description')}
        </p>
        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem value="booking-hours" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              {t('facility.tabs.faq.bookingHours.question')}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                {t('facility.tabs.faq.bookingHours.answer')}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cancellation" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              {t('facility.tabs.faq.cancellation.question')}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                {t('facility.tabs.faq.cancellation.answer')}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="equipment" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              {t('facility.tabs.faq.equipment.question')}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                {t('facility.tabs.faq.equipment.answer')}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="payment" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              {t('facility.tabs.faq.payment.question')}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                {t('facility.tabs.faq.payment.answer')}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="access" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              {t('facility.tabs.faq.access.question')}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                {t('facility.tabs.faq.access.answer')}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="group-size" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              {t('facility.tabs.faq.groupSize.question')}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                {t('facility.tabs.faq.groupSize.answer')}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cleaning" className="border border-blue-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
              {t('facility.tabs.faq.cleaning.question')}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-base text-gray-700 leading-relaxed">
                {t('facility.tabs.faq.cleaning.answer')}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
