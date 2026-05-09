'use client';

import Link from 'next/link';
import { ArrowLeft, Code, Terminal, Book, Zap, ArrowRight, Shield } from 'lucide-react';

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-8 h-8 object-contain" />
            <span className="font-display font-bold text-xl tracking-tight text-foreground">API Docs</span>
          </Link>
          <Link href="/login" className="btn-primary !py-2 !px-4 text-sm shadow-lg shadow-primary/20">
            Developer Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">For Developers</span>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">
            Build on top of Tivaro.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our powerful API allows you to integrate your inventory, sales, and customer data with any platform.
          </p>
        </div>
      </section>

      {/* API Overview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1: Auth */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/10">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Secure Authentication</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use standard Bearer tokens to securely access your data. Generate API keys directly from your dashboard.
            </p>
          </div>

          {/* Feature 2: Endpoints */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/10">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">RESTful Endpoints</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Simple and intuitive endpoints for managing Products, Sales, Customers, and Expenses.
            </p>
          </div>

          {/* Feature 3: Webhooks */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/10">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Real-time Webhooks</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get notified immediately when a sale is made, stock is low, or a customer pays a debt.
            </p>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-display font-medium text-white tracking-tight">Simple to Use</h2>
            <p className="text-indigo-200 text-sm max-w-2xl mx-auto">Get started in minutes with our clean API design.</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 font-mono text-sm overflow-x-auto">
            <pre className="text-indigo-300">
              <code>{`// Example: Get all products
fetch('https://api.tivaro.app/v1/products', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}</code>
            </pre>
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
