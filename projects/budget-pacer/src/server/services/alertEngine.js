/**
 * Check pacing data against thresholds and generate alerts
 */
function checkAlerts(pacingData, clientConfig) {
  const alerts = [];
  const { pacingRatio, projectedSpend, monthlyBudget, daysUntilBudgetOut, trend, dailyAverage, requiredDailySpend, daysRemaining } = pacingData;
  const { overspend = 1.15, underspend = 0.70 } = clientConfig.alertThresholds || {};

  // Overspend alert
  if (pacingRatio > overspend) {
    const projectedOver = projectedSpend - monthlyBudget;
    alerts.push({
      severity: pacingRatio > overspend * 1.13 ? 'critical' : 'warning',
      type: 'overspend',
      message: `Pacing ${Math.round((pacingRatio - 1) * 100)}% above target`,
      detail: `Projected to overspend by ${formatCurrency(projectedOver, pacingData.currency)}`,
      recommendation: daysUntilBudgetOut
        ? `Budget will run out in ${daysUntilBudgetOut} days. Reduce daily spend to ${formatCurrency(requiredDailySpend, pacingData.currency)}/day.`
        : `Reduce daily spend from ${formatCurrency(dailyAverage, pacingData.currency)} to ${formatCurrency(requiredDailySpend, pacingData.currency)}/day.`,
    });
  }

  // Underspend alert
  if (pacingRatio < underspend) {
    const projectedUnder = monthlyBudget - projectedSpend;
    alerts.push({
      severity: pacingRatio < underspend * 0.7 ? 'critical' : 'warning',
      type: 'underspend',
      message: `Pacing ${Math.round((1 - pacingRatio) * 100)}% below target`,
      detail: `Projected to underspend by ${formatCurrency(projectedUnder, pacingData.currency)}`,
      recommendation: `Increase daily spend to ${formatCurrency(requiredDailySpend, pacingData.currency)}/day to hit budget target.`,
    });
  }

  // Trend alert
  if (trend.direction === 'accelerating' && trend.magnitude > 1.3) {
    alerts.push({
      severity: 'info',
      type: 'trend',
      message: 'Spend acceleration detected',
      detail: `Last 3 days average is ${Math.round((trend.magnitude - 1) * 100)}% higher than the monthly average`,
      recommendation: 'Monitor closely. Recent spend spike may lead to overspend.',
    });
  }

  if (trend.direction === 'decelerating' && trend.magnitude < 0.7) {
    alerts.push({
      severity: 'info',
      type: 'trend',
      message: 'Spend deceleration detected',
      detail: `Last 3 days average is ${Math.round((1 - trend.magnitude) * 100)}% lower than the monthly average`,
      recommendation: 'Check if campaigns are still active. May underdeliver.',
    });
  }

  // Budget exhaustion alert
  if (daysUntilBudgetOut !== null && daysUntilBudgetOut <= 7 && daysRemaining > daysUntilBudgetOut) {
    alerts.push({
      severity: 'critical',
      type: 'budget_exhaustion',
      message: `Budget will run out in ${daysUntilBudgetOut} days`,
      detail: `${daysRemaining} days remaining in billing cycle but budget lasts only ${daysUntilBudgetOut} more days`,
      recommendation: 'Reduce spend immediately or increase budget.',
    });
  }

  return alerts;
}

function formatCurrency(amount, currency = 'USD') {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

module.exports = { checkAlerts };
