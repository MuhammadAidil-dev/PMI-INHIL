import { MapPin } from 'lucide-react';

export function DonorLocationCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Map Placeholder */}
      <div className="h-32 w-full bg-linear-to-br from-blue-50 to-slate-100 relative flex items-center justify-center">
        {/* Simple static map-like pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(100,116,139,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,116,139,0.3) 1px, transparent 1px)
            `,
              backgroundSize: '24px 24px',
            }}
          />
        </div>
        {/* Road-like lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-300 opacity-60" />
          <div className="absolute top-0 bottom-0 left-1/3 w-px bg-slate-300 opacity-60" />
          <div className="absolute top-0 bottom-0 left-2/3 w-px bg-slate-300 opacity-40" />
          <div className="absolute top-1/4 left-0 right-0 h-px bg-slate-300 opacity-40" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-slate-300 opacity-40" />
        </div>

        <span className="relative z-10 bg-white/90 px-3 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm flex items-center gap-1.5 border border-red-100">
          <MapPin size={12} fill="currentColor" fillOpacity={0.2} />
          Pusat Regional
        </span>
      </div>

      <div className="p-4 text-center">
        <p className="text-xs text-tertiary">
          Lokasi pendaftaran:{' '}
          <span className="font-semibold text-neutral">
            PMI Kabupaten Indragiri Hilir
          </span>
        </p>
      </div>
    </div>
  );
}
