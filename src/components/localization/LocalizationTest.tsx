
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LocalizationTest() {
  const { language, toggleLanguage } = useLanguage();

  const testContent = {
    NO: {
      title: "Lokaliseringstest",
      description: "Dette er en test av språkfunksjonaliteten",
      currentLanguage: "Nåværende språk",
      switchLanguage: "Bytt språk"
    },
    EN: {
      title: "Localization Test", 
      description: "This is a test of the language functionality",
      currentLanguage: "Current language",
      switchLanguage: "Switch language"
    }
  };

  const content = testContent[language];

  return (
    <Card className="max-w-md mx-auto m-4">
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">{content.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-medium">{content.currentLanguage}: {language}</span>
          <Button onClick={toggleLanguage} variant="outline">
            {content.switchLanguage}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
