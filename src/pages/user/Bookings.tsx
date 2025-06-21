import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Filter, Plus, Eye, Edit2, Trash2, Clock, MapPin } from "lucide-react";
import { BookingService } from "@/services/BookingService";
import { useTranslation } from "@/hooks/useTranslation";

const BookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
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
      booking.facility?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || booking.type === filterType;
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="w-full">
      <PageHeader
        title={tSync("user.bookings.title", "My Bookings")}
        description={tSync("user.bookings.description", "View and manage your bookings")}
        actions={
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {tSync("user.bookings.newBooking", "New Booking")}
          </Button>
        }
      />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{tSync("user.bookings.upcomingBookings", "Upcoming Bookings")}</CardTitle>
          <CardDescription>{tSync("user.bookings.manageBookings", "Manage your upcoming bookings")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-4">
              <Input
                placeholder={tSync("user.bookings.searchPlaceholder", "Search bookings...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={tSync("user.bookings.filterType", "Filter by type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tSync("user.bookings.allTypes", "All Types")}</SelectItem>
                  <SelectItem value="sports">{tSync("user.bookings.sports", "Sports")}</SelectItem>
                  <SelectItem value="meeting">{tSync("user.bookings.meeting", "Meeting")}</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={tSync("user.bookings.filterStatus", "Filter by status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tSync("user.bookings.allStatuses", "All Statuses")}</SelectItem>
                  <SelectItem value="active">{tSync("user.bookings.active", "Active")}</SelectItem>
                  <SelectItem value="inactive">{tSync("user.bookings.inactive", "Inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("user.bookings.tableHeader.name", "Name")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("user.bookings.tableHeader.facility", "Facility")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("user.bookings.tableHeader.date", "Date")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("user.bookings.tableHeader.time", "Time")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("user.bookings.tableHeader.status", "Status")}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{tSync("user.bookings.tableHeader.actions", "Actions")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map(booking => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.facility}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Badge variant="secondary">{booking.status}</Badge>
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

export default BookingsPage;
