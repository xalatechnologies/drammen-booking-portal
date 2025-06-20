import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Zone, ConflictRule } from '@/types/facility';
import { Plus, Trash2, Edit } from 'lucide-react';

interface ZoneManagementProps {
  facilityId: string;
  zones: Zone[];
  onZoneCreate: (zone: Omit<Zone, 'id'>) => void;
  onZoneUpdate: (zone: Zone) => void;
  onZoneDelete: (zoneId: string) => void;
  onConflictRuleCreate: (rule: Omit<ConflictRule, 'id'>) => void;
  onConflictRuleDelete: (ruleId: string) => void;
}

const ZoneManagement: React.FC<ZoneManagementProps> = ({
  facilityId,
  zones,
  onZoneCreate,
  onZoneUpdate,
  onZoneDelete,
  onConflictRuleCreate,
  onConflictRuleDelete
}) => {
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [newZone, setNewZone] = useState<Partial<Zone>>({
    facilityId,
    type: 'court',
    status: 'active',
    bookableIndependently: true,
    conflictRules: []
  });

  const handleAddZone = () => {
    if (newZone.name && newZone.capacity) {
      onZoneCreate({
        ...newZone as Omit<Zone, 'id'>,
        facilityId
      });
      setNewZone({
        facilityId,
        type: 'court',
        status: 'active',
        bookableIndependently: true,
        conflictRules: []
      });
      setIsAddingZone(false);
    }
  };

  const handleUpdateZone = () => {
    if (editingZone) {
      onZoneUpdate(editingZone);
      setEditingZone(null);
    }
  };

  const handleAddConflictRule = (zoneId: string, conflictingZoneId: string) => {
    onConflictRuleCreate({
      zoneId,
      conflictingZoneId,
      type: 'mutually_exclusive',
      description: 'Cannot be booked simultaneously'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Soner og områder</h3>
        <Dialog open={isAddingZone} onOpenChange={setIsAddingZone}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Legg til sone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Legg til ny sone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="zoneName">Navn</Label>
                <Input
                  id="zoneName"
                  value={newZone.name || ''}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  placeholder="f.eks. Bane 1"
                />
              </div>
              <div>
                <Label htmlFor="zoneType">Type</Label>
                <Select
                  value={newZone.type}
                  onValueChange={(value) => setNewZone({ ...newZone, type: value as Zone['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Velg type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="court">Bane</SelectItem>
                    <SelectItem value="room">Rom</SelectItem>
                    <SelectItem value="area">Område</SelectItem>
                    <SelectItem value="section">Seksjon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zoneCapacity">Kapasitet</Label>
                <Input
                  id="zoneCapacity"
                  type="number"
                  value={newZone.capacity || ''}
                  onChange={(e) => setNewZone({ ...newZone, capacity: parseInt(e.target.value) })}
                  placeholder="Antall personer"
                />
              </div>
              <div>
                <Label htmlFor="zoneDescription">Beskrivelse</Label>
                <Input
                  id="zoneDescription"
                  value={newZone.description || ''}
                  onChange={(e) => setNewZone({ ...newZone, description: e.target.value })}
                  placeholder="Beskrivelse av sonen"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="independent-booking"
                  checked={newZone.bookableIndependently}
                  onCheckedChange={(checked) => setNewZone({ ...newZone, bookableIndependently: checked })}
                />
                <Label htmlFor="independent-booking">Kan bookes separat</Label>
              </div>
              <Button onClick={handleAddZone}>Legg til sone</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => (
          <Card key={zone.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {zone.name}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingZone(zone)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onZoneDelete(zone.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p><strong>Type:</strong> {zone.type}</p>
                <p><strong>Kapasitet:</strong> {zone.capacity}</p>
                <p><strong>Status:</strong> {zone.status}</p>
                {zone.description && (
                  <p><strong>Beskrivelse:</strong> {zone.description}</p>
                )}
                <p>
                  <strong>Booking:</strong>
                  {zone.bookableIndependently ? 'Kan bookes separat' : 'Må bookes med andre soner'}
                </p>
              </div>

              {/* Conflict Rules */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Konfliktregler</h4>
                <div className="space-y-2">
                  {zone.conflictRules.map((rule) => (
                    <div key={rule.id} className="flex justify-between items-center text-sm">
                      <span>
                        Konflikt med: {zones.find(z => z.id === rule.conflictingZoneId)?.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onConflictRuleDelete(rule.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {zones.length > 1 && (
                    <Select
                      onValueChange={(value) => handleAddConflictRule(zone.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Legg til konflikt" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones
                          .filter(z => z.id !== zone.id && !zone.conflictRules.some(r => r.conflictingZoneId === z.id))
                          .map(z => (
                            <SelectItem key={z.id} value={z.id}>
                              {z.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Zone Dialog */}
      <Dialog open={!!editingZone} onOpenChange={(open) => !open && setEditingZone(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rediger sone</DialogTitle>
          </DialogHeader>
          {editingZone && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editZoneName">Navn</Label>
                <Input
                  id="editZoneName"
                  value={editingZone.name}
                  onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editZoneType">Type</Label>
                <Select
                  value={editingZone.type}
                  onValueChange={(value) => setEditingZone({ ...editingZone, type: value as Zone['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="court">Bane</SelectItem>
                    <SelectItem value="room">Rom</SelectItem>
                    <SelectItem value="area">Område</SelectItem>
                    <SelectItem value="section">Seksjon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editZoneCapacity">Kapasitet</Label>
                <Input
                  id="editZoneCapacity"
                  type="number"
                  value={editingZone.capacity}
                  onChange={(e) => setEditingZone({ ...editingZone, capacity: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="editZoneDescription">Beskrivelse</Label>
                <Input
                  id="editZoneDescription"
                  value={editingZone.description || ''}
                  onChange={(e) => setEditingZone({ ...editingZone, description: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-independent-booking"
                  checked={editingZone.bookableIndependently}
                  onCheckedChange={(checked) => setEditingZone({ ...editingZone, bookableIndependently: checked })}
                />
                <Label htmlFor="edit-independent-booking">Kan bookes separat</Label>
              </div>
              <Button onClick={handleUpdateZone}>Lagre endringer</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZoneManagement; 