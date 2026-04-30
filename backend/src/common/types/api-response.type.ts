export type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ApiResponse<T = undefined> = T extends undefined
  ? { success: boolean; message: string }
  : { success: boolean; message: string; data: T; meta?: Meta };
