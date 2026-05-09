'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  Users, 
  TrendingUp, 
  Package, 
  Plus,
  ArrowRight,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

export default function CrmAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'customers'>('analytics');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  
  // New Customer Form
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' });

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = api.auth.getSession();
    if (session) {
      setUser(session.user);
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const data = await api.analytics.getOverview();
        setAnalyticsData(data);
      } else {
        const data = await api.customers.list();
        setCustomers(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.customers.create(newCustomer);
      setShowAddCustomer(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to add customer');
    }
  };

  const handleUpgrade = async () => {
    try {
      await api.auth.upgrade();
      const session = api.auth.getSession();
      setUser(session?.user);
      fetchData();
    } catch (error) {
      console.error('Upgrade failed', error);
    }
  };

  if (user && user.plan === 'FREE') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-[32px] p-12 shadow-2xl shadow-black/5 max-w-xl w-full text-center space-y-8 border border-border/50">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 mb-6">
            <TrendingUp className="w-12 h-12 text-primary-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Premium Expansion Module
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight">Unlock CRM & Analytics</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Take your business to the next level. Get deep insights into your revenue trends, discover your top-performing products, and manage your customer relationships all in one place.
            </p>
          </div>

          <div className="bg-primary/5 rounded-2xl p-6 text-left space-y-4 border border-primary/10">
            <h3 className="font-bold uppercase tracking-widest text-xs text-primary mb-4">What's included in PRO:</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Customers / CRM</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Debt Tracker</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Suppliers Management</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Up to 2 Staff Accounts</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Goal Tracker</li>
            </ul>
          </div>

          <button 
            onClick={handleUpgrade}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
          >
            Upgrade to PRO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
            <BarChart3 className="w-3 h-3" />
            Expansion Module
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-foreground">CRM & Analytics</h1>
          <p className="text-muted-foreground font-medium">Deep insights and customer relationship management.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-white/50 p-1.5 rounded-2xl border border-border/50 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
              activeTab === 'analytics' ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/40"
            )}
          >
            <TrendingUp className="w-4 h-4" /> Analytics
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
              activeTab === 'customers' ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/40"
            )}
          >
            <Users className="w-4 h-4" /> Customers
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activeTab === 'analytics' && analyticsData ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* Revenue Chart */}
          <div className="card space-y-6 !p-4 sm:!p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold">Revenue Trends</h2>
                <p className="text-sm text-muted-foreground">Last 30 days performance</p>
              </div>
            </div>
            <div className="h-[400px] w-full">
              {analyticsData.revenueTrends?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.revenueTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(val) => format(new Date(val), 'MMM dd')}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                      dy={10}
                      interval={4}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                      tickFormatter={(val) => `₱${val.toLocaleString()}`}
                    />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-premium)', background: 'oklch(1 0 0 / 0.9)' }}
                      formatter={(value: any) => [`₱${Number(value).toLocaleString()}`, 'Revenue']}
                      labelFormatter={(label) => format(new Date(label), 'MMMM dd, yyyy')}
                    />
                    <Bar dataKey="revenue" fill="url(#colorRev)" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-3xl border border-dashed border-border/60">
                  <TrendingUp className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-base font-bold text-foreground/70">No Revenue Data Yet</p>
                  <p className="text-sm opacity-70 mt-1">Record your first sale to see your revenue trends.</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Products */}
            <div className="card space-y-6 !p-4 sm:!p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Package className="w-5 h-5" /></div>
                <h2 className="text-xl font-display font-bold">Top Performing Products</h2>
              </div>
              <div className="h-[300px]">
                {analyticsData.topProducts?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.topProducts} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-foreground)', fontWeight: 600 }} width={100} />
                      <RechartsTooltip 
                        cursor={{ fill: 'var(--color-muted)', opacity: 0.2 }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-premium)' }}
                        formatter={(value: any, name: any) => [name === 'revenue' ? `₱${Number(value).toLocaleString()}` : value, name === 'revenue' ? 'Revenue' : 'Units Sold']}
                      />
                      <Bar dataKey="revenue" fill="var(--color-blue-500, #3b82f6)" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-3xl border border-dashed border-border/60">
                    <Package className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-base font-bold text-foreground/70">No Products Sold</p>
                    <p className="text-sm opacity-70 mt-1">Your top products will appear here.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Customers */}
            <div className="card space-y-6 !p-4 sm:!p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent"><Users className="w-5 h-5" /></div>
                <h2 className="text-xl font-display font-bold">Top Customers</h2>
              </div>
              <div className="space-y-4">
                {analyticsData.topCustomers.map((customer: any, i: number) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-primary">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{customer.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{customer.email || 'No email'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-lg text-primary">₱{customer.total_spent.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Lifetime Value</p>
                    </div>
                  </div>
                ))}
                {analyticsData.topCustomers.length === 0 && (
                  <div className="py-10 text-center text-muted-foreground italic text-sm">No customer data available yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'customers' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-display font-bold">Customer Directory</h2>
            <button onClick={() => setShowAddCustomer(true)} className="btn-primary group !py-2">
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Add Customer
            </button>
          </div>

          <div className="card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    <th className="px-6 py-4">Customer Name</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Lifetime Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-white/40 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-bold text-sm">{customer.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {customer.address || 'No address provided'}
                        </div>
                      </td>
                      <td className="px-6 py-5 space-y-1">
                        <div className="text-sm flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" /> {customer.email || '-'}
                        </div>
                        <div className="text-sm flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" /> {customer.phone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> 
                          {format(new Date(customer.created_at), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="font-display font-bold text-primary">₱{(customer.total_spent || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                          {customer._count?.sales || 0} Transactions
                        </div>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-40">
                          <Users className="w-12 h-12" />
                          <p className="text-sm font-medium">No customers found. Start by adding one!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl border border-border animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold">New Customer</h2>
              <button onClick={() => setShowAddCustomer(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="input-field" 
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="input-field" 
                  placeholder="juan@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="input-field" 
                  placeholder="0912 345 6789"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Address</label>
                <textarea 
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="input-field min-h-[100px] resize-none" 
                  placeholder="123 Mabuhay St..."
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddCustomer(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
