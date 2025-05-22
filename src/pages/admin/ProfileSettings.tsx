
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileSettingsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Profile and account settings content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsPage;
