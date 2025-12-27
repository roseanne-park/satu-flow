import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Activity, Map as MapIcon, TrendingUp, Users, FileText, ArrowUpRight, ArrowDownRight, Layers, Database, Link as LinkIcon, Heart, LogOut, Lock, User, Key, RefreshCw, Calendar, PieChart as PieChartIcon } from 'lucide-react';

// --- MASTER DATA WILAYAH (38 KAB/KOTA JATIM) ---
// Digabungkan kembali ke sini agar tidak error import di preview environment
const REGIONS = [
  // --- KABUPATEN (29) ---
  { id: '3501', name: 'Kab. Pacitan', lat: -8.2035, lng: 111.1444 },
  { id: '3502', name: 'Kab. Ponorogo', lat: -7.9711, lng: 111.4920 },
  { id: '3503', name: 'Kab. Trenggalek', lat: -8.1755, lng: 111.6601 },
  { id: '3504', name: 'Kab. Tulungagung', lat: -8.1147, lng: 111.9366 },
  { id: '3505', name: 'Kab. Blitar', lat: -8.1347, lng: 112.2199 },
  { id: '3506', name: 'Kab. Kediri', lat: -7.8300, lng: 112.1500 },
  { id: '3507', name: 'Kab. Malang', lat: -8.1636, lng: 112.5714 },
  { id: '3508', name: 'Kab. Lumajang', lat: -8.1332, lng: 113.2223 },
  { id: '3509', name: 'Kab. Jember', lat: -8.1724, lng: 113.7005 },
  { id: '3510', name: 'Kab. Banyuwangi', lat: -8.2192, lng: 114.3691 },
  { id: '3511', name: 'Kab. Bondowoso', lat: -7.9392, lng: 113.8447 },
  { id: '3512', name: 'Kab. Situbondo', lat: -7.7569, lng: 114.0538 },
  { id: '3513', name: 'Kab. Probolinggo', lat: -7.8697, lng: 113.3137 },
  { id: '3514', name: 'Kab. Pasuruan', lat: -7.7470, lng: 112.8360 },
  { id: '3515', name: 'Kab. Sidoarjo', lat: -7.4478, lng: 112.7183 },
  { id: '3516', name: 'Kab. Mojokerto', lat: -7.5516, lng: 112.4897 },
  { id: '3517', name: 'Kab. Jombang', lat: -7.5457, lng: 112.2323 },
  { id: '3518', name: 'Kab. Nganjuk', lat: -7.6033, lng: 111.9011 },
  { id: '3519', name: 'Kab. Madiun', lat: -7.5996, lng: 111.6617 },
  { id: '3520', name: 'Kab. Magetan', lat: -7.6496, lng: 111.3359 },
  { id: '3521', name: 'Kab. Ngawi', lat: -7.4208, lng: 111.3965 },
  { id: '3522', name: 'Kab. Bojonegoro', lat: -7.2655, lng: 111.8384 },
  { id: '3523', name: 'Kab. Tuban', lat: -6.8953, lng: 112.0460 },
  { id: '3524', name: 'Kab. Lamongan', lat: -7.1283, lng: 112.3165 },
  { id: '3525', name: 'Kab. Gresik', lat: -7.1539, lng: 112.6561 },
  { id: '3526', name: 'Kab. Bangkalan', lat: -7.0270, lng: 112.9463 },
  { id: '3527', name: 'Kab. Sampang', lat: -7.0984, lng: 113.2687 },
  { id: '3528', name: 'Kab. Pamekasan', lat: -7.1566, lng: 113.4862 },
  { id: '3529', name: 'Kab. Sumenep', lat: -6.9961, lng: 113.9114 },

  // --- KOTA (9) ---
  { id: '3571', name: 'Kota Kediri', lat: -7.8480, lng: 112.0178 },
  { id: '3572', name: 'Kota Blitar', lat: -8.0954, lng: 112.1609 },
  { id: '3573', name: 'Kota Malang', lat: -7.9666, lng: 112.6326 },
  { id: '3574', name: 'Kota Probolinggo', lat: -7.7543, lng: 113.2159 },
  { id: '3575', name: 'Kota Pasuruan', lat: -7.6453, lng: 112.9075 },
  { id: '3576', name: 'Kota Mojokerto', lat: -7.4726, lng: 112.4381 },
  { id: '3577', name: 'Kota Madiun', lat: -7.6296, lng: 111.5176 },
  { id: '3578', name: 'Kota Surabaya', lat: -7.2575, lng: 112.7521 },
  { id: '3579', name: 'Kota Batu', lat: -7.8671, lng: 112.5239 },
];

