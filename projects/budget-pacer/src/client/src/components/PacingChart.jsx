import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';

function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function CumulativeChart({ chartData, budget, currency, projectedSpend }) {
  if (!chartData || chartData.length === 0) return null;

  // Add projection line data points
  const lastPoint = chartData[chartData.length - 1];
  const daysInMonth = Math.round(budget / (chartData[0]?.idealCumulative || 1));

  const projectionData = chartData.map((d, i) => ({
    ...d,
    projectedCumulative: i === chartData.length - 1 ? d.cumulativeSpend : undefined,
    dateFormatted: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  // Add end-of-month projection point
  if (lastPoint) {
    const dailyAvg = lastPoint.cumulativeSpend / chartData.length;
    const endOfMonthDate = new Date(lastPoint.date);
    endOfMonthDate.setDate(endOfMonthDate.getDate() + (daysInMonth - chartData.length));

    projectionData.push({
      date: endOfMonthDate.toISOString().split('T')[0],
      dateFormatted: endOfMonthDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      cumulativeSpend: undefined,
      idealCumulative: budget,
      projectedCumulative: projectedSpend,
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Cumulative Spend vs Budget Pace</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="dateFormatted" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis
            tick={{ fontSize: 11 }}
            stroke="#94a3b8"
            tickFormatter={(v) => formatCurrency(v, currency)}
          />
          <Tooltip
            formatter={(value, name) => [formatCurrency(value, currency), name]}
            labelStyle={{ color: '#475569' }}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
          <Legend />
          <ReferenceLine y={budget} stroke="#1B4F72" strokeDasharray="8 4" label={{ value: 'Budget', position: 'right', fontSize: 11 }} />
          <Area
            type="monotone"
            dataKey="idealCumulative"
            name="Ideal Pace"
            stroke="#94a3b8"
            strokeDasharray="5 5"
            fill="none"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="cumulativeSpend"
            name="Actual Spend"
            stroke="#1B4F72"
            fill="#1B4F72"
            fillOpacity={0.1}
            strokeWidth={2}
            connectNulls={false}
          />
          <Area
            type="monotone"
            dataKey="projectedCumulative"
            name="Projected"
            stroke="#F39C12"
            strokeDasharray="5 5"
            fill="none"
            strokeWidth={2}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function DailySpendChart({ chartData, currency, idealDailySpend }) {
  if (!chartData || chartData.length === 0) return null;

  const data = chartData.map((d) => ({
    ...d,
    dateFormatted: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Daily Spend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="dateFormatted" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis
            tick={{ fontSize: 11 }}
            stroke="#94a3b8"
            tickFormatter={(v) => formatCurrency(v, currency)}
          />
          <Tooltip
            formatter={(value, name) => [formatCurrency(value, currency), name]}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
          {idealDailySpend && (
            <ReferenceLine
              y={idealDailySpend}
              stroke="#27AE60"
              strokeDasharray="5 5"
              label={{ value: 'Target', position: 'right', fontSize: 11 }}
            />
          )}
          <Bar dataKey="dailySpend" name="Daily Spend" fill="#1B4F72" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export { CumulativeChart, DailySpendChart };
