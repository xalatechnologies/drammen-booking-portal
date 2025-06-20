import React, { useState } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const UserProfilePage = () => {
    const [name, setName] = useState('Ola Nordmann');
    const [email, setEmail] = useState('ola.nordmann@example.com');
    const [phone, setPhone] = useState('98765432');
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        console.log('Lagrer data:', { name, email, phone });
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            <PageHeader 
                title="Profil / Organisasjon"
                description="Se og oppdater din personlige informasjon og kontaktdetaljer."
                actions={
                    !isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>Rediger</Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Avbryt</Button>
                            <Button onClick={handleSave}>Lagre endringer</Button>
                        </div>
                    )
                }
            />
            <Card>
                <CardHeader>
                    <CardTitle>Kontaktinformasjon</CardTitle>
                    <CardDescription>
                        Denne informasjonen brukes til å kontakte deg angående dine bookinger og din organisasjon.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Fullt navn</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-postadresse</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Mobilnummer</Label>
                        <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditing} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default UserProfilePage; 