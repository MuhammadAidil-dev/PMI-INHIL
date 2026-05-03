import { MessageCircle, Eye } from 'lucide-react';
import { DonorStatusBadge } from './DonorStatusBadge';

export type DonorStatus = 'eligible' | 'resting' | 'inactive';

export type Donor = {
  id: string;
  name: string;
  donorId: string;
  bloodType: string;
  lastDonation: string;
  location: string;
  status: DonorStatus;
};

type DonorTableRowProps = {
  donor: Donor;
  onChat?: (donor: Donor) => void;
  onView?: (donor: Donor) => void;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function DonorTableRow({ donor, onChat, onView }: DonorTableRowProps) {
  return (
    <tr className="hover:bg-secondary transition-colors">
      {/* Donor Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center font-bold text-primary text-sm shrink-0">
            {getInitials(donor.name)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-neutral">
              {donor.name}
            </span>
            <span className="text-xs text-tertiary">ID: {donor.donorId}</span>
          </div>
        </div>
      </td>

      {/* Blood Type */}
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-xs">
          {donor.bloodType}
        </span>
      </td>

      {/* Last Donation */}
      <td className="px-6 py-4 text-sm text-neutral">{donor.lastDonation}</td>

      {/* Location */}
      <td className="px-6 py-4 text-sm text-tertiary">{donor.location}</td>

      {/* Status */}
      <td className="px-6 py-4">
        <DonorStatusBadge status={donor.status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onChat?.(donor)}
            title="Kirim Pesan WhatsApp"
            className="p-2 text-tertiary hover:text-primary hover:bg-red-50 rounded-lg transition-colors"
          >
            <MessageCircle size={18} />
          </button>
          <button
            onClick={() => onView?.(donor)}
            title="Lihat Riwayat"
            className="p-2 text-tertiary hover:text-primary hover:bg-red-50 rounded-lg transition-colors"
          >
            <Eye size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
