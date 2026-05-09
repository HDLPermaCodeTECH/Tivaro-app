'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Phone, Shield, Zap, ArrowRight, HelpCircle, Clock, Globe } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-8 h-8 object-contain" />
            <span className="font-display font-bold text-xl tracking-tight text-foreground">Tivaro Support</span>
          </Link>
          <Link href="/login" className="btn-primary !py-2 !px-4 text-sm shadow-lg shadow-primary/20">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Support Hub</span>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">
            Enterprise Support Center
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tivaro is dedicated to ensuring your business operations run smoothly. Access our multi-channel support infrastructure below.
          </p>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Channel 1: Messenger */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300 text-center">
            <div className="w-12 h-12 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/10 mx-auto">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Live Chat Support</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect with our support engineers in real-time via Facebook Messenger or in-app widget.
            </p>
            <a href="https://m.me/tivaro" target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              Initiate Chat <ArrowRight className="inline-block w-4 h-4 ml-1" />
            </a>
          </div>

          {/* Channel 2: Email */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300 text-center">
            <div className="w-12 h-12 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/10 mx-auto">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Help Desk Ticketing</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Submit a formal ticket for complex technical issues or account inquiries.
            </p>
            <a href="mailto:support@tivaro.app" className="inline-block text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              support@tivaro.app <ArrowRight className="inline-block w-4 h-4 ml-1" />
            </a>
          </div>

          {/* Channel 3: Phone */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300 text-center">
            <div className="w-12 h-12 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/10 mx-auto">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Priority Phone Line</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Direct line for PRO and Enterprise tier users. Available Monday to Friday, 9:00 AM - 6:00 PM PHT.
            </p>
            <span className="text-sm text-muted-foreground font-semibold">+63 912 345 6789</span>
          </div>
        </div>
      </section>

      {/* SLA Section */}
      <section className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-display font-medium text-foreground tracking-tight">Service Level Commitments</h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">We hold ourselves to high standards of reliability and responsiveness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 p-2 rounded-lg shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Response Time SLA</h4>
                <p className="text-sm text-muted-foreground mt-1">We target a response time of under 4 hours for priority tickets and under 24 hours for standard inquiries.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 p-2 rounded-lg shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Platform Uptime</h4>
                <p className="text-sm text-muted-foreground mt-1">We maintain a 99.9% uptime track record, backed by robust cloud infrastructure and real-time monitoring.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-display font-medium text-foreground tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">Standard operating inquiries and solutions.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-100 p-6 rounded-2xl">
              <h4 className="font-semibold text-foreground">How do I upgrade to the PRO tier?</h4>
              <p className="text-sm text-muted-foreground mt-2">You can upgrade directly from your account settings. Navigate to the "Billing" or "Subscription" section, select your preferred plan, and proceed with payment processing via our authorized gateway.</p>
            </div>
            <div className="bg-white border border-slate-100 p-6 rounded-2xl">
              <h4 className="font-semibold text-foreground">Is the platform compliant with local tax regulations?</h4>
              <p className="text-sm text-muted-foreground mt-2">Yes, Tivaro is designed to support local taxation formats, including VAT calculations and invoice generation compliant with standard accounting practices.</p>
            </div>
            <div className="bg-white border border-slate-100 p-6 rounded-2xl">
              <h4 className="font-semibold text-foreground">How secure is my business data?</h4>
              <p className="text-sm text-muted-foreground mt-2">All data is transmitted via secure SSL encryption and stored in encrypted databases. We perform regular security audits and maintain strict access controls to ensure data integrity.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
