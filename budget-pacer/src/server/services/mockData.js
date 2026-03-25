/**
 * Generate mock daily spend data for development/demo
 * Used when META_ACCESS_TOKEN is not set
 */
function generateMockDailySpend(monthlyBudget, daysElapsed) {
  const dailyTarget = monthlyBudget / 30;
  const days = [];

  for (let i = 0; i < daysElapsed; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (daysElapsed - 1 - i));

    // Randomize spend around the daily target with some variance
    const variance = 0.6 + Math.random() * 0.8; // 60% to 140% of target
    const spend = Math.round(dailyTarget * variance * 100) / 100;

    days.push({
      date: date.toISOString().split('T')[0],
      spend,
      impressions: Math.round(spend * 100 + Math.random() * 500),
      clicks: Math.round(spend * 2 + Math.random() * 20),
    });
  }

  return days;
}

/**
 * Generate mock data for all clients with different spending patterns
 */
function generateAllClientsMockData(clients) {
  const now = new Date();
  const dayOfMonth = now.getDate();

  // Different spending patterns per client index
  const patterns = [
    { name: 'overspending', multiplier: 1.25 },
    { name: 'on_track', multiplier: 1.0 },
    { name: 'underspending', multiplier: 0.65 },
    { name: 'slightly_over', multiplier: 1.12 },
    { name: 'accelerating', multiplier: 0.9 }, // starts low, ends high
  ];

  return clients.map((client, index) => {
    const pattern = patterns[index % patterns.length];
    const dailyTarget = client.monthlyBudget / 30;
    const days = [];

    for (let i = 0; i < dayOfMonth; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), i + 1);
      let variance;

      if (pattern.name === 'accelerating') {
        // Start at 70% of target, end at 130%
        const progress = i / dayOfMonth;
        variance = 0.7 + progress * 0.6 + (Math.random() * 0.2 - 0.1);
      } else {
        variance = pattern.multiplier + (Math.random() * 0.3 - 0.15);
      }

      const spend = Math.round(dailyTarget * Math.max(0.1, variance) * 100) / 100;

      days.push({
        date: date.toISOString().split('T')[0],
        spend,
        impressions: Math.round(spend * 100 + Math.random() * 500),
        clicks: Math.round(spend * 2 + Math.random() * 20),
      });
    }

    return {
      clientId: client.id,
      dailySpend: days,
      error: null,
    };
  });
}

module.exports = { generateMockDailySpend, generateAllClientsMockData };
