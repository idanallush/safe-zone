const MetaAdsService = require('./metaAds');

/**
 * Calculate pacing metrics for a client given their daily spend data and config
 */
function calculatePacing(dailySpend, clientConfig) {
  const { startDate, endDate, daysTotal, daysElapsed } =
    MetaAdsService.getCurrentMonthRange(clientConfig.billingCycleStart);

  const spendToDate = dailySpend.reduce((sum, day) => sum + day.spend, 0);
  const { monthlyBudget } = clientConfig;

  const timeProgress = daysElapsed / daysTotal;
  const budgetProgress = spendToDate / monthlyBudget;
  const dailyAverage = daysElapsed > 0 ? spendToDate / daysElapsed : 0;
  const projectedSpend = dailyAverage * daysTotal;
  const projectedOverUnder = projectedSpend - monthlyBudget;
  const pacingRatio = timeProgress > 0 ? budgetProgress / timeProgress : 0;

  // Status based on pacing ratio
  const status = getStatus(pacingRatio, clientConfig.alertThresholds);

  // Days until budget runs out (only relevant if overpacing)
  const remainingBudget = monthlyBudget - spendToDate;
  const daysUntilBudgetOut =
    dailyAverage > 0 && remainingBudget > 0
      ? Math.floor(remainingBudget / dailyAverage)
      : null;

  // Trend detection: last 3 days vs month average
  const trend = detectTrend(dailySpend, dailyAverage);

  return {
    daysElapsed,
    daysTotal,
    daysRemaining: daysTotal - daysElapsed,
    timeProgress: round(timeProgress, 4),
    spendToDate: round(spendToDate, 2),
    monthlyBudget,
    budgetProgress: round(budgetProgress, 4),
    dailyAverage: round(dailyAverage, 2),
    projectedSpend: round(projectedSpend, 2),
    projectedOverUnder: round(projectedOverUnder, 2),
    pacingRatio: round(pacingRatio, 4),
    status,
    daysUntilBudgetOut,
    trend,
    idealDailySpend: round(monthlyBudget / daysTotal, 2),
    remainingBudget: round(remainingBudget, 2),
    requiredDailySpend:
      daysTotal - daysElapsed > 0
        ? round(remainingBudget / (daysTotal - daysElapsed), 2)
        : 0,
    startDate,
    endDate,
    currency: clientConfig.currency,
  };
}

function getStatus(pacingRatio, thresholds) {
  const over = thresholds?.overspend || 1.15;
  const under = thresholds?.underspend || 0.7;

  if (pacingRatio >= over * 1.13) return 'red'; // way overspending
  if (pacingRatio <= under) return 'red'; // way underspending
  if (pacingRatio >= over) return 'yellow'; // slightly overspending
  if (pacingRatio <= 0.85) return 'yellow'; // slightly underspending
  return 'green'; // on track
}

function detectTrend(dailySpend, monthlyAverage) {
  if (dailySpend.length < 3) return { direction: 'stable', magnitude: 0 };

  const lastThree = dailySpend.slice(-3);
  const recentAverage = lastThree.reduce((sum, d) => sum + d.spend, 0) / 3;

  if (monthlyAverage === 0) return { direction: 'stable', magnitude: 0 };

  const ratio = recentAverage / monthlyAverage;

  if (ratio > 1.2) return { direction: 'accelerating', magnitude: round(ratio, 2) };
  if (ratio < 0.8) return { direction: 'decelerating', magnitude: round(ratio, 2) };
  return { direction: 'stable', magnitude: round(ratio, 2) };
}

function round(value, decimals) {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

module.exports = { calculatePacing };
