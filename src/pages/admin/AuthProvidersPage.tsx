
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Edit, RefreshCw, Info, Plus } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

const MOCK_PROVIDERS = [
  {
    id: "bankid",
    name: "BankID/ID-porten",
    type: "OIDC",
    status: "Aktiv",
    supportsScim: false,
  },
  {
    id: "vipps",
    name: "Vipps Login",
    type: "OIDC",
    status: "Inaktiv",
    supportsScim: false,
  },
  {
    id: "entra",
    name: "Entra ID (Azure AD)",
    type: "OIDC + SCIM",
    status: "Aktiv",
    supportsScim: true,
  },
];

const AuthProvidersPage: React.FC = () => {
  const [editProvider, setEditProvider] = useState<any | null>(null);
  const [scimSyncing, setScimSyncing] = useState(false);

  function handleEdit(provider: any) {
    setEditProvider(provider);
  }

  function handleClose() {
    setEditProvider(null);
  }

  function handleScimSync() {
    setScimSyncing(true);
    setTimeout(() => setScimSyncing(false), 1500);
  }

  return (
    <div className="w-full space-y-8 p-8">
      <PageHeader
        title="Autentisering"
        description="Administrer innloggingstjenester (OIDC/SCIM) for brukere og grupper. Støttede leverandører: BankID, Vipps, Entra ID."
        actions={
          <Button size="lg" className="text-base px-6 py-3">
            <Plus className="w-5 h-5 mr-2" />
            Legg til leverandør
          </Button>
        }
      />
      
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Konfigurerte autentiseringstjenester</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b-2">
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Navn</TableHead>
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Type</TableHead>
                  <TableHead className="text-base font-semibold text-gray-900 py-6">Status</TableHead>
                  <TableHead className="text-base font-semibold text-gray-900 py-6">SCIM</TableHead>
                  <TableHead className="w-32 text-base font-semibold text-gray-900 py-6">Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PROVIDERS.map((prov) => (
                  <TableRow key={prov.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <TableCell className="text-base py-6 font-medium">{prov.name}</TableCell>
                    <TableCell className="text-base py-6">{prov.type}</TableCell>
                    <TableCell className="py-6">
                      <Badge 
                        variant={prov.status === "Aktiv" ? "default" : "secondary"}
                        className="text-sm px-3 py-1"
                      >
                        {prov.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6">
                      {prov.supportsScim ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleScimSync} 
                          disabled={scimSyncing}
                          className="text-sm px-4 py-2"
                        >
                          <RefreshCw className={`${scimSyncing ? "animate-spin" : ""} w-4 h-4 mr-2`} />
                          Synkroniser
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-base">–</span>
                      )}
                    </TableCell>
                    <TableCell className="py-6">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(prov)}
                        className="text-sm px-4 py-2"
                      >
                        <Edit size={16} className="mr-2" /> 
                        Rediger
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={!!editProvider} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Rediger {editProvider?.name}</DialogTitle>
          </DialogHeader>
          <form className="space-y-6">
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-900 flex items-center">
                Client ID 
                <Info className="h-4 w-4 text-gray-400 ml-1" />
              </label>
              <Input placeholder="client-id-123" defaultValue="" className="h-12 text-base" />
            </div>
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-900 flex items-center">
                Client Secret 
                <Info className="h-4 w-4 text-gray-400 ml-1" />
              </label>
              <Input placeholder="••••••••" type="password" defaultValue="" className="h-12 text-base" />
            </div>
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-900 flex items-center">
                Discovery URL 
                <Info className="h-4 w-4 text-gray-400 ml-1" />
              </label>
              <Input placeholder="https://login.example.com/.well-known/openid-configuration" defaultValue="" className="h-12 text-base" />
            </div>
            {editProvider?.supportsScim && (
              <div className="space-y-3">
                <label className="block text-base font-medium text-gray-900 flex items-center">
                  SCIM-endepunkt 
                  <Info className="h-4 w-4 text-gray-400 ml-1" />
                </label>
                <Input placeholder="https://scim.example.com/v2/" defaultValue="" className="h-12 text-base" />
              </div>
            )}
          </form>
          <DialogFooter className="mt-8">
            <Button variant="outline" onClick={handleClose} size="lg" className="text-base px-6 py-3">
              Avbryt
            </Button>
            <Button type="submit" onClick={handleClose} size="lg" className="text-base px-6 py-3">
              Lagre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthProvidersPage;
