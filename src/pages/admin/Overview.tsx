
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Wrench, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Plus,
  FileText,
  DollarSign,
  Package
} from "lucide-react";

const OverviewPage = () => {
  const statsCards = [
    {
      title: "Open Work Orders",
      value: "12",
      change: "+2 from yesterday",
      icon: Wrench,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "up"
    },
    {
      title: "Low Stock Items",
      value: "7",
      change: "3 critical",
      icon: AlertTriangle,
      color: "bg-red-50",
      iconColor: "text-red-600",
      trend: "down"
    },
    {
      title: "Upcoming PM",
      value: "15",
      change: "Next 7 days",
      icon: Clock,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: "up"
    },
    {
      title: "Active Assets",
      value: "143",
      change: "All systems operational",
      icon: CheckCircle,
      color: "bg-green-50",
      iconColor: "text-green-600",
      trend: "neutral"
    }
  ];

  const workOrders = [
    {
      id: "#5489",
      title: "Forklift - Hydraulics Non-Start",
      assignee: "Mary Kavanagh",
      status: "On Hold",
      statusColor: "bg-yellow-100 text-yellow-800",
      dueDate: "Due Today"
    },
    {
      id: "#5495",
      title: "Daily Site Walk",
      assignee: "Mary Kavanagh",
      status: "Open",
      statusColor: "bg-blue-100 text-blue-800",
      dueDate: "Due Tomorrow"
    },
    {
      id: "#5488",
      title: "OSHA Compliance - Daily Site Walk",
      assignee: "Chris Manning",
      status: "On Hold",
      statusColor: "bg-yellow-100 text-yellow-800",
      dueDate: "Due This Week"
    }
  ];

  const quickActions = [
    {
      title: "New Work Order",
      icon: Wrench,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "New Request",
      icon: FileText,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "New PO",
      icon: DollarSign,
      color: "bg-yellow-50 text-yellow-600"
    },
    {
      title: "Add Asset",
      icon: Package,
      color: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              Welcome back! 👋
            </h1>
            <p className="text-slate-300">Here's what's happening with your operations today</p>
          </div>
          <Button className="bg-slate-600 hover:bg-slate-500 text-white">
            Create Work Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
              {stat.trend === "up" && (
                <div className="absolute top-4 right-4">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Work Orders */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Work Orders</h3>
                <Badge variant="secondary">3 active</Badge>
              </div>
            </div>
            <CardContent className="p-0">
              <div className="space-y-0">
                {workOrders.map((order, index) => (
                  <div key={index} className="p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-blue-600">{order.id}</span>
                          <Badge className={order.statusColor} variant="secondary">
                            {order.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{order.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                {order.assignee.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{order.assignee}</span>
                          </div>
                          <span>•</span>
                          <span>{order.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t bg-gray-50">
                <Button variant="outline" className="w-full">
                  View All Work Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                ⚡ Quick Actions
              </h3>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                  >
                    <div className={`p-2 rounded-md ${action.color}`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    {action.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
