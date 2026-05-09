'use client';

import { useCartStore } from '@/store/useCartStore';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  CheckCircle2, 
  User, 
  Calendar, 
  Banknote, 
  CreditCard,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CartProps {
  onClose?: () => void;
}

export default function Cart({ onClose }: CartProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'PAID' | 'UNPAID'>('PAID');
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [manualCustomerName, setManualCustomerName] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('amount');
  const router = useRouter();

  useEffect(() => {
    if (paymentMode === 'UNPAID') {
      fetchCustomers();
    }
  }, [paymentMode]);

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const data = await api.customers.list();
      setCustomers(data || []);
    } catch (error) {
      console.error('Failed to load customers');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    // Validation for Utang
    if (paymentMode === 'UNPAID') {
      if (!selectedCustomerId && !manualCustomerName) {
        toast.error('Please select or enter a customer name for Utang');
        return;
      }
    }

    setIsProcessing(true);
    try {
      const subtotal = getTotal();
      const calculatedDiscount = discountType === 'percent' ? (subtotal * (discount / 100)) : discount;

      if (calculatedDiscount > subtotal) {
        toast.error('Discount cannot be greater than the total amount');
        setIsProcessing(false);
        return;
      }

      const saleData = {
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.selling_price
        })),
        total_amount: subtotal - calculatedDiscount,
        payment_status: paymentMode,
        customer_id: selectedCustomerId || undefined,
        customer_name: manualCustomerName || undefined,
        due_date: dueDate || undefined,
      };

      const result = await api.sales.create(saleData);

      toast.success(paymentMode === 'PAID' ? 'Sale completed!' : 'Debt recorded successfully!');
      clearCart();
      router.push(`/receipts/${result.id}`);
    } catch (error: any) {
      toast.error(`Checkout Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border border-border/50 rounded-[1.5rem] h-full flex flex-col space-y-6 !p-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary"><ShoppingCart className="w-5 h-5" /></div>
          <h2 className="text-xl font-display font-bold">Checkout Order</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearCart} className="text-[10px] font-black text-destructive uppercase tracking-widest hover:underline">
            Clear All
          </button>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-muted rounded-full ml-2">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
          <div className="bg-primary/5 p-6 rounded-[2rem] border-2 border-dashed border-primary/20">
            <ShoppingCart className="w-12 h-12 text-primary opacity-30" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-bold text-2xl tracking-tight">Cart is empty</h3>
            <p className="text-sm text-muted-foreground font-medium">Add products to begin a new transaction.</p>
          </div>
        </div>
      ) : (
        <>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 p-3 bg-muted/30 rounded-2xl group border border-transparent hover:border-primary/10 transition-all">
            <div className="flex-1 overflow-hidden">
              <div className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{item.name}</div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">₱{item.selling_price.toLocaleString()} • {item.unit}</div>
            </div>
            
            <div className="flex items-center gap-1 bg-white/50 p-0.5 rounded-xl border border-border/50">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-black w-4 text-center text-xs">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="text-right min-w-[70px]">
              <div className="font-black text-sm text-foreground">₱{(item.selling_price * item.quantity).toLocaleString()}</div>
            </div>
            
            <button 
              onClick={() => removeItem(item.id)}
              className="p-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-border/50 space-y-6">
        {/* Payment Mode Selector */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Payment Mode</h4>
          </div>
          <div className="grid grid-cols-2 gap-1 bg-muted/30 p-1 rounded-xl border border-border/50">
            <button 
              type="button"
              onClick={() => setPaymentMode('PAID')}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all",
                paymentMode === 'PAID' ? "bg-white text-emerald-600 shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Banknote className="w-4 h-4" /> PAID
            </button>
            <button 
              type="button"
              onClick={() => setPaymentMode('UNPAID')}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all",
                paymentMode === 'UNPAID' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CreditCard className="w-4 h-4" /> UTANG
            </button>
          </div>
        </div>

        {/* Utang Details */}
        {paymentMode === 'UNPAID' && (
          <div className="space-y-4 p-5 bg-muted/30 rounded-xl border border-border/50 animate-in zoom-in-95 duration-300">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" /> Select Debtor / Customer
              </label>
              <select 
                className="w-full bg-white border-none rounded-lg text-xs font-bold py-2.5 px-3 shadow-sm focus:ring-2 focus:ring-primary/20"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option value="">-- Choose Existing Customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Plus className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
                <input 
                  type="text" 
                  placeholder="Or enter new name..."
                  className="w-full pl-9 pr-3 py-2.5 bg-white border-none rounded-lg text-xs font-bold shadow-sm focus:ring-2 focus:ring-primary/20"
                  value={manualCustomerName}
                  onChange={(e) => setManualCustomerName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Due Date
              </label>
              <input 
                type="date" 
                className="w-full bg-white border-none rounded-lg text-xs font-bold py-2.5 px-3 shadow-sm focus:ring-2 focus:ring-primary/20"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Subtotal</span>
            <span className="text-sm font-bold text-foreground">₱{getTotal().toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Discount</span>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={discount || ''}
                onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                className="w-20 text-right bg-muted/30 border-none rounded-lg text-xs font-bold py-1.5 px-2 focus:ring-2 focus:ring-primary/20"
                placeholder="0"
              />
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'amount' | 'percent')}
                className="bg-muted/30 border-none rounded-lg text-xs font-bold py-1.5 px-2 focus:ring-2 focus:ring-primary/20"
              >
                <option value="amount">₱</option>
                <option value="percent">%</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total to collect</span>
            <span className="text-3xl font-display font-bold text-foreground tracking-tighter">
              ₱{(getTotal() - (discountType === 'percent' ? (getTotal() * (discount / 100)) : discount)).toLocaleString()}
            </span>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={isProcessing}
            className={cn(
              "w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-sm",
              paymentMode === 'PAID' 
                ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {paymentMode === 'PAID' ? 'COMPLETE SETTLEMENT' : 'COMMIT TO LEDGER'}
              </>
            )}
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
