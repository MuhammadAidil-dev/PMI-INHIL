import { BloodStatus } from '../../types/admin-inventory.type';
import { STATUS_STYLE } from '../../constants/admin-inventory.constant';

interface StatusBadgeProps {
  status: BloodStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${STATUS_STYLE[status]}`}
    >
      {status}
    </span>
  );
}
