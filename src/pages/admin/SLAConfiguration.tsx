import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Save, Plus, Trash2, AlertCircle } from "lucide-react";

// Mock data for initial development
const mockSLALevels = [
  {
    id: 1,
    name: "Critical",
    responseTime: 1, // hours
    resolutionTime: 4, // hours
    escalationTime: 2, // hours
    escalationContact: "on-call-team",
    compensation: {
      type: "percentage",
      value: 10,
      description: "10% refusjon av månedsavgift",
    },
    enabled: true,
  },
  {
    id: 2,
    name: "High",
    responseTime: 4,
    resolutionTime: 8,
    escalationTime: 6,
    escalationContact: "support-lead",
    compensation: {
      type: "fixed",
      value: 500,
      description: "Fast kompensasjon 500 NOK",
    },
    enabled: true,
  },
  {
    id: 3,
    name: "Normal",
    responseTime: 24,
    resolutionTime: 48,
    escalationTime: 36,
    escalationContact: "support-team",
    compensation: {
      type: "none",
      value: 0,
      description: "Ingen kompensasjon",
    },
    enabled: true,
  },
];

const mockEscalationContacts = [
  { id: "on-call-team", name: "Vaktteam", email: "oncall@drammen.kommune.no" },
  { id: "support-lead", name: "Support Leder", email: "support.lead@drammen.kommune.no" },
  { id: "support-team", name: "Support Team", email: "support@drammen.kommune.no" },
];

const SLAConfiguration: React.FC = () => {
  const [slaLevels, setSlaLevels] = useState(mockSLALevels);
  const [escalationContacts, setEscalationContacts] = useState(mockEscalationContacts);

  const handleSaveChanges = () => {
    // TODO: Implement save functionality
    console.log("Saving SLA configuration...");
  };

  const handleAddSLALevel = () => {
    const newLevel = {
      id: slaLevels.length + 1,
      name: "Ny SLA",
      responseTime: 24,
      resolutionTime: 48,
      escalationTime: 36,
      escalationContact: "support-team",
      compensation: {
        type: "none",
        value: 0,
        description: "Ingen kompensasjon",
      },
      enabled: true,
    };
    setSlaLevels([...slaLevels, newLevel]);
  };

  const handleDeleteSLALevel = (id: number) => {
    setSlaLevels(levels => levels.filter(level => level.id !== id));
  };

  const handleToggleSLA = (id: number) => {
    setSlaLevels(levels =>
      levels.map(level =>
        level.id === id
          ? { ...level, enabled: !level.enabled }
          : level
      )
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SLA Konfigurasjon</h1>
          <p className="text-gray-600 mt-1">
            Administrer service-nivåavtaler, responstider og eskaleringsregler
          </p>
        </div>
        <Button className="gap-2" onClick={handleSaveChanges}>
          <Save className="h-4 w-4" />
          Lagre endringer
        </Button>
      </div>

      {/* SLA Levels */}
      <Card>
        <CardHeader>
          <CardTitle>SLA Nivåer</CardTitle>
          <CardDescription>
            Definer ulike servicenivåer med responstider og eskaleringsregler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleAddSLALevel}
            >
              <Plus className="h-4 w-4" />
              Legg til SLA nivå
            </Button>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Responstid (t)</TableHead>
                  <TableHead>Løsningstid (t)</TableHead>
                  <TableHead>Eskaleringstid (t)</TableHead>
                  <TableHead>Eskaleringskontakt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slaLevels.map((level) => (
                  <TableRow key={level.id}>
                    <TableCell>
                      <Input
                        value={level.name}
                        onChange={() => {}}
                        className="max-w-[150px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={level.responseTime}
                        onChange={() => {}}
                        className="max-w-[80px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={level.resolutionTime}
                        onChange={() => {}}
                        className="max-w-[80px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={level.escalationTime}
                        onChange={() => {}}
                        className="max-w-[80px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={level.escalationContact}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {escalationContacts.map(contact => (
                            <SelectItem key={contact.id} value={contact.id}>
                              {contact.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={level.enabled}
                          onCheckedChange={() => handleToggleSLA(level.id)}
                        />
                        <Label>{level.enabled ? "Aktiv" : "Inaktiv"}</Label>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSLALevel(level.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Escalation Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Eskaleringskontakter</CardTitle>
          <CardDescription>
            Administrer kontakter for eskalering av support-saker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Legg til kontakt
            </Button>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>E-post</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escalationContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Input
                        value={contact.name}
                        onChange={() => {}}
                        className="max-w-[200px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="email"
                        value={contact.email}
                        onChange={() => {}}
                        className="max-w-[250px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Compensation Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Kompensasjonsregler</CardTitle>
          <CardDescription>
            Definer kompensasjon ved brudd på SLA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {slaLevels.map((level) => (
              <div
                key={level.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{level.name}</h3>
                  <p className="text-sm text-gray-500">
                    {level.compensation.description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Select defaultValue={level.compensation.type}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ingen</SelectItem>
                      <SelectItem value="percentage">Prosent</SelectItem>
                      <SelectItem value="fixed">Fast beløp</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={level.compensation.value}
                    onChange={() => {}}
                    className="w-[100px]"
                    placeholder="Verdi"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SLAConfiguration; 