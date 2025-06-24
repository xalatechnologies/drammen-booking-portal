
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppLocations, useAppActors, useAppUsers } from "@/hooks/useAppData";
import { AppLocalizationService } from "@/services/AppLocalizationService";
import { PlayCircle, RefreshCw, Globe, Database, Users, Building, MapPin } from "lucide-react";

export function SystemTestingPanel() {
  const { language, toggleLanguage } = useLanguage();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Data hooks
  const { data: locations, isLoading: locationsLoading, error: locationsError } = useAppLocations();
  const { data: actors, isLoading: actorsLoading, error: actorsError } = useAppActors();
  const { data: users, isLoading: usersLoading, error: usersError } = useAppUsers();

  const runTests = async () => {
    setIsRunning(true);
    const results = [];

    try {
      // Test 1: Translation Service
      const translationTest = AppLocalizationService.getLocalizedContent(
        { NO: "Norsk tekst", EN: "English text" },
        language
      );
      results.push({
        name: "Translation Service",
        status: translationTest ? "pass" : "fail",
        result: translationTest,
        expected: language === 'NO' ? "Norsk tekst" : "English text"
      });

      // Test 2: Data Loading
      results.push({
        name: "Locations Loading",
        status: locations && locations.length > 0 ? "pass" : locationsError ? "fail" : "pending",
        result: `${locations?.length || 0} locations loaded`,
        error: locationsError?.message
      });

      results.push({
        name: "Actors Loading", 
        status: actors && actors.length > 0 ? "pass" : actorsError ? "fail" : "pending",
        result: `${actors?.length || 0} actors loaded`,
        error: actorsError?.message
      });

      results.push({
        name: "Users Loading",
        status: users && users.length > 0 ? "pass" : usersError ? "fail" : "pending", 
        result: `${users?.length || 0} users loaded`,
        error: usersError?.message
      });

      // Test 3: Localized Content
      if (locations && locations.length > 0) {
        const firstLocation = locations[0];
        const localizedName = AppLocalizationService.getLocalizedContent(firstLocation.name, language);
        results.push({
          name: "Location Localization",
          status: localizedName ? "pass" : "fail",
          result: localizedName,
          details: `Location: ${firstLocation.id}`
        });
      }

      setTestResults(results);
    } catch (error) {
      console.error('Test execution failed:', error);
      results.push({
        name: "Test Execution",
        status: "fail",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setTestResults(results);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'fail': return 'bg-red-100 text-red-800'; 
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="h-4 w-4" />
            )}
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          
          <Button variant="outline" onClick={toggleLanguage}>
            <Globe className="h-4 w-4 mr-2" />
            Current: {language}
          </Button>
        </div>
        
        <Badge variant="outline" className="text-sm">
          Language: {language === 'NO' ? 'Norwegian' : 'English'}
        </Badge>
      </div>

      {/* Data Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {locationsLoading ? '...' : locations?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {locationsLoading ? 'Loading...' : locationsError ? 'Error loading' : 'Available'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building className="h-4 w-4" />
              Actors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {actorsLoading ? '...' : actors?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {actorsLoading ? 'Loading...' : actorsError ? 'Error loading' : 'Available'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usersLoading ? '...' : users?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {usersLoading ? 'Loading...' : usersError ? 'Error loading' : 'Available'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((test, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{test.name}</span>
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                    </div>
                    {test.result && (
                      <p className="text-sm text-gray-600 mb-1">
                        Result: {test.result}
                      </p>
                    )}
                    {test.expected && (
                      <p className="text-sm text-gray-500">
                        Expected: {test.expected}
                      </p>
                    )}
                    {test.error && (
                      <p className="text-sm text-red-600">
                        Error: {test.error}
                      </p>
                    )}
                    {test.details && (
                      <p className="text-sm text-gray-500">
                        {test.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sample Data */}
      {locations && locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Location Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(locations[0], null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
