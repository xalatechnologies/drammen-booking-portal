
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRound, ShieldCheck, Briefcase } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";

const LoginSelection = () => {
  const navigate = useNavigate();

  const handleUserSelection = (userType: "admin" | "user" | "caseworker") => {
    if (userType === "admin") {
      navigate("/admin");
    } else if (userType === "caseworker") {
      navigate("/caseworker");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl">
          <h1 className="text-3xl font-bold text-center mb-8">Velkommen til Drammen Kommune</h1>
          <p className="text-center text-muted-foreground mb-10">
            Velg hvordan du vil logge inn på systemet
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="bg-blue-50 pb-6">
                <CardTitle className="flex items-center justify-center text-blue-700">
                  <UserRound className="h-6 w-6 mr-2" />
                  Bruker
                </CardTitle>
                <CardDescription className="text-center">
                  For publikum og vanlige brukere
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 text-center">
                <p className="mb-4">
                  Logg inn for å reservere lokaler, administrere dine bookinger og mer.
                </p>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Innloggingsmetoder:</p>
                  <p>• BankID</p>
                  <p>• Vipps</p>
                </div>
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
              <CardHeader className="bg-orange-50 pb-6">
                <CardTitle className="flex items-center justify-center text-orange-700">
                  <Briefcase className="h-6 w-6 mr-2" />
                  Saksbehandlere
                </CardTitle>
                <CardDescription className="text-center">
                  For kommuneansatte og saksbehandlere
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 text-center">
                <p className="mb-4">
                  Logg inn for å behandle søknader, administrere bookinger og håndtere henvendelser.
                </p>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Innloggingsmetoder:</p>
                  <p>• SSO (Single Sign-On)</p>
                  <p>• BankID</p>
                  <p>• Vipps</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default"
                  className="w-full bg-orange-600 hover:bg-orange-700" 
                  onClick={() => handleUserSelection("caseworker")}
                >
                  Fortsett som saksbehandler
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
                  For systemadministratorer og ledelse
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 text-center">
                <p className="mb-4">
                  Logg inn for å administrere systemet, godkjenne bookinger, og se statistikk.
                </p>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Innloggingsmetoder:</p>
                  <p>• SSO (Single Sign-On)</p>
                  <p>• BankID</p>
                  <p>• Vipps</p>
                </div>
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
