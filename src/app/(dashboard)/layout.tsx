'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  History, 
  Settings, 
  LogOut,
  Menu,
  X,
  Plus,
  TrendingUp,
  ClipboardList,
  Truck,
  Users,
  BarChart3,
  Crown,
  MessageSquare,
  Headset,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ShiftSummaryModal from '@/components/modals/ShiftSummaryModal';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Sales / Benta', href: '/sales', icon: ShoppingCart },
  { name: 'Finance / Kita', href: '/finance', icon: TrendingUp },
  { name: 'History / Resibo', href: '/receipts', icon: History },
  { name: 'Reports / Shift', href: '/reports', icon: ClipboardList },
  { name: 'Suppliers', href: '/suppliers', icon: Truck, isPro: true },
  { name: 'Debt Tracker', href: '/debts', icon: ClipboardList, isPro: true },
  { name: 'Customers / CRM', href: '/crm', icon: Users, isPro: true },
  { name: 'Advanced Analytics', href: '/analytics', icon: BarChart3, isPro: true },
  { name: 'Support / Help', href: '/contact', icon: MessageSquare },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSupportOpen, setSupportOpen] = useState(false);
  const [supportContent, setSupportContent] = useState('');
  const [sendingSupport, setSendingSupport] = useState(false);
  const [announcement, setAnnouncement] = useState<any>(null);
  const [announcementDismissed, setAnnouncementDismissed] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('tivaro_announcement_dismissed') : null
  );
  const router = useRouter();
  const pathname = usePathname();

  const handleSendSupport = async () => {
    if (!supportContent.trim() || !user) return;
    setSendingSupport(true);
    try {
      const response = await fetch('http://localhost:4000/api/dev/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          content: supportContent.trim(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Message sent successfully!');
        setSupportContent('');
        setSupportOpen(false);
      } else {
        toast.error('Failed to send message.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred.');
    } finally {
      setSendingSupport(false);
    }
  };

  useEffect(() => {
    const session = api.auth.getSession();
    if (!session) {
      router.push('/login');
    } else {
      setUser(session.user);
    }

    const handleUserUpdate = () => {
      const updatedSession = api.auth.getSession();
      if (updatedSession) {
        setUser(updatedSession.user);
      }
    };
    window.addEventListener('user_updated', handleUserUpdate);

    // Poll server every 30s to keep session fresh (plan, suspension, etc.)
    const syncInterval = setInterval(async () => {
      try {
        const data = await api.auth.getMe();
        if (data?.user) {
          localStorage.setItem('tivaro_user', JSON.stringify(data.user));
          setUser(data.user);
        }
      } catch {
        // If 401 or 403 — api.ts auto-logout handles it
      }
    }, 30000);

    // Instant sync when dev dashboard changes plan or suspension
    const refreshSession = async () => {
      try {
        const data = await api.auth.getMe();
        if (data?.user) {
          localStorage.setItem('tivaro_user', JSON.stringify(data.user));
          setUser(data.user);
        }
      } catch {}
    };
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('tivaro_session_sync');
      broadcastChannel.onmessage = () => refreshSession();
    } catch {}

    return () => {
      window.removeEventListener('user_updated', handleUserUpdate);
      clearInterval(syncInterval);
      broadcastChannel?.close();
    };
  }, [router]);

  const handleLogout = async () => {
    if (user?.role === 'STAFF') {
      setShowShiftModal(true);
    } else {
      confirmLogout();
    }
  };

  const confirmLogout = () => {
    api.auth.logout();
    router.push('/login');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center font-display font-black text-primary animate-pulse tracking-widest uppercase">Initializing Tivaro System...</div>;

  const isPro = user.plan === 'PRO';

  // Fetch latest announcement on load
  const fetchAnnouncement = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/announcements/latest');
      const data = await res.json();
      if (data.success && data.announcement) setAnnouncement(data.announcement);
    } catch {}
  };
  if (typeof window !== 'undefined' && !announcement) fetchAnnouncement();

  return (
    <div className="flex min-h-screen bg-background/50 overflow-hidden flex-col">
      {/* Announcement Banner */}
      {announcement && announcementDismissed !== announcement.id && (
        <div className={`w-full px-4 py-2.5 flex items-center justify-between text-sm font-medium z-[70] print:hidden ${
          announcement.type === 'WARNING' ? 'bg-amber-500 text-amber-950' :
          announcement.type === 'MAINTENANCE' ? 'bg-red-600 text-white' :
          'bg-indigo-600 text-white'
        }`}>
          <span className="flex-1 text-center">
            {announcement.type === 'WARNING' ? '⚠️' : announcement.type === 'MAINTENANCE' ? '🔧' : '📢'}{' '}
            <strong>{announcement.title}:</strong> {announcement.content}
          </span>
          <button onClick={() => {
            setAnnouncementDismissed(announcement.id);
            if (typeof window !== 'undefined') {
              localStorage.setItem('tivaro_announcement_dismissed', announcement.id);
            }
          }} className="ml-4 opacity-70 hover:opacity-100 text-lg leading-none">×</button>
        </div>
      )}
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-border/50 fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-[60] print:hidden">
        <div className="flex items-center gap-3">
          <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-lg tracking-tight text-foreground">Tivaro</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)} 
          className="p-2 bg-white rounded-lg border border-border shadow-sm active:scale-95 transition-all"
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </header>

      {/* Sidebar - Fixed Area */}
      <div className="flex flex-1 overflow-hidden">
        <aside className={cn(
        "fixed inset-0 z-50 md:sticky md:top-0 md:h-screen md:w-[320px] transition-all duration-300 ease-in-out print:hidden shrink-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="relative h-full w-[260px] md:w-full bg-white md:glass md:border-r border-border/50 p-4 md:p-8 flex flex-col gap-5">
          {/* Logo Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-12 h-12 object-contain" />
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl tracking-tight text-foreground leading-none">Tivaro</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Enterprise</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-muted-foreground">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
            <div className="px-4 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Operations</div>
            {navItems.map((item) => {
              if (user?.role === 'STAFF' && (item.name === 'Finance / Kita' || item.name === 'Inventory' || item.name === 'Reports / Shift')) return null;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 relative shrink-0",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" 
                      : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  <span className="font-semibold tracking-tight text-sm flex items-center gap-2">
                    {item.name}
                    {item.isPro && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                  </span>
                  {isActive && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary-foreground/50 animate-pulse" />
                  )}
                </Link>
              );
            })}


          </nav>

            {/* Fixed Bottom Section (Steady) */}
            <div className="space-y-3 pt-4 border-t border-border/40 mt-auto shrink-0">
              
              {/* Upgrade to PRO Card */}
              {user?.role === 'ADMIN' && user?.plan === 'FREE' && (
                <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl space-y-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500/20 rounded-lg text-amber-600">
                      <Crown className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Unlock Pro Tier</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                    Get access to Advanced Analytics, CRM, Suppliers, and unlimited staff accounts.
                  </p>
                  <Link 
                    href="/settings"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center justify-center w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-amber-500/10"
                  >
                    Upgrade Now
                  </Link>
                </div>
              )}

              {user?.role === 'ADMIN' && (
              <Link
                href="/settings"
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 relative",
                  pathname === '/settings'
                    ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-[1.02]" 
                    : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
                )}
              >
                <Settings className={cn("w-5 h-5 transition-transform group-hover:scale-110", pathname === '/settings' ? "text-primary-foreground" : "text-muted-foreground")} />
                <span className="font-semibold tracking-tight text-sm">System Settings</span>
                {pathname === '/settings' && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary-foreground/50 animate-pulse" />
                )}
              </Link>
            )}

            <div className="p-2.5 bg-white/40 border border-white/60 rounded-2xl flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-display font-bold text-sm shadow-lg shrink-0">
                {(user.name || user.email)?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-bold truncate text-foreground leading-tight">{user.name || user.email?.split('@')[0]}</div>
                <div className="text-[9px] font-bold text-primary uppercase tracking-[0.1em] mt-0.5 flex items-center gap-1">
                  {user.role === 'STAFF' ? 'STAFF' : user.plan === 'ENTERPRISE' ? <><Crown className="w-2 h-2 text-amber-500" /> ENTERPRISE</> : user.plan === 'PRO' ? <><Crown className="w-2 h-2 text-amber-500" /> PRO TIER</> : 'FREE PLAN'}
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 w-full transition-all group bg-destructive/5 border border-destructive/10"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-bold tracking-tight text-xs uppercase tracking-widest">Logout System</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 h-screen overflow-y-auto scroll-smooth pt-20 md:pt-0">
        <div className="p-6 md:p-12 max-w-[1600px] mx-auto w-full transition-all">
          {children}
        </div>
      </main>
    </div>

      <ShiftSummaryModal 
        isOpen={showShiftModal}
        onClose={() => setShowShiftModal(false)}
        onConfirm={confirmLogout}
      />

      {/* Floating Support Widget */}
      <div className="fixed bottom-6 right-6 z-[100] print:hidden">
        <button 
          onClick={() => setSupportOpen(!isSupportOpen)}
          className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 transition-all active:scale-95 border-2 border-white/30"
        >
          <Headset className="w-8 h-8" />
        </button>

        {isSupportOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎧</span>
                <h3 className="font-bold text-slate-800">Support & Feedback</h3>
              </div>
              <button onClick={() => setSupportOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              placeholder="Type your message here..."
              value={supportContent}
              onChange={(e) => setSupportContent(e.target.value)}
              className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 min-h-[100px] text-slate-800"
            />
            <button 
              onClick={handleSendSupport}
              disabled={sendingSupport || !supportContent.trim()}
              className="btn-primary w-full !py-2 text-sm flex items-center justify-center gap-2"
            >
              {sendingSupport ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        )}
      </div>
    </div>

  );
}
