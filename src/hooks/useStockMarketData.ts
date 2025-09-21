import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  isMarketOpen: boolean;
}

interface StockMarketResponse {
  success: boolean;
  stocks: StockData[];
  lastUpdated: string;
  isMarketOpen: boolean;
  error?: string;
}

export const useStockMarketData = () => {
  const [data, setData] = useState<StockMarketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStockData = useCallback(async () => {
    try {
      setError(null);
      
      const { data: response, error: supabaseError } = await supabase.functions.invoke('stock-market-data');
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      setData(response);
    } catch (err) {
      console.error('Error fetching stock market data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchStockData();

    // Set up interval for hourly updates during market hours
    // or every 4 hours when market is closed
    const updateInterval = 60 * 60 * 1000; // 1 hour in milliseconds
    
    const interval = setInterval(() => {
      fetchStockData();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [fetchStockData]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchStockData();
  }, [fetchStockData]);

  return {
    data,
    loading,
    error,
    refresh,
    stocks: data?.stocks || [],
    lastUpdated: data?.lastUpdated,
    isMarketOpen: data?.isMarketOpen || false
  };
};