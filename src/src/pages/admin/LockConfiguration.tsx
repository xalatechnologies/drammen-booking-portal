import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Save, Plus, Trash2, Key } from "lucide-react";

// Mock data for initial development
const mockLockSystems = [
  {
    id: 1,
    name: "Salto KS",
    type: "nfc",
    apiEndpoint: "https://api.saltoks.com",
    enabled: true,
    settings: {
      accessWindowStart: 15, // minutes before booking
      accessWindowEnd: 15, // minutes after booking
      autoRevoke: true,
      requirePin: false,
    },
  },
  {
    id: 2,
    name: "SimonsVoss",
    type: "digital",
    apiEndpoint: "https://api.simonsvoss.com",
    enabled: false,
    settings: {
      accessWindowStart: 30,
      accessWindowEnd: 30,
      autoRevoke: true,
      requirePin: true,
    },
  },
];

const mockFacilityLocks = [
  {
    id: 1,
    facilityName: "Drammenshallen",
    lockSystem: "Salto KS",
    lockId: "DH-MAIN-01",
    description: "Hovedinngang",
    enabled: true,
  },
  {
    id: 2,
    facilityName: "Drammenshallen",
    lockSystem: "Salto KS",
    lockId: "DH-GYM-01",
    description: "Gymsal 1",
    enabled: true,
  },
];

const LockConfiguration: React.FC = () => {
  const [lockSystems, setLockSystems] = useState(mockLockSystems);
  const [facilityLocks, setFacilityLocks] = useState(mockFacilityLocks);

  const handleSaveChanges = () => {
    // TODO: Implement save functionality
    console.log("Saving lock configuration...");
  };

  const handleAddLockSystem = () => {
    const newSystem = {
      id: lockSystems.length + 1,
      name: "Nytt låssystem",
      type: "nfc",
      apiEndpoint: "",
      enabled: false,
      settings: {
        accessWindowStart: 15,
        accessWindowEnd: 15,
        autoRevoke: true,
        requirePin: false,
      },
    };
    setLockSystems([...lockSystems, newSystem]);
  };

  const handleToggleLockSystem = (id: number) => {
    setLockSystems(systems =>
      systems.map(system =>
        system.id === id
          ? { ...system, enabled: !system.enabled }
          : system
      )
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Låssystem Konfigurasjon</h1>
          <p className="text-gray-600 mt-1">
            Administrer elektroniske låssystemer og adgangskontroll
          </p>
        </div>
        <Button className="gap-2" onClick={handleSaveChanges}>
          <Save className="h-4 w-4" />
          Lagre endringer
        </Button>
      </div>

      {/* Lock Systems */}
      <Card>
        <CardHeader>
          <CardTitle>Låssystemer</CardTitle>
          <CardDescription>
            Konfigurer tilkoblede elektroniske låssystemer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleAddLockSystem}
            >
              <Plus className="h-4 w-4" />
              Legg til låssystem
            </Button>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>API Endpoint</TableHead>
                  <TableHead>Tilgangstid (min)</TableHead>
                  <TableHead>Innstillinger</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lockSystems.map((system) => (
                  <TableRow key={system.id}>
                    <TableCell>
                      <Input
                        value={system.name}
                        onChange={() => {}}
                        className="max-w-[150px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={system.type}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nfc">NFC</SelectItem>
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="bluetooth">Bluetooth</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={system.apiEndpoint}
                        onChange={() => {}}
                        className="max-w-[200px]"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={system.settings.accessWindowStart}
                          onChange={() => {}}
                          className="w-[60px]"
                        />
                        <span className="text-gray-500">/</span>
                        <Input
                          type="number"
                          value={system.settings.accessWindowEnd}
                          onChange={() => {}}
                          className="w-[60px]"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={system.settings.autoRevoke}
                            onCheckedChange={() => {}}
                          />
                          <Label>Auto-tilbakekall</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={system.settings.requirePin}
                            onCheckedChange={() => {}}
                          />
                          <Label>Krev PIN</Label>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={system.enabled}
                          onCheckedChange={() => handleToggleLockSystem(system.id)}
                        />
                        <Label>{system.enabled ? "Aktiv" : "Inaktiv"}</Label>
                      </div>
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

      {/* Facility Locks */}
      <Card>
        <CardHeader>
          <CardTitle>Låser per lokale</CardTitle>
          <CardDescription>
            Administrer elektroniske låser for hvert lokale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Legg til lås
            </Button>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lokale</TableHead>
                  <TableHead>Låssystem</TableHead>
                  <TableHead>Lås ID</TableHead>
                  <TableHead>Beskrivelse</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilityLocks.map((lock) => (
                  <TableRow key={lock.id}>
                    <TableCell>{lock.facilityName}</TableCell>
                    <TableCell>
                      <Select defaultValue={lock.lockSystem}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {lockSystems.map(system => (
                            <SelectItem key={system.id} value={system.name}>
                              {system.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={lock.lockId}
                        onChange={() => {}}
                        className="max-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={lock.description}
                        onChange={() => {}}
                        className="max-w-[200px]"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={lock.enabled}
                          onCheckedChange={() => {}}
                        />
                        <Label>{lock.enabled ? "Aktiv" : "Inaktiv"}</Label>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Key className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LockConfiguration; 