import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { Zone, useFacilityZoneStore } from '@/stores/useFacilityZoneStore';
import { ZoneFormDialog } from './ZoneFormDialog';
import { ZoneList } from './ZoneList';

interface ZoneEditorProps {
    facilityId: string;
}

export const ZoneEditor: React.FC<ZoneEditorProps> = ({ facilityId }) => {
    const { t } = useTranslation();
    const { zones } = useFacilityZoneStore((state) => ({ zones: state.zones }));
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState<Zone | undefined>(undefined);

    // TODO: Fetch existing zones for the facilityId and initialize the store
    // useEffect(() => {
    //   if(facilityId) {
    //     // const fetchedZones = await fetchZones(facilityId);
    //     // actions.initialize(fetchedZones);
    //   }
    // }, [facilityId, actions]);

    const handleOpenDialog = (zone?: Zone) => {
        setSelectedZone(zone);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setSelectedZone(undefined);
        setDialogOpen(false);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('admin:zones.title')}</CardTitle>
                        <CardDescription>{t('admin:zones.description')}</CardDescription>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('admin:zones.addNew')}
                    </Button>
                </CardHeader>
                <CardContent>
                    {zones.length === 0 
                        ? (
                            <div className="p-6 text-center text-muted-foreground">
                                {t('admin:zones.emptyState')}
                            </div>
                        )
                        : <ZoneList zones={zones} onEdit={handleOpenDialog} />
                    }
                </CardContent>
            </Card>

            <ZoneFormDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                zone={selectedZone}
            />
        </>
    );
};
