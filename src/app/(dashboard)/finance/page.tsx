'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  Receipt,
  Calendar,
  ChevronRight,
  Edit2
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import FinanceSummary from '@/components/finance/FinanceSummary';
import ExpenseModal from '@/components/finance/ExpenseModal';

export default function FinancePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ revenue: 0, cogs: 0, expenses: 0 });
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch P&L Data from Backend (Cash-Based)
      const plData = await api.analytics.getPLReport(dateRange.start, dateRange.end);
      
      // 2. Fetch Expenses for the table
      const expensesData = await api.expenses.list();
      const filteredExpenses = expensesData.filter((exp: any) => {
        const date = parseISO(exp.date);
        return isWithinInterval(date, {
          start: new Date(dateRange.start),
          end: new Date(dateRange.end + 'T23:59:59')
        });
      });

      setStats({ 
        revenue: plData.totalRevenue, 
        cogs: plData.totalCOGS, 
        expenses: plData.totalExpenses 
      });
      setExpenses(filteredExpenses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance / Kita</h1>
          <p className="text-muted-foreground">Monitor your business health and track profitability.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-border shadow-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <input 
                    type="date" 
                    className="text-xs font-bold border-none focus:ring-0 p-0"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
                <span className="text-muted-foreground text-xs">to</span>
                <input 
                    type="date" 
                    className="text-xs font-bold border-none focus:ring-0 p-0"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
            </div>
          <button 
            onClick={() => {
              setSelectedExpense(null);
              setModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Calculating financial data...</div>
      ) : (
        <>
          <FinanceSummary stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Receipt className="w-5 h-5" /> Expense History
                </h2>
                <div className="text-sm font-bold text-muted-foreground uppercase">
                  Total: ₱{stats.expenses.toLocaleString()}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-sm text-muted-foreground">
                      <th className="py-3 font-medium uppercase tracking-wider">Date</th>
                      <th className="py-3 font-medium uppercase tracking-wider">Description</th>
                      <th className="py-3 font-medium uppercase tracking-wider">Category</th>
                      <th className="py-3 font-medium text-right uppercase tracking-wider">Amount</th>
                      <th className="py-3 font-medium text-right uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense: any) => (
                      <tr key={expense.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                        <td className="py-4 text-sm font-medium">
                          {format(new Date(expense.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="py-4 font-bold">
                          {expense.description}
                        </td>
                        <td className="py-4">
                          <span className="bg-muted px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">
                            {expense.category}
                          </span>
                        </td>
                        <td className="py-4 text-right font-black text-amber-600">
                          ₱{Number(expense.amount).toLocaleString()}
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => {
                              setSelectedExpense(expense);
                              setModalOpen(true);
                            }}
                            className="p-2 hover:bg-muted rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Edit2 className="w-4 h-4 text-primary" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {expenses.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-muted-foreground italic">
                          No expenses recorded for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
                <div className="card space-y-4">
                    <h2 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Quick Insights</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="text-xs font-bold text-muted-foreground">Break-even Revenue</div>
                            <div className="text-lg font-black">
                                ₱{stats.revenue > 0 ? (stats.expenses / (1 - stats.cogs / stats.revenue)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '---'}
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">
                            * Approximate revenue needed to cover all expenses based on current margins.
                        </p>
                    </div>
                </div>

                <div className="card bg-primary/5 border-primary/20 space-y-4">
                    <h2 className="font-bold text-sm uppercase tracking-widest text-primary flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Profit Strategy
                    </h2>
                    <ul className="text-xs space-y-2 text-muted-foreground">
                        <li className="flex gap-2">
                            <ChevronRight className="w-3 h-3 text-primary shrink-0" />
                            <span>Consider bundling items with high margins.</span>
                        </li>
                        <li className="flex gap-2">
                            <ChevronRight className="w-3 h-3 text-primary shrink-0" />
                            <span>Monitor your biggest expense category: <span className="font-bold text-foreground">General</span>.</span>
                        </li>
                    </ul>
                </div>
            </div>
          </div>
        </>
      )}

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={fetchData}
        expense={selectedExpense}
      />
    </div>
  );
}
