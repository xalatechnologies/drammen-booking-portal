
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileSettingsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Profil & Innstillinger</h2>
      <Card>
        <CardHeader>
          <CardTitle>Kontoinnstillinger</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Profil og kontoinnstillinger vil vises her.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsPage;
