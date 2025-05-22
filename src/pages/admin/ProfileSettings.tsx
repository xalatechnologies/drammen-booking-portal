
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Bell
} from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Navn må ha minst 2 tegn.",
  }),
  email: z.string().email({
    message: "Vennligst oppgi en gyldig e-postadresse.",
  }),
  phone: z.string().min(8, {
    message: "Vennligst oppgi et gyldig telefonnummer.",
  }),
  title: z.string(),
  organization: z.string(),
});

const securityFormSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
  emailNotifications: z.boolean().default(true),
  loginAlerts: z.boolean().default(true),
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  notifyOnApprovals: z.boolean().default(true),
  notifyOnComments: z.boolean().default(true),
  notifyOnNewRequests: z.boolean().default(true),
  digestFrequency: z.enum(["daily", "weekly", "never"], {
    required_error: "Vennligst velg frekvens på sammendrag.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;

const ProfileSettingsPage = () => {
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Admin Bruker",
      email: "admin@eksempel.no",
      phone: "98765432",
      title: "Systemadministrator",
      organization: "Oslo Kommune"
    },
  });

  // Security form
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      twoFactorAuth: false,
      emailNotifications: true,
      loginAlerts: true,
    },
  });

  // Notification form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      notifyOnApprovals: true,
      notifyOnComments: true,
      notifyOnNewRequests: true,
      digestFrequency: "weekly",
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    toast.success("Profildetaljer oppdatert!");
    console.log(data);
  }

  function onSecuritySubmit(data: SecurityFormValues) {
    toast.success("Sikkerhetsinnstillinger oppdatert!");
    console.log(data);
  }

  function onNotificationSubmit(data: NotificationFormValues) {
    toast.success("Varslingsinnstillinger oppdatert!");
    console.log(data);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Profil & Innstillinger</h2>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span>Personlig informasjon</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield size={16} />
            <span>Sikkerhet</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span>Varslinger</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personlig informasjon</CardTitle>
              <CardDescription>
                Oppdater din profilinformasjon. Dette vil vises til andre brukere.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fullt navn</FormLabel>
                          <FormControl>
                            <Input placeholder="Ditt navn" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-post</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input placeholder="din.epost@eksempel.no" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input placeholder="98765432" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tittel</FormLabel>
                          <FormControl>
                            <Input placeholder="Din stillingstittel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Organisasjon</FormLabel>
                          <FormControl>
                            <Input placeholder="Din organisasjon" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Lagre endringer</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sikkerhetsinnstillinger</CardTitle>
              <CardDescription>
                Administrer kontoens sikkerhetsinnstillinger og påloggingsmetoder.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                  <FormField
                    control={securityForm.control}
                    name="twoFactorAuth"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>To-faktor autentisering</FormLabel>
                          <FormDescription>
                            Aktiver to-faktor autentisering for økt sikkerhet.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>E-postvarsling ved innlogging</FormLabel>
                          <FormDescription>
                            Få e-postvarsel når noen logger inn på kontoen din fra en ny enhet.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="loginAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Varsle om mistenkelig aktivitet</FormLabel>
                          <FormDescription>
                            Få varsel om mistenkelig aktivitet på kontoen din.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Lagre sikkerhetsinnstillinger</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Varslingsinnstillinger</CardTitle>
              <CardDescription>
                Administrer hvordan og når du vil motta varsler.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Varslingskanaler</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>E-postvarsler</FormLabel>
                              <FormDescription>
                                Motta varslinger på e-post.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>SMS-varsler</FormLabel>
                              <FormDescription>
                                Motta varslinger på SMS.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Hendelser</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={notificationForm.control}
                        name="notifyOnApprovals"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Godkjenninger</FormLabel>
                              <FormDescription>
                                Varsle når elementer blir godkjent.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="notifyOnComments"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Kommentarer</FormLabel>
                              <FormDescription>
                                Varsle ved nye kommentarer.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="notifyOnNewRequests"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:col-span-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Nye forespørsler</FormLabel>
                              <FormDescription>
                                Varsle når nye forespørsler registreres.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Sammendragsfrekvens</h4>
                    <FormField
                      control={notificationForm.control}
                      name="digestFrequency"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="daily" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Daglig sammendrag
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="weekly" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Ukentlig sammendrag
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="never" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Ingen sammendrag
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Lagre varslingsinnstillinger</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettingsPage;
