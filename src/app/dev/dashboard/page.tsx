'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { Users, DollarSign, Activity, MessageSquare, LogOut, Search, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, ComposedChart, Legend, PieChart, Pie, Cell } from 'recharts';
import { UserX, Bell, Megaphone, TrendingUp } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.tivaroapp.com/api';

export default function DevDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalRevenue: 0, activeSessions: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [planDist, setPlanDist] = useState<any[]>([]);
  const [atRiskUsers, setAtRiskUsers] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastType, setBroadcastType] = useState('INFO');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [ticketAnalytics, setTicketAnalytics] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [platformCounters, setPlatformCounters] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'tickets' | 'emailer'>('overview');
  const [expandedTickets, setExpandedTickets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageTickets, setCurrentPageTickets] = useState(1);
  const itemsPerPage = 5;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msgContent, setMsgContent] = useState('');
  const [userToMsg, setUserToMsg] = useState<any>(null);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImpersonate = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/dev/impersonate/${id}`);
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('tivaro_token', data.token);
        localStorage.setItem('tivaro_user', JSON.stringify(data.user));
        showToast('Impersonation successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        showToast(data.message || 'Failed to impersonate', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  };

  const handleSendMessage = async () => {
    if (!msgContent.trim() || !userToMsg) return;
    setSendingMsg(true);
    try {
      const response = await fetch(`${API_URL}/dev/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userToMsg.id, content: msgContent.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        showToast('Message sent successfully', 'success');
        setMsgContent('');
        setShowMsgModal(false);
        setUserToMsg(null);
      } else {
        showToast('Failed to send message', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailTo.trim() || !emailSubject.trim() || !emailContent.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setSendingEmail(true);
    try {
      const response = await fetch(API_URL + '/dev/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailTo, subject: emailSubject, content: emailContent })
      });
      const data = await response.json();
      if (data.success) {
        showToast(data.message);
        setEmailTo('');
        setEmailSubject('');
        setEmailContent('');
      } else {
        showToast(data.message || 'Failed to send email', 'error');
      }
    } catch (err) {
      showToast('Failed to send email', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  const toggleTicket = (id: string) => {
    setExpandedTickets(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const sortMessages = (msgs: any[]) => {
    const statusPriority: { [key: string]: number } = {
      'PENDING': 1,
      'READ': 2,
      'REVIEWING': 3,
      'REPLIED': 4,
      'RESOLVED': 5
    };
    
    return msgs.sort((a: any, b: any) => {
      const pA = statusPriority[a.status] || 99;
      const pB = statusPriority[b.status] || 99;
      if (pA !== pB) return pA - pB;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleReply = async (id: string) => {
    if (!replyContent.trim()) return;
    try {
      const response = await fetch(`${API_URL}/dev/messages/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: replyContent.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Reply sent successfully');
        setReplyContent('');
        setReplyingTo(null);
        // Refresh messages
        fetch(API_URL + '/dev/messages')
          .then(res => res.json())
          .then(data => {
            if (data.success) setMessages(sortMessages(data.messages));
          });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/dev/messages/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Ticket status updated to ${status}`);
        // Refresh messages
        fetch(API_URL + '/dev/messages')
          .then(res => res.json())
          .then(data => {
            if (data.success) setMessages(sortMessages(data.messages));
          });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTicket = (id: string) => {
    setTicketToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!ticketToDelete) return;
    try {
      const response = await fetch(`${API_URL}/dev/messages/${ticketToDelete}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        showToast('Ticket deleted successfully');
        setShowDeleteModal(false);
        setTicketToDelete(null);
        // Refresh messages
        fetch(API_URL + '/dev/messages')
          .then(res => res.json())
          .then(data => {
            if (data.success) setMessages(sortMessages(data.messages));
          });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch(API_URL + '/dev/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.data);
          setStats(data.stats || { totalUsers: 0, totalRevenue: 0, activeSessions: 0 });
        }
      })
      .catch(err => console.error(err));

    fetch(API_URL + '/dev/messages')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessages(sortMessages(data.messages));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Fetch revenue chart data
    fetch(API_URL + '/dev/revenue-chart')
      .then(res => res.json())
      .then(data => { if (data.success) setChartData(data.data); })
      .catch(err => console.error(err));

    // Fetch plan distribution
    fetch(API_URL + '/dev/plan-distribution')
      .then(res => res.json())
      .then(data => { if (data.success) setPlanDist(data.data); else setPlanDist([]); })
      .catch(err => { console.error(err); setPlanDist([]); });

    // Fetch at-risk users
    fetch(API_URL + '/dev/at-risk-users')
      .then(res => res.json())
      .then(data => { if (data.success) setAtRiskUsers(data.data); else setAtRiskUsers([]); })
      .catch(err => { console.error(err); setAtRiskUsers([]); });

    // Fetch activity feed
    fetch(API_URL + '/dev/activity-feed')
      .then(res => res.json())
      .then(data => { if (data.success) setActivityFeed(data.data); else setActivityFeed([]); })
      .catch(err => { console.error(err); setActivityFeed([]); });

    // Fetch ticket analytics
    fetch(API_URL + '/dev/ticket-analytics')
      .then(res => res.json())
      .then(data => { if (data.success) setTicketAnalytics(data.data); else setTicketAnalytics([]); })
      .catch(err => { console.error(err); setTicketAnalytics([]); });

    // Fetch top users
    fetch(API_URL + '/dev/top-users')
      .then(res => res.json())
      .then(data => { if (data.success) setTopUsers(data.data); else setTopUsers([]); })
      .catch(err => { console.error(err); setTopUsers([]); });

    // Fetch platform counters
    fetch(API_URL + '/dev/platform-counters')
      .then(res => res.json())
      .then(data => { if (data.success) setPlatformCounters(data.data); else setPlatformCounters({}); })
      .catch(err => { console.error(err); setPlatformCounters({}); });
  }, []);

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setShowUserDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const response = await fetch(`${API_URL}/dev/users/${userToDelete}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(user => user.id !== userToDelete));
        showToast('User deleted successfully');
        setShowUserDeleteModal(false);
        setUserToDelete(null);
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlanChange = async (id: string, newPlan: string) => {
    try {
      const response = await fetch(`${API_URL}/dev/users/${id}/plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: newPlan }),
      });
      const data = await response.json();
      if (data.success) {
        showToast('Plan updated successfully');
        // Update local state
        setUsers(users.map(user => user.id === id ? { ...user, plan: newPlan } : user));
        // Broadcast to all open tabs to refresh their session
        try {
          const channel = new BroadcastChannel('tivaro_session_sync');
          channel.postMessage({ type: 'PLAN_CHANGED', userId: id, plan: newPlan });
          channel.close();
        } catch {}
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update plan', 'error');
    }
  };

  const handleSuspend = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const response = await fetch(`${API_URL}/dev/users/${id}/suspend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_suspended: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        showToast(newStatus ? 'User suspended' : 'User unsuspended');
        // Update local state
        setUsers(users.map(user => user.id === id ? { ...user, is_suspended: newStatus } : user));
        // Broadcast to all open tabs to refresh their session
        try {
          const channel = new BroadcastChannel('tivaro_session_sync');
          channel.postMessage({ type: 'SUSPENDED_CHANGED', userId: id, is_suspended: newStatus });
          channel.close();
        } catch {}
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update suspension status', 'error');
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastTitle.trim() || !broadcastContent.trim()) {
      showToast('Please fill in title and message', 'error');
      return;
    }
    setSendingBroadcast(true);
    try {
      const response = await fetch(API_URL + '/dev/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: broadcastTitle, content: broadcastContent, type: broadcastType })
      });
      const data = await response.json();
      if (data.success) {
        showToast('Announcement sent to all users!');
        setBroadcastTitle('');
        setBroadcastContent('');
      } else {
        showToast(data.message || 'Failed to send', 'error');
      }
    } catch (err) {
      showToast('Failed to send announcement', 'error');
    } finally {
      setSendingBroadcast(false);
    }
  };

  const filteredUsers = users.filter(user => user.role === 'ADMIN' || !user.owner_id)
    .filter(user => 
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
  const totalPagesUsers = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPageUsers - 1) * itemsPerPage, currentPageUsers * itemsPerPage);

  const filteredTickets = messages
    .filter(msg => selectedStatus === 'ALL' || msg.status === selectedStatus);
    
  const totalPagesTickets = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice((currentPageTickets - 1) * itemsPerPage, currentPageTickets * itemsPerPage);



  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Sidebar / Header */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 p-1.5 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg">Tivaro Dev Dashboard</span>
        </div>
        <Link href="/dev/login" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
          <LogOut className="w-4 h-4" /> Logout
        </Link>
      </nav>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-700 pb-2 mb-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`text-sm font-semibold pb-2 px-1 transition-colors ${activeTab === 'overview' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'}`}
          >
            Dashboard Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`text-sm font-semibold pb-2 px-1 transition-colors ${activeTab === 'users' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'}`}
          >
            Users & Accounts
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`text-sm font-semibold pb-2 px-1 transition-colors ${activeTab === 'tickets' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'}`}
          >
            Support Tickets
          </button>
          <button 
            onClick={() => setActiveTab('emailer')}
            className={`text-sm font-semibold pb-2 px-1 transition-colors ${activeTab === 'emailer' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'}`}
          >
            Emailer
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Platform Counters (Analytics) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Total Products</span>
                <p className="text-xl font-bold">{platformCounters.totalProducts || 0}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Total Customers</span>
                <p className="text-xl font-bold">{platformCounters.totalCustomers || 0}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Total Sales</span>
                <p className="text-xl font-bold">{platformCounters.totalSales || 0}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Total Expenses</span>
                <p className="text-xl font-bold">{platformCounters.totalExpenses || 0}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Total Users</span>
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
            <p className="text-xs text-emerald-400">+12% this month</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold">₱{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-emerald-400">+8% this month</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Active Sessions</span>
              <Activity className="w-5 h-5 text-rose-400" />
            </div>
            <p className="text-3xl font-bold">{stats.activeSessions}</p>
            <p className="text-xs text-slate-400">Live now</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Revenue Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">Platform-wide revenue & new registrations — last 6 months</p>
            </div>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${v.toLocaleString()}`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={((value: any, name?: string) => [
                    name === 'revenue' ? `₱${Number(value).toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'New Users'
                  ]) as any}
                />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} formatter={(v) => v === 'revenue' ? 'Revenue' : 'New Users'} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revenueGrad)" dot={{ fill: '#10b981', r: 4 }} />
                <Bar yAxisId="right" dataKey="users" fill="#6366f1" opacity={0.7} radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-slate-500 text-sm">Loading chart data...</div>
          )}
        </div>

        {/* Row 2: Plan Distribution + Broadcast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Plan Distribution */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Plan Distribution</h2>
                <p className="text-xs text-slate-400 mt-0.5">Breakdown of user subscription plans</p>
              </div>
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            {planDist.length > 0 ? (
              <div className="flex items-center gap-6">
                {planDist.every((p: any) => p.value === 0) ? (
                  <div className="w-full h-40 flex flex-col items-center justify-center text-slate-500 text-sm gap-2">
                    <span className="text-3xl">📊</span>
                    <span>No registered users yet</span>
                  </div>
                ) : (
                  <>
                    <PieChart width={160} height={160}>
                      <Pie data={planDist.filter((p:any) => p.value > 0)} cx={75} cy={75} innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                        {planDist.filter((p:any) => p.value > 0).map((entry: any, i: number) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#f8fafc', fontSize: 12 }} />
                    </PieChart>
                    <div className="space-y-3 flex-1">
                      {planDist.map((p: any) => (
                        <div key={p.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                            <span className="text-sm text-slate-300">{p.name}</span>
                          </div>
                          <span className="text-sm font-bold">{p.value} <span className="text-xs text-slate-400">users</span></span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 text-sm">Loading...</div>
            )}
          </div>

          {/* Platform Broadcast */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Platform Broadcast</h2>
                <p className="text-xs text-slate-400 mt-0.5">Send an announcement to all users</p>
              </div>
              <Megaphone className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={broadcastType}
                  onChange={e => setBroadcastType(e.target.value)}
                  className="text-xs px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500"
                >
                  <option value="INFO">📢 Info</option>
                  <option value="WARNING">⚠️ Warning</option>
                  <option value="MAINTENANCE">🔧 Maintenance</option>
                </select>
                <input
                  type="text"
                  placeholder="Announcement title..."
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  className="flex-1 text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <textarea
                placeholder="Write your message here..."
                value={broadcastContent}
                onChange={e => setBroadcastContent(e.target.value)}
                rows={3}
                className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
              <button
                onClick={handleBroadcast}
                disabled={sendingBroadcast}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {sendingBroadcast ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Megaphone className="w-4 h-4" />
                )}
                {sendingBroadcast ? 'Sending...' : 'Send to All Users'}
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: At-Risk Users + Activity Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* At-Risk Users */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">At-Risk Users</h2>
                <p className="text-xs text-slate-400 mt-0.5">No login in 30+ days — potential churners</p>
              </div>
              <UserX className="w-5 h-5 text-rose-400" />
            </div>
            {atRiskUsers.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-slate-500 text-sm">🎉 No at-risk users!</div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {atRiskUsers.map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-xl">
                    <div>
                      <p className="text-sm font-medium">{u.name || 'No Name'}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.plan === 'PRO' ? 'bg-emerald-900 text-emerald-300' : u.plan === 'ENTERPRISE' ? 'bg-indigo-900 text-indigo-300' : 'bg-slate-600 text-slate-300'}`}>{u.plan}</span>
                      <p className="text-xs text-rose-400 mt-1">
                        {u.last_login_at ? `Last: ${new Date(u.last_login_at).toLocaleDateString()}` : 'Never logged in'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <p className="text-xs text-slate-400 mt-0.5">Latest sign-ups and ticket submissions</p>
              </div>
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            {activityFeed.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-slate-500 text-sm">No activity yet</div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activityFeed.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-700/50 p-3 rounded-xl">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${item.type === 'SIGNUP' ? 'bg-indigo-900' : 'bg-amber-900'}`}>
                      {item.type === 'SIGNUP' ? '👤' : '🎫'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 truncate">{item.label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-slate-500">{new Date(item.time).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        {item.plan && <span className={`text-xs px-1.5 py-0 rounded-full ${item.plan === 'PRO' ? 'bg-emerald-900 text-emerald-300' : item.plan === 'ENTERPRISE' ? 'bg-indigo-900 text-indigo-300' : 'bg-slate-600 text-slate-300'}`}>{item.plan}</span>}
                        {item.status && <span className="text-xs text-amber-400">{item.status}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

            {/* New Row 4: Ticket Analytics + Top Users */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ticket Analytics */}
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Ticket Status</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Breakdown of support tickets</p>
                  </div>
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                </div>
                {ticketAnalytics.length > 0 ? (
                  <div className="flex items-center gap-6">
                    <PieChart width={160} height={160}>
                      <Pie data={ticketAnalytics} cx={75} cy={75} innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                        {ticketAnalytics.map((entry: any, i: number) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#f8fafc', fontSize: 12 }} />
                    </PieChart>
                    <div className="space-y-3 flex-1">
                      {ticketAnalytics.map((p: any) => (
                        <div key={p.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                            <span className="text-sm text-slate-300">{p.name}</span>
                          </div>
                          <span className="text-sm font-bold">{p.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-slate-500 text-sm">No tickets yet</div>
                )}
              </div>

              {/* Top Users */}
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Top Businesses</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Top 5 users by revenue</p>
                  </div>
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                {topUsers.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-slate-500 text-sm">No sales data yet</div>
                ) : (
                  <div className="space-y-3">
                    {topUsers.map((u: any, i: number) => (
                      <div key={u.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-slate-500">#{i+1}</span>
                          <div>
                            <p className="text-sm font-medium">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.plan}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-emerald-400">₱{u.revenue.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="w-full">
            {/* Users Table */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Registered Users</h2>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search ID, Name, or Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-slate-500 w-full md:w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase text-slate-500 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-2 w-8"></th>
                    <th className="py-3 px-2">User ID</th>
                    <th className="py-3 px-2">Name</th>
                    <th className="py-3 px-2">Email</th>
                    <th className="py-3 px-2">Plan</th>
                    <th className="py-3 px-2">Role</th>
                    <th className="py-3 px-2">Joined</th>
                    <th className="py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <Fragment key={user.id}>
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-2">
                          {user.role === 'ADMIN' && (
                            <button onClick={() => toggleRow(user.id)} className="focus:outline-none">
                              {expandedRows.includes(user.id) ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-2 font-mono text-xs text-slate-400" title={user.id}>{user.id.substring(0, 8)}...</td>
                        <td className="py-3 px-2 font-medium">{user.name}</td>
                        <td className="py-3 px-2 text-slate-400">{user.email}</td>
                        <td className="py-3 px-2">
                          <select
                            value={user.plan}
                            onChange={(e) => handlePlanChange(user.id, e.target.value)}
                            className={`text-xs px-2 py-0.5 rounded-full border-none focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
                              user.plan === 'ENTERPRISE' ? 'bg-indigo-900 text-indigo-300' : 
                              user.plan === 'PRO' ? 'bg-emerald-900 text-emerald-300' : 
                              'bg-slate-700 text-slate-300'
                            }`}
                          >
                            <option value="FREE" className="bg-slate-800 text-slate-300">FREE</option>
                            <option value="PRO" className="bg-slate-800 text-emerald-300">PRO</option>
                            <option value="ENTERPRISE" className="bg-slate-800 text-indigo-300">ENTERPRISE</option>
                          </select>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'ADMIN' ? 'bg-blue-900 text-blue-300' : 'bg-slate-700 text-slate-300'}`}>
                              {user.role || 'STAFF'}
                            </span>
                            {user.is_suspended && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-900 text-red-300">
                                SUSPENDED
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-slate-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/S'}</td>
                        <td className="py-3 px-2">
                          <button 
                            onClick={() => handleImpersonate(user.id)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors mr-3"
                          >
                            Impersonate
                          </button>
                          <button 
                            onClick={() => { setUserToMsg(user); setShowMsgModal(true); }}
                            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors mr-3"
                          >
                            Message
                          </button>
                          <button 
                            onClick={() => handleSuspend(user.id, user.is_suspended)}
                            className={`text-xs ${user.is_suspended ? 'text-green-400 hover:text-green-300' : 'text-amber-400 hover:text-amber-300'} transition-colors mr-3`}
                          >
                            {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {/* Expanded Row */}
                      {expandedRows.includes(user.id) && user.role === 'ADMIN' && (
                        <tr className="bg-slate-800/50 border-b border-slate-700/50">
                          <td colSpan={7} className="py-3 px-6">
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-slate-500 uppercase">Staff List</p>
                              {users.filter(u => u.owner_id === user.id).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {users
                                    .filter(u => u.owner_id === user.id)
                                    .map(staff => (
                                      <div key={staff.id} className="bg-slate-700/50 p-2 rounded-lg flex items-center justify-between">
                                        <div>
                                          <p className="text-sm font-medium">{staff.name || 'No Name'}</p>
                                          <p className="text-xs text-slate-400">{staff.email}</p>
                                        </div>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-600 text-slate-300">
                                          STAFF
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-400">No staff accounts found for this admin.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls for Users */}
              {totalPagesUsers > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400">
                    Showing {(currentPageUsers - 1) * itemsPerPage + 1} to {Math.min(currentPageUsers * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPageUsers(prev => Math.max(prev - 1, 1))}
                      disabled={currentPageUsers === 1}
                      className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-slate-400">Page {currentPageUsers} of {totalPagesUsers}</span>
                    <button
                      onClick={() => setCurrentPageUsers(prev => Math.min(prev + 1, totalPagesUsers))}
                      disabled={currentPageUsers === totalPagesUsers}
                      className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Support Tickets</h2>
              <div className="flex items-center gap-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="text-xs px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 cursor-pointer"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="READ">Read</option>
                  <option value="REVIEWING">Reviewing</option>
                  <option value="REPLIED">Replied</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
                <MessageSquare className="w-5 h-5 text-slate-500" />
              </div>
            </div>
            <div className="space-y-4">
              {paginatedTickets.length > 0 ?
                paginatedTickets.map((msg) => (
                  <div key={msg.id} className="bg-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        msg.status === 'PENDING' ? 'bg-amber-900 text-amber-300' : 
                        msg.status === 'READ' ? 'bg-blue-900 text-blue-300' :
                        msg.status === 'REVIEWING' ? 'bg-purple-900 text-purple-300' :
                        msg.status === 'REPLIED' ? 'bg-indigo-900 text-indigo-300' :
                        'bg-green-900 text-green-300'
                      }`}>
                        {msg.status}
                      </span>
                      <div>
                        <p className="font-semibold text-sm">{msg.user?.name || msg.user?.email || 'Unknown User'}</p>
                        <p className="text-xs text-slate-500">Ticket #{msg.id.substring(0, 8)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500">
                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                      <Link 
                        href={`/dev/tickets/${msg.id}`}
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Ticket
                      </Link>
                      <button 
                        onClick={() => handleDeleteTicket(msg.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              : (
                <p className="text-sm text-slate-400 text-center py-4">No messages yet.</p>
              )}
              
              {/* Pagination Controls for Tickets */}
              {totalPagesTickets > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400">
                    Showing {(currentPageTickets - 1) * itemsPerPage + 1} to {Math.min(currentPageTickets * itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPageTickets(prev => Math.max(prev - 1, 1))}
                      disabled={currentPageTickets === 1}
                      className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-slate-400">Page {currentPageTickets} of {totalPagesTickets}</span>
                    <button
                      onClick={() => setCurrentPageTickets(prev => Math.min(prev + 1, totalPagesTickets))}
                      disabled={currentPageTickets === totalPagesTickets}
                      className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'emailer' && (
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Emailer (Send & Receive)</h2>
              <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-full">Custom System</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Inbox (Left Column) */}
              <div className="md:col-span-4 bg-slate-700/50 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Inbox</h3>
                  <span className="text-xs text-slate-400">{messages.filter(m => m.status === 'RECEIVED').length} Emails</span>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {messages.filter(m => m.status === 'RECEIVED').length > 0 ? (
                    messages.filter(m => m.status === 'RECEIVED').map((msg) => (
                      <div key={msg.id} className="bg-slate-800 p-3 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
                        <p className="text-sm font-medium truncate">{msg.user?.email || 'External Sender'}</p>
                        <p className="text-xs text-slate-300 truncate">{msg.content.substring(0, 30)}...</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(msg.created_at).toLocaleDateString()}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4">No emails received yet.</p>
                  )}
                </div>
              </div>

              {/* Compose (Right Column) */}
              <div className="md:col-span-8 bg-slate-700/50 p-4 rounded-xl space-y-4">
                <h3 className="text-sm font-semibold">Compose Email</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400">To:</label>
                    <input 
                      type="text" 
                      placeholder="email@example.com" 
                      value={emailTo}
                      onChange={e => setEmailTo(e.target.value)}
                      className="w-full text-sm px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Subject:</label>
                    <input 
                      type="text" 
                      placeholder="Enter subject" 
                      value={emailSubject}
                      onChange={e => setEmailSubject(e.target.value)}
                      className="w-full text-sm px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Message:</label>
                    <textarea 
                      placeholder="Write your email here..." 
                      rows={6}
                      value={emailContent}
                      onChange={e => setEmailContent(e.target.value)}
                      className="w-full text-sm px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                  <button 
                    onClick={handleSendEmail}
                    disabled={sendingEmail}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {sendingEmail ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                    {sendingEmail ? 'Sending...' : 'Send Email'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Send Message Modal */}
        {showMsgModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl max-w-md w-full mx-4 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-emerald-400">
                <MessageSquare className="w-6 h-6" />
                <h3 className="text-lg font-bold">Send Message to User</h3>
              </div>
              <p className="text-sm text-slate-300">
                Sending message to <span className="font-semibold text-white">{userToMsg?.name || userToMsg?.email}</span>
              </p>
              <textarea
                placeholder="Write your message here..."
                value={msgContent}
                onChange={e => setMsgContent(e.target.value)}
                rows={4}
                className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => { setShowMsgModal(false); setUserToMsg(null); setMsgContent(''); }}
                  className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={sendingMsg || !msgContent.trim()}
                  className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {sendingMsg ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  {sendingMsg ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl max-w-md w-full mx-4 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Delete Ticket</h3>
              </div>
              <p className="text-sm text-slate-300">
                Are you sure you want to delete this ticket? This action cannot be undone and will permanently remove it from the database.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => { setShowDeleteModal(false); setTicketToDelete(null); }}
                  className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Delete Confirmation Modal */}
        {showUserDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl max-w-md w-full mx-4 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Delete User</h3>
              </div>
              <p className="text-sm text-slate-300">
                Sigurado ka ba na gusto mong burahin ang user na ito? Ang aksyong ito ay hindi na mababawi.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => { setShowUserDeleteModal(false); setUserToDelete(null); }}
                  className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {notification && (
          <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-2xl z-50 transition-all ${
            notification.type === 'success' ? 'bg-emerald-900/90 border-emerald-700 text-emerald-200' : 'bg-red-900/90 border-red-700 text-red-200'
          }`}>
            {notification.type === 'success' ? (
              <Activity className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
