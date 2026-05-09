'use client';

import Link from 'next/link';
import { ArrowLeft, Download, FileSpreadsheet, Check, AlertTriangle, ArrowRight, Shield, Users, Lock, Wifi, Usb } from 'lucide-react';

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/help" className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-8 h-8 object-contain" />
            <span className="font-display font-bold text-xl tracking-tight text-foreground">Help Center</span>
          </Link>
          <Link href="/login" className="btn-primary !py-2 !px-4 text-sm shadow-lg shadow-primary/20">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Article Content */}
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Knowledge Base</span>
            <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">Guides & Tutorials</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to know about setting up and using Tivaro Business OS.</p>
          </div>

          {/* Guide 1: CSV Import */}
          <div id="csv-import" className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-indigo-600 uppercase">Inventory</span>
              <h2 className="text-3xl font-display font-bold text-foreground">How to import inventory from a CSV file</h2>
              <p className="text-sm text-muted-foreground">Last updated: May 9, 2026</p>
            </div>

            <p className="text-foreground/80 leading-relaxed">
              Importing your inventory via a CSV (Comma-Separated Values) file is the fastest way to get your products into Tivaro Business OS. This guide will walk you through the process of preparing your file and uploading it to the system.
            </p>

            <hr className="border-slate-100" />

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Step 1: Download the Template</h3>
              <p className="text-foreground/80 leading-relaxed">
                To ensure your data is processed correctly, we highly recommend using our standard CSV template. It contains the exact column headers our system expects.
              </p>
              <a 
                href="/tivaro_inventory_template.csv" 
                download="tivaro_inventory_template.csv"
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10 w-fit"
              >
                <Download className="w-4 h-4" /> Download CSV Template
              </a>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Step 2: Prepare Your Data</h3>
              <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80"><span className="font-semibold text-foreground">Product Name:</span> Required. The name of the item.</p>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80"><span className="font-semibold text-foreground">SKU:</span> Optional but recommended. Unique identifier for stock tracking.</p>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80"><span className="font-semibold text-foreground">Price:</span> Required. Must be a number without currency symbols (e.g., 150.00).</p>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80"><span className="font-semibold text-foreground">Stock Quantity:</span> Required. The current number of items in stock.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Step 3: Upload the File</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/80">
                <li>Log in to your Tivaro Dashboard.</li>
                <li>Navigate to the <span className="font-semibold">Inventory</span> module.</li>
                <li>Click on the <span className="font-semibold">Import</span> button at the top right.</li>
                <li>Drag and drop your file or click to browse.</li>
                <li>Review the mapping and click <span className="font-semibold">Confirm Import</span>.</li>
              </ol>
            </section>
          </div>

          {/* Guide 2: Staff Permissions */}
          <div id="staff-permissions" className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-indigo-600 uppercase">Team Management</span>
              <h2 className="text-3xl font-display font-bold text-foreground">Setting up staff permissions and roles</h2>
              <p className="text-sm text-muted-foreground">Last updated: May 9, 2026</p>
            </div>

            <p className="text-foreground/80 leading-relaxed">
              Managing who has access to your business data is crucial for security and operational efficiency. This guide explains how to add staff members and configure their roles in Tivaro Business OS.
            </p>

            <hr className="border-slate-100" />

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Understanding Default Roles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-6 border border-slate-100 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Shield className="w-5 h-5" />
                    <h3 className="font-semibold text-foreground">Administrator</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Full access to all modules, financial reports, settings, and staff management.</p>
                </div>
                <div className="p-6 border border-slate-100 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Users className="w-5 h-5" />
                    <h3 className="font-semibold text-foreground">Staff / Cashier</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Access limited to POS checkout, adding customers, and viewing inventory. Cannot see cost prices or financial reports.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">How to Add a Staff Member</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/80">
                <li>Navigate to <span className="font-semibold">Settings</span> in your dashboard.</li>
                <li>Click on the <span className="font-semibold">Staff Management</span> tab.</li>
                <li>Click the <span className="font-semibold">Add Staff</span> button.</li>
                <li>Enter their full name, email address, and desired password.</li>
                <li>Select their role (Staff or Admin) and click <span className="font-semibold">Save</span>.</li>
              </ol>
            </section>
          </div>

          {/* Guide 3: Barcode Scanner */}
          <div id="barcode-scanner" className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-indigo-600 uppercase">Hardware</span>
              <h2 className="text-3xl font-display font-bold text-foreground">Connecting a barcode scanner to the POS</h2>
              <p className="text-sm text-muted-foreground">Last updated: May 9, 2026</p>
            </div>

            <p className="text-foreground/80 leading-relaxed">
              Speed up your checkout process by connecting a hardware barcode scanner to Tivaro POS. Our system supports most plug-and-play USB and Bluetooth scanners without requiring special drivers.
            </p>

            <hr className="border-slate-100" />

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Supported Scanner Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-6 border border-slate-100 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Usb className="w-5 h-5" />
                    <h3 className="font-semibold text-foreground">USB Scanners</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Simply plug the scanner into any available USB port on your computer or POS terminal. It works instantly as a keyboard input.</p>
                </div>
                <div className="p-6 border border-slate-100 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Wifi className="w-5 h-5" />
                    <h3 className="font-semibold text-foreground">Bluetooth Scanners</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Pair the scanner with your tablet or computer via Bluetooth settings before using it in Tivaro.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">How to Use It in Tivaro POS</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/80">
                <li>Open the <span className="font-semibold">POS / Checkout</span> screen.</li>
                <li>Ensure your scanner is connected and powered on.</li>
                <li>Aim the scanner at the product barcode and press the trigger.</li>
                <li>The item will be automatically added to the current cart.</li>
              </ol>
            </section>
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
