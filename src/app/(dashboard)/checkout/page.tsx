'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Crown, 
  ShieldCheck, 
  ArrowLeft, 
  CreditCard, 
  Zap,
  Lock,
  Check,
  Smartphone,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'gcash' | 'card'>('gcash');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const plan = searchParams.get('plan') || 'pro';
  const isEnterprise = plan.toLowerCase() === 'enterprise';
  const price = isEnterprise ? 999 : 499;
  const planName = isEnterprise ? 'Enterprise' : 'PRO';

  // Card States
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (selectedMethod === 'gcash') {
        // Call backend to create PayMongo session
        const token = typeof window !== 'undefined' ? localStorage.getItem('tivaro_token') : null;
        
        const response = await fetch(`http://localhost:4000/api/payments/create-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ plan })
        });
        
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error('Server returned an invalid response (HTML instead of JSON).');
        }
        
        // Redirect to PayMongo hosted checkout page
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error(data.error || 'No checkout URL returned');
        }
      } else {
        // Card Payment (Subscription)
        const publicKey = process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY;
        const authHeader = 'Basic ' + btoa(publicKey + ':');

        // 1. Create Payment Method in PayMongo
        const paymongoResponse = await fetch('https://api.paymongo.com/v1/payment_methods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            data: {
              attributes: {
                type: 'card',
                details: {
                  card_number: cardNumber.replace(/\s/g, ''),
                  exp_month: parseInt(expMonth),
                  exp_year: parseInt(expYear),
                  cvc: cvc
                }
              }
            }
          })
        });

        const pmText = await paymongoResponse.text();
        let pmData;
        try {
          pmData = JSON.parse(pmText);
        } catch (e) {
          throw new Error('PayMongo returned an invalid response (HTML instead of JSON).');
        }
        
        if (pmData.errors) {
          toast.error(pmData.errors[0].detail);
          setLoading(false);
          return;
        }

        const paymentMethodId = pmData.data.id;

        const token = typeof window !== 'undefined' ? localStorage.getItem('tivaro_token') : null;

        // 2. Call backend to create subscription
        const backendResponse = await fetch(`http://localhost:4000/api/payments/create-subscription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ paymentMethodId })
        });

        const subText = await backendResponse.text();
        let subData;
        try {
          subData = JSON.parse(subText);
        } catch (e) {
          throw new Error('Server returned an invalid response (HTML instead of JSON).');
        }
        
        if (subData.error) {
          toast.error(subData.error);
          setLoading(false);
          return;
        }

        toast.success('Subscription created successfully!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/settings" className="text-xs font-black text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest mb-2">
            <ArrowLeft className="w-3 h-3" /> Back to Settings
          </Link>
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">Secure Checkout</h1>
          <p className="text-muted-foreground font-medium">Complete your subscription to unlock PRO features.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form (Left) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card !p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold">Select Payment Method</h2>
                <p className="text-xs text-muted-foreground">Choose how you want to pay.</p>
              </div>
            </div>

            {/* Payment Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GCash Option */}
              <div 
                onClick={() => setSelectedMethod('gcash')}
                className={cn(
                  "p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-40",
                  selectedMethod === 'gcash' 
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                    : "border-border/50 hover:border-primary/30 bg-white"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  {selectedMethod === 'gcash' && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">GCash e-Wallet</h3>
                  <p className="text-xs text-muted-foreground">Pay via GCash app (One-time)</p>
                </div>
              </div>

              {/* Card Option */}
              <div 
                onClick={() => setSelectedMethod('card')}
                className={cn(
                  "p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-40",
                  selectedMethod === 'card' 
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                    : "border-border/50 hover:border-primary/30 bg-white"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  {selectedMethod === 'card' && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Credit / Debit Card</h3>
                  <p className="text-xs text-muted-foreground">Auto-deduct (Recurring)</p>
                </div>
              </div>
            </div>

            {/* Card Form (Embedded) */}
            {selectedMethod === 'card' && (
              <div className="space-y-4 pt-2 border-t border-border/50">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Card Number</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1 col-span-1">
                    <label className="text-xs font-medium text-muted-foreground">Exp Month</label>
                    <input
                      type="text"
                      placeholder="MM"
                      value={expMonth}
                      onChange={(e) => setExpMonth(e.target.value)}
                      className="w-full p-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-xs font-medium text-muted-foreground">Exp Year</label>
                    <input
                      type="text"
                      placeholder="YYYY"
                      value={expYear}
                      onChange={(e) => setExpYear(e.target.value)}
                      className="w-full p-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-xs font-medium text-muted-foreground">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full p-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Info Message for GCash */}
            {selectedMethod === 'gcash' && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-700 leading-relaxed">
                <strong>Note:</strong> You will be redirected to our secure payment partner, PayMongo, to complete your GCash payment. This is a one-time payment.
              </div>
            )}

            <button 
              onClick={handlePayment}
              disabled={loading}
              className="btn-primary !py-4 w-full mt-4 flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <><Zap className="w-4 h-4" /> {selectedMethod === 'card' ? 'Subscribe Now' : 'Pay & Upgrade Now'}</>
              )}
            </button>
            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              🔒 Bank-grade 256-bit SSL secure payment
            </p>
          </div>
        </div>

        {/* Order Summary (Right) */}
        <div className="lg:col-span-1">
          <div className="card !p-8 space-y-6 bg-gradient-to-br from-white to-primary/5 border-2 border-primary/10 sticky top-24">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold">Order Summary</h2>
                <p className="text-xs text-muted-foreground">{planName} Subscription</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Plan</span>
                <span className="text-sm font-bold text-foreground">{planName} Plan</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Billing Cycle</span>
                <span className="text-sm font-bold text-foreground">Monthly</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                <span className="text-sm font-bold text-foreground">₱{price}.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Tax (VAT)</span>
                <span className="text-sm font-bold text-foreground">₱0.00</span>
              </div>
              
              <div className="border-t border-border/50 pt-4 flex justify-between items-center">
                <span className="text-lg font-display font-bold">Total Due</span>
                <span className="text-2xl font-display font-bold text-primary">₱{price}.00</span>
              </div>
            </div>

            {/* Features list reminder */}
            <div className="pt-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Included in {planName.toUpperCase()}:</p>
              <ul className="text-xs space-y-2 text-muted-foreground">
                {isEnterprise ? (
                  <>
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
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Custom Branding & Logo
                    </li>
                  </>
                ) : (
                  <>
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
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Up to 2 Staff Accounts
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Goal Tracker
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
