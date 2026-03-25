import { useParams, useNavigate } from 'react-router-dom';
import { useClientDetail } from '../hooks/usePacingData';
import StatusBadge from './StatusBadge';
import { CumulativeChart, DailySpendChart } from './PacingChart';

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useClientDetail(id);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-medium">{error}</p>
        <button onClick={() => navigate('/')} className="mt-3 px-4 py-2 bg-slate-600 text-white rounded-lg">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { name, pacing, alerts, chart } = data;

  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{name}</h2>
            <p className="text-sm text-slate-500">
              Day {pacing.daysElapsed} of {pacing.daysTotal} &middot; {pacing.daysRemaining} days remaining
            </p>
          </div>
        </div>
        <StatusBadge status={pacing.status} size="lg" />
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Monthly Budget"
          value={formatCurrency(pacing.monthlyBudget, pacing.currency)}
        />
        <MetricCard
          label="Spend to Date"
          value={formatCurrency(pacing.spendToDate, pacing.currency)}
          sub={`${(pacing.budgetProgress * 100).toFixed(1)}% of budget`}
        />
        <MetricCard
          label="Daily Average"
          value={formatCurrency(pacing.dailyAverage, pacing.currency)}
          sub={`Target: ${formatCurrency(pacing.idealDailySpend, pacing.currency)}/day`}
        />
        <MetricCard
          label="Projected Spend"
          value={formatCurrency(pacing.projectedSpend, pacing.currency)}
          sub={
            pacing.projectedOverUnder >= 0
              ? `+${formatCurrency(pacing.projectedOverUnder, pacing.currency)} over`
              : `${formatCurrency(Math.abs(pacing.projectedOverUnder), pacing.currency)} under`
          }
          subColor={pacing.projectedOverUnder >= 0 ? 'text-red-500' : 'text-emerald-500'}
        />
      </div>

      {/* Pacing ratio visual */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">Pacing Ratio</h3>
          <span className="text-lg font-bold text-slate-800">{(pacing.pacingRatio * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden relative">
          {/* Target zone indicator */}
          <div className="absolute inset-0 flex">
            <div className="w-[70%] bg-slate-200" />
            <div className="w-[30%] bg-emerald-100" style={{ marginLeft: '-15%' }} />
          </div>
          <div
            className={`h-full rounded-full transition-all relative z-10 ${
              pacing.status === 'green' ? 'bg-emerald-500' : pacing.status === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(pacing.pacingRatio * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>0%</span>
          <span>Target: 100%</span>
          <span>{`>${(pacing.pacingRatio * 100).toFixed(0) > 100 ? (pacing.pacingRatio * 100).toFixed(0) : '100'}%`}</span>
        </div>
      </div>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">Active Alerts</h3>
          {alerts.map((alert, i) => (
            <AlertCard key={i} alert={alert} />
          ))}
        </div>
      )}

      {/* Charts */}
      {chart && (
        <>
          <CumulativeChart
            chartData={chart.chartData}
            budget={chart.budget}
            currency={chart.currency}
            projectedSpend={pacing.projectedSpend}
          />
          <DailySpendChart
            chartData={chart.chartData}
            currency={chart.currency}
            idealDailySpend={pacing.idealDailySpend}
          />
        </>
      )}

      {/* Last 7 days table */}
      {data.dailySpend && data.dailySpend.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Last 7 Days</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="text-right px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Spend</th>
                  <th className="text-right px-3 py-2 text-xs font-semibold text-slate-500 uppercase">vs Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.dailySpend.slice(-7).reverse().map((day) => {
                  const diff = day.spend - pacing.idealDailySpend;
                  return (
                    <tr key={day.date}>
                      <td className="px-3 py-2 text-sm text-slate-700">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-3 py-2 text-sm text-right tabular-nums text-slate-700">
                        {formatCurrency(day.spend, pacing.currency)}
                      </td>
                      <td className={`px-3 py-2 text-sm text-right tabular-nums ${diff > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {diff >= 0 ? '+' : ''}{formatCurrency(diff, pacing.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, sub, subColor = 'text-slate-500' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-xl font-bold text-slate-800 mt-1 tabular-nums">{value}</p>
      {sub && <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>}
    </div>
  );
}

function AlertCard({ alert }) {
  const severityStyles = {
    critical: 'border-red-200 bg-red-50',
    warning: 'border-amber-200 bg-amber-50',
    info: 'border-blue-200 bg-blue-50',
  };

  const iconColors = {
    critical: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
  };

  return (
    <div className={`rounded-lg border p-4 ${severityStyles[alert.severity] || severityStyles.info}`}>
      <div className="flex items-start gap-3">
        <svg className={`w-5 h-5 mt-0.5 ${iconColors[alert.severity]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <p className="font-medium text-slate-800">{alert.message}</p>
          <p className="text-sm text-slate-600 mt-0.5">{alert.detail}</p>
          {alert.recommendation && (
            <p className="text-sm text-slate-500 mt-1 italic">{alert.recommendation}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientDetail;
