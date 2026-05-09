'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  ShoppingCart,
  ArrowRight,
  Plus,
  Clock,
  Star,
  Zap,
  Target,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Banknote,
  ShoppingBag,
  Trophy,
  Edit2,
  Crown
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSalesToday: 0,
    totalProducts: 0,
    lowStockItems: 0,
    totalDebts: 0,
    activityFeed: [] as any[],
    topProducts: [] as any[],
    dailyGoal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchStats = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await api.dashboard.getStats();
      setStats(data);
      setNewGoal(data.dailyGoal.toString());
    } catch (error) {
      console.error(error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    const session = api.auth.getSession();
    setUser(session?.user);
    
    fetchStats();

    const statsInterval = setInterval(() => {
      fetchStats(false);
    }, 10000);

    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(clockInterval);
    };
  }, []);

  const handleUpdateGoal = async () => {
    try {
      await api.auth.updateProfile({ daily_goal: Number(newGoal) });
      toast.success('Daily goal updated!');
      setIsEditingGoal(false);
      fetchStats(false);
    } catch (error) {
      toast.error('Failed to update goal');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Zap className="w-12 h-12 text-primary animate-pulse" />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Synchronizing Business Intelligence...</p>
      </div>
    );
  }

  // Calculate Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivity = stats.activityFeed.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(stats.activityFeed.length / itemsPerPage);

  const maxRevenue = Math.max(...stats.topProducts.map(p => p.revenue), 1);
  
  // Goal Calculation
  const goalProgress = stats.dailyGoal > 0 ? (stats.totalSalesToday / stats.dailyGoal) * 100 : 0;
  const isGoalReached = goalProgress >= 100;

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Live Core Active</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-foreground">Performance Dashboard</h1>
          <div className="flex items-center gap-2 text-muted-foreground font-medium bg-white/50 w-fit px-3 py-1 rounded-full border border-border shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-bold tracking-tight uppercase tracking-widest">{format(currentTime, 'EEEE, MMM dd • hh:mm:ss a')}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/sales" className="btn-primary group !px-8 !py-6 shadow-2xl shadow-primary/30">
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            New Transaction
          </Link>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Today Revenue', value: `₱${stats.totalSalesToday.toLocaleString()}`, icon: TrendingUp, color: 'emerald', detail: 'Actual cash collected' },
          { label: 'Utang Collection', value: `₱${stats.totalDebts.toLocaleString()}`, icon: CreditCard, color: 'rose', detail: 'Total accounts receivable' },
          { label: 'Stock Alerts', value: stats.lowStockItems, icon: AlertTriangle, color: 'amber', detail: 'Needs immediate attention', adminOnly: true },
          { label: 'Inventory Size', value: stats.totalProducts, icon: Package, color: 'blue', detail: 'Total unique products', adminOnly: true },
        ].filter(stat => !stat.adminOnly || user?.role === 'ADMIN').map((stat, i) => (
          <div key={i} className="card group hover:-translate-y-2 transition-all duration-500 !p-4 sm:!p-6 border-2 border-transparent hover:border-primary/5">
            <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "p-4 rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                stat.color === 'emerald' ? "bg-emerald-500/10 text-emerald-600 shadow-emerald-500/10" :
                stat.color === 'blue' ? "bg-blue-500/10 text-blue-500 shadow-blue-500/10" :
                stat.color === 'amber' ? "bg-amber-500/10 text-amber-500 shadow-amber-500/10" :
                "bg-rose-500/10 text-rose-500 shadow-rose-500/10"
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">System KPI</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-4xl font-display font-bold text-foreground tracking-tight">{stat.value}</h3>
              <p className="text-[10px] text-muted-foreground/60 mt-4 font-bold uppercase tracking-widest">{stat.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Premium Goal Card */}
        <div className={cn(
            "card lg:col-span-1 !p-4 sm:!p-6 relative overflow-hidden group flex flex-col justify-between",
            isGoalReached ? "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white" : "bg-white"
        )}>
           <div className={cn(
               "absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10 transition-transform duration-700",
               isGoalReached ? "opacity-20 scale-125" : "group-hover:scale-110"
           )}>
            <Trophy className={cn("w-40 h-40", isGoalReached ? "text-white" : "text-primary")} />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn("p-2 rounded-xl", isGoalReached ? "bg-white/20 text-white" : "bg-primary/10 text-primary")}>
                        <Trophy className="w-6 h-6" />
                    </div>
                    <h2 className={cn("text-2xl font-display font-bold", isGoalReached ? "text-white" : "text-foreground")}>Daily Goal</h2>
                </div>
                {user?.role === 'ADMIN' && (
                    (user?.plan === 'PRO' || user?.plan === 'ENTERPRISE') ? (
                        <button 
                            onClick={() => setIsEditingGoal(!isEditingGoal)}
                            className={cn("p-2 rounded-lg transition-colors", isGoalReached ? "hover:bg-white/20 text-white/70" : "hover:bg-muted text-muted-foreground")}
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    ) : (
                        <Link 
                            href="/settings"
                            className={cn(
                                "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter border flex items-center gap-1 transition-all",
                                isGoalReached 
                                    ? "bg-white/20 text-white border-white/30 hover:bg-white/30" 
                                    : "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
                            )}
                        >
                            <Crown className="w-3 h-3" /> Upgrade
                        </Link>
                    )
                )}
            </div>

            {isEditingGoal ? (
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold opacity-50">₱</span>
                        <input 
                            type="number" 
                            className="w-full pl-10 pr-4 py-4 bg-muted/50 border-none rounded-2xl font-display text-2xl font-bold focus:ring-2 focus:ring-primary/20"
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleUpdateGoal} className="flex-1 btn-primary !py-3 !text-xs font-black uppercase tracking-widest">Save Target</button>
                        <button onClick={() => setIsEditingGoal(false)} className="px-4 py-3 bg-muted rounded-2xl text-xs font-black uppercase tracking-widest">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <div>
                        <div className="flex items-end justify-between mb-2">
                            <h3 className={cn("text-4xl font-display font-bold tracking-tighter", isGoalReached ? "text-white" : "text-foreground")}>
                                {Math.round(goalProgress)}%
                            </h3>
                            <span className={cn("text-[10px] font-black uppercase tracking-widest", isGoalReached ? "text-white/60" : "text-muted-foreground")}>
                                target: ₱{stats.dailyGoal.toLocaleString()}
                            </span>
                        </div>
                        <div className={cn("relative h-4 w-full rounded-full overflow-hidden", isGoalReached ? "bg-white/20" : "bg-muted")}>
                            <div 
                                className={cn(
                                    "absolute inset-y-0 left-0 transition-all duration-1000 ease-out rounded-full",
                                    isGoalReached ? "bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]" : "bg-primary"
                                )}
                                style={{ width: `${Math.min(100, goalProgress)}%` }}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className={cn("text-xs font-bold", isGoalReached ? "text-white" : "text-muted-foreground")}>
                            {isGoalReached ? "BOOM! Target Smashed! 🚀" : `₱${Math.max(0, stats.dailyGoal - stats.totalSalesToday).toLocaleString()} more to hit target.`}
                        </p>
                        <p className={cn("text-[10px] font-black uppercase tracking-widest opacity-60", isGoalReached ? "text-white" : "text-muted-foreground")}>
                            {isGoalReached ? "You're outperforming today's expectations." : "Keep pushing for consistent growth."}
                        </p>
                    </div>
                </div>
            )}
          </div>

          {!isEditingGoal && (
             <Link 
                href={user?.plan !== 'FREE' ? "/analytics" : "/settings"} 
                className={cn(
                  "w-full py-4 text-xs font-black uppercase tracking-widest text-center rounded-2xl transition-all mt-8 border flex items-center justify-center gap-2",
                  isGoalReached 
                    ? "bg-white text-emerald-700 border-white hover:bg-emerald-50" 
                    : user?.plan !== 'FREE' 
                      ? "btn-secondary"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
                )}
             >
                {user?.plan !== 'FREE' ? (
                  "View Detailed Analytics"
                ) : (
                  <><Crown className="w-3.5 h-3.5" /> Upgrade to PRO to view live analytics</>
                )}
             </Link>
          )}
        </div>

        {/* Top Performing Products */}
        <div className="card lg:col-span-2 space-y-10 !p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700">
            <Star className="w-40 h-40 text-primary" />
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-display font-bold">Top Performing Products</h2>
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Revenue Ranked</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {stats.topProducts.map((product, i) => {
              const percentage = (product.revenue / maxRevenue) * 100;
              return (
                <div key={i} className="space-y-3 group/item">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xs font-black text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors uppercase tracking-tighter border border-border/50">
                        {product.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground tracking-tight line-clamp-1">{product.name}</span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">₱{product.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-black text-foreground">{product.quantity} sold</span>
                    </div>
                  </div>
                  <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-accent rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Feed Section */}
      <div className="card space-y-8 !p-10 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-display font-bold tracking-tight">Recent Billing & Payments</h2>
              <p className="text-sm text-muted-foreground font-medium">History of sales and collections from debtors.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-2">Page {currentPage} of {totalPages || 1}</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-muted/50 rounded-lg hover:bg-muted disabled:opacity-30 transition-all border border-border/50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 bg-muted/50 rounded-lg hover:bg-muted disabled:opacity-30 transition-all border border-border/50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {currentActivity.map((activity: any) => (
              <div key={activity.id} className="card p-4 flex flex-col gap-4 border-2 border-transparent hover:border-primary/5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black text-primary px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10 w-fit">
                    #{activity.reference_id}
                  </span>
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                    activity.type === 'SALE' ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-600"
                  )}>
                    {activity.type === 'SALE' ? <ShoppingBag className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                    {activity.type === 'SALE' ? 'NEW SALE' : 'UTANG PAYMENT'}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-foreground uppercase tracking-tight flex items-center gap-1.5">
                    <Target className="w-3 h-3 opacity-40" /> {activity.customer}
                  </div>
                  <div className="text-sm font-bold text-foreground">{format(new Date(activity.date), 'MMM dd, yyyy')}</div>
                  <div className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-widest">{format(new Date(activity.date), 'hh:mm a')}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex flex-col">
                    <span className="text-base font-black text-foreground">₱{Number(activity.amount).toLocaleString()}</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-[0.1em] mt-1 px-2 py-0.5 rounded w-fit",
                      activity.status === 'UNPAID' ? "bg-rose-500/10 text-rose-600" : 
                      activity.status === 'PARTIAL' ? "bg-amber-500/10 text-amber-600" :
                      "bg-emerald-500/10 text-emerald-600"
                    )}>
                      {activity.status === 'UNPAID' ? 'UTANG' : 
                       activity.status === 'PARTIAL' ? 'PARTIAL' : 
                       activity.type === 'SALE' ? 'PAID' : 'SETTLED'}
                    </span>
                  </div>
                  <div>
                    {activity.type === 'SALE' ? (
                      <Link 
                          href={`/receipts/${activity.id}`}
                          className="btn-secondary !py-2 !px-4 !text-[10px] font-black uppercase tracking-widest border border-border/50 hover:border-primary/30 transition-all shadow-sm"
                      >
                          Receipt
                      </Link>
                    ) : (
                      <div className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Collection</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {currentActivity.length === 0 && (
              <div className="py-12 text-center card">
                <p className="text-sm font-black uppercase tracking-widest opacity-30">No transactions</p>
              </div>
            )}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto flex-1 min-h-[440px]">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border/40">
                  <th className="pb-6">Reference ID</th>
                  <th className="pb-6">Timestamp</th>
                  <th className="pb-6">Amount</th>
                  <th className="pb-6 text-right">Activity Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {currentActivity.map((activity: any) => (
                  <tr key={activity.id} className="group transition-all hover:bg-muted/30">
                    <td className="py-6 pr-4">
                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] font-black text-primary px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10 w-fit">
                          #{activity.reference_id}
                        </span>
                        <div className="text-[10px] font-bold text-foreground uppercase tracking-tight flex items-center gap-1.5">
                          <Target className="w-3 h-3 opacity-40" /> {activity.customer}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="text-sm font-bold text-foreground">{format(new Date(activity.date), 'MMM dd, yyyy')}</div>
                      <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">{format(new Date(activity.date), 'hh:mm a')}</div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-foreground">₱{Number(activity.amount).toLocaleString()}</span>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-[0.1em] mt-1 px-2 py-0.5 rounded w-fit",
                          activity.status === 'UNPAID' ? "bg-rose-500/10 text-rose-600" : 
                          activity.status === 'PARTIAL' ? "bg-amber-500/10 text-amber-600" :
                          "bg-emerald-500/10 text-emerald-600"
                        )}>
                          {activity.status === 'UNPAID' ? 'UTANG / UNPAID' : 
                           activity.status === 'PARTIAL' ? 'PARTIAL UTANG' : 
                           activity.type === 'SALE' ? 'PAID' : 'SETTLED'}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 pl-4 text-right">
                       <div className="flex flex-col items-end gap-2">
                          <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                            activity.type === 'SALE' ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-600"
                          )}>
                            {activity.type === 'SALE' ? <ShoppingBag className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                            {activity.type === 'SALE' ? 'NEW SALE' : 'UTANG PAYMENT'}
                          </div>
                          {activity.type === 'SALE' ? (
                            <Link 
                                href={`/receipts/${activity.id}`}
                                className="text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest underline"
                            >
                                View Receipt
                            </Link>
                          ) : (
                            <div className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Debt Collection</div>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
                {currentActivity.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center opacity-30">
                      <p className="text-sm font-black uppercase tracking-widest">No recent transactions or payments</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-6 border-t border-border/40 flex items-center justify-between">
            <Link href="/receipts" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
              Go to Full Archive <ArrowRight className="w-3 h-3" />
            </Link>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, stats.activityFeed.length)} of {stats.activityFeed.length}</p>
          </div>
      </div>
    </div>
  );
}
