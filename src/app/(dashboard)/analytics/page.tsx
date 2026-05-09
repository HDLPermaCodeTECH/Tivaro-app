'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Loader2,
  AlertCircle,
  Crown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show labels for very small segments

  return (
    <text x={x} y={y} fill={COLORS[index % COLORS.length]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-black uppercase">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [plData, setPlData] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = api.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  }, []);

  const fetchPL = async () => {
    setLoading(true);
    try {
      const data = await api.analytics.getPLReport(dateRange.start, dateRange.end);
      setPlData(data);
    } catch (error) {
      console.error('Failed to fetch P&L:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.plan === 'ENTERPRISE') {
      fetchPL();
    }
  }, [dateRange, user]);

  if (user && user.plan !== 'ENTERPRISE') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-[32px] p-12 shadow-2xl shadow-black/5 max-w-xl w-full text-center space-y-8 border border-border/50">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 mb-6">
            <BarChart3 className="w-12 h-12 text-primary-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Premium Expansion Module
            </div>
            <h1 className="text-4xl font-display font-black tracking-tight">Unlock Advanced Analytics</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Take your business to the next level. Get deep insights into your revenue trends, discover your top-performing products, and understand your profit margins better.
            </p>

            <div className="bg-primary/5 rounded-2xl p-6 text-left space-y-4 border border-primary/10 mt-6">
              <h3 className="font-bold uppercase tracking-widest text-xs text-primary mb-4">What's included in Enterprise:</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Everything in PRO</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Advanced Analytics (P&L)</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Unlimited Staff Accounts</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Custom Branding</li>
              </ul>
            </div>

            <Link href="/checkout?plan=enterprise" className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
              <Crown className="w-4 h-4" /> Upgrade to Enterprise
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !plData) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Calculating Financial Performance...</p>
      </div>
    );
  }

  const netProfitColor = (plData?.netProfit >= 0) ? 'text-green-600' : 'text-destructive';

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
            <BarChart3 className="w-3 h-3" />
            PRO Analytics
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">Profit & Loss Statement</h1>
          <p className="text-muted-foreground font-medium">Detailed breakdown of your revenue, costs, and net margins.</p>
        </div>

        <div className="flex items-center gap-3 bg-white/50 p-2 rounded-2xl border border-border shadow-sm">
          <Calendar className="w-4 h-4 text-muted-foreground ml-2" />
          <input 
            type="date" 
            className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">to</span>
          <input 
            type="date" 
            className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card group hover:shadow-2xl hover:shadow-primary/5 transition-all !p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary"><DollarSign className="w-6 h-6" /></div>
            <div className="text-[10px] font-black text-green-600 bg-green-500/10 px-2 py-1 rounded-lg">GROSS REVENUE</div>
          </div>
          <div className="text-3xl font-black text-foreground">₱{plData?.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">Total sales in selected period.</p>
        </div>

        <div className="card group hover:shadow-2xl hover:shadow-destructive/5 transition-all !p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-destructive/10 rounded-2xl text-destructive"><TrendingDown className="w-6 h-6" /></div>
            <div className="text-[10px] font-black text-destructive bg-destructive/10 px-2 py-1 rounded-lg">TOTAL COGS</div>
          </div>
          <div className="text-3xl font-black text-foreground">₱{plData?.totalCOGS.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">Cost of goods sold (purchase cost).</p>
        </div>

        <div className="card group hover:shadow-2xl hover:shadow-primary/5 transition-all !p-8 border-2 border-primary/5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent/10 rounded-2xl text-accent"><TrendingUp className="w-6 h-6" /></div>
            <div className="text-[10px] font-black text-accent bg-accent/10 px-2 py-1 rounded-lg">GROSS PROFIT</div>
          </div>
          <div className="text-3xl font-black text-foreground">₱{plData?.grossProfit.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">Margin: {plData?.grossMargin.toFixed(1)}%</p>
        </div>

        <div className="card group hover:shadow-2xl hover:shadow-primary/10 transition-all !p-8 bg-primary/5 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/30"><DollarSign className="w-6 h-6" /></div>
            <div className={cn("text-[10px] font-black px-2 py-1 rounded-lg", plData?.netProfit >= 0 ? "bg-green-500/20 text-green-700" : "bg-destructive/20 text-destructive")}>
              NET PROFIT
            </div>
          </div>
          <div className={cn("text-3xl font-black", netProfitColor)}>₱{plData?.netProfit.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">Profit after all expenses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expense Breakdown */}
        <div className="card lg:col-span-1 space-y-8 !p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-xl text-muted-foreground"><PieChart className="w-5 h-5" /></div>
              <h2 className="text-xl font-display font-bold">Expense Mix</h2>
            </div>
          </div>

          <div className="relative h-[300px] w-full flex items-center justify-center">
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">TOTAL</span>
              <span className="text-2xl font-black text-foreground">₱{plData?.totalExpenses.toLocaleString()}</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={plData?.expenseBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="amount"
                  nameKey="category"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {(plData?.expenseBreakdown || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-background stroke-2 outline-none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Amount']}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4 pt-4">
            {(plData?.expenseBreakdown || []).map((item: any, index: number) => {
              const total = plData?.totalExpenses || 1;
              const percentage = ((item.amount / total) * 100).toFixed(1);
              return (
                <div key={item.category} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors leading-none">{item.category}</span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">{percentage}% of total</span>
                    </div>
                  </div>
                  <span className="text-sm font-black">₱{item.amount.toLocaleString()}</span>
                </div>
              );
            })}
            {plData?.expenseBreakdown.length === 0 && (
              <p className="text-center text-xs text-muted-foreground italic py-4">No expenses recorded for this period.</p>
            )}
          </div>
        </div>

        {/* Financial Summary Table */}
        <div className="card lg:col-span-2 space-y-8 !p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-xl text-muted-foreground"><BarChart3 className="w-5 h-5" /></div>
              <h2 className="text-xl font-display font-bold">Financial Summary</h2>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 hover:underline">
              <Download className="w-3 h-3" /> Export PDF
            </button>
          </div>

          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Revenue</span>
                <span className="text-lg font-black text-foreground">₱{plData?.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Cost of Goods Sold (COGS)</span>
                <span className="text-lg font-black text-destructive">-(₱{plData?.totalCOGS.toLocaleString()})</span>
              </div>
              <div className="flex items-center justify-between pb-6 border-b-2 border-foreground/10 pt-2">
                <span className="text-md font-black text-foreground uppercase tracking-[0.2em]">Gross Profit</span>
                <div className="text-right">
                  <div className="text-2xl font-black text-foreground">₱{plData?.grossProfit.toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-accent uppercase">{plData?.grossMargin.toFixed(1)}% Margin</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Operating Expenses</span>
                <span className="text-lg font-black text-destructive">-(₱{plData?.totalExpenses.toLocaleString()})</span>
              </div>
              <div className="p-8 bg-primary/5 rounded-[2.5rem] border-2 border-primary/10 mt-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-700">
                  <Crown className="w-40 h-40" />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">NET OPERATING INCOME</span>
                    <div className={cn("text-5xl font-black mt-2 tracking-tighter", netProfitColor)}>
                      ₱{plData?.netProfit.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-lg font-black", netProfitColor)}>{plData?.netMargin.toFixed(1)}%</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Net Margin</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-700">Financial Insight</h4>
              <p className="text-xs text-amber-600/80 leading-relaxed font-medium">
                {plData?.netProfit > 0 
                  ? `Your net profit is positive. For every ₱100 in sales, you take home ₱${plData.netMargin.toFixed(2)} after all costs and expenses.`
                  : "Your net profit is negative. Consider reviewing your operating expenses or increasing your selling prices to improve margins."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
