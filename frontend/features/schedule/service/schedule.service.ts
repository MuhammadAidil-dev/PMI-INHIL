import { apiClient, ApiResult } from '@/lib/api/api-client';
import { ISchedule } from '../type/schedule.type';

export const scheduleService = {
  getAllSchedule: async (): Promise<ApiResult<ISchedule[]>> => {
    return apiClient.get('/api/v1/public/schedules');
  },
};
