
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConflictWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflictData: any;
  onResolution: (resolution: any) => void;
}

export function ConflictWizardModal({
  isOpen,
  onClose,
  conflictData,
  onResolution
}: ConflictWizardModalProps) {
  const handleResolve = () => {
    onResolution({ action: 'resolve' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Løs konflikt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Det er en konflikt med den valgte bookingen.</p>
          <div className="flex gap-2">
            <Button onClick={handleResolve}>Løs konflikt</Button>
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
