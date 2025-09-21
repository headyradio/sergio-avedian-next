import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  isMarketOpen: boolean;
}

const STOCK_SYMBOLS = [
  { symbol: '^DJI', name: 'DOW JONES' },
  { symbol: '^IXIC', name: 'NASDAQ' },
  { symbol: '^GSPC', name: 'S&P 500' },
  { symbol: 'AAPL', name: 'APPLE' },
  { symbol: 'TSLA', name: 'TESLA' },
  { symbol: 'NVDA', name: 'NVIDIA' }
];

function isMarketOpen(): boolean {
  const now = new Date();
  const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  const day = easternTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = easternTime.getHours();
  const minute = easternTime.getMinutes();
  const timeInMinutes = hour * 60 + minute;
  
  // Market is closed on weekends
  if (day === 0 || day === 6) return false;
  
  // Market hours: 9:30 AM - 4:00 PM ET (570 minutes - 960 minutes)
  return timeInMinutes >= 570 && timeInMinutes < 960;
}

async function fetchStockData(symbol: string, name: string): Promise<StockData | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch data for ${symbol}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    const result = data.chart?.result?.[0];
    
    if (!result) {
      console.error(`No data found for ${symbol}`);
      return null;
    }
    
    const meta = result.meta;
    const currentPrice = meta.regularMarketPrice || meta.previousClose;
    const previousClose = meta.previousClose;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    return {
      symbol: symbol.replace('^', ''),
      name,
      price: Math.round(currentPrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      lastUpdated: new Date().toISOString(),
      isMarketOpen: isMarketOpen()
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
}

serve(async (req) => {
  console.log('Stock Market Data function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching stock market data...');
    
    // Fetch all stock data in parallel
    const stockPromises = STOCK_SYMBOLS.map(({ symbol, name }) => 
      fetchStockData(symbol, name)
    );
    
    const stockResults = await Promise.all(stockPromises);
    const validStocks = stockResults.filter((stock): stock is StockData => stock !== null);
    
    if (validStocks.length === 0) {
      console.error('No valid stock data retrieved');
      return new Response(
        JSON.stringify({ 
          error: 'Unable to fetch market data',
          stocks: [],
          lastUpdated: new Date().toISOString(),
          isMarketOpen: isMarketOpen()
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log(`Successfully fetched data for ${validStocks.length} stocks`);
    
    return new Response(
      JSON.stringify({
        success: true,
        stocks: validStocks,
        lastUpdated: new Date().toISOString(),
        isMarketOpen: isMarketOpen()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (error) {
    console.error('Error in stock-market-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stocks: [],
        lastUpdated: new Date().toISOString(),
        isMarketOpen: isMarketOpen()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});