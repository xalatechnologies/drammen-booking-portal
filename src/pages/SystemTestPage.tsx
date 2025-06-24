
import React from "react";
import { SystemTestingPanel } from "@/components/testing/SystemTestingPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SystemTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">System Testing Dashboard</CardTitle>
            <p className="text-gray-600">
              Comprehensive testing interface for the new localized system
            </p>
          </CardHeader>
          <CardContent>
            <SystemTestingPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemTestPage;
