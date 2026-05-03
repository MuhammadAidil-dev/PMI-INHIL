export type NewsStatus = 'published' | 'draft';

export type NewsCategory = 'Darurat' | 'Edukasi' | 'Kesehatan' | 'Informasi';

export type BroadcastTarget =
  | 'all'
  | 'golongan_a'
  | 'golongan_b'
  | 'golongan_ab'
  | 'golongan_o'
  | 'wilayah_custom';

export interface NewsItem {
  id: string;
  title: string;
  category: NewsCategory;
  status: NewsStatus;
  date: string;
  imageUrl?: string;
}

export interface BroadcastPayload {
  target: BroadcastTarget;
  alertTitle: string;
  message: string;
  isUrgent: boolean;
}

export interface BroadcastStats {
  totalReaders: string;
  sentAlerts: number;
  engagementRate: string;
}
