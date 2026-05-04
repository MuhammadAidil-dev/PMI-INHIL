import AdminDashboardView from '@/features/admin-dashboard/components/view/AdminDashboardView';
import { bloodStockService } from '@/features/bloodStock/service/bloodStock.service';
import { donorService } from '@/features/donors/service/donors.service';
import { scheduleService } from '@/features/schedule/service/schedule.service';

export default async function AdminDashboardPage() {
  const [stockData, scheduleData, donorsData] = await Promise.all([
    bloodStockService.getAllStock(),
    scheduleService.getAllSchedule(),
    donorService.getDonorsRecent(),
  ]);

  if (stockData.error) {
    throw new Error(stockData.error.message);
  }

  if (scheduleData.error) {
    throw new Error(scheduleData.error.message);
  }

  if (donorsData.error) {
    throw new Error(donorsData.error.message);
  }

  return (
    <AdminDashboardView
      stocks={stockData.data.stocks}
      summary={stockData.data.summary}
      schedule={scheduleData.data}
      donors={donorsData.data}
    />
  );
}
