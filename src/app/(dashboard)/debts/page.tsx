'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  ClipboardList, 
  Search, 
  Plus, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  Trash2,
  Calendar,
  MoreVertical,
  ArrowRight,
  User,
  Phone,
  Banknote,
  History,
  AlertTriangle,
  ArrowUpRight,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format, isPast, isToday } from 'date-fns';
import { toast } from 'sonner';

export default function DebtsPage() {
  const [debts, setDebts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, OVERDUE, PAID
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = api.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  }, []);

  const fetchDebts = async () => {
    try {
      const data = await api.debts.getAll();
      setDebts(data);
    } catch (error) {
      toast.error('Failed to load debts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.plan !== 'FREE') {
      fetchDebts();
    }
  }, [user]);

  if (user && user.plan === 'FREE') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-[32px] p-12 shadow-2xl shadow-black/5 max-w-xl w-full text-center space-y-8 border border-border/50">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 mb-6">
            <ClipboardList className="w-12 h-12 text-primary-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Premium Expansion Module
            </div>
            <h1 className="text-4xl font-display font-black tracking-tight">Unlock Debt Tracker</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Take your business to the next level. Monitor customer balances, track payment settlements, and manage your receivables all in one place.
            </p>

            <div className="bg-primary/5 rounded-2xl p-6 text-left space-y-4 border border-primary/10 mt-6">
              <h3 className="font-bold uppercase tracking-widest text-xs text-primary mb-4">What's included in PRO:</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Customers / CRM</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Debt Tracker</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Suppliers Management</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Up to 2 Staff Accounts</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Goal Tracker</li>
              </ul>
            </div>

            <Link href="/checkout?plan=pro" className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
              Upgrade to PRO
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!showPaymentModal || !paymentAmount) return;
    try {
      await api.debts.addPayment(showPaymentModal, { amount: parseFloat(paymentAmount) });
      toast.success('Payment recorded successfully');
      setShowPaymentModal(null);
      setPaymentAmount('');
      fetchDebts();
    } catch (error) {
      toast.error('Failed to record payment');
    }
  };

  const filteredDebts = debts.filter(d => {
    const matchesSearch = (d.customer?.name || d.customer_name || '').toLowerCase().includes(search.toLowerCase());
    const isOverdue = d.due_date && isPast(new Date(d.due_date)) && d.status !== 'PAID';
    
    if (filter === 'PENDING') return matchesSearch && d.status !== 'PAID' && !isOverdue;
    if (filter === 'OVERDUE') return matchesSearch && isOverdue;
    if (filter === 'PAID') return matchesSearch && d.status === 'PAID';
    return matchesSearch;
  });

  const stats = {
    totalOutstanding: debts.reduce((sum, d) => sum + (d.status !== 'PAID' ? d.remaining_amount : 0), 0),
    totalOverdue: debts.reduce((sum, d) => {
      const overdue = d.due_date && isPast(new Date(d.due_date)) && d.status !== 'PAID';
      return sum + (overdue ? d.remaining_amount : 0);
    }, 0),
    totalPaidToday: debts.reduce((sum, d) => {
        const paidToday = d.payments.reduce((pSum: number, p: any) => {
            return pSum + (isToday(new Date(p.date)) ? p.amount : 0);
        }, 0);
        return sum + paidToday;
    }, 0),
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Auditing Debt Ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            <ClipboardList className="w-3 h-3" />
            Credit Control System
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">Debt Tracker</h1>
          <p className="text-muted-foreground font-medium">Monitor customer balances and track payment settlements.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by debtor name..." 
              className="pl-12 pr-6 py-4 bg-white/50 border-border/50 rounded-2xl w-full md:w-[350px] text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { label: 'Total Receivables', value: `₱${stats.totalOutstanding.toLocaleString()}`, icon: DollarSign, color: 'primary', desc: 'Money pending in market' },
          { label: 'Overdue Collection', value: `₱${stats.totalOverdue.toLocaleString()}`, icon: AlertTriangle, color: 'rose', desc: 'Critical pending debts' },
          { label: 'Settled Today', value: `₱${stats.totalPaidToday.toLocaleString()}`, icon: Banknote, color: 'emerald', desc: 'Cash collected today' },
        ].map((stat, i) => (
          <div key={i} className="card !p-8 group hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110",
                stat.color === 'primary' ? "bg-primary/10 text-primary" :
                stat.color === 'rose' ? "bg-rose-500/10 text-rose-500" :
                "bg-emerald-500/10 text-emerald-500"
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Financial KPI</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-4xl font-display font-bold tracking-tighter">{stat.value}</h3>
              <p className="text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-widest">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Table Container */}
      <div className="card !p-8 space-y-8">
        <div className="flex flex-wrap items-center gap-2 bg-muted/30 p-1.5 rounded-2xl w-full sm:w-fit">
          {['ALL', 'PENDING', 'OVERDUE', 'PAID'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 sm:flex-initial px-4 sm:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                filter === f ? "bg-white text-primary shadow-md" : "text-muted-foreground hover:bg-white/50"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border/40">
                <th className="pb-6">Debtor Information</th>
                <th className="pb-6">Due Date</th>
                <th className="pb-6">Balance Summary</th>
                <th className="pb-6">Current Status</th>
                <th className="pb-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {filteredDebts.map((debt) => {
                const isOverdue = debt.due_date && isPast(new Date(debt.due_date)) && debt.status !== 'PAID';
                const isExpanded = expandedId === debt.id;

                return (
                  <React.Fragment key={debt.id}>
                    <tr className={cn(
                        "group transition-all hover:bg-muted/30",
                        isExpanded && "bg-muted/20"
                    )}>
                      <td className="py-6 pr-4">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-lg shadow-sm border",
                            debt.status === 'PAID' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                            isOverdue ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-primary/10 text-primary border-primary/20"
                          )}>
                            {(debt.customer?.name || debt.customer_name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-base font-bold text-foreground tracking-tight">{debt.customer?.name || debt.customer_name}</h3>
                            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                              <Phone className="w-3 h-3" /> {debt.customer?.phone || 'No phone'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                              <Calendar className="w-3.5 h-3.5 text-muted-foreground/50" />
                              {debt.due_date ? format(new Date(debt.due_date), 'MMM dd, yyyy') : 'No Date Set'}
                           </div>
                           {isOverdue && (
                               <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                                   <AlertCircle className="w-3 h-3" /> Collection Overdue
                               </span>
                           )}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex flex-col">
                           <span className={cn(
                               "text-lg font-black tracking-tight",
                               debt.status === 'PAID' ? "text-emerald-600" : isOverdue ? "text-rose-600" : "text-foreground"
                           )}>
                               ₱{debt.remaining_amount.toLocaleString()}
                           </span>
                           <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                               Original: ₱{debt.amount.toLocaleString()}
                           </span>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                         <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border w-fit shadow-sm",
                            debt.status === 'PAID' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                            debt.status === 'PARTIAL' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                            "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          )}>
                            {debt.status === 'PAID' ? <CheckCircle2 className="w-3 h-3" /> : 
                             debt.status === 'PARTIAL' ? <History className="w-3 h-3" /> : 
                             <Clock className="w-3 h-3" />}
                            {debt.status}
                          </div>
                      </td>
                      <td className="py-6 pl-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                             {debt.status !== 'PAID' && (
                                 <button 
                                    onClick={() => setShowPaymentModal(debt.id)}
                                    className="btn-primary !py-2.5 !px-5 !text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                 >
                                    Collect ₱
                                 </button>
                             )}
                             <button 
                                onClick={() => setExpandedId(isExpanded ? null : debt.id)}
                                className={cn(
                                    "p-2.5 rounded-xl transition-all border",
                                    isExpanded ? "bg-muted border-border" : "bg-muted/30 border-transparent hover:bg-muted"
                                )}
                                title="View History"
                             >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                             </button>
                         </div>
                      </td>
                    </tr>
                    {isExpanded && (
                        <tr>
                            <td colSpan={5} className="p-0 bg-muted/20">
                                <div className="p-10 animate-in slide-in-from-top-2 duration-300 border-x-2 border-primary/5">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                        <div className="lg:col-span-2 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <History className="w-3.5 h-3.5" /> Payment Timeline
                                                </h4>
                                                <span className="text-[10px] font-bold text-muted-foreground">{debt.payments.length} installments recorded</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {debt.payments.map((p: any) => (
                                                    <div key={p.id} className="p-5 bg-white rounded-2xl border border-border/40 shadow-sm flex items-center justify-between group/pay transition-all hover:border-primary/30">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg group-hover/pay:scale-110 transition-transform">
                                                                <Banknote className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-black text-foreground">₱{p.amount.toLocaleString()}</span>
                                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{format(new Date(p.date), 'MMM dd, yyyy • hh:mm a')}</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-2 py-1 bg-muted rounded-md">{p.payment_method}</span>
                                                    </div>
                                                ))}
                                                {debt.payments.length === 0 && (
                                                    <div className="col-span-2 py-10 text-center opacity-30 border-2 border-dashed border-border/50 rounded-3xl">
                                                        <p className="text-xs font-black uppercase tracking-widest italic">No payment history found</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <ShoppingBag className="w-3.5 h-3.5" /> Reference Sale
                                            </h4>
                                            <div className="p-8 bg-white rounded-[2rem] border border-border/40 shadow-xl space-y-6">
                                                <div className="space-y-4">
                                                    {debt.sale?.items.map((item: any) => (
                                                        <div key={item.id} className="flex items-center justify-between">
                                                            <span className="text-sm font-bold text-muted-foreground">{item.quantity}x {item.product.name}</span>
                                                            <span className="text-sm font-black text-foreground">₱{(item.quantity * item.price).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-6 border-t border-border/40 flex items-center justify-between">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original Total</span>
                                                    <span className="text-xl font-black text-primary">₱{debt.amount.toLocaleString()}</span>
                                                </div>
                                                {debt.notes && (
                                                    <div className="p-4 bg-muted/50 rounded-2xl flex items-start gap-3">
                                                        <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                                        <p className="text-xs text-muted-foreground leading-relaxed italic">{debt.notes}</p>
                                                    </div>
                                                )}
                                                <Link 
                                                    href={`/receipts/${debt.sale_id}`}
                                                    className="flex items-center justify-center gap-2 w-full py-4 bg-muted/50 hover:bg-muted text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all"
                                                >
                                                    Full Receipt Details <ArrowUpRight className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filteredDebts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                     <div className="flex flex-col items-center gap-4 opacity-20">
                        <ClipboardList className="w-20 h-20" />
                        <p className="text-sm font-black uppercase tracking-[0.4em]">Nomatching Debts Found</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[480px] rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-12 space-y-10">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6">
                    <Banknote className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-display font-bold tracking-tighter">Collect Payment</h3>
                <p className="text-muted-foreground font-medium">Record a partial or full settlement for this debt.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Amount Collected (₱)</label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-primary/40 group-focus-within:text-primary transition-colors">₱</span>
                    <input 
                      type="number" 
                      className="w-full pl-16 pr-8 py-8 bg-muted/30 border-none rounded-3xl text-4xl font-black text-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                      placeholder="0.00"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowPaymentModal(null)}
                    className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-muted hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePayment}
                    className="flex-1 btn-primary !py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30"
                  >
                    Post Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to use React.Fragment
import React from 'react';
