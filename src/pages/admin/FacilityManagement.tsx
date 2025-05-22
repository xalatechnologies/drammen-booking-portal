
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FacilityManagementPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Fasilitetsstyring</h2>
      <Card>
        <CardHeader>
          <CardTitle>Fasilitetsøk & Filtre</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fasilitetsstyringsinnhold vil vises her.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityManagementPage;
