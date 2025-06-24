import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <PageHeader
        title="Help and Support"
        description="Find answers to common questions or contact our support team."
      />

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Browse our FAQ to find quick answers.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* FAQ items will go here */}
          <p>No FAQ items yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
