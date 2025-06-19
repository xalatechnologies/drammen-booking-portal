import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Info } from "lucide-react";

const MOCK_RULES = [
  { id: "users", label: "Brukere", months: 24, enabled: true },
  { id: "logs", label: "Logger", months: 12, enabled: true },
  { id: "bookings", label: "Bookinger", months: 36, enabled: false },
  { id: "messages", label: "Meldinger", months: 6, enabled: false },
];

const currentUser = { name: "Admin Bruker", role: "systemadmin" }; // Bytt til 'systemadmin' eller 'superadmin' for full tilgang

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
    // Mock: bare vis alert
    alert(`Sletting/anonymisering av data for ${id} (mock)`);
  }

  if (!["systemadmin", "superadmin"].includes(currentUser.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Ingen tilgang</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Du må være systemadministrator for å se og endre datalagringsregler.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 id="page-title" className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Datalagring & anonymisering
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Sett regler for hvor lenge persondata lagres og når de anonymiseres/slettes. <span title="GDPR: Persondata skal ikke lagres lenger enn nødvendig."><Info className="inline h-4 w-4 text-gray-400 align-text-bottom ml-1" /></span>
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Regler for datalagring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {rules.map(rule => (
              <div key={rule.id} className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Checkbox checked={rule.enabled} onCheckedChange={() => handleToggle(rule.id)} id={`chk-${rule.id}`} />
                  <label htmlFor={`chk-${rule.id}`} className="font-medium text-base">{rule.label}</label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Slett/anonymiser etter</span>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={rule.months}
                    onChange={e => handleMonthsChange(rule.id, e.target.value)}
                    className="w-20"
                    disabled={!rule.enabled}
                  />
                  <span className="text-sm text-gray-700">måneder</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleManualDelete(rule.id)} disabled={!rule.enabled}>
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