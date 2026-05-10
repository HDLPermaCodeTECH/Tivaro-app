'use client';

import { useEffect, useState, useRef } from 'react';
import { api, BASE_URL } from '@/lib/api';
import { 
  Settings as SettingsIcon, 
  UserPlus, 
  Users, 
  AlertCircle, 
  Trash2, 
  Pencil, 
  X, 
  ShieldCheck, 
  Store, 
  MapPin, 
  Phone, 
  MessageSquare,
  Upload,
  Image as ImageIcon,
  Loader2,
  Crown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin Profile & Branding States
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [receiptFooter, setReceiptFooter] = useState('');
  const [businessLogo, setBusinessLogo] = useState('');
  
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Staff States
  const [staffEmail, setStaffEmail] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffError, setStaffError] = useState('');
  const [staffSuccess, setStaffSuccess] = useState('');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account', icon: SettingsIcon },
    { id: 'branding', label: 'Branding', icon: ShieldCheck },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'plans', label: 'Plans', icon: Crown },
  ];

  const fetchStaff = async () => {
    try {
      const data = await api.auth.getStaff();
      setStaffList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const session = api.auth.getSession();
    if (!session || session.user.role === 'STAFF') {
      router.push('/dashboard');
    } else {
      setUser(session.user);
      setAdminName(session.user.name || '');
      setAdminEmail(session.user.email || '');
      setBusinessName(session.user.business_name || '');
      setBusinessAddress(session.user.business_address || '');
      setBusinessPhone(session.user.business_phone || '');
      setReceiptFooter(session.user.receipt_footer || '');
      setBusinessLogo(session.user.business_logo || '');
      fetchStaff();
    }
    setLoading(false);
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');
    try {
      const res = await api.auth.updateProfile({ 
        name: adminName, 
        email: adminEmail, 
        password: adminPassword || undefined,
        business_name: businessName,
        business_address: businessAddress,
        business_phone: businessPhone,
        receipt_footer: receiptFooter
      });
      localStorage.setItem('tivaro_user', JSON.stringify(res));
      setUser(res);
      setAdminSuccess('Profile & Branding updated successfully!');
      setAdminPassword('');
    } catch (err: any) {
      setAdminError(err.message || 'Failed to update profile.');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setAdminError('');
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const res = await api.auth.uploadLogo(formData);
      
      const updatedUser = { ...user, business_logo: res.business_logo };
      localStorage.setItem('tivaro_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setBusinessLogo(res.business_logo);
      setAdminSuccess('Logo uploaded successfully!');
    } catch (err: any) {
      setAdminError(err.message || 'Failed to upload logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError('');
    setStaffSuccess('');

    // Enforce staff limit based on plan
    const limit = user?.plan === 'FREE' ? 1 : user?.plan === 'PRO' ? 2 : 999;
    if (staffList.length >= limit) {
      setStaffError(`You have reached the limit of ${limit} staff account(s) for your ${user?.plan} plan. Please upgrade to add more.`);
      return;
    }

    try {
      await api.auth.createStaff({ email: staffEmail, password: staffPassword, name: staffName });
      setStaffSuccess('Staff account created successfully!');
      setStaffEmail('');
      setStaffName('');
      setStaffPassword('');
      fetchStaff();
    } catch (err: any) {
      setStaffError(err.message || 'Failed to create staff account.');
    }
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError('');
    setStaffSuccess('');
    try {
      await api.auth.updateStaff(editingStaff.id, { 
        email: editingStaff.email, 
        name: editingStaff.name,
        password: editingStaff.password || undefined 
      });
      setStaffSuccess('Staff account updated successfully!');
      setEditingStaff(null);
      fetchStaff();
    } catch (err: any) {
      setStaffError(err.message || 'Failed to update staff account.');
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff account?')) return;
    try {
      await api.auth.deleteStaff(id);
      fetchStaff();
    } catch (err: any) {
      alert(err.message || 'Failed to delete staff account');
    }
  };

  if (loading || !user) return <div className="p-10">Loading...</div>;

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
          <SettingsIcon className="w-3 h-3" />
          System Settings
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-foreground">Control Center</h1>
        <p className="text-muted-foreground font-medium">Manage your admin profile, business branding, and team access.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap lg:w-full lg:justify-start",
                  activeTab === tab.id
                    ? "bg-white text-foreground shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/30"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary" : "text-muted-foreground")} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'plans' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600"><Crown className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-xl font-display font-bold">Subscription Plans</h2>
                  <p className="text-xs text-muted-foreground">Choose the plan that fits your business scale.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* FREE PLAN */}
                <div className={cn(
                  "card !p-6 flex flex-col justify-between border-2 relative overflow-hidden",
                  user?.plan === 'FREE' ? "border-primary shadow-lg" : "border-border/50"
                )}>
                  {user?.plan === 'FREE' && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg">
                      Current Plan
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold">Starter / Free</h3>
                      <p className="text-xs text-muted-foreground">Perfect for getting started.</p>
                    </div>
                    <div className="text-3xl font-display font-bold">₱0 <span className="text-xs text-muted-foreground font-medium">/ free</span></div>
                    <ul className="text-xs space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Basic Sales & Inventory
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" /> 1 Staff Account
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <X className="w-3.5 h-3.5 text-muted-foreground" /> Customers / CRM
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <X className="w-3.5 h-3.5 text-muted-foreground" /> Debt Tracker
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <X className="w-3.5 h-3.5 text-muted-foreground" /> Suppliers Management
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <X className="w-3.5 h-3.5 text-muted-foreground" /> Goal Tracker
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <X className="w-3.5 h-3.5 text-muted-foreground" /> Advanced Analytics
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <X className="w-3.5 h-3.5 text-muted-foreground" /> Custom Branding
                      </li>
                    </ul>
                  </div>
                  <button 
                    className={cn(
                      "w-full py-2.5 text-xs font-black uppercase tracking-widest rounded-xl mt-6 transition-all",
                      user?.plan === 'FREE' ? "bg-muted text-muted-foreground cursor-not-allowed" : "btn-secondary"
                    )}
                    disabled={user?.plan === 'FREE'}
                  >
                    {user?.plan === 'FREE' ? 'Active Plan' : 'Downgrade'}
                  </button>
                </div>

                {/* PRO PLAN */}
                <div className={cn(
                  "card !p-6 flex flex-col justify-between border-2 relative overflow-hidden",
                  user?.plan === 'PRO' ? "border-primary shadow-lg" : "border-primary/30"
                )}>
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg">
                    Recommended
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        Pro Tier <Crown className="w-4 h-4 text-primary" />
                      </h3>
                      <p className="text-xs text-muted-foreground">For growing businesses.</p>
                    </div>
                    <div className="text-3xl font-display font-bold text-primary">₱499 <span className="text-xs text-muted-foreground font-medium">/ month</span></div>
                    <ul className="text-xs space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Basic Sales & Inventory
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Customers / CRM
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Debt Tracker
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Suppliers Management
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Up to 2 Staff Accounts
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Goal Tracker
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <X className="w-3.5 h-3.5 text-muted-foreground" /> Advanced Analytics
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <X className="w-3.5 h-3.5 text-muted-foreground" /> Unlimited Staff Accounts
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <X className="w-3.5 h-3.5 text-muted-foreground" /> Custom Branding
                      </li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => {
                      if (user?.plan === 'FREE') {
                        router.push('/checkout?plan=pro');
                      }
                    }}
                    className={cn(
                      "w-full py-2.5 text-xs font-black uppercase tracking-widest rounded-xl mt-6 transition-all flex items-center justify-center gap-2",
                      user?.plan !== 'FREE' ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                    )}
                    disabled={user?.plan !== 'FREE'}
                  >
                    {user?.plan === 'PRO' ? 'Active Plan' : user?.plan === 'ENTERPRISE' ? 'Included' : <><Crown className="w-3.5 h-3.5" /> Upgrade to PRO</>}
                  </button>
                </div>

                {/* ENTERPRISE PLAN */}
                <div className={cn(
                  "card !p-6 flex flex-col justify-between border-2 relative overflow-hidden",
                  user?.plan === 'ENTERPRISE' ? "border-amber-500 shadow-lg" : "border-amber-500/50"
                )}>
                  <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg">
                    Best Value
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">Enterprise Tier</h3>
                        <Crown className="w-4 h-4 text-amber-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">For multi-branch chains.</p>
                    </div>
                    <div className="text-3xl font-display font-bold text-amber-600">₱999 <span className="text-xs text-muted-foreground font-medium">/ month</span></div>
                    <ul className="text-xs space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Basic Sales & Inventory
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Customers / CRM
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Debt Tracker
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Suppliers Management
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Goal Tracker
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Advanced Analytics (P&L)
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Unlimited Staff Accounts
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Custom Branding
                      </li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => {
                      if (user?.plan !== 'ENTERPRISE') {
                        router.push('/checkout?plan=enterprise');
                      }
                    }}
                    className={cn(
                      "w-full py-2.5 text-xs font-black uppercase tracking-widest rounded-xl mt-6 transition-all flex items-center justify-center gap-2",
                      user?.plan === 'ENTERPRISE' ? "bg-muted text-muted-foreground cursor-not-allowed" : "btn-secondary"
                    )}
                    disabled={user?.plan === 'ENTERPRISE'}
                  >
                    {user?.plan === 'ENTERPRISE' ? 'Active Plan' : 'Upgrade to Enterprise'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="animate-in fade-in-50 duration-300">
              <div className="bg-white/70 backdrop-blur-md border border-border/50 rounded-xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 max-w-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <SettingsIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-display font-bold">Personal Account</h2>
                    <p className="text-xs text-muted-foreground">Manage your credentials.</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {adminError && !adminSuccess && (
                    <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> {adminError}
                    </div>
                  )}
                  {adminSuccess && !adminError && (
                    <div className="p-3 bg-green-500/10 text-green-600 text-sm rounded-xl border border-green-500/20 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> {adminSuccess}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="input-field" 
                      placeholder="e.g. Juan Dela Cruz"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Login Email</label>
                    <input 
                      type="email" 
                      value={adminEmail}
                      disabled
                      className="input-field bg-muted/50 text-muted-foreground cursor-not-allowed" 
                      placeholder="admin@tivaro.com"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">To change your login email, please contact customer service.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">New Password</label>
                    <input 
                      type="password" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="input-field" 
                      placeholder="••••••••"
                    />
                  </div>
                  <button type="submit" className="w-full btn-secondary !py-3 mt-2">
                    Update Account
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="animate-in fade-in-50 duration-300">
              <div className="bg-white/70 backdrop-blur-md border border-border/50 rounded-xl p-4 sm:p-6 shadow-sm relative overflow-hidden space-y-4 sm:space-y-6 max-w-xl">
                {user?.plan !== 'ENTERPRISE' && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-600 mb-4">
                      <Crown className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">Custom Branding</h3>
                    <p className="text-xs text-muted-foreground font-medium mb-6 leading-relaxed">
                      Upgrade to Enterprise Plan to upload your business logo and customize the receipt footer.
                    </p>
                    <button 
                      type="button"
                      onClick={() => {
                          alert('Upgrade to Enterprise feature is coming soon!');
                      }}
                      className="btn-primary !py-3 !text-xs font-black uppercase tracking-widest bg-amber-600 hover:bg-amber-700 border-none shadow-lg shadow-amber-500/20"
                    >
                      Upgrade to Enterprise
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><ShieldCheck className="w-5 h-5" /></div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-display font-bold">Branding</h2>
                    <p className="text-xs text-muted-foreground">Business identity.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Store Logo</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden group">
                      {businessLogo ? (
                        <img 
                          src={
                            businessLogo.startsWith('http://localhost:4000') 
                              ? businessLogo.replace('http://localhost:4000', BASE_URL)
                              : businessLogo.startsWith('http') 
                                ? businessLogo 
                                : `${BASE_URL}${businessLogo}`
                          } 
                          alt="Business Logo" 
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                      )}
                      {uploadingLogo && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold"
                      >
                        <Upload className="w-4 h-4 mb-1" />
                        CHANGE
                      </button>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest">Logo Requirements</p>
                      <p className="text-[10px] text-muted-foreground">PNG, JPG or WebP. Max 2MB.</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest mt-2 block"
                      >
                        Select File
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4 pt-2">
                  {adminError && !adminSuccess && (
                    <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> {adminError}
                    </div>
                  )}
                  {adminSuccess && !adminError && (
                    <div className="p-3 bg-green-500/10 text-green-600 text-sm rounded-xl border border-green-500/20 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> {adminSuccess}
                    </div>
                  )}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      <Store className="w-3 h-3" /> Receipt Details
                    </h3>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Business Name</label>
                      <input 
                        type="text" 
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="input-field" 
                        placeholder="e.g. Tivaro Coffee Shop"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Business Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="text" 
                          value={businessAddress}
                          onChange={(e) => setBusinessAddress(e.target.value)}
                          className="input-field !pl-10" 
                          placeholder="123 Business St, Manila"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Business Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="text" 
                          value={businessPhone}
                          onChange={(e) => setBusinessPhone(e.target.value)}
                          className="input-field !pl-10" 
                          placeholder="+63 912 345 6789"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Receipt Footer Note</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="text" 
                          value={receiptFooter}
                          onChange={(e) => setReceiptFooter(e.target.value)}
                          className="input-field !pl-10" 
                          placeholder="Thank you for your purchase!"
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full btn-primary !py-3 sm:!py-4 mt-2 shadow-xl shadow-primary/20">
                    Save Branding
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-8 animate-in fade-in-50 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Staff Form */}
                <div className="bg-white/70 backdrop-blur-md border border-border/50 rounded-xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg text-accent"><UserPlus className="w-5 h-5" /></div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-display font-bold">Add Cashier</h2>
                      <p className="text-xs text-muted-foreground">Create staff access.</p>
                    </div>
                  </div>

                  <form onSubmit={handleCreateStaff} className="space-y-4 pt-4">
                    {staffError && (
                      <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {staffError}
                      </div>
                    )}
                    {staffSuccess && (
                      <div className="p-3 bg-green-500/10 text-green-600 text-sm rounded-xl border border-green-500/20 flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> {staffSuccess}
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Staff Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        className="input-field" 
                        placeholder="Juan Dela Cruz"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Staff Email</label>
                      <input 
                        type="email" 
                        required
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                        className="input-field" 
                        placeholder="cashier@tivaro.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Password</label>
                      <input 
                        type="password" 
                        required
                        minLength={6}
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        className="input-field" 
                        placeholder="••••••••"
                      />
                    </div>

                    <button type="submit" className="w-full btn-secondary !py-3 sm:!py-4 mt-2">
                      <UserPlus className="w-4 h-4" /> Create Staff Account
                    </button>
                  </form>
                </div>

                {/* Staff List */}
                <div className="bg-white/70 backdrop-blur-md border border-border/50 rounded-xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg text-muted-foreground"><Users className="w-5 h-5" /></div>
                    <div>
                      <h2 className="text-xl font-display font-bold">Active Staff</h2>
                      <p className="text-xs text-muted-foreground">Manage existing users.</p>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    {staffList.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-border rounded-2xl bg-muted/10">
                        <Users className="w-8 h-8 mx-auto text-muted-foreground opacity-50 mb-3" />
                        <p className="text-xs text-muted-foreground">No staff created yet.</p>
                      </div>
                    ) : (
                      staffList.map((staff) => (
                        <div key={staff.id} className="p-4 bg-white/40 border border-border rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                              {staff.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-sm font-bold truncate">{staff.name || staff.email}</div>
                              <div className="flex flex-col">
                                <div className="text-[9px] text-muted-foreground uppercase font-black truncate">{staff.email}</div>
                                {staff.last_login_at && (
                                    <div className="text-[9px] font-bold text-emerald-600 uppercase flex items-center gap-1 mt-0.5">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                        Last login: {format(new Date(staff.last_login_at), 'MMM dd • hh:mm a')}
                                    </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button 
                              onClick={() => setEditingStaff({ ...staff, password: '' })}
                              className="p-2 text-primary/70 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteStaff(staff.id)}
                              className="p-2 text-destructive/70 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setEditingStaff(null)} />
          <div className="relative w-full max-w-md glass rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setEditingStaff(null)}
              className="absolute top-6 right-6 p-2 rounded-xl hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleUpdateStaff} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold tracking-tight">Edit Cashier</h2>
                <p className="text-sm text-muted-foreground">Update staff information.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Staff Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={editingStaff.name || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Staff Email</label>
                  <input 
                    type="email" 
                    required
                    value={editingStaff.email || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">New Password (optional)</label>
                  <input 
                    type="password" 
                    value={editingStaff.password || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, password: e.target.value })}
                    className="input-field" 
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>

              <button type="submit" className="w-full btn-primary !py-4">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
