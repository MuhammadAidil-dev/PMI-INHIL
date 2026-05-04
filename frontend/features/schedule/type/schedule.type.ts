export type ScheduleStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface ISchedule {
  _id: string;
  title: string;
  location: string;
  address: string;
  date: Date;
  startTime: string; // format "HH:mm"
  endTime: string; // format "HH:mm"
  donorQuota: number;
  registeredDonors: number;
  status: ScheduleStatus;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
