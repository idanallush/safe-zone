const express = require('express');
const router = express.Router();
const MetaAdsService = require('../services/metaAds');
const { calculatePacing } = require('../services/pacingEngine');
const { checkAlerts } = require('../services/alertEngine');
const { generateAllClientsMockData } = require('../services/mockData');
const clients = require('../config/clients.json');

const USE_MOCK = !process.env.META_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN === 'your_meta_access_token_here';
const metaAds = USE_MOCK ? null : new MetaAdsService(process.env.META_ACCESS_TOKEN);

if (USE_MOCK) {
  console.log('⚠️  No META_ACCESS_TOKEN found — running with mock data');
}

// In-memory cache for API responses
let cache = {
  data: null,
  timestamp: null,
  ttl: 15 * 60 * 1000, // 15 minutes
};

async function getClientsPacingData(forceRefresh = false) {
  // Return cached data if fresh
  if (!forceRefresh && cache.data && Date.now() - cache.timestamp < cache.ttl) {
    return cache.data;
  }

  const spendResults = USE_MOCK
    ? generateAllClientsMockData(clients.clients)
    : await metaAds.getAllClientsSpend(clients.clients);

  const pacingData = clients.clients.map((client) => {
    const spendResult = spendResults.find((r) => r.clientId === client.id);
    const dailySpend = spendResult?.dailySpend || [];
    const pacing = calculatePacing(dailySpend, client);
    const alerts = checkAlerts(pacing, client);

    return {
      id: client.id,
      name: client.name,
      pacing,
      alerts,
      dailySpend,
      error: spendResult?.error || null,
    };
  });

  cache.data = pacingData;
  cache.timestamp = Date.now();

  return pacingData;
}

// GET /api/clients - All clients with pacing data
router.get('/clients', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const pacingData = await getClientsPacingData(forceRefresh);

    // Summary totals
    const summary = {
      totalBudget: pacingData.reduce((sum, c) => sum + c.pacing.monthlyBudget, 0),
      totalSpend: pacingData.reduce((sum, c) => sum + c.pacing.spendToDate, 0),
      totalProjected: pacingData.reduce((sum, c) => sum + c.pacing.projectedSpend, 0),
      clientsOnTrack: pacingData.filter((c) => c.pacing.status === 'green').length,
      clientsWarning: pacingData.filter((c) => c.pacing.status === 'yellow').length,
      clientsCritical: pacingData.filter((c) => c.pacing.status === 'red').length,
      totalClients: pacingData.length,
    };

    res.json({
      clients: pacingData.map((c) => ({
        id: c.id,
        name: c.name,
        pacing: c.pacing,
        alertCount: c.alerts.length,
        hasCriticalAlert: c.alerts.some((a) => a.severity === 'critical'),
        error: c.error,
      })),
      summary,
      lastUpdated: cache.timestamp ? new Date(cache.timestamp).toISOString() : null,
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch pacing data' });
  }
});

// GET /api/clients/:id - Single client detail
router.get('/clients/:id', async (req, res) => {
  try {
    const pacingData = await getClientsPacingData();
    const client = pacingData.find((c) => c.id === req.params.id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      id: client.id,
      name: client.name,
      pacing: client.pacing,
      alerts: client.alerts,
      dailySpend: client.dailySpend,
      error: client.error,
      lastUpdated: cache.timestamp ? new Date(cache.timestamp).toISOString() : null,
    });
  } catch (error) {
    console.error(`Error fetching client ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch client data' });
  }
});

// GET /api/clients/:id/daily - Daily spend array for charts
router.get('/clients/:id/daily', async (req, res) => {
  try {
    const pacingData = await getClientsPacingData();
    const client = pacingData.find((c) => c.id === req.params.id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Build cumulative spend data for charting
    let cumulative = 0;
    const idealDaily = client.pacing.monthlyBudget / client.pacing.daysTotal;
    const chartData = client.dailySpend.map((day, index) => {
      cumulative += day.spend;
      return {
        date: day.date,
        dailySpend: day.spend,
        cumulativeSpend: Math.round(cumulative * 100) / 100,
        idealCumulative: Math.round(idealDaily * (index + 1) * 100) / 100,
      };
    });

    res.json({
      clientId: client.id,
      clientName: client.name,
      currency: client.pacing.currency,
      budget: client.pacing.monthlyBudget,
      chartData,
    });
  } catch (error) {
    console.error(`Error fetching daily data for ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch daily data' });
  }
});

module.exports = router;
