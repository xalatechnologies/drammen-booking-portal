const currentUser = { name: "Admin Bruker", role: "systemadmin" }; // Bytt til 'systemadmin' eller 'superadmin' for full tilgang

if (!["systemadmin", "superadmin"].includes(currentUser.role)) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Ingen tilgang</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Du må være systemadministrator for å se og endre roller.</p>
        </CardContent>
      </Card>
    </div>
  );
} 