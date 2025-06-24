
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageEditDialogProps {
  image: any | null;
  onClose: () => void;
  facilityId: number;
}

export const ImageEditDialog: React.FC<ImageEditDialogProps> = ({
  image,
  onClose,
  facilityId
}) => {
  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Image editing is being updated for the new system. This feature will be available soon.
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
};
