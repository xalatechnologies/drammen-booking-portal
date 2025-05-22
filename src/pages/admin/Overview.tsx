
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip, 
  Legend 
} from "recharts";

const OverviewPage = () => {
  // Sample data for the overview page
  const statsData = [
    { name: "Total Facilities", value: 124 },
    { name: "Pending Approvals", value: 18 },
    { name: "Active Users", value: 543 },
  ];

  const chartData = [
    { month: "Jan", bookings: 65, approvals: 28 },
    { month: "Feb", bookings: 59, approvals: 25 },
    { month: "Mar", bookings: 80, approvals: 36 },
    { month: "Apr", bookings: 81, approvals: 32 },
    { month: "May", bookings: 56, approvals: 24 },
    { month: "Jun", bookings: 55, approvals: 20 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {statsData.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main Content Section with 3 columns */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Overview Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Key performance indicators and metrics for facility management
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex justify-between">
                <span className="text-sm">Avg. Approval Time:</span>
                <span className="font-medium">2.4 days</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm">Utilization Rate:</span>
                <span className="font-medium">76%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm">Monthly Bookings:</span>
                <span className="font-medium">342</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Facility Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Recent facility updates and pending actions
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm">
                <span className="font-medium">3</span> new facilities added
              </li>
              <li className="text-sm">
                <span className="font-medium">7</span> facilities need maintenance
              </li>
              <li className="text-sm">
                <span className="font-medium">12</span> pending verification
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Approval Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Status of current approval processes
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm">
                <span className="font-medium">8</span> awaiting first review
              </li>
              <li className="text-sm">
                <span className="font-medium">5</span> pending final approval
              </li>
              <li className="text-sm">
                <span className="font-medium">3</span> rejected this month
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Reports & Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer 
            config={{
              bookings: { label: "Bookings" },
              approvals: { label: "Approvals" },
            }}
          >
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="bookings" fill="#4f46e5" name="Bookings" />
              <Bar dataKey="approvals" fill="#10b981" name="Approvals" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Additional Section for Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Configure which notifications you want to receive
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email notifications</span>
              <span className="text-sm text-green-600">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">SMS alerts</span>
              <span className="text-sm text-red-600">Disabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Browser notifications</span>
              <span className="text-sm text-green-600">Enabled</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Admin Profile & Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Profile & Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src="/placeholder.svg"
                alt="Admin profile"
                className="h-24 w-24 rounded-full"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Admin User</h3>
              <p className="text-sm text-muted-foreground">admin@drammen.kommune.no</p>
              <p className="text-sm">Last login: May 22, 2025 09:15</p>
              <p className="text-sm">Role: System Administrator</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
