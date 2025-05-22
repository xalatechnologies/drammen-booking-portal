
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReportsAnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
      <Card>
        <CardHeader>
          <CardTitle>Statistical Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Reports and analytics content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalyticsPage;
