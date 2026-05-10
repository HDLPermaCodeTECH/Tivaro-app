'use client';

import { useEffect, useState, Suspense } from 'react';
import { api, BASE_URL } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit2,
  AlertTriangle,
  ArrowUpDown,
  Truck,
  Package,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import ProductModal from '@/components/inventory/ProductModal';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function InventoryContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const session = api.auth.getSession();
    if (session?.user.role === 'STAFF') {
      router.push('/dashboard');
      return;
    }
    setUser(session?.user);
    fetchProducts();
    if (searchParams.get('add') === 'true' && session?.user.role === 'ADMIN') {
      setModalOpen(true);
    }
  }, [searchParams, router]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.products.list();
      setProducts(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').map(row => row.split(','));
      
      const headers = rows[0].map(h => h.trim());
      const dataRows = rows.slice(1);

      let successCount = 0;
      let failCount = 0;

      toast.loading('Importing products...');

      for (const row of dataRows) {
        if (row.length < headers.length) continue;

        const product: any = {};
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          if (header === 'Product Name') product.name = value;
          if (header === 'SKU') product.sku = value;
          if (header === 'Price') product.selling_price = parseFloat(value);
          if (header === 'Stock Quantity') product.quantity = parseInt(value);
        });

        if (!product.name || isNaN(product.selling_price)) {
          failCount++;
          continue;
        }

        try {
          await api.products.create({
            name: product.name,
            sku: product.sku || '',
            selling_price: product.selling_price,
            quantity: product.quantity || 0,
            cost_price: 0,
            unit: 'pcs',
          });
          successCount++;
        } catch (error) {
          console.error('Failed to import product:', product.name, error);
          failCount++;
        }
      }

      toast.dismiss();
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} products!`);
      }
      if (failCount > 0) {
        toast.error(`Failed to import ${failCount} products. Check format.`);
      }
      fetchProducts();
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
            <Package className="w-3 h-3" />
            Stock Control
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">Inventory System</h1>
          <p className="text-muted-foreground font-medium">Manage your products, monitor stock levels, and assign suppliers.</p>
        </div>

        {user?.role === 'ADMIN' && (
          <div className="flex gap-3">
            <label className="btn-secondary shadow-xl cursor-pointer flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Import CSV
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleImportCsv}
              />
            </label>
            <button 
              onClick={() => {
                setSelectedProduct(null);
                setModalOpen(true);
              }}
              className="btn-primary shadow-xl shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-50" />
        <input
          type="text"
          placeholder="Search products by name, SKU, or supplier..."
          className="input-field !pl-12 !py-4 text-lg shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredProducts.map((product) => {
          const isLowStock = product.quantity <= product.low_stock_threshold;
          return (
            <div key={product.id} className="card p-4 flex flex-col gap-4 border-2 border-primary/5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden flex-shrink-0 border border-border/50 flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url.startsWith('http') ? product.image_url : `${BASE_URL}${product.image_url}`} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-5 h-5 text-muted-foreground/50" />
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="font-bold text-foreground text-base">{product.name}</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                    SKU: {product.sku || '---'}
                  </span>
                </div>
                {user?.role === 'ADMIN' && (
                  <button 
                    onClick={() => {
                      setSelectedProduct(product);
                      setModalOpen(true);
                    }}
                    className="p-3 bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-2xl transition-all active:scale-95"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border/50">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Supplier</p>
                  {product.supplier ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Truck className="w-3.5 h-3.5 text-primary/60" />
                      {product.supplier.name}
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase italic">Unassigned</span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 text-center">Stock Level</p>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
                      isLowStock ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-600"
                    )}>
                      {product.quantity} {product.unit}
                    </div>
                    {isLowStock && (
                      <div className="flex items-center gap-1 text-[8px] font-black text-destructive uppercase tracking-tighter animate-pulse">
                        <AlertTriangle className="w-2.5 h-2.5" /> Reorder Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Selling Price</p>
                  <span className="font-black text-lg text-foreground">₱{Number(product.selling_price).toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Cost Price</p>
                  <span className="text-sm font-bold text-muted-foreground">₱{Number(product.cost_price).toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
        {!loading && filteredProducts.length === 0 && (
          <div className="py-12 text-center card">
            <div className="flex flex-col items-center gap-4 opacity-30">
              <Package className="w-12 h-12" />
              <p className="text-lg font-display font-bold uppercase tracking-widest">No products found</p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block card !p-0 overflow-hidden border-2 border-primary/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Product Information</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Supplier</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Stock Level</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Selling Price</th>
                {user?.role === 'ADMIN' && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredProducts.map((product) => {
                const isLowStock = product.quantity <= product.low_stock_threshold;
                return (
                  <tr key={product.id} className="group hover:bg-primary/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0 border border-border/50 flex items-center justify-center">
                          {product.image_url ? (
                            <img src={product.image_url.startsWith('http') ? product.image_url : `${BASE_URL}${product.image_url}`} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-muted-foreground/50" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-base group-hover:text-primary transition-colors">{product.name}</span>
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                            SKU: {product.sku || '---'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {product.supplier ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Truck className="w-3.5 h-3.5 text-primary/60" />
                          {product.supplier.name}
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
                          isLowStock ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-600"
                        )}>
                          {product.quantity} {product.unit}
                        </div>
                        {isLowStock && (
                          <div className="flex items-center gap-1 text-[8px] font-black text-destructive uppercase tracking-tighter animate-pulse">
                            <AlertTriangle className="w-2.5 h-2.5" /> Reorder Soon
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex flex-col">
                        <span className="font-black text-lg text-foreground">₱{Number(product.selling_price).toLocaleString()}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Cost: ₱{Number(product.cost_price).toLocaleString()}</span>
                      </div>
                    </td>
                    {user?.role === 'ADMIN' && (
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => {
                            setSelectedProduct(product);
                            setModalOpen(true);
                          }}
                          className="p-3 bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-2xl transition-all active:scale-95"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Package className="w-16 h-16" />
                      <p className="text-xl font-display font-bold uppercase tracking-widest">No products found</p>
                    </div>
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Refreshing Inventory...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={fetchProducts}
        product={selectedProduct}
      />
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center uppercase font-black text-muted-foreground tracking-widest animate-pulse">Initializing Inventory System...</div>}>
      <InventoryContent />
    </Suspense>
  );
}
