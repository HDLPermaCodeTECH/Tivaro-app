'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  Search, 
  Calendar, 
  Eye, 
  Download, 
  History,
  ArrowUpRight,
  User,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await api.sales.list();
      setSales(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter((s: any) => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.receipt?.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cashier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.customer?.name || s.debt?.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <History className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Operational Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-foreground">Sales History & Receipts</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">Review, audit, and reprint your business transactions.</p>
        </div>
      </div>

      <div className="card !p-4 sm:!p-6 space-y-8 border-2 border-transparent hover:border-primary/5 transition-all">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by Receipt #, Customer or Cashier..."
              className="w-full pl-12 pr-4 py-4 bg-muted/30 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredSales.map((sale: any) => {
          const trueStatus = sale.debt ? sale.debt.status : sale.payment_status;
          const remaining = sale.debt?.remaining_amount || 0;

          return (
            <div key={sale.id} className="card p-4 flex flex-col gap-4 border-2 border-transparent hover:border-primary/5 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black text-primary px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
                    #{sale.receipt?.id.substring(0, 8).toUpperCase() || sale.id.substring(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                  trueStatus === 'PENDING' || trueStatus === 'UNPAID' ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                  trueStatus === 'PARTIAL' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                  "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                )}>
                  {trueStatus === 'PENDING' || trueStatus === 'UNPAID' ? 'UTANG' : 
                   trueStatus === 'PARTIAL' ? 'PARTIAL' : 
                   sale.debt ? 'SETTLED' : 'PAID'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <User className="w-3.5 h-3.5 text-muted-foreground/50" />
                  {sale.customer?.name || sale.debt?.customer_name || 'Walk-in Customer'}
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                  {sale.cashier?.role === 'ADMIN' ? 'Admin' : 'Cashier'}: {sale.cashier?.name || sale.cashier?.email.split('@')[0]}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-bold text-foreground">{format(new Date(sale.created_at), 'MMM dd, yyyy')}</div>
                  <div className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-widest">{format(new Date(sale.created_at), 'hh:mm a')}</div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-foreground tracking-tight">₱{Number(sale.total_amount).toLocaleString()}</span>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">{sale.items?.length || 0} items</div>
                </div>
              </div>

              {trueStatus === 'PARTIAL' && (
                <div className="text-[10px] font-black text-amber-600/70 uppercase tracking-tight pt-2 border-t border-border/50">
                  Remaining: ₱{Number(remaining).toLocaleString()}
                </div>
              )}

              <div className="pt-2 border-t border-border/50">
                <Link 
                  href={`/receipts/${sale.id}`}
                  className="btn-secondary !py-2.5 !px-5 !text-[10px] font-black uppercase tracking-widest !rounded-xl border border-border/50 hover:border-primary/30 transition-all shadow-sm flex items-center justify-center gap-2 w-full hover:bg-primary hover:text-white hover:border-primary"
                >
                  VIEW RECEIPT <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
        {!loading && filteredSales.length === 0 && (
          <div className="py-12 text-center card">
            <div className="flex flex-col items-center gap-4 opacity-20">
              <ShoppingBag className="w-12 h-12" />
              <p className="text-sm font-black uppercase tracking-[0.3em]">No Transactions Found</p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border/40">
              <th className="pb-6">Reference & Customer</th>
              <th className="pb-6">Date & Time</th>
              <th className="pb-6">Payment Status</th>
              <th className="pb-6">Grand Total</th>
              <th className="pb-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {filteredSales.map((sale: any) => {
              const trueStatus = sale.debt ? sale.debt.status : sale.payment_status;
              const remaining = sale.debt?.remaining_amount || 0;

              return (
                <tr key={sale.id} className="group transition-all hover:bg-muted/30">
                  <td className="py-6 pr-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-black text-primary px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
                                #{sale.receipt?.id.substring(0, 8).toUpperCase() || sale.id.substring(0, 8).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <User className="w-3.5 h-3.5 text-muted-foreground/50" />
                            {sale.customer?.name || sale.debt?.customer_name || 'Walk-in Customer'}
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                          {sale.cashier?.role === 'ADMIN' ? 'Admin' : 'Cashier'}: {sale.cashier?.name || sale.cashier?.email.split('@')[0]}
                        </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="text-sm font-bold text-foreground">{format(new Date(sale.created_at), 'MMM dd, yyyy')}</div>
                    <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">{format(new Date(sale.created_at), 'hh:mm a')}</div>
                  </td>
                  <td className="py-6 px-4">
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit border shadow-sm",
                      trueStatus === 'PENDING' || trueStatus === 'UNPAID' ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                      trueStatus === 'PARTIAL' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    )}>
                      {trueStatus === 'PENDING' || trueStatus === 'UNPAID' ? <CreditCard className="w-3 h-3" /> : 
                       trueStatus === 'PARTIAL' ? <Clock className="w-3 h-3" /> : 
                       <CheckCircle2 className="w-3 h-3" />}
                      {trueStatus === 'PENDING' || trueStatus === 'UNPAID' ? 'UTANG / UNPAID' : 
                       trueStatus === 'PARTIAL' ? 'PARTIAL PAYMENT' : 
                       sale.debt ? 'SETTLED' : 'PAID'}
                    </div>
                    {trueStatus === 'PARTIAL' && (
                        <div className="text-[9px] font-black text-amber-600/70 mt-1 uppercase tracking-tight ml-1">
                            Remaining: ₱{Number(remaining).toLocaleString()}
                        </div>
                    )}
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-foreground tracking-tight">₱{Number(sale.total_amount).toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">{sale.items?.length || 0} items</span>
                    </div>
                  </td>
                  <td className="py-6 pl-4 text-right">
                    <Link 
                      href={`/receipts/${sale.id}`}
                      className="btn-secondary !py-2.5 !px-5 !text-[10px] font-black uppercase tracking-widest !rounded-xl border border-border/50 hover:border-primary/30 transition-all shadow-sm flex items-center gap-2 ml-auto w-fit group-hover:bg-primary group-hover:text-white group-hover:border-primary"
                    >
                      VIEW RECEIPT <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!loading && filteredSales.length === 0 && (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-20">
                      <ShoppingBag className="w-16 h-16" />
                      <p className="text-sm font-black uppercase tracking-[0.3em]">No Transactions Found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
