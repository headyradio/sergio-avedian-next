import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useStockMarketData, StockData } from "@/hooks/useStockMarketData";
import { cn } from "@/lib/utils";

interface StockMarketWidgetProps {
  variant?: 'compact' | 'expanded';
  className?: string;
}

const StockItem = ({ stock, variant = 'expanded' }: { stock: StockData; variant?: 'compact' | 'expanded' }) => {
  const isPositive = stock.changePercent >= 0;
  const isCompact = variant === 'compact';
  
  return (
    <div className={cn(
      "flex items-center justify-between",
      isCompact ? "flex-row gap-2" : "flex-row gap-4"
    )}>
      <div className={cn(
        "flex items-center gap-2",
        isCompact ? "min-w-0" : "min-w-[120px]"
      )}>
        {isPositive ? (
          <TrendingUp className={cn("text-green-500", isCompact ? "w-3 h-3" : "w-4 h-4")} />
        ) : (
          <TrendingDown className={cn("text-red-500", isCompact ? "w-3 h-3" : "w-4 h-4")} />
        )}
        <span className={cn(
          "font-medium text-foreground",
          isCompact ? "text-xs truncate" : "text-sm"
        )}>
          {isCompact ? stock.symbol : stock.name}
        </span>
      </div>
      
      {!isCompact && (
        <div className="font-mono text-sm text-foreground">
          ${stock.price.toLocaleString()}
        </div>
      )}
      
      <div className={cn(
        "flex items-center gap-1",
        isPositive ? "text-green-500" : "text-red-500"
      )}>
        {!isCompact && (
          <span className="font-mono text-sm">
            {isPositive ? '+' : ''}{stock.change.toFixed(2)}
          </span>
        )}
        <span className={cn(
          "font-mono font-semibold",
          isCompact ? "text-xs" : "text-sm"
        )}>
          ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
};

const StockMarketWidget = ({ variant = 'expanded', className }: StockMarketWidgetProps) => {
  const { stocks, loading, error, lastUpdated, isMarketOpen } = useStockMarketData();
  
  if (loading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
        {variant === 'compact' ? (
          <Skeleton className="h-6 w-full" />
        ) : (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (error || stocks.length === 0) {
    return (
      <div className={cn("text-center py-4", className)}>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Market data unavailable</span>
        </div>
      </div>
    );
  }

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  // Get the main indices for compact view
  const mainIndices = stocks.filter(stock => 
    ['DJI', 'IXIC', 'GSPC'].includes(stock.symbol)
  ).slice(0, 3);

  const displayStocks = variant === 'compact' ? mainIndices : stocks.slice(0, 6);

  return (
    <TooltipProvider>
      <div className={cn("space-y-3", className)}>
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isMarketOpen ? "bg-green-500" : "bg-orange-500"
            )} />
            <span className={cn(
              "font-semibold text-foreground",
              variant === 'compact' ? "text-sm" : "text-base"
            )}>
              {variant === 'compact' ? 'MARKET LIVE' : 'LIVE MARKET DATA'}
            </span>
          </div>
          
          {lastUpdated && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Clock className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Last updated: {formatLastUpdated(lastUpdated)}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Market Status */}
        {!isMarketOpen && (
          <div className="text-xs text-muted-foreground">
            Market Closed • Showing last closing prices
          </div>
        )}

        {/* Stock Data */}
        {variant === 'compact' ? (
          <div className="flex items-center gap-3 text-sm">
            {displayStocks.map((stock, index) => (
              <div key={stock.symbol} className="flex items-center gap-1">
                {index > 0 && <span className="text-muted-foreground">•</span>}
                <span className="font-medium text-foreground">{stock.symbol}</span>
                <span className={cn(
                  "font-mono font-semibold",
                  stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {displayStocks.map((stock) => (
              <StockItem key={stock.symbol} stock={stock} variant={variant} />
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default StockMarketWidget;