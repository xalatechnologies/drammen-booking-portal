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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Save, Plus, Trash2 } from "lucide-react";

// Mock data for initial development
const mockPricingLevels = [
  {
    id: 1,
    name: "Standard",
    basePrice: 500,
    hourlyRate: 150,
    description: "Standard pris for de fleste bookinger",
    applicableTypes: ["engangslån", "fastlån"],
  },
  {
    id: 2,
    name: "Ideelle organisasjoner",
    basePrice: 250,
    hourlyRate: 75,
    description: "Redusert pris for ideelle organisasjoner",
    applicableTypes: ["engangslån", "fastlån", "rammetid"],
  },
];

const mockAutoApproveRules = [
  {
    id: 1,
    name: "Små møterom",
    conditions: {
      facilityTypes: ["møterom"],
      maxDuration: 4,
      maxCapacity: 10,
      timeWindow: "office_hours",
    },
    enabled: true,
  },
  {
    id: 2,
    name: "Helgetrening",
    conditions: {
      facilityTypes: ["gymsal", "idrettshall"],
      dayTypes: ["weekend"],
      maxDuration: 2,
      userTypes: ["idrettslag"],
    },
    enabled: false,
  },
];

const mockBookingThresholds = {
  maxAdvanceBookingDays: 180,
  minBookingDuration: 30, // minutes
  maxBookingDuration: 480, // minutes
  maxActiveBookingsPerUser: 5,
  maxRecurringBookings: 12,
  bufferBetweenBookings: 15, // minutes
};

const SystemConfiguration: React.FC = () => {
  const [pricingLevels, setPricingLevels] = useState(mockPricingLevels);
  const [autoApproveRules, setAutoApproveRules] = useState(mockAutoApproveRules);
  const [bookingThresholds, setBookingThresholds] = useState(mockBookingThresholds);

  const handleSaveChanges = () => {
    // TODO: Implement save functionality
    console.log("Saving changes...");
  };

  const handleAddPricingLevel = () => {
    // TODO: Implement add pricing level
  };

  const handleDeletePricingLevel = (id: number) => {
    // TODO: Implement delete pricing level
  };

  const handleToggleRule = (ruleId: number) => {
    setAutoApproveRules(rules =>
      rules.map(rule =>
        rule.id === ruleId
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    );
  };

  return (
    <div className="space-y-8 w-full p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Systemkonfigurasjon
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Administrer systeminnstillinger, priser og regler for booking
        </p>
      </header>

      <Tabs defaultValue="pricing">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pricing">Priser</TabsTrigger>
          <TabsTrigger value="auto-approve">Auto-godkjenning</TabsTrigger>
          <TabsTrigger value="thresholds">Terskelverdier</TabsTrigger>
        </TabsList>

        {/* Pricing Levels Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prisnivåer</CardTitle>
              <CardDescription>
                Definer ulike prisnivåer for forskjellige brukergrupper og bookingtyper
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleAddPricingLevel}
                >
                  <Plus className="h-4 w-4" />
                  Legg til prisnivå
                </Button>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Navn</TableHead>
                      <TableHead>Grunnpris</TableHead>
                      <TableHead>Timepris</TableHead>
                      <TableHead>Bookingtyper</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingLevels.map((level) => (
                      <TableRow key={level.id}>
                        <TableCell>
                          <Input
                            value={level.name}
                            onChange={() => {}}
                            className="max-w-[200px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={level.basePrice}
                            onChange={() => {}}
                            className="max-w-[100px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={level.hourlyRate}
                            onChange={() => {}}
                            className="max-w-[100px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={level.applicableTypes[0]}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="engangslån">Engangslån</SelectItem>
                              <SelectItem value="fastlån">Fastlån</SelectItem>
                              <SelectItem value="rammetid">Rammetid</SelectItem>
                              <SelectItem value="strøtimer">Strøtimer</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePricingLevel(level.id)}
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
        </TabsContent>

        {/* Auto-approve Rules Tab */}
        <TabsContent value="auto-approve" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-godkjenningsregler</CardTitle>
              <CardDescription>
                Konfigurer regler for automatisk godkjenning av bookinger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {autoApproveRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-gray-500">
                        {rule.conditions.facilityTypes.join(", ")} |{" "}
                        Maks {rule.conditions.maxDuration} timer
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => handleToggleRule(rule.id)}
                        />
                        <Label>{rule.enabled ? "Aktiv" : "Inaktiv"}</Label>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Legg til regel
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Booking Thresholds Tab */}
        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking terskelverdier</CardTitle>
              <CardDescription>
                Sett globale grenser for bookinger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 max-w-xl">
                <div className="grid gap-2">
                  <Label>Maks antall dager i forveien</Label>
                  <Input
                    type="number"
                    value={bookingThresholds.maxAdvanceBookingDays}
                    onChange={() => {}}
                  />
                  <p className="text-sm text-gray-500">
                    Hvor mange dager i forveien kan man booke
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label>Minimum bookinglenge (minutter)</Label>
                  <Input
                    type="number"
                    value={bookingThresholds.minBookingDuration}
                    onChange={() => {}}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Maksimum bookinglenge (minutter)</Label>
                  <Input
                    type="number"
                    value={bookingThresholds.maxBookingDuration}
                    onChange={() => {}}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Maks aktive bookinger per bruker</Label>
                  <Input
                    type="number"
                    value={bookingThresholds.maxActiveBookingsPerUser}
                    onChange={() => {}}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Maks antall gjentakende bookinger</Label>
                  <Input
                    type="number"
                    value={bookingThresholds.maxRecurringBookings}
                    onChange={() => {}}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Buffer mellom bookinger (minutter)</Label>
                  <Input
                    type="number"
                    value={bookingThresholds.bufferBetweenBookings}
                    onChange={() => {}}
                  />
                  <p className="text-sm text-gray-500">
                    Minimum tid mellom to bookinger i samme lokale
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfiguration; 