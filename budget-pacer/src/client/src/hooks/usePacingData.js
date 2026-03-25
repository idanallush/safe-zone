import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = '/api';
const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export function useAllClients() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      const url = forceRefresh
        ? `${API_BASE}/clients?refresh=true`
        : `${API_BASE}/clients`;
      const response = await axios.get(url);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refresh: () => fetchData(true) };
}

export function useClientDetail(clientId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      const [detail, daily] = await Promise.all([
        axios.get(`${API_BASE}/clients/${clientId}`),
        axios.get(`${API_BASE}/clients/${clientId}/daily`),
      ]);
      setData({ ...detail.data, chart: daily.data });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch client data');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}
