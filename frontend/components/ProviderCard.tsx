import { Provider } from "@/services/api";

type Props = {
  provider: Provider;
};

export default function ProviderCard({ provider }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-zinc-900">{provider.name}</h3>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Stat label="Monthly Quota" value={provider.monthly_quota} />
        <Stat label="Used Quota" value={provider.used_quota} />
        <Stat label="Remaining" value={provider.remaining_quota} />
        <Stat label="Leads Received" value={provider.leads_received} />
      </div>

      <div className="mt-4">
        <h4 className="mb-2 text-sm font-medium text-zinc-700">Assigned Leads</h4>
        {provider.assigned_leads.length === 0 ? (
          <p className="text-sm text-zinc-500">No leads assigned yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-600">
                  <th className="px-2 py-2">Lead ID</th>
                  <th className="px-2 py-2">Customer</th>
                  <th className="px-2 py-2">Phone</th>
                  <th className="px-2 py-2">Service</th>
                </tr>
              </thead>
              <tbody>
                {provider.assigned_leads.map((lead) => (
                  <tr key={lead.lead_id} className="border-b border-zinc-100">
                    <td className="px-2 py-2">{lead.lead_id}</td>
                    <td className="px-2 py-2">{lead.customer}</td>
                    <td className="px-2 py-2">{lead.phone}</td>
                    <td className="px-2 py-2">{lead.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-zinc-50 px-3 py-2">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
