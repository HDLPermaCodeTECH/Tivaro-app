'use client';

import Link from 'next/link';
import { ArrowLeft, Download, FileSpreadsheet, Check, AlertTriangle, ArrowRight, Shield, Users, Lock, Wifi, Usb, Zap, BookOpen, LifeBuoy, CreditCard, Activity } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-8 h-8 object-contain" />
            <span className="font-display font-bold text-xl tracking-tight text-foreground">Tivaro Help Center</span>
          </Link>
          <Link href="/login" className="btn-primary !py-2 !px-4 text-sm shadow-lg shadow-primary/20">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Support</span>
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">How can we help you today?</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Find guides, tutorials, and support information all in one place.</p>
        </div>
      </section>

      {/* Content */}
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Section 1: Getting Started */}
          <div id="getting-started" className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-indigo-600">
              <Zap className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-foreground">Getting Started</h2>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              Welcome to Tivaro! Setting up your account is quick and easy. Follow these basic steps to get started:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-100 rounded-xl space-y-2">
                <h3 className="font-semibold text-foreground">1. Create Account</h3>
                <p className="text-sm text-muted-foreground">Sign up with your email and set up your business profile.</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl space-y-2">
                <h3 className="font-semibold text-foreground">2. Add Products</h3>
                <p className="text-sm text-muted-foreground">Add products manually or use our CSV import tool.</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl space-y-2">
                <h3 className="font-semibold text-foreground">3. Start Selling</h3>
                <p className="text-sm text-muted-foreground">Open the POS screen and start ringing up sales.</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl space-y-2">
                <h3 className="font-semibold text-foreground">4. Track Growth</h3>
                <p className="text-sm text-muted-foreground">View real-time analytics on your dashboard.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Guides & Tutorials */}
          <div id="guides" className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-12">
            <div className="flex items-center gap-3 text-indigo-600">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-foreground">Guides & Tutorials</h2>
            </div>

            {/* Guide A: CSV Import */}
            <div id="csv-import" className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">How to import inventory from a CSV file</h3>
              <p className="text-foreground/80 leading-relaxed text-sm">
                Importing your inventory via a CSV file is the fastest way to get your products into Tivaro.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <p className="text-sm font-semibold text-foreground">Steps:</p>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-foreground/80">
                  <li>Download the template.</li>
                  <li>Prepare your data (Name, Price, Stock).</li>
                  <li>Upload the file in the Inventory module.</li>
                </ol>
                <a 
                  href="/tivaro_inventory_template.csv" 
                  download="tivaro_inventory_template.csv"
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10 w-fit mt-2"
                >
                  <Download className="w-3.5 h-3.5" /> Download CSV Template
                </a>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Guide B: Staff Permissions */}
            <div id="staff-permissions" className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Setting up staff permissions and roles</h3>
              <p className="text-foreground/80 leading-relaxed text-sm">
                Control who has access to your business data.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <div className="flex gap-3">
                  <Shield className="w-4 h-4 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Administrator</p>
                    <p className="text-xs text-muted-foreground">Full access to all modules and settings.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Users className="w-4 h-4 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Staff / Cashier</p>
                    <p className="text-xs text-muted-foreground">Limited to POS and inventory viewing.</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Guide C: Barcode Scanner */}
            <div id="barcode-scanner" className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Connecting a barcode scanner to the POS</h3>
              <p className="text-foreground/80 leading-relaxed text-sm">
                Speed up your checkout process with a hardware scanner.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <p className="text-sm text-foreground/80"><span className="font-semibold text-foreground">USB Scanners:</span> Plug and play instantly.</p>
                <p className="text-sm text-foreground/80"><span className="font-semibold text-foreground">Bluetooth Scanners:</span> Pair in device settings first.</p>
                <p className="text-sm text-foreground/80">Just scan the item on the POS screen to add it to the cart.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Enterprise Support */}
          <div id="support" className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-indigo-600">
              <LifeBuoy className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-foreground">Enterprise Support</h2>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              Need direct help? Contact our support team through any of the following channels:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-slate-100 rounded-xl space-y-1">
                <p className="text-sm font-semibold text-foreground">Facebook Messenger</p>
                <p className="text-xs text-muted-foreground">m.me/tivaro.ph</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl space-y-1">
                <p className="text-sm font-semibold text-foreground">Email Support</p>
                <p className="text-xs text-muted-foreground">support@tivaro.shop</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl space-y-1">
                <p className="text-sm font-semibold text-foreground">Priority Phone</p>
                <p className="text-xs text-muted-foreground">+63 999 123 4567</p>
              </div>
            </div>
          </div>

          {/* Section 4: Security & Privacy */}
          <div id="security" className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-indigo-600">
              <Shield className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-foreground">Security & Privacy</h2>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              We take your data security seriously. All your business information is encrypted and stored securely. We comply with the Data Privacy Act of 2012 (RA 10173).
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-white text-center text-sm text-muted-foreground">
        <p>© 2026 Tivaro. All rights reserved.</p>
      </footer>
    </div>
  );
}
