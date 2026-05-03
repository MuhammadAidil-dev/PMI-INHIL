import { TrendingUp, AlertCircle, Clock, type LucideIcon } from 'lucide-react';

type BadgeType = 'success' | 'danger' | 'neutral';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  badge?: {
    type: BadgeType;
    icon: LucideIcon;
    label: string;
  };
};

const badgeStyles: Record<BadgeType, string> = {
  success: 'text-emerald-500',
  danger: 'text-rose-500',
  neutral: 'text-gray-500',
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  badge,
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
          {badge && (
            <p
              className={`text-xs font-medium mt-2 flex items-center gap-1 ${badgeStyles[badge.type]}`}
            >
              <badge.icon size={14} />
              {badge.label}
            </p>
          )}
        </div>
        <Icon size={32} className="text-gray-200" />
      </div>
    </div>
  );
}

// Re-export common badge icons for convenience
export { TrendingUp, AlertCircle, Clock };
