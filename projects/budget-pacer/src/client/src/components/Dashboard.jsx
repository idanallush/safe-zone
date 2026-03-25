import { useNavigate } from 'react-router-dom';
import { useAllClients } from '../hooks/usePacingData';
import StatusBadge, { StatusDot } from './StatusBadge';

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function Dashboard() {
  const { data, loading, error, refresh } = useAllClients();
  const navigate = useNavigate();

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-slate-500">Loading pacing data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-medium">Error: {error}</p>
        <button onClick={refresh} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Retry
        </button>
      </div>
    );
  }

  const { clients, summary, lastUpdated } = data;

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Budget" value={formatCurrency(summary.totalBudget)} />
        <SummaryCard label="Total Spend" value={formatCurrency(summary.totalSpend)} />
        <SummaryCard label="Total Projected" value={formatCurrency(summary.totalProjected)} />
        <SummaryCard
          label="Status"
          value={
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-emerald-600">
                <StatusDot status="green" /> {summary.clientsOnTrack}
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <StatusDot status="yellow" /> {summary.clientsWarning}
              </span>
              <span className="flex items-center gap-1 text-red-600">
                <StatusDot status="red" /> {summary.clientsCritical}
              </span>
            </div>
          }
        />
      </div>

      {/* Last updated + refresh */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
        </p>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Spend</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pacing</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Projected</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Days Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => navigate(`/client/${client.id}`)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{client.name}</span>
                      {client.alertCount > 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full font-medium">
                          {client.alertCount}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700 tabular-nums">
                    {formatCurrency(client.pacing.monthlyBudget, client.pacing.currency)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700 tabular-nums">
                    {formatCurrency(client.pacing.spendToDate, client.pacing.currency)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <PacingBar ratio={client.pacing.pacingRatio} />
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className={client.pacing.projectedOverUnder > 0 ? 'text-red-600' : 'text-emerald-600'}>
                      {formatCurrency(client.pacing.projectedSpend, client.pacing.currency)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={client.pacing.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                    {client.pacing.daysUntilBudgetOut !== null ? (
                      <span className="text-red-600 font-medium">{client.pacing.daysUntilBudgetOut}d</span>
                    ) : (
                      <span>{client.pacing.daysRemaining}d</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      {typeof value === 'string' ? (
        <p className="text-2xl font-bold text-slate-800 mt-1 tabular-nums">{value}</p>
      ) : (
        value
      )}
    </div>
  );
}

function PacingBar({ ratio }) {
  const percent = Math.min(ratio * 100, 200);
  const barColor =
    ratio > 1.3 ? 'bg-red-500' : ratio > 1.15 ? 'bg-amber-500' : ratio < 0.7 ? 'bg-red-500' : ratio < 0.85 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <span className="text-xs font-medium text-slate-600 tabular-nums w-10 text-right">{formatPercent(ratio)}</span>
    </div>
  );
}

function formatPercent(value) {
  return `${(value * 100).toFixed(0)}%`;
}

export default Dashboard;
