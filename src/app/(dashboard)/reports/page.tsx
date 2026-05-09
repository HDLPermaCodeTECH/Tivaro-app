'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  ClipboardList, 
  User, 
  Calendar, 
  TrendingUp, 
  ShoppingCart, 
  Loader2, 
  Search,
  ArrowUpRight,
  Clock,
  ChevronDown,
  ChevronUp,
  Banknote,
  ArrowDownRight,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const session = api.auth.getSession();
    if (!session || session.user.role === 'STAFF') {
      window.location.href = '/dashboard';
      return;
    }

    const fetchReports = async () => {
      try {
        const data = await api.reports.list();
        setReports(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter(r => 
    r.cashier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Loading Shift Archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Operational Audits</span>
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight">Shift Reports</h1>
          <p className="text-muted-foreground mt-1 font-medium">Review cashier performance and collection history.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search cashier name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-4 bg-white border border-border/50 rounded-2xl w-full md:w-[300px] shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* Main Table Layout */}
      <div className="bg-white rounded-[2.5rem] border border-border/40 shadow-xl shadow-black/5 overflow-hidden">
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredReports.map((report) => {
          const isExpanded = expandedId === report.id;
          return (
            <div key={report.id} className="card p-4 flex flex-col gap-4 border-2 border-transparent hover:border-primary/5 transition-all">
              <div className="flex items-center justify-between" onClick={() => setExpandedId(isExpanded ? null : report.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
                    {report.cashier?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{report.cashier?.name || 'Unknown Staff'}</div>
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Staff ID: {report.cashier_id?.substring(0, 8)} | Shift ID: {report.id.substring(0, 8)}</div>
                  </div>
                </div>
                <div className="inline-flex p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border/50">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Shift Time</p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    {format(new Date(report.end_time), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {report.start_time ? format(new Date(report.start_time), 'hh:mm a') : '??:??'} - {format(new Date(report.end_time), 'hh:mm a')}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Totals</p>
                  <div className="text-sm font-black text-foreground">₱{report.total_sales.toLocaleString()}</div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{report.total_transactions} Transactions</div>
                  <div className="text-sm font-black text-emerald-600 mt-1">₱{report.total_collections.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground font-medium italic">Collections</div>
                </div>
              </div>

              {/* Expandable Content for Mobile */}
              {isExpanded && (
                <div className="space-y-6 pt-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-300">
                  {/* New Debts Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                      <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        <ArrowDownRight className="w-4 h-4" /> New Credits ({report.unpaid_sales?.length || 0})
                      </h4>
                    </div>
                    <div className="space-y-0.5">
                      {report.unpaid_sales?.length > 0 ? (
                        report.unpaid_sales.map((item: any, i: number) => (
                          <div key={i} className="flex items-center justify-between py-2.5 px-1 border-b border-border/20 last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 flex items-center justify-center text-rose-600 opacity-60"><User className="w-3.5 h-3.5" /></div>
                              <span className="text-xs font-bold text-foreground uppercase tracking-tight">{item.customer}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-black text-rose-600">₱{item.total.toLocaleString()}</div>
                              <div className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">BAL: ₱{item.remaining.toLocaleString()}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-muted-foreground italic font-medium py-2">No new debts recorded.</p>
                      )}
                    </div>
                  </div>

                  {/* Collections Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Debt Collections ({report.collections?.length || 0})
                      </h4>
                    </div>
                    <div className="space-y-0.5">
                      {report.collections?.length > 0 ? (
                        report.collections.map((p: any, i: number) => (
                          <div key={i} className="flex items-center justify-between py-2.5 px-1 border-b border-border/20 last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 flex items-center justify-center text-emerald-600 opacity-60"><CreditCard className="w-3.5 h-3.5" /></div>
                              <span className="text-xs font-bold text-foreground uppercase tracking-tight">{p.customer}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-black text-emerald-600">₱{p.amount.toLocaleString()}</div>
                              <div className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">{format(new Date(p.time), 'hh:mm a')}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-muted-foreground italic font-medium py-2">No collections recorded.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filteredReports.length === 0 && (
          <div className="py-12 text-center card">
            <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No shift reports found.</p>
          </div>
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-white rounded-[2.5rem] border border-border/40 shadow-xl shadow-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border/40">
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Cashier</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Shift Time</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Total Sales</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Collections</th>
                <th className="px-8 py-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredReports.map((report) => {
                const isExpanded = expandedId === report.id;
                return (
                  <React.Fragment key={report.id}>
                    <tr 
                      onClick={() => setExpandedId(isExpanded ? null : report.id)}
                      className={cn(
                        "group cursor-pointer transition-all hover:bg-primary/[0.02]",
                        isExpanded && "bg-primary/[0.04]"
                      )}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
                            {report.cashier?.name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">{report.cashier?.name || 'Unknown Staff'}</div>
                            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Staff ID: {report.cashier_id?.substring(0, 8)} | Shift ID: {report.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                            {format(new Date(report.end_time), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {report.start_time ? format(new Date(report.start_time), 'hh:mm a') : '??:??'} - {format(new Date(report.end_time), 'hh:mm a')}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-black text-foreground">₱{report.total_sales.toLocaleString()}</div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{report.total_transactions} Transactions</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-black text-emerald-600">₱{report.total_collections.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground font-medium italic">Cash Received</div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="inline-flex p-2 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-primary/[0.02]">
                        <td colSpan={5} className="px-8 py-8 border-t border-primary/10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                                <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                  <ArrowDownRight className="w-4 h-4" /> New Credits Given ({report.unpaid_sales?.length || 0})
                                </h4>
                              </div>
                              <div className="space-y-0.5">
                                {report.unpaid_sales?.length > 0 ? (
                                  report.unpaid_sales.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between py-2.5 px-1 border-b border-border/20 last:border-0 hover:bg-black/[0.02] transition-colors">
                                      <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 flex items-center justify-center text-rose-600 opacity-60"><User className="w-3.5 h-3.5" /></div>
                                        <span className="text-xs font-bold text-foreground uppercase tracking-tight">{item.customer}</span>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-xs font-black text-rose-600">₱{item.total.toLocaleString()}</div>
                                        <div className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">BAL: ₱{item.remaining.toLocaleString()}</div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-[10px] text-muted-foreground italic font-medium py-2">No new debts recorded in this shift.</p>
                                )}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4" /> Debt Collections ({report.collections?.length || 0})
                                </h4>
                              </div>
                              <div className="space-y-0.5">
                                {report.collections?.length > 0 ? (
                                  report.collections.map((p: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between py-2.5 px-1 border-b border-border/20 last:border-0 hover:bg-black/[0.02] transition-colors">
                                      <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 flex items-center justify-center text-emerald-600 opacity-60"><CreditCard className="w-3.5 h-3.5" /></div>
                                        <span className="text-xs font-bold text-foreground uppercase tracking-tight">{p.customer}</span>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-xs font-black text-emerald-600">₱{p.amount.toLocaleString()}</div>
                                        <div className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">{format(new Date(p.time), 'hh:mm a')}</div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-[10px] text-muted-foreground italic font-medium py-2">No collections recorded.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>    </div>
      </div>
    </div>
  );
}
