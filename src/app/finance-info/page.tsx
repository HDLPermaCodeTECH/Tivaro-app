'use client';

import Link from 'next/link';
import { ArrowLeft, Check, BarChart3, PieChart, TrendingUp, Shield, Zap, ArrowRight, DollarSign } from 'lucide-react';

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-8 h-8 object-contain" />
            <span className="font-display font-bold text-xl tracking-tight text-foreground">Tivaro Finance</span>
          </Link>
          <Link href="/login" className="btn-primary !py-2 !px-4 text-sm shadow-lg shadow-primary/20 !bg-violet-600 hover:!bg-violet-700 shadow-violet-600/20">
            Try It Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest bg-violet-50 px-3 py-1 rounded-full">Coming Soon</span>
            <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">
              Master Your Cash Flow with Confidence.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Advanced financial modeling, budgeting, and automated bookkeeping for scaling businesses. Stop guessing and start growing.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="btn-primary !py-3 !px-6 text-sm shadow-lg shadow-primary/20 !bg-violet-600 hover:!bg-violet-700 shadow-violet-600/20">
                Join Waitlist
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-violet-100 to-indigo-100 opacity-30 blur-2xl rounded-3xl" />
            <img src="/finance_hero.png?v=1" alt="Finance Hero" className="relative w-full h-auto rounded-3xl shadow-2xl border border-slate-100" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-display font-medium text-foreground tracking-tight">Key Features</h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">Take control of your business finances with enterprise-grade tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-violet-600 p-3 rounded-xl shadow-lg shadow-violet-600/10">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Automated Bookkeeping</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect your sales and expenses automatically. No more manual data entry or messy spreadsheets.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-violet-600 p-3 rounded-xl shadow-lg shadow-violet-600/10">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Forecasting & Budgeting</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plan for the future with confidence. Set budgets and see real-time progress against your goals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-violet-600 p-3 rounded-xl shadow-lg shadow-violet-600/10">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Tax Readiness</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep your books clean and ready for tax season. Generate reports required by accountants in one click.
              </p>
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
