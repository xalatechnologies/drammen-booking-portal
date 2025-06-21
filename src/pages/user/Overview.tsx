import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const OverviewPage = () => {
  return (
    <div>
      <PageHeader
        title="Overview"
        description="Your account overview"
      />
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Here is a summary of your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add your overview content here */}
          <p>No content available yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
