import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit3, Save, X } from "lucide-react";

const PLACEHOLDERS = [
  { key: "{brukernavn}", desc: "Navn på mottaker" },
  { key: "{lokale}", desc: "Navn på lokale" },
  { key: "{tid}", desc: "Tidspunkt for booking" },
  { key: "{organisasjon}", desc: "Organisasjon" },
  { key: "{lenke}", desc: "Lenke til booking/handling" },
];

const DEFAULT_TEMPLATES = [
  {
    id: "confirmation",
    type: "E-post",
    name: "Bekreftelse",
    subject: "Booking bekreftet for {lokale}",
    body: "Hei {brukernavn},\n\nDin booking av {lokale} er bekreftet for {tid}.\n\nVennlig hilsen\nDrammen kommune",
  },
  {
    id: "rejection",
    type: "E-post",
    name: "Avslag",
    subject: "Booking avvist for {lokale}",
    body: "Hei {brukernavn},\n\nVi må dessverre avslå din booking av {lokale} for {tid}.\n\nTa kontakt for mer info.\n\nVennlig hilsen\nDrammen kommune",
  },
  {
    id: "reminder",
    type: "SMS",
    name: "Påminnelse",
    subject: "",
    body: "Påminnelse: Du har booking av {lokale} {tid}.",
  },
  {
    id: "escalation",
    type: "E-post",
    name: "Eskalering",
    subject: "Viktig: Handling kreves for booking {lokale}",
    body: "Hei {brukernavn},\n\nVi trenger din respons på booking av {lokale} for {tid}. Gå til {lenke} for å svare.\n\nVennlig hilsen\nDrammen kommune",
  },
];

const MessageTemplates: React.FC = () => {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [editId, setEditId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editType, setEditType] = useState("E-post");
  const [editName, setEditName] = useState("");
  const [addMode, setAddMode] = useState(false);

  function startEdit(tmpl: any) {
    setEditId(tmpl.id);
    setEditSubject(tmpl.subject);
    setEditBody(tmpl.body);
    setEditType(tmpl.type);
    setEditName(tmpl.name);
    setAddMode(false);
  }
  function saveEdit() {
    setTemplates(templates.map(t => t.id === editId ? { ...t, subject: editSubject, body: editBody, type: editType, name: editName } : t));
    setEditId(null);
    setEditSubject("");
    setEditBody("");
    setEditType("E-post");
    setEditName("");
  }
  function cancelEdit() {
    setEditId(null);
    setEditSubject("");
    setEditBody("");
    setEditType("E-post");
    setEditName("");
    setAddMode(false);
  }
  function startAdd() {
    setEditId("new" + Math.random());
    setEditSubject("");
    setEditBody("");
    setEditType("E-post");
    setEditName("");
    setAddMode(true);
  }
  function saveAdd() {
    setTemplates([
      ...templates,
      { id: editId, subject: editSubject, body: editBody, type: editType, name: editName },
    ]);
    cancelEdit();
  }
  function deleteTemplate(id: string) {
    setTemplates(templates.filter(t => t.id !== id));
  }

  // Eksempel på melding med variabler
  function renderExample(subject: string, body: string) {
    return (
      <div className="bg-gray-50 border rounded p-4 mt-2 text-sm">
        <b>Eksempel:</b>
        <div className="mt-2 text-gray-700">
          <div><b>Emne:</b> {subject.replace("{lokale}", "Brandengen Skole - Gymsal").replace("{brukernavn}", "Ola Nordmann").replace("{tid}", "26.06.2025 16:00").replace("{organisasjon}", "Drammen IF").replace("{lenke}", "https://booking.drammen.no/123")}</div>
          <div className="whitespace-pre-line mt-1">{body.replace("{lokale}", "Brandengen Skole - Gymsal").replace("{brukernavn}", "Ola Nordmann").replace("{tid}", "26.06.2025 16:00").replace("{organisasjon}", "Drammen IF").replace("{lenke}", "https://booking.drammen.no/123")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto p-8" role="main" aria-labelledby="page-title">
      <header className="mb-6">
        <h1 id="page-title" className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Meldingsmaler & Triggere
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Administrer e-post og SMS-maler for automatiske meldinger. Bruk variabler for å tilpasse innholdet.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Maler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">Støttede variabler: {PLACEHOLDERS.map(p => <span key={p.key} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono mr-2">{p.key}</span>)}</div>
            <Button size="sm" variant="outline" className="gap-2" onClick={startAdd}><Plus className="h-4 w-4" /> Ny mal</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Emne</TableHead>
                  <TableHead>Handling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map(tmpl => (
                  <TableRow key={tmpl.id}>
                    <TableCell>{tmpl.name}</TableCell>
                    <TableCell>{tmpl.type}</TableCell>
                    <TableCell className="max-w-xs truncate">{tmpl.subject}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => startEdit(tmpl)} aria-label="Rediger"><Edit3 className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteTemplate(tmpl.id)} aria-label="Slett"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {(editId || addMode) && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{addMode ? "Ny mal" : "Rediger mal"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={e => { e.preventDefault(); addMode ? saveAdd() : saveEdit(); }} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Navn</label>
                <Input value={editName} onChange={e => setEditName(e.target.value)} required />
              </div>
              <div>
                <label className="block font-medium mb-1">Type</label>
                <select className="w-full border rounded px-3 py-2" value={editType} onChange={e => setEditType(e.target.value)} required>
                  <option value="E-post">E-post</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Emne</label>
                <Input value={editSubject} onChange={e => setEditSubject(e.target.value)} disabled={editType === "SMS"} required={editType === "E-post"} />
              </div>
              <div>
                <label className="block font-medium mb-1">Meldingstekst</label>
                <Textarea value={editBody} onChange={e => setEditBody(e.target.value)} rows={6} required />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button type="button" variant="outline" onClick={cancelEdit}><X className="h-4 w-4" /> Avbryt</Button>
                <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Lagre</Button>
              </div>
              {renderExample(editSubject, editBody)}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MessageTemplates; 