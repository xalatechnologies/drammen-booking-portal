import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Shield, Edit, RefreshCw, Info } from "lucide-react";

// Mock data for providers
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
    setTimeout(() => setScimSyncing(false), 1500); // mock
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 id="page-title" className="text-3xl font-bold tracking-tight text-gray-900 mb-2 flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-700" />
          Autentisering
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Administrer innloggingstjenester (OIDC/SCIM) for brukere og grupper. <span title="Støttede leverandører: BankID, Vipps, Entra ID."><Info className="inline h-4 w-4 text-gray-400 align-text-bottom ml-1" /></span>
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Konfigurerte autentiseringstjenester</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SCIM</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PROVIDERS.map((prov) => (
                  <TableRow key={prov.id}>
                    <TableCell>{prov.name}</TableCell>
                    <TableCell>{prov.type}</TableCell>
                    <TableCell>
                      <span className={prov.status === "Aktiv" ? "text-green-700 font-semibold" : "text-gray-500"}>{prov.status}</span>
                    </TableCell>
                    <TableCell>
                      {prov.supportsScim ? (
                        <Button size="sm" variant="outline" onClick={handleScimSync} disabled={scimSyncing}>
                          <RefreshCw className={scimSyncing ? "animate-spin" : ""} size={16} /> Synkroniser
                        </Button>
                      ) : (
                        <span className="text-gray-400">–</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(prov)}>
                        <Edit size={16} className="mr-1" /> Rediger
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Rediger {editProvider?.name}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client ID <span title="OIDC Client ID"><Info className="inline h-4 w-4 text-gray-400 align-text-bottom ml-1" /></span></label>
              <Input placeholder="client-id-123" defaultValue="" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Client Secret <span title="OIDC Client Secret"><Info className="inline h-4 w-4 text-gray-400 align-text-bottom ml-1" /></span></label>
              <Input placeholder="••••••••" type="password" defaultValue="" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discovery URL <span title="OIDC Discovery URL"><Info className="inline h-4 w-4 text-gray-400 align-text-bottom ml-1" /></span></label>
              <Input placeholder="https://login.example.com/.well-known/openid-configuration" defaultValue="" />
            </div>
            {editProvider?.supportsScim && (
              <div>
                <label className="block text-sm font-medium mb-1">SCIM-endepunkt <span title="SCIM API-endepunkt"><Info className="inline h-4 w-4 text-gray-400 align-text-bottom ml-1" /></span></label>
                <Input placeholder="https://scim.example.com/v2/" defaultValue="" />
              </div>
            )}
          </form>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleClose}>Avbryt</Button>
            <Button type="submit" onClick={handleClose}>Lagre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthProvidersPage; 