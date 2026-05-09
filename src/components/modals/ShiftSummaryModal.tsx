'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
    X, 
    TrendingUp, 
    ShoppingCart, 
    Send, 
    CheckCircle2, 
    Loader2, 
    Banknote, 
    Clock, 
    ArrowDownRight, 
    User,
    ClipboardList,
    CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ShiftSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ShiftSummaryModal({ isOpen, onClose, onConfirm }: ShiftSummaryModalProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchShiftStats = async () => {
        setLoading(true);
        try {
          const data = await api.auth.getShiftSummary();
          setStats(data);
        } catch (error) {
          console.error('Failed to fetch shift stats:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchShiftStats();
    }
  }, [isOpen]);

  const handleSubmitReport = async () => {
    setSubmitting(true);
    try {
      // Create a snapshot report in the DB before logging out
      await api.reports.createShiftReport();
      setSubmitted(true);
      setTimeout(() => {
        onConfirm(); // This will trigger the logout
      }, 2000);
    } catch (error) {
      console.error('Failed to submit shift report:', error);
      // Fallback if report fails, still allow logout after alert
      alert('Report could not be saved to history, but you can still logout.');
      onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-[500px] bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
                <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.3em]">Session Closure Required</span>
            </div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Shift End Summary</h2>
            <p className="text-sm text-muted-foreground font-medium">Verify your transactions before handing over the system.</p>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary/40" />
                </div>
              </div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Auditing Shift Data...</p>
            </div>
          ) : submitted ? (
            <div className="py-20 flex flex-col items-center justify-center gap-6 text-center">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-foreground">Shift Report Filed</h3>
                <p className="text-sm text-muted-foreground font-medium">System is being synchronized... Logging out.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Primary Cash Counter */}
              <div className="p-8 bg-primary rounded-[2.5rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 -mr-4 -mt-4 transition-transform group-hover:scale-110">
                    <Banknote className="w-24 h-24" />
                </div>
                <div className="relative z-10 space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Turn-over Cash on Hand</p>
                    <h3 className="text-5xl font-display font-bold tracking-tighter">₱{stats?.totalCashOnHand?.toLocaleString() || 0}</h3>
                    <div className="pt-4 flex items-center gap-4">
                        <div className="text-[10px] font-bold py-1 px-3 bg-white/20 rounded-full">₱{stats?.cashSales?.toLocaleString()} Sales</div>
                        <div className="text-[10px] font-bold py-1 px-3 bg-white/20 rounded-full">₱{stats?.totalCollections?.toLocaleString()} Coll.</div>
                    </div>
                </div>
              </div>

              {/* Debt Activity Lists */}
              <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {/* Pending Debts Created */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                        <ArrowDownRight className="w-4 h-4 text-rose-500" /> New Credits Given ({stats?.unpaidSales?.length || 0})
                    </h4>
                    <div className="space-y-3">
                        {stats?.unpaidSales?.map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg"><User className="w-3.5 h-3.5" /></div>
                                    <span className="text-sm font-bold text-foreground truncate max-w-[150px]">{item.customer}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black">₱{item.total.toLocaleString()}</div>
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Pending: ₱{item.remaining.toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                        {stats?.unpaidSales?.length === 0 && (
                            <p className="text-[10px] text-muted-foreground italic font-medium px-4">No new debts recorded in this shift.</p>
                        )}
                    </div>
                </div>

                {/* Collections Made */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" /> Debt Collections ({stats?.recentPayments?.length || 0})
                    </h4>
                    <div className="space-y-3">
                        {stats?.recentPayments?.map((p: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><CreditCard className="w-3.5 h-3.5" /></div>
                                    <span className="text-sm font-bold text-foreground truncate max-w-[150px]">{p.customer}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-emerald-600">₱{p.amount.toLocaleString()}</div>
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{format(new Date(p.date), 'hh:mm a')}</div>
                                </div>
                            </div>
                        ))}
                         {stats?.recentPayments?.length === 0 && (
                            <p className="text-[10px] text-muted-foreground italic font-medium px-4">No debt collections recorded.</p>
                        )}
                    </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <button 
                    onClick={handleSubmitReport}
                    disabled={submitting}
                    className="w-full py-5 bg-foreground text-background font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 shadow-2xl hover:bg-foreground/90 transition-all active:scale-95 disabled:opacity-50"
                >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                            <Send className="w-5 h-5" />
                            Finalize & Logout Session
                        </>
                    )}
                </button>
                <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Shift started at:</span>
                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest">
                        {stats?.shiftStart ? format(new Date(stats.shiftStart), 'hh:mm a') : '--:--'}
                    </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
