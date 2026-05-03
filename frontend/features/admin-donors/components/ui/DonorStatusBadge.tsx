type StatusType = 'eligible' | 'resting' | 'inactive';

type DonorStatusBadgeProps = {
  status: StatusType;
};

const STATUS_CONFIG: Record<
  StatusType,
  { label: string; dotColor: string; textColor: string }
> = {
  eligible: {
    label: 'Eligible',
    dotColor: 'bg-green-500',
    textColor: 'text-green-600',
  },
  resting: {
    label: 'Masa Istirahat',
    dotColor: 'bg-orange-400',
    textColor: 'text-orange-500',
  },
  inactive: {
    label: 'Tidak Aktif',
    dotColor: 'bg-gray-400',
    textColor: 'text-gray-500',
  },
};

export function DonorStatusBadge({ status }: DonorStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-semibold ${config.textColor}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
