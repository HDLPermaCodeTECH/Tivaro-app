'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Lock, Mail, User, Crown } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = ['/video1.mp4', '/video2.mp4', '/video0.mp4'];
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const session = api.auth.getSession();
    if (session) {
      router.push('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    const activeVideo = videoRefs.current[currentVideo];
    if (activeVideo) {
      activeVideo.play().catch(err => {});
    }
  }, [currentVideo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 6000); // Lipat kada 6 segundo
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await api.auth.login({ email, password });
      } else {
        await api.auth.register({ name, email, password });
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      
      {/* Video Background Fade Slider */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {videos.map((src, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 ${
              currentVideo === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <video 
              ref={(el) => { videoRefs.current[index] = el; }}
              src={`${src}?v=1`} 
              className="w-full h-full object-cover" 
              muted 
              playsInline 
              loop
              autoPlay={currentVideo === index}
            />
            {/* Dark Overlay as requested */}
            <div className="absolute inset-0 bg-slate-900/70" />
          </div>
        ))}
      </div>

      {/* Login Card */}
      <div className="bg-white border border-slate-100 w-full max-w-md space-y-8 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-3xl font-display font-medium text-foreground tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {isLogin ? 'Sign in to Tivaro Business OS' : 'Get started with Tivaro Business OS'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Juan Dela Cruz"
                    className="input-field !pl-10 !py-3 border-slate-200 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="name@business.com"
                  className="input-field !pl-10 !py-3 border-slate-200 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field !pl-10 !py-3 border-slate-200 focus:border-indigo-600 focus:ring-indigo-600 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-indigo-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-indigo-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
