'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Check, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const upgradeUser = async () => {
      try {
        // Upgrade the user in the database
        const res = await api.auth.upgrade();
        // Update local storage
        if (res.user) {
          localStorage.setItem('tivaro_user', JSON.stringify(res.user));
        }
      } catch (error) {
        console.error('Failed to upgrade user:', error);
      } finally {
        setLoading(false);
      }
    };

    upgradeUser();
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="card max-w-md w-full !p-8 flex flex-col items-center space-y-6 border-2 border-emerald-500/20 shadow-xl shadow-emerald-500/5">
        
        {loading ? (
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-medium">Verifying payment and upgrading your account...</p>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 animate-in zoom-in duration-500">
              <Check className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest">
                <Crown className="w-4 h-4" /> Welcome to PRO Tier
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground">Payment Successful!</h1>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                Thank you for upgrading! Your account has been successfully upgraded to the PRO Plan. All premium features are now unlocked.
              </p>
            </div>

            <div className="w-full pt-4">
              <Link 
                href="/settings" 
                onClick={() => {
                  // Force reload to update sidebar and state
                  setTimeout(() => window.location.reload(), 100);
                }}
                className="btn-primary !py-3.5 w-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                Go to Control Center <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
