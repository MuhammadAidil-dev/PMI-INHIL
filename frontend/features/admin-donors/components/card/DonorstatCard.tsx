import { LucideIcon } from 'lucide-react';

type Variant = 'default' | 'danger';

type DonorStatCardProps = {
  label: string;
  value: string;
  subtitle: string;
  subtitleColor?: string;
  icon?: LucideIcon;
  variant?: Variant;
};

export function DonorStatCard({
  label,
  value,
  subtitle,
  subtitleColor = 'text-tertiary',
  icon: Icon,
  variant = 'default',
}: DonorStatCardProps) {
  if (variant === 'danger') {
    return (
      <div className="bg-primary rounded-xl p-6 flex flex-col gap-2 text-white">
        <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
          {label}
        </span>
        <span className="text-4xl font-bold tracking-tight">{value}</span>
        <span className="text-sm font-semibold flex items-center gap-1 opacity-90">
          {Icon && <Icon size={16} />}
          {subtitle}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">
        {label}
      </span>
      <span className="text-4xl font-bold text-neutral tracking-tight">
        {value}
      </span>
      <span
        className={`text-sm font-semibold flex items-center gap-1 ${subtitleColor}`}
      >
        {Icon && <Icon size={14} />}
        {subtitle}
      </span>
    </div>
  );
}
