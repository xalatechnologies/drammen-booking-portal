import React, { useState } from "react";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Users, Calendar, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const Distribution = () => {
  const { tSync } = useTranslation();

  const [distributionData, setDistributionData] = useState([
    { id: 1, name: "Brandengen Skole", users: 25, allocated: 75, used: 60 },
    { id: 2, name: " পৌরসভা সিটি কর্পোরেশন উচ্চ বিদ্যালয়", users: 18, allocated: 60, used: 45 },
    { id: 3, name: "Hønefoss barneskole", users: 32, allocated: 90, used: 70 },
  ]);

  const totalAllocated = distributionData.reduce((sum, item) => sum + item.allocated, 0);
  const totalUsed = distributionData.reduce((sum, item) => sum + item.used, 0);

  return (
    <div>
      <PageHeader
        title={tSync("umbrella.distribution.title", "Distribution Overview")}
        description={tSync("umbrella.distribution.description", "View and manage time distribution across different entities")}
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {tSync("umbrella.distribution.addEntity", "Add New Entity")}
          </Button>
        }
      />

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{tSync("umbrella.distribution.overallStatus", "Overall Distribution Status")}</CardTitle>
          <CardDescription>{tSync("umbrella.distribution.totalTime", "Total Time Allocated and Used")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span>{tSync("umbrella.distribution.allocatedTime", "Allocated Time")}</span>
                <span>{totalAllocated} {tSync("umbrella.distribution.hours", "hours")}</span>
              </div>
              <Progress value={(totalAllocated / (totalAllocated + totalUsed)) * 100} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span>{tSync("umbrella.distribution.usedTime", "Used Time")}</span>
                <span>{totalUsed} {tSync("umbrella.distribution.hours", "hours")}</span>
              </div>
              <Progress value={(totalUsed / (totalAllocated + totalUsed)) * 100} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 space-y-4">
        {distributionData.map((item) => (
          <Card key={item.id} className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {item.name}
                <Badge variant="secondary">
                  <Users className="w-4 h-4 mr-2" />
                  {item.users} {tSync("umbrella.distribution.users", "Users")}
                </Badge>
              </CardTitle>
              <CardDescription>
                {tSync("umbrella.distribution.timeManagement", "Time Management for")} {item.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>{tSync("umbrella.distribution.allocatedTime", "Allocated Time")}</span>
                    <span>{item.allocated} {tSync("umbrella.distribution.hours", "hours")}</span>
                  </div>
                  <Progress value={(item.used / item.allocated) * 100} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>{tSync("umbrella.distribution.usedTime", "Used Time")}</span>
                    <span>{item.used} {tSync("umbrella.distribution.hours", "hours")}</span>
                  </div>
                  <Progress value={(item.used / item.allocated) * 100} />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  {tSync("umbrella.distribution.viewCalendar", "View Calendar")}
                </Button>
                <Button>
                  <Clock className="w-4 h-4 mr-2" />
                  {tSync("umbrella.distribution.manageTime", "Manage Time")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Distribution;
