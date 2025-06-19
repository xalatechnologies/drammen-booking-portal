
import React from "react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";

export function RulesTab() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <Card className="p-6 border-2 border-orange-200 bg-orange-50">
        <h3 className="font-bold text-2xl mb-6 flex items-center gap-3 text-orange-800">
          <Shield className="h-7 w-7 text-orange-600" />
          {t('facility.tabs.rules.title')}
        </h3>
        <p className="text-base text-orange-700 mb-6 leading-relaxed">
          {t('facility.tabs.rules.description')}
        </p>
        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem value="safety-rules" className="border border-orange-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-orange-800 hover:text-orange-900 py-4">
              {t('facility.tabs.rules.safetyRules.title')}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-3 text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>{t('facility.tabs.rules.safetyRules.indoorShoes')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>{t('facility.tabs.rules.safetyRules.reportDamage')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>{t('facility.tabs.rules.safetyRules.firstAid')}</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="capacity-rules" className="border border-orange-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-orange-800 hover:text-orange-900 py-4">
              {t('facility.tabs.rules.capacityRules.title')}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-3 text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>{t('facility.tabs.rules.capacityRules.respectCapacity')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>{t('facility.tabs.rules.capacityRules.cleanUp')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>{t('facility.tabs.rules.capacityRules.musicLevel')}</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="prohibited" className="border border-orange-300 rounded-lg px-4 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-semibold text-orange-800 hover:text-orange-900 py-4">
              {t('facility.tabs.rules.prohibited.title')}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-3 text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>{t('facility.tabs.rules.prohibited.smokingAlcohol')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>{t('facility.tabs.rules.prohibited.foodDrink')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>{t('facility.tabs.rules.prohibited.pets')}</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
