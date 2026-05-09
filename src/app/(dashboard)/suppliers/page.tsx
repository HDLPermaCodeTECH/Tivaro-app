'use client';

import { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/api';
import { 
  Truck, 
  Plus, 
  Search, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  Pencil, 
  Trash2, 
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  });

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = api.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await api.suppliers.list();
      setSuppliers(data || []);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.plan !== 'FREE') {
      fetchSuppliers();
    }
  }, [user]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  if (user && user.plan === 'FREE') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-[32px] p-12 shadow-2xl shadow-black/5 max-w-xl w-full text-center space-y-8 border border-border/50">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 mb-6">
            <Truck className="w-12 h-12 text-primary-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Premium Expansion Module
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight">Unlock Supplier Management</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Take your business to the next level. Manage your relationships with product providers, track lead times, and optimize your supply chain all in one place.
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingSupplier) {
        await api.suppliers.update(editingSupplier.id, formData);
      } else {
        await api.suppliers.create(formData);
      }
      setIsModalOpen(false);
      setEditingSupplier(null);
      setFormData({ name: '', contact_person: '', email: '', phone: '', address: '' });
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    try {
      await api.suppliers.delete(id);
      fetchSuppliers();
    } catch (error) {
      alert('Failed to delete supplier. It might be linked to existing products.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading suppliers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
            <Truck className="w-3 h-3" />
            Supply Chain
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-foreground">Supplier Management</h1>
          <p className="text-muted-foreground font-medium">Manage your relationships with product providers.</p>
        </div>

        <button 
          onClick={() => {
            setEditingSupplier(null);
            setFormData({ name: '', contact_person: '', email: '', phone: '', address: '' });
            setIsModalOpen(true);
          }}
          className="btn-primary shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Add New Supplier
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-50" />
        <input
          type="text"
          placeholder="Search by supplier or contact person..."
          className="input-field !pl-12 !py-4 text-lg shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full card py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground/30 border-dashed border-2">
            <Truck className="w-16 h-16" />
            <p className="text-lg font-bold">No suppliers found.</p>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="card group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-transparent hover:border-primary/10 !p-4 sm:!p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Truck className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-foreground leading-tight">{supplier.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
                      <User className="w-3 h-3" />
                      {supplier.contact_person || 'No contact set'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(supplier)}
                    className="p-2 text-primary/70 hover:bg-primary/10 rounded-xl transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(supplier.id)}
                    className="p-2 text-destructive/70 hover:bg-destructive/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {supplier.phone && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/60"><Phone className="w-3.5 h-3.5" /></div>
                    {supplier.phone}
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/60"><Mail className="w-3.5 h-3.5" /></div>
                    {supplier.email}
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/60"><MapPin className="w-3.5 h-3.5" /></div>
                    <span className="truncate">{supplier.address}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  <Package className="w-3.5 h-3.5" />
                  Linked Products
                </div>
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                  {supplier._count?.products || 0} Products
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl glass rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 p-2 rounded-xl hover:bg-black/5 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold tracking-tight">
                  {editingSupplier ? 'Edit Supplier' : 'New Supplier'}
                </h2>
                <p className="text-muted-foreground font-medium">Add supplier details for your inventory tracking.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Supplier / Business Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field !py-4" 
                    placeholder="e.g. Acme Supplies Co."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Contact Person</label>
                  <input 
                    type="text" 
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="input-field !py-4" 
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field !py-4" 
                    placeholder="+63 9xx xxx xxxx"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field !py-4" 
                    placeholder="supplier@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Office Address</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field !py-4" 
                    placeholder="City, Province"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn-secondary !py-4"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-[2] btn-primary !py-4 shadow-xl shadow-primary/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    editingSupplier ? 'Save Changes' : 'Register Supplier'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
