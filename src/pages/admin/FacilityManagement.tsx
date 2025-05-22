
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FacilityManagementPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Facility Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>Facility Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Facility management content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityManagementPage;
