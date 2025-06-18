
import React from "react";
import { Grid, Container } from "@/components/common/Layout";
import { Heading1, Heading2, BodyMedium } from "@/components/common/Typography";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AdminCard } from "./AdminCard";
import { BarChart3, Users, Building, Activity, TrendingUp, Clock } from "lucide-react";

export function AdminDashboard() {
  const stats = [
    {
      title: "Totale bookinger",
      value: "1,247",
      change: "+12%",
      changeType: "success" as const,
      icon: BarChart3,
    },
    {
      title: "Aktive brukere", 
      value: "892",
      change: "+8%",
      changeType: "success" as const,
      icon: Users,
    },
    {
      title: "Ledige lokaler",
      value: "45",
      change: "-3%", 
      changeType: "warning" as const,
      icon: Building,
    },
    {
      title: "Ventende godkjenninger",
      value: "23",
      change: "+5%",
      changeType: "info" as const,
      icon: Clock,
    },
  ];

  return (
    <Container className="space-y-spacing-xl">
      <div className="text-center space-y-spacing-lg">
        <Heading1 className="text-text-primary font-bold tracking-tight">Dashboard</Heading1>
        <BodyMedium className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Oversikt over booking-systemet for Drammen Kommune
        </BodyMedium>
      </div>

      <Grid cols={4} gap="lg" className="mb-spacing-xl">
        {stats.map((stat) => (
          <AdminCard 
            key={stat.title}
            title={stat.title}
            className="text-center"
          >
            <div className="space-y-spacing-lg">
              <div className="mx-auto w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-brand-primary" />
              </div>
              <div className="space-y-spacing-sm">
                <div className="text-3xl font-bold text-text-primary">
                  {stat.value}
                </div>
                <StatusBadge 
                  status={stat.changeType}
                  showIcon={false}
                  className="text-xs"
                >
                  {stat.change}
                </StatusBadge>
              </div>
            </div>
          </AdminCard>
        ))}
      </Grid>

      <Grid cols={2} gap="lg">
        <AdminCard 
          title="Nylige aktiviteter"
          description="Siste handlinger i systemet"
        >
          <div className="space-y-spacing-lg">
            {[
              { action: "Ny booking", user: "John Doe", time: "2 min siden", status: "success" },
              { action: "Booking avvist", user: "Jane Smith", time: "5 min siden", status: "error" },
              { action: "Lokale oppdatert", user: "Admin", time: "10 min siden", status: "info" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-spacing-md border-b border-primary last:border-0">
                <div>
                  <BodyMedium className="font-semibold text-text-primary">{activity.action}</BodyMedium>
                  <BodyMedium className="text-text-secondary text-sm">av {activity.user}</BodyMedium>
                </div>
                <div className="text-right">
                  <StatusBadge status={activity.status as any} showIcon={false} className="text-xs">
                    {activity.time}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard 
          title="System status"
          description="Oversikt over systemets tilstand"
        >
          <div className="space-y-spacing-lg">
            {[
              { service: "API Server", status: "success", uptime: "99.9%" },
              { service: "Database", status: "success", uptime: "99.8%" },
              { service: "Email Service", status: "warning", uptime: "98.5%" },
              { service: "SMS Service", status: "success", uptime: "99.2%" },
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between py-spacing-md border-b border-primary last:border-0">
                <BodyMedium className="font-semibold text-text-primary">{service.service}</BodyMedium>
                <div className="flex items-center gap-spacing-md">
                  <BodyMedium className="text-text-secondary text-sm">{service.uptime}</BodyMedium>
                  <StatusBadge status={service.status as any} showIcon>
                    {service.status === "success" ? "Aktiv" : "Advarsel"}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </Grid>
    </Container>
  );
}
