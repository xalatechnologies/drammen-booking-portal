
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRound, ShieldCheck } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";

const LoginSelection = () => {
  const navigate = useNavigate();

  const handleUserSelection = (userType: "admin" | "user") => {
    if (userType === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-8">Velkommen til Drammen Kommune</h1>
          <p className="text-center text-muted-foreground mb-10">
            Velg hvordan du vil logge inn på systemet
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="bg-blue-50 pb-6">
                <CardTitle className="flex items-center justify-center text-blue-700">
                  <UserRound className="h-6 w-6 mr-2" />
                  Vanlig bruker
                </CardTitle>
                <CardDescription className="text-center">
                  For publikum og vanlige brukere
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 text-center">
                <p className="mb-4">
                  Logg inn for å reservere lokaler, administrere dine bookinger og mer.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleUserSelection("user")}
                >
                  Fortsett som bruker
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="bg-emerald-50 pb-6">
                <CardTitle className="flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="h-6 w-6 mr-2" />
                  Administrator
                </CardTitle>
                <CardDescription className="text-center">
                  For systemadministratorer og kommuneansatte
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 text-center">
                <p className="mb-4">
                  Logg inn for å administrere systemet, godkjenne bookinger, og se statistikk.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default"
                  className="w-full bg-emerald-600 hover:bg-emerald-700" 
                  onClick={() => handleUserSelection("admin")}
                >
                  Fortsett som administrator
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;
