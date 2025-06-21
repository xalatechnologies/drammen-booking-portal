
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { facilityMigrationHelper } from '@/utils/facilityMigrationHelper';
import { useToast } from '@/hooks/use-toast';

export const TranslationMigrationTool: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();

  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      await facilityMigrationHelper.migrateAllCoreFacilities();
      toast({
        title: "Migration Successful",
        description: "All facilities have been migrated to the database translation system.",
      });
    } catch (error) {
      console.error('Migration failed:', error);
      toast({
        title: "Migration Failed",
        description: "There was an error migrating the facilities. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Translation System Migration</CardTitle>
        <CardDescription>
          Migrate facility data to the new database-driven translation system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleMigration} 
          disabled={isMigrating}
          className="w-full"
        >
          {isMigrating ? 'Migrating...' : 'Start Migration'}
        </Button>
      </CardContent>
    </Card>
  );
};
