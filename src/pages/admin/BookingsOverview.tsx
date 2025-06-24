
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Calendar, User, Clock } from "lucide-react";
import { BookingService } from "@/services/BookingService";
import { useTranslation } from "@/hooks/useTranslation";

const BookingsOverviewPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFacility, setFilterFacility] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const { tSync } = useTranslation();

  const { data: bookingsResponse, isLoading, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => BookingService.getBookings({
      page: 1,
      limit: 50
    })
  });

  const bookings = bookingsResponse?.success ? bookingsResponse.data?.items || [] : [];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || booking.type === filterType;
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={tSync("admin.bookings.management", "Bookings Management")}
        description={tSync("admin.bookings.pageDescription", "Manage all facility bookings and reservations")}
        actions={
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {tSync("admin.bookings.addNew", "Add New Booking")}
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tSync("admin.bookings.stats.total", "Total Bookings")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tSync("admin.bookings.stats.pending", "Pending Approval")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tSync("admin.bookings.stats.confirmed", "Confirmed")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tSync("admin.bookings.stats.cancelled", "Cancelled")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              -2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>{tSync("admin.bookings.list.title", "All Bookings")}</CardTitle>
          <CardDescription>{tSync("admin.bookings.list.description", "View and manage all facility bookings")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex-1 flex items-center space-x-2">
              <Input
                type="search"
                placeholder={tSync("admin.bookings.search.placeholder", "Search bookings...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={tSync("admin.bookings.filters.status", "Filter by status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tSync("admin.bookings.filters.allStatuses", "All Statuses")}</SelectItem>
                  <SelectItem value="pending">{tSync("admin.bookings.filters.pending", "Pending")}</SelectItem>
                  <SelectItem value="confirmed">{tSync("admin.bookings.filters.confirmed", "Confirmed")}</SelectItem>
                  <SelectItem value="cancelled">{tSync("admin.bookings.filters.cancelled", "Cancelled")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterFacility} onValueChange={setFilterFacility}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={tSync("admin.bookings.filters.facility", "Filter by facility")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tSync("admin.bookings.filters.allFacilities", "All Facilities")}</SelectItem>
                  <SelectItem value="hall-1">{tSync("admin.bookings.filters.hall1", "Sports Hall 1")}</SelectItem>
                  <SelectItem value="conference-a">{tSync("admin.bookings.filters.conferenceA", "Conference Room A")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <p>{tSync("admin.common.loading", "Loading...")}</p>
          ) : bookings.length > 0 ? (
            <div className="grid gap-4">
              {bookings.map(booking => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{booking.facilityName || 'Unknown Facility'}</h3>
                      <p className="text-sm text-gray-600">{booking.organizationName || 'Unknown Organization'}</p>
                    </div>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'destructive'}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>{tSync("admin.bookings.search.noResults", "No bookings found matching your criteria.")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsOverviewPage;
