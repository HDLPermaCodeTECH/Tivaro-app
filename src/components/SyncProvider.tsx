'use client';

import { useEffect } from 'react';
import { db } from '@/lib/db';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleSync = async () => {
      if (!navigator.onLine) return;

      try {
        // Fetch all unsynced sales
        const salesToSync = await db.sales.filter(sale => !sale.synced).toArray();
        
        if (salesToSync.length === 0) return;

        toast.info(`Syncing ${salesToSync.length} offline sales...`);

        let successCount = 0;
        for (const sale of salesToSync) {
          try {
            // Prepare data for server (remove local fields)
            const serverData = {
              items: sale.items,
              total_amount: sale.total_amount,
              payment_status: 'PAID', // Default to PAID for offline sales for now
              // Add other fields if stored!
            };

            await api.sales.create(serverData);
            
            // Mark as synced in local DB
            await db.sales.update(sale.id, { synced: true });
            successCount++;
          } catch (error) {
            console.error('Failed to sync sale:', sale.id, error);
          }
        }

        if (successCount > 0) {
          toast.success(`Successfully synced ${successCount} sales!`);
        }
      } catch (error) {
        console.error('Sync error:', error);
      }
    };

    // Listen for online event
    window.addEventListener('online', handleSync);
    
    // Also try to sync on load if online
    if (navigator.onLine) {
      handleSync();
    }

    return () => {
      window.removeEventListener('online', handleSync);
    };
  }, []);

  return <>{children}</>;
}
