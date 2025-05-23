
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import GlobalHeader from "@/components/GlobalHeader";

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Min profil</h1>
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                      BN
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>Bruker Navn</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  bruker@eksempel.no
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Aktive bookinger</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Du har ingen aktive bookinger for øyeblikket.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
