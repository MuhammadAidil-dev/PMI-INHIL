import { FlaskConical, Thermometer, ArrowDownUp } from 'lucide-react';

const GUIDANCE_ITEMS = [
  {
    icon: FlaskConical,
    iconBg: 'bg-blue-50 text-blue-600',
    title: 'Validasi Lab',
    description:
      'Pastikan sampel telah melalui uji saring IMLTD sebelum masuk ke stok utama.',
  },
  {
    icon: Thermometer,
    iconBg: 'bg-emerald-50 text-emerald-600',
    title: 'Cold Chain Management',
    description: 'Pertahankan suhu PRC pada rentang optimal 2°C hingga 6°C.',
  },
  {
    icon: ArrowDownUp,
    iconBg: 'bg-rose-50 text-rose-600',
    title: 'Prioritas Stok',
    description:
      'Gunakan prinsip FIFO (First In First Out) untuk meminimalkan risiko kedaluwarsa.',
  },
] as const;

export function GuidanceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {GUIDANCE_ITEMS.map(({ icon: Icon, iconBg, title, description }) => (
        <div
          key={title}
          className="bg-white border border-gray-100 p-5 rounded-xl flex gap-4 shadow-sm"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
          >
            <Icon size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
