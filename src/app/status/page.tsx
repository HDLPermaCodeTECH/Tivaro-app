'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, Server, Zap, ArrowRight, AlertTriangle } from 'lucide-react';

export default function StatusPage() {
  const services = [
    { name: 'Tivaro Web App', status: 'Operational', uptime: '99.99%' },
    { name: 'POS Sync Service', status: 'Operational', uptime: '100%' },
    { name: 'Tivaro API', status: 'Operational', uptime: '99.95%' },
    { name: 'Digital Receipts Service', status: 'Operational', uptime: '100%' },
    { name: 'Database Clusters', status: 'Operational', uptime: '99.99%' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-8 h-8 object-contain" />
            <span className="font-display font-bold text-xl tracking-tight text-foreground">System Status</span>
          </Link>
          <Link href="/support" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Contact Support
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-semibold">
            <CheckCircle className="w-5 h-5" /> All Systems Operational
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">
            Tivaro is running smoothly.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We continuously monitor the status of our services. If you are experiencing issues, please check back here or contact support.
          </p>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Current Status</h2>
          
          {services.map((service, index) => (
            <div key={index} className="bg-white border border-slate-100 p-6 rounded-2xl flex items-center justify-between hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 p-2.5 rounded-full">
                  <Server className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{service.name}</h3>
                  <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full">
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Past Incidents */}
      <section className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Past Incidents</h2>
          
          <div className="text-center py-12 text-muted-foreground text-sm">
            <Clock className="w-8 h-8 mx-auto mb-3 text-slate-400" />
            <p>No incidents reported in the last 90 days.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-white text-center text-sm text-muted-foreground">
        <p>© 2026 Tivaro. All rights reserved.</p>
      </footer>
    </div>
  );}
