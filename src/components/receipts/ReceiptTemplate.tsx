'use client';

import { format } from 'date-fns';
import { MapPin, Phone, Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BASE_URL } from '@/lib/api';

interface ReceiptTemplateProps {
  sale: any;
  paperSize?: '58mm' | '80mm';
}

export const ReceiptTemplate = ({ sale, paperSize = '80mm' }: ReceiptTemplateProps) => {
  if (!sale) return null;

  const business = sale.user || {};
  const isUtang = sale.payment_status === 'UNPAID' || sale.payment_status === 'PARTIAL';
  const isFullyPaidUtang = sale.debt && sale.debt.status === 'PAID';
  const customerName = sale.customer?.name || sale.debt?.customer_name;
  
  const latestPayment = sale.debt?.payments?.[0]; // Sorted by desc in backend

  return (
    <div className={cn(
      "bg-white text-black font-mono mx-auto shadow-sm print:shadow-none print:p-0",
      paperSize === '58mm' ? 'w-[58mm] p-2' : 'w-[80mm] md:w-full p-4'
    )}>
      {/* Status Headers */}
      {isFullyPaidUtang ? (
        <div className="mb-6 border-4 border-emerald-600 p-2 text-center rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(5,150,105,1)] text-emerald-600">
          <h2 className="text-2xl font-black uppercase tracking-[0.2em]">PAID & SETTLED</h2>
          <p className="text-[10px] font-bold italic">Account Closed Successfully</p>
        </div>
      ) : isUtang ? (
        <div className="mb-6 border-4 border-black p-2 text-center rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase tracking-[0.2em]">
            {sale.payment_status === 'PARTIAL' ? 'PARTIAL PAYMENT' : 'UTANG / CREDIT'}
          </h2>
          <p className="text-[10px] font-bold italic">Accounts Receivable Entry</p>
        </div>
      ) : null}

      <div className="text-center space-y-1 mb-3 border-b-2 border-dashed border-black pb-2">
        {business.business_logo && (
          <div className="flex justify-center mb-4">
            <img 
              src={
                business.business_logo.startsWith('http://localhost:4000') 
                  ? business.business_logo.replace('http://localhost:4000', BASE_URL)
                  : business.business_logo.startsWith('http') 
                    ? business.business_logo 
                    : `${BASE_URL}${business.business_logo}`
              } 
              alt="Logo" 
              className="max-w-[150px] max-h-[60px] object-contain grayscale contrast-125" 
            />
          </div>
        )}
        <h1 className="text-2xl font-bold uppercase tracking-widest">
          {business.business_name || 'Tivaro'}
        </h1>
        {business.business_address && (
          <div className="flex items-center justify-center gap-1 text-[10px]">
            <MapPin className="w-2.5 h-2.5" />
            <span>{business.business_address}</span>
          </div>
        )}
        {business.business_phone && (
          <div className="flex items-center justify-center gap-1 text-[10px]">
            <Phone className="w-2.5 h-2.5" />
            <span>{business.business_phone}</span>
          </div>
        )}
      </div>

      <div className="space-y-0.5 text-xs mb-3">
        <div className="flex justify-between">
          <span>Receipt #:</span>
          <span className="font-bold">{sale.receipt?.id.substring(0, 8).toUpperCase() || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{format(new Date(sale.created_at), 'PPP')}</span>
        </div>
        <div className="flex justify-between border-b border-black/10 pb-1 mb-1">
          <span>Trans ID:</span>
          <span className="uppercase">{sale.id.substring(0, 8)}</span>
        </div>
        
        {customerName && (
          <div className="flex justify-between pt-1 text-sm font-black border-b border-black pb-1 mb-1">
            <span>Customer:</span>
            <span className="uppercase">{customerName}</span>
          </div>
        )}

        {sale.cashier && (
          <div className="flex justify-between pt-1">
            <span>{sale.cashier.role === 'ADMIN' ? 'Admin:' : 'Cashier:'}</span>
            <span className="font-bold uppercase tracking-tight">{sale.cashier.name || sale.cashier.email.split('@')[0]}</span>
          </div>
        )}
      </div>

      <div className="border-b-2 border-dashed border-black mb-2"></div>

      <table className="w-full text-xs mb-3">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left py-2 uppercase">Item</th>
            <th className="text-center py-2 uppercase">Qty</th>
            <th className="text-right py-2 uppercase">Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.items?.map((item: any) => (
            <tr key={item.id} className="border-b border-black/5">
              <td className="py-2">
                <div className="font-bold uppercase">{item.product?.name}</div>
                <div className="text-[10px] opacity-60">@ ₱{Number(item.price).toLocaleString()}</div>
              </td>
              <td className="text-center py-2">{item.quantity}</td>
              <td className="text-right py-2 font-bold">₱{(item.quantity * item.price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-b-2 border-dashed border-black mb-2"></div>

      {/* Financial Summary Section */}
      <div className="space-y-3">
        <div className="flex justify-between text-lg font-black">
          <span>GRAND TOTAL</span>
          <span>₱{Number(sale.total_amount).toLocaleString()}</span>
        </div>
        
        <div className="border-t border-black/10 pt-2 space-y-1">
          <div className="flex justify-between text-[10px] font-bold">
            <span>PAYMENT STATUS:</span>
            <span className={cn(
              "uppercase",
              isFullyPaidUtang ? "text-emerald-600 font-black" : isUtang ? "font-black" : ""
            )}>
              {isFullyPaidUtang ? 'FULLY PAID' : isUtang ? (sale.payment_status === 'PARTIAL' ? 'PARTIAL' : 'UTANG') : 'CASH'}
            </span>
          </div>

          {sale.debt && (
            <>
              <div className="flex justify-between text-xs">
                <span>TOTAL PAID:</span>
                <span className="font-black">₱{(sale.total_amount - (sale.debt.remaining_amount || 0)).toLocaleString()}</span>
              </div>
              
              {latestPayment && (
                <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase italic">
                  <span>{isFullyPaidUtang ? 'Settled On:' : 'Last Payment:'}</span>
                  <span>{format(new Date(latestPayment.date), 'MMM dd, yyyy • hh:mm a')}</span>
                </div>
              )}

              <div className={cn(
                "flex justify-between text-sm p-2 mt-2",
                sale.debt.remaining_amount > 0 ? "bg-black text-white" : "bg-emerald-100 text-emerald-800"
              )}>
                <span className="font-bold">BALANCE:</span>
                <span className="font-black text-lg">₱{Number(sale.debt.remaining_amount).toLocaleString()}</span>
              </div>
            </>
          )}
        </div>

        {isUtang && !isFullyPaidUtang && sale.debt?.due_date && (
          <div className="mt-4 p-3 border-2 border-black space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase">
              <Calendar className="w-3 h-3" /> Remainder: Due Date
            </div>
            <div className="text-sm font-black uppercase">
              {format(new Date(sale.debt.due_date), 'MMMM dd, yyyy')}
            </div>
          </div>
        )}

        {isFullyPaidUtang && (
          <div className="flex items-center gap-2 justify-center py-4 text-emerald-600 font-black uppercase text-xs border-y border-dashed border-emerald-200 mt-2">
            <CheckCircle2 className="w-4 h-4" /> Account Cleared & Closed
          </div>
        )}

        {/* Payment History with Cashier Info */}
        {sale.debt?.payments?.length > 0 && (
          <div className="mt-6 pt-4 border-t border-dashed border-black/20 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-center opacity-60">Payment History / Audit Trail</p>
            {sale.debt.payments.map((p: any) => (
              <div key={p.id} className="flex justify-between items-center text-[9px] font-medium italic">
                <div className="flex flex-col">
                    <span className="font-bold">₱{p.amount.toLocaleString()} — {format(new Date(p.date), 'MMM dd, yyyy')}</span>
                    <span className="text-[8px] opacity-60 tracking-tighter">{format(new Date(p.date), 'hh:mm a')}</span>
                </div>
                <span className="uppercase text-[8px] font-black bg-black/5 px-2 py-0.5 rounded">Rec. by: {p.cashier?.name || 'Admin'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-[10px] space-y-1 opacity-70 border-t-2 border-dashed border-black pt-2">
        <p className="font-bold italic uppercase">{business.receipt_footer || 'Salamat sa pagtangkilik!'}</p>
        <div className="pt-4 space-y-0.5 opacity-50">
          <p>This is an official system-generated receipt.</p>
          <p>Powered by Tivaro Business OS</p>
        </div>
      </div>
    </div>
  );
};
