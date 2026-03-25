const axios = require('axios');

const META_API_VERSION = 'v21.0';
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

class MetaAdsService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.client = axios.create({
      baseURL: META_BASE_URL,
      params: { access_token: accessToken },
    });
  }

  /**
   * Fetch daily spend for an ad account from the 1st of current month to today
   */
  async getDailySpend(adAccountId, startDate, endDate) {
    try {
      const response = await this.client.get(`/${adAccountId}/insights`, {
        params: {
          fields: 'spend,date_start,date_stop,impressions,clicks,actions',
          time_range: JSON.stringify({
            since: startDate,
            until: endDate,
          }),
          time_increment: 1, // daily breakdown
          level: 'account',
        },
      });

      const data = response.data.data || [];
      return data.map((day) => ({
        date: day.date_start,
        spend: parseFloat(day.spend || 0),
        impressions: parseInt(day.impressions || 0, 10),
        clicks: parseInt(day.clicks || 0, 10),
      }));
    } catch (error) {
      if (error.response) {
        const fbError = error.response.data?.error;
        if (fbError?.code === 17) {
          throw new Error(`Rate limit reached for ${adAccountId}. Try again later.`);
        }
        if (fbError?.code === 190) {
          throw new Error('Meta access token expired or invalid. Please refresh the token.');
        }
        throw new Error(`Meta API error for ${adAccountId}: ${fbError?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get current month date range
   */
  static getCurrentMonthRange(billingCycleStart = 1) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    let startDate;
    if (now.getDate() >= billingCycleStart) {
      startDate = new Date(year, month, billingCycleStart);
    } else {
      startDate = new Date(year, month - 1, billingCycleStart);
    }

    const endDate = now;

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      daysTotal: getDaysInBillingCycle(startDate),
      daysElapsed: Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1,
    };
  }

  /**
   * Fetch spend data for all clients
   */
  async getAllClientsSpend(clients) {
    const results = [];

    for (const client of clients) {
      try {
        const { startDate, endDate } = MetaAdsService.getCurrentMonthRange(
          client.billingCycleStart
        );

        const dailySpend = await this.getDailySpend(
          client.metaAdAccountId,
          startDate,
          endDate
        );

        results.push({
          clientId: client.id,
          dailySpend,
          error: null,
        });
      } catch (error) {
        results.push({
          clientId: client.id,
          dailySpend: [],
          error: error.message,
        });
      }
    }

    return results;
  }
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getDaysInBillingCycle(startDate) {
  const nextMonth = new Date(startDate);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  return Math.floor((nextMonth - startDate) / (1000 * 60 * 60 * 24));
}

module.exports = MetaAdsService;
