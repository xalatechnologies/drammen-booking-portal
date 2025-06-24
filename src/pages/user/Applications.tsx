
import React from "react";
import { PageLayout } from "@/components/layouts";

const ApplicationsPage = () => {
  return (
    <PageLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-gray-600">Your application history and status will appear here.</p>
      </div>
    </PageLayout>
  );
};

export default ApplicationsPage;
