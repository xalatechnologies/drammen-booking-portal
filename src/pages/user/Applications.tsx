import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Search, AlertTriangle, Save, FileText, MessageSquare, Info } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

let mockApplications = [
  { 
    id: 'APP-001', 
    type: 'Fastlån', 
    location: 'Drammenshallen', 
    time: 'Tirsdager 18:00 - 20:00 (Høst 2024)',
    applicant: 'Drammen IF',
    status: 'Godkjent',
    purpose: 'Trening for G16-laget.',
    submittedDate: '2024-06-01',
    communicationLog: [
      { from: 'Saksbehandler', message: 'Søknaden er mottatt og vil bli behandlet.', timestamp: '2024-06-01 14:30' },
      { from: 'Ola Nordmann', message: 'Takk for bekreftelsen!', timestamp: '2024-06-01 15:00' },
      { from: 'Saksbehandler', message: 'Søknaden er godkjent. Lykke til med sesongen!', timestamp: '2024-06-10 10:00' },
    ]
  },
  { 
    id: 'APP-002', 
    type: 'Engangslån', 
    location: 'Åssidenhallen', 
    time: '2024-11-20, 10:00 - 16:00',
    applicant: 'Privatperson',
    status: 'Under behandling',
    purpose: 'Bursdagsfeiring for 10-åring.',
    submittedDate: '2024-10-15',
    communicationLog: [
        { from: 'Saksbehandler', message: 'Søknaden er mottatt.', timestamp: '2024-10-15 11:00' },
    ]
  },
  { 
    id: 'APP-003', 
    type: 'Engangslån', 
    location: 'Konnerudhallen', 
    time: '2024-12-05, 19:00 - 21:00',
    applicant: 'Konnerud IL',
    status: 'Avslått',
    purpose: 'Ekstratrening før cup.',
    submittedDate: '2024-10-12',
    communicationLog: [
      { from: 'Saksbehandler', message: 'Søknad mottatt.', timestamp: '2024-10-12 09:00' },
      { from: 'Saksbehandler', message: 'Beklager, hallen er allerede booket for et annet arrangement denne dagen.', timestamp: '2024-10-14 13:00' },
    ]
  },
  { 
    id: 'APP-004', 
    type: 'Fastlån', 
    location: 'Brandengen Skole - Gymsal', 
    time: 'Mandager 17:00 - 18:00 (Vår 2025)',
    applicant: 'Brandengen SFO',
    status: 'Mellomlagret',
    purpose: 'Aktivitet for 3. trinn.',
    submittedDate: '2024-10-20',
    communicationLog: []
  },
];

const submitNewApplication = async (newApplication: any) => {
    console.log("Submitting to mock API:", newApplication);
    await new Promise(resolve => setTimeout(resolve, 500));
    mockApplications.unshift(newApplication);
    return newApplication;
};

const initialNewApplicationState = {
    facilityName: '',
    applicantName: '',
    department: '',
    description: '',
    resourceType: '', // Engangslån vs Fastlån
    priority: '',
    additionalNotes: '',
    // Time-specific fields
    date: new Date().toISOString().slice(0, 10),
    startTime: '17:00',
    endTime: '18:00',
    recurringDays: [] as string[],
    recurringPeriod: '',
};

const ApplicationsPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [dialogState, setDialogState] = useState({
      withdraw: false,
      newApplication: false,
      view: false,
  });
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const [newApplicationData, setNewApplicationData] = useState(initialNewApplicationState);

  const { data: applications, isLoading } = useQuery({
    queryKey: ['user-applications', searchTerm, filterStatus, filterType],
    queryFn: () => {
      return mockApplications.filter(app => {
        const matchesSearch = app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              app.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || app.status === filterStatus;
        const matchesType = filterType === "all" || app.type === filterType;
        return matchesSearch && matchesStatus && matchesType;
      });
    },
  });

  const newApplicationMutation = useMutation({
    mutationFn: submitNewApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-applications'] });
      toast.success("Søknaden ble sendt!");
      closeDialog('newApplication');
    },
    onError: () => {
        toast.error("Noe gikk galt under innsending.");
    }
  });

  const handleNewApplicationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewApplicationData(prev => ({ ...prev, [id]: value }));
  };

  const handleNewApplicationSelectChange = (id: string, value: string) => {
    setNewApplicationData(prev => ({ ...prev, [id]: value }));
  };

  const handleDayToggle = (day: string) => {
    setNewApplicationData(prev => ({
        ...prev,
        recurringDays: prev.recurringDays.includes(day)
            ? prev.recurringDays.filter(d => d !== day)
            : [...prev.recurringDays, day]
    }));
  };

  const handleNewApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let timeString = '';
    if (newApplicationData.resourceType === 'Fastlån') {
        const weekdays = t('user.newApplication.weekdays', { returnObjects: true });
        const selectedDays = newApplicationData.recurringDays.map(d => weekdays[d]).join(', ');
        const period = t('user.newApplication.periods', { returnObjects: true })[newApplicationData.recurringPeriod];
        timeString = `${selectedDays} ${newApplicationData.startTime} - ${newApplicationData.endTime} (${period})`;
    } else {
        timeString = `${newApplicationData.date}, ${newApplicationData.startTime} - ${newApplicationData.endTime}`;
    }
    
    const newApp = {
        id: `APP-${String(Math.floor(Math.random() * 900) + 100)}`,
        type: newApplicationData.resourceType,
        location: newApplicationData.facilityName,
        time: timeString,
        applicant: newApplicationData.applicantName || 'Privatperson',
        status: t('user.applications.status.pending'),
        purpose: newApplicationData.description,
        submittedDate: new Date().toISOString().slice(0, 10),
        communicationLog: []
    };
    newApplicationMutation.mutate(newApp);
  };

  const handleConfirmWithdraw = () => {
    console.log("Withdrawing application:", selectedApplication.id);
    closeDialog('withdraw');
  };

  const getStatusBadge = (status: string) => {
    // @ts-ignore
    const statusKey = Object.keys(t('user.applications.status', { returnObjects: true })).find(key => t(`user.applications.status.${key}`) === status);
    switch (statusKey) {
        case 'approved': return <Badge variant="default" className="bg-green-600">{status}</Badge>;
        case 'pending': return <Badge variant="secondary">{status}</Badge>;
        case 'rejected': return <Badge variant="destructive">{status}</Badge>;
        case 'withdrawn': return <Badge variant="outline">{status}</Badge>;
        case 'draft': return <Badge variant="outline" className="border-dashed">{status}</Badge>;
        default: return <Badge>{status}</Badge>;
    }
  };

  const openDialog = (type: 'withdraw' | 'newApplication' | 'view', application?: any) => {
      if (application) setSelectedApplication(application);
      setDialogState(prev => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: 'withdraw' | 'newApplication' | 'view') => {
      setDialogState(prev => ({ ...prev, [type]: false }));
      setSelectedApplication(null);
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title={t('user.applications.title')}
        description={t('user.applications.description')}
        actions={
          <Button onClick={() => openDialog('newApplication')}>
            <Plus className="mr-2 h-4 w-4" />
            {t('user.applications.newApplication')}
          </Button>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>{t('user.applications.allApplications')}</CardTitle>
          <CardDescription>{t('user.applications.allApplicationsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                placeholder={t('user.applications.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('user.applications.filterStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('user.applications.status.all')}</SelectItem>
                <SelectItem value={t('user.applications.status.pending')}>{t('user.applications.status.pending')}</SelectItem>
                <SelectItem value={t('user.applications.status.approved')}>{t('user.applications.status.approved')}</SelectItem>
                <SelectItem value={t('user.applications.status.rejected')}>{t('user.applications.status.rejected')}</SelectItem>
                <SelectItem value={t('user.applications.status.withdrawn')}>{t('user.applications.status.withdrawn')}</SelectItem>
                 <SelectItem value={t('user.applications.status.draft')}>{t('user.applications.status.draft')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('user.applications.filterType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('user.applications.types.all')}</SelectItem>
                <SelectItem value={t('user.applications.types.oneTime')}>{t('user.applications.types.oneTime')}</SelectItem>
                <SelectItem value={t('user.applications.types.fixed')}>{t('user.applications.types.fixed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('user.applications.table.id')}</TableHead>
                  <TableHead>{t('user.applications.table.locationTime')}</TableHead>
                  <TableHead>{t('user.applications.table.applicant')}</TableHead>
                  <TableHead>{t('user.applications.table.status')}</TableHead>
                  <TableHead className="text-right">{t('user.applications.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center">{t('user.applications.loading')}</TableCell></TableRow>
                ) : applications && applications.length > 0 ? (
                  applications.map(app => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.id}</TableCell>
                      <TableCell>
                        <div className="font-semibold">{app.location}</div>
                        <div className="text-sm text-gray-500">{app.time}</div>
                        <div className="text-xs text-gray-400">{t('user.applications.types.fixed') === app.type ? t('user.applications.types.fixed') : t('user.applications.types.oneTime')}</div>
                      </TableCell>
                      <TableCell>{app.applicant}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openDialog('view', app)}>
                            {t('user.applications.viewApplication')}
                          </Button>
                          {app.status === t('user.applications.status.pending') && (
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => openDialog('withdraw', app)}>
                              {t('user.applications.withdraw')}
                            </Button>
                          )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} className="text-center">{t('user.applications.noApplications')}</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      {/* Withdraw Application Dialog */}
      <Dialog open={dialogState.withdraw} onOpenChange={() => closeDialog('withdraw')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 text-yellow-500" />
              {t('user.applications.withdrawDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {t('user.applications.withdrawDialog.description', { facilityName: selectedApplication?.location })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="withdraw-reason">{t('user.applications.withdrawDialog.reasonLabel')}</Label>
            <Textarea id="withdraw-reason" placeholder={t('user.applications.withdrawDialog.reasonPlaceholder')} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => closeDialog('withdraw')}>{t('user.applications.withdrawDialog.cancel')}</Button>
            <Button variant="destructive" onClick={handleConfirmWithdraw}>{t('user.applications.withdrawDialog.confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Application Dialog */}
      <Dialog open={dialogState.newApplication} onOpenChange={() => closeDialog('newApplication')}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('user.newApplication.title')}</DialogTitle>
            <DialogDescription>{t('user.newApplication.description')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewApplicationSubmit} className="space-y-6 py-4 max-h-[80vh] overflow-y-auto pr-6">
            <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="facilityName">{t('user.newApplication.facilityName')}</Label>
                      <Input id="facilityName" placeholder={t('user.newApplication.facilityNamePlaceholder')} value={newApplicationData.facilityName} onChange={handleNewApplicationInputChange} required/>
                  </div>
                  <div>
                      <Label htmlFor="applicantName">{t('user.newApplication.applicantName')}</Label>
                      <Input id="applicantName" placeholder={t('user.newApplication.applicantNamePlaceholder')} value={newApplicationData.applicantName} onChange={handleNewApplicationInputChange} />
                  </div>
               </div>
               <div>
                   <Label htmlFor="department">{t('user.newApplication.department')}</Label>
                   <Input id="department" placeholder={t('user.newApplication.departmentPlaceholder')} value={newApplicationData.department} onChange={handleNewApplicationInputChange} />
               </div>
               <div>
                   <Label htmlFor="description">{t('user.newApplication.descriptionLabel')}</Label>
                   <Textarea id="description" placeholder={t('user.newApplication.descriptionPlaceholder')} value={newApplicationData.description} onChange={handleNewApplicationInputChange} required/>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="resourceType">{t('user.newApplication.resourceType')}</Label>
                    <Select onValueChange={(value) => handleNewApplicationSelectChange('resourceType', value)} required>
                        <SelectTrigger><SelectValue placeholder={t('user.newApplication.resourceTypePlaceholder')} /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Engangslån">{t('user.applications.types.oneTime')}</SelectItem>
                            <SelectItem value="Fastlån">{t('user.applications.types.fixed')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="priority">{t('user.newApplication.priority')}</Label>
                    <Select onValueChange={(value) => handleNewApplicationSelectChange('priority', value)}>
                        <SelectTrigger><SelectValue placeholder={t('user.newApplication.priorityPlaceholder')} /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Høy">{t('user.newApplication.priorities.high')}</SelectItem>
                            <SelectItem value="Middels">{t('user.newApplication.priorities.medium')}</SelectItem>
                            <SelectItem value="Lav">{t('user.newApplication.priorities.low')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <div>
                <Label htmlFor="additionalNotes">{t('user.newApplication.additionalNotes')}</Label>
                <Textarea id="additionalNotes" placeholder={t('user.newApplication.additionalNotesPlaceholder')} value={newApplicationData.additionalNotes} onChange={handleNewApplicationInputChange} />
            </div>

            {/* Time Selection Section */}
            {newApplicationData.resourceType && (
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">{t('user.newApplication.timeSelectionTitle')}</h3>
                    {newApplicationData.resourceType === 'Engangslån' && (
                         <div>
                            <Label htmlFor="date">{t('user.newApplication.oneTimeDate')}</Label>
                            <Input type="date" id="date" value={newApplicationData.date} onChange={handleNewApplicationInputChange} required />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="startTime">{t('user.newApplication.startTime')}</Label>
                            <Input type="time" id="startTime" value={newApplicationData.startTime} onChange={handleNewApplicationInputChange} required />
                        </div>
                        <div>
                            <Label htmlFor="endTime">{t('user.newApplication.endTime')}</Label>
                            <Input type="time" id="endTime" value={newApplicationData.endTime} onChange={handleNewApplicationInputChange} required />
                        </div>
                    </div>
                    {newApplicationData.resourceType === 'Fastlån' && (
                        <div className="space-y-4">
                            <div>
                                <Label>{t('user.newApplication.recurringDays')}</Label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                                    {/* @ts-ignore */}
                                    {Object.entries(t('user.newApplication.weekdays', { returnObjects: true })).map(([key, value]) => (
                                        <div key={key} className="flex items-center space-x-2">
                                            <Checkbox id={key} onCheckedChange={() => handleDayToggle(key)} checked={newApplicationData.recurringDays.includes(key)} />
                                            <Label htmlFor={key} className="font-normal">{value as string}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="recurringPeriod">{t('user.newApplication.recurringPeriod')}</Label>
                                <Select onValueChange={(value) => handleNewApplicationSelectChange('recurringPeriod', value)} required>
                                    <SelectTrigger><SelectValue placeholder={t('user.newApplication.recurringPeriod')} /></SelectTrigger>
                                    <SelectContent>
                                         {/* @ts-ignore */}
                                         {Object.entries(t('user.newApplication.periods', { returnObjects: true })).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>{value as string}</SelectItem>
                                         ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => closeDialog('newApplication')}>{t('user.applications.withdrawDialog.cancel')}</Button>
              <Button type="submit" disabled={newApplicationMutation.isPending || !newApplicationData.resourceType}>
                {newApplicationMutation.isPending ? "Sender..." : <Save className="w-4 h-4 mr-2" />}
                {t('user.newApplication.submit')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Application Dialog */}
      <Dialog open={dialogState.view} onOpenChange={() => closeDialog('view')}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('user.applications.viewDialog.title')}: {selectedApplication?.id}</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <Tabs defaultValue="details" className="w-full pt-4">
              <TabsList>
                <TabsTrigger value="details"><Info className="mr-2 h-4 w-4" />{t('user.applications.viewDialog.detailsTab')}</TabsTrigger>
                <TabsTrigger value="communication"><MessageSquare className="mr-2 h-4 w-4" />{t('user.applications.viewDialog.communicationTab')}</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4 space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <span className="text-sm font-semibold text-gray-600">{t('user.applications.viewDialog.facility')}</span>
                    <span className="font-medium">{selectedApplication.location}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-sm font-semibold text-gray-600">{t('user.applications.table.locationTime')}</span>
                    <span className="font-medium">{selectedApplication.time}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-sm font-semibold text-gray-600">{t('user.applications.viewDialog.applicant')}</span>
                    <span className="font-medium">{selectedApplication.applicant}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-sm font-semibold text-gray-600">{t('user.applications.viewDialog.purpose')}</span>
                    <span className="font-medium">{selectedApplication.purpose}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">{t('user.applications.viewDialog.status')}</span>
                    {getStatusBadge(selectedApplication.status)}
                </div>
              </TabsContent>
              <TabsContent value="communication" className="mt-4">
                 {selectedApplication.communicationLog.length > 0 ? (
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-4">
                        {selectedApplication.communicationLog.map((log: any, index: number) => (
                            <div key={index} className={`flex flex-col ${log.from === 'Saksbehandler' ? 'items-start' : 'items-end'}`}>
                                <div className={`rounded-lg px-4 py-2 ${log.from === 'Saksbehandler' ? 'bg-gray-100' : 'bg-blue-100'}`}>
                                    <p className="text-sm">{log.message}</p>
                                </div>
                                <span className="text-xs text-gray-400 mt-1">{log.from} - {log.timestamp}</span>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <p className="text-sm text-gray-500 text-center py-8">{t('user.applications.viewDialog.noMessages')}</p>
                 )}
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => closeDialog('view')}>{t('user.applications.viewDialog.close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsPage; 