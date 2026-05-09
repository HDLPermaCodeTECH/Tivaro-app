'use client';

import Link from 'next/link';
import { ArrowLeft, Check, ClipboardList, Mail, MessageSquare, Shield, Zap, ArrowRight } from 'lucide-react';

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-8 h-8 object-contain" />
            <span className="font-display font-bold text-xl tracking-tight text-foreground">Tivaro Invoices</span>
          </Link>
          <Link href="/login" className="btn-primary !py-2 !px-4 text-sm shadow-lg shadow-primary/20">
            Try It Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Coming Soon</span>
            <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">
              Stop Buying Expensive Thermal Paper.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Create, send, and track professional digital invoices in seconds. Send directly to your customers via SMS or Messenger.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="btn-primary !py-3 !px-6 text-sm shadow-lg shadow-primary/20">
                Join Waitlist
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100 to-violet-100 opacity-30 blur-2xl rounded-3xl" />
            <img src="/invoices_hero.png" alt="Invoices Hero" className="relative w-full h-auto rounded-3xl shadow-2xl border border-slate-100" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-display font-medium text-foreground tracking-tight">Key Features</h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">Everything you need to manage your business billing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/10">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Instant Invoicing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Generate professional invoices with one click after a sale. No manual typing required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/10">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Digital Delivery</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Send directly to customers via SMS or Messenger. Save on paper and printing costs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/10">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Payment Tracking</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Know exactly who has paid and who is pending. Automated reminders for overdue bills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-display font-medium text-white tracking-tight">Why Choose Tivaro Invoices?</h2>
            <p className="text-indigo-200 text-sm max-w-2xl mx-auto">Built specifically for MSMEs in the Philippines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="flex gap-4">
              <Check className="w-6 h-6 text-indigo-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white">Eco-Friendly</h4>
                <p className="text-sm text-slate-400 mt-1">Go paperless and save trees while saving money on thermal rolls.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Check className="w-6 h-6 text-indigo-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white">BIR Compliant Ready</h4>
                <p className="text-sm text-slate-400 mt-1">Designed with standard Philippine billing requirements in mind.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Check className="w-6 h-6 text-indigo-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white">Faster Payments</h4>
                <p className="text-sm text-slate-400 mt-1">Customers pay faster when they receive a clean, digital receipt on their phone.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Check className="w-6 h-6 text-indigo-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white">Brand Customization</h4>
                <p className="text-sm text-slate-400 mt-1">Add your logo and brand colors to every invoice you send.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-white text-center text-sm text-muted-foreground">
        <p>© 2026 Tivaro. All rights reserved.</p>
      </footer>
    </div>
  );
}
