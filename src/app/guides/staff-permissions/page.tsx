'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Users, Check, AlertTriangle, ArrowRight, Lock } from 'lucide-react';

export default function StaffPermissionsGuidePage() {
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
            <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">Setting up staff permissions and roles</h1>
            <p className="text-sm text-muted-foreground">Last updated: May 9, 2026 • 4 min read</p>
          </div>

          <p className="text-foreground/80 leading-relaxed">
            Managing who has access to your business data is crucial for security and operational efficiency. This guide explains how to add staff members and configure their roles in Tivaro Business OS.
          </p>

          <hr className="border-slate-100" />

          {/* Section 1: Understanding Roles */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Understanding Default Roles</h2>
            <p className="text-foreground/80 leading-relaxed">
              Tivaro comes with predefined roles to simplify access management. Here is a breakdown of what each role can do:
            </p>
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

          {/* Section 2: How to Add Staff */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">How to Add a Staff Member</h2>
            <p className="text-foreground/80 leading-relaxed">
              To add a new employee to your system, follow these steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/80">
              <li>Navigate to <span className="font-semibold">Settings</span> in your dashboard.</li>
              <li>Click on the <span className="font-semibold">Staff Management</span> tab.</li>
              <li>Click the <span className="font-semibold">Add Staff</span> button.</li>
              <li>Enter their full name, email address, and desired password.</li>
              <li>Select their role (Staff or Admin) and click <span className="font-semibold">Save</span>.</li>
            </ol>
          </section>

          {/* Section 3: Best Practices */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <Lock className="w-5 h-5" />
              <h2 className="text-xl font-bold text-foreground">Security Best Practices</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
              <li><span className="font-semibold text-foreground">Unique Accounts:</span> Never share passwords between staff members. Create a unique account for each employee.</li>
              <li><span className="font-semibold text-foreground">Principle of Least Privilege:</span> Only assign the Administrator role to trusted managers or partners.</li>
              <li><span className="font-semibold text-foreground">Regular Audits:</span> Review your active staff list monthly and remove accounts for employees who have left the company.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Still need help? */}
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Still need help?</h3>
            <p className="text-sm text-muted-foreground">If you encounter any issues with staff setup, feel free to contact our support team.</p>
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
