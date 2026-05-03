import BloodStockChart, {
  BloodTypeStock,
} from '@/components/card/BloodStockChart';
import {
  Package,
  UserPlus,
  CalendarDays,
  TrendingUp,
  AlertCircle,
  Clock,
} from 'lucide-react';
import UpcomingEvents, { DonationEvent } from '../card/UpcomingEventCard';
import RecentRecords, { DonorRecord } from '../card/RecentRecord';
import StatCard from '@/components/card/StatCard';

// --- Mock data (replace with real API calls) ---

const bloodStocks: BloodTypeStock[] = [
  { type: 'A+', percentage: 75 },
  { type: 'A-', percentage: 60 },
  { type: 'B+', percentage: 85 },
  { type: 'B-', percentage: 40 },
  { type: 'O+', percentage: 95 },
  { type: 'O-', percentage: 25, isCritical: true },
  { type: 'AB+', percentage: 50 },
  { type: 'AB-', percentage: 30 },
];

const upcomingEvents: DonationEvent[] = [
  {
    id: '1',
    month: 'Oct',
    day: 26,
    title: 'City Hall Drive',
    time: '09:00 - 16:00',
  },
  {
    id: '2',
    month: 'Oct',
    day: 28,
    title: 'University Campus',
    time: '10:00 - 14:00',
  },
  {
    id: '3',
    month: 'Nov',
    day: 2,
    title: 'Corporate CSR',
    time: '08:00 - 12:00',
  },
];

const recentRecords: DonorRecord[] = [
  { id: '1', name: 'Ahmad Zakaria', bloodType: 'O+', status: 'Verified' },
  { id: '2', name: 'Siti Nurhaliza', bloodType: 'B-', status: 'Pending' },
  { id: '3', name: 'Robert Evans', bloodType: 'A+', status: 'Verified' },
];

// ------------------------------------------------

export default function AdminDashboardView() {
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
            value="14,208"
            icon={Package}
            badge={{ type: 'success', icon: TrendingUp, label: '+12% growth' }}
          />
          <StatCard
            title="New Donors"
            value={342}
            icon={UserPlus}
            badge={{
              type: 'danger',
              icon: AlertCircle,
              label: 'Critical: Type O-',
            }}
          />
          <StatCard
            title="Daily Schedule"
            value={18}
            icon={CalendarDays}
            badge={{ type: 'neutral', icon: Clock, label: '6 slots left' }}
          />
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <BloodStockChart stocks={bloodStocks} lastUpdated="10:42 AM" />
          <UpcomingEvents events={upcomingEvents} />
        </div>

        {/* Secondary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentRecords records={recentRecords} />
        </div>
      </div>
    </main>
  );
}
