import { CalendarCheck, CalendarDays, UserCheck, Users } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import type { DashboardStats } from "@/types";

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <section aria-label="Stats" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <StatCard label="Total events" value={stats.totalEvents} icon={CalendarDays} />
      <StatCard label="Open for registration" value={stats.openEvents} icon={CalendarCheck} />
      <StatCard label="Registrations" value={stats.totalRegistrations} icon={Users} />
      <StatCard label="Checked in" value={stats.totalCheckedIn} icon={UserCheck} />
    </section>
  );
}
