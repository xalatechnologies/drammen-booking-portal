
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FacilityDescriptionProps {
  description: string;
}

export function FacilityDescription({ description }: FacilityDescriptionProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Om lokalet</h2>
      <p className="text-gray-700 whitespace-pre-line">{description}</p>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="font-medium text-lg mb-2">Egnet for</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-gray-50">Idrett</Badge>
          <Badge variant="outline" className="bg-gray-50">Trening</Badge>
          <Badge variant="outline" className="bg-gray-50">Arrangementer</Badge>
          <Badge variant="outline" className="bg-gray-50">Grupper</Badge>
        </div>
      </div>
    </Card>
  );
}
