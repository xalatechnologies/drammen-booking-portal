
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export function LocalizationTestComprehensive() {
  const { t, i18n } = useTranslation();
  const [testResults, setTestResults] = useState<any[]>([]);

  const runTests = () => {
    const results = [
      {
        test: 'Basic translation',
        key: 'common.save',
        result: t('common.save', {}, 'Save'),
        expected: 'Save'
      },
      {
        test: 'Fallback translation',
        key: 'nonexistent.key',
        result: t('nonexistent.key', {}, 'Fallback'),
        expected: 'Fallback'
      }
    ];
    
    setTestResults(results);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Localization Test Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests}>Run Tests</Button>
        
        <div className="space-y-2">
          <p>Current Language: {i18n.language}</p>
          
          {testResults.map((result, index) => (
            <div key={index} className="p-2 border rounded">
              <strong>{result.test}:</strong> {result.result}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
