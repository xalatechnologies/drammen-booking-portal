import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, Download, Eye, Edit2, Trash2, Clock, MapPin, User } from "lucide-react";
import { BookingService } from "@/services/BookingService";
import { useTranslation } from "@/hooks/useTranslation";

const BookingsOverview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { tSync } = useTranslation();

  const { data: bookingsResponse, isLoading, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => BookingService.getBookings({
      page: 1,
      limit: 50
    }, {}, {})
  });

  const bookings = bookingsResponse?.success ? bookingsResponse.data?.data || [] : [];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || booking.type === filterType;
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const filterOptions = [
    {
      id: 'type',
      label: tSync("admin.bookings.filters.type", "Type"),
      value: filterType,
      onChange: setFilterType,
      options: [
        { value: 'all', label: tSync("admin.bookings.filters.allTypes", "All Types") },
        { value: 'sports', label: tSync("admin.bookings.filters.sports", "Sports") },
        { value: 'meeting', label: tSync("admin.bookings.filters.meeting", "Meeting") }
      ]
    },
    {
      id: 'status',
      label: tSync("admin.bookings.filters.status", "Status"),
      value: filterStatus,
      onChange: setFilterStatus,
      options: [
        { value: 'all', label: tSync("admin.bookings.filters.allStatuses", "All Statuses") },
        { value: 'active', label: tSync("admin.bookings.filters.active", "Active") },
        { value: 'inactive', label: tSync("admin.bookings.filters.inactive", "Inactive") }
      ]
    }
  ];

  return (
    <div className="w-full">
      <PageHeader
        title={tSync("admin.bookings.management", "Bookings Management")}
        description={tSync("admin.bookings.pageDescription", "Overview and management of all bookings")}
        actions={
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {tSync("admin.bookings.addNew", "Add New Booking")}
          </Button>
        }
      />

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">{tSync("admin.bookings.overview", "Bookings Overview")}</CardTitle>
          <CardDescription>{tSync("admin.bookings.manageBookings", "Manage and overview all bookings")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  {tSync("admin.bookings.totalBookings", "Total Bookings")}
                </CardTitle>
                <CardDescription>{tSync("admin.bookings.allBookings", "All bookings in the system")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">124</div>
                <Badge variant="secondary">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  +20% {tSync("admin.bookings.sinceLastMonth", "Since last month")}
                </Badge>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  {tSync("admin.bookings.upcomingBookings", "Upcoming Bookings")}
                </CardTitle>
                <CardDescription>{tSync("admin.bookings.bookingsInFuture", "Bookings scheduled in the future")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">32</div>
                <Badge variant="secondary">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  +12% {tSync("admin.bookings.sinceLastWeek", "Since last week")}
                </Badge>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  {tSync("admin.bookings.activeUsers", "Active Users")}
                </CardTitle>
                <CardDescription>{tSync("admin.bookings.usersWithBookings", "Users with active bookings")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">68</div>
                <Badge variant="secondary">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  +8% {tSync("admin.bookings.sinceYesterday", "Since yesterday")}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder={tSync("admin.bookings.searchPlaceholder", "Search bookings...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />

              <div className="flex items-center space-x-4">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={tSync("admin.bookings.filterByDate", "Filter by Date")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">{tSync("admin.bookings.today", "Today")}</SelectItem>
                    <SelectItem value="yesterday">{tSync("admin.bookings.yesterday", "Yesterday")}</SelectItem>
                    <SelectItem value="lastWeek">{tSync("admin.bookings.lastWeek", "Last Week")}</SelectItem>
                    <SelectItem value="lastMonth">{tSync("admin.bookings.lastMonth", "Last Month")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={tSync("admin.bookings.filterByType", "Filter by Type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{tSync("admin.bookings.allTypes", "All Types")}</SelectItem>
                    <SelectItem value="sports">{tSync("admin.bookings.sports", "Sports")}</SelectItem>
                    <SelectItem value="meeting">{tSync("admin.bookings.meeting", "Meeting")}</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {tSync("admin.bookings.filters", "Filters")}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.bookings.name", "Name")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.bookings.user", "User")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.bookings.facility", "Facility")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.bookings.date", "Date")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.bookings.time", "Time")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.bookings.status", "Status")}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("admin.bookings.actions", "Actions")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map(booking => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.facility}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Badge variant="outline">{booking.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsOverview;