// --- KONFIGURASI API BPS (Disesuaikan dengan permintaan) ---
const INDICATORS = [
  { 
    id: 'ind_1', 
    table_name: 'desa_yg_memiliki_sarana_kesehatan_cl', 
    name: 'Desa/Kelurahan Memiliki Sarana Kesehatan', 
    unit: 'Desa', 
    color: '#db2777', 
    categories: ['Puskesmas', 'Pustu', 'Polindes'],
    type: 'positive' 
  },
  { 
    id: 'ind_2', 
    table_name: 'kasus_penyakit_cl',
    name: 'Kasus Penyakit', 
    unit: 'Kasus', 
    color: '#e11d48', 
    categories: ['DBD', 'Diare', 'Malaria', 'TBC'],
    type: 'negative' 
  },
  { 
    id: 'ind_3', 
    table_name: 'tenaga_kesehatan_cl',
    name: 'Jumlah Tenaga Kesehatan', 
    unit: 'Orang', 
    color: '#059669', 
    categories: ['Dokter Spesialis', 'Dokter Umum', 'Perawat', 'Bidan'],
    type: 'positive' 
  },
  { 
    id: 'ind_4', 
    table_name: 'sarana_kesehatan_cl',
    name: 'Jumlah Sarana Kesehatan', 
    unit: 'Unit', 
    color: '#d97706', 
    categories: ['Rumah Sakit Umum', 'Rumah Sakit Khusus', 'Puskesmas'],
    type: 'positive' 
  },
  { 
    id: 'ind_5', 
    table_name: 'penduduk_yg_memiliki_jaminan_kesehatan_cl',
    name: 'Penduduk Memiliki Jaminan Kesehatan', 
    unit: 'Jiwa', 
    color: '#9333ea', 
    categories: ['BPJS Kesehatan', 'Jamkesda', 'Asuransi Swasta'],
    type: 'positive' 
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// --- INITIAL MOCK DATA ---
const INITIAL_MOCK_DB = {
  desa_yg_memiliki_sarana_kesehatan_cl: [],
  kasus_penyakit_cl: [],
  tenaga_kesehatan_cl: [],
  sarana_kesehatan_cl: [],
  penduduk_yg_menggunakan_jasa_kesehatan_cl: []
};

// Seed Dummy Data dengan Struktur Baru: id, id_kategori, tahun, kabupatenkota, kategori, jumlah
const seedMockDatabase = () => {
  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  
  // Tambahkan 'Jawa Timur' ke list region sementara untuk simulasi data provinsi (nanti difilter out)
  const regionsWithProv = [...REGIONS, { id: '3500', name: 'Jawa Timur', lat: 0, lng: 0 }];

  INDICATORS.forEach(ind => {
    let rowId = 1;
    regionsWithProv.forEach(region => {
      // Hilangkan "Kab. " atau "Kota " untuk kolom kabupatenkota agar lebih natural seperti data BPS
      const cleanName = region.name === 'Jawa Timur' ? 'Jawa Timur' : region.name; 

      years.forEach((year, yIdx) => {
        ind.categories.forEach((cat, cIdx) => {
          // Generate nilai random
          let baseVal = region.name === 'Jawa Timur' ? 5000 : 100; // Provinsi nilainya besar
          if (ind.type === 'negative') baseVal = region.name === 'Jawa Timur' ? 1000 : 50;
          
          const randomVal = Math.floor(baseVal + (yIdx * 10) + (Math.random() * 50));

          // FIX: Inisialisasi array jika belum ada untuk mencegah error undefined
          if (!INITIAL_MOCK_DB[ind.table_name]) {
            INITIAL_MOCK_DB[ind.table_name] = [];
          }

          INITIAL_MOCK_DB[ind.table_name].push({
            id: rowId++,
            id_kategori: cIdx + 1,
            tahun: year,
            kabupatenkota: cleanName, // Kolom kabupatenkota
            kategori: cat,            // Kolom kategori
            jumlah: randomVal         // Kolom jumlah
          });
        });
      });
    });
  });
};
seedMockDatabase();

// --- COMPONENTS ---

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (username.length > 0 && password.length > 0) {
        onLogin();
      } else {
        setError('Username dan Password wajib diisi.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-100">
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-8 text-center relative overflow-hidden">
          <div className="relative z-10 mx-auto bg-white/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-inner border border-white/30">
            <Heart className="text-white w-10 h-10 fill-current animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">JatimHealth</h2>
          <p className="text-pink-100 mt-1 text-sm font-medium tracking-wide opacity-90">Sistem Informasi Profil Kesehatan</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-pink-900 uppercase tracking-wide mb-2 ml-1">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-4 py-3 bg-pink-50/50 border border-pink-100 text-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50" placeholder="admin" />
            </div>
            <div>
              <label className="block text-xs font-bold text-pink-900 uppercase tracking-wide mb-2 ml-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-4 py-3 bg-pink-50/50 border border-pink-100 text-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50" placeholder="••••••••" />
            </div>
            {error && <div className="text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-3.5 px-4 rounded-xl hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2">
              {loading ? 'Memproses...' : <><Lock size={18} /> Masuk Dashboard</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('single'); 
  const [region1, setRegion1] = useState('Kota Surabaya'); // Nama Wilayah langsung
  const [region2, setRegion2] = useState('Kab. Malang'); 
  const [indicator, setIndicator] = useState('ind_3'); 
  const [selectedYear, setSelectedYear] = useState(2023); // Filter Tahun Baru
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [dbData, setDbData] = useState(INITIAL_MOCK_DB);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const mapRef = useRef(null);

  // --- FETCH DATA ---
  const fetchDataFromBackend = async (tableName) => {
    setIsFetching(true);
    try {
      const response = await fetch(`http://localhost:5000/api/data?table=${tableName}`);
      if (response.ok) {
        const data = await response.json();
        setDbData(prev => ({ ...prev, [tableName]: data }));
        setIsDbConnected(true);
      } else {
        console.warn('⚠️ Gunakan Mock Data.');
        setIsDbConnected(false);
      }
    } catch (err) {
      console.warn('⚠️ Offline. Gunakan Mock Data.');
      setIsDbConnected(false);
    } finally {
      setIsFetching(false);
    }
  };

  const currentIndicator = INDICATORS.find(i => i.id === indicator);

  useEffect(() => {
    if (isLoggedIn && currentIndicator) {
      fetchDataFromBackend(currentIndicator.table_name);
    }
  }, [indicator, isLoggedIn]);

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
    script.async = true;
    script.onload = () => setLeafletLoaded(true);
    document.body.appendChild(script);
  }, []);

  // --- DATA LOGIC UTAMA ---
  
  // 1. Ambil raw data dari tabel & Filter 'Jawa Timur'
  const getCleanData = (tableName) => {
    const rawData = dbData[tableName] || [];
    // Filter: Hilangkan 'Jawa Timur' dan urutkan tahun
    return rawData
      .filter(row => row.kabupatenkota !== 'Jawa Timur') 
      .sort((a, b) => a.tahun - b.tahun);
  };

  // 2. Data Trend (Line Chart) - Sum semua kategori per tahun
  const trendData = useMemo(() => {
    const cleanData = getCleanData(currentIndicator.table_name);
    // Filter by Region
    const regionData = cleanData.filter(r => r.kabupatenkota === region1);
    
    // Group by Year and Sum Jumlah
    const grouped = {};
    regionData.forEach(item => {
      if (!grouped[item.tahun]) grouped[item.tahun] = 0;
      grouped[item.tahun] += item.jumlah;
    });

    return Object.keys(grouped).map(year => ({
      tahun: year,
      jumlah: grouped[year]
    }));
  }, [region1, indicator, dbData]);

  // 3. Data Pie Chart (Komposisi Kategori) - Filter by Year & Region
  const compositionData = useMemo(() => {
    const cleanData = getCleanData(currentIndicator.table_name);
    const filtered = cleanData.filter(r => r.kabupatenkota === region1 && r.tahun === parseInt(selectedYear));
    
    // Hitung Total untuk Persentase
    const total = filtered.reduce((sum, item) => sum + item.jumlah, 0);

    return filtered.map(item => ({
      name: item.kategori,
      value: item.jumlah,
      percent: total > 0 ? ((item.jumlah / total) * 100).toFixed(1) : 0
    }));
  }, [region1, selectedYear, indicator, dbData]);

  // 4. Data Comparison (Bar Chart) - Compare 2 Regions Total
  const comparisonData = useMemo(() => {
    const cleanData = getCleanData(currentIndicator.table_name);
    // Filter data tahun terpilih untuk kedua region
    const dataR1 = cleanData.filter(r => r.kabupatenkota === region1 && r.tahun === parseInt(selectedYear));
    const dataR2 = cleanData.filter(r => r.kabupatenkota === region2 && r.tahun === parseInt(selectedYear));

    // Sum all categories
    const totalR1 = dataR1.reduce((sum, item) => sum + item.jumlah, 0);
    const totalR2 = dataR2.reduce((sum, item) => sum + item.jumlah, 0);

    return [
      { name: region1, jumlah: totalR1 },
      { name: region2, jumlah: totalR2 }
    ];
  }, [region1, region2, selectedYear, indicator, dbData]);

  // 5. Map Data - Total per Region for Selected Year
  const mapData = useMemo(() => {
    const cleanData = getCleanData(currentIndicator.table_name);
    const yearData = cleanData.filter(r => r.tahun === parseInt(selectedYear));
    
    // Group by Region (Sum categories)
    const regionSums = {};
    yearData.forEach(item => {
      if (!regionSums[item.kabupatenkota]) regionSums[item.kabupatenkota] = 0;
      regionSums[item.kabupatenkota] += item.jumlah;
    });

    let minVal = Infinity;
    let maxVal = -Infinity;

    const points = REGIONS.map(reg => {
      // Matching region name from REGIONS with kabupatenkota in DB
      const val = regionSums[reg.name] || 0;
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
      return { ...reg, value: val };
    });

    return { points, minVal, maxVal };
  }, [selectedYear, indicator, dbData]);

  // Helper Warna
  const getMarkerColor = (value, min, max, type) => {
    let ratio = (value - min) / (max - min);
    if (isNaN(ratio)) ratio = 0.5;
    if (type === 'negative') {
      if (ratio > 0.66) return '#be123c'; 
      if (ratio > 0.33) return '#f43f5e'; 
      return '#10b981'; 
    } else {
      if (ratio > 0.66) return '#db2777'; 
      if (ratio > 0.33) return '#f472b6'; 
      return '#be123c'; 
    }
  };

  // --- RENDER MAP ---
  useEffect(() => {
    if (activeTab === 'map' && leafletLoaded && window.L && isLoggedIn) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      // Zoom level sedikit lebih jauh (8 -> 7.5) agar pas di mobile
      const map = window.L.map('map-container').setView([-7.7, 112.5], 7.5);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapData.points.forEach(point => {
        const color = getMarkerColor(point.value, mapData.minVal, mapData.maxVal, currentIndicator.type);
        window.L.circleMarker([point.lat, point.lng], {
          radius: 10 + (point.value / (mapData.maxVal || 1)) * 10, // Dynamic radius
          fillColor: color, color: '#fff', weight: 1, opacity: 1, fillOpacity: 0.8
        }).addTo(map).bindPopup(`
          <div style="text-align: center;">
            <b style="color: #be123c;">${point.name}</b><br/>
            ${point.value} ${currentIndicator.unit}
          </div>
        `);
      });
      mapRef.current = map;
      return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
    }
  }, [activeTab, leafletLoaded, mapData, currentIndicator, isLoggedIn]);

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-pink-50 font-sans text-slate-800 pb-20">
      
      {/* NAVBAR: Responsif untuk Mobile */}
      <nav className="bg-pink-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-200 fill-current" />
            <div className="flex flex-col">
              <span className="font-bold text-lg md:text-xl leading-none">JatimHealth<span className="text-pink-200">Explorer</span></span>
              <span className="text-[9px] md:text-[10px] text-pink-200 font-mono hidden sm:inline">DB: result_cleansing.kesehatan</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 border ${isDbConnected ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'} hidden md:flex`}>
              <Database size={12} /> <span className="hidden lg:inline">{isDbConnected ? 'Live DB' : 'Mock DB'}</span>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-1 md:gap-2 text-xs md:text-sm bg-pink-800/50 hover:bg-pink-800 px-2 md:px-3 py-1.5 rounded-lg border border-pink-600">
              <LogOut size={14} /> <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HEADER CONTROLS: Responsif Stacked Layout di Mobile */}
      <div className="bg-white border-b border-pink-100 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between gap-3 items-center">
            
            {/* Indikator Selection */}
            <div className="w-full md:w-auto flex-1">
              <div className="relative">
                <select 
                  value={indicator}
                  onChange={(e) => setIndicator(e.target.value)}
                  className="w-full appearance-none bg-pink-50 border border-pink-200 text-pink-900 py-2 pl-3 pr-8 rounded-lg focus:ring-2 focus:ring-pink-500 font-medium text-xs md:text-sm truncate"
                >
                  {INDICATORS.map(ind => <option key={ind.id} value={ind.id}>{ind.name}</option>)}
                </select>
                <Activity size={14} className="absolute right-3 top-2.5 text-pink-400 pointer-events-none" />
              </div>
            </div>

            {/* Year Filter & Tabs */}
            <div className="w-full md:w-auto flex gap-2">
              <div className="relative w-1/3 md:w-32">
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full appearance-none bg-pink-50 border border-pink-200 text-pink-900 py-2 pl-3 pr-8 rounded-lg focus:ring-2 focus:ring-pink-500 font-medium text-xs md:text-sm"
                >
                  {[2019, 2020, 2021, 2022, 2023, 2024].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <Calendar size={14} className="absolute right-2 top-2.5 text-pink-400 pointer-events-none" />
              </div>

              <div className="flex bg-pink-50 p-1 rounded-lg border border-pink-200 w-2/3 md:w-auto overflow-x-auto">
                {['single', 'compare', 'map'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 md:flex-none px-2 md:px-3 py-1.5 text-[10px] md:text-xs font-medium rounded-md capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-pink-700 shadow-sm' : 'text-pink-400 hover:text-pink-600'}`}
                  >
                    {tab === 'single' ? 'Analisis' : tab === 'compare' ? 'Komparasi' : 'Peta'}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: ANALISIS (Trend & Komposisi) */}
        {activeTab === 'single' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Wilayah */}
            <div className="bg-white p-3 md:p-4 rounded-xl border border-pink-100 flex items-center gap-3">
              <MapIcon className="text-pink-500 w-5 h-5" />
              <select 
                value={region1} 
                onChange={(e) => setRegion1(e.target.value)}
                className="bg-transparent font-bold text-pink-900 text-base md:text-lg focus:outline-none w-full truncate"
              >
                {REGIONS.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Trend Total per Tahun */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-pink-100">
                <h3 className="font-bold text-pink-900 flex items-center gap-2 mb-4 text-sm md:text-base">
                  <TrendingUp size={16} /> Tren Total {currentIndicator.unit}
                </h3>
                {/* Tinggi Chart Responsif */}
                <div className="h-60 md:h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ left: -20, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fce7f3" />
                      <XAxis dataKey="tahun" tick={{fill: '#be123c', fontSize: 12}} />
                      <YAxis tick={{fill: '#be123c', fontSize: 12}} />
                      <Tooltip contentStyle={{ borderRadius: '8px', borderColor: '#fbcfe8', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="jumlah" stroke="#db2777" strokeWidth={3} dot={{r:4}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Komposisi Kategori (Pie Chart) */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-pink-100">
                <h3 className="font-bold text-pink-900 flex items-center gap-2 mb-4 text-sm md:text-base">
                  <PieChartIcon size={16} /> Proporsi Kategori ({selectedYear})
                </h3>
                <div className="h-60 md:h-80 flex flex-col md:flex-row items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={compositionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {compositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => `${val} ${currentIndicator.unit}`} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KOMPARASI (Bar Chart) */}
        {activeTab === 'compare' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-pink-100">
              <div>
                <label className="text-xs font-bold text-pink-400 uppercase">Wilayah A</label>
                <select value={region1} onChange={(e) => setRegion1(e.target.value)} className="w-full font-bold text-pink-900 bg-transparent py-2 border-b border-pink-200 focus:outline-none">
                  {REGIONS.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-pink-400 uppercase">Wilayah B</label>
                <select value={region2} onChange={(e) => setRegion2(e.target.value)} className="w-full font-bold text-pink-900 bg-transparent py-2 border-b border-pink-200 focus:outline-none">
                  {REGIONS.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-pink-100">
              <h3 className="font-bold text-pink-900 mb-6 text-center text-sm md:text-base">Perbandingan Total Tahun {selectedYear}</h3>
              <div className="h-64 md:h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} layout="vertical" margin={{left: 0, right: 20}}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#fce7f3" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={90} tick={{fill: '#be123c', fontWeight: 'bold', fontSize: 10}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                    <Bar dataKey="jumlah" fill="#db2777" radius={[0, 10, 10, 0]} barSize={30}>
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#db2777' : '#fb7185'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PETA */}
        {activeTab === 'map' && (
          <div className="bg-white p-2 md:p-4 rounded-xl shadow-sm border border-pink-100 h-[400px] md:h-[600px] relative overflow-hidden animate-fadeIn">
             {!leafletLoaded && <div className="absolute inset-0 flex items-center justify-center bg-pink-50 z-50 text-pink-500 text-sm">Memuat Peta...</div>}
             <div id="map-container" style={{ width: '100%', height: '100%', borderRadius: '0.75rem', zIndex: 1 }}></div>
             
             {/* Legend Map Responsif */}
             <div className="absolute bottom-4 left-4 bg-white/90 p-2 md:p-3 rounded-lg shadow border border-pink-100 z-[1000] text-[10px] md:text-xs max-w-[150px] md:max-w-none">
                <span className="font-bold text-pink-900 block mb-1">Data Tahun {selectedYear}</span>
                <div className="flex items-center gap-2"><div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-pink-600"></div> Tinggi</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-pink-400"></div> Sedang</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-rose-700"></div> Rendah</div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}