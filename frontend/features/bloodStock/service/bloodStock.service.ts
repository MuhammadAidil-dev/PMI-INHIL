import { apiClient, ApiResult } from '@/lib/api/api-client';
import { IBloodStock } from '../type/bloodStock.type';

export type GetAllStockResponse = {
  stocks: IBloodStock[];
  summary: {
    totalBags: number;
    criticalCount: number;
  };
};

export const bloodStockService = {
  getAllStock: async (): Promise<ApiResult<GetAllStockResponse>> => {
    return apiClient.get('/api/v1/blood-stocks');
  },
};
