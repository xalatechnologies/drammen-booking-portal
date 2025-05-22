
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ApprovalWorkflowsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Godkjenningsprosesser</h2>
      <Card>
        <CardHeader>
          <CardTitle>Ventende Godkjenninger</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Godkjenningsprosesser vil vises her.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalWorkflowsPage;
