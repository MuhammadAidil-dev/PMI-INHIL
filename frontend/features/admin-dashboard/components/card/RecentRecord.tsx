export type DonorRecord = {
  id: string;
  name: string;
  bloodType: string;
  total: number;
};

type RecentRecordsProps = {
  records: DonorRecord[];
};

export default function RecentRecords({ records }: RecentRecordsProps) {
  return (
    <div className="lg:col-span-8 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <div className="px-6 py-5">
        <h3 className="font-semibold text-gray-900">Recent Records</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-50">
              <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Donor
              </th>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                Type
              </th>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
                Total Donasi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {records.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-800">
                  {record.name}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    {record.bloodType}
                  </span>
                </td>
                <td className="px-6 py-4 text-center ">
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    {record.total}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
