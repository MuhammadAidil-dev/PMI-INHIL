import {
  Package,
  UserPlus,
  CalendarDays,
  AlertCircle,
  Clock,
} from 'lucide-react';
import UpcomingEvents, { DonationEvent } from '../card/UpcomingEventCard';
import RecentRecords, { DonorRecord } from '../card/RecentRecord';
import StatCard from '@/components/card/StatCard';
import { IBloodStock } from '@/features/bloodStock/type/bloodStock.type';
import { ISchedule } from '@/features/schedule/type/schedule.type';
import { DonorResponse } from '@/features/donors/type/donor.type';

type DashboardProps = {
  stocks: IBloodStock[];
  summary: {
    totalBags: number;
    criticalCount: number;
  };
  schedule: ISchedule[];
  donors: DonorResponse[];
};

export default function AdminDashboardView({
  stocks,
  summary,
  schedule,
  donors,
}: DashboardProps) {
  const upcomingEvents: DonationEvent[] = schedule.map((data) => {
    const date = new Date(data.date);

    return {
      id: data._id,
      month: date.getMonth() + 1,
      day: date.getDate(),
      title: data.title,
      time: `${data.startTime} - ${data.endTime}`,
    };
  });

  const recentsDonor: DonorRecord[] = donors.map((data) => ({
    id: data.id,
    name: data.fullName,
    bloodType: data.bloodType,
    total: data.totalDonations,
  }));
  return (
    <main className="lg:ml-64 w-full p-6 bg-gray-50 min-h-[calc(100vh-60px)]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-base text-gray-500 mt-1">
              Live updates from PMI INHIL
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
              <CalendarDays size={16} className="text-rose-600" />
              <span className="font-semibold text-gray-600 text-xs">
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Stock"
            value={summary.totalBags}
            icon={Package}
          />
          <StatCard title="New Donors" value={donors.length} icon={UserPlus} />
          <StatCard
            title="Jadwal Mendatang"
            value={upcomingEvents.length}
            icon={CalendarDays}
          />
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <RecentRecords records={recentsDonor} />
          <UpcomingEvents events={upcomingEvents} />
        </div>
      </div>
    </main>
  );
}
