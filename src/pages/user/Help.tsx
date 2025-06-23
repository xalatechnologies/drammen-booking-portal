import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, Phone, Send } from "lucide-react";

// Mock Service for FAQ
const fetchFaqs = async () => {
  return [
    { id: 1, question: "Hvordan søker jeg om fast tid?", answer: "Du kan søke om fast tid ved å gå til 'Ny søknad' i menyen og fylle ut skjemaet. Husk å spesifisere ønsket anlegg og tidsperiode." },
    { id: 2, question: "Hva er forskjellen på strøtime og rammetid?", answer: "Rammetid er faste tider tildelt for en hel sesong, mens strøtimer er enkelttimer som blir ledige og kan bookes av hvem som helst." },
    { id: 3, question: "Hvordan kansellerer jeg en booking?", answer: "Gå til 'Mine Bookinger', finn bookingen du vil fjerne, og klikk på 'Kanseller'. Merk at det kan være frister for kansellering." },
  ];
};

// Mock Service for Contact Form
const sendContactMessage = async (formData: { name: string; email: string; message: string; }) => {
  console.log("Sending message:", formData);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate a potential error
  if (formData.email.includes("error")) {
    throw new Error("Failed to send message.");
  }
  return { success: true };
};

const HelpPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const { data: faqs, isLoading: isLoadingFaqs } = useQuery({
    queryKey: ['faqs'],
    queryFn: fetchFaqs
  });

  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      toast.success(t('user.help.contactSuccess'));
      setFormData({ name: '', email: '', message: '' });
    },
    onError: () => {
      toast.error(t('user.help.contactError'));
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('user.help.title')}
        description={t('user.help.description')}
      />

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left side: FAQ and Contact Info */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('user.help.faqTitle')}</CardTitle>
              <CardDescription>{t('user.help.faqDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingFaqs ? (
                <p>Laster...</p>
              ) : faqs && faqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map(faq => (
                    <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p>{t('user.help.noFaq')}</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('user.help.contactInfoTitle')}</CardTitle>
              <CardDescription>{t('user.help.contactInfoDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center">
                 <Phone className="mr-3 h-5 w-5 text-gray-500" />
                 <div>
                   <p className="font-semibold">{t('user.help.phone')}</p>
                   <a href="tel:32040000" className="text-blue-600 hover:underline">32 04 00 00</a>
                 </div>
               </div>
               <div className="flex items-center">
                 <Mail className="mr-3 h-5 w-5 text-gray-500" />
                 <div>
                   <p className="font-semibold">{t('user.help.email')}</p>
                   <a href="mailto:kommunepost@drammen.kommune.no" className="text-blue-600 hover:underline">kommunepost@drammen.kommune.no</a>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side: Contact Form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('user.help.contactFormTitle')}</CardTitle>
              <CardDescription>{t('user.help.contactFormDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('user.help.contactFormNameLabel')}</Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} placeholder={t('user.help.contactFormNamePlaceholder')} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('user.help.contactFormEmailLabel')}</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder={t('user.help.contactFormEmailPlaceholder')} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('user.help.contactFormMessageLabel')}</Label>
                  <Textarea id="message" value={formData.message} onChange={handleInputChange} placeholder={t('user.help.contactFormMessagePlaceholder')} required />
                </div>
                <Button type="submit" disabled={mutation.isPending} className="w-full">
                  {mutation.isPending ? 'Sender...' : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t('user.help.contactFormSubmit')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
