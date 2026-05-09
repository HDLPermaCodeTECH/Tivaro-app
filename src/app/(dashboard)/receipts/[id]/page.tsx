'use client';

import { useEffect, useState, useRef, use } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Printer, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import { ReceiptTemplate } from '@/components/receipts/ReceiptTemplate';

export default function ReceiptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [sale, setSale] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paperSize, setPaperSize] = useState<'58mm' | '80mm'>('80mm');
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchSale = async () => {
      setLoading(true);
      try {
        const data = await api.receipts.get(resolvedParams.id);
        setSale(data);
      } catch (error) {
        console.error(error);
        router.push('/receipts');
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [resolvedParams.id, router]);

  if (loading) return <div className="p-8 text-center">Loading receipt...</div>;
  if (!sale) return <div className="p-8 text-center text-destructive">Receipt not found.</div>;

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-20">
      <div className="flex items-center justify-between print:hidden">
        <button 
          onClick={() => router.back()}
          className="btn-secondary py-2 px-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex gap-2 items-center">
          <select 
            value={paperSize} 
            onChange={(e) => setPaperSize(e.target.value as '58mm' | '80mm')}
            className="p-2 border border-border rounded-xl focus:outline-none focus:border-primary/50 text-sm bg-white"
          >
            <option value="80mm">80mm Size</option>
            <option value="58mm">58mm Size</option>
          </select>
          <button onClick={() => handlePrint()} className="btn-primary py-2 px-4">
            <Printer className="w-4 h-4" />
            Print Resibo
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mb-8 print:hidden">
        <div className="bg-green-500/10 p-3 rounded-full">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black">Transaction Successful!</h1>
          <p className="text-muted-foreground">Receipt # {sale.receipt?.id.substring(0, 8).toUpperCase()}</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-2 border-primary/20 shadow-2xl print:shadow-none print:border-none print:!p-0 print:!m-0">
        <ReceiptTemplate sale={sale} paperSize={paperSize} />
      </div>

      <div className="text-center print:hidden">
        <p className="text-sm text-muted-foreground">
          You can print this for thermal printers (80mm / 58mm) or save as PDF.
        </p>
      </div>
    </div>
  );
}
