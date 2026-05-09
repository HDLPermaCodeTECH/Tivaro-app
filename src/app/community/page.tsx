'use client';

import Link from 'next/link';
import { ArrowLeft, Users, MessageSquare, Globe, Zap, ArrowRight, Heart } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-8 h-8 object-contain" />
            <span className="font-display font-bold text-xl tracking-tight text-foreground">Community</span>
          </Link>
          <Link href="/login" className="btn-primary !py-2 !px-4 text-sm shadow-lg shadow-primary/20">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Tivaro Network</span>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">
            Connect with Other Business Owners.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of merchants in the Philippines. Share tips, ask questions, and grow your business together.
          </p>
          <div className="flex justify-center gap-4">
            <a href="https://facebook.com/groups/tivaro" target="_blank" rel="noopener noreferrer" className="btn-primary !py-3 !px-6 text-sm shadow-lg shadow-primary/20">
              Join Facebook Group
            </a>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1: Share Tips */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/10">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Share Tips & Strategies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Learn how other sari-sari stores, cafes, and online sellers use Tivaro to increase their sales.
            </p>
          </div>

          {/* Feature 2: Network */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/10">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Local Meetups</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Join our regular webinars and local meetups to connect with fellow entrepreneurs in your area.
            </p>
          </div>

          {/* Feature 3: Success Stories */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/10">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Success Stories</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Be inspired by stories of small businesses that scaled up using Tivaro Business OS.
            </p>
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
