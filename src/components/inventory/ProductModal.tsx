'use client';

import { useState, useEffect } from 'react';
import { X, Save, Trash2, Truck, ImageIcon } from 'lucide-react';
import { api, BASE_URL } from '@/lib/api';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  product?: any;
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: 0,
    unit: 'pcs',
    cost_price: 0,
    selling_price: 0,
    low_stock_threshold: 5,
    supplier_id: '',
    image_url: '',
  });
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSuppliers();
    }
  }, [isOpen]);

  const fetchSuppliers = async () => {
    try {
      const data = await api.suppliers.list();
      setSuppliers(data || []);
    } catch (error) {
      console.error('Failed to fetch suppliers');
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        quantity: product.quantity || 0,
        unit: product.unit || 'pcs',
        cost_price: product.cost_price || 0,
        selling_price: product.selling_price || 0,
        low_stock_threshold: product.low_stock_threshold || 5,
        supplier_id: product.supplier_id || '',
        image_url: product.image_url || '',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        quantity: 0,
        unit: 'pcs',
        cost_price: 0,
        selling_price: 0,
        low_stock_threshold: 5,
        supplier_id: '',
        image_url: '',
      });
    }
  }, [product, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL('image/jpeg', 0.7);
        setFormData({ ...formData, image_url: base64 });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('sku', formData.sku);
      formDataToSend.append('quantity', String(formData.quantity));
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('cost_price', String(formData.cost_price));
      formDataToSend.append('selling_price', String(formData.selling_price));
      formDataToSend.append('low_stock_threshold', String(formData.low_stock_threshold));
      if (formData.supplier_id) {
        formDataToSend.append('supplier_id', formData.supplier_id);
      }
      
      if (formData.image_url) {
        formDataToSend.append('image_url', formData.image_url);
      }

      if (product?.id) {
        await api.products.update(product.id, formDataToSend);
      } else {
        await api.products.create(formDataToSend);
      }
      onSave();
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      await api.products.delete(product.id);
      onSave();
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-md border border-border/50 rounded-2xl w-full max-w-lg space-y-6 relative max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-sm">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-muted-foreground hover:bg-black/5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-display font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-xs text-muted-foreground">Fill in the details for your inventory item.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Product Name *</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Coca Cola 1.5L"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Product Image</label>
            <div className="relative border-2 border-dashed border-border/60 rounded-2xl p-4 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-muted/10 h-40 overflow-hidden">
              {formData.image_url ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={formData.image_url.startsWith('http') || formData.image_url.startsWith('data:') ? formData.image_url : `${BASE_URL}${formData.image_url}`} 
                    alt="Preview" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <button 
                    type="button"
                    onClick={() => { setFormData({ ...formData, image_url: '' }); }}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full hover:bg-destructive/90 shadow-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary mb-2">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-foreground">Click to upload photo</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Recommended: Square, Auto-resized</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SKU / Barcode</label>
              <input
                type="text"
                className="input-field"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Unit</label>
              <input
                type="text"
                className="input-field"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="pcs, kg, pack"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Truck className="w-3 h-3" /> Supplier
            </label>
            <select
              className="input-field appearance-none"
              value={formData.supplier_id}
              onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
            >
              <option value="">No Supplier Assigned</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Initial Stock</label>
              <input
                type="number"
                required
                className="input-field"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Low Stock Alert</label>
              <input
                type="number"
                required
                className="input-field"
                value={formData.low_stock_threshold}
                onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cost Price (₱)</label>
              <input
                type="number"
                step="0.01"
                required
                className="input-field"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Selling Price (₱)</label>
              <input
                type="number"
                step="0.01"
                required
                className="input-field"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {product && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-4 text-destructive bg-destructive/5 hover:bg-destructive/10 border border-destructive/10 rounded-2xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 !py-3 sm:!py-4 shadow-sm"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
