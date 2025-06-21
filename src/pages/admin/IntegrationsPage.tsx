import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings, Zap, Globe, Database, MessageSquare } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const IntegrationsPage = () => {
  const { tSync } = useTranslation();
  const [isSlackEnabled, setIsSlackEnabled] = useState(false);
  const [isGoogleDriveEnabled, setIsGoogleDriveEnabled] = useState(false);
  const [isDropboxEnabled, setIsDropboxEnabled] = useState(false);
  const [isJiraEnabled, setIsJiraEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title={tSync("admin.integrations.title", "Integrations")}
        description={tSync("admin.integrations.description", "Connect your platform with other services")}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {tSync("admin.integrations.addIntegration", "Add Integration")}
          </Button>
        }
      />

      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">{tSync("admin.integrations.availableIntegrations", "Available")}</TabsTrigger>
          <TabsTrigger value="manage">{tSync("admin.integrations.manageIntegrations", "Manage")}</TabsTrigger>
        </TabsList>
        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{tSync("admin.integrations.slackIntegration", "Slack Integration")}</CardTitle>
              <CardDescription>{tSync("admin.integrations.slackDescription", "Connect with Slack for notifications and updates")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="slack">{tSync("admin.integrations.enableSlack", "Enable Slack")}</Label>
                <Switch id="slack" checked={isSlackEnabled} onCheckedChange={setIsSlackEnabled} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{tSync("admin.integrations.googleDriveIntegration", "Google Drive Integration")}</CardTitle>
              <CardDescription>{tSync("admin.integrations.googleDriveDescription", "Integrate with Google Drive for file storage and sharing")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="google-drive">{tSync("admin.integrations.enableGoogleDrive", "Enable Google Drive")}</Label>
                <Switch id="google-drive" checked={isGoogleDriveEnabled} onCheckedChange={setIsGoogleDriveEnabled} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{tSync("admin.integrations.dropboxIntegration", "Dropbox Integration")}</CardTitle>
              <CardDescription>{tSync("admin.integrations.dropboxDescription", "Connect with Dropbox for seamless file management")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="dropbox">{tSync("admin.integrations.enableDropbox", "Enable Dropbox")}</Label>
                <Switch id="dropbox" checked={isDropboxEnabled} onCheckedChange={setIsDropboxEnabled} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{tSync("admin.integrations.jiraIntegration", "Jira Integration")}</CardTitle>
              <CardDescription>{tSync("admin.integrations.jiraDescription", "Integrate with Jira for project management")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="jira">{tSync("admin.integrations.enableJira", "Enable Jira")}</Label>
                <Switch id="jira" checked={isJiraEnabled} onCheckedChange={setIsJiraEnabled} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>{tSync("admin.integrations.activeIntegrations", "Active Integrations")}</CardTitle>
              <CardDescription>{tSync("admin.integrations.manageActiveIntegrations", "Manage your active integrations")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isSlackEnabled && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>{tSync("admin.integrations.slackIntegration", "Slack Integration")}</span>
                  </div>
                  <Button variant="outline" size="sm">{tSync("admin.integrations.disconnect", "Disconnect")}</Button>
                </div>
              )}
              {isGoogleDriveEnabled && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-green-500" />
                    <span>{tSync("admin.integrations.googleDriveIntegration", "Google Drive Integration")}</span>
                  </div>
                  <Button variant="outline" size="sm">{tSync("admin.integrations.disconnect", "Disconnect")}</Button>
                </div>
              )}
              {isDropboxEnabled && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-green-500" />
                    <span>{tSync("admin.integrations.dropboxIntegration", "Dropbox Integration")}</span>
                  </div>
                  <Button variant="outline" size="sm">{tSync("admin.integrations.disconnect", "Disconnect")}</Button>
                </div>
              )}
              {isJiraEnabled && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    <span>{tSync("admin.integrations.jiraIntegration", "Jira Integration")}</span>
                  </div>
                  <Button variant="outline" size="sm">{tSync("admin.integrations.disconnect", "Disconnect")}</Button>
                </div>
              )}
              {!isSlackEnabled && !isGoogleDriveEnabled && !isDropboxEnabled && !isJiraEnabled && (
                <p className="text-sm text-muted-foreground">{tSync("admin.integrations.noActiveIntegrations", "No active integrations")}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsPage;
