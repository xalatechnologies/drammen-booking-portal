import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AllocatedTimePage: React.FC = () => {
  const [allocatedTime, setAllocatedTime] = useState("8 hours");

  return (
    <div>
      <PageHeader
        title="Allocated Time"
        description="View and manage your allocated time."
      />

      <Card>
        <CardHeader>
          <CardTitle>Your Allocated Time</CardTitle>
          <CardDescription>
            Here you can see how much time has been allocated to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Allocated Time: {allocatedTime}</p>
          <Button>Adjust Time</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllocatedTimePage;
