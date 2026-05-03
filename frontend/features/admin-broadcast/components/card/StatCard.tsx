import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBgClassName: string;
  iconColorClassName: string;
}

export default function StatsCard({
  label,
  value,
  icon: Icon,
  iconBgClassName,
  iconColorClassName,
}: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBgClassName}`}
      >
        <Icon size={22} className={iconColorClassName} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
