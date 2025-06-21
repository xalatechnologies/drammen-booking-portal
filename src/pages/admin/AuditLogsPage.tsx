import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarDays, Filter, Search, Download, Eye, Edit2, Trash2, Clock, MapPin, User } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const AuditLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { tSync } = useTranslation();

  const filterOptions = [
    {
      id: 'type',
      label: tSync("admin.auditLogs.filters.type", "Type"),
      value: filterType,
      onChange: setFilterType,
      options: [
        { value: 'all', label: tSync("admin.auditLogs.filters.allTypes", "All Types") },
        { value: 'login', label: tSync("admin.auditLogs.filters.login", "Login") },
        { value: 'logout', label: tSync("admin.auditLogs.filters.logout", "Logout") },
        { value: 'create', label: tSync("admin.auditLogs.filters.create", "Create") },
        { value: 'update', label: tSync("admin.auditLogs.filters.update", "Update") },
        { value: 'delete', label: tSync("admin.auditLogs.filters.delete", "Delete") },
      ]
    },
    {
      id: 'status',
      label: tSync("admin.auditLogs.filters.status", "Status"),
      value: filterStatus,
      onChange: setFilterStatus,
      options: [
        { value: 'all', label: tSync("admin.auditLogs.filters.allStatuses", "All Statuses") },
        { value: 'success', label: tSync("admin.auditLogs.filters.success", "Success") },
        { value: 'failed', label: tSync("admin.auditLogs.filters.failed", "Failed") },
      ]
    }
  ];

  return (
    <div>
      <PageHeader
        title={tSync("admin.auditLogs.management", "Audit Logs Management")}
        description={tSync("admin.auditLogs.pageDescription", "View and manage system audit logs")}
      />

      <Card>
        <CardHeader>
          <CardTitle>{tSync("admin.auditLogs.title", "Audit Logs")}</CardTitle>
          <CardDescription>{tSync("admin.auditLogs.description", "View, filter, and manage audit logs")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="col-span-1 md:col-span-3 flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={tSync("admin.auditLogs.search.placeholder", "Search audit logs...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {filterOptions.map((filter) => (
                <Select key={filter.id} value={filter.value} onValueChange={filter.onChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.auditLogs.table.user", "User")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.auditLogs.table.action", "Action")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.auditLogs.table.timestamp", "Timestamp")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.auditLogs.table.status", "Status")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.auditLogs.table.details", "Details")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">John Doe</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Logged In</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">2023-08-01 10:00:00</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="success">{tSync("admin.auditLogs.status.success", "Success")}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button variant="outline" size="sm">{tSync("admin.auditLogs.actions.view", "View")}</Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Jane Smith</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Failed Login</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">2023-08-01 09:30:00</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="destructive">{tSync("admin.auditLogs.status.failed", "Failed")}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button variant="outline" size="sm">{tSync("admin.auditLogs.actions.view", "View")}</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogsPage;
