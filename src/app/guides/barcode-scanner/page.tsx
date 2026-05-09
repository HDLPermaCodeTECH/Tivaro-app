'use client';

import Link from 'next/link';
import { ArrowLeft, Maximize, Check, AlertTriangle, ArrowRight, Wifi, Usb } from 'lucide-react';

export default function BarcodeScannerGuidePage() {
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
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          
          <div className="space-y-4">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Guides & Tutorials</span>
            <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">Connecting a barcode scanner to the POS</h1>
            <p className="text-sm text-muted-foreground">Last updated: May 9, 2026 • 5 min read</p>
          </div>

          <p className="text-foreground/80 leading-relaxed">
            Speed up your checkout process by connecting a hardware barcode scanner to Tivaro POS. Our system supports most plug-and-play USB and Bluetooth scanners without requiring special drivers.
          </p>

          <hr className="border-slate-100" />

          {/* Section 1: Types of Scanners */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Supported Scanner Types</h2>
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

          {/* Section 2: How to Connect */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">How to Use It in Tivaro POS</h2>
            <p className="text-foreground/80 leading-relaxed">
              Tivaro is designed to listen for barcode scans automatically on the checkout screen. You do not need to click on a specific search box to scan.
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/80">
              <li>Open the <span className="font-semibold">POS / Checkout</span> screen.</li>
              <li>Ensure your scanner is connected and powered on.</li>
              <li>Aim the scanner at the product barcode and press the trigger.</li>
              <li>The item will be automatically added to the current cart.</li>
            </ol>
          </section>

          {/* Section 3: Troubleshooting */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-xl font-bold text-foreground">Troubleshooting</h2>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Scanner beeps but nothing happens:</h4>
                <p className="text-sm text-muted-foreground">Make sure the cursor is not focused on a non-search input field. Some scanners require an "Enter" suffix to be programmed. Refer to your scanner's manual to enable the "Add Enter Suffix" feature.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Scanned code is wrong or has weird characters:</h4>
                <p className="text-sm text-muted-foreground">Ensure your keyboard language on the computer/tablet is set to English (US). Foreign keyboard layouts can cause barcode numbers to be misinterpreted.</p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Still need help? */}
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Still need help?</h3>
            <p className="text-sm text-muted-foreground">If you encounter any issues with hardware setup, feel free to contact our support team.</p>
            <Link href="/support" className="inline-block text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              Contact Support <ArrowRight className="inline-block w-4 h-4 ml-1" />
            </Link>
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
