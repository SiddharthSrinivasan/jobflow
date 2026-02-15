type Analytics = {
  APPLIED: number;
  INTERVIEW: number;
  OFFER: number;
  REJECTED: number;
};

export default function AnalyticsCard({ data }: { data: Analytics }) {
  const total =
    data.APPLIED + data.INTERVIEW + data.OFFER + data.REJECTED;

  return (
    <div className="bg-slate-900 p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold">Analytics</div>
        <div className="text-slate-400 text-sm">Total: {total}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Applied" value={data.APPLIED} />
        <Stat label="Interview" value={data.INTERVIEW} />
        <Stat label="Offer" value={data.OFFER} />
        <Stat label="Rejected" value={data.REJECTED} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-800 rounded-xl p-3">
      <div className="text-slate-400 text-sm">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}