import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Clock, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

const OverviewPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(50);

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Dashboard overview and summary of key metrics"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Bookings</span>
            </CardTitle>
            <CardDescription>Total number of bookings this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">325</div>
            <div className="text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>+12% from last month</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </CardTitle>
            <CardDescription>Total number of active users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,450</div>
            <div className="text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>+5% from last month</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Avg. Booking Duration</span>
            </CardTitle>
            <CardDescription>Average duration of bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.5 hrs</div>
            <div className="text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>+3% from last month</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Alerts</span>
            </CardTitle>
            <CardDescription>System alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Low server resources</span>
                <Badge variant="destructive">High</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Pending user approvals</span>
                <Badge variant="secondary">Medium</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Tasks</span>
            </CardTitle>
            <CardDescription>Ongoing tasks and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Database optimization</span>
                <span>
                  <Progress value={progress} />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>User interface improvements</span>
                <span>
                  <Progress value={70} />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loading State</CardTitle>
            <CardDescription>Demonstrates a loading state</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">Loading...</div>
            ) : (
              <Button onClick={() => setLoading(true)}>Load Data</Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error State</CardTitle>
            <CardDescription>Demonstrates an error state</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-red-500">Error: Could not fetch data.</div>
            ) : (
              <Button onClick={() => setError(true)}>Trigger Error</Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
