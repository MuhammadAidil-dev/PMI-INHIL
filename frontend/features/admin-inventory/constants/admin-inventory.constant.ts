import {
  BloodStatus,
  BloodStock,
  StockDistribution,
} from '../types/admin-inventory.type';

export const STATUS_OPTIONS: BloodStatus[] = ['Critical', 'Low', 'Stable'];

export const COMPONENT_OPTIONS = [
  'Whole Blood',
  'PRC',
  'FFP',
  'Platelets',
  'Cryoprecipitate',
] as const;

export const STATUS_STYLE: Record<BloodStatus, string> = {
  Critical: 'bg-rose-50 text-rose-600',
  Low: 'bg-amber-50 text-amber-700',
  Stable: 'bg-emerald-50 text-emerald-700',
};

export const STOCK_DISTRIBUTION: StockDistribution[] = [
  { label: 'Whole Blood', percentage: 42, colorClass: 'bg-rose-500' },
  { label: 'Packed Red Cells', percentage: 28, colorClass: 'bg-rose-400' },
  { label: 'Fresh Frozen Plasma', percentage: 30, colorClass: 'bg-rose-300' },
];

// Dummy data — ganti dengan fetch dari API
export const DUMMY_BLOOD_STOCKS: BloodStock[] = [
  {
    id: '1',
    bloodType: 'O-',
    label: 'Type O Negative',
    component: 'PRC (Packed Red Cells)',
    units: 14,
    limit: 50,
    status: 'Critical',
  },
  {
    id: '2',
    bloodType: 'A+',
    label: 'Type A Positive',
    component: 'Whole Blood',
    units: 42,
    limit: 80,
    status: 'Low',
  },
  {
    id: '3',
    bloodType: 'B+',
    label: 'Type B Positive',
    component: 'FFP (Fresh Frozen Plasma)',
    units: 128,
    limit: 150,
    status: 'Stable',
  },
  {
    id: '4',
    bloodType: 'AB-',
    label: 'Type AB Negative',
    component: 'Cryoprecipitate',
    units: 8,
    limit: 30,
    status: 'Critical',
  },
  {
    id: '5',
    bloodType: 'O+',
    label: 'Type O Positive',
    component: 'Whole Blood',
    units: 215,
    limit: 300,
    status: 'Stable',
  },
];
