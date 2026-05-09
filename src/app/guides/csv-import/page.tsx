'use client';

import Link from 'next/link';
import { ArrowLeft, Download, FileSpreadsheet, Check, AlertTriangle, ArrowRight } from 'lucide-react';

export default function CsvImportGuidePage() {
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
            <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">How to import inventory from a CSV file</h1>
            <p className="text-sm text-muted-foreground">Last updated: May 9, 2026 • 5 min read</p>
          </div>

          <p className="text-foreground/80 leading-relaxed">
            Importing your inventory via a CSV (Comma-Separated Values) file is the fastest way to get your products into Tivaro Business OS. This guide will walk you through the process of preparing your file and uploading it to the system.
          </p>

          <hr className="border-slate-100" />

          {/* Step 1 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Step 1: Download the Template</h2>
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

          {/* Step 2 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Step 2: Prepare Your Data</h2>
            <p className="text-foreground/80 leading-relaxed">
              Open the downloaded template in Microsoft Excel, Google Sheets, or any spreadsheet editor. Fill in your product details following these rules:
            </p>
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

          {/* Step 3 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Step 3: Upload the File</h2>
            <p className="text-foreground/80 leading-relaxed">
              Once your file is ready and saved as a <span className="font-semibold">.csv</span> file, follow these steps in the app:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/80">
              <li>Log in to your Tivaro Dashboard.</li>
              <li>Navigate to the <span className="font-semibold">Inventory</span> module.</li>
              <li>Click on the <span className="font-semibold">Import</span> button at the top right.</li>
              <li>Drag and drop your file or click to browse.</li>
              <li>Review the mapping and click <span className="font-semibold">Confirm Import</span>.</li>
            </ol>
          </section>

          {/* Troubleshooting */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-xl font-bold text-foreground">Common Errors</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
              <li><span className="font-semibold text-foreground">Missing required fields:</span> Ensure all products have a name and price.</li>
              <li><span className="font-semibold text-foreground">Incorrect file format:</span> Make sure you are saving as CSV, not XLS or XLSX.</li>
              <li><span className="font-semibold text-foreground">Duplicate SKUs:</span> If you provide SKUs, each must be unique.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Still need help? */}
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Still need help?</h3>
            <p className="text-sm text-muted-foreground">If you encounter any issues, feel free to contact our support team.</p>
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
