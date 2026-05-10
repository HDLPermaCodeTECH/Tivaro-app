'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  BarChart3, 
  ClipboardList,
  Check,
  Crown,
  ChevronLeft,
  ChevronRight,
  Star,
  Coffee,
  X,
  Usb,
  Printer
} from 'lucide-react';

// Custom component para sa counting animation
function AnimatedCounter({ end, duration = 2000, decimals = 0 }: { end: number, duration?: number, decimals?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Run once
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(progress * end);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count.toFixed(decimals)}</span>;
}

export default function LandingPage() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = ['/video1.mp4', '/video2.mp4', '/video0.mp4'];
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 1000); // 1 second intro splash
    return () => clearTimeout(timer);
  }, []);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [rating, setRating] = useState(5);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  
  const [currentAd, setCurrentAd] = useState(0);
  const ads = ['/ad-image.png', '/ad-image2.png'];
  
  const [currentFeature, setCurrentFeature] = useState(0);
  const growthFeatures = [
    { 
      title: "Smart Inventory", 
      description: "Keep track of everything you sell without the stress. See your stock levels in real-time, get alerts when you're running low, and manage different sizes or colors in one place. No more guessing what's in your stockroom." 
    },
    { 
      title: "Point of Sale (POS)", 
      description: "Ring up sales in seconds with a fast, easy-to-use checkout. Your staff will learn it in minutes. It handles cash, digital payments, partial payments, and even tracks customer debts so you can collect on time." 
    },
    { 
      title: "Profit & Loss Analytics", 
      description: "Stop wasting time with spreadsheets. Get a clear view of your daily profits and expenses. See which products are making you money and where your cash is going, so you can make smart decisions with confidence." 
    }
  ];
  
  const testimonials = [
    { name: 'Maria Santos', role: 'Sari-Sari Store Owner', initial: 'MS', color: 'bg-primary/10 text-primary', text: '"Dati notebook lang gamit ko pang lista ng stocks, laging nagkakagulo. Nung ginamit ko \'to, nakita ko agad kung ano yung paubos na. Hindi na ako nanghuhula kung ano bibilhin sa supplier."' },
    { name: 'Juan Cruz', role: 'Coffee Shop Owner', initial: 'JC', color: 'bg-emerald-500/10 text-emerald-600', text: '"Yung mga staff ko madaling natuto. Dati kasi takot sila gumamit ng system. Ngayon mabilis na sila mag-punch ng benta, wala nang mahabang pila."' },
    { name: 'Elena Reyes', role: 'Online Seller', initial: 'ER', color: 'bg-accent/10 text-accent', text: '"Malaking tulong yung debt tracker. Dati nakakalimutan ko kung sino may utang at kailan dapat magbayad. Ngayon nate-text ko sila agad para magpa-alala."' },
    { name: 'David Lim', role: 'Apparel Brand Owner', initial: 'DL', color: 'bg-amber-500/10 text-amber-600', text: '"Having daily profitability reports at my fingertips has been a game-changer. I no longer spend hours reconciling sales data at the end of the day."' },
    { name: 'Sarah Gomez', role: 'Boutique Manager', initial: 'SG', color: 'bg-rose-500/10 text-rose-600', text: '"Digital receipts have reduced our operational costs and improved our customer experience. It is a much more modern approach."' },
    { name: 'Mark Abad', role: 'Hardware Store Owner', initial: 'MA', color: 'bg-indigo-500/10 text-indigo-600', text: '"The system remains highly responsive even during high-volume transaction periods. It has brought structure to our retail operations."' },
  ];

  const [activeFeature, setActiveFeature] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const appFeatures = [
    { title: 'Dashboard & Analytics', desc: 'See your daily sales, actual profit, and total expenses. You can also track which products sell the most and check your cash flow.', icon: <BarChart3 className="w-8 h-8" />, imageSrc: '/dashboard-slide.png' },
    { title: 'Smart Inventory', desc: 'Monitor your stock levels and get alerts when items are running low. You can also add product sizes or colors easily.', icon: <Package className="w-8 h-8" />, imageSrc: '/inventory-slide.png' },
    { title: 'Point of Sale (POS)', desc: 'Process sales fast. Your staff can learn this in a few minutes. It supports barcode scanners, cash, and GCash or Maya payments.', icon: <ShoppingCart className="w-8 h-8" />, imageSrc: '/sales-slide.png' },
    { title: 'Finance', desc: 'List down all your expenses like rent, bills, or supplier payments. This helps you see how much you are actually making.', icon: <ClipboardList className="w-8 h-8" />, imageSrc: '/finance-slide.png' },
    { title: 'Transaction History', desc: 'Find any past sale or expense quickly. You can search by receipt number, date, or customer name.', icon: <ClipboardList className="w-8 h-8" />, imageSrc: '/history-slide.png' },
    { title: 'Digital Receipts', desc: 'Stop buying expensive thermal paper. Send digital receipts directly to your customers via SMS or Messenger.', icon: <ClipboardList className="w-8 h-8" />, imageSrc: '/receipt-slide.png' },
    { title: 'Business Reports', desc: 'Download a summary of your sales and profits. You can use this data for your accounting or tax filing.', icon: <BarChart3 className="w-8 h-8" />, imageSrc: '/reports-slide.png' },
    { title: 'Supplier Management', desc: 'Save your suppliers contact info and pending orders in one list. No more lost phone numbers.', icon: <Package className="w-8 h-8" />, imageSrc: '/suppliers-slide.png' },
    { title: 'Customers / CRM', desc: 'See who your regular customers are. You can check what they usually buy and how much they have spent.', icon: <Users className="w-8 h-8" />, imageSrc: '/crm-slide.png' },
    { title: 'Advanced Analytics', desc: 'Check your monthly growth and profit margins per product to see where you can save money.', icon: <TrendingUp className="w-8 h-8" />, imageSrc: '/advance.png' },
    { title: 'Debt Tracker', desc: 'Track customer debts or pautang. Record partial payments and set due dates so you know when to collect.', icon: <ClipboardList className="w-8 h-8" />, imageSrc: '/debt-tracker.png' },
    { title: 'System Settings', desc: 'Setup your shop profile, add staff accounts, and set what they are allowed to see in the app.', icon: <ClipboardList className="w-8 h-8" />, imageSrc: '/settings.png' },
  ];

  useEffect(() => {
    // I-pause lahat ng video maliban sa active para hindi mag-replay sa dulo
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentVideo) {
        video.pause();
      }
    });

    // I-play lang ang active video at i-reset ito sa simula
    const activeVideo = videoRefs.current[currentVideo];
    if (activeVideo) {
      activeVideo.currentTime = 0; // I-reset lang ang mag-ple-play
      activeVideo.play().catch(error => {
        // Silently catch the error when browser interrupts autoplay
        console.log("Autoplay interrupted:", error);
      });
    }
  }, [currentVideo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 6000); // Lipat kada 6 segundo
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000); // Lipat kada 6 segundo
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000); // Lipat kada 5 segundo
    return () => clearInterval(interval);
  }, []);



  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans scroll-smooth">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-md border-b border-border/50 z-50">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-10 h-10 object-contain" />
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">Tivaro</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#suite" className="hover:text-foreground transition-colors">The Suite</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="btn-primary !py-2.5 !px-5 text-sm shadow-lg shadow-primary/20">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 overflow-hidden min-h-screen flex items-center justify-center pt-20">
        
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
              {/* Soft Overlay - sakto lang para makita ang video at mabasa ang text */}
              <div className="absolute inset-0 bg-slate-900/70" />
            </div>
          ))}
        </div>

        {/* Intro Splash Screen */}
        <div className={`fixed inset-0 bg-white z-50 flex flex-col justify-center items-center transition-opacity duration-500 ${showIntro ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <img src="/tivaro-logo.png" alt="Tivaro Logo" className="h-56 md:h-72 w-auto object-contain animate-pulse" />
        </div>

        {/* Background Decorative Gradients (Pang-dagdag ganda) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] opacity-20 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full filter blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent rounded-full filter blur-3xl" />
        </div>

        {/* Content (Nasa ibabaw ng Video) - Floating Text */}
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest shadow-lg shadow-white/5">
            <Crown className="w-3.5 h-3.5" /> All-In-One Business OS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-medium text-white tracking-tight leading-tight">
            Your Entire Business.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">One Operating System.</span>
          </h1>
          
          <p className="text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Manage inventory, track sales, analyze profits, and grow your business with a beautiful, high-density platform designed for modern entrepreneurs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login" className="btn-primary !py-4 !px-8 text-base shadow-2xl shadow-primary/30 w-full sm:w-auto flex items-center justify-center gap-2 group hover:scale-[1.02] transition-all">
              Start Free Trial <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="!py-4 !px-8 text-base w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Ad Carousel Section */}
      <section className="w-full overflow-hidden bg-white">
        <div className="relative w-full">
          <div 
            className="flex transition-transform duration-1000 ease-in-out" 
            style={{ transform: `translateX(-${currentAd * 100}%)` }}
          >
            {ads.map((src, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <img src={src} alt={`Ad ${index + 1}`} className="w-full h-auto" />
              </div>
            ))}
          </div>
            
            {/* Controls */}
            <button 
              onClick={() => setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button 
              onClick={() => setCurrentAd((prev) => (prev + 1) % ads.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAd(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentAd === index ? 'bg-primary w-6' : 'bg-white/50 hover:bg-white'}`}
                />
              ))}
            </div>
          </div>
      </section>

      {/* What is Tivaro Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-slate-50/50">
        <div className="w-full px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & Features */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">About the Platform</span>
              <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight leading-tight">
                What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Tivaro</span>?
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                We are more than just a software. We are your partner in digital growth, helping you manage and scale your business with ease.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-indigo-600">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Complete Business OS</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    An all-in-one Point of Sale (POS), Inventory, and Finance platform designed specifically for modern Filipino entrepreneurs.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-indigo-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Built for MSMEs</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Whether you run a small coffee shop, a retail store, or a service business, Tivaro scales with you as you grow.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-indigo-600">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">No More Manual Listing</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Eliminate the headache of manual bookkeeping. Tivaro automates your sales tracking and inventory updates in real-time.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-indigo-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Data-Driven Growth</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get clear, actionable insights and reports so you can make smart decisions to increase your profits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Big Screenshot */}
          <div className="lg:col-span-7 relative lg:pl-10">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 border border-slate-100 bg-white">
              <img src="/dashboard-slide.png" alt="Tivaro Dashboard" className="w-full h-auto" />
            </div>
            
            {/* Decorative Glow */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-600 to-violet-600 opacity-10 blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* Stats & Trust Section */}
      <section className="py-20 bg-white border-t border-b border-border/50 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Tivaro by the Numbers</span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">Trusted by Growing Businesses</h2>
          </div>
 
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="bg-white border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center hover:shadow-lg transition-all duration-300">
              <Users className="w-8 h-8 text-indigo-600 mb-4" />
              <div className="text-5xl font-display font-semibold text-foreground mb-1">
                <AnimatedCounter end={4820} />+
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-xs">Active Merchants</p>
            </div>
            
            {/* Stat 2 */}
            <div className="bg-white border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center hover:shadow-lg transition-all duration-300">
              <TrendingUp className="w-8 h-8 text-indigo-600 mb-4" />
              <div className="text-5xl font-display font-semibold text-foreground mb-1">
                ₱<AnimatedCounter end={14.2} decimals={1} />M
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-xs">Volume Processed This Month</p>
            </div>
            
            {/* Stat 3 */}
            <div className="bg-white border border-slate-100 p-8 rounded-2xl flex flex-col items-center text-center hover:shadow-lg transition-all duration-300">
              <Star className="w-8 h-8 text-indigo-600 mb-4 fill-indigo-600" />
              <div className="text-5xl font-display font-semibold text-foreground mb-1">
                <AnimatedCounter end={4.9} decimals={1} /> / 5
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-xs">Merchant Satisfaction Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="py-24 px-6 bg-slate-50 border-t border-b border-border/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-8 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 bg-white">
              <img src="/bar-ther.png" alt="Barcode and Thermal Printer Support" className="w-full h-auto" />
            </div>
            {/* Decorative Glow */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-600 to-violet-600 opacity-10 blur-3xl -z-10" />
          </div>

          {/* Right Column: Text */}
          <div className="lg:col-span-4 space-y-6">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Hardware Ready</span>
            <h2 className="text-4xl font-display font-bold text-foreground tracking-tight leading-tight">
              Barcode & Thermal Printer Support
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Tivaro is fully compatible with standard USB and Bluetooth hardware. Speed up your checkout with barcode scanners and print professional receipts on 58mm or 80mm thermal printers.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <Usb className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Plug & Play Scanners</p>
                  <p className="text-sm text-muted-foreground">Scan items instantly to add them to cart. Works with any standard scanner.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Printer className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">58mm & 80mm Receipts</p>
                  <p className="text-sm text-muted-foreground">Optimized layouts for small and large thermal papers to save cost.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Receipt Section */}
      <section className="py-24 px-6 bg-white border-t border-b border-border/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text */}
          <div className="lg:col-span-4 space-y-6">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Official & Professional</span>
            <h2 className="text-4xl font-display font-bold text-foreground tracking-tight leading-tight">
              Beautiful Receipts for Your Customers
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Impress your customers with clean, professional receipts. Tivaro automatically generates system-compliant receipts that you can print or send digitally.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Custom Branding</p>
                  <p className="text-sm text-muted-foreground">Add your business logo, address, and contact info automatically.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Digital & Physical</p>
                  <p className="text-sm text-muted-foreground">Print to thermal printers or save as PDF to send via Messenger or Email.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="lg:col-span-8 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 bg-white">
              <img src="/receipt.png" alt="Professional Receipt Example" className="w-full h-auto" />
            </div>
            {/* Decorative Glow */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-primary to-accent opacity-10 blur-3xl -z-10" />
          </div>

        </div>
      </section>

      {/* Features Text Slider Section */}
      <section id="features" className="py-24 px-6 bg-white border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Core Modules</span>
            <p className="text-sm font-medium text-slate-500">Built for Growth</p>
          </div>
          
          <div className="relative min-h-[160px] flex flex-col items-center justify-center">
            <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight mb-4">
              {growthFeatures[currentFeature].title}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {growthFeatures[currentFeature].description}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <button 
              onClick={() => setCurrentFeature((prev) => (prev - 1 + growthFeatures.length) % growthFeatures.length)}
              className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
              aria-label="Previous feature"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            
            <div className="flex gap-3">
              {growthFeatures.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentFeature === index ? 'bg-indigo-600 w-6' : 'bg-slate-300 hover:bg-slate-400'}`}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={() => setCurrentFeature((prev) => (prev + 1) % growthFeatures.length)}
              className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
              aria-label="Next feature"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section id="showcase" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 [mask-image:linear-gradient(to_bottom,white,transparent)] text-indigo-900/10">
          <svg className="w-full h-full" width="100%" height="100%">
            <defs>
              <pattern id="grid-showcase" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-showcase)" />
          </svg>
        </div>

        {/* Large Decorative Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full filter blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-400/20 rounded-full filter blur-3xl -z-10" />

        <div className="w-full px-6 md:px-12 lg:px-20 space-y-12 relative z-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Product Tour</span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">Explore the Platform</h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">See how Tivaro simplifies every aspect of your business operations.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Explanation */}
            <div className={`${appFeatures[activeFeature].imageSrc ? 'lg:col-span-4' : 'lg:col-span-12 text-center flex flex-col items-center justify-center'} space-y-6 bg-white border border-slate-100 p-8 rounded-3xl hover:shadow-lg transition-all duration-300`}>
              <div className="text-indigo-600 flex justify-center lg:justify-start">
                {appFeatures[activeFeature].icon}
              </div>
              <h3 className="text-3xl font-display font-semibold text-foreground tracking-tight">{appFeatures[activeFeature].title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed max-w-2xl mx-auto">{appFeatures[activeFeature].desc}</p>
              
              {/* Navigation Buttons */}
              <div className={`flex items-center gap-4 pt-4 ${appFeatures[activeFeature].imageSrc ? '' : 'justify-center'}`}>
                <button 
                  onClick={() => setActiveFeature((prev) => (prev - 1 + appFeatures.length) % appFeatures.length)} 
                  className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActiveFeature((prev) => (prev + 1) % appFeatures.length)} 
                  className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-muted-foreground ml-2">
                  {String(activeFeature + 1).padStart(2, '0')} / {String(appFeatures.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Right Column: Full Image */}
            {appFeatures[activeFeature].imageSrc && (
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
                {/* Browser Header */}
                <div className="bg-muted/50 px-6 py-4 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/20" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                  </div>
                  <div className="text-xs text-muted-foreground font-medium bg-white px-4 py-1 rounded-full border border-border/50">
                    tivaro.app/{appFeatures[activeFeature].title.toLowerCase().replace(/ /g, '-').replace(/\//g, '').replace(/&/g, 'and')}
                  </div>
                  <div className="w-6" /> {/* Spacer */}
                </div>
                
                {/* Browser Content */}
                <div 
                  className="overflow-hidden cursor-pointer group relative" 
                  onClick={() => setLightboxImage(appFeatures[activeFeature].imageSrc)}
                >
                  <img 
                    src={appFeatures[activeFeature].imageSrc} 
                    alt={appFeatures[activeFeature].title} 
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]" 
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 bg-white/90 text-foreground text-xs font-medium px-4 py-2 rounded-full shadow-lg transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                      Click to enlarge
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

            {/* Slider Controls (Dots) */}
            <div className="flex justify-center gap-2">
              {appFeatures.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeFeature === index ? 'bg-primary w-6' : 'bg-muted hover:bg-muted-foreground/30'}`}
                />
              ))}
            </div>
          </div>
      </section>

      {/* The Suite (Future Apps) - Professional Light Design */}
      <section id="suite" className="py-24 px-6 border-t border-border/50 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Future Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">The Tivaro Suite</h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">We are expanding. Soon, Tivaro will be a complete ecosystem for all your SaaS needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* App 1 */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-600 p-3.5 rounded-xl shadow-lg shadow-indigo-600/10 group-hover:scale-105 transition-transform duration-300">
                    <ClipboardList className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Tivaro Invoices</h3>
                    <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">Coming Soon</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create and send professional invoices to your clients in seconds. Automated payment reminders and tracking.
              </p>
              <Link href="/invoices" className="flex items-center gap-2 text-xs text-indigo-600 font-semibold uppercase tracking-wider group-hover:text-indigo-700 transition-colors">
                Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* App 2 */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-violet-600 p-3.5 rounded-xl shadow-lg shadow-violet-600/10 group-hover:scale-105 transition-transform duration-300">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Tivaro Finance</h3>
                    <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">Coming Soon</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Advanced financial modeling, budgeting, and automated bookkeeping for scaling businesses.
              </p>
              <Link href="/finance-info" className="flex items-center gap-2 text-xs text-indigo-600 font-semibold uppercase tracking-wider group-hover:text-indigo-700 transition-colors">
                Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-gradient-to-b from-white to-slate-50/50 border-t border-border/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Success Stories</span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">Trusted by Business Owners</h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">Hear what our active users say about their experience with Tivaro.</p>
          </div>

          {/* Testimonial Fade Slider Container */}
          <div className="relative h-[250px] md:h-[200px] max-w-4xl mx-auto">
            {testimonials.map((item, index) => (
              <div 
                key={index} 
                className={`absolute inset-0 bg-white/80 backdrop-blur-md border border-border/50 p-8 rounded-3xl flex flex-col justify-between transition-all duration-1000 ease-in-out hover:shadow-xl ${
                  currentTestimonial === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex text-amber-500 gap-0.5">
                    <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                  </div>
                  <p className="text-base text-foreground font-medium leading-relaxed">
                    "{item.text}"
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center font-bold text-white shadow-lg`}>
                    {item.initial}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator for Testimonials */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentTestimonial === index ? 'bg-primary w-6' : 'bg-muted hover:bg-muted-foreground/30'}`}
              />
            ))}
          </div>

          {/* Add Comment Form */}
          <div className="max-w-2xl mx-auto mt-20 bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Share Your Experience</h3>
              <p className="text-sm text-muted-foreground">Are you an active user? Let us know how Tivaro helps your business.</p>
            </div>
            
            <div className="space-y-4">
              {/* Star Rating (Interactive) */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`w-6 h-6 transition-colors ${
                        star <= rating ? 'fill-amber-500 text-amber-500' : 'text-border fill-transparent'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <textarea 
                placeholder="Write your review here..." 
                className="w-full p-4 text-sm border border-border rounded-xl focus:outline-none focus:border-primary/50 bg-background/50"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Your Full Name" 
                  className="p-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary/50 bg-background/50"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Business Name (e.g., Milk Tea Shop)" 
                  className="p-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary/50 bg-background/50"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button 
                onClick={() => {
                  setShowSuccessModal(true);
                  setReviewText('');
                  setReviewerName('');
                  setBusinessName('');
                  setRating(5);
                }}
                className="btn-primary w-full !py-3 text-sm shadow-lg shadow-primary/10"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-white to-slate-50/50 border-t border-border/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Plans</span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">Pricing that fits your business</h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">Start free with the basics. Upgrade when you need more power.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-normal text-foreground">Free Tier</h3>
                  <p className="text-sm text-muted-foreground mt-1">Perfect for getting started</p>
                </div>
                <div className="text-4xl font-display font-normal text-foreground">₱0 <span className="text-sm text-muted-foreground">/mo</span></div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Basic Inventory</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Sales & POS</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> 1 Staff Account</li>
                  <li className="flex items-center gap-2 opacity-30"><X className="w-4 h-4 text-muted-foreground" /> Customers / CRM</li>
                  <li className="flex items-center gap-2 opacity-30"><X className="w-4 h-4 text-muted-foreground" /> Debt Tracker</li>
                  <li className="flex items-center gap-2 opacity-30"><X className="w-4 h-4 text-muted-foreground" /> Suppliers Management</li>
                  <li className="flex items-center gap-2 opacity-30"><X className="w-4 h-4 text-muted-foreground" /> Goal Tracker</li>
                  <li className="flex items-center gap-2 opacity-30"><X className="w-4 h-4 text-muted-foreground" /> Advanced Analytics</li>
                  <li className="flex items-center gap-2 opacity-30"><X className="w-4 h-4 text-muted-foreground" /> Custom Branding</li>
                </ul>
              </div>
              <Link href="/login" className="w-full mt-8 py-3 bg-white hover:bg-slate-50 text-foreground text-center text-sm font-semibold border border-slate-200 rounded-xl transition-all">Get Started</Link>
            </div>

            {/* PRO Plan */}
            <div className="bg-white border-2 border-indigo-600 p-8 rounded-3xl flex flex-col justify-between shadow-xl shadow-indigo-600/5 relative hover:scale-[1.02] transition-all duration-300">
              <div className="absolute -top-4 right-4 bg-indigo-600 text-white text-[10px] font-semibold uppercase px-4 py-1.5 rounded-full shadow-lg">Most Popular</div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-normal text-foreground">PRO Tier</h3>
                  <p className="text-sm text-muted-foreground mt-1">For growing businesses</p>
                </div>
                <div className="text-4xl font-display font-normal text-foreground">₱499 <span className="text-sm text-muted-foreground">/mo</span></div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Basic Sales & Inventory</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Customers / CRM</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Debt Tracker</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Suppliers Management</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Up to 2 Staff Accounts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Goal Tracker</li>
                  <li className="flex items-center gap-2 opacity-30"><X className="w-4 h-4 text-muted-foreground" /> Advanced Analytics</li>
                  <li className="flex items-center gap-2 opacity-30"><X className="w-4 h-4 text-muted-foreground" /> Unlimited Staff Accounts</li>
                  <li className="flex items-center gap-2 opacity-30"><X className="w-4 h-4 text-muted-foreground" /> Custom Branding</li>
                </ul>
              </div>
              <Link href="/login" className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-center text-sm font-semibold uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20 transition-all">Get Started</Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-between shadow-2xl relative hover:scale-[1.02] transition-all duration-300 lg:scale-[1.05] z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-semibold uppercase px-4 py-1.5 rounded-full shadow-lg">Best Value</div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">Enterprise Tier</h3>
                  <p className="text-sm text-slate-400 mt-1">For large scale operations</p>
                </div>
                <div className="text-4xl font-display font-normal text-white">₱999 <span className="text-sm text-slate-400">/mo</span></div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Basic Inventory</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Sales & POS</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Customers / CRM</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Debt Tracker</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Suppliers Management</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Goal Tracker</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Advanced Analytics (P&L)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Unlimited Staff Accounts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Custom Branding</li>
                </ul>
              </div>
              <Link href="/login" className="w-full mt-8 py-3 bg-white hover:bg-slate-100 text-slate-900 text-center text-sm font-semibold uppercase tracking-widest rounded-xl shadow-lg transition-all">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-t border-indigo-700">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="text-xs font-semibold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-white">Get Started Today</span>
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-white">
            Ready to Grow Your Business?
          </h2>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of active merchants in the Philippines. Take control of your inventory and sales today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login" className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full hover:bg-slate-50 transition-all shadow-lg shadow-black/10">
              Start Free Trial Now
            </Link>
            <a href="#features" className="bg-transparent text-white border border-white/30 font-semibold py-3 px-8 rounded-full hover:bg-white/10 transition-all">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Full Screen Logo Section */}
      <section className="w-full bg-white py-12 border-t border-slate-100">
        <div className="w-full h-[400px] relative overflow-hidden">
          <img src="/tivaro-logo.png" alt="Tivaro Logo" className="w-full h-full object-contain transform scale-125" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          
          {/* Column 1: Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/tivaro_logo_1024.svg" alt="Tivaro Logo" className="w-8 h-8 object-contain" />
              <span className="font-display font-bold text-xl tracking-tight text-foreground">Tivaro</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The premier Business OS for growing merchants in the Philippines. Simplify your inventory, sales, and analytics.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#features" className="hover:text-indigo-600 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
              <li><a href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</a></li>
              <li><a href="#suite" className="hover:text-indigo-600 transition-colors">The Suite</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/help" className="hover:text-indigo-600 transition-colors">Help Center</Link></li>
              <li><Link href="/guides" className="hover:text-indigo-600 transition-colors">Guides & Tutorials</Link></li>
              <li><Link href="/community" className="hover:text-indigo-600 transition-colors">Community</Link></li>
              <li><Link href="/api-docs" className="hover:text-indigo-600 transition-colors">API Docs</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal & Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/support" className="hover:text-indigo-600 transition-colors">Contact Support</Link></li>
              <li><Link href="/status" className="hover:text-indigo-600 transition-colors">System Status</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 Tivaro. All rights reserved.</span>
          <div className="flex gap-6">
            <span>Proudly made in the Philippines 🇵🇭</span>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl border border-border text-center space-y-6 transform transition-all">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Thank you for your feedback!</h3>
              <p className="text-sm text-muted-foreground">
                Our team will review your submission before publishing it on the platform.
              </p>
            </div>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="btn-primary w-full !py-3 text-sm shadow-lg shadow-primary/10"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 cursor-pointer" 
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh]">
            <button 
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-[101]"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage(null);
              }}
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={lightboxImage || undefined} 
              alt="Fullscreen view" 
              className="w-full h-auto max-h-[90vh] object-contain rounded-xl shadow-2xl" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
