
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Info } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

const MOCK_RULES = [
  { id: "users", label: "Brukere", months: 24, enabled: true },
  { id: "logs", label: "Logger", months: 12, enabled: true },
  { id: "bookings", label: "Bookinger", months: 36, enabled: false },
  { id: "messages", label: "Meldinger", months: 6, enabled: false },
];

const currentUser = { name: "Admin Bruker", role: "systemadmin" };

const DataRetentionPage: React.FC = () => {
  const [rules, setRules] = useState(MOCK_RULES);

  function handleToggle(id: string) {
    setRules(rules => rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  }

  function handleMonthsChange(id: string, value: string) {
    const months = parseInt(value, 10) || 0;
    setRules(rules => rules.map(r => r.id === id ? { ...r, months } : r));
  }

  function handleManualDelete(id: string) {
    alert(`Sletting/anonymisering av data for ${id} (mock)`);
  }

  if (!["systemadmin", "superadmin"].includes(currentUser.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Ingen tilgang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Du må være systemadministrator for å se og endre datalagringsregler.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 p-8">
      <PageHeader
        title="Datalagring & anonymisering"
        description="Sett regler for hvor lenge persondata lagres og når de anonymiseres/slettes. GDPR: Persondata skal ikke lagres lenger enn nødvendig."
      />
      
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Regler for datalagring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {rules.map(rule => (
              <div key={rule.id} className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-[150px]">
                  <Checkbox 
                    checked={rule.enabled} 
                    onCheckedChange={() => handleToggle(rule.id)} 
                    id={`chk-${rule.id}`}
                    className="w-5 h-5"
                  />
                  <label htmlFor={`chk-${rule.id}`} className="font-medium text-lg">{rule.label}</label>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base text-gray-700">Slett/anonymiser etter</span>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={rule.months}
                    onChange={e => handleMonthsChange(rule.id, e.target.value)}
                    className="w-24 h-12 text-base"
                    disabled={!rule.enabled}
                  />
                  <span className="text-base text-gray-700">måneder</span>
                </div>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => handleManualDelete(rule.id)} 
                  disabled={!rule.enabled}
                  className="text-base px-6 py-3"
                >
                  Slett/anonymiser nå
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataRetentionPage;
