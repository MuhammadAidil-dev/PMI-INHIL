import { ApiResult } from '@/lib/api/api-client';
import { DonorResponse } from '../type/donor.type';
import { apiServer } from '@/lib/api/api-server';

export const donorService = {
  getDonorsRecent: async (): Promise<ApiResult<DonorResponse[]>> => {
    return apiServer.get('/api/v1/donors/recents');
  },
};
