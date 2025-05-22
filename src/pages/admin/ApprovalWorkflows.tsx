
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ApprovalWorkflowsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Approval Workflows</h2>
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Approval workflows content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalWorkflowsPage;
