import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockMessages = [
  { id: 1, from: 'Drammen Kommune Kultur', title: 'Viktig informasjon om sesongstart 2024/2025', date: '2024-08-15', read: false },
  { id: 2, from: 'Drammen Kommune Idrett', title: 'Endringer i retningslinjer for bruk av haller', date: '2024-07-20', read: true },
  { id: 3, from: 'Drammen Kommune Kultur', title: 'Påminnelse: Frist for å søke kompensasjon', date: '2024-06-30', read: true },
];

const MessagesPage = () => {
    return (
        <div className="space-y-8">
            <PageHeader 
                title="Meldinger og Varsler"
                description="Her finner du viktig informasjon og varsler fra kommunen."
            />
            <div className="space-y-4">
                {mockMessages.map((message) => (
                    <Card key={message.id} className={`cursor-pointer hover:shadow-md transition-shadow ${!message.read ? 'bg-blue-50 border-blue-200' : ''}`}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{message.title}</CardTitle>
                                    <CardDescription>Fra: {message.from} - {message.date}</CardDescription>
                                </div>
                                {!message.read && <Badge>Ny</Badge>}
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default MessagesPage;
