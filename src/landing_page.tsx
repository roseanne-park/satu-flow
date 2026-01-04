import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ArrowRight, 
  BarChart2, 
  Map as MapIcon, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  Database,
  Users
} from 'lucide-react';

// --- Reusable UI Components (Supaya tidak perlu file terpisah) ---

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg";
  const variants = {
    primary: "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/30 border border-transparent",
    ghost: "bg-transparent hover:bg-rose-50 text-slate-600 hover:text-rose-700",
    outline: "bg-white border border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-600"
  };
  const sizes = "px-5 py-2.5 text-sm sm:text-base";
  
  // @ts-ignore
  return <button className={`${baseStyle} ${variants[variant]} ${sizes} ${className}`} {...props}>{children}</button>;
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

// --- Main Page Component ---

const LandingPage = ({ onGetStarted, onLogin }: any) => {
  const [scrolled, setScrolled] = useState(false);

  // Efek glassmorphism pada navbar saat scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-rose-100 p-2 rounded-lg group-hover:bg-rose-600 transition-colors duration-300">
              <Heart className="h-6 w-6 text-rose-600 fill-rose-600 group-hover:text-white group-hover:fill-white transition-colors" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">Jatim<span className="text-rose-600">Health</span></span>
          </div>
          <div className="flex gap-3">
            <div className="hidden md:flex gap-6 items-center mr-6 text-sm font-medium text-slate-600">
              <a href="#fitur" className="hover:text-rose-600 transition-colors">Fitur</a>
              <a href="#data" className="hover:text-rose-600 transition-colors">Data</a>
              <a href="#tentang" className="hover:text-rose-600 transition-colors">Tentang</a>
            </div>
            <Button onClick={onGetStarted}>Masuk</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 relative">
        {/* Background Elements */}
        <div className="absolute top-20 right-0 -z-10 w-[600px] h-[600px] bg-rose-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-0 -z-10 w-[400px] h-[400px] bg-blue-200 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rose-100 text-rose-700 text-sm font-semibold shadow-sm animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              Sinkronisasi BPS Jatim 2024 Aktif
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Kesehatan Jawa Timur dalam <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600">Satu Data.</span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Platform intelijen kesehatan terpadu. Pantau indikator krusial, bandingkan performa 38 Kota/Kabupaten, dan ambil kebijakan berbasis data akurat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button onClick={onGetStarted} className="px-8 py-4 text-lg shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40">
                Mulai Analisis <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>

            {/* Mini Stats */}
            <div className="pt-6 border-t border-slate-200 flex gap-8 justify-center lg:justify-start text-slate-500 text-sm font-medium">
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> Data Terverifikasi</div>
              <div className="flex items-center gap-2"><Users size={16} className="text-blue-500"/> Digunakan 50+ Dinkes</div>
            </div>
          </div>

          {/* Visual/Mockup Content */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-full">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-10 overflow-hidden">
               {/* Abstract UI Mockup */}
               <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 aspect-[4/3] relative">
                  {/* Mockup Header */}
                  <div className="h-12 border-b border-slate-200 bg-white flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  {/* Mockup Body */}
                  <div className="p-6 grid grid-cols-2 gap-4">
                    <div className="col-span-2 h-32 bg-gradient-to-br from-rose-50 to-white rounded-lg border border-rose-100 p-4 relative">
                       <div className="text-xs font-bold text-rose-400 mb-2">Tren Stunting (5 Tahun)</div>
                       {/* CSS Chart Line */}
                       <svg className="w-full h-16" viewBox="0 0 100 40" preserveAspectRatio="none">
                         <path d="M0 35 Q 20 10, 40 25 T 100 5" fill="none" stroke="#e11d48" strokeWidth="2" />
                         <path d="M0 35 Q 20 10, 40 25 T 100 5 V 40 H 0 Z" fill="url(#gradient)" opacity="0.2" />
                         <defs>
                           <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                             <stop offset="0%" stopColor="#e11d48" />
                             <stop offset="100%" stopColor="white" stopOpacity="0" />
                           </linearGradient>
                         </defs>
                       </svg>
                    </div>
                    <div className="h-24 bg-white rounded-lg border border-slate-100 p-3">
                      <div className="w-8 h-8 rounded bg-blue-100 mb-2"></div>
                      <div className="h-2 w-16 bg-slate-200 rounded mb-1"></div>
                      <div className="h-2 w-10 bg-slate-100 rounded"></div>
                    </div>
                    <div className="h-24 bg-white rounded-lg border border-slate-100 p-3">
                      <div className="w-8 h-8 rounded bg-green-100 mb-2"></div>
                      <div className="h-2 w-16 bg-slate-200 rounded mb-1"></div>
                      <div className="h-2 w-10 bg-slate-100 rounded"></div>
                    </div>
                  </div>
               </div>
            </div>
            {/* Decorative blob behind mockup */}
            <div className="absolute -bottom-10 -right-10 w-full h-full bg-gradient-to-tr from-rose-400 to-purple-500 rounded-2xl -z-10 opacity-30 blur-2xl transform rotate-3"></div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="bg-white border-y border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            {[
              { val: "38", label: "Kabupaten/Kota" },
              { val: "500+", label: "Indikator Kesehatan" },
              { val: "5 Tahun", label: "Data Historis" },
              { val: "24/7", label: "Update Realtime" }
            ].map((stat, idx) => (
              <div key={idx} className="p-2">
                <div className="text-3xl md:text-4xl font-black text-slate-800 mb-1">{stat.val}</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="fitur" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Fitur Analisis Komprehensif</h2>
          <p className="text-slate-500 text-lg">Kami mengubah data mentah yang kompleks menjadi visualisasi yang mudah dipahami untuk pengambilan keputusan strategis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: BarChart2, 
              color: "text-blue-600 bg-blue-50",
              title: "Visualisasi Interaktif", 
              desc: "Grafik dinamis dan dashboard yang dapat dikustomisasi untuk melihat tren kesehatan 5 tahun terakhir secara mendalam." 
            }, 
            { 
              icon: MapIcon, 
              color: "text-rose-600 bg-rose-50",
              title: "Peta Sebaran GIS", 
              desc: "Pemetaan spasial (Heatmap) untuk identifikasi cepat" 
            }, 
            { 
              icon: Database, 
              color: "text-purple-600 bg-purple-50",
              title: "Integrasi API BPS", 
              desc: "Terhubung langsung dengan Open Data BPS Jatim. Tidak perlu input manual, data selalu tersinkronisasi otomatis." 
            },
          ].map((feat, idx) => (
            <Card key={idx} className="p-8 group cursor-default">
              <div className={`w-14 h-14 ${feat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feat.icon size={28} />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-3">{feat.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
              <div className="mt-6 flex items-center text-rose-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                Pelajari <ChevronRight size={16} />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer Simple */}
       {/* --- Footer --- */}
      <footer className="bg-white border-t border-pink-200 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
            <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-rose-600 fill-current" />
                <span className="font-bold text-xl text-pink-900">JatimHealth</span>
              </div>
              <p className="text-pink-600 text-sm leading-relaxed">
                Membantu pemerintah, peneliti, dan masyarakat memahami lanskap kesehatan Jawa Timur melalui data.
              </p>
            </div>
            
            <div className="flex gap-16 flex-wrap">
              <div>
                <h4 className="font-bold text-pink-900 mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-pink-500">
                  <li><a href="#" className="hover:text-rose-600 transition-colors">Dashboard</a></li>
                  <li><a href="#" className="hover:text-rose-600 transition-colors">Peta GIS</a></li>
                  <li><a href="#" className="hover:text-rose-600 transition-colors">API Access</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-pink-900 mb-4">Perusahaan</h4>
                <ul className="space-y-2 text-sm text-pink-500">
                  <li><a href="#" className="hover:text-rose-600 transition-colors">Tentang Kami</a></li>
                  <li><a href="#" className="hover:text-rose-600 transition-colors">Kontak</a></li>
                  <li><a href="#" className="hover:text-rose-600 transition-colors">Karir</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-pink-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-pink-400 text-sm">
              © {new Date().getFullYear()} JatimHealth Analytics. 
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-pink-400 hover:text-rose-600 transition-colors"><Activity size={20}/></a>
              <a href="#" className="text-pink-400 hover:text-rose-600 transition-colors"><ShieldCheck size={20}/></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;