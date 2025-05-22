
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotificationsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Notifications content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
