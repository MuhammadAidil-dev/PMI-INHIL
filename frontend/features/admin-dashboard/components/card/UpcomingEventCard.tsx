import Link from 'next/link';

export type DonationEvent = {
  id: string;
  month: string | number;
  day: number;
  title: string;
  time: string;
};

type UpcomingEventsProps = {
  events: DonationEvent[];
};

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <div className="lg:col-span-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <div className="px-6 py-5">
        <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
      </div>

      <div className="px-6 space-y-6 grow">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-4 border-b border-foreground pb-2"
          >
            <div className="text-center min-w-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                {event.month}
              </p>
              <p className="text-lg font-bold text-rose-600 leading-none">
                {event.day}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">
                {event.title}
              </h4>
              <p className="text-xs text-gray-400">{event.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6">
        <Link href="/schedule">
          <button className="w-full py-2.5 text-xs font-bold text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            View Calendar
          </button>
        </Link>
      </div>
    </div>
  );
}
