'use client';

import { TrendingUp, TrendingDown, DollarSign, Wallet, ShoppingBag, Receipt } from 'lucide-react';

interface FinanceSummaryProps {
  stats: {
    revenue: number;
    cogs: number;
    expenses: number;
  };
}

export default function FinanceSummary({ stats }: FinanceSummaryProps) {
  const grossProfit = stats.revenue - stats.cogs;
  const netProfit = grossProfit - stats.expenses;
  const isProfitable = netProfit >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="card border-l-4 border-l-primary space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Revenue / Benta</p>
          <div className="bg-primary/10 p-2 rounded-lg">
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
        </div>
        <h3 className="text-3xl font-black">₱{stats.revenue.toLocaleString()}</h3>
      </div>

      <div className="card border-l-4 border-l-blue-500 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cost of Goods (COGS)</p>
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <ShoppingBag className="w-4 h-4 text-blue-500" />
          </div>
        </div>
        <h3 className="text-3xl font-black text-blue-600">₱{stats.cogs.toLocaleString()}</h3>
      </div>

      <div className="card border-l-4 border-l-amber-500 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Expenses / Gastos</p>
          <div className="bg-amber-500/10 p-2 rounded-lg">
            <Receipt className="w-4 h-4 text-amber-500" />
          </div>
        </div>
        <h3 className="text-3xl font-black text-amber-600">₱{stats.expenses.toLocaleString()}</h3>
      </div>

      <div className="card lg:col-span-3 border-t-4 border-t-primary bg-primary/5 flex flex-col md:flex-row items-center justify-between p-8 gap-8">
        <div>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Estimated Net Profit / Linis na Kita</h2>
          <div className="flex items-baseline gap-3">
            <h3 className={`text-5xl font-black ${isProfitable ? 'text-primary' : 'text-destructive'}`}>
              ₱{netProfit.toLocaleString()}
            </h3>
            <div className={`flex items-center gap-1 text-sm font-bold ${isProfitable ? 'text-primary' : 'text-destructive'}`}>
              {isProfitable ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isProfitable ? 'PROFIT' : 'LOSS'}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 bg-white/50 p-4 rounded-xl border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Gross Margin</p>
                <p className="text-xl font-black">
                    {stats.revenue > 0 ? ((grossProfit / stats.revenue) * 100).toFixed(1) : 0}%
                </p>
            </div>
            <div className="flex-1 bg-white/50 p-4 rounded-xl border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Net Margin</p>
                <p className="text-xl font-black">
                    {stats.revenue > 0 ? ((netProfit / stats.revenue) * 100).toFixed(1) : 0}%
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
