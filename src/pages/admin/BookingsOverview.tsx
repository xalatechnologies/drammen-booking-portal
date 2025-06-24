
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Calendar, User, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";

const BookingsOverviewPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFacility, setFilterFacility] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const { tSync } = useTranslation();

  // Fetch bookings directly from Supabase
  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          facilities(id, name),
          zones(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }

      return data || [];
    }
  });

  // Fetch strotime slots
  const { data: strotimeSlots = [] } = useQuery({
    queryKey: ['admin-strotime-slots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strotime_slots')
        .select(`
          *,
          facilities(id, name),
          zones(id, name)
        `)
        .order('slot_date', { ascending: true });

      if (error) {
        console.error('Error fetching strotime slots:', error);
        return [];
      }

      return data || [];
    }
  });

  // Fetch facilities for filter dropdown
  const { data: facilities = [] } = useQuery({
    queryKey: ['admin-facilities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facilities')
        .select('id, name')
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('Error fetching facilities:', error);
        return [];
      }

      return data || [];
    }
  });

  const filteredBookings = bookings.filter(booking => {
    const facilityName = booking.facilities?.name || 'Unknown Facility';
    const matchesSearch = facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contact_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || booking.type === filterType;
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesFacility = filterFacility === "all" || booking.facility_id.toString() === filterFacility;

    return matchesSearch && matchesType && matchesStatus && matchesFacility;
  });

  // Calculate stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending-approval').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

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
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Active bookings in system
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
            <div className="text-2xl font-bold">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
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
            <div className="text-2xl font-bold">{confirmedBookings}</div>
            <p className="text-xs text-muted-foreground">
              Ready to go
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
            <div className="text-2xl font-bold">{cancelledBookings}</div>
            <p className="text-xs text-muted-foreground">
              Cancelled bookings
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
                  <SelectItem value="pending-approval">{tSync("admin.bookings.filters.pending", "Pending")}</SelectItem>
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
                  {facilities.map(facility => (
                    <SelectItem key={facility.id} value={facility.id.toString()}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <p>{tSync("admin.common.loading", "Loading...")}</p>
          ) : filteredBookings.length > 0 ? (
            <div className="grid gap-4">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{booking.facilities?.name || 'Unknown Facility'}</h3>
                      <p className="text-sm text-gray-600">{booking.contact_name}</p>
                      <p className="text-sm text-gray-500">{booking.purpose}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(booking.start_date).toLocaleDateString('no-NO')} - 
                        {new Date(booking.end_date).toLocaleDateString('no-NO')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        booking.status === 'confirmed' ? 'default' : 
                        booking.status === 'pending-approval' ? 'secondary' : 
                        'destructive'
                      }>
                        {booking.status}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        {booking.total_price} NOK
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {tSync("admin.bookings.search.noResults", "No bookings found matching your criteria.")}
              </p>
              {strotimeSlots.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Available Strøtime Slots</h4>
                  <div className="grid gap-2 max-w-md mx-auto">
                    {strotimeSlots.slice(0, 5).map(slot => (
                      <div key={slot.id} className="border rounded p-2 text-sm">
                        <div className="flex justify-between">
                          <span>{slot.facilities?.name}</span>
                          <span>{slot.price_per_slot} NOK</span>
                        </div>
                        <div className="text-gray-500">
                          {slot.slot_date} {slot.start_time}-{slot.end_time}
                        </div>
                        <div className="text-xs text-gray-400">
                          {slot.current_participants}/{slot.max_participants} participants
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsOverviewPage;
