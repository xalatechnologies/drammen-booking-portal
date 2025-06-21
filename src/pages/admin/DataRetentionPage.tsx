import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";

const DataRetentionPage = () => {
  const [retentionPeriod, setRetentionPeriod] = useState("3 months");
  const [anonymizationMethod, setAnonymizationMethod] = useState("pseudonymization");
  const { tSync } = useTranslation();

  return (
    <div>
      <PageHeader
        title={tSync("admin.dataRetention.title", "Data Retention & Anonymization")}
        description={tSync("admin.dataRetention.description", "Configure data retention policies and anonymization methods")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{tSync("admin.dataRetention.retentionPolicy", "Retention Policy")}</CardTitle>
            <CardDescription>{tSync("admin.dataRetention.retentionPolicyDescription", "Define how long data is stored before being anonymized or deleted.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="retention-period">{tSync("admin.dataRetention.retentionPeriodLabel", "Retention Period")}</Label>
              <Select value={retentionPeriod} onValueChange={setRetentionPeriod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={tSync("admin.dataRetention.selectPeriod", "Select a period")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 month">{tSync("admin.dataRetention.oneMonth", "1 Month")}</SelectItem>
                  <SelectItem value="3 months">{tSync("admin.dataRetention.threeMonths", "3 Months")}</SelectItem>
                  <SelectItem value="6 months">{tSync("admin.dataRetention.sixMonths", "6 Months")}</SelectItem>
                  <SelectItem value="1 year">{tSync("admin.dataRetention.oneYear", "1 Year")}</SelectItem>
                  <SelectItem value="2 years">{tSync("admin.dataRetention.twoYears", "2 Years")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button>{tSync("admin.dataRetention.applySettings", "Apply Settings")}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{tSync("admin.dataRetention.anonymizationMethod", "Anonymization Method")}</CardTitle>
            <CardDescription>{tSync("admin.dataRetention.anonymizationMethodDescription", "Choose the method used to anonymize data after the retention period.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="anonymization-method">{tSync("admin.dataRetention.anonymizationMethodLabel", "Method")}</Label>
              <Select value={anonymizationMethod} onValueChange={setAnonymizationMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={tSync("admin.dataRetention.selectMethod", "Select a method")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pseudonymization">{tSync("admin.dataRetention.pseudonymization", "Pseudonymization")}</SelectItem>
                  <SelectItem value="deletion">{tSync("admin.dataRetention.deletion", "Deletion")}</SelectItem>
                  <SelectItem value="aggregation">{tSync("admin.dataRetention.aggregation", "Aggregation")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button>{tSync("admin.dataRetention.applySettings", "Apply Settings")}</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{tSync("admin.dataRetention.complianceStatus", "Compliance Status")}</CardTitle>
          <CardDescription>{tSync("admin.dataRetention.complianceStatusDescription", "Overview of your compliance with data retention policies.")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="outline">{tSync("admin.dataRetention.statusCompliant", "Compliant")}</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataRetentionPage;
