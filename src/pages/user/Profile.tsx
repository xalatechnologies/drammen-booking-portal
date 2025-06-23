import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Badge } from "@/components/ui/badge";
import { Building, User, ChevronsUpDown } from "lucide-react";

// Mock data
const mockUserAffiliations = [
    {
        organizationName: "Drammen IF",
        role: "Bookingansvarlig"
    },
    {
        organizationName: "Åssiden IF",
        role: "Medlem"
    }
];

const UserProfilePage = () => {
    const { t } = useTranslation();
    const [name, setName] = useState('Ola Nordmann');
    const [email, setEmail] = useState('ola.nordmann@example.com');
    const [phone, setPhone] = useState('98765432');
    const [isEditing, setIsEditing] = useState(false);
    const [affiliations, setAffiliations] = useState(mockUserAffiliations);

    const handleSave = () => {
        console.log('Saving data:', { name, email, phone });
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            <PageHeader 
                title={t('user.profile.title')}
                description={t('user.profile.description')}
                actions={
                    !isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>{t('user.profile.edit')}</Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>{t('user.profile.cancel')}</Button>
                            <Button onClick={handleSave}>{t('user.profile.save')}</Button>
                        </div>
                    )
                }
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Contact Info Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>{t('user.profile.contactInfo')}</CardTitle>
                        <CardDescription>
                            {t('user.profile.contactInfoDescription')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('user.profile.fullName')}</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('user.profile.email')}</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t('user.profile.phone')}</Label>
                            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditing} />
                        </div>
                    </CardContent>
                </Card>

                {/* Organizations Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>{t('user.profile.organizations')}</CardTitle>
                        <CardDescription>{t('user.profile.organizationsDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {affiliations.length > 0 ? (
                            affiliations.map((aff, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center">
                                        <Building className="mr-3 h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="font-semibold">{aff.organizationName}</p>
                                            <p className="text-sm text-gray-500">{aff.role}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline">{t('user.profile.role')}</Badge>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">{t('user.profile.noAffiliation')}</p>
                        )}
                        <Button variant="outline" className="w-full mt-4">
                            <ChevronsUpDown className="mr-2 h-4 w-4" />
                            {t('user.profile.changeOrg')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default UserProfilePage;
