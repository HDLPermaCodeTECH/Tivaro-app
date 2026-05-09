'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Search, Plus, Package, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Cart from '@/components/sales/Cart';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SalesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const cartItemsCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.products.list();
      setProducts(data?.filter((p: any) => p.quantity > 0) || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-160px)]">
      <div className="flex-1 space-y-6 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Sale / Benta</h1>
            <p className="text-muted-foreground">Select products to add to cart.</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name or barcode..."
            className="input-field !pl-12 py-3 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const product = products.find((p: any) => p.sku === searchTerm || p.sku === searchTerm.trim());
                if (product) {
                  addItem({
                    id: product.id,
                    name: product.name,
                    selling_price: Number(product.selling_price),
                    quantity: 1,
                    unit: product.unit
                  });
                  setSearchTerm(''); // Clear search
                  toast.success(`Added ${product.name} to cart!`);
                } else if (filteredProducts.length === 1) {
                  const p = filteredProducts[0];
                  addItem({
                    id: p.id,
                    name: p.name,
                    selling_price: Number(p.selling_price),
                    quantity: 1,
                    unit: p.unit
                  });
                  setSearchTerm('');
                  toast.success(`Added ${p.name} to cart!`);
                }
              }
            }}
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2 pb-8">
            {filteredProducts.map((product: any) => (
              <button
                key={product.id}
                onClick={() => addItem({
                  id: product.id,
                  name: product.name,
                  selling_price: Number(product.selling_price),
                  quantity: 1,
                  unit: product.unit
                })}
                className="card !p-0 text-left hover:border-primary/50 transition-all active:scale-95 flex flex-col justify-between h-full group overflow-hidden"
              >
                <div className="w-full h-48 sm:h-64 bg-muted/50 flex items-center justify-center border-b border-border/50">
                  {product.image_url ? (
                    <img src={product.image_url.startsWith('http') ? product.image_url : `http://127.0.0.1:4000${product.image_url}`} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <Package className="w-8 h-8 text-muted-foreground/30" />
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">{product.sku || 'No SKU'}</span>
                      <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold w-fit">
                        STOCK: {product.quantity}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-lg leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                  </div>
                  
                  <div className="mt-2 sm:mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">Price</p>
                      <p className="text-sm sm:text-xl font-black">₱{Number(product.selling_price).toLocaleString()}</p>
                    </div>
                    <div className="bg-primary text-white p-1.5 sm:p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                      <Plus className="w-4 h-4 sm:w-5 h-5" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {!loading && filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No products available or out of stock.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Cart Button for Mobile */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl z-50 flex items-center justify-center"
      >
        <ShoppingBag className="w-6 h-6" />
        {cartItemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {cartItemsCount}
          </span>
        )}
      </button>

      {/* Cart Drawer for Mobile / Sidebar for Desktop */}
      <div className={cn(
        "fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity lg:relative lg:inset-auto lg:bg-transparent lg:backdrop-blur-none",
        isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"
      )} onClick={() => setIsCartOpen(false)}>
        <div 
          className={cn(
            "fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out transform lg:relative lg:w-96 lg:max-w-none lg:shadow-none lg:translate-x-0 flex flex-col",
            isCartOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 h-full overflow-hidden">
            <Cart onClose={() => setIsCartOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}
