import { NewsStatus } from '../../types/admin-berita-broadcast.type';

interface StatusBadgeProps {
  status: NewsStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    published: {
      label: 'Published',
      className: 'bg-green-100 text-green-700',
    },
    draft: {
      label: 'Draft',
      className: 'bg-gray-100 text-gray-600',
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${className}`}
    >
      {label}
    </span>
  );
}
