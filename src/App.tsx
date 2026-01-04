import React, { useState, useEffect } from 'react';
import {
  Activity,
  Map as MapIcon,
  Users,
  LayoutDashboard,
  Heart,
  LogOut,
  User,
  ChevronDown,
  Calendar,
  Menu
} from 'lucide-react';

// Asumsi import komponen (pastikan file-file ini juga support TS atau .js)
import LandingPage from './landing_page';
import AuthPage from './register_login';
import DashboardAnalysis from './dasboard_analisis';
import RegionComparison from './komparasi_wilayah';
import GisMap from './peta';
import { INDICATORS, generateMockData } from './constants';

// --- TYPE DEFINITIONS ---
interface UserData {
  username: string;
  email?: string;
  token?: string;
}

interface Indicator {
  id: string;
  name: string;
  table_name: string;
}

interface DbData {
  [key: string]: any[];
}

// --- MAIN COMPONENT ---
export default function App() {
  // State Definitions with Types
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'single' | 'compare' | 'map'>('single');
  
  // Filter States
  const [region1, setRegion1] = useState<string>('Kota Surabaya');
  const [region2, setRegion2] = useState<string>('Kab. Malang');
  const [indicator, setIndicator] = useState<string>(INDICATORS[0].id);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  
  // Data & System States
  const [dbData, setDbData] = useState<DbData>(() => generateMockData());
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const currentIndicator = INDICATORS.find((i: Indicator) => i.id === indicator);

  // Effect: Fetch Data
  useEffect(() => {
    if (!currentIndicator || view !== 'dashboard') return;

    const fetchTable = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/data?table=${currentIndicator.table_name}`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setDbData(prev => ({
              ...prev,
              [currentIndicator.table_name]: data
            }));
            setIsDbConnected(true);
          }
        }
      } catch {
        setIsDbConnected(false);
      }
    };

    fetchTable();
  }, [indicator, view, currentIndicator]);

  // Effect: Load Leaflet CSS/JS
  useEffect(() => {
    if (document.getElementById('leaflet-script')) {
      setLeafletLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.id = 'leaflet-script';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setLeafletLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Handlers
  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  // Render Logic
  if (view === 'landing')
    return <LandingPage onGetStarted={() => setView('auth')} />;

  if (view === 'auth')
    return <AuthPage onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-pink-50 overflow-hidden font-sans text-slate-800">

      {/* --- OVERLAY MOBILE --- 
          Hanya muncul di mobile (md:hidden) saat sidebar terbuka.
          Menggunakan z-30 agar di bawah sidebar tapi di atas konten.
      */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`
          fixed inset-0 bg-pink-900/30 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300
          ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* --- SIDEBAR --- 
          Mobile: Fixed position, slide in/out.
          Desktop: Relative position, width transition.
      */}
      <aside
        className={`
          fixed md:relative z-40 h-full bg-white border-r border-pink-100 shadow-xl shadow-pink-100/50
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex flex-col items-center border-b border-pink-50 min-h-[100px] justify-center">
          <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-pink-200 shrink-0">
            <Heart className="text-white fill-current" />
          </div>
          {/* Text hanya muncul jika sidebar terbuka */}
          <div className={`transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden md:block md:opacity-0'}`}>
            {sidebarOpen && (
              <div className="text-center">
                <h1 className="text-lg font-bold text-pink-900 whitespace-nowrap">JatimHealth</h1>
                <p className="text-[10px] text-pink-400 font-medium">
                  {isDbConnected ? '🟢 Live Data' : '🟠 Mock Data'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden">
          {[
            { id: 'single', label: 'Analisis Provinsi', icon: LayoutDashboard },
            { id: 'compare', label: 'Komparasi Wilayah', icon: Users },
            { id: 'map', label: 'Peta GIS', icon: MapIcon }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              title={!sidebarOpen ? item.label : ''}
              className={`
                w-full flex items-center py-3 rounded-xl transition-all duration-200 group relative
                ${sidebarOpen ? 'gap-3 px-4 justify-start' : 'justify-center'}
                ${activeTab === item.id
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
                  : 'text-pink-400 hover:bg-pink-50 hover:text-pink-600'}
              `}
            >
              <item.icon size={20} className="shrink-0" />
              
              {/* Label Text (Hidden when collapsed) */}
              <span className={`whitespace-nowrap transition-all duration-200 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                {item.label}
              </span>

              {/* Tooltip for Collapsed State (Desktop only) */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-pink-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-pink-50">
          {sidebarOpen && (
            <div className="flex items-center gap-2 text-xs text-pink-500 font-semibold mb-3 px-2 whitespace-nowrap overflow-hidden">
              <User size={14} /> {user?.username}
            </div>
          )}
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Keluar' : ''}
            className={`
              w-full flex items-center py-2 rounded-xl text-pink-400 hover:bg-pink-50 hover:text-pink-700 transition-colors
              ${sidebarOpen ? 'justify-start gap-2 px-2' : 'justify-center'}
            `}
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span className="font-medium whitespace-nowrap">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden bg-pink-50/50 relative">

        {/* HEADER RESPONSIVE */}
        <header className="bg-white/90 backdrop-blur-md border-b border-pink-100 sticky top-0 z-20 transition-all duration-300">
          <div className="px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            
            {/* KIRI: Toggle Menu & Mobile Logo */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-colors focus:ring-2 focus:ring-pink-200"
                  aria-label="Toggle Sidebar"
                >
                  <Menu size={20} />
                </button>

                {/* Logo Text (Mobile Only) */}
                <div className="flex items-center gap-2 md:hidden">
                  <Heart className="text-pink-600 fill-current w-5 h-5" />
                  <span className="font-bold text-lg text-pink-900 tracking-tight">JatimHealth</span>
                </div>
              </div>
            </div>

            {/* KANAN: Filter Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
              
              {/* Dropdown Indikator */}
              <div className="relative w-full md:w-72 lg:w-80 group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                   <Activity size={18} className="text-pink-400 group-hover:text-pink-500 transition-colors" />
                </div>
                <select
                  value={indicator}
                  onChange={(e) => setIndicator(e.target.value)}
                  className="
                    w-full pl-10 pr-10 py-2.5 rounded-xl
                    bg-pink-50/50 border border-pink-100
                    text-sm font-semibold text-pink-800
                    appearance-none outline-none
                    cursor-pointer
                    hover:bg-white hover:border-pink-300
                    focus:bg-white focus:ring-2 focus:ring-pink-200 focus:border-pink-400
                    transition-all duration-200
                    truncate
                  "
                >
                  {INDICATORS.map((ind: Indicator) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown
                    size={16}
                    className="text-pink-400 group-hover:text-pink-600 transition-colors"
                  />
                </div>
              </div>

              {/* Dropdown Tahun */}
              <div className="relative w-full sm:w-40 md:w-44 group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar size={18} className="text-pink-400 group-hover:text-pink-500 transition-colors" />
                </div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="
                    w-full pl-10 pr-10 py-2.5 rounded-xl
                    bg-pink-50/50 border border-pink-100
                    text-sm font-semibold text-pink-800
                    appearance-none outline-none
                    cursor-pointer
                    hover:bg-white hover:border-pink-300
                    focus:bg-white focus:ring-2 focus:ring-pink-200 focus:border-pink-400
                    transition-all duration-200
                  "
                >
                  {[2019, 2020, 2021, 2022, 2023, 2024].map(y => (
                    <option key={y} value={y}>
                      Tahun {y}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown
                    size={16}
                    className="text-pink-400 group-hover:text-pink-600 transition-colors"
                  />
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
          {activeTab === 'single' && currentIndicator && (
            <DashboardAnalysis
              dbData={dbData}
              selectedYear={selectedYear}
              currentIndicator={currentIndicator}
            />
          )}

          {activeTab === 'compare' && currentIndicator && (
            <RegionComparison
              dbData={dbData}
              selectedYear={selectedYear}
              currentIndicator={currentIndicator}
              region1={region1}
              setRegion1={setRegion1}
              region2={region2}
              setRegion2={setRegion2}
            />
          )}

          {activeTab === 'map' && currentIndicator && (
            <GisMap
              dbData={dbData}
              selectedYear={selectedYear}
              currentIndicator={currentIndicator}
              leafletLoaded={leafletLoaded}
            />
          )}
        </main>
      </div>
    </div>
  );
} ``